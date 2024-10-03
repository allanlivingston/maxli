import { buffer } from 'micro';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { OrderService } from '../../services/OrderService';
import { ShippingAddress } from '../../types/Order';
import { JsonOrderRepository } from '../../db/json/repositories/JsonOrderRepository';
import fs from 'fs/promises';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const orderService = new OrderService();
const jsonRepository = new JsonOrderRepository();
const logDir = jsonRepository.getDataDir();

async function logToFile(message: string) {
  const logPath = path.join(logDir, 'webhook-logs.txt');
  await fs.appendFile(logPath, `${new Date().toISOString()}: ${message}\n`);
  console.log('Logged to file:', logPath);
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
    } catch (err: any) {
      await logToFile(`Webhook Error: ${err.message}`);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    await logToFile(`Received event type: ${event.type}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await logToFile(`Checkout session completed: ${session.id}`);
      
      try {
        const order = await orderService.getOrderByStripeSessionId(session.id);
        if (order) {
          await logToFile(`Found order: ${order.id}`);
          
          await orderService.updateOrderStatus(order.id, 'paid');
          await logToFile('Updated order status to paid');

          if (session.shipping) {
            await logToFile(`Shipping information found: ${JSON.stringify(session.shipping)}`);
            const shippingAddress: ShippingAddress = {
              line1: session.shipping.address.line1,
              line2: session.shipping.address.line2 || undefined,
              city: session.shipping.address.city,
              state: session.shipping.address.state,
              postal_code: session.shipping.address.postal_code,
              country: session.shipping.address.country,
            };
            await logToFile(`Updating shipping address: ${JSON.stringify(shippingAddress)}`);
            const updatedOrder = await orderService.updateShippingAddress(order.id, shippingAddress);
            if (updatedOrder) {
              await logToFile(`Shipping address updated successfully: ${JSON.stringify(updatedOrder.shippingAddress)}`);
            } else {
              await logToFile('Failed to update shipping address');
            }
          } else {
            await logToFile('No shipping information in session');
          }

          await logToFile(`Order ${order.id} processing completed`);
        } else {
          await logToFile(`Order not found for session: ${session.id}`);
        }
      } catch (error) {
        await logToFile(`Error processing order: ${error}`);
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
