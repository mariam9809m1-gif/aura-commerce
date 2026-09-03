import React from 'react';
import { Package, RotateCcw } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { ProductFilter } from './ProductFilter';
import { ProductCard } from './ProductCard';
import { CatalogSkeleton } from '../common/LoadingSkeleton';

export const CatalogPage: React.FC = () => {
  const { filteredProducts, filters, resetFilters, loading } = useCommerce();

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <CatalogSkeleton count={8} />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          {filters.category === 'All' ? 'All Products' : filters.category}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 mt-1">
          Explore current releases with verified stock counts and real-time inventory management.
        </p>
      </div>

      {/* Dynamic Filters & Sorter */}
      <ProductFilter />

      {/* Products Grid or List */}
      {filteredProducts.length === 0 ? (
        <div className="bg-white border border-neutral-200 rounded-3xl p-16 text-center space-y-4 shadow-xs">
          <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto text-neutral-400">
            <Package className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-base font-bold text-neutral-900">No matching products found</h3>
            <p className="text-xs text-neutral-500 mt-1 max-w-sm mx-auto">
              We couldn't locate any products matching your active filter criteria. Try expanding your price range or clearing filters.
            </p>
          </div>
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-neutral-900 text-white rounded-xl text-xs font-semibold cursor-pointer hover:bg-neutral-800 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : filters.viewMode === 'list' ? (
        <div className="space-y-4">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} viewMode="list" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      )}
    </div>
  );
};
