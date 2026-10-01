import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import { formatCurrency } from '../../utils/formatters';
import {
  ShoppingBag,
  Trash2,
  Bookmark,
  ArrowRight,
  Tag,
  ShieldCheck,
  Truck,
  Sparkles,
  Info,
} from 'lucide-react';

export const CartPage: React.FC = () => {
  const {
    cart,
    updateCartQuantity,
    removeFromCart,
    saveForLater,
    savedForLater,
    moveToCartFromSaved,
    appliedCoupon,
    couponDiscount,
    applyCouponCode,
    removeCoupon,
  } = useStore();

  const [couponInput, setCouponInput] = useState('');
  const navigate = useNavigate();

  // Group cart items by seller
  const sellerGroups = cart.reduce((acc, item) => {
    const sId = item.product.sellerId;
    if (!acc[sId]) {
      acc[sId] = {
        sellerName: item.product.sellerName,
        items: [],
      };
    }
    acc[sId].items.push(item);
    return acc;
  }, {} as Record<string, { sellerName: string; items: typeof cart }>);

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const totalAmount = Math.max(0, subtotal - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCouponCode(couponInput, subtotal);
    setCouponInput('');
  };

  if (cart.length === 0 && savedForLater.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto shadow-sm">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
          Your Shopping Bag is Empty
        </h2>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Explore our verified artisan clusters for pure handloom silks, beaten brassware, and regional gourmet teas.
        </p>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#0F1B2D] hover:bg-[#1E293B] text-white font-bold text-xs shadow-md"
        >
          <span>Explore Handcrafted Goods</span>
          <ArrowRight className="w-4 h-4 text-[#F59E0B]" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
          Shopping Bag ({cart.reduce((s, i) => s + i.quantity, 0)} Items)
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Items will be dispatched directly from each verified artisan workshop.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items grouped by seller */}
        <div className="lg:col-span-8 space-y-6">
          {Object.entries(sellerGroups).map(([sellerId, group]) => (
            <div
              key={sellerId}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4"
            >
              {/* Seller Header */}
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <span>Dispatched by {group.sellerName}</span>
                </div>
                <span className="text-[11px] text-slate-400">
                  {group.items.length} {group.items.length === 1 ? 'item' : 'items'}
                </span>
              </div>

              {/* Items List */}
              <div className="divide-y divide-slate-100">
                {group.items.map((item) => (
                  <div
                    key={`${item.productId}_${item.variantId || ''}`}
                    className="py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
                  >
                    <div className="flex items-center gap-4 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-18 h-18 rounded-2xl object-cover ring-1 ring-slate-200 shrink-0"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/products/${item.product.id}`}
                          className="font-bold text-sm text-[#0F1B2D] hover:text-[#F59E0B] line-clamp-1"
                        >
                          {item.product.title}
                        </Link>
                        <div className="text-[11px] text-slate-500 mt-0.5">
                          {item.product.category}
                        </div>
                        <div className="font-bold text-sm text-slate-900 tabular-nums mt-1 font-mono">
                          {formatCurrency(item.product.price)}
                        </div>
                      </div>
                    </div>

                    {/* Actions & Quantity */}
                    <div className="flex items-center gap-4 self-end sm:self-center">
                      <div className="flex items-center border border-slate-200 rounded-xl bg-slate-50 p-1">
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity - 1, item.variantId)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg text-xs"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold font-mono">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateCartQuantity(item.productId, item.quantity + 1, item.variantId)}
                          className="w-7 h-7 flex items-center justify-center font-bold text-slate-600 hover:bg-white rounded-lg text-xs"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => saveForLater(item.productId, item.variantId)}
                        className="p-2 text-slate-400 hover:text-amber-700 transition-colors"
                        title="Save for Later"
                      >
                        <Bookmark className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => removeFromCart(item.productId, item.variantId)}
                        className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                        title="Remove Item"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Saved For Later Section */}
          {savedForLater.length > 0 && (
            <div className="bg-stone-50/80 rounded-3xl border border-slate-200 p-6 space-y-4">
              <h3 className="font-editorial text-base font-bold text-slate-900">
                Saved for Later ({savedForLater.length})
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {savedForLater.map((item) => (
                  <div
                    key={item.productId}
                    className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-12 h-12 rounded-xl object-cover shrink-0"
                      />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs text-slate-900 truncate">
                          {item.product.title}
                        </div>
                        <div className="font-bold text-xs text-slate-900 tabular-nums">
                          {formatCurrency(item.product.price)}
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => moveToCartFromSaved(item.productId, item.variantId)}
                      className="px-2.5 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold shrink-0"
                    >
                      Move to Bag
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Coupon & Order Summary */}
        <div className="lg:col-span-4 space-y-6 sticky top-24">
          {/* Coupon Box */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-xs space-y-3">
            <div className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>Apply Promo Coupon</span>
            </div>

            {appliedCoupon ? (
              <div className="p-3 bg-teal-50 rounded-xl border border-teal-200 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-teal-900">{appliedCoupon.code} Applied</div>
                  <div className="text-[11px] text-teal-700">Saved {formatCurrency(couponDiscount)}</div>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs text-red-600 hover:underline font-semibold"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="e.g. WELCOME10"
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs font-mono uppercase focus:ring-2 focus:ring-[#F59E0B]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F1B2D] text-white hover:bg-slate-800 text-xs font-bold rounded-xl"
                >
                  Apply
                </button>
              </form>
            )}

            {/* Hint coupons */}
            <div className="text-[11px] text-slate-400">
              Try <button onClick={() => applyCouponCode('WELCOME10', subtotal)} className="text-amber-800 font-bold hover:underline">WELCOME10</button> or <button onClick={() => applyCouponCode('FESTIVE250', subtotal)} className="text-amber-800 font-bold hover:underline">FESTIVE250</button>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#0F1B2D]">
              Price Summary
            </h3>

            <div className="space-y-2 text-xs text-slate-600 border-b border-slate-100 pb-4">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-slate-900 tabular-nums">{formatCurrency(subtotal)}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-teal-700 font-medium">
                  <span>Coupon Savings</span>
                  <span className="tabular-nums">- {formatCurrency(couponDiscount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Estimated Shipping</span>
                <span className="text-teal-700 font-semibold">FREE (Above ₹499)</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <div className="text-sm font-bold text-slate-900">Total Payable</div>
                <div className="text-[11px] text-slate-400">Inclusive of all taxes</div>
              </div>
              <div className="text-xl font-bold font-mono text-[#0F1B2D]">
                {formatCurrency(totalAmount)}
              </div>
            </div>

            <button
              onClick={() => navigate('/checkout')}
              disabled={cart.length === 0}
              className="w-full py-3.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] disabled:bg-slate-200 text-[#0F1B2D] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="flex items-center justify-center gap-2 text-[11px] text-slate-400 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-600" />
              <span>Safe & Encrypted 256-Bit Checkout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
