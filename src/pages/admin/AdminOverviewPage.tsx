import React from 'react';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatIndianNumber } from '../../utils/formatters';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  ShoppingBag,
  Store,
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const AdminOverviewPage: React.FC = () => {
  const { darkMode } = useStore();
  const sellers = StorageService.getSellers();
  const products = StorageService.getProducts();
  const orders = StorageService.getOrders();
  const payouts = StorageService.getPayouts();

  // Metrics
  const gmv = orders.reduce((sum, o) => sum + o.totalAmount, 0);
  const totalCommission = orders.reduce(
    (sum, o) => sum + o.subOrders.reduce((sSum, s) => sSum + s.commission, 0),
    0
  );
  const pendingPayouts = payouts.filter((p) => p.status === 'pending');

  const gmvChartData = [
    { month: 'Apr', gmv: 340000, commission: 27200 },
    { month: 'May', gmv: 520000, commission: 41600 },
    { month: 'Jun', gmv: 690000, commission: 55200 },
    { month: 'Jul', gmv: 810000, commission: 64800 },
    { month: 'Aug', gmv: 1120000, commission: 89600 },
    { month: 'Sep', gmv: 1450000, commission: 116000 },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Marketplace Control Tower
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Pan-India Gross Merchandise Value, seller settlements, and network health.
          </p>
        </div>

        <Link
          to="/admin/ai-insights"
          className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Gemini Executive Insights</span>
        </Link>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Gross Merchandise Value (GMV)
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0F1B2D] dark:text-white tabular-nums">
            {formatCurrency(gmv)}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+34.2% MoM growth</span>
          </div>
        </div>

        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Total Orders Logged
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0F1B2D] dark:text-white tabular-nums">
            {orders.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Across 14 craft clusters
          </div>
        </div>

        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Platform Commission Earned (8%)
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-teal-700 dark:text-teal-400 tabular-nums">
            {formatCurrency(totalCommission)}
          </div>
          <div className="text-[11px] text-slate-400">
            Zero hidden fee structure
          </div>
        </div>

        <div className={`p-5 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
            Verified Artisan Sellers
          </div>
          <div className="text-2xl sm:text-3xl font-bold font-mono text-[#0F1B2D] dark:text-white tabular-nums">
            {sellers.length}
          </div>
          <Link to="/admin/sellers" className="text-[11px] text-amber-700 hover:underline font-semibold block">
            Review Seller KYC ➔
          </Link>
        </div>
      </div>

      {/* GMV Growth Chart */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-base font-bold text-slate-900 dark:text-white">
              6-Month Marketplace GMV Progression (₹)
            </h3>
            <p className="text-xs text-slate-500">Continuous uptick driven by festive handlooms and brassware</p>
          </div>
          <div className="text-right">
            <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
              Sep Peak: ₹14.5 Lakhs
            </span>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={gmvChartData}>
              <defs>
                <linearGradient id="adminGmv" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#14B8A6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="month" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 100000}L`} />
              <Tooltip
                formatter={(val: any) => [formatCurrency(Number(val)), 'Gross GMV']}
                contentStyle={{ borderRadius: 12, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="gmv" stroke="#14B8A6" strokeWidth={3} fill="url(#adminGmv)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Live Activity Feed & Pending Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Live Marketplace Activity Feed */}
        <div className={`lg:col-span-8 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-editorial text-base font-bold">Real-Time Marketplace Feed</h3>
            <span className="text-xs text-teal-600 font-semibold flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-ping" />
              <span>Live Events</span>
            </span>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2 text-xs">
            {orders.slice(0, 5).map((o) => (
              <div key={o.id} className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-slate-800 flex items-center justify-center text-amber-800 font-bold">
                    ₹
                  </div>
                  <div>
                    <div className="font-semibold text-slate-900 dark:text-white">
                      Order #{o.id} placed by {o.buyerName}
                    </div>
                    <div className="text-[11px] text-slate-400">
                      Amount: {formatCurrency(o.totalAmount)} · {o.paymentMethod}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-teal-100 text-teal-800">
                  {o.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Payout Approvals */}
        <div className={`lg:col-span-4 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-editorial text-base font-bold">Payout Requests ({pendingPayouts.length})</h3>
            <Link to="/admin/payouts" className="text-xs text-amber-700 hover:underline font-semibold">
              Manage ➔
            </Link>
          </div>

          {pendingPayouts.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">All seller payouts are cleared.</p>
          ) : (
            <div className="space-y-3">
              {pendingPayouts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-50 dark:bg-slate-800/80 rounded-2xl border border-amber-200 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-white">{p.sellerName}</span>
                    <span className="font-mono font-bold text-teal-800 dark:text-teal-300">{formatCurrency(p.amount)}</span>
                  </div>
                  <div className="text-[11px] text-slate-500">{p.bankInfo}</div>
                  <div className="pt-1 flex justify-end">
                    <Link to="/admin/payouts" className="text-[11px] font-bold text-amber-900 hover:underline">
                      Review & Approve ➔
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
