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

    console.log('Webhook signature:', sig);

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(buf.toString(), sig, webhookSecret);
      console.log(`Event constructed: ${event.type}`);
    } catch (err: unknown) {
      console.error(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      res.status(400).send(`Webhook Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      return;
    }

    console.log(`Webhook Event type: ${event.type}`);
    console.log(`Webhook Event data:`, JSON.stringify(event.data.object, null, 2));

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout completed: ${session.id}`);

      try {
        console.log('Updating order after Stripe return...');
        const updatedOrder = await orderService.updateOrderAfterStripeReturn(session.id);
        console.log('Updated order:', JSON.stringify(updatedOrder, null, 2));

        if (updatedOrder) {
          console.log(`Order ${updatedOrder.privateid} updated after Stripe return`);
          
          if (updatedOrder.status !== 'paid') {
            if (updatedOrder.privateid) {
              console.log(`Updating order status to paid for order: ${updatedOrder.privateid}`);
              const statusUpdateResult = await orderService.updateOrderStatus(updatedOrder.privateid, 'paid');
              console.log('Status update result:', JSON.stringify(statusUpdateResult, null, 2));
            } else {
              console.error('Order ID is undefined, cannot update status');
            }
          } else {
            console.log(`Order ${updatedOrder.privateid} is already in paid status`);
          }

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
            if (updatedOrder.privateid) {
              console.log(`Updating shipping address for order: ${updatedOrder.privateid}`);
              const addressUpdateResult = await orderService.updateShippingAddress(updatedOrder.privateid, shippingAddress);
              console.log('Address update result:', addressUpdateResult);
            } else {
              console.error('Order ID is undefined, cannot update shipping address');
            }
          }

          console.log(`Order processing completed`);
        } else {
          console.log(`No order found for session ${session.id}`);
        }
      } catch (error) {
        console.error(`Error processing order: ${error instanceof Error ? error.message : 'Unknown error'}`);
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
      }
    } else if (event.type === 'checkout.session.expired') {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Checkout session expired: ${session.id}`);

      try {
        const order = await orderService.getOrderByStripeSessionId(session.id);
        if (order && order.privateid) {
          await orderService.updateOrderStatus(order.privateid, 'cancelled');
          console.log(`Order ${order.privateid} marked as cancelled due to expired session`);
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
