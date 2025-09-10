import React, { createContext, useContext, useMemo, useState, ReactNode } from 'react';

export interface CartItemIngredient {
  id: string;
  name: string;
  amount: string;
  unit: string;
  price: number;
  quantity: number;
  image?: string;
  benefit?: string;
}

export interface CartComboItem {
  id: string;
  type: 'combo';
  name: string;
  tagline?: string;
  price: number; // base combo price (excluding items)
  quantity: number; // number of this combo
  image?: string;
  items: CartItemIngredient[];
}

interface CartContextType {
  cartCount: number;
  setCartCount: (count: number | ((prev: number) => number)) => void;
  addToCart: () => void;
  removeFromCart: () => void;
  cartCombos: CartComboItem[];
  addOrUpdateCombo: (combo: CartComboItem) => void;
  removeCombo: (comboId: string) => void;
  updateItemQuantity: (comboId: string, itemId: string, quantity: number) => void;
  removeItemFromCombo: (comboId: string, itemId: string) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const [cartCombos, setCartCombos] = useState<CartComboItem[]>([]);

  const addToCart = () => {
    setCartCount(prev => prev + 1);
  };

  const removeFromCart = () => {
    setCartCount(prev => Math.max(0, prev - 1));
  };

  const addOrUpdateCombo = (combo: CartComboItem) => {
    setCartCombos(prev => {
      const exists = prev.find(c => c.id === combo.id);
      if (exists) {
        return prev.map(c => (c.id === combo.id ? combo : c));
      }
      // increment global combo count when adding a new combo entry
      setCartCount(c => c + 1);
      return [...prev, combo];
    });
  };

  const removeCombo = (comboId: string) => {
    setCartCombos(prev => {
      const newList = prev.filter(c => c.id !== comboId);
      if (newList.length < prev.length) {
        setCartCount(c => Math.max(0, c - 1));
      }
      return newList;
    });
  };

  const updateItemQuantity = (comboId: string, itemId: string, quantity: number) => {
    setCartCombos(prev => prev.map(combo => (
      combo.id === comboId
        ? {
            ...combo,
            items: combo.items.map(it => it.id === itemId ? { ...it, quantity } : it)
          }
        : combo
    )));
  };

  const removeItemFromCombo = (comboId: string, itemId: string) => {
    setCartCombos(prev => prev.map(combo => (
      combo.id === comboId
        ? {
            ...combo,
            items: combo.items.filter(it => it.id !== itemId)
          }
        : combo
    )));
  };

  return (
    <CartContext.Provider value={{
      cartCount,
      setCartCount,
      addToCart,
      removeFromCart,
      cartCombos,
      addOrUpdateCombo,
      removeCombo,
      updateItemQuantity,
      removeItemFromCombo
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
