import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  PackageCheck,
  ShieldAlert,
  Trash2,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminProductsPage: React.FC = () => {
  const { darkMode, addToast } = useStore();
  const [products, setProducts] = useState<Product[]>(() => StorageService.getProducts());

  const handleToggleFlag = (p: Product) => {
    const nextStatus = p.status === 'flagged' ? 'active' : 'flagged';
    StorageService.updateProduct(p.id, { status: nextStatus });
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: nextStatus } : item))
    );
    addToast({ title: `Listing ${nextStatus === 'flagged' ? 'Flagged for Moderation' : 'Approved'}`, type: 'info' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Admin Action: Permanently remove listing from marketplace catalog?')) {
      StorageService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast({ title: 'Listing removed', type: 'info' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
          Catalog Quality & Moderation ({products.length})
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review listing quality, verify artisan authenticity, and manage flagged catalog items.
        </p>
      </div>

      <div className={`rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'} font-semibold`}>
              <tr>
                <th className="py-3 px-4">Item & Seller</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">AI Quality Score</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 max-w-sm">
                      <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-400">Sold by {p.sellerName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{p.category}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-mono font-bold text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {p.seoScore || 92}/100
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'flagged' ? 'bg-red-100 text-red-800' : 'bg-teal-100 text-teal-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/products/${p.id}`}
                        target="_blank"
                        className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="View Live Product"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleToggleFlag(p)}
                        className={`text-xs font-semibold px-2 py-1 rounded-lg ${
                          p.status === 'flagged'
                            ? 'bg-teal-100 text-teal-800 hover:bg-teal-200'
                            : 'bg-amber-100 text-amber-900 hover:bg-amber-200'
                        }`}
                      >
                        {p.status === 'flagged' ? 'Approve' : 'Flag Listing'}
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1 text-slate-400 hover:text-red-600"
                        title="Delete listing"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
