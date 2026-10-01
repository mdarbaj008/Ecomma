import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { PayoutModal } from '../../components/seller/PayoutModal';
import {
  Wallet,
  ArrowUpRight,
  Clock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Download,
  IndianRupee,
} from 'lucide-react';

export const SellerEarningsPage: React.FC = () => {
  const { currentUser, darkMode, addToast } = useStore();
  const seller = StorageService.getSellerById(currentUser.sellerId || 'seller_1') || StorageService.getSellers()[0];
  const payouts = StorageService.getPayouts().filter((p) => p.sellerId === seller.id);
  const [isPayoutModalOpen, setIsPayoutModalOpen] = useState(false);

  const allOrders = StorageService.getOrders();
  const sellerSubOrders = allOrders.flatMap((o) =>
    o.subOrders.filter((s) => s.sellerId === seller.id)
  );

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Artisan Wallet & Earnings Remittance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Real-time balance, automated 8% fair platform deductions, and instant UPI/NEFT payouts.
          </p>
        </div>

        <button
          onClick={() => setIsPayoutModalOpen(true)}
          className="px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-black font-bold text-xs shadow-md flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <ArrowUpRight className="w-4 h-4" />
          <span>Request Payout Transfer</span>
        </button>
      </div>

      {/* Wallet Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-2`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Wallet className="w-4 h-4 text-teal-600" />
            <span>Available for Withdrawal</span>
          </div>
          <div className="text-3xl font-bold font-mono text-teal-700 dark:text-teal-400 tabular-nums">
            {formatCurrency(seller.walletBalance)}
          </div>
          <p className="text-[11px] text-slate-400">
            From fulfilled & delivered shipments. Instant NEFT/UPI settlement.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-2`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-amber-600" />
            <span>Pending Delivery & COD Remittance</span>
          </div>
          <div className="text-3xl font-bold font-mono text-amber-600 tabular-nums">
            {formatCurrency(seller.pendingBalance)}
          </div>
          <p className="text-[11px] text-slate-400">
            Unlocked automatically once the courier delivers the package to the buyer.
          </p>
        </div>

        <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-2`}>
          <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Lifetime Disbursed Earnings</span>
          </div>
          <div className="text-3xl font-bold font-mono text-slate-900 dark:text-white tabular-nums">
            {formatCurrency(seller.totalEarnings)}
          </div>
          <p className="text-[11px] text-slate-400">
            Across {seller.totalOrders} total verified marketplace orders.
          </p>
        </div>
      </div>

      {/* Payout Transfer History */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
          <div>
            <h3 className="font-editorial text-base font-bold">Payout Transfer Requests</h3>
            <p className="text-xs text-slate-500">Record of all bank disbursements</p>
          </div>
          <button
            onClick={() => addToast({ title: 'Statement generated', message: 'Downloading PDF statement...', type: 'info' })}
            className="px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Statement</span>
          </button>
        </div>

        {payouts.length === 0 ? (
          <p className="text-xs text-slate-500 py-4 text-center">No payout requests initiated yet.</p>
        ) : (
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {payouts.map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between text-xs">
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <span className="font-mono text-sm">{formatCurrency(p.amount)}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                      p.status === 'processed' ? 'bg-teal-100 text-teal-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {p.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Requested: {formatDateTime(p.requestedAt)} · Bank: {p.bankInfo}
                  </div>
                </div>

                <div className="text-right">
                  {p.referenceNumber && (
                    <div className="font-mono text-[11px] font-bold text-teal-700 dark:text-teal-400">
                      Ref: {p.referenceNumber}
                    </div>
                  )}
                  <div className="text-[10px] text-slate-400">Zero Processing Fee</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Commission Breakdown Ledger */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <h3 className="font-editorial text-base font-bold">Recent Order Commission Breakdown (8% Policy)</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className={`border-b ${darkMode ? 'border-slate-800 text-slate-400' : 'border-slate-100 text-slate-500'} font-semibold`}>
              <tr>
                <th className="py-2.5 px-3">Order / Date</th>
                <th className="py-2.5 px-3">Gross Subtotal</th>
                <th className="py-2.5 px-3 text-red-600">Ecomma Commission (8%)</th>
                <th className="py-2.5 px-3 text-teal-700">Net Seller Remittance</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className={`divide-y ${darkMode ? 'divide-slate-800' : 'divide-slate-100'}`}>
              {sellerSubOrders.map((sub) => (
                <tr key={sub.id}>
                  <td className="py-3 px-3">
                    <div className="font-mono font-bold text-slate-900 dark:text-white">#{sub.id}</div>
                    <div className="text-[11px] text-slate-400">{sub.estimatedDelivery}</div>
                  </td>
                  <td className="py-3 px-3 font-mono tabular-nums">{formatCurrency(sub.subtotal)}</td>
                  <td className="py-3 px-3 font-mono tabular-nums text-red-600">- {formatCurrency(sub.commission)}</td>
                  <td className="py-3 px-3 font-mono font-bold tabular-nums text-teal-700 dark:text-teal-400">
                    {formatCurrency(sub.sellerPayout)}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                      {sub.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Payout Modal */}
      {isPayoutModalOpen && (
        <PayoutModal
          seller={seller}
          onClose={() => setIsPayoutModalOpen(false)}
          onSuccess={() => window.location.reload()}
        />
      )}
    </div>
  );
};
