import React from 'react';
import { SubOrder, OrderStatus } from '../../types';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import {
  CheckCircle2,
  Clock,
  Package,
  Truck,
  MapPin,
  FastForward,
  Copy,
  ExternalLink,
} from 'lucide-react';

interface ShippingTrackerViewProps {
  subOrder: SubOrder;
  onStatusChanged?: () => void;
}

export const ShippingTrackerView: React.FC<ShippingTrackerViewProps> = ({
  subOrder,
  onStatusChanged,
}) => {
  const { addToast } = useStore();

  const steps: { key: OrderStatus; label: string; desc: string }[] = [
    { key: 'placed', label: 'Placed', desc: 'Order received' },
    { key: 'confirmed', label: 'Confirmed', desc: 'Artisan verified' },
    { key: 'packed', label: 'Packed', desc: 'Tamper-proof casing' },
    { key: 'shipped', label: 'Shipped', desc: 'Handed to courier' },
    { key: 'out_for_delivery', label: 'Out for Delivery', desc: 'With delivery rider' },
    { key: 'delivered', label: 'Delivered', desc: 'Safely delivered' },
  ];

  const currentIdx = steps.findIndex((s) => s.key === subOrder.status);

  const handleFastForward = () => {
    const updated = StorageService.fastForwardSubOrder(subOrder.id);
    if (updated) {
      addToast({
        title: `Order progressed to ${updated.status.toUpperCase()}`,
        message: 'Fast-forward simulation applied!',
        type: 'success',
      });
      if (onStatusChanged) onStatusChanged();
    } else {
      addToast({
        title: 'Order already at final status',
        type: 'info',
      });
    }
  };

  const copyAwb = () => {
    navigator.clipboard.writeText(subOrder.awbNumber);
    addToast({ title: 'AWB Copied to clipboard', message: subOrder.awbNumber, type: 'info' });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-6">
      {/* Courier & AWB Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200/60 flex items-center justify-center text-amber-700">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              {subOrder.courierName}
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-slate-900">{subOrder.awbNumber}</span>
              <button
                onClick={copyAwb}
                className="text-slate-400 hover:text-slate-700 p-1"
                title="Copy AWB"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-[11px] text-slate-400">Estimated Delivery</div>
            <div className="text-xs font-bold text-teal-800">{subOrder.estimatedDelivery}</div>
          </div>

          <button
            onClick={handleFastForward}
            className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-300"
            title="Simulate next tracking state"
          >
            <FastForward className="w-3.5 h-3.5" />
            <span>Fast-Forward Demo</span>
          </button>
        </div>
      </div>

      {/* Visual Timeline Bar */}
      <div className="py-2">
        <div className="relative flex items-center justify-between">
          {/* Background Connecting Line */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
          {/* Active Connecting Line */}
          <div
            className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#14B8A6] z-0 transition-all duration-500"
            style={{
              width: `${Math.max(0, (currentIdx / (steps.length - 1)) * 100)}%`,
            }}
          />

          {steps.map((step, idx) => {
            const isCompleted = idx <= currentIdx;
            const isCurrent = idx === currentIdx;

            return (
              <div key={step.key} className="relative z-10 flex flex-col items-center">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isCompleted
                      ? 'bg-[#14B8A6] text-white ring-4 ring-teal-50'
                      : 'bg-white border-2 border-slate-300 text-slate-400'
                  } ${isCurrent ? 'ring-[#F59E0B]/30 ring-4 scale-110' : ''}`}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-4 h-4" />
                  ) : (
                    <span className="text-[10px] font-bold">{idx + 1}</span>
                  )}
                </div>
                <div className="text-[11px] font-semibold text-slate-800 mt-2 text-center whitespace-nowrap">
                  {step.label}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Map Progress Illustration Card */}
      <div className="bg-gradient-to-r from-stone-900 via-slate-900 to-[#0F1B2D] text-white rounded-xl p-4 flex items-center justify-between relative overflow-hidden">
        <div className="relative z-10 space-y-1">
          <div className="text-[11px] uppercase tracking-wider text-amber-400 font-semibold">
            Live Package Transit
          </div>
          <div className="text-sm font-bold flex items-center gap-2">
            <span>{subOrder.sellerName}</span>
            <span className="text-slate-400">➔</span>
            <span>Customer Destination</span>
          </div>
          <p className="text-xs text-slate-300">
            Current Stage: <strong className="text-white capitalize">{subOrder.status.replace(/_/g, ' ')}</strong>
          </p>
        </div>

        <div className="relative z-10 hidden sm:flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center backdrop-blur-md border border-white/20">
            <Truck className="w-6 h-6 text-amber-400 animate-pulse" />
          </div>
        </div>

        {/* Ambient background grid dots */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
      </div>

      {/* Detailed Tracking History Events */}
      <div>
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">
          Status History & Scans
        </div>
        <div className="space-y-3 pl-2 border-l-2 border-slate-200">
          {subOrder.trackingEvents.map((evt, idx) => (
            <div key={idx} className="relative pl-4 text-xs">
              <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#14B8A6] ring-2 ring-white" />
              <div className="flex items-center justify-between text-slate-500 text-[11px] mb-0.5">
                <span className="font-semibold text-slate-900">{evt.status}</span>
                <span>{evt.timestamp}</span>
              </div>
              <div className="text-slate-600">{evt.description}</div>
              <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                <MapPin className="w-3 h-3" />
                <span>{evt.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
