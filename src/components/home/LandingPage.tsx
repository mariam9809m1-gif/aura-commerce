import React from 'react';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  ShoppingBag,
  TrendingUp,
  RotateCcw,
  Star,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { ProductCard } from '../catalog/ProductCard';

export const LandingPage: React.FC = () => {
  const { products, setFilters, setActiveView } = useCommerce();

  const featured = products.filter(p => p.isFeatured).slice(0, 4);

  const CATEGORIES = [
    {
      title: 'Electronics',
      subtitle: 'Spatial audio & precision optics',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
      category: 'Electronics',
    },
    {
      title: 'Apparel',
      subtitle: 'Italian merino wool & organic cotton',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&q=80',
      category: 'Apparel',
    },
    {
      title: 'Home & Living',
      subtitle: 'Ceramic acoustics & diffuse lighting',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&q=80',
      category: 'Home & Living',
    },
    {
      title: 'Footwear',
      subtitle: 'Kinetic response vulcanized trainers',
      image: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800&q=80',
      category: 'Footwear',
    },
  ];

  const handleExploreCategory = (cat: string) => {
    setFilters({ category: cat });
    setActiveView('catalog');
  };

  return (
    <div className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-neutral-900 text-white rounded-3xl mx-4 sm:mx-6 lg:mx-8 mt-4 border border-neutral-800">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-neutral-800 via-neutral-900 to-neutral-950 opacity-90" />

        <div className="relative max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-neutral-800/80 border border-neutral-700 text-xs font-mono text-neutral-300">
              <span className="w-2 h-2 rounded-full bg-emerald-400" />
              <span>Spring / Summer 2026 Capsule</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-display leading-[1.1]">
              Essential Objects for the Discerning Minimalist.
            </h1>

            <p className="text-sm sm:text-base text-neutral-400 max-w-lg leading-relaxed">
              Engineered with uncompromising material fidelity and backed by Zero-Trust verifiable architecture. Discover crafted electronics, organic textiles, and living artifacts.
            </p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                type="button"
                onClick={() => {
                  setFilters({ category: 'All' });
                  setActiveView('catalog');
                }}
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl bg-white text-neutral-900 text-xs sm:text-sm font-bold hover:bg-neutral-100 transition-all cursor-pointer shadow-md"
              >
                <span>Explore Catalog</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => handleExploreCategory('Electronics')}
                className="px-6 py-3.5 rounded-xl border border-neutral-700 text-white text-xs sm:text-sm font-semibold hover:bg-neutral-800/50 transition-colors cursor-pointer"
              >
                View Audio Series
              </button>
            </div>
          </div>

          {/* Hero Showcase Card */}
          <div className="relative lg:block">
            <div className="relative rounded-2xl overflow-hidden border border-neutral-700/60 shadow-2xl aspect-4/3 group">
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1000&q=80"
                alt="Aura Studio Pro"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-6 left-6 right-6 flex items-end justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-emerald-400 block font-bold">
                    Featured Release
                  </span>
                  <h3 className="text-lg font-bold text-white mt-0.5">
                    Aura Studio Headphones
                  </h3>
                  <p className="text-xs text-neutral-300 font-mono mt-0.5">$349.00 • Active Stock</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const audioProd = products.find(p => p.sku === 'AUR-AUD-01');
                    if (audioProd) {
                      setFilters({ searchQuery: 'Aura Studio' });
                      setActiveView('catalog');
                    }
                  }}
                  className="p-3 rounded-xl bg-white text-neutral-900 font-bold hover:bg-neutral-100 cursor-pointer shadow-md"
                >
                  <ShoppingBag className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Department Spotlight Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display">
              Curated Departments
            </h2>
            <p className="text-xs text-neutral-500 mt-1">
              Select a specialized category to inspect inventory items.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className="text-xs font-bold text-neutral-900 hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {CATEGORIES.map(cat => (
            <div
              key={cat.title}
              onClick={() => handleExploreCategory(cat.category)}
              className="group relative rounded-2xl overflow-hidden aspect-4/5 bg-neutral-100 border border-neutral-200 cursor-pointer shadow-xs hover:shadow-md transition-all"
            >
              <img
                src={cat.image}
                alt={cat.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-[10px] font-mono text-neutral-300 uppercase tracking-widest block">
                  Department
                </span>
                <h3 className="text-base font-bold font-display mt-0.5">{cat.title}</h3>
                <p className="text-[11px] text-neutral-300 mt-1 line-clamp-1">{cat.subtitle}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-1.5 text-xs font-mono text-neutral-500 font-semibold mb-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Handcrafted Quality</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-neutral-900 font-display">
              Featured Picks
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className="text-xs font-bold text-neutral-900 hover:text-neutral-700 flex items-center gap-1 cursor-pointer"
          >
            <span>View Full Catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featured.map(product => (
            <ProductCard key={product.id} product={product} viewMode="grid" />
          ))}
        </div>
      </section>

      {/* Architecture & Trust Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-neutral-50 rounded-3xl border border-neutral-200 p-8 sm:p-12 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">ABAC Hardened Security</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Simulated Master-Gate Firestore security rules blocking update-gaps and securing order fulfillment routes.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shadow-xs">
              <Truck className="w-5 h-5 text-neutral-900" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">Real-Time Inventory Mutex</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Warehouse stock automatically decrements upon checkout authorization, preventing overselling anomalies.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white border border-neutral-200 flex items-center justify-center text-neutral-900 shadow-xs">
              <TrendingUp className="w-5 h-5 text-neutral-900" />
            </div>
            <h4 className="text-sm font-bold text-neutral-900">Responsive CSS Analytics</h4>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Native CSS flex charts tracking sales volume, basket value, and department ratios with zero heavy chart bloat.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
