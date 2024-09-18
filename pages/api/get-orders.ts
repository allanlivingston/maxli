import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      // In a real application, you'd fetch orders for the authenticated user
      // For this example, we'll fetch recent orders
      const checkoutSessions = await stripe.checkout.sessions.list({
        limit: 10,
        expand: ['data.line_items'],
      });

      const orders = checkoutSessions.data.map(session => ({
        id: session.id,
        amount: session.amount_total,
        date: new Date(session.created * 1000).toLocaleDateString(),
        status: session.payment_status,
        items: session.line_items?.data.map(item => ({
          name: item.description,
          quantity: item.quantity,
          price: item.price?.unit_amount,
        })),
      }));

      res.status(200).json(orders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
