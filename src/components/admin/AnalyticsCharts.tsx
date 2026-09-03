import React from 'react';
import { TrendingUp, DollarSign, Package, ShoppingCart, AlertCircle, BarChart3, PieChart } from 'lucide-react';
import { useCommerce } from '../../context/CommerceContext';

export const AnalyticsCharts: React.FC = () => {
  const { metrics, products, orders } = useCommerce();

  // Find max sales for bar chart relative scaling
  const maxSales = Math.max(...metrics.salesTrend.map(d => d.sales), 30000);

  // Profit calculation
  const totalCost = orders
    .filter(o => o.status !== 'Cancelled')
    .reduce((acc, order) => {
      const orderCost = order.items.reduce((sum, item) => {
        const prod = products.find(p => p.id === item.productId);
        return sum + (prod?.cost || item.price * 0.45) * item.quantity;
      }, 0);
      return acc + orderCost;
    }, 0);

  const estimatedProfit = Math.max(0, metrics.totalRevenue - totalCost);
  const profitMargin = metrics.totalRevenue > 0 ? (estimatedProfit / metrics.totalRevenue) * 100 : 0;

  return (
    <div className="space-y-8">
      {/* Metric Cards Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Revenue
            </span>
            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-xl">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 font-display">
            ${metrics.totalRevenue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1.5 text-[11px] text-emerald-600 mt-2 font-medium">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+18.4% compared to last cycle</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Total Orders
            </span>
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingCart className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 font-display">
            {metrics.totalOrders}
          </div>
          <div className="text-[11px] text-neutral-500 mt-2">
            Average Basket Value: <strong className="text-neutral-800">${metrics.averageOrderValue.toFixed(2)}</strong>
          </div>
        </div>

        {/* Catalog Products */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Catalog Items
            </span>
            <div className="p-2 bg-neutral-100 text-neutral-700 rounded-xl">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 font-display">
            {metrics.totalProducts}
          </div>
          <div className="text-[11px] text-neutral-500 mt-2">
            Active SKUs across 5 departments
          </div>
        </div>

        {/* Low Stock Watchlist */}
        <div className="bg-white p-5 rounded-2xl border border-neutral-200 shadow-xs">
          <div className="flex items-center justify-between text-neutral-400 mb-3">
            <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
              Low Stock Alerts
            </span>
            <div className={`p-2 rounded-xl ${metrics.lowStockCount > 0 ? 'bg-amber-50 text-amber-600' : 'bg-neutral-100 text-neutral-400'}`}>
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-extrabold text-neutral-900 font-display">
            {metrics.lowStockCount}
          </div>
          <div className="text-[11px] text-neutral-500 mt-2">
            {metrics.lowStockCount > 0 ? (
              <span className="text-amber-600 font-semibold">Immediate reorder recommended</span>
            ) : (
              <span className="text-emerald-600">All warehouse bins adequate</span>
            )}
          </div>
        </div>
      </div>

      {/* Responsive CSS Charts Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CSS Monthly Sales Bar Chart */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-neutral-700" />
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                  Sales Volume & Order Velocity
                </h3>
              </div>
              <p className="text-xs text-neutral-500 mt-0.5">
                Monthly gross revenue trajectory rendered via responsive CSS flex columns
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-neutral-900 block">
                Estimated Margin: {profitMargin.toFixed(1)}%
              </span>
              <span className="text-[10px] text-neutral-400">Gross profit: ${estimatedProfit.toFixed(0)}</span>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="h-64 flex items-end justify-between gap-3 pt-8 pb-2 px-2 border-b border-neutral-200">
            {metrics.salesTrend.map(pt => {
              const heightPercent = Math.round((pt.sales / maxSales) * 100);
              return (
                <div
                  key={pt.period}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group cursor-pointer"
                >
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900 text-white text-[10px] font-mono px-2 py-1 rounded shadow-md whitespace-nowrap -mb-1">
                    ${pt.sales.toLocaleString()} ({pt.orders} ord)
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[48px] bg-neutral-100 hover:bg-neutral-200 rounded-t-xl overflow-hidden relative transition-all">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-full bg-neutral-900 group-hover:bg-neutral-800 rounded-t-xl transition-all duration-500"
                    />
                  </div>

                  {/* Period label */}
                  <span className="text-[11px] font-semibold text-neutral-600 font-mono">
                    {pt.period}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-4 text-xs text-neutral-500 font-mono">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-neutral-900" />
                <span>Gross Sales ($)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-neutral-200" />
                <span>Capacity Limit</span>
              </div>
            </div>
            <span>Zero External Chart Dependencies</span>
          </div>
        </div>

        {/* Category Revenue Breakdown */}
        <div className="bg-white p-6 rounded-3xl border border-neutral-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <PieChart className="w-4 h-4 text-neutral-700" />
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wider">
                Category Distribution
              </h3>
            </div>
            <p className="text-xs text-neutral-500 mb-6">
              Department share by revenue contribution
            </p>

            <div className="space-y-4">
              {metrics.categoryBreakdown.map(cat => (
                <div key={cat.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-neutral-800">{cat.category}</span>
                    <span className="font-mono text-neutral-500 font-medium">
                      ${cat.revenue.toFixed(0)} ({cat.percentage}%)
                    </span>
                  </div>
                  {/* Progress bar */}
                  <div className="w-full h-2.5 bg-neutral-100 rounded-full overflow-hidden">
                    <div
                      style={{ width: `${Math.max(4, cat.percentage)}%` }}
                      className="h-full bg-neutral-900 rounded-full transition-all duration-500"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 font-mono">
            <span>Total Units Logged:</span>
            <span className="font-bold text-neutral-900">
              {products.reduce((sum, p) => sum + p.stock, 0)} items in storage
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
