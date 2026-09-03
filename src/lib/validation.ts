import {
  Product,
  Order,
  CheckoutFormData,
  ApiResponse,
  ApiResponseSuccess,
  ApiResponseError,
  ProductCategory,
} from '../types/ecommerce';

const VALID_CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Apparel',
  'Home & Living',
  'Accessories',
  'Footwear',
];

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

export function validateProduct(data: Partial<Product>): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.name || typeof data.name !== 'string' || data.name.trim().length < 3) {
    errors.name = 'Product name must be at least 3 characters long.';
  } else if (data.name.length > 120) {
    errors.name = 'Product name cannot exceed 120 characters.';
  }

  if (
    !data.description ||
    typeof data.description !== 'string' ||
    data.description.trim().length < 10
  ) {
    errors.description = 'Description must be at least 10 characters long.';
  } else if (data.description.length > 2000) {
    errors.description = 'Description cannot exceed 2000 characters.';
  }

  if (
    data.price === undefined ||
    typeof data.price !== 'number' ||
    Number.isNaN(data.price) ||
    data.price < 0
  ) {
    errors.price = 'Price must be a valid non-negative number.';
  }

  if (
    data.cost !== undefined &&
    (typeof data.cost !== 'number' || Number.isNaN(data.cost) || data.cost < 0)
  ) {
    errors.cost = 'Cost must be a valid non-negative number.';
  }

  if (!data.category || !VALID_CATEGORIES.includes(data.category as ProductCategory)) {
    errors.category = `Category must be one of: ${VALID_CATEGORIES.join(', ')}.`;
  }

  if (
    data.stock === undefined ||
    typeof data.stock !== 'number' ||
    !Number.isInteger(data.stock) ||
    data.stock < 0
  ) {
    errors.stock = 'Stock must be a non-negative integer.';
  }

  if (!data.sku || typeof data.sku !== 'string' || !/^[a-zA-Z0-9_\-]+$/.test(data.sku)) {
    errors.sku = 'SKU must be alphanumeric (dashes and underscores allowed) up to 32 chars.';
  } else if (data.sku.length > 32) {
    errors.sku = 'SKU cannot exceed 32 characters.';
  }

  if (!data.imageUrl || typeof data.imageUrl !== 'string' || !/^https?:\/\/.+/.test(data.imageUrl)) {
    errors.imageUrl = 'Image URL must be a valid HTTP/HTTPS link.';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function validateCheckoutFormData(data: CheckoutFormData): ValidationResult {
  const errors: Record<string, string> = {};

  if (!data.fullName || data.fullName.trim().length < 2) {
    errors.fullName = 'Full name is required (minimum 2 characters).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email || !emailRegex.test(data.email)) {
    errors.email = 'A valid email address is required.';
  }

  if (!data.street || data.street.trim().length < 5) {
    errors.street = 'Street address is required (minimum 5 characters).';
  }

  if (!data.city || data.city.trim().length < 2) {
    errors.city = 'City is required.';
  }

  if (!data.state || data.state.trim().length < 2) {
    errors.state = 'State / Province is required.';
  }

  if (!data.zip || !/^[a-zA-Z0-9\s\-]{3,10}$/.test(data.zip)) {
    errors.zip = 'Valid postal / ZIP code is required.';
  }

  if (!data.phone || data.phone.trim().length < 7) {
    errors.phone = 'Valid phone number is required.';
  }

  if (data.paymentMethod === 'credit_card') {
    const cleanCard = (data.cardNumber || '').replace(/\s+/g, '');
    if (!cleanCard || cleanCard.length < 13 || cleanCard.length > 19 || !/^\d+$/.test(cleanCard)) {
      errors.cardNumber = 'Enter a valid 13-19 digit card number.';
    }

    if (!data.cardExp || !/^(0[1-9]|1[0-2])\/(\d{2})$/.test(data.cardExp)) {
      errors.cardExp = 'Expiration must be in MM/YY format.';
    }

    if (!data.cardCvc || !/^\d{3,4}$/.test(data.cardCvc)) {
      errors.cardCvc = 'CVC must be 3 or 4 digits.';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

export function createSuccessResponse<T>(data: T): ApiResponseSuccess<T> {
  return {
    success: true,
    data,
    timestamp: new Date().toISOString(),
  };
}

export function createErrorResponse(
  code: string,
  message: string,
  details?: unknown
): ApiResponseError {
  return {
    success: false,
    error: {
      code,
      message,
      details,
    },
    timestamp: new Date().toISOString(),
  };
}

export function safeParseJson<T>(jsonString: string, fallback: T): T {
  try {
    return JSON.parse(jsonString) as T;
  } catch {
    return fallback;
  }
}
