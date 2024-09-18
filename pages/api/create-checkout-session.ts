import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { items } = req.body;

      // Log received items
      console.log('Received items:', JSON.stringify(items, null, 2));

      // Ensure we have a valid origin
      const origin = req.headers.origin || 'http://localhost:3001';
      console.log('Origin:', origin);

      const success_url = `${origin}/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancel_url = `${origin}/cart`;

      console.log('Success URL:', success_url);
      console.log('Cancel URL:', cancel_url);

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: items.map((item: any) => ({
          price_data: {
            currency: 'usd',
            product_data: {
              name: item.name,
              images: item.imagePath ? [item.imagePath] : undefined,
            },
            unit_amount: Math.round(item.price * 100),
          },
          quantity: item.quantity,
        })),
        mode: 'payment',
        success_url,
        cancel_url,
      });

      res.status(200).json({ sessionId: session.id });
    } catch (err: any) {
      console.error('Stripe API error:', err);
      res.status(500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}