/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useEffect, useState } from 'react';

const CartContext = createContext(null);

const CART_STORAGE_KEY = 'visual_gallery_cart';

const safeParseJson = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const normalizeId = (id) => (id == null ? null : String(id));

const normalizeProduct = (product) => {
  if (!product) return null;

  const normalizedId = normalizeId(product._id ?? product.id);
  if (!normalizedId) return null;

  const productName = product.productName ?? product.title ?? product.name ?? 'Untitled';
  const productPriceRaw = product.productPrice ?? product.price ?? 0;
  const productPrice = Number(productPriceRaw) || 0;
  const productImage = product.productImage ?? product.img ?? product.image ?? '';

  return {
    ...product,
    _id: normalizedId,
    productName,
    productPrice,
    productImage,
  };
};

const readStoredCart = () => {
  if (typeof window === 'undefined') return [];

  const raw = window.localStorage.getItem(CART_STORAGE_KEY);
  if (!raw) return [];

  const parsed = safeParseJson(raw);
  if (!Array.isArray(parsed)) return [];

  return parsed
    .map((item) => {
      const normalized = normalizeProduct(item);
      if (!normalized) return null;

      return { ...normalized, quantity: item?.quantity || 1 };
    })
    .filter(Boolean);
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => readStoredCart());

  useEffect(() => {
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cartItems));
    } catch {
      // ignore (quota / blocked storage)
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const normalized = normalizeProduct(product);
    if (!normalized) return;

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => normalizeId(item?._id) === normalized._id);
      if (existingItem) {
        return prevItems.map((item) =>
          normalizeId(item?._id) === normalized._id
            ? { ...item, quantity: (item.quantity || 1) + 1 }
            : item
        );
      }

      return [...prevItems, { ...normalized, quantity: 1 }];
    });
  };

  const removeFromCart = (productId) => {
    const normalizedId = normalizeId(productId);
    if (!normalizedId) return;

    setCartItems((prevItems) => prevItems.filter((item) => normalizeId(item?._id) !== normalizedId));
  };

  const updateQuantity = (productId, delta) => {
    const normalizedId = normalizeId(productId);
    if (!normalizedId) return;

    const change = Number(delta) || 0;
    if (change === 0) return;

    setCartItems((prevItems) =>
      prevItems
        .map((item) => {
          if (normalizeId(item?._id) !== normalizedId) return item;

          const nextQuantity = (item.quantity || 1) + change;
          if (nextQuantity <= 0) return null;

          return { ...item, quantity: nextQuantity };
        })
        .filter(Boolean)
    );
  };

  const clearCart = () => setCartItems([]);

  const getCartTotal = () =>
    cartItems.reduce((sum, item) => sum + (Number(item.productPrice) || 0) * (item.quantity || 1), 0);

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    getCartTotal,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
};
