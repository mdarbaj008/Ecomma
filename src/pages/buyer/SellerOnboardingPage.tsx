import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import {
  Store,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Building,
  CreditCard,
  MapPin,
  FileCheck,
  Sparkles,
} from 'lucide-react';

export const SellerOnboardingPage: React.FC = () => {
  const { currentUser, setCurrentUser, addToast } = useStore();
  const navigate = useNavigate();

  const [storeName, setStoreName] = useState('Nilgiri Organic Growers Collective');
  const [description, setDescription] = useState('Smallholder cooperative harvesting single-origin orthodox black teas, wild honey, and botanical oils in Ooty.');
  const [city, setCity] = useState('Ooty');
  const [state, setState] = useState('Tamil Nadu');
  const [pincode, setPincode] = useState('643001');
  const [pickupAddressLine, setPickupAddressLine] = useState('Old Post Office Road, Charing Cross');
  const [gstNumber, setGstNumber] = useState('33AABCN8899K1Z4');
  const [upiId, setUpiId] = useState('nilgiricollective@upi');
  const [bankName, setBankName] = useState('Canara Bank Commercial Road');
  const [accountNumber, setAccountNumber] = useState('11928374650');
  const [ifsc, setIfsc] = useState('CNRB0001234');
  const [kycFileMock, setKycFileMock] = useState('udyam_registration_cert.pdf');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!storeName || !city || !state || !pincode) {
      addToast({ title: 'Please fill all required fields', type: 'error' });
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      const newSeller = StorageService.registerSeller(
        {
          storeName,
          description,
          city,
          state,
          gstNumber: gstNumber || undefined,
          bankDetails: {
            upiId,
            bankName,
            accountNumber,
            ifsc,
          },
          pickupAddress: {
            id: `pick_${Date.now()}`,
            name: `${storeName} Dispatch Depot`,
            phone: currentUser.phone || '+91 94433 11223',
            addressLine1: pickupAddressLine,
            city,
            state,
            pincode,
            type: 'work',
          },
        },
        currentUser
      );

      setIsSubmitting(false);
      addToast({
        title: 'Welcome to Ecomma Seller Community!',
        message: `Store "${storeName}" onboarded. 8% fair commission activated.`,
        type: 'success',
      });
      navigate('/seller');
    }, 1000);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-[#0F1B2D] via-[#1E293B] to-[#0F1B2D] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-amber-500/20 shadow-xl">
        <div className="relative z-10 max-w-xl space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-[#F59E0B] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Fast-Track Artisan Onboarding</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
            Start Selling on Ecomma
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Reach conscious buyers across 28,000+ Indian pincodes. Enjoy automated courier pickups, AI listing assistance, transparent 8% commission, and next-day payout transfers.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-sm space-y-8">
        {/* Section 1: Business Identity */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#0F1B2D]">
            <Store className="w-4 h-4 text-amber-600" />
            <span>1. Store & Workshop Identity</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Store or Collective Name *
              </label>
              <input
                type="text"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs text-slate-900 font-semibold focus:ring-2 focus:ring-[#F59E0B]"
                required
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                GSTIN (Optional for Handloom Artisans under ₹40L)
              </label>
              <input
                type="text"
                value={gstNumber}
                onChange={(e) => setGstNumber(e.target.value.toUpperCase())}
                placeholder="22AAAAA0000A1Z5"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono uppercase"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Store Craft Heritage & Story
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs leading-relaxed"
            />
          </div>
        </div>

        {/* Section 2: Pickup Warehouse Address */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#0F1B2D]">
            <MapPin className="w-4 h-4 text-teal-600" />
            <span>2. Courier Pickup Warehouse Address</span>
          </div>

          <div className="text-xs">
            <label className="block font-semibold text-slate-700 mb-1">
              Warehouse / Workshop Street Address *
            </label>
            <input
              type="text"
              value={pickupAddressLine}
              onChange={(e) => setPickupAddressLine(e.target.value)}
              className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-3 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">PIN Code *</label>
              <input
                type="text"
                maxLength={6}
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">City / Cluster *</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">State *</label>
              <input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 3: Bank & Settlement Details */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#0F1B2D]">
            <CreditCard className="w-4 h-4 text-amber-600" />
            <span>3. Bank & Payout Remittance</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">UPI VPA (Instant Payout) *</label>
              <input
                type="text"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="storename@bank"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Bank Name *</label>
              <input
                type="text"
                value={bankName}
                onChange={(e) => setBankName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Account Number *</label>
              <input
                type="text"
                value={accountNumber}
                onChange={(e) => setAccountNumber(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono"
                required
              />
            </div>
            <div>
              <label className="block font-semibold text-slate-700 mb-1">IFSC Code *</label>
              <input
                type="text"
                value={ifsc}
                onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs font-mono uppercase"
                required
              />
            </div>
          </div>
        </div>

        {/* Section 4: Mock KYC Verification */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 text-sm font-bold text-[#0F1B2D]">
            <FileCheck className="w-4 h-4 text-teal-600" />
            <span>4. Verification & KYC Document (Mock Upload)</span>
          </div>

          <div className="p-4 border-2 border-dashed border-slate-300 rounded-2xl flex items-center justify-between gap-4 text-xs bg-stone-50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                PDF
              </div>
              <div>
                <div className="font-semibold text-slate-900">{kycFileMock}</div>
                <div className="text-[11px] text-slate-400">Udyam Registration / Weaver ID Card / Aadhaar</div>
              </div>
            </div>
            <button
              type="button"
              onClick={() => alert('Simulated document replacement')}
              className="px-3 py-1.5 border border-slate-300 rounded-lg text-slate-700 font-semibold text-xs hover:bg-white"
            >
              Replace
            </button>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 max-w-sm">
            By submitting, you agree to Ecomma&apos;s Fair Artisan Charter and standard 8% commission on fulfilled orders.
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-8 py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-[#0F1B2D] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
          >
            {isSubmitting ? (
              <span>Provisioning Artisan Store...</span>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                <span>Submit & Launch Seller Store</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};
