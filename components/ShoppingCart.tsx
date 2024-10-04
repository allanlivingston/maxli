'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { CartItem } from "@/hooks/useCart"
import { Minus, Plus, X, Lock, Truck, Store, ShoppingCart as CartIcon } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js';
import { useGuestId } from '../utils/guestId';
// Remove the unused import:
// import * as RadioGroup from '@radix-ui/react-radio-group';

//import { useCart } from '../contexts/CartContext'; // Make sure you have this import

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

// Function to get Stripe instance
const getStripe = () => {
  return stripePromise;
};

interface ShoppingCartProps {
  items: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export function ShoppingCart({ items, removeFromCart, updateQuantity, clearCart }: ShoppingCartProps) {
  const [isLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  const guestId = useGuestId();
  
  // Use guestId when it's available
  useEffect(() => {
    if (guestId) {
      // Perform any operations that require guestId
    }
  }, [guestId]);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shippingCost = deliveryMethod === 'delivery' ? 100 : 0;
  const total = subtotal + shippingCost;

  const handleCheckout = async () => {
    if (!guestId) {
      console.error('Guest ID not available');
      return;
    }

    console.log("Initiating checkout with items:", items);
    console.log("Delivery method:", deliveryMethod);
    console.log("Shipping cost:", shippingCost);

    const response = await fetch('/api/create-checkout-session', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items,
        deliveryMethod,
        shippingCost,
        guestId, // Include the guestId in the request
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const checkoutSession = await response.json();
    console.log("Checkout session response:", checkoutSession);

    if (!checkoutSession || !checkoutSession.id) {
      throw new Error('Invalid checkout session response');
    }

    const { id: sessionId, orderId } = checkoutSession;
    console.log("Extracted sessionId:", sessionId, "orderId:", orderId);

    if (!sessionId) {
      throw new Error('No session ID returned from server');
    }

    // Redirect to Stripe Checkout
    const stripe = await getStripe();
    if (!stripe) {
      throw new Error('Failed to initialize Stripe');
    }
    const { error } = await stripe.redirectToCheckout({ sessionId });

    if (error) {
      console.error('Stripe redirect error:', error);
      throw new Error(error.message);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-stone-800 p-6 rounded-lg shadow-lg text-center">
        <CartIcon className="w-16 h-16 text-stone-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-stone-300 mb-2">Your cart is empty</h2>
        <p className="text-stone-400 mb-4">Looks like you haven&apos;t added any items to your cart yet.</p>
      </div>
    );
  }

  return (
    <div className="bg-stone-800 p-6 rounded-lg shadow-lg">
      {items.map((item) => (
        <div key={item.id} className="flex items-center justify-between py-2 border-b border-stone-700">
          <div className="flex items-center space-x-4">
            <Image src={item.imagePath} alt={item.name} width={50} height={50} className="rounded" />
            <div>
              <p className="text-stone-200">{item.name}</p>
              <p className="text-stone-400">${item.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-stone-200">{item.quantity}</span>
            <Button onClick={() => updateQuantity(item.id, item.quantity + 1)}>
              <Plus className="h-4 w-4" />
            </Button>
            <Button onClick={() => removeFromCart(item.id)} variant="destructive">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
      
      <div className="mt-8 space-y-6">
        <div className="border-t border-stone-700 pt-6">
          <h3 className="text-lg font-semibold text-stone-200 mb-4">Delivery Options</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-stone-700 hover:bg-stone-600 transition-colors">
              <input
                type="radio"
                id="delivery"
                name="deliveryMethod"
                value="delivery"
                checked={deliveryMethod === 'delivery'}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 focus:ring-2"
              />
              <label htmlFor="delivery" className="flex-1 flex items-center text-stone-300 cursor-pointer">
                <Truck className="w-5 h-5 mr-2 text-emerald-500" />
                <div>
                  <p className="font-medium">Home Delivery</p>
                  <p className="text-sm text-stone-400">$100.00</p>
                </div>
              </label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg bg-stone-700 hover:bg-stone-600 transition-colors">
              <input
                type="radio"
                id="pickup"
                name="deliveryMethod"
                value="pickup"
                checked={deliveryMethod === 'pickup'}
                onChange={(e) => setDeliveryMethod(e.target.value)}
                className="w-4 h-4 text-emerald-600 bg-gray-100 border-gray-300 focus:ring-emerald-500 focus:ring-2"
              />
              <label htmlFor="pickup" className="flex-1 flex items-center text-stone-300 cursor-pointer">
                <Store className="w-5 h-5 mr-2 text-emerald-500" />
                <div>
                  <p className="font-medium">Pick up at our Palo Alto, CA location</p>
                  <p className="text-sm text-stone-400">Free pickup</p>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <div className="border-t border-stone-700 pt-6">
          <h3 className="text-lg font-semibold text-stone-200 mb-4">Order Summary</h3>
          <div className="space-y-2">
            <div className="flex justify-between text-stone-300">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-stone-200">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
        <Button 
          className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
          onClick={handleCheckout}
          disabled={isLoading}
        >
          {isLoading ? 'Processing...' : 'Proceed to Checkout'}
          <Lock className="ml-2 h-4 w-4" />
        </Button>
        
        <Button 
          variant="outline" 
          className="w-full text-stone-300 hover:bg-stone-700 mt-2"
          onClick={clearCart}
        >
          Clear Cart
        </Button>
      </div>
    </div>
  );
}