import { buffer } from 'micro';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { OrderService } from '../../services/OrderService';
// Remove the unused import:
// import { ShippingAddress } from '../../types/Order';
import { JsonOrderRepository } from '../../db/json/repositories/JsonOrderRepository';
import fs from 'fs/promises';
import path from 'path';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
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
    await logToFile('Webhook received');
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
      await logToFile(`Event constructed: ${event.type}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      await logToFile(`Webhook Error: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      await logToFile(`Checkout completed: ${session.id}`);

      try {
        const order = await orderService.getOrderByStripeSessionId(session.id);
        if (order) {
          await logToFile(`Order found: ${order.id}`);
          // Update order status
          try {
            await orderService.updateOrderStatus(order.id, 'paid');
            await logToFile(`Order status updated to paid for order: ${order.id}`);
          } catch (updateError) {
            await logToFile(`Error updating order status: ${updateError instanceof Error ? updateError.message : 'Unknown error'}`);
          }

          // Update shipping address if available
          await logToFile(`Session customer details: ${JSON.stringify(session.customer_details)}`);
          if (session.customer_details?.address) {
            const shippingAddress = {
              line1: session.customer_details.address.line1 || '',
              line2: session.customer_details.address.line2 || undefined,
              city: session.customer_details.address.city || '',
              state: session.customer_details.address.state || '',
              postal_code: session.customer_details.address.postal_code || '',
              country: session.customer_details.address.country || '',
            };
            await orderService.updateShippingAddress(order.id, shippingAddress);
            await logToFile(`Shipping address updated for order: ${order.id}`);
          } else {
            await logToFile(`No shipping information for order: ${order.id}`);
          }

          await logToFile(`Order ${order.id} updated successfully`);
        } else {
          await logToFile(`Order not found for session: ${session.id}`);
        }
      } catch (error) {
        await logToFile(`Error processing order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
