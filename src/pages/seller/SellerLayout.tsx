import React from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { StorageService } from '../../services/storage';
import { Logo } from '../../components/common/Logo';
import {
  LayoutDashboard,
  Sparkles,
  Package,
  ShoppingBag,
  TrendingUp,
  Wallet,
  Settings,
  Moon,
  Sun,
  ExternalLink,
  ChevronRight,
  Store,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';

export const SellerLayout: React.FC = () => {
  const { currentUser, darkMode, toggleDarkMode } = useStore();
  const location = useLocation();
  const navigate = useNavigate();

  const seller = StorageService.getSellerById(currentUser.sellerId || 'seller_1') || StorageService.getSellers()[0];

  const navLinks = [
    { to: '/seller', label: 'Overview', icon: LayoutDashboard, exact: true },
    { to: '/seller/products/new', label: 'AI Listing Generator', icon: Sparkles, badge: 'AI Hero' },
    { to: '/seller/products', label: 'My Products', icon: Package },
    { to: '/seller/orders', label: 'Orders & Fulfillment', icon: ShoppingBag },
    { to: '/seller/earnings', label: 'Earnings & Payouts', icon: Wallet },
    { to: '/seller/analytics', label: 'Sales Analytics', icon: TrendingUp },
    { to: '/seller/settings', label: 'Store Settings', icon: Settings },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-stone-100/60 text-slate-900'}`}>
      {/* Sidebar */}
      <aside className={`w-full md:w-64 border-r shrink-0 flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          {/* Top Brand */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Logo size="sm" showTagline={false} />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-900/50 text-amber-900 dark:text-amber-300">
              Seller Hub
            </span>
          </div>

          {/* Active Store Widget */}
          <div className="p-4 mx-3 my-3 rounded-2xl bg-stone-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 flex items-center gap-3">
            <img
              src={seller.logo}
              alt={seller.storeName}
              className="w-10 h-10 rounded-xl object-cover ring-1 ring-amber-400"
            />
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1 font-bold text-xs truncate">
                <span className="truncate">{seller.storeName}</span>
                <ShieldCheck className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400">
                {seller.city} · ★ {seller.rating}
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-3 space-y-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = link.exact
                ? location.pathname === link.to
                : location.pathname.startsWith(link.to);

              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-[#0F1B2D] text-white dark:bg-amber-500 dark:text-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#F59E0B] text-black">
                      {link.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Utility Controls */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="text-slate-500 dark:text-slate-400 font-medium">Dark Dashboard</span>
            <button
              onClick={toggleDarkMode}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center justify-between w-full py-2 px-3 rounded-xl bg-amber-50 dark:bg-slate-800/80 text-amber-900 dark:text-amber-300 text-xs font-semibold hover:bg-amber-100 transition-colors"
          >
            <span>View Marketplace Storefront</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </aside>

      {/* Main Panel Content */}
      <main className="flex-1 p-4 sm:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};
