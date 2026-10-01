import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import {
  Store,
  Star,
  CheckCircle2,
  ShieldCheck,
  MapPin,
  Upload,
} from 'lucide-react';

export const SellerSettingsPage: React.FC = () => {
  const { currentUser, darkMode, addToast } = useStore();
  const seller = StorageService.getSellerById(currentUser.sellerId || 'seller_1') || StorageService.getSellers()[0];

  const [storeName, setStoreName] = useState(seller.storeName);
  const [description, setDescription] = useState(seller.description);
  const [logo, setLogo] = useState(seller.logo);
  const [returnDays, setReturnDays] = useState(7);
  const [dispatchHours, setDispatchHours] = useState(24);

  const reviews = StorageService.getReviews();

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    StorageService.updateSeller(seller.id, {
      storeName,
      description,
      logo,
    });
    addToast({ title: 'Store settings updated', type: 'success' });
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
          Store Profile & Customer Reviews
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Customize your public artisan showcase branding, fulfillment dispatch SLA, and view ratings.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Settings Form */}
        <form onSubmit={handleSave} className={`lg:col-span-7 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-5`}>
          <div className="text-xs font-bold uppercase tracking-wider text-slate-400 pb-2 border-b border-slate-100 dark:border-slate-800">
            Public Store Identity
          </div>

          <div className="flex items-center gap-4">
            <img src={logo} alt="Logo" className="w-16 h-16 rounded-2xl object-cover ring-2 ring-amber-400 shrink-0" />
            <div className="flex-1 text-xs">
              <label className="block font-semibold mb-1">Store Logo URL</label>
              <input
                type="text"
                value={logo}
                onChange={(e) => setLogo(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Store Name</label>
            <input
              type="text"
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs font-bold"
              required
            />
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Artisan Collective Story</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2.5 text-xs leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Dispatch Target (Hours)</label>
              <input
                type="number"
                value={dispatchHours}
                onChange={(e) => setDispatchHours(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-mono font-bold"
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Return Window (Days)</label>
              <input
                type="number"
                value={returnDays}
                onChange={(e) => setReturnDays(Number(e.target.value))}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl p-2 text-xs font-mono font-bold"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-[#0F1B2D] text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
          >
            Save Store Settings
          </button>
        </form>

        {/* Reviews List */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-editorial text-base font-bold">Store Reviews</h3>
            <span className="text-xs font-bold text-amber-600 flex items-center gap-1">
              <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
              <span>{seller.rating} / 5.0</span>
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto pr-1 text-xs">
            {reviews.map((r) => (
              <div key={r.id} className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{r.buyerName}</span>
                  <span className="text-[10px] text-slate-400">{r.date}</span>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-amber-500 text-amber-500" />
                  ))}
                </div>
                <p className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed line-clamp-3">
                  {r.comment}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
