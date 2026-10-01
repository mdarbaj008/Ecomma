import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { StorageService } from '../../services/storage';
import { SubOrder, Order } from '../../types';
import { ShippingTrackerView } from '../../components/buyer/ShippingTrackerView';
import { ArrowLeft, Truck, Package, HelpCircle } from 'lucide-react';

export const OrderTrackingPage: React.FC = () => {
  const { subOrderId } = useParams<{ subOrderId: string }>();
  const [subOrder, setSubOrder] = useState<SubOrder | null>(null);
  const [parentOrder, setParentOrder] = useState<Order | null>(null);
  const [, setRefresh] = useState(0);

  useEffect(() => {
    if (subOrderId) {
      const orders = StorageService.getOrders();
      for (const o of orders) {
        const sub = o.subOrders.find((s) => s.id === subOrderId || s.orderId === subOrderId);
        if (sub) {
          setSubOrder(sub);
          setParentOrder(o);
          break;
        }
      }
    }
  }, [subOrderId]);

  if (!subOrder) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <h2 className="font-editorial text-2xl font-bold text-slate-800">Shipment Record Not Found</h2>
        <p className="text-xs text-slate-500">Please verify the AWB or Order reference number.</p>
        <Link to="/orders" className="inline-block px-4 py-2 bg-[#0F1B2D] text-white text-xs font-semibold rounded-xl">
          Return to My Orders
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Back button */}
      <div>
        <Link
          to="/orders"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to All Orders</span>
        </Link>
      </div>

      {/* Header */}
      <div className="space-y-1">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-800 text-xs font-semibold border border-teal-200">
          <Truck className="w-3.5 h-3.5" />
          <span>Active Real-Time Logistics Tracking</span>
        </div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
          Package Shipment Details
        </h1>
        <p className="text-xs text-slate-500">
          Order Reference: <strong className="font-mono text-slate-800">{subOrder.orderId}</strong> · Sub-order: <span className="font-mono">{subOrder.id}</span>
        </p>
      </div>

      {/* Shipping Tracker Card */}
      <ShippingTrackerView
        subOrder={subOrder}
        onStatusChanged={() => {
          // Re-fetch subOrder
          const orders = StorageService.getOrders();
          for (const o of orders) {
            const sub = o.subOrders.find((s) => s.id === subOrder.id);
            if (sub) {
              setSubOrder({ ...sub });
              setRefresh((r) => r + 1);
              break;
            }
          }
        }}
      />

      {/* Package Contents Card */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs space-y-3">
        <div className="text-xs font-bold text-slate-900 uppercase tracking-wider">
          Package Contents ({subOrder.items.length} items)
        </div>
        <div className="divide-y divide-slate-100">
          {subOrder.items.map((it, idx) => (
            <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <img src={it.image} alt={it.title} className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="font-semibold text-slate-900">{it.title}</div>
                  <div className="text-[11px] text-slate-400">Qty: {it.quantity}</div>
                </div>
              </div>
              <div className="font-bold font-mono text-slate-900">
                ₹{it.price * it.quantity}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
