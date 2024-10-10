'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/types/Order';
import { Button } from "@/components/ui/button";

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

  async function handleRefund(orderId: string) {
    console.log(`Refund requested for order: ${orderId}`);
    // Implement refund logic here
  }

  if (loading) return <div className="text-stone-300">Loading orders...</div>;

  return (
    <div className="bg-stone-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-emerald-300">Admin Dashboard</h1>
        <div className="bg-stone-800 rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto max-h-[calc(100vh-200px)]"> {/* Set a max height */}
            <table className="w-full text-left border-collapse">
              <thead className="bg-stone-700 sticky top-0 z-10"> {/* Add sticky positioning */}
                <tr>
                  <th className="p-3 text-emerald-300">Order ID</th>
                  <th className="p-3 text-emerald-300">Customer ID</th>
                  <th className="p-3 text-emerald-300">Date</th>
                  <th className="p-3 text-emerald-300">Status</th>
                  <th className="p-3 text-emerald-300">Items</th>
                  <th className="p-3 text-emerald-300">Total</th>
                  <th className="p-3 text-emerald-300">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.privateid} className="border-b border-stone-700 hover:bg-stone-700 transition duration-150">
                    <td className="p-3 text-stone-300">{order.orderid}</td>
                    <td className="p-3 text-stone-300">{order.userid}</td>
                    <td className="p-3 text-stone-400">
                      {order.created_at
                        ? new Date(order.created_at).toLocaleString()
                        : 'N/A'}
                    </td>
                    <td className="p-3">
                      <span className={`font-semibold ${order.status === 'paid' ? 'text-emerald-400' : 'text-yellow-400'}`}>
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </span>
                    </td>
                    <td className="p-3 text-stone-300">
                      <ul className="list-disc list-inside">
                        {order.items.map((item, index) => (
                          <li key={index}>{item.name} x{item.quantity}</li>
                        ))}
                      </ul>
                    </td>
                    <td className="p-3 text-emerald-400 font-bold">${order.total.toFixed(2)}</td>
                    <td className="p-3">
                      {order.status === 'paid' && (
                        <Button 
                          onClick={() => order.privateid && handleRefund(order.privateid)}
                          className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                        >
                          Refund
                        </Button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
