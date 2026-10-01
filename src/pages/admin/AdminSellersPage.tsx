import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { SellerProfile } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  Users,
  ShieldCheck,
  Check,
  X,
  AlertTriangle,
  FileCheck,
  Percent,
} from 'lucide-react';

export const AdminSellersPage: React.FC = () => {
  const { darkMode, addToast } = useStore();
  const [sellers, setSellers] = useState<SellerProfile[]>(() => StorageService.getSellers());
  const [editingCommSellerId, setEditingCommSellerId] = useState<string | null>(null);
  const [tempComm, setTempComm] = useState<number>(8);

  const handleApproveKyc = (sellerId: string) => {
    StorageService.updateSeller(sellerId, { kycStatus: 'approved', isVerified: true });
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: 'approved', isVerified: true } : s))
    );
    addToast({ title: 'Seller KYC Approved', type: 'success' });
  };

  const handleSuspend = (sellerId: string) => {
    StorageService.updateSeller(sellerId, { kycStatus: 'rejected', isVerified: false });
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, kycStatus: 'rejected', isVerified: false } : s))
    );
    addToast({ title: 'Seller status updated', type: 'info' });
  };

  const handleSaveCommission = (sellerId: string) => {
    const rate = tempComm / 100;
    StorageService.updateSeller(sellerId, { commissionRate: rate });
    setSellers((prev) =>
      prev.map((s) => (s.id === sellerId ? { ...s, commissionRate: rate } : s))
    );
    setEditingCommSellerId(null);
    addToast({ title: `Commission updated to ${tempComm}%`, type: 'success' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
          Artisan Sellers & KYC Moderation ({sellers.length})
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review business registrations, GST compliance, bank accounts, and configure custom commission rates.
        </p>
      </div>

      <div className={`rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'} font-semibold`}>
              <tr>
                <th className="py-3 px-4">Artisan Collective</th>
                <th className="py-3 px-4">Cluster / Region</th>
                <th className="py-3 px-4 text-center">KYC Status</th>
                <th className="py-3 px-4 text-center">Commission Rate</th>
                <th className="py-3 px-4 text-right">Lifetime Sales</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {sellers.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <img src={s.logo} alt={s.storeName} className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200" />
                      <div>
                        <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{s.storeName}</span>
                          {s.isVerified && <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          GST: {s.gstNumber || 'Exempted (Weaver Handloom)'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-400">
                    {s.city}, {s.state}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      s.kycStatus === 'approved'
                        ? 'bg-teal-100 text-teal-800'
                        : s.kycStatus === 'pending'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {s.kycStatus}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center">
                    {editingCommSellerId === s.id ? (
                      <div className="flex items-center justify-center gap-1">
                        <input
                          type="number"
                          value={tempComm}
                          onChange={(e) => setTempComm(Number(e.target.value))}
                          className="w-14 bg-white border border-slate-300 rounded px-1 text-center font-bold text-black text-xs"
                        />
                        <span className="text-xs font-bold">%</span>
                        <button onClick={() => handleSaveCommission(s.id)} className="text-teal-600 p-0.5">
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => setEditingCommSellerId(null)} className="text-slate-400 p-0.5">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => {
                          setEditingCommSellerId(s.id);
                          setTempComm(Math.round(s.commissionRate * 100));
                        }}
                        className="font-mono font-bold px-2 py-0.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer text-slate-800 dark:text-slate-200"
                        title="Click to change commission"
                      >
                        {Math.round(s.commissionRate * 100)}%
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold tabular-nums text-slate-900 dark:text-white">
                    {formatCurrency(s.totalEarnings)}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {s.kycStatus !== 'approved' && (
                        <button
                          onClick={() => handleApproveKyc(s.id)}
                          className="px-2.5 py-1 rounded-lg bg-teal-600 text-white font-bold hover:bg-teal-700 text-[11px]"
                        >
                          Approve KYC
                        </button>
                      )}
                      {s.kycStatus === 'approved' && (
                        <button
                          onClick={() => handleSuspend(s.id)}
                          className="text-xs text-red-600 hover:underline"
                        >
                          Suspend
                        </button>
                      )}
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
