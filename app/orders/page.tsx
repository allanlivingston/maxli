'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ShoppingBag, ChevronLeft } from 'lucide-react';

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  amount: number;
  date: string;
  status: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/get-orders')
      .then(response => response.json())
      .then(data => {
        setOrders(data);
        setIsLoading(false);
      })
      .catch(err => {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please try again later.');
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-900">
        <div className="text-stone-300 text-xl">Loading orders...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-900">
        <div className="p-8 bg-stone-800 shadow-lg rounded-lg max-w-md w-full">
          <h1 className="text-2xl font-bold mb-4 text-red-500 text-center">Error</h1>
          <p className="mb-6 text-stone-300 text-center">{error}</p>
          <Link href="/" className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-900 text-stone-300">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-emerald-500">Your Orders</h1>
          <Link href="/" className="flex items-center text-emerald-500 hover:text-emerald-400 transition duration-300">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Shop
          </Link>
        </div>
        
        {orders.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-stone-600" />
            <p className="text-xl">You haven't placed any orders yet.</p>
            <Link href="/" className="mt-4 inline-block bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-8">
            {orders.map(order => (
              <div key={order.id} className="bg-stone-800 shadow-lg rounded-lg p-6">
                <div className="flex justify-between items-center mb-4">
                  <span className="text-emerald-500 font-semibold">Order ID: {order.id}</span>
                  <span className="text-stone-400">{order.date}</span>
                </div>
                <div className="mb-4">
                  <span className="text-stone-300">Status: </span>
                  <span className={`font-semibold ${order.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </span>
                </div>
                <div className="border-t border-stone-700 pt-4 mb-4">
                  {order.items.map((item, index) => (
                    <div key={index} className="flex justify-between text-stone-300 mb-2">
                      <span>{item.name} x{item.quantity}</span>
                      <span>${(item.price / 100).toFixed(2)}</span>
                    </div>
                  ))}
                </div>
                <div className="text-right text-lg font-bold text-emerald-500">
                  Total: ${(order.amount / 100).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
