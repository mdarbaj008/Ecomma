import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { Payout } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import {
  CreditCard,
  CheckCircle2,
  Clock,
  ArrowRight,
  ShieldCheck,
  Building,
} from 'lucide-react';

export const AdminPayoutsPage: React.FC = () => {
  const { darkMode, addToast } = useStore();
  const [payouts, setPayouts] = useState<Payout[]>(() => StorageService.getPayouts());

  const handleApprove = (payoutId: string) => {
    const success = StorageService.approvePayout(payoutId);
    if (success) {
      setPayouts(StorageService.getPayouts());
      addToast({
        title: 'Payout Approved & Processed',
        message: 'Disbursed via automated IMPS banking gateway.',
        type: 'success',
      });
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
          Seller Payout Remittance Requests ({payouts.length})
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Review, approve, and execute bank disbursements for verified artisan collectives.
        </p>
      </div>

      <div className={`rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs overflow-hidden`}>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${darkMode ? 'bg-slate-800/60 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-100 text-slate-700'} font-semibold`}>
              <tr>
                <th className="py-3 px-4">Artisan Store</th>
                <th className="py-3 px-4">Requested Date</th>
                <th className="py-3 px-4 font-mono">Amount (₹)</th>
                <th className="py-3 px-4">Destination Bank / UPI</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Execution Action</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {payouts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                    {p.sellerName}
                  </td>
                  <td className="py-3 px-4 text-slate-500">
                    {formatDateTime(p.requestedAt)}
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-base text-teal-800 dark:text-teal-300 tabular-nums">
                    {formatCurrency(p.amount)}
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300 font-mono text-[11px]">
                    {p.bankInfo}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                      p.status === 'processed' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    {p.status === 'pending' ? (
                      <button
                        onClick={() => handleApprove(p.id)}
                        className="px-3 py-1.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs"
                      >
                        Approve & Transfer
                      </button>
                    ) : (
                      <span className="text-[11px] font-mono text-slate-400">
                        {p.referenceNumber}
                      </span>
                    )}
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
