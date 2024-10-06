'use client';

import { useEffect, useState } from 'react';
import { Battery, CheckCircle, XCircle, ChevronLeft } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import Link from 'next/link';
import { Order } from '@/types/Order';

export default function SuccessPage() {
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [order, setOrder] = useState<Order | null>(null);
  const [readyDate, setReadyDate] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>(''); // Add this line

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get('session_id');
    
    console.log('Session ID:', session_id);

    if (session_id) {
      fetch(`/api/verify-session?session_id=${session_id}`)
        .then(response => {
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          return response.json();
        })
        .then(data => {
          console.log('API Response:', JSON.stringify(data, null, 2));
          if (data.verified) {
            setStatus('success');
            if (data.order) {
              setOrder(data.order);
              // Set initial ready date (2 weeks from now)
              const twoWeeksFromNow = new Date();
              twoWeeksFromNow.setDate(twoWeeksFromNow.getDate() + 14);
              setReadyDate(twoWeeksFromNow.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }));
            } else {
              throw new Error('Order data is missing');
            }
          } else {
            throw new Error('Order not verified');
          }
        })
        .catch(error => {
          console.error('Verification error:', error);
          setStatus('error');
          setErrorMessage(error.message || 'An error occurred while verifying the order'); // Change this line
        });
    } else {
      setStatus('error');
      setErrorMessage('No session ID provided'); // Change this line
    }
  }, []);

  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-900 text-white">
      <header className="bg-stone-800 border-b border-stone-700 py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Battery className="h-8 w-8 text-emerald-400 mr-2" />
          <span className="text-2xl font-bold" style={{ fontFamily: 'Helvetica Neue, sans-serif' }}>opbattery.com</span>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-stone-800 p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          {status === 'verifying' && (
            <>
              <Spinner className="mx-auto mb-4 h-8 w-8 text-emerald-400" />
              <h1 className="text-2xl font-bold mb-4 text-emerald-300 text-center">Verifying Your Order</h1>
              <p className="text-stone-300 mb-4 text-center">Please wait while we confirm your payment.</p>
            </>
          )}
          {status === 'success' && order && (
            <>
              <CheckCircle className="h-16 w-16 text-emerald-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4 text-emerald-300 text-center">Order Successful!</h1>
              <p className="text-stone-300 mb-6 text-center">Thank you for your purchase. We&apos;ve received your order and will process it soon.</p>
              
              <div className="bg-stone-700 p-4 rounded-lg mb-6">
                <h2 className="text-xl font-semibold mb-2 text-emerald-300">Order Details</h2>
                <p className="text-stone-300">Order ID: {order.orderid}</p>
                <p className="text-stone-300">Date: {order.created_at ? formatDate(order.created_at) : 'N/A'}</p>
                <p className="text-stone-300">Status: {order.status}</p>
                <div className="mt-4">
                  <h3 className="font-semibold mb-2 text-emerald-300">Items:</h3>
                  {order.items && Array.isArray(order.items) && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-stone-300">
                        <span>{item.name} x{item.quantity}</span>
                        <span>${(item.price).toFixed(2)}</span>
                      </div>
                    ))
                  ) : (
                    <p className="text-stone-300">No items found in this order.</p>
                  )}
                </div>
                <div className="mt-4 text-right font-bold text-emerald-300">
                  Total: ${(order.total).toFixed(2)}
                </div>
                <p className="text-stone-300 mt-4">Estimated Ready Date: {readyDate}</p>
              </div>
              
              <div className="flex justify-between">
                <Link href="/" passHref>
                  <Button className="bg-stone-700 hover:bg-stone-600 text-white">
                    <ChevronLeft className="mr-2 h-4 w-4" />
                    Return to Home
                  </Button>
                </Link>
                <Link href="/orders" passHref>
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    View All Orders
                  </Button>
                </Link>
              </div>
            </>
          )}
          {status === 'error' && (
            <>
              <XCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <h1 className="text-2xl font-bold mb-4 text-red-300 text-center">Order Verification Failed</h1>
              <p className="text-stone-300 mb-6 text-center">{errorMessage}</p> {/* Change this line */}
              <Link href="/" passHref>
                <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white">
                  Return to Home
                </Button>
              </Link>
            </>
          )}
        </div>
      </main>

      <footer className="bg-stone-800 py-4">
        <div className="container mx-auto px-4 text-center text-stone-400">
          © 2024 OnPoint Batteries | Powered by the sun, inspired by the redwoods
        </div>
      </footer>
    </div>
  );
}