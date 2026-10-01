import React, { useState } from 'react';
import { SellerProfile } from '../../types';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { formatCurrency } from '../../utils/formatters';
import { X, ArrowRight, ShieldCheck, IndianRupee, CheckCircle2 } from 'lucide-react';

interface PayoutModalProps {
  seller: SellerProfile;
  onClose: () => void;
  onSuccess: () => void;
}

export const PayoutModal: React.FC<PayoutModalProps> = ({ seller, onClose, onSuccess }) => {
  const [amount, setAmount] = useState<number>(seller.walletBalance);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addToast } = useStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amount <= 0 || amount > seller.walletBalance) {
      addToast({ title: 'Invalid payout amount', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    const res = StorageService.requestPayout(seller.id, amount);
    setIsSubmitting(false);

    if (res.success) {
      addToast({ title: 'Payout Requested!', message: res.message, type: 'success' });
      onSuccess();
      onClose();
    } else {
      addToast({ title: 'Payout Request Failed', message: res.message, type: 'error' });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div>
            <h3 className="font-editorial text-lg font-bold text-[#0F1B2D]">Request Earnings Payout</h3>
            <p className="text-[11px] text-slate-500">Fast NEFT / IMPS settlement to registered bank</p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4">
          <div className="p-4 bg-teal-50/70 rounded-2xl border border-teal-200/60">
            <div className="text-xs text-teal-800 font-semibold mb-1">Available for Withdrawal</div>
            <div className="text-2xl font-bold font-mono text-teal-950">
              {formatCurrency(seller.walletBalance)}
            </div>
            <div className="text-[11px] text-teal-700 mt-1">
              Minimum payout: ₹500 · Zero processing fee
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Withdrawal Amount (₹)
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-2.5 text-slate-400 text-xs font-bold">₹</span>
              <input
                type="number"
                min={500}
                max={seller.walletBalance}
                value={amount}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl pl-8 pr-3.5 py-2.5 text-sm font-bold text-slate-900 font-mono"
              />
            </div>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-slate-200 text-xs space-y-1">
            <div className="font-semibold text-slate-800 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-teal-600" />
              <span>Verified Destination Account:</span>
            </div>
            <div className="text-slate-600 pl-5">
              {seller.bankDetails.bankName}<br />
              A/C: <span className="font-mono">{seller.bankDetails.accountNumber}</span> (IFSC: {seller.bankDetails.ifsc})<br />
              UPI: <span className="font-mono text-teal-800">{seller.bankDetails.upiId}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting || amount <= 0 || amount > seller.walletBalance}
            className="w-full py-3 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] disabled:bg-slate-200 disabled:text-slate-400 text-black font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
          >
            <span>Confirm & Transfer {formatCurrency(amount)}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
