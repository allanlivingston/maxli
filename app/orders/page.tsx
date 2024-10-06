'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useGuestId } from '@/utils/guestId';
import { ShoppingBag } from 'lucide-react';
import { Order as OrderType } from '@/types/Order';
import Link from 'next/link';  // Add this import
import { ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";

/*
interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}
*/
/*
interface Order {
  id: string;
  total: number;
  date: string;
  status: string;
  items: OrderItem[];
}
*/

export default function OrdersPage() {
  const [orders, setOrders] = useState<OrderType[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const guestId = useGuestId();

  const fetchOrders = useCallback(async () => {
    if (!guestId) return;

    try {
      console.log('Orders component: Fetching orders for guestId:', guestId);

      const response = await fetch(`/api/get-orders?guestId=${guestId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      console.log('Orders component: Received data:', data);

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (typeof data === 'object' && data !== null) {
        // If it's a single order object, wrap it in an array
        setOrders([data]);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error('Orders component: Error fetching orders:', err);
      setError('Failed to load orders. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [guestId]);

  useEffect(() => {
    if (guestId) {
      fetchOrders();
    }
  }, [guestId, fetchOrders]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          <h1 className="text-3xl font-bold mb-6 text-emerald-300">Your Orders</h1>
          <Link href="/" className="flex items-center text-emerald-500 hover:text-emerald-400 transition duration-300">
            <ChevronLeft className="w-5 h-5 mr-1" />
            Back to Shop
          </Link>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Spinner className="h-8 w-8 text-emerald-400" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center">{error}</div>
        ) : (
          <div className="space-y-6">
            {(orders ?? []).length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-stone-600" />
                <p className="text-xl">You have not placed any orders yet.</p>
                <Link href="/" passHref>
                  <Button className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
                    Start Shopping
                  </Button>
                </Link>
              </div>
            ) : (
              orders?.map((order, index) => (
                <div key={order.privateid || index} className="bg-stone-800 shadow-lg rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-emerald-500 font-semibold">Order ID: {order.orderid}</span>
                    <span className="text-stone-400">
                      {order.created_at 
                        ? formatDate(order.created_at.toString())
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
                        <span>${(item.price ).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="text-right text-lg font-bold text-emerald-500">
                    Total: ${(order.total).toFixed(2)}
                  </div>
                </div>
              )) ?? []
            )}
          </div>
        )}
      </div>
    </div>
  );
}
