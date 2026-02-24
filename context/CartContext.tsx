"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface CartContextType {
  items: any[];
  addItem: (item: any) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<any[]>([]);

  const addItem = (item: any) => setItems(prev => [...prev, item]);

  return (
    <CartContext.Provider value={{ items, addItem }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
};