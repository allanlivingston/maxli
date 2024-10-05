import type { NextApiRequest, NextApiResponse } from 'next'
import Stripe from 'stripe'
import { OrderService } from '@/services/OrderService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const orderService = new OrderService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { session_id } = req.query;

    try {
      // First, retrieve the session from Stripe
      const session = await stripe.checkout.sessions.retrieve(session_id as string);
      console.log('Session retrieved from Stripe:', session);

      // Then, use the session ID to look up the order in our database
      const order = await orderService.getOrderByStripeSessionId(session.id);
      console.log('Order retrieved from database:', order);

      if (!order) {
        throw new Error('Order not found in database');
      }

      // If the order is found, send it back to the client
      res.status(200).json({ verified: true, order })
    } catch (error) {
      console.error('Error verifying session:', error);
      res.status(500).json({ 
        verified: false, 
        error: 'Failed to verify session', 
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
