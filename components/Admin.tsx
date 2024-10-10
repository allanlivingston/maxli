'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Order } from '@/types/Order';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"; // Make sure you have this component
import { ExternalLink } from 'lucide-react'; // Import the ExternalLink icon

export default function Admin() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

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

  const filteredOrders = orders.filter(order => {
    const orderValues = Object.values(order).filter(value => typeof value !== 'object');
    const orderMatch = orderValues.some(value =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const itemsMatch = order.items.some(item =>
      Object.values(item).some(value =>
        value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
      )
    );

    return orderMatch || itemsMatch;
  });

  if (loading) return <div className="text-stone-300">Loading orders...</div>;

  return (
    <div className="bg-stone-900 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-emerald-300">Admin Dashboard</h1>
        
        {/* Add search input */}
        <Input
          type="text"
          placeholder="Search orders (including items)..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4 p-2 border rounded bg-stone-800 text-stone-300"
        />

        {/* Add record count */}
        <p className="text-stone-300 mb-2">
          Displaying {filteredOrders.length} of {orders.length} orders
        </p>

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
                {filteredOrders.map((order) => (
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
                      <div className="flex space-x-2">
                        {order.status === 'paid' && (
                          <Button 
                            onClick={() => order.privateid && handleRefund(order.privateid)}
                            className="bg-red-600 hover:bg-red-700 text-white text-sm px-3 py-1 rounded"
                          >
                            Refund
                          </Button>
                        )}
                        {order.stripeReceiptUrl && (
                          <a 
                            href={order.stripeReceiptUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="inline-flex items-center"
                          >
                            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm px-3 py-1 rounded">
                              Receipt <ExternalLink className="ml-1" />
                            </Button>
                          </a>
                        )}
                      </div>
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
