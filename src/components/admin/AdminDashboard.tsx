import React, { useState } from 'react';
import {
  ShieldCheck,
  BarChart3,
  Package,
  Truck,
  RotateCcw,
  ArrowLeft,
  Lock,
  Sparkles,
  Key,
  Layers,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCommerce } from '../../context/CommerceContext';
import { AnalyticsCharts } from './AnalyticsCharts';
import { InventoryTable } from './InventoryTable';
import { OrdersManager } from './OrdersManager';

type AdminTab = 'analytics' | 'inventory' | 'orders';

export const AdminDashboard: React.FC = () => {
  const { user, role, isAdmin, verifyAdminPasskey, loginAs } = useAuth();
  const { setActiveView, resetToFactoryDefaults } = useCommerce();

  const [activeTab, setActiveTab] = useState<AdminTab>('analytics');
  const [passkeyInput, setPasskeyInput] = useState('');
  const [passkeyError, setPasskeyError] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);

  // If user is not admin, display the simulated Role-Based Auth gate
  if (!isAdmin) {
    const handlePasskeySubmit = (e: React.FormEvent) => {
      e.preventDefault();
      const ok = verifyAdminPasskey(passkeyInput);
      if (ok) {
        setPasskeyError(false);
      } else {
        setPasskeyError(true);
      }
    };

    return (
      <div className="max-w-md mx-auto px-4 py-20">
        <div className="bg-white rounded-3xl border border-neutral-200 p-8 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-neutral-900 text-white flex items-center justify-center mx-auto shadow-md">
            <Lock className="w-8 h-8 text-amber-400" />
          </div>

          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 font-bold">
              Restricted Route (Admin Only)
            </span>
            <h2 className="text-xl font-bold text-neutral-900 mt-3 font-display">
              Administrative Gate
            </h2>
            <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
              This route is protected by simulated Attribute-Based Access Control (ABAC). Enter the master passkey to access inventory CRUD, sales metrics, and fulfillment controls.
            </p>
          </div>

          <form onSubmit={handlePasskeySubmit} className="space-y-4 text-left">
            <div>
              <label className="block text-xs font-semibold text-neutral-700 mb-1">
                Admin Master Passkey
              </label>
              <div className="relative">
                <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                  type="password"
                  placeholder="admin123"
                  value={passkeyInput}
                  onChange={e => {
                    setPasskeyInput(e.target.value);
                    setPasskeyError(false);
                  }}
                  className={`w-full pl-10 pr-3.5 py-2.5 rounded-xl border text-xs focus:outline-none ${
                    passkeyError
                      ? 'border-red-500 bg-red-50'
                      : 'border-neutral-200 focus:border-neutral-900'
                  }`}
                  autoFocus
                />
              </div>
              {passkeyError && (
                <p className="text-[11px] text-red-600 mt-1 font-medium">
                  Authentication failed. Demo passkey is <code>admin123</code>.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  verifyAdminPasskey('admin123');
                }}
                className="flex-1 py-2.5 px-3 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-xs font-semibold text-neutral-700 cursor-pointer"
              >
                Auto-Authenticate
              </button>
              <button
                type="submit"
                className="flex-1 py-2.5 px-3 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-bold cursor-pointer"
              >
                Verify & Enter
              </button>
            </div>
          </form>

          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-1.5 text-xs text-neutral-500 hover:text-neutral-900 font-semibold cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Public Storefront</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Admin Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-emerald-50 text-emerald-700 rounded-lg border border-emerald-200">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <span className="text-xs font-mono font-bold text-emerald-800 uppercase tracking-wider">
              Admin Console Active
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-neutral-900 mt-1 font-display">
            Aura Enterprise Management
          </h1>
          <p className="text-xs text-neutral-500 mt-0.5">
            Signed in as <strong>{user?.name}</strong> ({user?.email}) • Zero-Trust Firestore Security Active
          </p>
        </div>

        {/* Action controls */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setResetModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-3 py-2 border border-neutral-200 hover:border-neutral-300 bg-white rounded-xl text-xs font-semibold text-neutral-700 cursor-pointer shadow-xs"
            title="Restore initial seed catalog & orders"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Demo Data</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveView('catalog')}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold cursor-pointer shadow-xs"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Store</span>
          </button>
        </div>
      </div>

      {/* Admin Tabs */}
      <div className="flex border-b border-neutral-200 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'analytics'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Financials & Analytics</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('inventory')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'inventory'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Inventory Management</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 cursor-pointer transition-all ${
            activeTab === 'orders'
              ? 'border-neutral-900 text-neutral-900'
              : 'border-transparent text-neutral-500 hover:text-neutral-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Order Fulfillment Toggler</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'analytics' && <AnalyticsCharts />}
        {activeTab === 'inventory' && <InventoryTable />}
        {activeTab === 'orders' && <OrdersManager />}
      </div>

      {/* Reset Confirmation Modal */}
      {resetModalOpen && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-sm w-full p-6 shadow-2xl space-y-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-base font-bold text-neutral-900">
                Restore Factory Seed Data?
              </h4>
              <p className="text-xs text-neutral-500 mt-1">
                This resets all products, warehouse inventory levels, and order records to clean defaults.
              </p>
            </div>
            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResetModalOpen(false)}
                className="flex-1 py-2 px-3 border border-neutral-200 rounded-xl text-xs font-semibold text-neutral-700 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  resetToFactoryDefaults();
                  setResetModalOpen(false);
                }}
                className="flex-1 py-2 px-3 bg-neutral-900 text-white rounded-xl text-xs font-bold cursor-pointer"
              >
                Confirm Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
