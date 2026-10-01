import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { UserRole } from '../../types';
import { UserCheck, Store, ShieldCheck, RotateCcw, Sparkles } from 'lucide-react';
import { StorageService } from '../../services/storage';

export const RoleSwitcherBanner: React.FC = () => {
  const { currentUser, switchRole, addToast } = useStore();
  const navigate = useNavigate();

  const handleSwitch = (role: UserRole) => {
    switchRole(role);
    if (role === 'seller') {
      navigate('/seller');
    } else if (role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/');
    }
  };

  const handleReset = () => {
    if (window.confirm('Reset all demo data (orders, listings, wallets) to factory defaults?')) {
      StorageService.resetDefaults();
      addToast({ title: 'Demo data reset', type: 'info' });
    }
  };

  return (
    <div className="bg-[#0F1B2D] text-slate-200 border-b border-white/10 px-4 py-1.5 text-xs">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 font-medium text-amber-400">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Demo Mode:</span>
          </span>
          <span className="text-slate-300 hidden sm:inline">
            Active as <strong className="text-white font-semibold">{currentUser.name}</strong> ({currentUser.role.toUpperCase()})
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-slate-400 mr-1 hidden md:inline">Switch Role:</span>
          <button
            onClick={() => handleSwitch('buyer')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all inline-flex items-center gap-1 ${
              currentUser.role === 'buyer'
                ? 'bg-[#F59E0B] text-[#0F1B2D] shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            Buyer
          </button>
          <button
            onClick={() => handleSwitch('seller')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all inline-flex items-center gap-1 ${
              currentUser.role === 'seller'
                ? 'bg-[#F59E0B] text-[#0F1B2D] shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Store className="w-3 h-3" />
            Seller
          </button>
          <button
            onClick={() => handleSwitch('admin')}
            className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition-all inline-flex items-center gap-1 ${
              currentUser.role === 'admin'
                ? 'bg-[#F59E0B] text-[#0F1B2D] shadow-sm font-semibold'
                : 'text-slate-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Admin
          </button>

          <span className="text-slate-600 mx-1">|</span>

          <button
            onClick={handleReset}
            title="Reset mock database to initial state"
            className="text-slate-400 hover:text-white p-1 rounded hover:bg-white/5 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};
