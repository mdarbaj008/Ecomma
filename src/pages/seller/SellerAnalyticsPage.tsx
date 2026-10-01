import React, { useState } from 'react';
import { useStore } from '../../store/useStore';
import { formatCurrency, formatIndianNumber } from '../../utils/formatters';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from 'recharts';
import {
  TrendingUp,
  MapPin,
  PieChart as PieIcon,
  ShoppingBag,
  RotateCcw,
  Calendar,
} from 'lucide-react';

export const SellerAnalyticsPage: React.FC = () => {
  const { darkMode } = useStore();
  const [range, setRange] = useState<'7d' | '30d' | '90d'>('30d');

  const stateDistributionData = [
    { state: 'Maharashtra', orders: 114, revenue: 142000 },
    { state: 'Karnataka', orders: 86, revenue: 118000 },
    { state: 'Delhi NCR', orders: 92, revenue: 98500 },
    { state: 'Tamil Nadu', orders: 64, revenue: 76000 },
    { state: 'West Bengal', orders: 48, revenue: 54000 },
    { state: 'Gujarat', orders: 52, revenue: 61000 },
  ];

  const categoryShare = [
    { name: 'Chanderi & Silk', value: 45, color: '#F59E0B' },
    { name: 'Moradabad Brass', value: 25, color: '#14B8A6' },
    { name: 'Gourmet Spices', value: 18, color: '#FF6B4A' },
    { name: 'Terracotta Pots', value: 12, color: '#6366F1' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Sales & Regional Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Buyer geographic concentrations, return rates, and category growth.
          </p>
        </div>

        {/* Date Filter */}
        <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setRange('7d')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              range === '7d' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => setRange('30d')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              range === '30d' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => setRange('90d')}
            className={`px-3 py-1.5 rounded-lg transition-colors ${
              range === '90d' ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs' : 'text-slate-500'
            }`}
          >
            Last 90 Days
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Gross Revenue</div>
          <div className="text-2xl font-bold font-mono text-[#0F1B2D] dark:text-white">₹5,49,500</div>
          <div className="text-[11px] text-teal-600 font-semibold">+22.4% vs last period</div>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Average Order Value</div>
          <div className="text-2xl font-bold font-mono text-[#0F1B2D] dark:text-white">₹3,410</div>
          <div className="text-[11px] text-teal-600 font-semibold">+₹320 from combos</div>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Conversion Rate</div>
          <div className="text-2xl font-bold font-mono text-teal-700 dark:text-teal-400">4.18%</div>
          <div className="text-[11px] text-slate-400">Industry avg: 2.4%</div>
        </div>

        <div className={`p-4 rounded-2xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} space-y-1`}>
          <div className="text-[11px] font-semibold text-slate-400 uppercase">Return / RTO Rate</div>
          <div className="text-2xl font-bold font-mono text-slate-900 dark:text-white">1.8%</div>
          <div className="text-[11px] text-teal-600 font-semibold">Low artisan defect rate</div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Customer Locations by State (Bar Chart) */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-editorial text-base font-bold flex items-center gap-2">
                <MapPin className="w-4 h-4 text-amber-600" />
                <span>Customer Locations (By State)</span>
              </h3>
              <p className="text-xs text-slate-500">Order volumes shipped to top Indian state territories</p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stateDistributionData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} opacity={0.2} />
                <XAxis type="number" tick={{ fontSize: 11 }} />
                <YAxis dataKey="state" type="category" tick={{ fontSize: 11 }} width={90} />
                <Tooltip
                  formatter={(val: any) => [`${val} orders`, 'Fulfillments']}
                  contentStyle={{ borderRadius: 12, fontSize: 12 }}
                />
                <Bar dataKey="orders" fill="#0F1B2D" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share (Pie Chart) */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div>
            <h3 className="font-editorial text-base font-bold flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-teal-600" />
              <span>Category Revenue Share</span>
            </h3>
            <p className="text-xs text-slate-500">Percentage split of sales by craft cluster</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryShare}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs pt-2">
            {categoryShare.map((c) => (
              <div key={c.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: c.color }} />
                <span className="text-slate-600 dark:text-slate-300 truncate">{c.name} ({c.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
