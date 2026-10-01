import React, { useState } from 'react';
import { checkPincodeServiceability, PincodeDeliveryInfo } from '../../utils/formatters';
import { MapPin, CheckCircle2, AlertCircle, Truck, Clock } from 'lucide-react';

interface PincodeCheckerProps {
  initialPincode?: string;
}

export const PincodeChecker: React.FC<PincodeCheckerProps> = ({ initialPincode = '201305' }) => {
  const [pincode, setPincode] = useState(initialPincode);
  const [info, setInfo] = useState<PincodeDeliveryInfo | null>(() => checkPincodeServiceability(initialPincode));
  const [searched, setSearched] = useState(true);

  const handleCheck = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkPincodeServiceability(pincode);
    setInfo(result);
    setSearched(true);
  };

  return (
    <div className="bg-stone-50/80 rounded-2xl p-4 border border-slate-200">
      <div className="flex items-center gap-2 mb-2 text-xs font-bold text-[#0F1B2D]">
        <MapPin className="w-4 h-4 text-[#F59E0B]" />
        <span>Check Delivery & COD Availability</span>
      </div>

      <form onSubmit={handleCheck} className="flex gap-2 mb-3">
        <input
          type="text"
          maxLength={6}
          value={pincode}
          onChange={(e) => setPincode(e.target.value.replace(/\D/g, ''))}
          placeholder="Enter 6-digit Pincode (e.g. 110001)"
          className="flex-1 bg-white border border-slate-300 text-xs px-3 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#F59E0B] font-mono"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-[#0F1B2D] hover:bg-[#1E293B] text-white text-xs font-semibold rounded-xl transition-colors shrink-0"
        >
          Check
        </button>
      </form>

      {searched && info && info.valid && (
        <div className="space-y-1.5 text-xs">
          <div className="flex items-center gap-2 text-teal-800 font-medium">
            <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
            <span>
              Delivery to <strong className="font-semibold">{info.city}, {info.state}</strong> by <strong className="font-semibold text-slate-900">{info.deliveryDateStr}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 pl-6">
            <Truck className="w-3.5 h-3.5 text-slate-400" />
            <span>Standard Express Courier · <strong className="text-teal-700">FREE Delivery</strong></span>
          </div>
          <div className="flex items-center gap-2 text-slate-600 pl-6">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>Cash on Delivery (COD) is available at this address</span>
          </div>
        </div>
      )}

      {searched && (!info || !info.valid) && (
        <div className="flex items-center gap-2 text-xs text-coral-600 text-red-600 font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Please enter a valid 6-digit Indian Postal PIN code</span>
        </div>
      )}
    </div>
  );
};
