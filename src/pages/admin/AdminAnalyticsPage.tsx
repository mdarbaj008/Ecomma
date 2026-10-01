import React from 'react';
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
  Filter,
  Download,
  CreditCard,
  RotateCcw,
  Users,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { darkMode, addToast } = useStore();

  const funnelData = [
    { stage: 'Storefront Visits', count: 184000, pct: '100%' },
    { stage: 'Added to Bag', count: 42500, pct: '23.1%' },
    { stage: 'Initiated Checkout', count: 19800, pct: '10.7%' },
    { stage: 'Orders Completed', count: 14200, pct: '7.7%' },
  ];

  const paymentSplitData = [
    { name: 'Prepaid Online (UPI/Cards)', value: 68, color: '#14B8A6' },
    { name: 'Cash on Delivery (COD)', value: 32, color: '#F59E0B' },
  ];

  const regionPerformance = [
    { region: 'West (MH, GJ)', sales: 540000 },
    { region: 'South (KA, TN, KL)', sales: 480000 },
    { region: 'North (NCR, UP, RJ)', sales: 420000 },
    { region: 'East (WB, BH)', sales: 210000 },
  ];

  const handleExportCsv = () => {
    const csvContent = "data:text/csv;charset=utf-8,Region,Sales\nWest,540000\nSouth,480000\nNorth,420000\nEast,210000";
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "ecomma_marketplace_analytics_q3.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    addToast({ title: 'Analytics CSV Exported', type: 'success' });
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-editorial text-2xl sm:text-3xl font-bold tracking-tight">
            Marketplace Conversion & Funnel Analytics
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Conversion drop-off, payment channel split, and multi-vendor fulfillment health.
          </p>
        </div>

        <button
          onClick={handleExportCsv}
          className="px-4 py-2 rounded-xl bg-[#0F1B2D] text-white hover:bg-slate-800 text-xs font-semibold flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5 text-[#F59E0B]" />
          <span>Export Analytics CSV</span>
        </button>
      </div>

      {/* Funnel Section */}
      <div className={`p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
        <div className="text-xs font-bold uppercase tracking-wider text-slate-400">
          Conversion Funnel (Visit ➔ Paid)
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
          {funnelData.map((f, i) => (
            <div key={f.stage} className="p-4 rounded-2xl bg-stone-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-1 relative">
              <div className="text-[11px] font-bold text-slate-400">Step {i + 1}</div>
              <div className="text-sm font-bold text-slate-900 dark:text-white">{f.stage}</div>
              <div className="text-2xl font-black font-mono text-[#0F1B2D] dark:text-teal-400 pt-1">
                {formatIndianNumber(f.count)}
              </div>
              <div className="text-[11px] font-semibold text-teal-600">
                {f.pct} of visitors
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two Column Section: Regional Breakdown & COD Split */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Regional Breakdown Bar Chart */}
        <div className={`lg:col-span-7 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div>
            <h3 className="font-editorial text-base font-bold">Regional GMV Breakdown (₹)</h3>
            <p className="text-xs text-slate-500">Gross sales across Indian geographical territories</p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={regionPerformance}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.2} />
                <XAxis dataKey="region" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip formatter={(v: any) => [formatCurrency(Number(v)), 'Sales']} />
                <Bar dataKey="sales" fill="#14B8A6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* COD vs Online Split Pie Chart */}
        <div className={`lg:col-span-5 p-6 rounded-3xl border ${darkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'} shadow-sm space-y-4`}>
          <div>
            <h3 className="font-editorial text-base font-bold">Payment Method Split</h3>
            <p className="text-xs text-slate-500">Online UPI / Cards vs Cash on Delivery</p>
          </div>

          <div className="h-48 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={paymentSplitData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {paymentSplitData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v: any) => [`${v}%`, 'Share']} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-1.5 text-xs pt-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#14B8A6]" />
                <span>Prepaid Online (68%)</span>
              </div>
              <span className="font-semibold text-teal-700">Zero RTO Risk</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#F59E0B]" />
                <span>Cash on Delivery (32%)</span>
              </div>
              <span className="font-semibold text-amber-700">+₹50 fee attached</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
