'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

type StoreContextType = {
  orderSuccess: string | null;
  setOrderSuccess: (message: string | null) => void;
};

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [orderSuccess, setOrderSuccessState] = useState<string | null>(null);

  const setOrderSuccess = useCallback((message: string | null) => {
    setOrderSuccessState(message);
  }, []);

  return (
    <StoreContext.Provider value={{ orderSuccess, setOrderSuccess }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const context = useContext(StoreContext);
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
}
