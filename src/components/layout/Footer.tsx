import React, { useState } from 'react';
import { ShieldCheck, Truck, RotateCcw, Headphones, Lock, ArrowRight, Check } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const Footer: React.FC = () => {
  const { setFilters, setActiveView } = useCommerce();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.includes('@')) {
      setSubscribed(true);
      setNewsletterEmail('');
    }
  };

  return (
    <footer className="bg-neutral-900 text-neutral-300 border-t border-neutral-800 pt-16 pb-12">
      {/* Value Proposition Badges */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 rounded-3xl bg-neutral-950/60 border border-neutral-800">
          <div className="flex items-start gap-4 p-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0 border border-neutral-700">
              <Truck className="w-5 h-5 text-neutral-200" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Free Expedited Delivery</h4>
              <p className="text-xs text-neutral-400 mt-1">Automatic complimentary shipping on all orders over $150.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0 border border-neutral-700">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">ABAC Security Guard</h4>
              <p className="text-xs text-neutral-400 mt-1">Zero-Trust hardened database rules blocking update gaps.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0 border border-neutral-700">
              <RotateCcw className="w-5 h-5 text-neutral-200" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">30-Day Flawless Returns</h4>
              <p className="text-xs text-neutral-400 mt-1">No-hassle returns and instant refunds on unaltered catalog items.</p>
            </div>
          </div>

          <div className="flex items-start gap-4 p-2">
            <div className="w-10 h-10 rounded-xl bg-neutral-800 text-white flex items-center justify-center shrink-0 border border-neutral-700">
              <Headphones className="w-5 h-5 text-neutral-200" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Dedicated Support</h4>
              <p className="text-xs text-neutral-400 mt-1">Real-time technical assistance and order fulfillment tracking.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-neutral-800">
        <div className="md:col-span-2 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white text-neutral-900 flex items-center justify-center font-bold text-sm">
              A
            </div>
            <span className="text-lg font-extrabold text-white tracking-wider font-display">AURA COMMERCE</span>
          </div>
          <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
            Engineered modern e-commerce platform incorporating strict type safety, real-time inventory management, responsive CSS analytics charts, and Zero-Trust Firestore Security architecture.
          </p>
          <div className="flex items-center gap-2 text-[11px] font-mono text-neutral-400 bg-neutral-950 px-3 py-1.5 rounded-lg border border-neutral-800 w-fit">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span>Encrypted Sandbox Environment (Port 3000)</span>
          </div>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Catalog</h5>
          <ul className="space-y-2 text-xs text-neutral-400">
            {['Electronics', 'Apparel', 'Home & Living', 'Accessories', 'Footwear'].map(cat => (
              <li key={`footer-cat-${cat}`}>
                <button
                  type="button"
                  onClick={() => {
                    setFilters({ category: cat });
                    setActiveView('catalog');
                  }}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  {cat}
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Security & Admin</h5>
          <ul className="space-y-2 text-xs text-neutral-400">
            <li>
              <button
                type="button"
                onClick={() => setActiveView('admin')}
                className="hover:text-emerald-400 transition-colors cursor-pointer flex items-center gap-1"
              >
                <span>Admin Console</span>
              </button>
            </li>
            <li>
              <span className="text-neutral-500">ABAC Verification v2</span>
            </li>
            <li>
              <span className="text-neutral-500">PCI Mock Payment Engine</span>
            </li>
            <li>
              <span className="text-neutral-500">Real-Time Inventory Mutex</span>
            </li>
          </ul>
        </div>

        <div>
          <h5 className="text-xs font-bold uppercase tracking-wider text-white mb-4">Stay Informed</h5>
          <p className="text-xs text-neutral-400 mb-3">
            Receive exclusive seasonal capsule announcements and drop notifications.
          </p>
          {subscribed ? (
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/50 p-2.5 rounded-xl border border-emerald-800/60">
              <Check className="w-4 h-4" />
              <span>Subscribed to Aura drops!</span>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@domain.com"
                  value={newsletterEmail}
                  onChange={e => setNewsletterEmail(e.target.value)}
                  className="w-full bg-neutral-950 border border-neutral-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-neutral-500 focus:outline-none focus:border-neutral-400"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 p-1 bg-white text-neutral-900 rounded-lg hover:bg-neutral-200 cursor-pointer"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 font-mono">
        <p>© {new Date().getFullYear()} Aura Commerce Inc. All operational files generated completely.</p>
        <p className="flex items-center gap-2">
          <span>Security Rules: Active</span>
          <span>•</span>
          <span>Next.js App Router Architecture</span>
        </p>
      </div>
    </footer>
  );
};
