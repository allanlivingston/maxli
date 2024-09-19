'use client';

import React, { useState } from 'react';
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { CartItem } from "@/hooks/useCart"
import { Minus, Plus, X, Lock, Truck, Store, ShoppingCart as CartIcon } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js';
import * as RadioGroup from '@radix-ui/react-radio-group';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface ShoppingCartProps {
  items: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export function ShoppingCart({ items, removeFromCart, updateQuantity, clearCart }: ShoppingCartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [deliveryMethod, setDeliveryMethod] = useState('pickup');
  
  const subtotal = items.reduce((sum, item) => sum + (item.price * 100) * item.quantity, 0);
  const estimatedTax = subtotal * 0.08;
  const shippingCost = Math.min(15000, Math.round(subtotal * 0.1));
  const estimatedShipping = deliveryMethod === 'pickup' ? 0 : shippingCost;
  const total = subtotal + estimatedTax + estimatedShipping;

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: items.map(item => ({
            id: item.id,
            name: item.name,
            quantity: item.quantity,
            price: Math.round(item.price * 100),
          })),
          deliveryMethod,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'An error occurred during checkout');
      }

      const { id: sessionId } = await response.json();

      const stripe = await stripePromise;
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe checkout error:', error);
        }
      }
    } catch (error) {
      console.error('Error in checkout:', error);
      // Show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="bg-stone-800 p-6 rounded-lg shadow-lg text-center">
        <CartIcon className="w-16 h-16 text-stone-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-stone-300 mb-2">Your cart is empty</h2>
        <p className="text-stone-400 mb-4">Looks like you haven't added any items to your cart yet.</p>
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
                  <p className="text-sm text-stone-400">
                    ${(shippingCost / 100).toFixed(2)} (final amount calculated at checkout)
                  </p>
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
              <span>${(subtotal / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Estimated Tax</span>
              <span>${(estimatedTax / 100).toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Estimated Shipping</span>
              <span>{estimatedShipping === 0 ? 'Free' : `$${(estimatedShipping / 100).toFixed(2)}`}</span>
            </div>
            <div className="flex justify-between font-semibold text-stone-200">
              <span>Total</span>
              <span>${(total / 100).toFixed(2)}</span>
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