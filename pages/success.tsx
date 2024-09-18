import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { CheckCircle, AlertCircle } from 'lucide-react';

export default function SuccessPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const router = useRouter();

  useEffect(() => {
    const { session_id } = router.query;
    console.log('Session ID:', session_id);
    if (session_id) {
      fetch(`/api/verify-session?session_id=${session_id}`)
        .then(response => response.json())
        .then(data => {
          console.log('Verification response:', data);
          if (data.verified) {
            setStatus('success');
          } else {
            setStatus('error');
          }
        })
        .catch(error => {
          console.error('Verification error:', error);
          setStatus('error');
        });
    }
  }, [router.query]);

  if (status === 'loading') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-900">
        <div className="text-stone-300 text-xl">Verifying your payment...</div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="flex items-center justify-center min-h-screen bg-stone-900">
        <div className="p-8 bg-stone-800 shadow-lg rounded-lg max-w-md w-full">
          <div className="flex items-center justify-center mb-6">
            <AlertCircle className="w-16 h-16 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-4 text-red-500 text-center">Payment Verification Failed</h1>
          <p className="mb-6 text-stone-300 text-center">There was an error verifying your payment. Please contact our support team for assistance.</p>
          <Link href="/" className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-stone-900">
      <div className="p-8 bg-stone-800 shadow-lg rounded-lg max-w-md w-full">
        <div className="flex items-center justify-center mb-6">
          <CheckCircle className="w-16 h-16 text-emerald-500" />
        </div>
        <h1 className="text-2xl font-bold mb-4 text-emerald-500 text-center">Payment Successful!</h1>
        <p className="mb-6 text-stone-300 text-center">Thank you for your purchase. Your order has been processed successfully and will be shipped soon.</p>
        <div className="space-y-4">
          <Link href="/" className="block text-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4 rounded transition duration-300">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
