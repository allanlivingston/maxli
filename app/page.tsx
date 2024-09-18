'use client';

import { useRouter } from 'next/navigation';
import { EnhancedNorcalBatteryStore } from '@/components/enhanced-norcal-battery-store';

export default function Home() {
  const router = useRouter();

  const handleLogoClick = () => {
    router.push('/');
  };

  return <EnhancedNorcalBatteryStore onLogoClick={handleLogoClick} />;
}