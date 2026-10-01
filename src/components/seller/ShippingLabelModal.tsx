import React from 'react';
import { SubOrder, Order } from '../../types';
import { StorageService } from '../../services/storage';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { X, Printer, Barcode, ShieldCheck } from 'lucide-react';

interface ShippingLabelModalProps {
  subOrder: SubOrder;
  order: Order;
  onClose: () => void;
}

export const ShippingLabelModal: React.FC<ShippingLabelModalProps> = ({
  subOrder,
  order,
  onClose,
}) => {
  const seller = StorageService.getSellerById(subOrder.sellerId);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 relative my-6 print:p-0 print:border-none print:shadow-none">
        {/* Controls */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 print:hidden">
          <div className="text-xs font-bold text-slate-800">Air Waybill Shipping Label</div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-lg bg-[#0F1B2D] text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Label</span>
            </button>
            <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-700">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* The Label (Standard 4x6 inch format aesthetic) */}
        <div className="border-2 border-black rounded-lg p-5 mt-3 space-y-4 font-sans text-xs text-black">
          {/* Top Courier Header */}
          <div className="flex justify-between items-start border-b-2 border-black pb-3">
            <div>
              <div className="font-extrabold text-xl tracking-tight uppercase">
                {subOrder.courierName}
              </div>
              <div className="text-[10px] font-bold">EXPRESS SURFACE LOGISTICS</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black font-mono tracking-wider">
                {order.shippingAddress.pincode.slice(0, 3)} - {order.shippingAddress.pincode.slice(3)}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-700">
                ROUTING HUB: {order.shippingAddress.state.slice(0, 3).toUpperCase()}
              </div>
            </div>
          </div>

          {/* Barcode & AWB */}
          <div className="text-center py-2 border-b border-black">
            {/* Realistic CSS Barcode representation */}
            <div className="h-14 flex items-center justify-center gap-[2px] max-w-xs mx-auto overflow-hidden">
              {[4,2,3,1,4,1,2,3,4,2,1,3,2,4,1,2,3,4,1,2,4,3,1,2,4,1,3,2,1,4,2,3,1,4,2,3,1,2,4,1,3].map((w, i) => (
                <div key={i} className="bg-black h-full" style={{ width: `${w * 1.5}px` }} />
              ))}
            </div>
            <div className="font-mono text-sm font-black tracking-widest mt-1">
              AWB: {subOrder.awbNumber}
            </div>
          </div>

          {/* Payment & Package Specs */}
          <div className="grid grid-cols-2 gap-2 border-b border-black pb-3">
            <div className="p-2 border border-black rounded bg-stone-50">
              <div className="text-[10px] font-bold uppercase text-slate-600">Payment Mode</div>
              <div className="text-base font-black">
                {order.paymentMethod === 'COD' ? 'CASH ON DELIVERY (COD)' : 'PREPAID ONLINE'}
              </div>
              {order.paymentMethod === 'COD' && (
                <div className="text-sm font-extrabold text-red-600 mt-0.5">
                  Collect Cash: {formatCurrency(subOrder.subtotal + (order.codFee || 0))}
                </div>
              )}
            </div>

            <div className="p-2 border border-black rounded">
              <div className="text-[10px] font-bold uppercase text-slate-600">Package Spec</div>
              <div>Weight: <strong className="font-bold">0.85 kg</strong></div>
              <div>Sub-Order: <strong className="font-mono">{subOrder.id}</strong></div>
            </div>
          </div>

          {/* Ship To & Ship From */}
          <div className="grid grid-cols-2 gap-4 border-b border-black pb-3">
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider mb-1">Deliver To:</div>
              <div className="font-extrabold text-sm">{order.buyerName}</div>
              <div className="text-[11px] leading-snug">
                {order.shippingAddress.addressLine1}<br />
                {order.shippingAddress.addressLine2 && <>{order.shippingAddress.addressLine2}<br /></>}
                {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                <strong className="text-sm font-bold">PIN: {order.shippingAddress.pincode}</strong><br />
                Ph: {order.shippingAddress.phone}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-black uppercase tracking-wider mb-1">Return / Seller:</div>
              <div className="font-bold text-xs">{seller?.storeName || subOrder.sellerName}</div>
              <div className="text-[11px] text-slate-700 leading-snug">
                {seller?.pickupAddress.addressLine1 || 'Chowk Craft Center'}<br />
                {seller?.city || 'Varanasi'}, {seller?.state || 'UP'} - {seller?.pickupAddress.pincode || '221001'}<br />
                GSTIN: {seller?.gstNumber || '09AAAFV1234F1Z8'}
              </div>
            </div>
          </div>

          {/* Contents summary */}
          <div className="text-[10px]">
            <span className="font-bold">Items: </span>
            {subOrder.items.map((it) => `${it.title} (x${it.quantity})`).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};
