import { GetServerSideProps, NextPage } from 'next';

interface KeyCheckProps {
  isStripeKeySet: boolean;
  isSupabaseUrlSet: boolean;
  isSupabaseAnonKeySet: boolean;
}

const KeyCheck: NextPage<KeyCheckProps> = ({ isStripeKeySet, isSupabaseUrlSet, isSupabaseAnonKeySet }) => {
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
        STRIPE_SECRET_KEY is: <strong>{isStripeKeySet ? 'Set' : 'Not Set'}</strong>
      </p>
      <p>
        NEXT_PUBLIC_SUPABASE_URL is: <strong>{isSupabaseUrlSet ? 'Set' : 'Not Set'}</strong>
      </p>
      <p>
        NEXT_PUBLIC_SUPABASE_ANON_KEY is: <strong>{isSupabaseAnonKeySet ? 'Set' : 'Not Set'}</strong>
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const isStripeKeySet = !!process.env.STRIPE_SECRET_KEY;
  const isSupabaseUrlSet = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
  const isSupabaseAnonKeySet = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  return {
    props: {
      isStripeKeySet,
      isSupabaseUrlSet,
      isSupabaseAnonKeySet,
    },
  };
};

export default KeyCheck;
