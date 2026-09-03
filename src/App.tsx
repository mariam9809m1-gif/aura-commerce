import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CommerceProvider, useCommerce } from './context/CommerceContext';
import { CartProvider } from './context/CartContext';
import { ErrorBoundary } from './components/common/ErrorBoundary';
import { ToastContainer, ToastMessage } from './components/common/Toast';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { LandingPage } from './components/home/LandingPage';
import { CatalogPage } from './components/catalog/CatalogPage';
import { ProductDetailView } from './components/catalog/ProductDetailView';
import { ProductQuickView } from './components/catalog/ProductQuickView';
import { CartDrawer } from './components/cart/CartDrawer';
import { CheckoutWizard } from './components/checkout/CheckoutWizard';
import { OrderReceipt } from './components/checkout/OrderReceipt';
import { AdminDashboard } from './components/admin/AdminDashboard';

const MainAppContent: React.FC = () => {
  const { activeView } = useCommerce();
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col bg-neutral-100 text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* Global Navbar */}
      <Navbar />

      {/* Main Dynamic Viewport with Error Boundary */}
      <main className="flex-1">
        <ErrorBoundary>
          {activeView === 'home' && <LandingPage />}
          {activeView === 'catalog' && <CatalogPage />}
          {activeView === 'detail' && <ProductDetailView />}
          {activeView === 'checkout' && <CheckoutWizard />}
          {activeView === 'confirmation' && <OrderReceipt />}
          {activeView === 'admin' && <AdminDashboard />}
        </ErrorBoundary>
      </main>

      {/* Global Interactive Overlays */}
      <CartDrawer />
      <ProductQuickView />
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />

      {/* Global Footer */}
      <Footer />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <CommerceProvider>
          <CartProvider>
            <MainAppContent />
          </CartProvider>
        </CommerceProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
