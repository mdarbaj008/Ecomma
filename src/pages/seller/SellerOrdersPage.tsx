import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { SubOrder, Order, OrderStatus } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { ShippingLabelModal } from '../../components/seller/ShippingLabelModal';
import { ShippingTrackerView } from '../../components/buyer/ShippingTrackerView';
import {
  Package,
  Truck,
  CheckCircle2,
  Printer,
  FastForward,
  RotateCcw,
  Clock,
  ShieldCheck,
  ChevronRight,
} from 'lucide-react';

export const SellerOrdersPage: React.FC = () => {
  const { currentUser, darkMode, addToast } = useStore();
  const seller = StorageService.getSellerById(currentUser.sellerId || 'seller_1') || StorageService.getSellers()[0];
  const allOrders = StorageService.getOrders();

  // Find sub-orders belonging to this seller
  const sellerSubOrders = allOrders.flatMap((order) =>
    order.subOrders
      .filter((s) => s.sellerId === seller.id)
      .map((sub) => ({ sub, order }))
  );

  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'shipped' | 'delivered'>('all');
  const [labelOrder, setLabelOrder] = useState<{ sub: SubOrder; order: Order } | null>(null);
  const [trackingModalSub, setTrackingModalSub] = useState<SubOrder | null>(null);

  const filtered = sellerSubOrders.filter(({ sub }) => {
    if (activeTab === 'pending') return sub.status === 'placed' || sub.status === 'confirmed' || sub.status === 'packed';
    if (activeTab === 'shipped') return sub.status === 'shipped' || sub.status === 'out_for_delivery';
    if (activeTab === 'delivered') return sub.status === 'delivered';
    return true;
  });

  const handleMarkStatus = (subOrderId: string, nextStatus: OrderStatus) => {
    const updated = StorageService.updateSubOrderStatus(subOrderId, nextStatus);
    if (updated) {
      addToast({
        title: `Order Updated to ${nextStatus.toUpperCase()}`,
        message: nextStatus === 'packed' ? 'Courier assigned & AWB generated!' : 'Timeline updated.',
        type: 'success',
      });
      window.location.reload();
    }
  };

  const handleFastForward = (subOrderId: string) => {
    const updated = StorageService.fastForwardSubOrder(subOrderId);
    if (updated) {
      addToast({
        title: `Fast-Forwarded to ${updated.status.toUpperCase()}`,
        message: 'Simulated tracking step executed.',
        type: 'success',
      });
      window.location.reload();
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Orders & Shipping Fulfillment
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Accept artisan orders, generate courier AWB shipping labels, and schedule pickups.
          </p>
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'all' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            All ({sellerSubOrders.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'pending' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pending Dispatch
          </button>
          <button
            onClick={() => setActiveTab('shipped')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'shipped' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            In-Transit
          </button>
          <button
            onClick={() => setActiveTab('delivered')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              activeTab === 'delivered' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className={`p-12 text-center rounded-3xl border border-dashed ${darkMode ? 'border-slate-800' : 'border-slate-200'} space-y-2`}>
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-editorial text-base font-bold">No orders found in this queue</h3>
            <p className="text-xs text-slate-500">Orders placed by buyers will show up here immediately.</p>
          </div>
        ) : (
          filtered.map(({ sub, order }) => (
            <div
              key={sub.id}
              className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs space-y-4`}
            >
              {/* Top Row: IDs, Dates, Courier info */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
                <div className="flex items-center gap-3">
                  <span className="font-mono font-bold text-slate-900 dark:text-white">#{sub.id}</span>
                  <span className="text-slate-400">·</span>
                  <span className="text-slate-500">{formatDateTime(sub.createdAt)}</span>
                  <span className="text-slate-400">·</span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    Buyer: {order.buyerName} ({order.shippingAddress.city}, {order.shippingAddress.state})
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-slate-500">
                    AWB: <strong>{sub.awbNumber}</strong> ({sub.courierName})
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                    sub.status === 'delivered'
                      ? 'bg-teal-100 text-teal-800'
                      : sub.status === 'shipped' || sub.status === 'out_for_delivery'
                      ? 'bg-purple-100 text-purple-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}>
                    {sub.status.replace(/_/g, ' ')}
                  </span>
                </div>
              </div>

              {/* Items in Sub-order */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                <div className="md:col-span-6 space-y-2">
                  {sub.items.map((it, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-xs">
                      <img src={it.image} alt={it.title} className="w-12 h-12 rounded-xl object-cover shrink-0" />
                      <div className="min-w-0">
                        <div className="font-semibold text-slate-900 dark:text-white truncate">{it.title}</div>
                        <div className="text-[11px] text-slate-400">Qty: {it.quantity} · {formatCurrency(it.price)}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Earnings & Financial Breakdown */}
                <div className="md:col-span-3 text-xs space-y-1 p-3 bg-stone-50 dark:bg-slate-800/60 rounded-xl">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal:</span>
                    <span className="font-mono text-slate-900 dark:text-white">{formatCurrency(sub.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>8% Commission:</span>
                    <span className="font-mono text-red-600">- {formatCurrency(sub.commission)}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-slate-200 dark:border-slate-700 pt-1 text-teal-700 dark:text-teal-400">
                    <span>Your Payout:</span>
                    <span className="font-mono">{formatCurrency(sub.sellerPayout)}</span>
                  </div>
                  {order.paymentMethod === 'COD' && (
                    <div className="text-[10px] text-amber-700 dark:text-amber-300 font-semibold pt-0.5">
                      Cash on Delivery (Pending Courier Remittance)
                    </div>
                  )}
                </div>

                {/* Seller Actions & Workflow Controls */}
                <div className="md:col-span-3 flex flex-col gap-2">
                  {sub.status === 'placed' && (
                    <button
                      onClick={() => handleMarkStatus(sub.id, 'confirmed')}
                      className="w-full py-2 rounded-xl bg-[#0F1B2D] text-white hover:bg-slate-800 text-xs font-bold transition-all"
                    >
                      Accept & Confirm Order
                    </button>
                  )}

                  {sub.status === 'confirmed' && (
                    <button
                      onClick={() => handleMarkStatus(sub.id, 'packed')}
                      className="w-full py-2 rounded-xl bg-[#F59E0B] text-black hover:bg-[#e08e07] text-xs font-bold transition-all"
                    >
                      Mark Packed & Generate AWB
                    </button>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setLabelOrder({ sub, order })}
                      className="flex-1 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-semibold flex items-center justify-center gap-1.5"
                    >
                      <Printer className="w-3.5 h-3.5" />
                      <span>Print Label</span>
                    </button>

                    <button
                      onClick={() => handleFastForward(sub.id)}
                      className="px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold flex items-center gap-1 border border-amber-300"
                      title="Fast forward simulation to next stage"
                    >
                      <FastForward className="w-3.5 h-3.5" />
                      <span>Fast Forward</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Shipping Label Modal */}
      {labelOrder && (
        <ShippingLabelModal
          subOrder={labelOrder.sub}
          order={labelOrder.order}
          onClose={() => setLabelOrder(null)}
        />
      )}
    </div>
  );
};
