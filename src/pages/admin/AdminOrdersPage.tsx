import React, { useState } from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { InvoiceModal } from '../../components/buyer/InvoiceModal';
import {
  ShoppingBag,
  Printer,
  RotateCcw,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOrdersPage: React.FC = () => {
  const { darkMode, addToast } = useStore();
  const [orders, setOrders] = useState<Order[]>(() => StorageService.getOrders());
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  const handleForceStatus = (subOrderId: string, nextStatus: OrderStatus) => {
    StorageService.updateSubOrderStatus(subOrderId, nextStatus, 'Overridden by Marketplace Administrator');
    setOrders(StorageService.getOrders());
    addToast({ title: `Order status overridden to ${nextStatus}`, type: 'info' });
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
          All Marketplace Orders ({orders.length})
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Monitor fulfillment velocity, resolve customer disputes, and manage order statuses.
        </p>
      </div>

      <div className="space-y-4">
        {orders.map((o) => (
          <div
            key={o.id}
            className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-xs space-y-4`}
          >
            {/* Header */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800 text-xs">
              <div className="flex items-center gap-3">
                <span className="font-mono font-bold text-slate-900 dark:text-white">#{o.id}</span>
                <span className="text-slate-400">·</span>
                <span className="text-slate-500">{formatDateTime(o.createdAt)}</span>
                <span className="text-slate-400">·</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">
                  Buyer: {o.buyerName} ({o.shippingAddress.city}, {o.shippingAddress.state})
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="font-bold text-slate-900 dark:text-white font-mono">
                  {formatCurrency(o.totalAmount)} ({o.paymentMethod})
                </span>
                <button
                  onClick={() => setSelectedInvoiceOrder(o)}
                  className="px-2.5 py-1 rounded-lg border border-slate-300 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Invoice</span>
                </button>
              </div>
            </div>

            {/* Sub-orders */}
            <div className="space-y-3">
              {o.subOrders.map((sub) => (
                <div
                  key={sub.id}
                  className="p-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs"
                >
                  <div>
                    <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                      <span>Artisan: {sub.sellerName}</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300">
                        AWB: {sub.awbNumber}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-500 mt-0.5">
                      {sub.items.map((i) => `${i.title} (x${i.quantity})`).join(', ')}
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-mono text-teal-800 dark:text-teal-300 font-bold">
                      {formatCurrency(sub.subtotal)}
                    </span>

                    {/* Override Status Dropdown */}
                    <div className="flex items-center gap-1.5">
                      <span className="text-[11px] text-slate-400">Status:</span>
                      <select
                        value={sub.status}
                        onChange={(e) => handleForceStatus(sub.id, e.target.value as OrderStatus)}
                        className="bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg px-2 py-1 text-xs font-bold text-slate-900 dark:text-white"
                      >
                        <option value="placed">placed</option>
                        <option value="confirmed">confirmed</option>
                        <option value="packed">packed</option>
                        <option value="shipped">shipped</option>
                        <option value="out_for_delivery">out_for_delivery</option>
                        <option value="delivered">delivered</option>
                        <option value="cancelled">cancelled</option>
                        <option value="returned">returned</option>
                      </select>
                    </div>

                    <Link
                      to={`/orders/track/${sub.id}`}
                      className="text-amber-700 dark:text-amber-400 hover:underline font-semibold"
                    >
                      Track
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
