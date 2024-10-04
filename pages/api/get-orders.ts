import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { OrderService } from '../../services/OrderService';

// Load environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceRoleKey) {
  throw new Error('Missing Supabase environment variables');
}

// Use the service role key for admin operations
const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey);

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    try {
      const { guestId } = req.query;
      
      if (!guestId || typeof guestId !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing guestId' });
      }

      console.log('API: Fetching orders for guestId:', guestId);

      const orderService = new OrderService(supabaseAdmin);
      const orders = await orderService.getOrdersByUserId(guestId);
      console.log(`API: Found ${orders.length} orders for guestId:`, guestId);
      res.status(200).json(orders);
    } catch (error) {
      console.error('API: Error fetching orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  } else {
    res.setHeader('Allow', 'GET');
    res.status(405).end('Method Not Allowed');
  }
}
