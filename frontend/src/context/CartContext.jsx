// src/context/CartContext.jsx

import React, { createContext, useContext, useEffect, useState } from "react";

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingAddress, setShippingAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("Cash on Delivery");

  // 1) Load cart from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("cart");
    if (saved) {
      try {
        setCartItems(JSON.parse(saved));
      } catch {
        setCartItems([]);
      }
    }
    // Also load any saved shippingAddress/paymentMethod (optional)
    const savedAddress = localStorage.getItem("shippingAddress");
    if (savedAddress) {
      try {
        setShippingAddress(JSON.parse(savedAddress));
      } catch {}
    }
    const savedPayment = localStorage.getItem("paymentMethod");
    if (savedPayment) {
      setPaymentMethod(savedPayment);
    }
  }, []);

  // 2) Persist cartItems / shippingAddress / paymentMethod
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (shippingAddress) {
      localStorage.setItem("shippingAddress", JSON.stringify(shippingAddress));
    } else {
      localStorage.removeItem("shippingAddress");
    }
  }, [shippingAddress]);

  useEffect(() => {
    localStorage.setItem("paymentMethod", paymentMethod);
  }, [paymentMethod]);

  // 3) Add item or increment quantity
  const addToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((ci) => ci.id === item._id);
      if (existing) {
        return prev.map((ci) =>
          ci.id === item._id ? { ...ci, quantity: ci.quantity + 1 } : ci
        );
      } else {
        return [
          ...prev,
          {
            id: item._id,
            name: item.name,
            description: item.description,
            price: item.price,
            img: item.img,
            quantity: 1,
          },
        ];
      }
    });
  };

  // 4) Update quantity by delta (allow negative to remove)
  const updateQty = (id, delta) => {
    setCartItems((prev) =>
      prev
        .map((ci) =>
          ci.id === id
            ? { ...ci, quantity: Math.max(1, ci.quantity + delta) }
            : ci
        )
        .filter((ci) => ci.quantity > 0)
    );
  };

  // 5) Remove entire item
  const removeFromCart = (id) => {
    setCartItems((prev) => prev.filter((ci) => ci.id !== id));
  };

  // 6) Clear cart
  const clearCart = () => {
    setCartItems([]);
    setShippingAddress(null);
    setPaymentMethod("Cash on Delivery");
    localStorage.removeItem("cart");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
  };

  const totalPrice = cartItems.reduce(
    (sum, ci) => sum + ci.price * ci.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        updateQty,
        removeFromCart,
        clearCart,
        totalPrice,
        shippingAddress,
        setShippingAddress,
        paymentMethod,
        setPaymentMethod,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
