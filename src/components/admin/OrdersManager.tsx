import React, { useState } from 'react';
import {
  Search,
  Filter,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ArrowRight,
  User,
  ShieldCheck,
} from 'lucide-react';
import { Order, OrderStatus } from '../../types/ecommerce';
import { useCommerce } from '../../context/CommerceContext';

const STATUSES: OrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

export const OrdersManager: React.FC = () => {
  const { orders, updateOrderStatus } = useCommerce();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const filtered = orders.filter(order => {
    const matchesSearch =
      order.id.toLowerCase().includes(search.toLowerCase()) ||
      order.customerName.toLowerCase().includes(search.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(search.toLowerCase()) ||
      order.trackingNumber.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Pending':
        return 'bg-neutral-100 text-neutral-800 border-neutral-300';
      case 'Processing':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Shipped':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Cancelled':
        return 'bg-red-50 text-red-800 border-red-200';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search and Filters */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 flex flex-col sm:flex-row gap-3 shadow-xs">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
          <input
            type="text"
            placeholder="Search orders by ID, customer name, email, or tracking..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:bg-white"
          />
        </div>

        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value)}
          className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none cursor-pointer"
        >
          <option value="All">All Fulfillment States</option>
          {STATUSES.map(s => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer & Email</th>
                <th className="py-3 px-4">Items & Value</th>
                <th className="py-3 px-4">Fulfillment Status Toggler</th>
                <th className="py-3 px-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(order => (
                  <tr key={order.id} className="hover:bg-neutral-50/80 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-neutral-900 block">
                        {order.id}
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        {new Date(order.createdAt).toLocaleDateString()}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-semibold text-neutral-800 block">
                        {order.customerName}
                      </span>
                      <span className="text-[11px] text-neutral-400 truncate max-w-xs block">
                        {order.customerEmail}
                      </span>
                    </td>

                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-neutral-900 block">
                        ${order.total.toFixed(2)}
                      </span>
                      <span className="text-[11px] text-neutral-500">
                        {order.items.reduce((s, i) => s + i.quantity, 0)} units in parcel
                      </span>
                    </td>

                    {/* Order Fulfillment Status Toggler */}
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <select
                          value={order.status}
                          onChange={e => updateOrderStatus(order.id, e.target.value as OrderStatus)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer focus:outline-none ${getStatusBadge(
                            order.status
                          )}`}
                        >
                          {STATUSES.map(st => (
                            <option key={st} value={st}>
                              {st}
                            </option>
                          ))}
                        </select>
                      </div>
                    </td>

                    <td className="py-3 px-4 text-right">
                      <button
                        type="button"
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer"
                        title="View Full Order Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-neutral-200 max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-4">
              <div>
                <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider block">
                  Order Management Manifest
                </span>
                <h3 className="text-lg font-bold font-mono text-neutral-900">
                  {selectedOrder.id}
                </h3>
              </div>

              <div className="flex items-center gap-3">
                <select
                  value={selectedOrder.status}
                  onChange={e => {
                    const newSt = e.target.value as OrderStatus;
                    updateOrderStatus(selectedOrder.id, newSt);
                    setSelectedOrder({ ...selectedOrder, status: newSt });
                  }}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold border ${getStatusBadge(
                    selectedOrder.status
                  )}`}
                >
                  {STATUSES.map(st => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Shipping details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs bg-neutral-50 p-4 rounded-2xl border border-neutral-200">
              <div>
                <span className="font-bold text-neutral-900 block mb-1">Customer Details</span>
                <p className="text-neutral-700 font-medium">{selectedOrder.customerName}</p>
                <p className="text-neutral-500">{selectedOrder.customerEmail}</p>
                <p className="text-neutral-500">{selectedOrder.shippingAddress.phone}</p>
              </div>
              <div>
                <span className="font-bold text-neutral-900 block mb-1">Destination Address</span>
                <p className="text-neutral-600">{selectedOrder.shippingAddress.street}</p>
                <p className="text-neutral-600">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{' '}
                  {selectedOrder.shippingAddress.zip}
                </p>
                <p className="text-neutral-500 mt-1 font-mono text-[11px]">
                  Tracking: {selectedOrder.trackingNumber}
                </p>
              </div>
            </div>

            {/* Item list */}
            <div className="space-y-3">
              <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                Package Contents
              </span>
              <div className="divide-y divide-neutral-100 border border-neutral-100 rounded-xl">
                {selectedOrder.items.map(item => (
                  <div key={item.productId} className="p-3 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.imageUrl}
                        alt={item.name}
                        className="w-10 h-10 rounded-lg object-cover bg-neutral-100"
                        referrerPolicy="no-referrer"
                      />
                      <div>
                        <span className="font-bold text-neutral-900 block">{item.name}</span>
                        <span className="text-neutral-500 font-mono text-[11px]">
                          Qty: {item.quantity} × ${item.price.toFixed(2)}
                        </span>
                      </div>
                    </div>
                    <span className="font-mono font-bold text-neutral-900">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Financials breakdown */}
            <div className="space-y-1.5 text-xs text-neutral-600 pt-2 border-t border-neutral-100">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-mono font-bold text-neutral-900">
                  ${selectedOrder.subtotal.toFixed(2)}
                </span>
              </div>
              {selectedOrder.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Discount</span>
                  <span className="font-mono font-bold">-${selectedOrder.discount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className="font-mono font-bold text-neutral-900">
                  ${selectedOrder.shippingCost.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tax</span>
                <span className="font-mono font-bold text-neutral-900">
                  ${selectedOrder.tax.toFixed(2)}
                </span>
              </div>
              <div className="flex justify-between text-sm font-extrabold text-neutral-900 pt-2 border-t border-neutral-200">
                <span>Order Total</span>
                <span className="font-display font-bold text-emerald-700">
                  ${selectedOrder.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
