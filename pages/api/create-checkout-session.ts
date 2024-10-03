import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { OrderService } from '../../services/OrderService';
import { Order, OrderItem } from '../../types/Order';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

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

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${req.headers.origin}/cart`,
        shipping_address_collection: deliveryMethod === 'delivery' ? { allowed_countries: ['US', 'CA'] } : undefined,
      });

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
    } catch (err: any) {
      res.status(500).json({ statusCode: 500, message: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}