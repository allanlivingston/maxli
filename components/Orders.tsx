'use client';

// eslint-disable-next-line @typescript-eslint/no-explicit-any

import React, { useEffect, useState, useCallback } from 'react';
import { useGuestId } from '../utils/guestId';
import { ShoppingBag, ExternalLink } from 'lucide-react';
import { Order as OrderType } from '../types/Order'; // Rename the imported type
import { Button } from "@/components/ui/button";

// Define a basic type for order items
type OrderItem = {
  price_data?: {
    product_data?: {
      name?: string;
    };
    unit_amount?: number;
  };
  name?: string;
  quantity?: number;
  price?: number;
};

// Add this type definition near the top of your file, after other type definitions
type AddressObject = {
  line1: string;
  city: string;
  state: string;
  postal_code: string;
  country: string;
};

export default function Orders() {
  const [orders, setOrders] = useState<OrderType[] | null>(null); // Use the renamed type here
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
        throw new Error('Unexpected data format received');
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

  const getItemName = (item: OrderItem | string): string => {
    if (typeof item === 'string') return item;
    if (item.price_data?.product_data?.name) return item.price_data.product_data.name;
    if (item.name) return item.name;
    return 'Unknown Item';
  };

  const getItemQuantity = (item: OrderItem): number => {
    return item.quantity || 1;
  };

  const getItemPrice = (item: OrderItem): number => {
    if (item.price_data?.unit_amount) return item.price_data.unit_amount / 100;
    if (item.price) return item.price;
    return 0;
  };

  const renderOrderItems = (items: OrderItem[] | Record<string, number>) => {
    if (Array.isArray(items)) {
      return items.map((item, index) => (
        <div key={index} className="flex justify-between text-stone-300 mb-2">
          <span>{getItemName(item)} x{getItemQuantity(item)}</span>
          <span>${(getItemPrice(item) * getItemQuantity(item)).toFixed(2)}</span>
        </div>
      ));
    } else if (typeof items === 'object') {
      return Object.entries(items).map(([key, value], index) => (
        <div key={index} className="flex justify-between text-stone-300 mb-2">
          <span>{key} x{typeof value === 'number' ? value : 1}</span>
          <span>Price not available</span>
        </div>
      ));
    }
    return <div className="text-stone-300 mb-2">No items available</div>;
  };

  const formatAddress = (address: string | AddressObject): string => {
    if (typeof address === 'string') return address;
    if (typeof address === 'object') {
      const { line1, city, state, postal_code, country } = address;
      return `${line1}, ${city}, ${state} ${postal_code}, ${country}`;
    }
    return 'Address not available';
  };

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  if (isLoading) {
    return <div className="text-stone-300">Loading orders...</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <ShoppingBag className="w-16 h-16 mx-auto mb-4 text-stone-600" />
        <p className="text-xl text-stone-300">You have not placed any orders yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {Array.isArray(orders) ? (
        orders.map((order, index) => (
          <div key={order.privateid || index} className="bg-stone-800 shadow-lg rounded-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <span className="text-emerald-500 font-semibold">Order ID: {order.orderid || 'N/A'}</span>
              <span className="text-stone-400">
                {order.created_at 
                  ? new Date(order.created_at).toLocaleString()
                  : 'Date not available'}
              </span>
            </div>
            <div className="mb-4">
              <span className="text-stone-300">Status: </span>
              <span className={`font-semibold ${order.status === 'paid' ? 'text-green-500' : 'text-yellow-500'}`}>
                {order.status ? order.status.charAt(0).toUpperCase() + order.status.slice(1) : 'Unknown'}
              </span>
            </div>
            {order.shippingAddress && order.shippingCost > 0 && (
              <div className="mb-4">
                <span className="text-stone-300">Shipping Address: </span>
                <span className="text-stone-400">{formatAddress(order.shippingAddress)}</span>
              </div>
            )}
            <div className="border-t border-stone-700 pt-4 mb-4">
              {renderOrderItems(order.items)}
            </div>
            {order.shippingCost > 0 && (
              <div className="flex justify-between text-stone-300 mb-2">
                <span>Shipping</span>
                <span>${order.shippingCost.toFixed(2)}</span>
              </div>
            )}
            <div className="text-right text-lg font-bold text-emerald-500">
              Total: ${(order.total || 0).toFixed(2)}
            </div>
            {order.stripeReceiptUrl && (
              <div className="mt-4">
                <a 
                  href={order.stripeReceiptUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center"
                >
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    View Receipt <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </a>
              </div>
            )}
          </div>
        ))
      ) : (
        <div className="text-stone-300">No orders available</div>
      )}
    </div>
  );
}
