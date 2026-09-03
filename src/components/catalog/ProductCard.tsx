import React from 'react';
import { ShoppingBag, Eye, Star, AlertCircle, Check } from 'lucide-react';
import { Product } from '../../types/ecommerce';
import { useCart } from '../../context/CartContext';
import { useCommerce } from '../../context/CommerceContext';

interface ProductCardProps {
  product: Product;
  viewMode?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, viewMode = 'grid' }) => {
  const { addToCart } = useCart();
  const { setSelectedProductForDetail, setQuickViewProduct, setActiveView } = useCommerce();

  const isOutOfStock = product.stock <= 0;
  const isLowStock = product.stock > 0 && product.stock <= 5;

  const handleOpenDetail = () => {
    setSelectedProductForDetail(product);
    setActiveView('detail');
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!isOutOfStock) {
      addToCart(product, 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  if (viewMode === 'list') {
    return (
      <div
        onClick={handleOpenDetail}
        className="group bg-white border border-neutral-200 hover:border-neutral-400 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row gap-5 transition-all shadow-xs hover:shadow-md cursor-pointer"
      >
        <div className="relative w-full sm:w-48 sm:h-48 aspect-square rounded-xl overflow-hidden bg-neutral-100 shrink-0">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
            referrerPolicy="no-referrer"
          />
          {product.isFeatured && (
            <span className="absolute top-2.5 left-2.5 bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider">
              Featured
            </span>
          )}
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-amber-500 text-xs font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-neutral-400 font-normal">({product.reviewCount})</span>
              </div>
            </div>

            <h3 className="text-base sm:text-lg font-bold text-neutral-900 mt-1 group-hover:text-neutral-700 transition-colors">
              {product.name}
            </h3>
            <p className="text-xs text-neutral-600 mt-1.5 line-clamp-2 leading-relaxed">
              {product.description}
            </p>
            <p className="text-[11px] font-mono text-neutral-400 mt-1">SKU: {product.sku}</p>
          </div>

          <div className="flex items-center justify-between mt-4 pt-3 border-t border-neutral-100">
            <div>
              <span className="text-xl font-extrabold text-neutral-900 font-display">
                ${product.price.toFixed(2)}
              </span>
              <div className="text-xs mt-0.5">
                {isOutOfStock ? (
                  <span className="text-red-600 font-semibold flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> Out of stock
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-600 font-semibold">
                    Only {product.stock} units remaining!
                  </span>
                ) : (
                  <span className="text-emerald-700 font-medium">In Stock ({product.stock})</span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleQuickView}
                className="p-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-100 transition-colors cursor-pointer"
                title="Quick View"
              >
                <Eye className="w-4 h-4" />
              </button>
              <button
                type="button"
                disabled={isOutOfStock}
                onClick={handleAddToCart}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold tracking-tight transition-colors cursor-pointer ${
                  isOutOfStock
                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                    : 'bg-neutral-900 hover:bg-neutral-800 text-white'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isOutOfStock ? 'Sold Out' : 'Add to Bag'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={handleOpenDetail}
      className="group bg-white border border-neutral-200 hover:border-neutral-400 rounded-2xl overflow-hidden flex flex-col justify-between transition-all duration-200 shadow-xs hover:shadow-md cursor-pointer"
    >
      <div className="relative aspect-square bg-neutral-100 overflow-hidden">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10">
          {product.isFeatured && (
            <span className="bg-neutral-900 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              Featured
            </span>
          )}
          {isLowStock && (
            <span className="bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              Low Stock ({product.stock})
            </span>
          )}
          {isOutOfStock && (
            <span className="bg-red-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-xs">
              Out of Stock
            </span>
          )}
        </div>

        {/* Hover Quick Action overlay */}
        <div className="absolute inset-0 bg-neutral-900/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-4">
          <button
            type="button"
            onClick={handleQuickView}
            className="p-3 bg-white text-neutral-900 rounded-xl shadow-md hover:scale-105 transition-transform cursor-pointer"
            title="Quick View"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-semibold text-neutral-400 uppercase tracking-wider text-[10px]">
              {product.category}
            </span>
            <div className="flex items-center gap-1 text-amber-500 font-bold text-[11px]">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating.toFixed(1)}</span>
            </div>
          </div>

          <h3 className="text-sm sm:text-base font-bold text-neutral-900 line-clamp-1 group-hover:text-neutral-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-neutral-500 mt-1 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-neutral-100 flex items-center justify-between">
          <div>
            <span className="text-base sm:text-lg font-extrabold text-neutral-900 font-display">
              ${product.price.toFixed(2)}
            </span>
            <span className="block text-[10px] font-mono text-neutral-400">
              {product.stock > 0 ? `${product.stock} in warehouse` : 'Restocking soon'}
            </span>
          </div>

          <button
            type="button"
            disabled={isOutOfStock}
            onClick={handleAddToCart}
            className={`flex items-center justify-center p-2.5 rounded-xl transition-all cursor-pointer ${
              isOutOfStock
                ? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
                : 'bg-neutral-900 hover:bg-neutral-800 text-white shadow-xs hover:shadow-sm'
            }`}
            title={isOutOfStock ? 'Sold Out' : 'Add to Cart'}
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
