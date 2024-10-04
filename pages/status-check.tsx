import { GetServerSideProps, NextPage } from 'next';
import { createClient } from '@supabase/supabase-js';

interface KeyCheckProps {
  isStripeKeySet: boolean;
  isSupabaseUrlSet: boolean;
  isSupabaseAnonKeySet: boolean;
  supabaseConnectionStatus: string;
  buildTime: string; // Add this line
}

const KeyCheck: NextPage<KeyCheckProps> = ({ 
  isStripeKeySet, 
  isSupabaseUrlSet, 
  isSupabaseAnonKeySet, 
  supabaseConnectionStatus,
  buildTime // Add this line
}) => {
  return (
    <div style={{ 
      display: 'flex', 
      flexDirection: 'column',
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontSize: '24px', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <p>
        STRIPE KEY is: <strong>{isStripeKeySet ? 'Set' : 'Not Set'}</strong>
      </p>
      <p>
        SUPABASE URL is: <strong>{isSupabaseUrlSet ? 'Set' : 'Not Set'}</strong>
      </p>
      <p>
        SUPABASE KEY is: <strong>{isSupabaseAnonKeySet ? 'Set' : 'Not Set'}</strong>
      </p>
      <p>
        Supabase Connection: <strong>{supabaseConnectionStatus}</strong>
      </p>
      <p>
        Last Build Time: <strong>{buildTime}</strong>
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const isStripeKeySet = !!process.env.STRIPE_SECRET_KEY;
  const isSupabaseUrlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseAnonKeySet = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  let supabaseConnectionStatus = 'Not Attempted';

  if (isSupabaseUrlSet && isSupabaseAnonKeySet) {
    try {
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );

      // Change this line
      await supabase.from('orders').select('*').limit(1);

      supabaseConnectionStatus = 'Connected Successfully';
    } catch (error) {
      console.error('Supabase connection error:', error);
      supabaseConnectionStatus = `Connection Failed: ${(error as Error).message}`;
    }
  } else {
    supabaseConnectionStatus = 'Not Attempted (Missing Credentials)';
  }
  
  return {
    props: {
      isStripeKeySet,
      isSupabaseUrlSet,
      isSupabaseAnonKeySet,
      supabaseConnectionStatus,
      buildTime: process.env.BUILD_TIME!, // Add this line
    },
  };
};

export default KeyCheck;
