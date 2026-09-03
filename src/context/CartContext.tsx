import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { CartItem, Product } from '../types/ecommerce';
import { getFromStorage, setToStorage } from '../lib/storage';

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number, selectedOption?: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  openCart: () => void;
  closeCart: () => void;
  itemCount: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  promoCode: string;
  appliedPromo: string | null;
  promoError: string | null;
  applyPromoCode: (code: string) => boolean;
  removePromoCode: () => void;
}

const STORAGE_CART_KEY = 'aura_cart_items_v1';
const STORAGE_PROMO_KEY = 'aura_cart_promo_v1';

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    return getFromStorage<CartItem[]>(STORAGE_CART_KEY, []);
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [appliedPromo, setAppliedPromo] = useState<string | null>(() => {
    return getFromStorage<string | null>(STORAGE_PROMO_KEY, null);
  });
  const [promoCodeInput, setPromoCodeInput] = useState('');
  const [promoError, setPromoError] = useState<string | null>(null);

  useEffect(() => {
    setToStorage(STORAGE_CART_KEY, items);
  }, [items]);

  useEffect(() => {
    setToStorage(STORAGE_PROMO_KEY, appliedPromo);
  }, [appliedPromo]);

  const addToCart = (product: Product, quantity = 1, selectedOption?: string) => {
    setItems(prevItems => {
      const existingIndex = prevItems.findIndex(
        item => item.product.id === product.id && item.selectedOption === selectedOption
      );

      if (existingIndex > -1) {
        const next = [...prevItems];
        const newQty = Math.min(next[existingIndex].quantity + quantity, product.stock);
        next[existingIndex] = { ...next[existingIndex], quantity: newQty };
        return next;
      }

      return [...prevItems, { product, quantity: Math.min(quantity, product.stock), selectedOption }];
    });
    setIsCartOpen(true);
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setItems(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          const clamped = Math.min(quantity, item.product.stock);
          return { ...item, quantity: clamped };
        }
        return item;
      })
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedPromo(null);
  };

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [items]);

  const discount = useMemo(() => {
    if (!appliedPromo || subtotal === 0) return 0;
    const clean = appliedPromo.toUpperCase();
    if (clean === 'SAVE20') return subtotal * 0.20;
    if (clean === 'AURA10') return subtotal * 0.10;
    return 0;
  }, [subtotal, appliedPromo]);

  const shippingCost = useMemo(() => {
    if (subtotal === 0) return 0;
    if (appliedPromo?.toUpperCase() === 'FREESHIP') return 0;
    // Free shipping threshold: $150
    return subtotal >= 150 ? 0 : 15.00;
  }, [subtotal, appliedPromo]);

  const tax = useMemo(() => {
    const taxableAmount = Math.max(0, subtotal - discount);
    return taxableAmount * 0.0825; // 8.25% standard sales tax
  }, [subtotal, discount]);

  const total = useMemo(() => {
    if (subtotal === 0) return 0;
    return Math.max(0, subtotal - discount + shippingCost + tax);
  }, [subtotal, discount, shippingCost, tax]);

  const applyPromoCode = (code: string): boolean => {
    const clean = code.trim().toUpperCase();
    setPromoError(null);

    if (clean === 'SAVE20' || clean === 'FREESHIP' || clean === 'AURA10') {
      setAppliedPromo(clean);
      setPromoCodeInput('');
      return true;
    }

    setPromoError('Invalid promo code. Try SAVE20 (20% off) or FREESHIP.');
    return false;
  };

  const removePromoCode = () => {
    setAppliedPromo(null);
    setPromoError(null);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isCartOpen,
        setIsCartOpen,
        openCart,
        closeCart,
        itemCount,
        subtotal,
        discount,
        shippingCost,
        tax,
        total,
        promoCode: promoCodeInput,
        appliedPromo,
        promoError,
        applyPromoCode,
        removePromoCode,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export function useCart(): CartContextType {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
