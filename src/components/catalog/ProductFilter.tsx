import React from 'react';
import { SlidersHorizontal, RotateCcw, LayoutGrid, List, Check, Star } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { ProductCategory } from '../../types/ecommerce';

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: 'All', value: 'All' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Apparel', value: 'Apparel' },
  { label: 'Home & Living', value: 'Home & Living' },
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Footwear', value: 'Footwear' },
];

export const ProductFilter: React.FC = () => {
  const { filters, setFilters, resetFilters, filteredProducts, products } = useCommerce();

  const isFiltered =
    filters.category !== 'All' ||
    filters.minPrice > 0 ||
    filters.maxPrice < 1000 ||
    filters.minRating > 0 ||
    filters.inStockOnly ||
    filters.searchQuery !== '';

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 mb-8 shadow-xs">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-neutral-100">
        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          {CATEGORIES.map(cat => {
            const isSelected = filters.category === cat.value;
            const count =
              cat.value === 'All'
                ? products.length
                : products.filter(p => p.category === cat.value).length;

            return (
              <button
                key={`filter-${cat.value}`}
                type="button"
                onClick={() => setFilters({ category: cat.value })}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold tracking-tight transition-all cursor-pointer flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-neutral-900 text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-md ${
                    isSelected ? 'bg-neutral-800 text-neutral-300' : 'bg-neutral-200 text-neutral-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* View Mode & Sorter */}
        <div className="flex items-center gap-3 self-end lg:self-auto">
          {/* Sorting */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-neutral-500 font-medium">Sort by:</span>
            <select
              value={filters.sortBy}
              onChange={e => setFilters({ sortBy: e.target.value as any })}
              className="bg-neutral-100 border border-neutral-200 rounded-xl px-3 py-1.5 text-xs font-semibold text-neutral-800 focus:outline-none focus:bg-white cursor-pointer"
            >
              <option value="featured">Featured Picks</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
              <option value="newest">Newest Releases</option>
            </select>
          </div>

          {/* Grid/List View Switch */}
          <div className="flex items-center bg-neutral-100 p-1 rounded-xl border border-neutral-200">
            <button
              type="button"
              onClick={() => setFilters({ viewMode: 'grid' })}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filters.viewMode === 'grid' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => setFilters({ viewMode: 'list' })}
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                filters.viewMode === 'list' ? 'bg-white text-neutral-900 shadow-xs' : 'text-neutral-400 hover:text-neutral-700'
              }`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Secondary Dynamic Controls: Price Slider, Rating, Stock Toggle */}
      <div className="pt-4 flex flex-col md:flex-row md:items-center justify-between gap-5 text-xs">
        <div className="flex flex-wrap items-center gap-6">
          {/* Max Price Slider */}
          <div className="flex items-center gap-3">
            <span className="text-neutral-500 font-medium">Max Price:</span>
            <input
              type="range"
              min="50"
              max="1000"
              step="25"
              value={filters.maxPrice}
              onChange={e => setFilters({ maxPrice: Number(e.target.value) })}
              className="w-28 sm:w-36 accent-neutral-900 cursor-pointer"
            />
            <span className="font-bold text-neutral-900 font-mono w-14">
              ${filters.maxPrice}
            </span>
          </div>

          {/* Rating filter */}
          <div className="flex items-center gap-2">
            <span className="text-neutral-500 font-medium">Rating:</span>
            <div className="flex items-center gap-1">
              {[0, 4.0, 4.5, 4.8].map(rating => (
                <button
                  key={`rate-btn-${rating}`}
                  type="button"
                  onClick={() => setFilters({ minRating: rating })}
                  className={`px-2 py-1 rounded-lg font-medium transition-colors cursor-pointer ${
                    filters.minRating === rating
                      ? 'bg-amber-100 text-amber-900 font-bold'
                      : 'bg-neutral-50 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {rating === 0 ? 'All' : `${rating}★+`}
                </button>
              ))}
            </div>
          </div>

          {/* In stock toggle */}
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={filters.inStockOnly}
              onChange={e => setFilters({ inStockOnly: e.target.checked })}
              className="w-4 h-4 rounded text-neutral-900 focus:ring-0 cursor-pointer"
            />
            <span className="text-neutral-700 font-medium">In Stock Only</span>
          </label>
        </div>

        {/* Status Counter & Reset */}
        <div className="flex items-center justify-between sm:justify-end gap-4 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-100">
          <span className="text-neutral-500 font-mono text-[11px]">
            Showing <strong className="text-neutral-900">{filteredProducts.length}</strong> of {products.length} products
          </span>

          {isFiltered && (
            <button
              type="button"
              onClick={resetFilters}
              className="flex items-center gap-1 text-neutral-500 hover:text-neutral-900 font-semibold cursor-pointer underline underline-offset-4"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
