import React, { useState, useEffect } from 'react';
import { X, Plus, Trash2, AlertCircle, Image, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '../../types/ecommerce';
import { validateProduct } from '../../lib/validation';

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (productData: Partial<Product>) => Promise<{ success: boolean; error?: any }>;
  productToEdit?: Product | null;
}

const CATEGORIES: ProductCategory[] = [
  'Electronics',
  'Apparel',
  'Home & Living',
  'Accessories',
  'Footwear',
];

export const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  productToEdit,
}) => {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    cost: 0,
    category: 'Electronics',
    stock: 10,
    sku: '',
    imageUrl: '',
    isFeatured: false,
    specs: {},
  });

  const [specsList, setSpecsList] = useState<Array<{ key: string; value: string }>>([
    { key: 'Material', value: 'Aerospace Grade' },
    { key: 'Warranty', value: '2-Year Direct Coverage' },
  ]);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (productToEdit) {
      setFormData(productToEdit);
      if (productToEdit.specs) {
        setSpecsList(
          Object.entries(productToEdit.specs).map(([key, value]) => ({ key, value }))
        );
      }
    } else {
      setFormData({
        name: '',
        description: '',
        price: 99.0,
        cost: 45.0,
        category: 'Electronics',
        stock: 25,
        sku: `SKU-${Math.floor(1000 + Math.random() * 9000)}`,
        imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80',
        isFeatured: false,
        specs: {},
      });
      setSpecsList([
        { key: 'Material', value: 'Anodized Aluminum' },
        { key: 'Warranty', value: '2-Year Manufacturer' },
      ]);
    }
    setErrors({});
  }, [productToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddSpec = () => {
    setSpecsList([...specsList, { key: '', value: '' }]);
  };

  const handleRemoveSpec = (index: number) => {
    setSpecsList(specsList.filter((_, idx) => idx !== index));
  };

  const handleSpecChange = (index: number, field: 'key' | 'value', val: string) => {
    const updated = [...specsList];
    updated[index][field] = val;
    setSpecsList(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Map specs list back to object
    const specsObj: Record<string, string> = {};
    specsList.forEach(s => {
      if (s.key.trim() && s.value.trim()) {
        specsObj[s.key.trim()] = s.value.trim();
      }
    });

    const payload: Partial<Product> = {
      ...formData,
      price: Number(formData.price),
      cost: Number(formData.cost || 0),
      stock: Number(formData.stock),
      specs: specsObj,
    };

    // Client-side schema validation
    const validation = validateProduct(payload);
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setIsSubmitting(true);
    const result = await onSave(payload);
    setIsSubmitting(false);

    if (result.success) {
      onClose();
    } else {
      setErrors({ global: result.error?.message || 'Failed to save product' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-neutral-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl border border-neutral-200 max-w-2xl w-full my-8 overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-neutral-900 font-display">
              {productToEdit ? 'Modify Product Record' : 'Register New Inventory SKU'}
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Updates to live products decrement or increment warehouse stock in real time.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-neutral-400 hover:text-neutral-700 rounded-xl hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {errors.global && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errors.global}</span>
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">
                Product Title *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={e => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs"
                placeholder="e.g. Aura Spatial Audio Headphones"
              />
              {errors.name && <p className="text-red-600 mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Department / Category *</label>
              <select
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value as any })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs bg-white cursor-pointer"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Inventory SKU *</label>
              <input
                type="text"
                required
                value={formData.sku}
                onChange={e => setFormData({ ...formData, sku: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs font-mono uppercase"
                placeholder="SKU-XXXX"
              />
              {errors.sku && <p className="text-red-600 mt-1">{errors.sku}</p>}
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Retail Price ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                required
                value={formData.price}
                onChange={e => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs font-mono"
              />
              {errors.price && <p className="text-red-600 mt-1">{errors.price}</p>}
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Wholesale Cost ($) *</label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={formData.cost}
                onChange={e => setFormData({ ...formData, cost: parseFloat(e.target.value) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-neutral-700 mb-1">Initial Stock (Units) *</label>
              <input
                type="number"
                min="0"
                step="1"
                required
                value={formData.stock}
                onChange={e => setFormData({ ...formData, stock: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs font-mono"
              />
              {errors.stock && <p className="text-red-600 mt-1">{errors.stock}</p>}
            </div>

            <div className="flex items-center pt-5">
              <label className="flex items-center gap-2 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={formData.isFeatured || false}
                  onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                  className="w-4 h-4 rounded text-neutral-900 cursor-pointer"
                />
                <span className="font-semibold text-neutral-800">Pin as Featured Product</span>
              </label>
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={formData.description}
                onChange={e => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs"
                placeholder="Product narrative, materials, and value proposition..."
              />
              {errors.description && <p className="text-red-600 mt-1">{errors.description}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className="block font-semibold text-neutral-700 mb-1">Image URL *</label>
              <div className="flex gap-3 items-center">
                <input
                  type="url"
                  required
                  value={formData.imageUrl}
                  onChange={e => setFormData({ ...formData, imageUrl: e.target.value })}
                  className="flex-1 px-3.5 py-2.5 rounded-xl border border-neutral-200 focus:outline-none focus:border-neutral-900 text-xs"
                  placeholder="https://..."
                />
                {formData.imageUrl && (
                  <img
                    src={formData.imageUrl}
                    alt="Preview"
                    className="w-10 h-10 rounded-lg object-cover border border-neutral-200 bg-neutral-100 shrink-0"
                    referrerPolicy="no-referrer"
                    onError={e => {
                      (e.target as any).src = 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80';
                    }}
                  />
                )}
              </div>
              {errors.imageUrl && <p className="text-red-600 mt-1">{errors.imageUrl}</p>}
            </div>
          </div>

          {/* Technical Specs Key-Value Editor */}
          <div className="pt-2 border-t border-neutral-200">
            <div className="flex items-center justify-between mb-2">
              <label className="font-bold uppercase tracking-wider text-neutral-700 text-[11px]">
                Technical Specifications (Key-Value)
              </label>
              <button
                type="button"
                onClick={handleAddSpec}
                className="inline-flex items-center gap-1 text-[11px] text-neutral-600 hover:text-neutral-900 font-semibold cursor-pointer"
              >
                <Plus className="w-3 h-3" />
                <span>Add Row</span>
              </button>
            </div>

            <div className="space-y-2">
              {specsList.map((spec, idx) => (
                <div key={`spec-row-${idx}`} className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Spec Name (e.g. Battery Life)"
                    value={spec.key}
                    onChange={e => handleSpecChange(idx, 'key', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. 40 Hours)"
                    value={spec.value}
                    onChange={e => handleSpecChange(idx, 'value', e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-neutral-200 text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveSpec(idx)}
                    className="p-1.5 text-neutral-400 hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Modal Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-neutral-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-neutral-200 text-neutral-700 hover:bg-neutral-50 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-2.5 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-bold cursor-pointer transition-colors"
            >
              {isSubmitting ? 'Saving to Database...' : productToEdit ? 'Update Product' : 'Create Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
