import React, { useState } from 'react';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  AlertCircle,
  CheckCircle2,
  Minus,
  Sparkles,
} from 'lucide-react';
import { Product } from '../../types/ecommerce';
import { useCommerce } from '../../context/CommerceContext';
import { ProductModal } from './ProductModal';

export const InventoryTable: React.FC = () => {
  const { products, addProduct, updateProduct, deleteProduct, adjustStock } = useCommerce();

  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [stockFilter, setStockFilter] = useState<'all' | 'low' | 'out'>('all');

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  const filtered = products.filter(p => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    const matchesStock =
      stockFilter === 'all'
        ? true
        : stockFilter === 'low'
        ? p.stock > 0 && p.stock <= 5
        : p.stock === 0;

    return matchesSearch && matchesCategory && matchesStock;
  });

  const handleOpenCreate = () => {
    setEditingProduct(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (product: Product) => {
    setEditingProduct(product);
    setModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    await deleteProduct(id);
    setDeleteConfirmId(null);
  };

  const handleSaveProduct = async (data: Partial<Product>) => {
    if (editingProduct) {
      return await updateProduct(editingProduct.id, data);
    } else {
      return await addProduct(data as any);
    }
  };

  return (
    <div className="space-y-4">
      {/* Controls Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-neutral-200 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div className="flex flex-1 flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
            <input
              type="text"
              placeholder="Filter by product name, SKU..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:outline-none focus:bg-white"
            />
          </div>

          {/* Category */}
          <select
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Apparel">Apparel</option>
            <option value="Home & Living">Home & Living</option>
            <option value="Accessories">Accessories</option>
            <option value="Footwear">Footwear</option>
          </select>

          {/* Stock state */}
          <select
            value={stockFilter}
            onChange={e => setStockFilter(e.target.value as any)}
            className="px-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs text-neutral-800 focus:outline-none cursor-pointer"
          >
            <option value="all">All Inventory States</option>
            <option value="low">Low Stock Only (≤ 5)</option>
            <option value="out">Out of Stock Only (0)</option>
          </select>
        </div>

        {/* Add Product Button */}
        <button
          type="button"
          onClick={handleOpenCreate}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add New SKU</span>
        </button>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-500 uppercase tracking-wider font-semibold text-[10px]">
              <tr>
                <th className="py-3 px-4">Item & SKU</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / Cost</th>
                <th className="py-3 px-4">Stock Level</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">
                    No matching inventory products found.
                  </td>
                </tr>
              ) : (
                filtered.map(product => {
                  const isOut = product.stock <= 0;
                  const isLow = product.stock > 0 && product.stock <= 5;
                  const margin = product.cost ? Math.round(((product.price - product.cost) / product.price) * 100) : null;

                  return (
                    <tr key={product.id} className="hover:bg-neutral-50/80 transition-colors">
                      {/* Product details */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={product.imageUrl}
                            alt={product.name}
                            className="w-10 h-10 rounded-xl object-cover bg-neutral-100 shrink-0"
                            referrerPolicy="no-referrer"
                          />
                          <div>
                            <span className="font-bold text-neutral-900 block line-clamp-1">
                              {product.name}
                            </span>
                            <span className="text-[11px] font-mono text-neutral-400">
                              {product.sku}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3 px-4 text-neutral-600 font-medium">
                        {product.category}
                      </td>

                      {/* Financials */}
                      <td className="py-3 px-4">
                        <span className="font-bold font-mono text-neutral-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.cost ? (
                          <span className="block text-[10px] text-neutral-400 font-mono">
                            Cost: ${product.cost.toFixed(2)} ({margin}% margin)
                          </span>
                        ) : null}
                      </td>

                      {/* Stock with quick +/- adjusters */}
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="flex items-center border border-neutral-200 rounded-lg bg-neutral-50 overflow-hidden">
                            <button
                              type="button"
                              onClick={() => adjustStock(product.id, -1)}
                              disabled={product.stock <= 0}
                              className="p-1 text-neutral-500 hover:bg-neutral-200 disabled:opacity-30 cursor-pointer"
                              title="Decrement 1"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-10 text-center font-mono font-bold text-neutral-900">
                              {product.stock}
                            </span>
                            <button
                              type="button"
                              onClick={() => adjustStock(product.id, 1)}
                              className="p-1 text-neutral-500 hover:bg-neutral-200 cursor-pointer"
                              title="Increment 1"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {isOut ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-50 text-red-700 border border-red-200">
                              Sold Out
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                              Low Stock
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                              Healthy
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(product)}
                            className="p-1.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          {deleteConfirmId === product.id ? (
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => handleDelete(product.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded text-[10px] font-bold cursor-pointer"
                              >
                                Confirm
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-2 py-1 bg-neutral-200 text-neutral-700 rounded text-[10px] cursor-pointer"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(product.id)}
                              className="p-1.5 text-neutral-400 hover:text-red-600 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                              title="Delete Product"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="p-4 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between text-xs text-neutral-500 font-mono">
          <span>Active Warehouse Catalog: {products.length} registered SKUs</span>
          <span>Changes persist across user sessions</span>
        </div>
      </div>

      {/* Product Modal */}
      <ProductModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
      />
    </div>
  );
};
