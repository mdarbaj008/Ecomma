import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatIndianNumber } from '../../utils/formatters';
import { GeminiService, BusinessInsight } from '../../services/geminiClient';
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
  Package,
  Truck,
  IndianRupee,
  Star,
  AlertTriangle,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';

export const SellerOverviewPage: React.FC = () => {
  const { currentUser, darkMode } = useStore();
  const seller = StorageService.getSellerById(currentUser.sellerId || 'seller_1') || StorageService.getSellers()[0];
  const allProducts = StorageService.getProducts().filter((p) => p.sellerId === seller.id);
  const allOrders = StorageService.getOrders();

  // Find sub-orders for this seller
  const sellerSubOrders = allOrders.flatMap((o) =>
    o.subOrders.filter((s) => s.sellerId === seller.id)
  );

  const pendingShipments = sellerSubOrders.filter(
    (s) => s.status === 'placed' || s.status === 'confirmed' || s.status === 'packed'
  );

  const lowStockProducts = allProducts.filter((p) => p.stock <= 5);

  // Sales Chart Data
  const salesChartData = [
    { day: 'Mon', sales: 12400, orders: 3 },
    { day: 'Tue', sales: 18900, orders: 4 },
    { day: 'Wed', sales: 24500, orders: 6 },
    { day: 'Thu', sales: 16800, orders: 4 },
    { day: 'Fri', sales: 32000, orders: 7 },
    { day: 'Sat', sales: 41200, orders: 9 },
    { day: 'Sun', sales: 38500, orders: 8 },
  ];

  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [loadingInsights, setLoadingInsights] = useState(false);

  useEffect(() => {
    setLoadingInsights(true);
    GeminiService.getBusinessInsights('seller', {
      storeName: seller.storeName,
      totalEarnings: seller.totalEarnings,
      rating: seller.rating,
      ordersCount: seller.totalOrders,
      pendingOrders: pendingShipments.length,
    })
      .then((data) => setInsights(data))
      .catch(() => {})
      .finally(() => setLoadingInsights(false));
  }, [seller.id]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Namaste, {seller.storeName}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Here is your live performance summary across pan-India artisan fulfillments.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/seller/products/new"
            className="px-4 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#e08e07] text-black font-bold text-xs shadow-sm flex items-center gap-1.5 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI New Listing</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Today's Sales */}
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xs space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Today&apos;s Sales
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F1B2D] dark:text-white tabular-nums">
            ₹38,500
          </div>
          <div className="text-[11px] text-teal-600 font-semibold flex items-center gap-1">
            <TrendingUp className="w-3 h-3" />
            <span>+18.4% vs last Sun</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xs space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            All Orders
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-[#0F1B2D] dark:text-white tabular-nums">
            {formatIndianNumber(seller.totalOrders)}
          </div>
          <div className="text-[11px] text-slate-400">
            {sellerSubOrders.length} active in database
          </div>
        </div>

        {/* Pending Shipments */}
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xs space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Pending Dispatch
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-amber-600 tabular-nums">
            {pendingShipments.length}
          </div>
          <div className="text-[11px] text-slate-400">
            Requires packing / pickup
          </div>
        </div>

        {/* Wallet Balance */}
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xs space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Available Wallet
          </div>
          <div className="text-xl sm:text-2xl font-bold font-mono text-teal-700 dark:text-teal-400 tabular-nums">
            {formatCurrency(seller.walletBalance)}
          </div>
          <Link to="/seller/earnings" className="text-[11px] text-amber-700 hover:underline font-semibold block">
            Request Payout ➔
          </Link>
        </div>

        {/* Store Rating */}
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-2xs space-y-1 col-span-2 lg:col-span-1`}>
          <div className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            Artisan Rating
          </div>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-1.5 tabular-nums">
            <Star className="w-5 h-5 fill-[#F59E0B] text-[#F59E0B]" />
            <span>{seller.rating}</span>
          </div>
          <div className="text-[11px] text-slate-400">
            {seller.reviewCount} verified buyer reviews
          </div>
        </div>
      </div>

      {/* Gemini AI Recommendations Panel */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900/80 border-slate-800' : 'bg-amber-50/70 border-amber-200/70'} space-y-3`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#0F1B2D] text-[#F59E0B] flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-editorial text-sm font-bold text-[#0F1B2D] dark:text-white">
                Gemini Artisan Business Intelligence
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Actionable optimization tailored to your regional craft demand
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {insights.map((ins, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-amber-200/60'} shadow-2xs space-y-1.5`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-slate-700 text-amber-900 dark:text-amber-300">
                  {ins.type}
                </span>
                <span className="text-[11px] font-bold text-teal-700 dark:text-teal-400 cursor-pointer hover:underline">
                  {ins.action} ➔
                </span>
              </div>
              <div className="font-bold text-xs text-slate-900 dark:text-white">{ins.title}</div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ins.description}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Velocity Chart */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-editorial text-base font-bold text-slate-900 dark:text-white">
              Weekly Revenue Velocity (₹)
            </h3>
            <p className="text-xs text-slate-500">Gross sales before 8% platform commission deduction</p>
          </div>
          <span className="text-xs font-mono font-bold text-teal-700 dark:text-teal-400">
            Total 7 Days: ₹1,84,300
          </span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={salesChartData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(val) => `₹${val / 1000}k`} />
              <Tooltip
                formatter={(value: any) => [formatCurrency(Number(value)), 'Revenue']}
                contentStyle={{ borderRadius: 12, fontSize: 12 }}
              />
              <Area
                type="monotone"
                dataKey="sales"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Two Column Section: Top Products & Low Stock Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Top Performing Products */}
        <div className={`lg:col-span-8 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-editorial text-base font-bold text-slate-900 dark:text-white">
              Active Store Catalog ({allProducts.length})
            </h3>
            <Link to="/seller/products" className="text-xs text-amber-800 dark:text-amber-400 font-semibold hover:underline">
              Manage All Products ➔
            </Link>
          </div>

          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {allProducts.slice(0, 4).map((p) => (
              <div key={p.id} className="py-3 flex items-center justify-between gap-4 text-xs">
                <div className="flex items-center gap-3 min-w-0">
                  <img src={p.images[0]} alt={p.title} className="w-12 h-12 rounded-xl object-cover" />
                  <div className="min-w-0">
                    <div className="font-semibold text-slate-900 dark:text-white truncate">{p.title}</div>
                    <div className="text-[11px] text-slate-400">Stock: {p.stock} units · Rating: ★ {p.rating}</div>
                  </div>
                </div>
                <div className="font-bold font-mono text-slate-900 dark:text-white tabular-nums shrink-0">
                  {formatCurrency(p.price)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className={`lg:col-span-4 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
            <AlertTriangle className="w-4 h-4 text-amber-600" />
            <h3 className="font-editorial text-base font-bold text-slate-900 dark:text-white">
              Inventory Attention
            </h3>
          </div>

          {lowStockProducts.length === 0 ? (
            <p className="text-xs text-slate-500">All products have healthy inventory buffers.</p>
          ) : (
            <div className="space-y-3">
              {lowStockProducts.map((p) => (
                <div key={p.id} className="p-3 bg-amber-50 dark:bg-slate-800/80 rounded-2xl border border-amber-200 dark:border-slate-700 text-xs space-y-1">
                  <div className="font-bold text-slate-900 dark:text-white truncate">{p.title}</div>
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-red-600 font-bold">Only {p.stock} left</span>
                    <Link to="/seller/products" className="text-amber-800 dark:text-amber-400 font-semibold hover:underline">
                      Restock ➔
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
