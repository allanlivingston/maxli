'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag } from 'lucide-react';
import { Order as OrderType } from '../types/Order'; // Rename the imported type

// Remove the unused OrderItem interface
// interface OrderItem {
//   name: string;
//   quantity: number;
//   price: number;
// }

export default function Orders() {
  const [orders, setOrders] = useState<OrderType[]>([]); // Use the renamed type here
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
    return <div className="text-stone-300 text-xl">Loading orders...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-stone-600" />
        <p className="text-xl text-stone-300">You have not placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {orders.map(order => (
        <div key={order.id} className="bg-stone-800 shadow-lg rounded-lg p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-emerald-500 font-semibold">Order ID: {order.id}</span>
            <span className="text-stone-400">
              {order.created_at 
                ? new Date(order.created_at).toLocaleString()
                : 'Date not available'}
            </span>
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
            Total: ${(order.total / 100).toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
