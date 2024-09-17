import React from 'react';
import { Trash2, Plus, Minus } from 'lucide-react';

type CartItem = {
  id: string | number;
  name: string;
  quantity: number;
  price: number;
};

type MiniCartProps = {
  items: CartItem[];
  removeFromCart: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
};

export function MiniCart({ items, removeFromCart, updateQuantity }: MiniCartProps) {
  console.log('MiniCart rendering', items);
  
  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="p-4 text-stone-100 bg-stone-800 rounded-md">
      <h3 className="font-bold mb-3 text-emerald-300">Your Cart</h3>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.id} className="flex items-center justify-between">
            <div>
              <span className="font-medium">{item.name}</span>
              <span className="text-stone-400 ml-2">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={() => updateQuantity(item.id, Math.max(0, item.quantity - 1))}
                className="p-1 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded"
              >
                <Minus size={14} />
              </button>
              <span className="w-8 text-center">{item.quantity}</span>
              <button 
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="p-1 bg-stone-700 hover:bg-stone-600 text-stone-300 rounded"
              >
                <Plus size={14} />
              </button>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-1 bg-stone-700 hover:bg-red-600 text-stone-300 hover:text-white rounded"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </li>
        ))}
      </ul>
      <div className="mt-4 pt-3 border-t border-stone-700 font-bold text-emerald-300">
        Total: ${total.toFixed(2)}
      </div>
    </div>
  );
}