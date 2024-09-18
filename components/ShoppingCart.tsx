import React, { useState } from 'react';
import Image from 'next/image'
import { Button } from "@/components/ui/button"
import { CartItem } from "@/hooks/useCart"
import { Minus, Plus, X, Lock } from 'lucide-react'
import { loadStripe } from '@stripe/stripe-js';
import { MiniCart } from '@/components/MiniCart';

// Make sure to replace with your actual Stripe publishable key
const stripePublishableKey='pk_test_51Q0C19GwQyMz70J53FOlg32lxuQEbugtEltOB9E9YxiX6F6ly8JtGRp2pH79yTMxXM3BhHvAjKUfqCJWZjI3Kjw200aLwnfiAQ'
const stripePromise = loadStripe(stripePublishableKey /*process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!*/);

interface ShoppingCartProps {
  items: CartItem[];
  removeFromCart: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
}

export function ShoppingCart({ items, removeFromCart, updateQuantity, clearCart }: ShoppingCartProps) {
  const [isLoading, setIsLoading] = useState(false);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const estimatedTax = subtotal * 0.08; // 8% tax rate, adjust as needed
  const estimatedShipping = subtotal > 500 ? 0 : 15; // Free shipping over $500
  const total = subtotal + estimatedTax + estimatedShipping;

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      console.log('Sending items to checkout:', items); // Log items being sent

      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Server error:', errorData);
        throw new Error(`Failed to create checkout session: ${errorData.error || response.statusText}`);
      }

      const { sessionId } = await response.json();
      
      if (!sessionId) {
        throw new Error('No session ID returned from the server');
      }

      const stripe = await stripePromise;
      
      if (stripe) {
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          console.error('Stripe checkout error:', error);
          throw error;
        }
      } else {
        throw new Error('Failed to load Stripe');
      }
    } catch (error) {
      console.error('Error creating checkout session:', error);
      // Here you might want to show an error message to the user
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-stone-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-emerald-300">Your Cart</h2>
      {items.length === 0 ? (
        <p className="text-stone-300">Your cart is empty.</p>
      ) : (
        <>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {items.map(item => (
              <div key={item.id} className="flex items-center space-x-4 bg-stone-700 p-4 rounded-lg">
                <div className="flex-shrink-0 w-16 h-16 relative">
                  <Image 
                    src={item.imagePath}
                    alt={item.name}
                    width={64}
                    height={64}
                    className="rounded-md object-cover"
                  />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-emerald-300">{item.name}</h3>
                  <p className="text-stone-300">${item.price.toFixed(2)} - {item.capacity}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="w-8 text-center">{item.quantity}</span>
                  <Button 
                    variant="outline" 
                    size="icon"
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="text-right w-24">
                  <p className="font-semibold text-emerald-300">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
                <Button 
                  variant="ghost" 
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <X className="h-5 w-5" />
                </Button>
              </div>
            ))}
          </div>
          <div className="mt-8 space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span>Subtotal:</span>
              <span className="text-emerald-300">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-stone-400">
              <span>Estimated Tax:</span>
              <span>${estimatedTax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-sm text-stone-400">
              <span>Estimated Shipping:</span>
              <span>${estimatedShipping.toFixed(2)}</span>
            </div>
            <div className="border-t border-stone-600 pt-4 flex justify-between items-center text-xl font-bold">
              <span>Estimated Total:</span>
              <span className="text-emerald-300">${total.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-8 space-y-4">
            <Button 
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center"
              onClick={handleCheckout}
              disabled={isLoading || items.length === 0}
            >
              {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              <Lock className="ml-2 h-4 w-4" />
            </Button>
            <p className="text-xs text-center text-stone-400">
              Secure checkout powered by Stripe. We never store your payment information.
            </p>
            <Button 
              variant="outline" 
              className="w-full text-stone-300 hover:bg-stone-700"
              onClick={clearCart}
              disabled={isLoading || items.length === 0}
            >
              Clear Cart
            </Button>
          </div>
        </>
      )}
    </div>
  )
}