import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Camera, Accessory } from '../types';
import { getCart, addToCart, removeFromCart, clearCart, updateCartItem } from '../utils/localStorage';
import { v4 as uuidv4 } from 'uuid';

interface CartContextType {
  items: CartItem[];
  addItem: (item: Camera | Accessory, duration: '12h' | '24h') => void;
  removeItem: (id: string) => void;
  updateItem: (id: string, quantity: number) => void;
  clearItems: () => void;
  totalPrice: number;
  itemCount: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  
  useEffect(() => {
    // Load cart from localStorage on mount
    const storedCart = getCart();
    setItems(storedCart);
  }, []);
  
  const addItem = (item: Camera | Accessory, duration: '12h' | '24h') => {
    const price = duration === '12h' ? item.price12h : item.price24h;
    
    const cartItem: CartItem = {
      id: uuidv4(),
      itemId: item.id,
      itemType: 'id' in item && item.id.startsWith('1') ? 'camera' : 'accessory',
      name: item.name,
      imageUrl: item.imageUrl,
      price,
      duration,
      quantity: 1
    };
    
    addToCart(cartItem);
    setItems(getCart());
  };
  
  const removeItem = (id: string) => {
    removeFromCart(id);
    setItems(getCart());
  };
  
  const updateItem = (id: string, quantity: number) => {
    const item = items.find(item => item.id === id);
    if (item) {
      const updatedItem = { ...item, quantity };
      updateCartItem(updatedItem);
      setItems(getCart());
    }
  };
  
  const clearItems = () => {
    clearCart();
    setItems([]);
  };
  
  const totalPrice = items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
  
  const itemCount = items.reduce((count, item) => count + item.quantity, 0);
  
  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateItem,
        clearItems,
        totalPrice,
        itemCount
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};