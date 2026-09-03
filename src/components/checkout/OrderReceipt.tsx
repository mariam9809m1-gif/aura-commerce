import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  Printer,
  ShoppingBag,
  ShieldCheck,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const OrderReceipt: React.FC = () => {
  const { lastCreatedOrder, setActiveView } = useCommerce();

  if (!lastCreatedOrder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <p className="text-neutral-500 mb-4">No recent order to display.</p>
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

  const order = lastCreatedOrder;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Success Banner */}
      <div className="text-center mb-8 space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto border border-emerald-200">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-900 font-display">
          Thank You For Your Order!
        </h1>
        <p className="text-xs sm:text-sm text-neutral-500 max-w-md mx-auto">
          We have authorized your payment and decremented live inventory. Confirmation has been dispatched to{' '}
          <strong className="text-neutral-800">{order.customerEmail}</strong>.
        </p>
      </div>

      {/* Printable Invoice Container */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-10 shadow-xs space-y-8 print:border-none print:shadow-none">
        {/* Invoice Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-neutral-200">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block">
              Official Order Reference
            </span>
            <span className="text-xl font-bold font-mono text-neutral-900">
              {order.id}
            </span>
            <span className="text-xs text-neutral-500 block mt-0.5">
              Placed on {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <span className="px-3 py-1 bg-amber-50 text-amber-800 border border-amber-200 rounded-full text-xs font-bold uppercase tracking-wider">
              {order.status}
            </span>
            <button
              type="button"
              onClick={handlePrint}
              className="p-2 rounded-xl border border-neutral-200 hover:bg-neutral-50 text-neutral-600 transition-colors cursor-pointer print:hidden"
              title="Print Receipt"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Fulfillment Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Fulfillment Lifecycle
          </h4>
          <div className="grid grid-cols-4 gap-2 text-center text-xs">
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 mx-auto mb-1" />
              <span className="font-bold text-emerald-900 block text-[11px]">Authorized</span>
              <span className="text-[10px] text-emerald-700">Stock Pulled</span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <Package className="w-4 h-4 text-neutral-600 mx-auto mb-1" />
              <span className="font-semibold text-neutral-800 block text-[11px]">Processing</span>
              <span className="text-[10px] text-neutral-400">Warehouse pack</span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <Truck className="w-4 h-4 text-neutral-400 mx-auto mb-1" />
              <span className="font-medium text-neutral-500 block text-[11px]">In Transit</span>
              <span className="text-[10px] text-neutral-400">GPS courier</span>
            </div>
            <div className="p-3 bg-neutral-50 border border-neutral-200 rounded-xl">
              <Clock className="w-4 h-4 text-neutral-400 mx-auto mb-1" />
              <span className="font-medium text-neutral-500 block text-[11px]">Delivered</span>
              <span className="text-[10px] text-neutral-400">Signature required</span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-400">
            Purchased Products
          </h4>
          <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-2xl overflow-hidden">
            {order.items.map(item => (
              <div
                key={`receipt-item-${item.productId}`}
                className="p-4 flex items-center justify-between gap-4 text-xs"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 rounded-xl object-cover bg-neutral-100 shrink-0"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h5 className="font-bold text-neutral-900">{item.name}</h5>
                    <p className="text-[11px] text-neutral-500 font-mono">
                      Qty: {item.quantity} × ${item.price.toFixed(2)}
                    </p>
                  </div>
                </div>
                <span className="font-mono font-bold text-neutral-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping & Financial Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-neutral-200 text-xs">
          <div>
            <h5 className="font-bold text-neutral-900 mb-2">Shipping Information</h5>
            <p className="text-neutral-700 font-medium">{order.customerName}</p>
            <p className="text-neutral-500">{order.shippingAddress.street}</p>
            <p className="text-neutral-500">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zip}
            </p>
            <p className="text-neutral-500">{order.shippingAddress.country}</p>
            <p className="text-neutral-500 mt-1 font-mono">{order.shippingAddress.phone}</p>
            <div className="mt-3 inline-block px-2.5 py-1 bg-neutral-100 rounded-lg font-mono text-[11px] text-neutral-700">
              Tracking: {order.trackingNumber}
            </div>
          </div>

          <div className="space-y-2 sm:text-right">
            <h5 className="font-bold text-neutral-900 mb-2">Invoice Summary</h5>
            <div className="flex sm:justify-end gap-6 text-neutral-600">
              <span>Subtotal:</span>
              <span className="font-mono font-bold text-neutral-900 w-24">
                ${order.subtotal.toFixed(2)}
              </span>
            </div>

            {order.discount > 0 && (
              <div className="flex sm:justify-end gap-6 text-emerald-700">
                <span>Discount ({order.promoCode || 'PROMO'}):</span>
                <span className="font-mono font-bold w-24">-${order.discount.toFixed(2)}</span>
              </div>
            )}

            <div className="flex sm:justify-end gap-6 text-neutral-600">
              <span>Postage:</span>
              <span className="font-mono font-bold text-neutral-900 w-24">
                {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
              </span>
            </div>

            <div className="flex sm:justify-end gap-6 text-neutral-600">
              <span>Estimated Tax:</span>
              <span className="font-mono font-bold text-neutral-900 w-24">
                ${order.tax.toFixed(2)}
              </span>
            </div>

            <div className="flex sm:justify-end gap-6 text-base font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
              <span>Paid Total:</span>
              <span className="font-display w-24 font-bold text-emerald-700">
                ${order.total.toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation and Admin shortcuts */}
      <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 print:hidden">
        <button
          type="button"
          onClick={() => setActiveView('catalog')}
          className="inline-flex items-center gap-2 px-6 py-3 bg-neutral-900 text-white rounded-xl text-xs font-bold hover:bg-neutral-800 transition-colors cursor-pointer"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Continue Shopping</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveView('admin')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-600 hover:text-neutral-900 cursor-pointer"
        >
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Inspect Order in Admin Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
