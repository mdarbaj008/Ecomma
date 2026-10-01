import React from 'react';
import { Order } from '../../types';
import { formatCurrency, formatDateTime } from '../../utils/formatters';
import { X, Printer, Download, ShieldCheck } from 'lucide-react';

interface InvoiceModalProps {
  order: Order;
  onClose: () => void;
}

export const InvoiceModal: React.FC<InvoiceModalProps> = ({ order, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-8 shadow-2xl border border-slate-200 relative my-8 print:p-0 print:border-none print:shadow-none">
        {/* Controls */}
        <div className="flex items-center justify-between pb-6 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-teal-600" />
            <span>Tax Invoice / Bill of Supply</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-[#0F1B2D] text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Invoice</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Invoice Printable Content */}
        <div className="space-y-6 pt-4">
          {/* Header */}
          <div className="flex justify-between items-start">
            <div>
              <div className="font-editorial text-2xl font-bold text-[#0F1B2D]">
                Ecomma<span className="text-[#F59E0B]">.</span>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                Ecomma Marketplace Technologies Pvt. Ltd.<br />
                CIN: U72900DL2024PTC99812<br />
                GSTIN: 07AABCE9918F1ZV<br />
                Craft Hub, Connaught Place, New Delhi - 110001
              </div>
            </div>
            <div className="text-right text-xs">
              <div className="font-bold text-sm text-slate-900">TAX INVOICE</div>
              <div className="text-slate-500 mt-1">Invoice No: <span className="font-mono text-slate-800 font-bold">INV-{order.id.replace('ord_', '')}</span></div>
              <div className="text-slate-500">Order ID: <span className="font-mono">{order.id}</span></div>
              <div className="text-slate-500">Date: {formatDateTime(order.createdAt)}</div>
              <div className="text-slate-500">Payment: <strong className="text-teal-700">{order.paymentMethod} ({order.paymentStatus})</strong></div>
            </div>
          </div>

          {/* Billing & Shipping */}
          <div className="grid grid-cols-2 gap-6 p-4 bg-stone-50 rounded-xl text-xs border border-slate-200">
            <div>
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Billed & Shipped To:
              </div>
              <div className="font-semibold text-slate-900">{order.buyerName}</div>
              <div className="text-slate-600">{order.shippingAddress.addressLine1}</div>
              {order.shippingAddress.addressLine2 && <div className="text-slate-600">{order.shippingAddress.addressLine2}</div>}
              <div className="text-slate-600">{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</div>
              <div className="text-slate-600">Phone: {order.shippingAddress.phone}</div>
            </div>

            <div>
              <div className="font-bold text-slate-700 uppercase tracking-wider text-[10px] mb-1">
                Dispatch Summary:
              </div>
              <div className="text-slate-600">Number of Shipments: {order.subOrders.length}</div>
              <div className="text-slate-600">Mode: Surface Express Courier</div>
              <div className="text-slate-600">Delivery State: {order.shippingAddress.state} (Place of Supply)</div>
            </div>
          </div>

          {/* Itemized Table Grouped by Seller */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                <tr>
                  <th className="py-2.5 px-3">Item & Artisan Details</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.subOrders.flatMap((sub) =>
                  sub.items.map((item, idx) => (
                    <tr key={`${sub.id}_${idx}`} className="text-slate-800">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-slate-900">{item.title}</div>
                        <div className="text-[11px] text-slate-500">
                          Sold by: {sub.sellerName} · Courier: {sub.courierName} ({sub.awbNumber})
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center tabular-nums">{item.quantity}</td>
                      <td className="py-3 px-3 text-right tabular-nums">{formatCurrency(item.price)}</td>
                      <td className="py-3 px-3 text-right font-semibold tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Calculation Breakdown */}
          <div className="flex justify-end">
            <div className="w-64 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between">
                <span>Subtotal (Inclusive of Taxes)</span>
                <span className="tabular-nums font-semibold text-slate-900">{formatCurrency(order.subtotal)}</span>
              </div>
              {order.discount > 0 && (
                <div className="flex justify-between text-teal-700 font-medium">
                  <span>Coupon Discount ({order.couponCode || 'PROMO'})</span>
                  <span className="tabular-nums">- {formatCurrency(order.discount)}</span>
                </div>
              )}
              {order.codFee > 0 && (
                <div className="flex justify-between">
                  <span>COD Handling Fee</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatCurrency(order.codFee)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="tabular-nums text-teal-700 font-semibold">FREE</span>
              </div>
              <div className="border-t border-slate-200 pt-2 flex justify-between font-bold text-sm text-slate-900">
                <span>Grand Total</span>
                <span className="text-[#0F1B2D] font-mono text-base">{formatCurrency(order.totalAmount)}</span>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <div className="border-t border-slate-200 pt-4 text-[11px] text-slate-400 text-center">
            This is a computer-generated tax invoice and requires no physical signature. Goods sold are crafted by independent Indian artisans under Ecomma Fair Craft Governance.
          </div>
        </div>
      </div>
    </div>
  );
};
