'use client';

import { useStore } from '../context/StoreContext';

export function useClientStore() {
  return useStore();
}
