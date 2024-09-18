import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { session_id } = req.query;

    try {
      const session = await stripe.checkout.sessions.retrieve(session_id as string);
      if (session.payment_status === 'paid') {
        res.status(200).json({ verified: true });
      } else {
        res.status(400).json({ verified: false });
      }
    } catch (err) {
      console.error('Error verifying session:', err);
      res.status(500).json({ error: 'Failed to verify session' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
