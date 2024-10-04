import { v4 as uuidv4 } from 'uuid';

export function getGuestId(): string {
  if (typeof window !== 'undefined') {
    let guestId = localStorage.getItem('guestId');
    if (!guestId) {
      guestId = uuidv4();
      localStorage.setItem('guestId', guestId);
    }
    return guestId;
  }
  return uuidv4(); // Fallback for server-side
}
