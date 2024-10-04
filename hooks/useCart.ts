import { useState, useEffect } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  type: string;
  capacity: string;
  imagePath: string;
}

export function useCart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [savedItems, setSavedItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (item: Omit<CartItem, 'quantity'>) => {
    setCartItems(prevItems => {
      const existingItemIndex = prevItems.findIndex(i => i.id === item.id);
      if (existingItemIndex > -1) {
        return prevItems.map((i, index) => 
          index === existingItemIndex ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCartItems(currentItems => currentItems.filter(item => item.id !== id));
  };

  const updateQuantity = (id: string | number, quantity: number) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id.toString() === id.toString() ? { ...item, quantity: Math.max(0, quantity) } : item
      ).filter(item => item.quantity > 0)
    );
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const saveForLater = (id: number) => {
    setCartItems(prevItems => {
      const itemToSave = prevItems.find(item => item.id === id);
      if (itemToSave) {
        setSavedItems(prevSaved => [...prevSaved, itemToSave]);
        return prevItems.filter(item => item.id !== id);
      }
      return prevItems;
    });
  };

  const moveToCart = (id: number) => {
    setSavedItems(prevSaved => {
      const itemToMove = prevSaved.find(item => item.id === id);
      if (itemToMove) {
        setCartItems(prevItems => [...prevItems, itemToMove]);
        return prevSaved.filter(item => item.id !== id);
      }
      return prevSaved;
    });
  };

  return { cartItems, addToCart, removeFromCart, updateQuantity, clearCart, saveForLater, moveToCart, savedItems };
}