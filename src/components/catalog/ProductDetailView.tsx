import React, { useState } from 'react';
import {
  ArrowLeft,
  Star,
  ShoppingBag,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Plus,
  Minus,
  Share2,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { useCart } from '../../context/CartContext';
import { ProductCard } from './ProductCard';

export const ProductDetailView: React.FC = () => {
  const { selectedProductForDetail, setActiveView, setSelectedProductForDetail, products } = useCommerce();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [copiedLink, setCopiedLink] = useState(false);

  if (!selectedProductForDetail) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <p className="text-neutral-500 mb-4">No product selected.</p>
        <button
          type="button"
          onClick={() => setActiveView('catalog')}
          className="px-4 py-2 bg-neutral-900 text-white rounded-xl text-xs font-semibold cursor-pointer"
        >
          Return to Catalog
        </button>
      </div>
    );
  }

  const product = selectedProductForDetail;
  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleAddToCart = () => {
    if (!isOutOfStock) {
      addToCart(product, quantity);
    }
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Related products from same category
  const related = products
    .filter(p => p.category === product.category && p.id !== product.id)
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-neutral-500 mb-8 font-medium">
        <button
          type="button"
          onClick={() => setActiveView('home')}
          className="hover:text-neutral-900 cursor-pointer"
        >
          Home
        </button>
        <span>/</span>
        <button
          type="button"
          onClick={() => setActiveView('catalog')}
          className="hover:text-neutral-900 cursor-pointer"
        >
          Catalog
        </button>
        <span>/</span>
        <span className="text-neutral-400">{product.category}</span>
        <span>/</span>
        <span className="text-neutral-900 truncate max-w-xs">{product.name}</span>
      </nav>

      <button
        type="button"
        onClick={() => setActiveView('catalog')}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-neutral-900 mb-6 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to all products</span>
      </button>

      {/* Main Showcase Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pb-16 border-b border-neutral-200">
        {/* Left: High-Res Imagery */}
        <div className="space-y-4">
          <div className="relative aspect-square rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200 shadow-xs">
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            {product.isFeatured && (
              <span className="absolute top-4 left-4 bg-neutral-900 text-white text-xs font-bold px-3 py-1 rounded-lg uppercase tracking-wider">
                Featured Exclusive
              </span>
            )}
          </div>
          <div className="flex items-center justify-between text-xs text-neutral-500 font-mono px-2">
            <span>SKU: {product.sku}</span>
            <button
              type="button"
              onClick={handleShare}
              className="flex items-center gap-1 hover:text-neutral-900 cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>{copiedLink ? 'Link Copied!' : 'Share Product'}</span>
            </button>
          </div>
        </div>

        {/* Right: Commercial Information & Cart Action */}
        <div className="flex flex-col justify-between space-y-6">
          <div>
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                {product.category}
              </span>
              <div className="flex items-center gap-1.5 text-amber-500 font-bold text-xs">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">
                  ({product.reviewCount} customer reviews)
                </span>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 mt-2 font-display">
              {product.name}
            </h1>

            <div className="mt-4 flex items-baseline gap-4">
              <span className="text-3xl font-extrabold text-neutral-900 font-display">
                ${product.price.toFixed(2)}
              </span>
              <span className="text-xs font-medium">
                {isOutOfStock ? (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" /> Low Stock: {product.stock} units remaining!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Ready to ship ({product.stock} in warehouse)
                  </span>
                )}
              </span>
            </div>

            <p className="text-sm text-neutral-600 mt-5 leading-relaxed">
              {product.description}
            </p>

            {/* Product Specifications Table */}
            {product.specs && Object.keys(product.specs).length > 0 && (
              <div className="mt-6 pt-6 border-t border-neutral-200">
                <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-900 mb-3">
                  Technical Specifications
                </h3>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {Object.entries(product.specs).map(([key, val]) => (
                    <div key={key} className="bg-neutral-50 p-3 rounded-xl border border-neutral-200">
                      <span className="text-neutral-400 block text-[11px]">{key}</span>
                      <span className="font-semibold text-neutral-800 mt-0.5 block">{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Purchasing Controls */}
          <div className="space-y-4 pt-4 border-t border-neutral-200">
            {!isOutOfStock && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
                <div className="flex items-center border border-neutral-300 rounded-xl overflow-hidden bg-neutral-50">
                  <button
                    type="button"
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="p-2.5 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-12 text-center text-xs font-bold font-mono">
                    {quantity}
                  </span>
                  <button
                    type="button"
                    disabled={quantity >= product.stock}
                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                    className="p-2.5 text-neutral-600 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex-1 py-4 px-6 rounded-2xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-md hover:shadow-lg'
                }`}
              >
                <ShoppingBag className="w-5 h-5" />
                <span>{isOutOfStock ? 'Currently Sold Out' : `Add ${quantity} to Shopping Bag`}</span>
              </button>
            </div>

            {/* Reassurance Grid */}
            <div className="grid grid-cols-3 gap-3 pt-4 text-[11px] text-neutral-500 font-medium">
              <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                <Truck className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>Free Ship &gt;$150</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                <RotateCcw className="w-4 h-4 text-neutral-700 shrink-0" />
                <span>30-Day Returns</span>
              </div>
              <div className="flex items-center gap-2 p-2 bg-neutral-50 rounded-xl border border-neutral-100">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Authentic Aura</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products Carousel */}
      {related.length > 0 && (
        <div className="pt-16">
          <h2 className="text-xl font-bold text-neutral-900 mb-6">
            Complementary in {product.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map(rel => (
              <ProductCard key={rel.id} product={rel} viewMode="grid" />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
