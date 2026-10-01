import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { StorageService } from '../../services/storage';
import { Order } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { InvoiceModal } from '../../components/buyer/InvoiceModal';
import {
  CheckCircle2,
  Package,
  Printer,
  ArrowRight,
  Truck,
  ShieldCheck,
  ShoppingBag,
} from 'lucide-react';

export const OrderSuccessPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);

  useEffect(() => {
    // Launch celebratory confetti
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#F59E0B', '#14B8A6', '#0F1B2D', '#FF6B4A'],
    });

    if (orderId) {
      const o = StorageService.getOrderById(orderId);
      if (o) setOrder(o);
    }
  }, [orderId]);

  if (!order) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold">Order Received</h2>
        <Link to="/orders" className="text-xs font-semibold text-amber-700 underline">
          View All Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {/* Top Success Badge */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-4 shadow-sm">
        <div className="w-16 h-16 rounded-full bg-teal-50 border border-teal-200 text-teal-600 flex items-center justify-center mx-auto shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-teal-700">
            Payment & Order Confirmed
          </span>
          <h1 className="font-editorial text-3xl font-bold text-[#0F1B2D]">
            Dhanyavaad! Your Order is Placed.
          </h1>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Order <strong className="font-mono text-slate-900">{order.id}</strong> has been forwarded to our master weavers and artisans.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            to={`/orders/track/${order.subOrders[0]?.id || order.id}`}
            className="px-5 py-2.5 rounded-xl bg-[#0F1B2D] hover:bg-[#1E293B] text-white text-xs font-bold flex items-center gap-2 shadow-xs"
          >
            <Truck className="w-4 h-4 text-[#F59E0B]" />
            <span>Track Live Shipment</span>
          </Link>

          <button
            onClick={() => setIsInvoiceOpen(true)}
            className="px-5 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-slate-800 text-xs font-semibold flex items-center gap-2"
          >
            <Printer className="w-4 h-4" />
            <span>View & Print Tax Invoice</span>
          </button>
        </div>
      </div>

      {/* Sub-Orders Breakdown by Artisan */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-editorial text-xl font-bold text-[#0F1B2D]">
            Artisan Dispatch Packages ({order.subOrders.length})
          </h2>
          <span className="text-xs text-slate-500">Individual AWB & Courier assigned</span>
        </div>

        <div className="space-y-4">
          {order.subOrders.map((sub) => (
            <div
              key={sub.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span className="font-bold text-slate-900">{sub.sellerName}</span>
                </div>
                <div className="flex items-center gap-3 text-slate-500">
                  <span>Courier: <strong className="text-slate-800">{sub.courierName}</strong></span>
                  <span>AWB: <strong className="font-mono text-slate-800">{sub.awbNumber}</strong></span>
                </div>
              </div>

              {/* Items */}
              <div className="space-y-2">
                {sub.items.map((it, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-3">
                      <img src={it.image} alt={it.title} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <div className="font-semibold text-slate-900">{it.title}</div>
                        <div className="text-[11px] text-slate-400">Quantity: {it.quantity}</div>
                      </div>
                    </div>
                    <div className="font-bold text-slate-900 font-mono">
                      {formatCurrency(it.price * it.quantity)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-teal-800 font-semibold">
                  Estimated Delivery: {sub.estimatedDelivery}
                </span>
                <Link
                  to={`/orders/track/${sub.id}`}
                  className="text-amber-800 font-bold hover:underline flex items-center gap-1"
                >
                  <span>Track Package</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Invoice Modal */}
      {isInvoiceOpen && (
        <InvoiceModal order={order} onClose={() => setIsInvoiceOpen(false)} />
      )}
    </div>
  );
};
