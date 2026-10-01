import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import { Address } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import {
  MapPin,
  Truck,
  CreditCard,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Plus,
  QrCode,
  Building,
} from 'lucide-react';

export const CheckoutPage: React.FC = () => {
  const { cart, currentUser, couponDiscount, appliedCoupon, clearCart, addToast } = useStore();
  const navigate = useNavigate();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Address State
  const [selectedAddressId, setSelectedAddressId] = useState<string>(
    currentUser.addresses[0]?.id || ''
  );
  const [isAddingNewAddress, setIsAddingNewAddress] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: currentUser.name,
    phone: currentUser.phone || '+91 98765 43210',
    addressLine1: '',
    addressLine2: '',
    city: 'Noida',
    state: 'Uttar Pradesh',
    pincode: '201305',
    type: 'home' as const,
  });

  // Payment State
  const [paymentMethod, setPaymentMethod] = useState<'ONLINE' | 'COD'>('ONLINE');
  const [onlineType, setOnlineType] = useState<'UPI' | 'CARD' | 'NETBANKING'>('UPI');
  const [upiApp, setUpiApp] = useState<'gpay' | 'phonepe' | 'paytm'>('gpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  const codFee = paymentMethod === 'COD' ? 50 : 0;
  const grandTotal = Math.max(0, subtotal + codFee - couponDiscount);

  const selectedAddress =
    currentUser.addresses.find((a) => a.id === selectedAddressId) || currentUser.addresses[0];

  const handleSaveNewAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.pincode) {
      addToast({ title: 'Please fill address line and pincode', type: 'error' });
      return;
    }
    const created = StorageService.addAddress(currentUser.id, newAddr);
    setSelectedAddressId(created.id);
    setIsAddingNewAddress(false);
    addToast({ title: 'New delivery address added', type: 'success' });
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      addToast({ title: 'Please select a delivery address', type: 'error' });
      setStep(1);
      return;
    }

    setIsProcessing(true);

    setTimeout(() => {
      const order = StorageService.createOrder({
        buyer: currentUser,
        shippingAddress: selectedAddress,
        paymentMethod,
        discount: couponDiscount,
        couponCode: appliedCoupon?.code,
        items: cart.map((i) => ({
          product: i.product,
          quantity: i.quantity,
          variantName: i.variantId ? 'Selected Variant' : undefined,
        })),
      });

      clearCart();
      setIsProcessing(false);
      navigate(`/order-success/${order.id}`);
    }, 1200);
  };

  if (cart.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Checkout Stepper Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
        <div className="flex items-center justify-between max-w-2xl mx-auto text-xs">
          {[
            { num: 1, label: 'Delivery Address' },
            { num: 2, label: 'Shipping Mode' },
            { num: 3, label: 'Payment Options' },
            { num: 4, label: 'Review & Place' },
          ].map((s) => (
            <button
              key={s.num}
              onClick={() => {
                if (s.num < step) setStep(s.num as any);
              }}
              className={`flex items-center gap-2 font-semibold transition-colors ${
                step === s.num
                  ? 'text-[#0F1B2D] font-bold'
                  : step > s.num
                  ? 'text-teal-700'
                  : 'text-slate-400'
              }`}
            >
              <span
                className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] ${
                  step === s.num
                    ? 'bg-[#0F1B2D] text-white'
                    : step > s.num
                    ? 'bg-teal-600 text-white'
                    : 'bg-slate-100 text-slate-400'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </span>
              <span className="hidden sm:inline">{s.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-step forms */}
        <div className="lg:col-span-8 space-y-6">
          {/* STEP 1: Address */}
          {step === 1 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-600" />
                  <h2 className="font-editorial text-lg font-bold text-[#0F1B2D]">
                    1. Select Delivery Destination
                  </h2>
                </div>
                {!isAddingNewAddress && (
                  <button
                    onClick={() => setIsAddingNewAddress(true)}
                    className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add New Address</span>
                  </button>
                )}
              </div>

              {!isAddingNewAddress ? (
                <div className="space-y-3">
                  {currentUser.addresses.map((addr) => (
                    <label
                      key={addr.id}
                      className={`block p-4 rounded-2xl border cursor-pointer transition-all ${
                        selectedAddressId === addr.id
                          ? 'border-[#0F1B2D] bg-amber-50/40 ring-1 ring-[#0F1B2D]'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <input
                          type="radio"
                          name="address"
                          checked={selectedAddressId === addr.id}
                          onChange={() => setSelectedAddressId(addr.id)}
                          className="mt-1 text-[#0F1B2D] focus:ring-[#0F1B2D]"
                        />
                        <div className="flex-1 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-slate-900">{addr.name}</span>
                            <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-600">
                              {addr.type}
                            </span>
                          </div>
                          <div className="text-slate-600">
                            {addr.addressLine1}
                            {addr.addressLine2 && `, ${addr.addressLine2}`}
                          </div>
                          <div className="text-slate-600">
                            {addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
                          </div>
                          <div className="text-slate-500 pt-1">Contact: {addr.phone}</div>
                        </div>
                      </div>
                    </label>
                  ))}

                  <div className="pt-4 flex justify-end">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-2"
                    >
                      <span>Continue to Shipping</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSaveNewAddress} className="space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={newAddr.name}
                        onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">Mobile Number</label>
                      <input
                        type="text"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div className="text-xs">
                    <label className="block font-semibold text-slate-700 mb-1">Flat / House / Building</label>
                    <input
                      type="text"
                      value={newAddr.addressLine1}
                      onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
                      placeholder="e.g. Flat 301, Heritage Apartments"
                      className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">PIN Code</label>
                      <input
                        type="text"
                        maxLength={6}
                        value={newAddr.pincode}
                        onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs font-mono"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">City</label>
                      <input
                        type="text"
                        value={newAddr.city}
                        onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-slate-700 mb-1">State</label>
                      <input
                        type="text"
                        value={newAddr.state}
                        onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                        className="w-full bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNewAddress(false)}
                      className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#0F1B2D] text-white rounded-xl text-xs font-bold"
                    >
                      Save & Deliver Here
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {/* STEP 2: Delivery Method */}
          {step === 2 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5 text-teal-600" />
                  <h2 className="font-editorial text-lg font-bold text-[#0F1B2D]">
                    2. Delivery & Transit Mode
                  </h2>
                </div>
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-amber-800 hover:underline font-semibold"
                >
                  Change Address
                </button>
              </div>

              <div className="p-4 rounded-2xl border-2 border-teal-600 bg-teal-50/40 flex items-center justify-between text-xs">
                <div className="space-y-1">
                  <div className="font-bold text-slate-900 flex items-center gap-2">
                    <span>Pan-India Surface Express</span>
                    <span className="px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 text-[10px] font-bold">
                      FREE DELIVERY
                    </span>
                  </div>
                  <p className="text-slate-600">
                    Dispatched in tamper-proof artisan packaging via Delhivery & BlueDart. Estimated 3–4 working days.
                  </p>
                </div>
                <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Address
                </button>
                <button
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-2"
                >
                  <span>Continue to Payment</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment Options */}
          {step === 3 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5 text-amber-600" />
                  <h2 className="font-editorial text-lg font-bold text-[#0F1B2D]">
                    3. Select Payment Method
                  </h2>
                </div>
              </div>

              {/* Payment Mode Selection */}
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('ONLINE')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'ONLINE'
                      ? 'border-[#0F1B2D] bg-amber-50/50 ring-2 ring-[#0F1B2D]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="font-bold text-xs text-slate-900 mb-1">Prepaid Online</div>
                  <div className="text-[11px] text-slate-500">
                    Instant UPI (GPay/PhonePe), Credit/Debit Card or Netbanking. Zero COD fees.
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('COD')}
                  className={`p-4 rounded-2xl border text-left transition-all ${
                    paymentMethod === 'COD'
                      ? 'border-[#0F1B2D] bg-amber-50/50 ring-2 ring-[#0F1B2D]'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-bold text-xs text-slate-900 mb-1">Cash on Delivery (COD)</div>
                    <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-1.5 py-0.5 rounded">
                      +₹50 fee
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500">
                    Pay in cash directly to delivery partner upon inspection.
                  </div>
                </button>
              </div>

              {/* Online Sub-options */}
              {paymentMethod === 'ONLINE' && (
                <div className="p-4 bg-stone-50 rounded-2xl border border-slate-200 space-y-4">
                  <div className="flex gap-2 text-xs">
                    {(['UPI', 'CARD', 'NETBANKING'] as const).map((type) => (
                      <button
                        key={type}
                        onClick={() => setOnlineType(type)}
                        className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                          onlineType === type
                            ? 'bg-[#0F1B2D] text-white'
                            : 'bg-white border border-slate-200 text-slate-600'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>

                  {onlineType === 'UPI' && (
                    <div className="space-y-3">
                      <div className="text-[11px] font-semibold text-slate-500">
                        Choose your preferred UPI application:
                      </div>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { id: 'gpay', label: 'Google Pay' },
                          { id: 'phonepe', label: 'PhonePe' },
                          { id: 'paytm', label: 'Paytm UPI' },
                        ].map((app) => (
                          <button
                            key={app.id}
                            type="button"
                            onClick={() => setUpiApp(app.id as any)}
                            className={`p-3 rounded-xl border text-center text-xs font-bold transition-all ${
                              upiApp === app.id
                                ? 'border-[#F59E0B] bg-white ring-2 ring-amber-300'
                                : 'border-slate-200 bg-white text-slate-700'
                            }`}
                          >
                            {app.label}
                          </button>
                        ))}
                      </div>
                      <div className="text-[11px] text-teal-800 bg-teal-50 p-2.5 rounded-xl border border-teal-200">
                        ✓ Simulation mode: Clicking &quot;Place Order&quot; simulates instantaneous UPI token verification.
                      </div>
                    </div>
                  )}

                  {onlineType === 'CARD' && (
                    <div className="space-y-3 text-xs">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Card Number</label>
                        <input
                          type="text"
                          defaultValue="4532 •••• •••• 9921"
                          className="w-full bg-white border border-slate-300 rounded-xl p-2 font-mono text-xs"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          defaultValue="10/29"
                          className="bg-white border border-slate-300 rounded-xl p-2 font-mono text-xs text-center"
                        />
                        <input
                          type="password"
                          defaultValue="•••"
                          className="bg-white border border-slate-300 rounded-xl p-2 font-mono text-xs text-center"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800"
                >
                  ← Back to Shipping
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-[#0F1B2D] text-white text-xs font-bold hover:bg-slate-800 flex items-center gap-2"
                >
                  <span>Review Final Order</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Review & Place Order */}
          {step === 4 && (
            <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-teal-600" />
                  <h2 className="font-editorial text-lg font-bold text-[#0F1B2D]">
                    4. Final Order Verification
                  </h2>
                </div>
                <button
                  onClick={() => setStep(3)}
                  className="text-xs text-amber-800 hover:underline font-semibold"
                >
                  Edit Options
                </button>
              </div>

              {/* Destination Summary */}
              <div className="p-4 bg-stone-50 rounded-2xl border border-slate-200 text-xs space-y-1">
                <div className="font-bold text-slate-800">Delivering to:</div>
                <div className="font-semibold text-slate-900">{selectedAddress?.name} ({selectedAddress?.phone})</div>
                <div className="text-slate-600">
                  {selectedAddress?.addressLine1}, {selectedAddress?.city}, {selectedAddress?.state} - {selectedAddress?.pincode}
                </div>
                <div className="text-slate-600 pt-1">
                  Payment: <strong className="text-teal-800">{paymentMethod} ({paymentMethod === 'ONLINE' ? 'Prepaid Online' : 'Cash on Delivery'})</strong>
                </div>
              </div>

              {/* Items Summary */}
              <div className="space-y-3">
                <div className="text-xs font-bold text-slate-700">Order Items ({cart.length})</div>
                <div className="divide-y divide-slate-100">
                  {cart.map((item) => (
                    <div key={item.productId} className="py-2.5 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-12 h-12 rounded-xl object-cover"
                        />
                        <div>
                          <div className="font-semibold text-slate-900">{item.product.title}</div>
                          <div className="text-[11px] text-slate-400">Qty: {item.quantity} · By {item.product.sellerName}</div>
                        </div>
                      </div>
                      <div className="font-bold font-mono text-slate-900">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Final Confirm Button */}
              <button
                onClick={handlePlaceOrder}
                disabled={isProcessing}
                className="w-full py-4 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-[#0F1B2D] font-bold text-sm shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <span>Processing & Securing Order...</span>
                ) : (
                  <>
                    <span>Confirm & Pay {formatCurrency(grandTotal)}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Order Total Card */}
        <div className="lg:col-span-4 space-y-4 sticky top-24">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm space-y-4">
            <h3 className="font-editorial text-base font-bold text-[#0F1B2D]">
              Order Summary
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
              {codFee > 0 && (
                <div className="flex justify-between">
                  <span>Cash on Delivery Handling</span>
                  <span className="tabular-nums font-semibold text-slate-900">{formatCurrency(codFee)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span className="text-teal-700 font-semibold">FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-baseline pt-1">
              <div>
                <div className="text-sm font-bold text-slate-900">Total Amount</div>
                <div className="text-[11px] text-slate-400">Inclusive of all taxes</div>
              </div>
              <div className="text-2xl font-bold font-mono text-[#0F1B2D]">
                {formatCurrency(grandTotal)}
              </div>
            </div>

            <div className="p-3 bg-stone-50 rounded-xl text-[11px] text-slate-500 space-y-1">
              <div className="font-semibold text-slate-700">Artisan Multi-Vendor Guarantee:</div>
              <div>Each artisan is notified immediately to begin hand-packing your order.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
