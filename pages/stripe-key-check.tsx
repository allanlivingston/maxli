import { GetServerSideProps, NextPage } from 'next';

interface StripeKeyCheckProps {
  isStripeKeySet: boolean;
}

const StripeKeyCheck: NextPage<StripeKeyCheckProps> = ({ isStripeKeySet }) => {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      fontSize: '24px', 
      fontFamily: 'Arial, sans-serif' 
    }}>
      <p>
        STRIPE_SECRET_KEY is: <strong>{isStripeKeySet ? 'Set' : 'Not Set'}</strong>
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async () => {
  const isStripeKeySet = !!process.env.STRIPE_SECRET_KEY;
  
  return {
    props: {
      isStripeKeySet,
    },
  };
};

export default StripeKeyCheck;
