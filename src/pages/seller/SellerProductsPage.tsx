import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { Product } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Package,
  Sparkles,
  Search,
  Edit2,
  Trash2,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';

export const SellerProductsPage: React.FC = () => {
  const { currentUser, darkMode, addToast } = useStore();
  const seller = StorageService.getSellerById(currentUser.sellerId || 'seller_1') || StorageService.getSellers()[0];
  const [products, setProducts] = useState<Product[]>(() =>
    StorageService.getProducts().filter((p) => p.sellerId === seller.id)
  );
  const [search, setSearch] = useState('');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStock, setTempStock] = useState<number>(0);

  const filtered = products.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleStatus = (p: Product) => {
    const nextStatus = p.status === 'active' ? 'inactive' : 'active';
    StorageService.updateProduct(p.id, { status: nextStatus });
    setProducts((prev) =>
      prev.map((item) => (item.id === p.id ? { ...item, status: nextStatus } : item))
    );
    addToast({ title: `Product marked ${nextStatus}`, type: 'info' });
  };

  const handleSaveStock = (id: string) => {
    StorageService.updateProduct(id, { stock: tempStock });
    setProducts((prev) =>
      prev.map((item) => (item.id === id ? { ...item, stock: tempStock } : item))
    );
    setEditingStockId(null);
    addToast({ title: 'Inventory updated successfully', type: 'success' });
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Delete this listing permanently from the marketplace?')) {
      StorageService.deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      addToast({ title: 'Product listing deleted', type: 'info' });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Store Product Inventory ({products.length})
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Manage stock buffers, pricing, catalog visibility, and SEO scores.
          </p>
        </div>

        <Link
          to="/seller/products/new"
          className="px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-black font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Add Product with AI</span>
        </Link>
      </div>

      {/* Filter / Search Bar */}
      <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xs flex items-center gap-3`}>
        <Search className="w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Filter by product name, category, or tags..."
          className="flex-1 bg-transparent text-xs text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none"
        />
      </div>

      {/* Table */}
      <div className={`rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'} font-semibold`}>
              <tr>
                <th className="py-3 px-4">Product Details</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4 text-right">Price</th>
                <th className="py-3 px-4 text-center">Stock Buffer</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">SEO Score</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3 min-w-0 max-w-xs">
                      <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-bold text-slate-900 dark:text-white truncate">{p.title}</div>
                        <div className="text-[11px] text-slate-400">Rating: ★ {p.rating} ({p.reviewCount})</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">{p.category}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900 dark:text-white tabular-nums">
                    {formatCurrency(p.price)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {editingStockId === p.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={tempStock}
                          onChange={(e) => setTempStock(Number(e.target.value))}
                          className="w-16 bg-white border border-slate-300 rounded px-1.5 py-0.5 text-xs text-center font-mono font-bold text-black"
                        />
                        <button onClick={() => handleSaveStock(p.id)} className="text-teal-600 p-1">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingStockId(null)} className="text-slate-400 p-1">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingStockId(p.id);
                          setTempStock(p.stock);
                        }}
                        className={`font-mono font-bold px-2 py-0.5 rounded cursor-pointer ${
                          p.stock <= 5 ? 'bg-red-100 text-red-800' : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200'
                        }`}
                        title="Click to edit stock inline"
                      >
                        {p.stock} units
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider ${
                        p.status === 'active'
                          ? 'bg-teal-100 text-teal-800'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-teal-700 dark:text-teal-400">
                    {p.seoScore || 90}/100
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/products/${p.id}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-white"
                        title="View Live Listing"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="p-1.5 text-slate-400 hover:text-red-600"
                        title="Delete Listing"
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
