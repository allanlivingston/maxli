import { useState, useEffect } from 'react';

export function useGuestId() {
  const [guestId, setGuestId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchGuestId() {
      try {
        const response = await fetch('/api/get-guest-id');
        if (!response.ok) {
          throw new Error('Failed to fetch guest ID');
        }
        const data = await response.json();
        setGuestId(data.guestId);
      } catch (error) {
        console.error('Error fetching guest ID:', error);
      }
    }

    fetchGuestId();
  }, []);

  return guestId;
}
