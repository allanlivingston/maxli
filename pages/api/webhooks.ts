import { buffer } from 'micro';
import Stripe from 'stripe';
import { NextApiRequest, NextApiResponse } from 'next';
import { OrderService } from '../../services/OrderService';
// Remove the unused import:
// import { ShippingAddress } from '../../types/Order';


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export const config = {
  api: {
    bodyParser: false,
  },
};

const orderService = new OrderService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    console.log('Webhook received');
    const buf = await buffer(req);
    const sig = req.headers['stripe-signature']!;

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
      console.log(`Event constructed: ${event.type}`);
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      console.error(`Webhook Error: ${errorMessage}`);
      res.status(400).send(`Webhook Error: ${errorMessage}`);
      return;
    }

    console.log(`Webhook Event type: ${event.type}, ${event.data.object}`);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout completed: ${session.id}`);

      try {
        const updatedOrder = await orderService.updateOrderAfterStripeReturn(session.id);
        if (updatedOrder) {
          console.log(`Order ${updatedOrder.id} updated after Stripe return`);
          
          // Only update to 'paid' if it's not already in that state
          if (updatedOrder.status !== 'paid') {
            if (updatedOrder.id) {
              await orderService.updateOrderStatus(updatedOrder.id, 'paid');
              console.log(`Order status updated to paid for order: ${updatedOrder.id}`);
            } else {
              console.error('Order ID is undefined, cannot update status');
            }
          }

          // Update shipping address if available
          console.log(`Session customer details: ${JSON.stringify(session.customer_details)}`);
          if (session.customer_details?.address) {
            const shippingAddress = {
              line1: session.customer_details.address.line1 || '',
              line2: session.customer_details.address.line2 || undefined,
              city: session.customer_details.address.city || '',
              state: session.customer_details.address.state || '',
              postal_code: session.customer_details.address.postal_code || '',
              country: session.customer_details.address.country || '',
            };
            if (updatedOrder.id) {
              await orderService.updateShippingAddress(updatedOrder.id, shippingAddress);
              console.log(`Shipping address updated for order: ${updatedOrder.id}`);
            } else {
              console.error('Order ID is undefined, cannot update shipping address');
            }
          }

          console.log(`Order updated successfully`);
        } else {
          console.log(`No order found for session`);
        }
      } catch (error) {
        console.error(`Error processing order: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout session expired: ${session.id}`);

      try {
        const order = await orderService.getOrderByStripeSessionId(session.id);
        if (order && order.id) {
          await orderService.updateOrderStatus(order.id, 'cancelled');
          console.log(`Order ${order.id} marked as cancelled due to expired session`);
        } else if (order) {
          console.error('Order found but ID is undefined, cannot update status');
        } else {
          console.log('No order found for expired session');
        }
      } catch (error) {
        console.error(`Error processing expired session: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    }

    res.json({ received: true });
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}
