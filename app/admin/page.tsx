'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';  // Note: changed from 'next/router'
import { supabase } from '@/lib/supabaseClient';
import { Session } from '@supabase/supabase-js'; // Make sure to import the Session type
import Admin from '@/components/Admin';

export default function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setSession(session);
      } else {
        router.push('/admin-login');
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (!session) {
    return <div>Loading...</div>;
  }

  return <Admin />;
}
