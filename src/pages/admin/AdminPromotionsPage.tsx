import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { Coupon, Category } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Tag,
  Plus,
  Compass,
  CheckCircle2,
  Trash2,
} from 'lucide-react';

export const AdminPromotionsPage: React.FC = () => {
  const { darkMode, addToast } = useStore();
  const [coupons, setCoupons] = useState<Coupon[]>(() => StorageService.getCoupons());
  const categories = StorageService.getCategories();

  const [isAddingCoupon, setIsAddingCoupon] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discountType: 'percentage' as 'percentage' | 'flat',
    discountValue: 10,
    minOrderValue: 999,
    maxDiscount: 500,
    description: '',
  });

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCoupon.code) return;

    const updated = [
      ...coupons,
      {
        ...newCoupon,
        code: newCoupon.code.toUpperCase().trim(),
      },
    ];
    setCoupons(updated);
    setIsAddingCoupon(false);
    addToast({ title: `Coupon ${newCoupon.code} created!`, type: 'success' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Promotions, Coupons & Categories
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure promotional discount vouchers and browse active regional craft taxonomy.
          </p>
        </div>

        <button
          onClick={() => setIsAddingCoupon(true)}
          className="px-4 py-2 rounded-xl bg-[#0F1B2D] text-white hover:bg-slate-800 text-xs font-bold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Create New Promo Coupon</span>
        </button>
      </div>

      {/* Coupons Section */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Active Promotional Discount Codes ({coupons.length})
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coupons.map((c) => (
            <div
              key={c.code}
              className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-amber-50/60 border-amber-200/80'} space-y-2`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-sm text-slate-900 dark:text-white px-2.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-amber-300">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-teal-700 dark:text-teal-400">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `₹${c.discountValue} FLAT`}
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300">{c.description}</p>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-amber-200/50">
                Min Order: {formatCurrency(c.minOrderValue)}
                {c.maxDiscount && ` · Max Cap: ₹${c.maxDiscount}`}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Coupon Modal */}
      {isAddingCoupon && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-editorial text-lg font-bold">Create Coupon Voucher</h3>
            <form onSubmit={handleCreateCoupon} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold mb-1">Coupon Code (Uppercase)</label>
                <input
                  type="text"
                  placeholder="e.g. DIWALI30"
                  value={newCoupon.code}
                  onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value.toUpperCase() })}
                  className="w-full border border-slate-300 rounded-xl p-2 font-mono uppercase"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold mb-1">Type</label>
                  <select
                    value={newCoupon.discountType}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountType: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-xl p-2"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="flat">Flat Amount (₹)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold mb-1">Value</label>
                  <input
                    type="number"
                    value={newCoupon.discountValue}
                    onChange={(e) => setNewCoupon({ ...newCoupon, discountValue: Number(e.target.value) })}
                    className="w-full border border-slate-300 rounded-xl p-2"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold mb-1">Min Order Value (₹)</label>
                <input
                  type="number"
                  value={newCoupon.minOrderValue}
                  onChange={(e) => setNewCoupon({ ...newCoupon, minOrderValue: Number(e.target.value) })}
                  className="w-full border border-slate-300 rounded-xl p-2"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Terms Description</label>
                <input
                  type="text"
                  placeholder="Special festival discount for craft buyers"
                  value={newCoupon.description}
                  onChange={(e) => setNewCoupon({ ...newCoupon, description: e.target.value })}
                  className="w-full border border-slate-300 rounded-xl p-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddingCoupon(false)}
                  className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0F1B2D] text-white rounded-lg text-xs font-bold"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Categories Taxonomy Section */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Craft Categories Taxonomy ({categories.length})
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {categories.map((c) => (
            <div key={c.id} className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
              <img src={c.image} alt={c.name} className="w-10 h-10 rounded-xl object-cover shrink-0" />
              <div className="min-w-0 text-xs">
                <div className="font-bold truncate text-slate-900 dark:text-white">{c.name}</div>
                <div className="text-[11px] text-slate-400">{c.productCount} items</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
