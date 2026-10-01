import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../../services/storage';
import { Order, OrderStatus } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { InvoiceModal } from '../../components/buyer/InvoiceModal';
import { useStore } from '../../store/useStore';
import {
  Package,
  Truck,
  Printer,
  ChevronRight,
  RotateCcw,
  XCircle,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const OrdersPage: React.FC = () => {
  const { currentUser, addToast } = useStore();
  const [filter, setFilter] = useState<'all' | 'active' | 'delivered'>('all');
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState<Order | null>(null);

  // Get orders for current buyer (or all in demo)
  const orders = StorageService.getOrders();

  const filteredOrders = orders.filter((o) => {
    if (filter === 'active') return o.status !== 'delivered' && o.status !== 'cancelled';
    if (filter === 'delivered') return o.status === 'delivered';
    return true;
  });

  const handleCancelSubOrder = (subOrderId: string) => {
    if (window.confirm('Are you sure you want to cancel this item?')) {
      const updated = StorageService.updateSubOrderStatus(subOrderId, 'cancelled', 'Cancelled by customer request');
      if (updated) {
        addToast({ title: 'Item Cancelled', message: 'Refund initiated to source payment.', type: 'info' });
        // Force refresh
        window.location.reload();
      }
    }
  };

  const handleReturnRequest = (subOrderId: string) => {
    if (window.confirm('Request a 7-day hassle-free replacement or return pickup?')) {
      StorageService.updateSubOrderStatus(subOrderId, 'returned', 'Customer requested return pickup');
      addToast({ title: 'Return Pickup Scheduled', message: 'Courier will inspect and collect item.', type: 'success' });
      window.location.reload();
    }
  };

  const statusColors: Record<OrderStatus, string> = {
    placed: 'bg-amber-100 text-amber-900 border-amber-200',
    confirmed: 'bg-blue-100 text-blue-900 border-blue-200',
    packed: 'bg-indigo-100 text-indigo-900 border-indigo-200',
    shipped: 'bg-purple-100 text-purple-900 border-purple-200',
    out_for_delivery: 'bg-orange-100 text-orange-900 border-orange-200',
    delivered: 'bg-teal-100 text-teal-900 border-teal-200',
    cancelled: 'bg-red-100 text-red-900 border-red-200',
    returned: 'bg-stone-100 text-stone-900 border-stone-200',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
            My Orders & Shipments
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Track real-time delivery progress, download tax invoices, and manage returns.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            All Orders ({orders.length})
          </button>
          <button
            onClick={() => setFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'active' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Active In-Transit
          </button>
          <button
            onClick={() => setFilter('delivered')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              filter === 'delivered' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
            }`}
          >
            Delivered
          </button>
        </div>
      </div>

      {/* Orders List */}
      <div className="space-y-6">
        {filteredOrders.length === 0 ? (
          <div className="bg-white rounded-3xl border border-dashed border-slate-300 p-12 text-center space-y-3">
            <Package className="w-10 h-10 text-slate-400 mx-auto" />
            <h3 className="font-editorial text-lg font-bold text-slate-800">No Orders in this View</h3>
            <p className="text-xs text-slate-500">You haven&apos;t placed any orders matching this filter yet.</p>
            <Link to="/products" className="inline-block px-4 py-2 bg-[#0F1B2D] text-white text-xs font-semibold rounded-xl">
              Start Shopping
            </Link>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden space-y-4"
            >
              {/* Order Header */}
              <div className="p-4 sm:p-5 bg-stone-50/80 border-b border-slate-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-4">
                  <div>
                    <span className="text-slate-400 text-[11px] block">Order Placed</span>
                    <strong className="text-slate-900">{formatDateTime(order.createdAt)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Total Amount</span>
                    <strong className="text-slate-900 font-mono">{formatCurrency(order.totalAmount)}</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 text-[11px] block">Ship To</span>
                    <strong className="text-slate-900">{order.buyerName} ({order.shippingAddress.city})</strong>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-mono text-slate-500">#{order.id}</span>
                  <button
                    onClick={() => setSelectedInvoiceOrder(order)}
                    className="px-3 py-1.5 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1.5 shadow-2xs"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>Tax Invoice</span>
                  </button>
                </div>
              </div>

              {/* Sub-Orders list */}
              <div className="p-4 sm:p-6 space-y-6">
                {order.subOrders.map((sub) => (
                  <div
                    key={sub.id}
                    className="p-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 transition-colors space-y-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-900">{sub.sellerName}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[11px] font-bold border uppercase tracking-wider ${
                            statusColors[sub.status] || 'bg-slate-100 text-slate-800'
                          }`}
                        >
                          {sub.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-[11px] text-slate-500">
                          AWB: <strong className="font-mono text-slate-800">{sub.awbNumber}</strong>
                        </span>
                        <Link
                          to={`/orders/track/${sub.id}`}
                          className="px-3 py-1 rounded-lg bg-[#0F1B2D] text-white hover:bg-[#1E293B] text-xs font-semibold flex items-center gap-1"
                        >
                          <Truck className="w-3.5 h-3.5 text-[#F59E0B]" />
                          <span>Track Live</span>
                        </Link>
                      </div>
                    </div>

                    {/* Items */}
                    <div className="space-y-3">
                      {sub.items.map((it, idx) => (
                        <div key={idx} className="flex items-center justify-between gap-4 text-xs">
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={it.image}
                              alt={it.title}
                              className="w-14 h-14 rounded-xl object-cover ring-1 ring-slate-100 shrink-0"
                            />
                            <div className="min-w-0">
                              <Link
                                to={`/products/${it.productId}`}
                                className="font-semibold text-slate-900 hover:text-amber-800 line-clamp-1"
                              >
                                {it.title}
                              </Link>
                              <div className="text-slate-400 text-[11px]">Qty: {it.quantity}</div>
                              <div className="font-bold font-mono text-slate-900 mt-0.5">
                                {formatCurrency(it.price * it.quantity)}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            {sub.status !== 'delivered' && sub.status !== 'cancelled' && (
                              <button
                                onClick={() => handleCancelSubOrder(sub.id)}
                                className="text-xs text-red-600 hover:underline font-semibold"
                              >
                                Cancel Item
                              </button>
                            )}

                            {sub.status === 'delivered' && (
                              <button
                                onClick={() => handleReturnRequest(sub.id)}
                                className="text-xs text-amber-800 hover:underline font-semibold flex items-center gap-1"
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Return / Replace</span>
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Invoice Modal */}
      {selectedInvoiceOrder && (
        <InvoiceModal
          order={selectedInvoiceOrder}
          onClose={() => setSelectedInvoiceOrder(null)}
        />
      )}
    </div>
  );
};
