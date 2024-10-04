import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { OrderService } from '../../services/OrderService';
import { Order, OrderItem } from '../../types/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const orderService = new OrderService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { items, deliveryMethod, shippingCost } = req.body;

      const lineItems = items.map((item: OrderItem) => ({
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

      const orderTotal = (session.amount_total || 0) / 100; // Convert back to dollars

      const order: Omit<Order, 'id' | 'createdAt'> = {
        stripeSessionId: session.id,
        userId: 'user_id_here', // You'll need to implement user authentication
        items: items,
        total: orderTotal,
        status: 'pending',
        // We'll update the shipping address after payment completion
        shippingAddress: undefined,
      };

      const createdOrder = await orderService.createOrder(order);

      res.status(200).json({ id: session.id, orderId: createdOrder.id });
    } catch (error: unknown) {
      if (error instanceof Error) {
        res.status(500).json({ statusCode: 500, message: error.message });
      } else {
        res.status(500).json({ statusCode: 500, message: 'An unknown error occurred' });
      }
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}