import React, { useState } from 'react';
import {
  ShoppingBag,
  Search,
  SlidersHorizontal,
  Shield,
  ShieldCheck,
  UserCheck,
  User as UserIcon,
  Menu,
  X,
  Lock,
  ChevronDown,
  Sparkles,
  Layers,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { ProductCategory } from '../../types/ecommerce';

const CATEGORIES: Array<{ label: string; value: string }> = [
  { label: 'All Products', value: 'All' },
  { label: 'Electronics', value: 'Electronics' },
  { label: 'Apparel', value: 'Apparel' },
  { label: 'Home & Living', value: 'Home & Living' },
  { label: 'Accessories', value: 'Accessories' },
  { label: 'Footwear', value: 'Footwear' },
];

export const Navbar: React.FC = () => {
  const { filters, setFilters, activeView, setActiveView, setSelectedProductForDetail } = useCommerce();
  const { itemCount, openCart } = useCart();
  const { user, role, isAdmin, loginAs, verifyAdminPasskey } = useAuth();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [adminPasskeyModalOpen, setAdminPasskeyModalOpen] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);

  const handleCategorySelect = (categoryValue: string) => {
    setFilters({ category: categoryValue });
    if (activeView !== 'catalog' && activeView !== 'home') {
      setActiveView('catalog');
    }
    setMobileMenuOpen(false);
  };

  const handleAdminNavClick = () => {
    if (isAdmin) {
      setActiveView('admin');
    } else {
      setAdminPasskeyModalOpen(true);
    }
    setMobileMenuOpen(false);
  };

  const handlePasskeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const success = verifyAdminPasskey(passkeyInput);
    if (success) {
      setAdminPasskeyModalOpen(false);
      setPasskeyInput('');
      setPasskeyError(false);
      setActiveView('admin');
    } else {
      setPasskeyError(true);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-neutral-200">
        {/* Top security bar */}
        <div className="bg-neutral-900 text-neutral-300 text-xs px-4 py-1.5 flex items-center justify-between font-mono">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="hidden sm:inline">Zero-Trust Environment Active</span>
            <span className="sm:hidden">Zero-Trust Active</span>
            <span className="text-neutral-500">|</span>
            <span className="text-neutral-400">Strict ABAC Enforced</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-neutral-400 hidden md:inline">
              Role: <strong className="text-white uppercase">{role}</strong>
            </span>
            <button
              type="button"
              onClick={handleAdminNavClick}
              className={`flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-semibold transition-colors cursor-pointer ${
                isAdmin
                  ? 'bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30'
                  : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700'
              }`}
            >
              {isAdmin ? <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3 h-3 text-amber-400" />}
              <span>{isAdmin ? 'Admin Console' : 'Admin Portal (Hidden)'}</span>
            </button>
          </div>
        </div>

        {/* Main Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 gap-4">
            {/* Logo */}
            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={() => {
                  setSelectedProductForDetail(null);
                  setActiveView('home');
                }}
                className="flex items-center gap-2 text-left cursor-pointer group"
              >
                <div className="w-9 h-9 rounded-xl bg-neutral-900 text-white flex items-center justify-center font-bold text-lg tracking-wider shadow-sm group-hover:bg-neutral-800 transition-colors">
                  A
                </div>
                <div className="leading-tight">
                  <span className="text-xl font-extrabold tracking-tight text-neutral-900 font-display">
                    AURA
                  </span>
                  <span className="block text-[10px] tracking-widest uppercase font-semibold text-neutral-500">
                    COMMERCE
                  </span>
                </div>
              </button>

              {/* Desktop Category Navigation */}
              <nav className="hidden lg:flex items-center gap-1">
                {CATEGORIES.slice(0, 5).map(cat => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => handleCategorySelect(cat.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-tight transition-colors cursor-pointer ${
                      filters.category === cat.value && activeView !== 'admin'
                        ? 'bg-neutral-900 text-white'
                        : 'text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md hidden md:block">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search products by title, SKU, or tags..."
                  value={filters.searchQuery}
                  onChange={e => {
                    setFilters({ searchQuery: e.target.value });
                    if (activeView !== 'catalog' && activeView !== 'home') {
                      setActiveView('catalog');
                    }
                  }}
                  className="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-xs sm:text-sm text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-300 transition-all"
                />
                {filters.searchQuery && (
                  <button
                    type="button"
                    onClick={() => setFilters({ searchQuery: '' })}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-3">
              {/* Role Switcher Menu */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl border border-neutral-200 bg-neutral-50 hover:bg-neutral-100 text-neutral-800 text-xs font-medium transition-colors cursor-pointer"
                >
                  <div className="w-5 h-5 rounded-full bg-neutral-200 flex items-center justify-center text-neutral-700 text-[10px] font-bold">
                    {role === 'admin' ? 'AD' : role === 'customer' ? 'CU' : 'GU'}
                  </div>
                  <span className="hidden sm:inline capitalize font-semibold">{role}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-neutral-400" />
                </button>

                {roleDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
                    <div className="px-3 py-2 border-b border-neutral-100">
                      <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
                        Simulated RBAC Tier
                      </p>
                      <p className="text-xs font-bold text-neutral-800 mt-0.5">
                        {user?.name || 'Guest User'}
                      </p>
                      <p className="text-[11px] text-neutral-500 truncate">
                        {user?.email || 'No email attached'}
                      </p>
                    </div>

                    <div className="py-1 space-y-0.5">
                      <button
                        type="button"
                        onClick={() => {
                          loginAs('customer');
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                          role === 'customer'
                            ? 'bg-neutral-100 font-semibold text-neutral-900'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <UserCheck className="w-4 h-4 text-neutral-500" />
                        <div>
                          <span>Customer Account</span>
                          <span className="block text-[10px] text-neutral-400">Can browse, cart & checkout</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          loginAs('admin');
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                          role === 'admin'
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <div>
                          <span>Admin / Store Manager</span>
                          <span className="block text-[10px] text-neutral-400">Full inventory CRUD & metrics</span>
                        </div>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          loginAs('guest');
                          setRoleDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-left cursor-pointer transition-colors ${
                          role === 'guest'
                            ? 'bg-neutral-100 font-semibold text-neutral-900'
                            : 'text-neutral-600 hover:bg-neutral-50'
                        }`}
                      >
                        <UserIcon className="w-4 h-4 text-neutral-400" />
                        <div>
                          <span>Anonymous Guest</span>
                          <span className="block text-[10px] text-neutral-400">Restricted permissions</span>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Shopping Cart Button */}
              <button
                type="button"
                onClick={openCart}
                className="relative p-2.5 rounded-xl border border-neutral-200 bg-white hover:bg-neutral-50 text-neutral-800 transition-colors cursor-pointer group"
                aria-label="Shopping Cart"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-105 transition-transform text-neutral-700" />
                {itemCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 bg-neutral-900 text-white text-[11px] font-bold rounded-full flex items-center justify-center border-2 border-white shadow-sm animate-bounce">
                    {itemCount}
                  </span>
                )}
              </button>

              {/* Mobile menu trigger */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2.5 rounded-xl border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-neutral-200 bg-white px-4 pt-3 pb-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input
                type="text"
                placeholder="Search products..."
                value={filters.searchQuery}
                onChange={e => {
                  setFilters({ searchQuery: e.target.value });
                  setActiveView('catalog');
                }}
                className="w-full pl-10 pr-4 py-2 bg-neutral-100 border border-transparent rounded-xl text-sm"
              />
            </div>

            <div className="space-y-1">
              <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2">
                Departments
              </p>
              {CATEGORIES.map(cat => (
                <button
                  key={`mobile-${cat.value}`}
                  type="button"
                  onClick={() => handleCategorySelect(cat.value)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium cursor-pointer ${
                    filters.category === cat.value
                      ? 'bg-neutral-900 text-white'
                      : 'text-neutral-700 hover:bg-neutral-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            <div className="pt-2 border-t border-neutral-100">
              <button
                type="button"
                onClick={handleAdminNavClick}
                className="w-full flex items-center justify-between px-3 py-2.5 bg-neutral-100 rounded-xl text-sm font-semibold text-neutral-900 cursor-pointer"
              >
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  <span>Admin Dashboard</span>
                </div>
                <span className="text-xs bg-white px-2 py-0.5 rounded border border-neutral-200">
                  {isAdmin ? 'Access Granted' : 'Requires Passkey'}
                </span>
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin Passkey Verification Modal */}
      {adminPasskeyModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-md w-full p-6 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-100 text-amber-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-center text-neutral-900">
              Simulated Role Authentication
            </h3>
            <p className="text-xs text-center text-neutral-500 mt-1 mb-5">
              The Admin Dashboard is a protected route. Enter the demo access passkey to simulate elevated administrative authorization.
            </p>

            <form onSubmit={handlePasskeySubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-neutral-700 mb-1">
                  Admin Passkey
                </label>
                <input
                  type="password"
                  placeholder="Enter passkey (hint: admin123)"
                  value={passkeyInput}
                  onChange={e => {
                    setPasskeyInput(e.target.value);
                    setPasskeyError(false);
                  }}
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none ${
                    passkeyError
                      ? 'border-red-500 bg-red-50 focus:ring-1 focus:ring-red-500'
                      : 'border-neutral-200 bg-white focus:border-neutral-900'
                  }`}
                  autoFocus
                />
                {passkeyError && (
                  <p className="text-xs text-red-600 mt-1 font-medium">
                    Invalid passkey. Use <code>admin123</code> for demo access.
                  </p>
                )}
              </div>

              <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl text-[11px] text-neutral-600">
                <span className="font-semibold text-neutral-800">Demo Passkeys:</span>
                <span className="ml-1 font-mono text-neutral-900 font-bold">admin123</span> or click
                below to auto-elevate.
              </div>

              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setPasskeyInput('admin123');
                    verifyAdminPasskey('admin123');
                    setAdminPasskeyModalOpen(false);
                    setActiveView('admin');
                  }}
                  className="flex-1 py-2.5 px-4 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  One-Click Elevate
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                >
                  Authenticate
                </button>
              </div>

              <button
                type="button"
                onClick={() => setAdminPasskeyModalOpen(false)}
                className="w-full text-center text-xs text-neutral-400 hover:text-neutral-600 pt-1 cursor-pointer"
              >
                Cancel & Return
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
};
