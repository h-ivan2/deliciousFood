import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('df_cart_items');
    return saved ? JSON.parse(saved) : [];
  });

  const [cartRestaurant, setCartRestaurant] = useState(() => {
    const saved = localStorage.getItem('df_cart_restaurant');
    return saved ? JSON.parse(saved) : null;
  });

  const [orderType, setOrderType] = useState(() => {
    return localStorage.getItem('df_order_type') || 'delivery';
  });

  const [bookingDetails, setBookingDetails] = useState(() => {
    const saved = localStorage.getItem('df_booking_details');
    return saved ? JSON.parse(saved) : null;
  });

  const [walletBalance, setWalletBalance] = useState(0);

  // Load wallet balance from backend on mount
  useEffect(() => {
    const token = localStorage.getItem('df_token');
    if (token) {
      authService.getWallet()
        .then((data) => setWalletBalance(data.walletBalance || 0))
        .catch(() => setWalletBalance(0));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('df_cart_items', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem('df_cart_restaurant', JSON.stringify(cartRestaurant));
  }, [cartRestaurant]);

  useEffect(() => {
    localStorage.setItem('df_order_type', orderType);
  }, [orderType]);

  useEffect(() => {
    localStorage.setItem('df_booking_details', JSON.stringify(bookingDetails));
  }, [bookingDetails]);

  const addToCart = (item, restaurant) => {
    if (cartRestaurant && cartRestaurant._id !== restaurant._id) {
      if (window.confirm(`Your cart contains items from "${cartRestaurant.name}". Would you like to clear your cart and add items from "${restaurant.name}"?`)) {
        setCartItems([{ ...item, quantity: 1 }]);
        setCartRestaurant(restaurant);
      }
      return;
    }

    if (!cartRestaurant) {
      setCartRestaurant(restaurant);
    }

    setCartItems((prev) => {
      const existing = prev.find((i) => i._id === item._id);
      if (existing) {
        return prev.map((i) => (i._id === item._id ? { ...i, quantity: i.quantity + 1 } : i));
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      const updated = prev.filter((i) => i._id !== itemId);
      if (updated.length === 0) {
        setCartRestaurant(null);
      }
      return updated;
    });
  };

  const updateQuantity = (itemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (i._id === itemId ? { ...i, quantity } : i))
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setCartRestaurant(null);
    setBookingDetails(null);
  };

  const getSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.discountedPrice || item.price) * item.quantity, 0);
  };

  const getDeliveryFee = () => {
    if (orderType === 'dine-in') return 0;
    return cartRestaurant ? cartRestaurant.deliveryFee || 2.99 : 0;
  };

  const getTax = () => {
    return getSubtotal() * 0.10; // 10% tax
  };

  const getTotal = () => {
    return getSubtotal() + getDeliveryFee() + getTax();
  };

  const topUpWallet = async (amount) => {
    try {
      const data = await authService.topUpWallet(amount);
      setWalletBalance(data.walletBalance);
    } catch (err) {
      console.error('Wallet top-up failed:', err);
      throw err;
    }
  };

  const deductWallet = async (amount) => {
    // Refresh from backend since the backend deducts on order placement
    try {
      const data = await authService.getWallet();
      setWalletBalance(data.walletBalance || 0);
    } catch {
      setWalletBalance((prev) => Math.max(0, prev - Number(amount)));
    }
  };

  const refreshWallet = async () => {
    try {
      const data = await authService.getWallet();
      setWalletBalance(data.walletBalance || 0);
    } catch (err) {
      console.error('Failed to refresh wallet:', err);
    }
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartRestaurant,
        orderType,
        bookingDetails,
        walletBalance,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        setOrderType,
        setBookingDetails,
        topUpWallet,
        deductWallet,
        refreshWallet,
        getSubtotal,
        getDeliveryFee,
        getTax,
        getTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
