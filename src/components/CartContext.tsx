import React, { createContext, useContext, useState, useEffect } from 'react';

export type CartItem = {
  id: number | string;
  quantity: number;
  type: 'shop' | 'car';
  name?: string;
  price?: number;
  image?: string;
};

interface CartContextType {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: number | string, delta: number) => void;
  removeFromCart: (id: number | string) => void;
  clearCart: () => void;
  cartCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const email = localStorage.getItem('jkk_user_email') || 'guest';
      const saved = localStorage.getItem(`jkk_global_cart_${email}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    const email = localStorage.getItem('jkk_user_email') || 'guest';
    localStorage.setItem(`jkk_global_cart_${email}`, JSON.stringify(cart));
  }, [cart]);

  // Also listen for login/logout to refresh cart
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const email = localStorage.getItem('jkk_user_email') || 'guest';
        const saved = localStorage.getItem(`jkk_global_cart_${email}`);
        if (saved) {
          setCart(JSON.parse(saved));
        } else {
          setCart([]);
        }
      } catch (e) {}
    };
    window.addEventListener('shopCartUpdated', handleStorageChange);
    return () => window.removeEventListener('shopCartUpdated', handleStorageChange);
  }, []);

  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + (item.quantity || 1) } : i);
      }
      return [...prev, { ...item, quantity: item.quantity || 1 }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (id: number | string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = Math.max(1, item.quantity + delta);
        return { ...item, quantity: newQ };
      }
      return item;
    }));
  };

  const removeFromCart = (id: number | string) => {
    setCart(prev => prev.filter(i => i.id !== id));
  };

  const clearCart = () => setCart([]);

  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateQuantity,
      removeFromCart,
      clearCart,
      cartCount,
      isCartOpen,
      setIsCartOpen
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
};
