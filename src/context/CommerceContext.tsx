import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import {
  Product,
  Order,
  OrderStatus,
  CatalogFilters,
  DashboardMetrics,
  CategoryBreakdown,
  SalesDataPoint,
  CheckoutFormData,
  CartItem,
  ProductCategory,
  ApiResponse,
} from '../types/ecommerce';
import { INITIAL_PRODUCTS } from '../data/initialProducts';
import { INITIAL_ORDERS } from '../data/initialOrders';
import { getFromStorage, setToStorage } from '../lib/storage';
import {
  validateProduct,
  validateCheckoutFormData,
  createSuccessResponse,
  createErrorResponse,
} from '../lib/validation';

interface CommerceContextType {
  products: Product[];
  orders: Order[];
  filters: CatalogFilters;
  filteredProducts: Product[];
  metrics: DashboardMetrics;
  selectedProductForDetail: Product | null;
  quickViewProduct: Product | null;
  activeView: 'home' | 'catalog' | 'detail' | 'checkout' | 'confirmation' | 'admin';
  lastCreatedOrder: Order | null;
  loading: boolean;
  setFilters: (filters: Partial<CatalogFilters>) => void;
  resetFilters: () => void;
  setSelectedProductForDetail: (product: Product | null) => void;
  setQuickViewProduct: (product: Product | null) => void;
  setActiveView: (view: 'home' | 'catalog' | 'detail' | 'checkout' | 'confirmation' | 'admin') => void;
  addProduct: (product: Partial<Product>) => Promise<ApiResponse<Product>>;
  editProduct: (id: string, updates: Partial<Product>) => Promise<ApiResponse<Product>>;
  updateProduct: (id: string, updates: Partial<Product>) => Promise<ApiResponse<Product>>;
  deleteProduct: (id: string) => Promise<ApiResponse<{ deletedId: string }>>;
  adjustStock: (id: string, delta: number) => Promise<ApiResponse<Product>>;
  updateOrderStatus: (orderId: string, status: OrderStatus) => Promise<ApiResponse<Order>>;
  processCheckout: (
    formData: CheckoutFormData,
    cartItems: CartItem[],
    pricing: { subtotal: number; discount: number; shippingCost: number; tax: number; total: number; promoCode?: string }
  ) => Promise<ApiResponse<Order>>;
  resetToSampleData: () => void;
  resetToFactoryDefaults: () => void;
}

const STORAGE_PRODUCTS_KEY = 'aura_products_catalog_v1';
const STORAGE_ORDERS_KEY = 'aura_orders_history_v1';

const DEFAULT_FILTERS: CatalogFilters = {
  searchQuery: '',
  category: 'All',
  minPrice: 0,
  maxPrice: 1000,
  minRating: 0,
  inStockOnly: false,
  sortBy: 'featured',
  viewMode: 'grid',
};

const CommerceContext = createContext<CommerceContextType | undefined>(undefined);

export const CommerceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(() => {
    return getFromStorage<Product[]>(STORAGE_PRODUCTS_KEY, INITIAL_PRODUCTS);
  });

  const [orders, setOrders] = useState<Order[]>(() => {
    return getFromStorage<Order[]>(STORAGE_ORDERS_KEY, INITIAL_ORDERS);
  });

  const [filters, setFiltersState] = useState<CatalogFilters>(DEFAULT_FILTERS);
  const [selectedProductForDetail, setSelectedProductForDetail] = useState<Product | null>(null);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [activeView, setActiveView] = useState<'home' | 'catalog' | 'detail' | 'checkout' | 'confirmation' | 'admin'>('home');
  const [lastCreatedOrder, setLastCreatedOrder] = useState<Order | null>(null);

  useEffect(() => {
    setToStorage(STORAGE_PRODUCTS_KEY, products);
  }, [products]);

  useEffect(() => {
    setToStorage(STORAGE_ORDERS_KEY, orders);
  }, [orders]);

  const setFilters = (newFilters: Partial<CatalogFilters>) => {
    setFiltersState(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFiltersState(DEFAULT_FILTERS);
  };

  // Filtered & Sorted Product Catalog
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      // Search query
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase();
        const matchName = product.name.toLowerCase().includes(query);
        const matchDesc = product.description.toLowerCase().includes(query);
        const matchSku = product.sku.toLowerCase().includes(query);
        const matchTags = product.tags.some(tag => tag.toLowerCase().includes(query));
        if (!matchName && !matchDesc && !matchSku && !matchTags) return false;
      }

      // Category filter
      if (filters.category !== 'All' && product.category !== filters.category) {
        return false;
      }

      // Price range
      if (product.price < filters.minPrice || product.price > filters.maxPrice) {
        return false;
      }

      // Rating filter
      if (filters.minRating > 0 && product.rating < filters.minRating) {
        return false;
      }

      // In stock only
      if (filters.inStockOnly && product.stock <= 0) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      switch (filters.sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'featured':
        default:
          if (a.isFeatured && !b.isFeatured) return -1;
          if (!a.isFeatured && b.isFeatured) return 1;
          return b.reviewCount - a.reviewCount;
      }
    });
  }, [products, filters]);

  // Dynamic Dashboard Analytics & Metrics
  const metrics: DashboardMetrics = useMemo(() => {
    const validOrders = orders.filter(o => o.status !== 'Cancelled');
    const totalRevenue = validOrders.reduce((acc, curr) => acc + curr.total, 0);
    const totalOrders = orders.length;
    const totalProducts = products.length;
    const lowStockCount = products.filter(p => p.stock <= 5).length;
    const averageOrderValue = validOrders.length > 0 ? totalRevenue / validOrders.length : 0;

    // Monthly sales data
    const salesTrend: SalesDataPoint[] = [
      { period: 'Oct', sales: 12450, orders: 38 },
      { period: 'Nov', sales: 18900, orders: 54 },
      { period: 'Dec', sales: 27400, orders: 82 },
      { period: 'Jan', sales: 16800, orders: 46 },
      { period: 'Feb', sales: 21300, orders: 61 },
      { period: 'Mar (MTD)', sales: Math.round(totalRevenue * 0.4 + 9200), orders: validOrders.length + 14 },
    ];

    // Category breakdown
    const categoryTotals: Record<string, { count: number; revenue: number }> = {};
    const categories: ProductCategory[] = ['Electronics', 'Apparel', 'Home & Living', 'Accessories', 'Footwear'];

    categories.forEach(cat => {
      categoryTotals[cat] = { count: 0, revenue: 0 };
    });

    products.forEach(p => {
      if (categoryTotals[p.category]) {
        categoryTotals[p.category].count += 1;
      }
    });

    orders.forEach(order => {
      if (order.status !== 'Cancelled') {
        order.items.forEach(item => {
          const matchedProd = products.find(p => p.id === item.productId);
          if (matchedProd && categoryTotals[matchedProd.category]) {
            categoryTotals[matchedProd.category].revenue += item.price * item.quantity;
          }
        });
      }
    });

    const categoryBreakdown: CategoryBreakdown[] = categories.map(cat => {
      const rev = categoryTotals[cat].revenue;
      const count = categoryTotals[cat].count;
      const pct = totalRevenue > 0 ? (rev / totalRevenue) * 100 : 0;
      return {
        category: cat,
        productCount: count,
        revenue: rev,
        percentage: Math.round(pct * 10) / 10,
      };
    });

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      lowStockCount,
      averageOrderValue,
      salesTrend,
      categoryBreakdown,
    };
  }, [products, orders]);

  // Product CRUD with Data Validation
  const addProduct = async (productData: Partial<Product>): Promise<ApiResponse<Product>> => {
    try {
      const generatedId = `prod-${Date.now().toString(36)}`;
      const candidate: Product = {
        id: generatedId,
        name: productData.name?.trim() || '',
        description: productData.description?.trim() || '',
        price: Number(productData.price) || 0,
        cost: Number(productData.cost) || Math.round((Number(productData.price) || 0) * 0.45),
        category: productData.category as ProductCategory,
        stock: Number(productData.stock) || 0,
        sku: (productData.sku || `SKU-${Date.now().toString().slice(-6)}`).toUpperCase(),
        imageUrl: productData.imageUrl?.trim() || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=1000&q=80',
        rating: 5.0,
        reviewCount: 0,
        isFeatured: Boolean(productData.isFeatured),
        tags: productData.tags || [],
        specs: productData.specs || {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const validation = validateProduct(candidate);
      if (!validation.isValid) {
        return createErrorResponse(
          'VALIDATION_FAILED',
          'Product input failed validation rules',
          validation.errors
        );
      }

      setProducts(prev => [candidate, ...prev]);
      return createSuccessResponse(candidate);
    } catch (err) {
      console.error('[Commerce] addProduct error:', err);
      return createErrorResponse('INTERNAL_ERROR', 'Unexpected error adding product', String(err));
    }
  };

  const editProduct = async (id: string, updates: Partial<Product>): Promise<ApiResponse<Product>> => {
    try {
      const existing = products.find(p => p.id === id);
      if (!existing) {
        return createErrorResponse('NOT_FOUND', `Product with ID ${id} not found`);
      }

      const merged: Product = {
        ...existing,
        ...updates,
        id: existing.id, // Immutable ID
        createdAt: existing.createdAt, // Immutable timestamp
        updatedAt: new Date().toISOString(),
      };

      const validation = validateProduct(merged);
      if (!validation.isValid) {
        return createErrorResponse(
          'VALIDATION_FAILED',
          'Updated product data is invalid',
          validation.errors
        );
      }

      setProducts(prev => prev.map(p => (p.id === id ? merged : p)));
      return createSuccessResponse(merged);
    } catch (err) {
      console.error('[Commerce] editProduct error:', err);
      return createErrorResponse('INTERNAL_ERROR', 'Failed to update product', String(err));
    }
  };

  const deleteProduct = async (id: string): Promise<ApiResponse<{ deletedId: string }>> => {
    try {
      const existing = products.find(p => p.id === id);
      if (!existing) {
        return createErrorResponse('NOT_FOUND', `Product with ID ${id} not found`);
      }

      setProducts(prev => prev.filter(p => p.id !== id));
      return createSuccessResponse({ deletedId: id });
    } catch (err) {
      console.error('[Commerce] deleteProduct error:', err);
      return createErrorResponse('INTERNAL_ERROR', 'Failed to delete product', String(err));
    }
  };

  const adjustStock = async (id: string, delta: number): Promise<ApiResponse<Product>> => {
    try {
      const existing = products.find(p => p.id === id);
      if (!existing) {
        return createErrorResponse('NOT_FOUND', `Product with ID ${id} not found`);
      }

      const newStock = Math.max(0, existing.stock + delta);
      const updated: Product = {
        ...existing,
        stock: newStock,
        updatedAt: new Date().toISOString(),
      };

      setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
      return createSuccessResponse(updated);
    } catch (err) {
      console.error('[Commerce] adjustStock error:', err);
      return createErrorResponse('INTERNAL_ERROR', 'Failed to adjust stock', String(err));
    }
  };

  const updateOrderStatus = async (orderId: string, status: OrderStatus): Promise<ApiResponse<Order>> => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) {
        return createErrorResponse('NOT_FOUND', `Order with ID ${orderId} not found`);
      }

      const updated: Order = {
        ...order,
        status,
        updatedAt: new Date().toISOString(),
      };

      setOrders(prev => prev.map(o => (o.id === orderId ? updated : o)));
      return createSuccessResponse(updated);
    } catch (err) {
      console.error('[Commerce] updateOrderStatus error:', err);
      return createErrorResponse('INTERNAL_ERROR', 'Failed to update order status', String(err));
    }
  };

  // Checkout Wizard with Inventory Decrement
  const processCheckout = async (
    formData: CheckoutFormData,
    cartItems: CartItem[],
    pricing: { subtotal: number; discount: number; shippingCost: number; tax: number; total: number; promoCode?: string }
  ): Promise<ApiResponse<Order>> => {
    try {
      const validation = validateCheckoutFormData(formData);
      if (!validation.isValid) {
        return createErrorResponse(
          'CHECKOUT_VALIDATION_ERROR',
          'Please complete all required shipping and payment fields',
          validation.errors
        );
      }

      if (cartItems.length === 0) {
        return createErrorResponse('EMPTY_CART', 'Cannot checkout with an empty shopping cart');
      }

      // Verify stock availability
      for (const item of cartItems) {
        const prod = products.find(p => p.id === item.product.id);
        if (!prod || prod.stock < item.quantity) {
          return createErrorResponse(
            'INSUFFICIENT_STOCK',
            `Item "${item.product.name}" only has ${prod?.stock ?? 0} units left in stock`
          );
        }
      }

      // Decrement inventory in real-time
      setProducts(prev =>
        prev.map(p => {
          const purchased = cartItems.find(item => item.product.id === p.id);
          if (purchased) {
            return {
              ...p,
              stock: Math.max(0, p.stock - purchased.quantity),
              updatedAt: new Date().toISOString(),
            };
          }
          return p;
        })
      );

      // Create new Order record
      const orderId = `ord-${Math.floor(100000 + Math.random() * 900000)}`;
      const newOrder: Order = {
        id: orderId,
        userId: 'usr-customer-active',
        customerName: formData.fullName,
        customerEmail: formData.email,
        shippingAddress: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country || 'United States',
          phone: formData.phone,
        },
        items: cartItems.map(item => ({
          productId: item.product.id,
          name: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          imageUrl: item.product.imageUrl,
        })),
        subtotal: pricing.subtotal,
        discount: pricing.discount,
        shippingCost: pricing.shippingCost,
        tax: pricing.tax,
        total: pricing.total,
        status: 'Pending',
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'paid',
        promoCode: pricing.promoCode,
        shippingMethod: formData.shippingMethod,
        trackingNumber: `TRK-${Math.random().toString(36).substring(2, 10).toUpperCase()}-US`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setOrders(prev => [newOrder, ...prev]);
      setLastCreatedOrder(newOrder);
      setActiveView('confirmation');

      return createSuccessResponse(newOrder);
    } catch (err) {
      console.error('[Commerce] processCheckout error:', err);
      return createErrorResponse('PAYMENT_GATEWAY_ERROR', 'Simulated payment processing error', String(err));
    }
  };

  const resetToSampleData = () => {
    setProducts(INITIAL_PRODUCTS);
    setOrders(INITIAL_ORDERS);
    resetFilters();
  };

  return (
    <CommerceContext.Provider
      value={{
        products,
        orders,
        filters,
        filteredProducts,
        metrics,
        selectedProductForDetail,
        quickViewProduct,
        activeView,
        lastCreatedOrder,
        loading: false,
        setFilters,
        resetFilters,
        setSelectedProductForDetail,
        setQuickViewProduct,
        setActiveView,
        addProduct,
        editProduct,
        updateProduct: editProduct,
        deleteProduct,
        adjustStock,
        updateOrderStatus,
        processCheckout,
        resetToSampleData,
        resetToFactoryDefaults: resetToSampleData,
      }}
    >
      {children}
    </CommerceContext.Provider>
  );
};

export function useCommerce(): CommerceContextType {
  const context = useContext(CommerceContext);
  if (!context) {
    throw new Error('useCommerce must be used within a CommerceProvider');
  }
  return context;
}
