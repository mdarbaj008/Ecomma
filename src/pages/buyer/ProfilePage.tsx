import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import { Address } from '../../types';
import {
  User,
  MapPin,
  Package,
  Plus,
  Trash2,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const ProfilePage: React.FC = () => {
  const { currentUser, addToast } = useStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newAddr, setNewAddr] = useState({
    name: currentUser.name,
    phone: currentUser.phone || '+91 98765 43210',
    addressLine1: '',
    addressLine2: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    type: 'home' as const,
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.addressLine1 || !newAddr.pincode) return;

    StorageService.addAddress(currentUser.id, newAddr);
    setIsAdding(false);
    addToast({ title: 'New address saved', type: 'success' });
    window.location.reload();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 space-y-8">
      <div>
        <h1 className="font-editorial text-2xl sm:text-3xl font-bold text-[#0F1B2D]">
          Account & Delivery Addresses
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Manage your personal details, default delivery pincodes, and active role.
        </p>
      </div>

      {/* User Info Card */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-800 font-editorial font-bold text-2xl overflow-hidden ring-2 ring-amber-300">
            {currentUser.avatar ? (
              <img src={currentUser.avatar} alt={currentUser.name} className="w-full h-full object-cover" />
            ) : (
              currentUser.name.charAt(0)
            )}
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-slate-900">{currentUser.name}</h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                {currentUser.role}
              </span>
            </div>
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><Mail className="w-3.5 h-3.5" /> {currentUser.email}</span>
              <span className="flex items-center gap-1"><Phone className="w-3.5 h-3.5" /> {currentUser.phone || '+91 98765 43210'}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/orders"
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Package className="w-3.5 h-3.5" />
            <span>My Orders</span>
          </Link>
        </div>
      </div>

      {/* Saved Addresses Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
            <MapPin className="w-4 h-4 text-amber-600" />
            <span>Saved Delivery Addresses</span>
          </div>
          {!isAdding && (
            <button
              onClick={() => setIsAdding(true)}
              className="text-xs font-semibold text-amber-800 hover:underline flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add New Address</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {currentUser.addresses.map((addr) => (
            <div
              key={addr.id}
              className="p-4 rounded-2xl border border-slate-200 bg-stone-50/60 space-y-2 text-xs relative"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900">{addr.name}</span>
                <span className="uppercase text-[10px] font-bold px-2 py-0.5 rounded bg-white text-slate-600 border border-slate-200">
                  {addr.type}
                </span>
              </div>
              <div className="text-slate-600 leading-relaxed">
                {addr.addressLine1}<br />
                {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                {addr.city}, {addr.state} - <strong className="font-mono">{addr.pincode}</strong>
              </div>
              <div className="text-slate-500 pt-1">Phone: {addr.phone}</div>
            </div>
          ))}
        </div>

        {isAdding && (
          <form onSubmit={handleAddAddress} className="p-4 rounded-2xl bg-amber-50/40 border border-amber-200 space-y-3">
            <div className="text-xs font-bold text-slate-900">Add New Destination Address</div>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={newAddr.name}
                onChange={(e) => setNewAddr({ ...newAddr, name: e.target.value })}
                className="bg-white border border-slate-300 rounded-xl p-2 text-xs"
                required
              />
              <input
                type="text"
                placeholder="Mobile Number"
                value={newAddr.phone}
                onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                className="bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono"
                required
              />
            </div>
            <input
              type="text"
              placeholder="Address (House/Street/Locality)"
              value={newAddr.addressLine1}
              onChange={(e) => setNewAddr({ ...newAddr, addressLine1: e.target.value })}
              className="w-full bg-white border border-slate-300 rounded-xl p-2 text-xs"
              required
            />
            <div className="grid grid-cols-3 gap-3 text-xs">
              <input
                type="text"
                placeholder="PIN Code"
                maxLength={6}
                value={newAddr.pincode}
                onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                className="bg-white border border-slate-300 rounded-xl p-2 text-xs font-mono"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={newAddr.city}
                onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                className="bg-white border border-slate-300 rounded-xl p-2 text-xs"
                required
              />
              <input
                type="text"
                placeholder="State"
                value={newAddr.state}
                onChange={(e) => setNewAddr({ ...newAddr, state: e.target.value })}
                className="bg-white border border-slate-300 rounded-xl p-2 text-xs"
                required
              />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAdding(false)}
                className="px-3 py-1.5 border border-slate-300 rounded-lg text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#0F1B2D] text-white rounded-lg text-xs font-bold"
              >
                Save Address
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
