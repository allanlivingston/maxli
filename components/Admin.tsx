import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Order } from '../types/Order';

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching orders:', error);
    else setOrders(data || []);
    setLoading(false);
  }

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <table className="w-full bg-stone-800 rounded-lg overflow-hidden">
        <thead className="bg-stone-700">
          <tr>
            <th className="p-2 text-left">Order ID</th>
            <th className="p-2 text-left">Status</th>
            <th className="p-2 text-left">Total</th>
            <th className="p-2 text-left">Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order.privateid} className="border-t border-stone-700">
              <td className="p-2">{order.orderid}</td>
              <td className="p-2">{order.status}</td>
              <td className="p-2">${order.total.toFixed(2)}</td>
              <td className="p-2">{new Date(order.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
