'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function SuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // Log the full URL
    console.log('Full URL:', window.location.href);

    // Manually parse the URL to get the session_id
    const urlParams = new URLSearchParams(window.location.search);
    const session_id = urlParams.get('session_id');
    
    console.log('Session ID:', session_id);

    if (session_id) {
      console.log('Verifying session:', session_id);
      fetch(`/api/verify-session?session_id=${session_id}`)
        .then(response => response.json())
        .then(data => {
          console.log('Verification response:', data);
          if (data.verified) {
            console.log('Order verified successfully');
            router.push('/?orderSuccess=true');
          } else {
            console.error('Order verification failed');
            //alert('Order verification failed. Check console for details.');
            router.push('/?orderError=true');
          }
        })
        .catch(error => {
          console.error('Verification error:', error);
          alert(`Verification error: ${error.message}`);
          router.push('/?orderError=true');
        });
    } else {
      console.error('No session_id found in URL');
      alert('No session_id found in URL.');
      router.push('/?orderError=true');
    }
  }, [router]);

  return (
    <div>
      <h1>Verifying your order...</h1>
      <p>Please wait while we confirm your payment. You will be redirected shortly.</p>
    </div>
  );
}
