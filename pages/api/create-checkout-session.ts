import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { OrderService } from '../../services/OrderService';
import { Order, OrderItem, OrderStatus } from '../../types/Order';
import { getOrCreateGuestId } from '../../utils/guestId';

const stripe = process.env.STRIPE_SECRET_KEY
  ? new Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

const orderService = new OrderService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      console.log('Received checkout request:', req.body);

      const { items, deliveryMethod, shippingCost } = req.body;
      const guestId = getOrCreateGuestId(req, res);  // Pass both req and res

      if (!guestId) {
        return res.status(400).json({ error: 'guestId is required' });
      }

      const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] = items.map((item: OrderItem) => ({
        price_data: {
          currency: 'usd',
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(item.price * 100), // Convert to cents
        },
        quantity: item.quantity,
      }));

      if (shippingCost > 0) {
        lineItems.push({
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Shipping',
            },
            unit_amount: shippingCost * 100, // Convert to cents
          },
          quantity: 1,
        });
      }

      const sessionOptions: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
      };

      if (deliveryMethod === 'delivery') {
        sessionOptions.shipping_address_collection = { allowed_countries: ['US', 'CA'] };
        sessionOptions.shipping_options = [
          {
            shipping_rate_data: {
              type: 'fixed_amount',
              fixed_amount: { amount: shippingCost * 100, currency: 'usd' },
              display_name: 'Standard Shipping',
              delivery_estimate: {
                minimum: { unit: 'business_day', value: 3 },
                maximum: { unit: 'business_day', value: 5 },
              },
            },
          },
        ];
      }

      const session = await stripe.checkout.sessions.create(sessionOptions);

      console.log('Stripe session created:', JSON.stringify(session, null, 2));

      // Ensure we're correctly accessing the amount_total
      const orderTotal = session.amount_total 
        ? (session.amount_total / 100).toFixed(2) 
        : '0.00';

      console.log('Calculated orderTotal:', orderTotal);

      const order: Omit<Order, 'id'> = {
        userid: guestId, // Use lowercase 'userid' to match the database column
        stripeSessionId: session.id,
        items: items, // Use the original items from the request body instead of lineItems
        total: parseFloat(orderTotal),
        status: 'pending' as OrderStatus,
        shippingAddress: undefined,
        // created_at is now optional, so we don't need to include it here
      };

      console.log('Attempting to create order:', JSON.stringify(order, null, 2));

      try {
        const createdOrder = await orderService.createOrder(order);
        console.log('Order created successfully:', JSON.stringify(createdOrder, null, 2));
        res.status(200).json({ id: session.id, orderId: createdOrder.id });
      } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
      }
    } catch (error) {
      // Detailed error logging
      console.error('Detailed error in create-checkout-session:', error);
      
      // Send a more informative error response
      res.status(500).json({ 
        message: 'An error occurred during checkout',
        error: error instanceof Error ? error.message : String(error)
      });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}