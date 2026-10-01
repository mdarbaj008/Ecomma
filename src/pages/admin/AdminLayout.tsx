import React from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { useStore } from '../../store/useStore';
import { Logo } from '../../components/common/Logo';
import {
  ShieldAlert,
  LayoutDashboard,
  Users,
  PackageCheck,
  ShoppingBag,
  CreditCard,
  Tag,
  TrendingUp,
  Sparkles,
  ExternalLink,
  Moon,
  Sun,
} from 'lucide-react';

export const AdminLayout: React.FC = () => {
  const { darkMode, toggleDarkMode, currentUser } = useStore();
  const location = useLocation();

  const navLinks = [
    { to: '/admin', label: 'Executive Overview', icon: LayoutDashboard, exact: true },
    { to: '/admin/sellers', label: 'Artisan Sellers & KYC', icon: Users },
    { to: '/admin/products', label: 'Catalog Moderation', icon: PackageCheck },
    { to: '/admin/orders', label: 'Marketplace Orders', icon: ShoppingBag },
    { to: '/admin/payouts', label: 'Seller Payout Approvals', icon: CreditCard },
    { to: '/admin/promotions', label: 'Coupons & Categories', icon: Tag },
    { to: '/admin/analytics', label: 'Funnel & Analytics', icon: TrendingUp },
    { to: '/admin/ai-insights', label: 'Gemini Executive Insights', icon: Sparkles, badge: 'AI' },
  ];

  return (
    <div className={`min-h-screen flex flex-col md:flex-row ${darkMode ? 'dark bg-slate-950 text-slate-100' : 'bg-stone-100/60 text-slate-900'}`}>
      {/* Sidebar */}
      <aside className={`w-full md:w-64 border-r shrink-0 flex flex-col justify-between ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <Logo size="sm" showTagline={false} />
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-teal-100 dark:bg-teal-900/50 text-teal-900 dark:text-teal-300">
              Admin Ops
            </span>
          </div>

          <div className="p-3 mx-3 my-2 text-xs font-semibold text-slate-500 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-teal-600" />
            <span>Super Administrator Mode</span>
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
                      ? 'bg-[#0F1B2D] text-white dark:bg-teal-500 dark:text-black shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </div>
                  {link.badge && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-teal-100 dark:bg-teal-900 text-teal-900 dark:text-teal-200">
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
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
            </button>
          </div>

          <Link
            to="/"
            className="flex items-center justify-between w-full py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-300 text-xs font-semibold hover:bg-slate-200 transition-colors"
          >
            <span>Exit to Public Storefront</span>
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
