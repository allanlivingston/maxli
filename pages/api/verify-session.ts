import type { NextApiRequest, NextApiResponse } from 'next'
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { session_id } = req.query;

    if (!session_id) {
      res.status(400).json({ error: 'Missing session_id parameter' });
      return;
    }

    try {
      const order = await orderService.getOrderByStripeSessionId(session_id as string);
      
      if (!order) {
        console.log('No order found for session ID:', session_id);
        res.status(404).json({ verified: false, error: 'Order not found' });
        return;
      }

      console.log('Order found:', order);

      res.status(200).json({ verified: true, order });
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
