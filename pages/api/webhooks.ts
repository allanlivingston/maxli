import { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';
import { buffer } from 'micro';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

async function validateShippingAddress(address: Stripe.Address): Promise<boolean> {
  const excludedStates = ['AK', 'HI'];
  return !excludedStates.includes(address.state!);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err: any) {
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      if (session.shipping_details && session.shipping_details.address) {
        const isValidAddress = await validateShippingAddress(session.shipping_details.address);
        
        if (!isValidAddress) {
          console.log('Invalid shipping address. Cancelling order and refunding...');
          // Here you would implement the logic to cancel the order and refund the customer
          // For example:
          // await stripe.refunds.create({ payment_intent: session.payment_intent as string });
          // await cancelOrder(session.id); // You would need to implement this function
        } else {
          console.log('Valid shipping address. Processing order...');
          // Here you would implement the logic to process the order
          // For example:
          // await processOrder(session);
        }
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
