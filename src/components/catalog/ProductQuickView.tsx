import React, { useState } from 'react';
import { X, Star, ShoppingBag, ShieldCheck, Truck, RotateCcw, Plus, Minus } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { useCart } from '../../context/CartContext';

export const ProductQuickView: React.FC = () => {
  const { quickViewProduct, setQuickViewProduct, setSelectedProductForDetail, setActiveView } = useCommerce();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);

  if (!quickViewProduct) return null;

  const isOutOfStock = quickViewProduct.stock <= 0;

  const handleAdd = () => {
    if (!isOutOfStock) {
      addToCart(quickViewProduct, quantity);
      setQuickViewProduct(null);
    }
  };

  const handleViewFullDetail = () => {
    setSelectedProductForDetail(quickViewProduct);
    setQuickViewProduct(null);
    setActiveView('detail');
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-neutral-200 max-w-3xl w-full overflow-hidden shadow-2xl relative animate-in fade-in zoom-in-95 duration-150">
        <button
          type="button"
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-white/90 hover:bg-neutral-100 text-neutral-600 transition-colors cursor-pointer shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Image */}
          <div className="relative aspect-square bg-neutral-100 overflow-hidden">
            <img
              src={quickViewProduct.imageUrl}
              alt={quickViewProduct.name}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />
            <span className="absolute bottom-3 left-3 bg-neutral-900 text-white text-[11px] font-mono px-2.5 py-1 rounded-md">
              SKU: {quickViewProduct.sku}
            </span>
          </div>

          {/* Details */}
          <div className="p-6 md:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                  {quickViewProduct.category}
                </span>
                <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{quickViewProduct.rating.toFixed(1)}</span>
                  <span className="text-neutral-400 font-normal">
                    ({quickViewProduct.reviewCount} reviews)
                  </span>
                </div>
              </div>

              <h2 className="text-xl font-bold text-neutral-900 leading-tight">
                {quickViewProduct.name}
              </h2>

              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl font-extrabold text-neutral-900 font-display">
                  ${quickViewProduct.price.toFixed(2)}
                </span>
                <span className="text-xs font-medium text-neutral-500">
                  {isOutOfStock ? (
                    <span className="text-red-600 font-semibold">Out of Stock</span>
                  ) : (
                    <span className="text-emerald-700 font-semibold">
                      {quickViewProduct.stock} units available
                    </span>
                  )}
                </span>
              </div>

              <p className="text-xs text-neutral-600 mt-4 leading-relaxed line-clamp-3">
                {quickViewProduct.description}
              </p>

              {/* Specs pill list */}
              {quickViewProduct.specs && (
                <div className="mt-4 pt-3 border-t border-neutral-100 grid grid-cols-2 gap-2 text-[11px]">
                  {Object.entries(quickViewProduct.specs).slice(0, 4).map(([key, val]) => (
                    <div key={key} className="bg-neutral-50 p-2 rounded-lg border border-neutral-100">
                      <span className="text-neutral-400 block">{key}</span>
                      <span className="font-semibold text-neutral-800">{val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-4 pt-2">
              {/* Quantity Picker */}
              {!isOutOfStock && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-neutral-700">Quantity:</span>
                  <div className="flex items-center border border-neutral-200 rounded-xl overflow-hidden bg-neutral-50">
                    <button
                      type="button"
                      disabled={quantity <= 1}
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="p-2 text-neutral-600 hover:bg-neutral-200 disabled:opacity-40 cursor-pointer"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="w-10 text-center text-xs font-bold font-mono">
                      {quantity}
                    </span>
                    <button
                      type="button"
                      disabled={quantity >= quickViewProduct.stock}
                      onClick={() => setQuantity(q => Math.min(quickViewProduct.stock, q + 1))}
                      className="p-2 text-neutral-600 hover:bg-neutral-200 disabled:opacity-40 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <button
                  type="button"
                  disabled={isOutOfStock}
                  onClick={handleAdd}
                  className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                    isOutOfStock
                      ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                      : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-sm'
                  }`}
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{isOutOfStock ? 'Sold Out' : `Add ${quantity} to Bag`}</span>
                </button>

                <button
                  type="button"
                  onClick={handleViewFullDetail}
                  className="py-3 px-4 rounded-xl border border-neutral-200 text-neutral-800 hover:bg-neutral-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Full Details
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
