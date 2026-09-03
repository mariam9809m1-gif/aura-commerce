export type ProductCategory =
  | 'Electronics'
  | 'Apparel'
  | 'Home & Living'
  | 'Accessories'
  | 'Footwear';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  cost: number;
  category: ProductCategory;
  stock: number;
  sku: string;
  imageUrl: string;
  additionalImages?: string[];
  rating: number;
  reviewCount: number;
  isFeatured: boolean;
  tags: string[];
  specs?: Record<string, string>;
  createdAt: string;
  updatedAt: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedOption?: string;
}

export type OrderStatus =
  | 'Pending'
  | 'Processing'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export type PaymentMethod = 'credit_card' | 'paypal' | 'apple_pay' | 'mock_gateway';
export type PaymentStatus = 'paid' | 'pending' | 'failed';
export type ShippingMethod = 'standard' | 'express' | 'overnight';

export interface ShippingAddress {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
}

export interface OrderLineItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  customerName: string;
  customerEmail: string;
  shippingAddress: ShippingAddress;
  items: OrderLineItem[];
  subtotal: number;
  discount: number;
  shippingCost: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  promoCode?: string;
  shippingMethod: ShippingMethod;
  trackingNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'guest' | 'customer' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
}

export interface ApiResponseSuccess<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ApiResponseError {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
  timestamp: string;
}

export type ApiResponse<T> = ApiResponseSuccess<T> | ApiResponseError;

export interface SalesDataPoint {
  period: string;
  sales: number;
  orders: number;
}

export interface CategoryBreakdown {
  category: ProductCategory;
  productCount: number;
  revenue: number;
  percentage: number;
}

export interface DashboardMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  lowStockCount: number;
  averageOrderValue: number;
  salesTrend: SalesDataPoint[];
  categoryBreakdown: CategoryBreakdown[];
}

export interface CatalogFilters {
  searchQuery: string;
  category: string;
  minPrice: number;
  maxPrice: number;
  minRating: number;
  inStockOnly: boolean;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  viewMode: 'grid' | 'list';
}

export interface CheckoutFormData {
  fullName: string;
  email: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  phone: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  cardNumber?: string;
  cardExp?: string;
  cardCvc?: string;
}
