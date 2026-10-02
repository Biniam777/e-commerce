import { createContext, useContext, useEffect, useState } from 'react';

import { useAuth } from './AuthContext.jsx';
import { addCartItem, getCart, removeCartItem, updateCartItem } from '../services/cartService.js';

const CartContext = createContext(null);

function CartProvider({ children }) {
  const { isAuthenticated, logout } = useAuth();
  const [cart, setCart] = useState(null);
  const [subtotal, setSubtotal] = useState('0.00');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const refreshCart = async () => {
    if (!isAuthenticated) {
      setCart(null);
      setSubtotal('0.00');
      setError('');
      setLoading(false);
      return null;
    }

    setLoading(true);
    setError('');

    try {
      const response = await getCart();
      setCart(response.data.cart);
      setSubtotal(response.data.subtotal);
      return response.data;
    } catch (requestError) {
      if (requestError.status === 401) logout();
      setError(requestError.message || 'Unable to load your cart.');
      return null;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshCart();
  }, [isAuthenticated]);

  const runCartAction = async (action) => {
    setActionLoading(true);
    setError('');

    try {
      await action();
      await refreshCart();
    } catch (requestError) {
      if (requestError.status === 401) logout();
      setError(requestError.message || 'Unable to update your cart.');
      throw requestError;
    } finally {
      setActionLoading(false);
    }
  };

  const addItem = (productId, quantity = 1) =>
    runCartAction(() => addCartItem(productId, quantity));

  const updateItem = (itemId, quantity) =>
    runCartAction(() => updateCartItem(itemId, quantity));

  const removeItem = (itemId) =>
    runCartAction(() => removeCartItem(itemId));

  const itemCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0;

  return (
    <CartContext.Provider
      value={{
        actionLoading,
        addItem,
        cart,
        error,
        itemCount,
        loading,
        refreshCart,
        removeItem,
        subtotal,
        updateItem
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

const useCart = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }

  return context;
};

export { CartProvider, useCart };