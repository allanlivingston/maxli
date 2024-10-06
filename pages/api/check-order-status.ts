import { NextApiRequest, NextApiResponse } from 'next';
import { OrderService } from '../../services/OrderService';

const orderService = new OrderService();

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const { session_id } = req.query;

    if (!session_id || typeof session_id !== 'string') {
      return res.status(400).json({ error: 'Invalid session ID' });
    }

    try {
      const order = await orderService.getOrderByStripeSessionId(session_id);
      if (order) {
        res.status(200).json({ order });
      } else {
        res.status(404).json({ error: 'Order not found' });
      }
    } catch (error) {
      console.error('Error checking order status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
