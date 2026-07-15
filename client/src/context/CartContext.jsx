import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addItem = (food, quantity = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i._id === food._id);
      if (existing) {
        return prev.map(i => i._id === food._id ? { ...i, quantity: i.quantity + quantity } : i);
      }
      return [...prev, { _id: food._id, name: food.name, price: food.discountPrice || food.price, image: food.images?.[0]?.url || '', quantity }];
    });
  };

  const removeItem = (foodId) => {
    setItems(prev => prev.filter(i => i._id !== foodId));
  };

  const updateQuantity = (foodId, quantity) => {
    if (quantity <= 0) return removeItem(foodId);
    setItems(prev => prev.map(i => i._id === foodId ? { ...i, quantity } : i));
  };

  const clearCart = () => setItems([]);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, subtotal, itemCount }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
