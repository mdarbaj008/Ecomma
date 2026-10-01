import React, { useState, useEffect } from 'react';
import { GeminiService, BusinessInsight } from '../../services/geminiClient';
import { StorageService } from '../../services/storage';
import { useStore } from '../../store/useStore';
import {
  Sparkles,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const AdminAiInsightsPage: React.FC = () => {
  const { darkMode, addToast } = useStore();
  const [insights, setInsights] = useState<BusinessInsight[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchInsights = async () => {
    setIsLoading(true);
    try {
      const orders = StorageService.getOrders();
      const sellers = StorageService.getSellers();
      const res = await GeminiService.getBusinessInsights('admin', {
        ordersCount: orders.length,
        sellersCount: sellers.length,
        totalGmv: orders.reduce((s, o) => s + o.totalAmount, 0),
        topRegions: ['Maharashtra', 'Gujarat', 'Karnataka', 'Delhi NCR', 'West Bengal'],
        codSharePercent: 32,
      });
      setInsights(res);
      addToast({ title: 'Gemini Executive Insights Updated', type: 'success' });
    } catch {
      addToast({ title: 'Failed to refresh AI insights', type: 'error' });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, []);

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#0F1B2D] via-[#1E293B] to-[#0F1B2D] text-white rounded-3xl p-8 sm:p-10 relative overflow-hidden border border-teal-500/20 shadow-xl">
        <div className="relative z-10 max-w-2xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-teal-300" />
            <span>Gemini 3.8 Flash Executive Analyst</span>
          </div>
          <h1 className="font-editorial text-3xl sm:text-4xl font-bold tracking-tight">
            AI Marketplace Strategy & Growth Intelligence
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            Gemini synthesizes real-time order streams, COD refusal telemetry, regional demand surges, and seller payout velocity to recommend high-impact executive actions.
          </p>
          <div className="pt-2">
            <button
              onClick={fetchInsights}
              disabled={isLoading}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Synthesizing Data...' : 'Re-Run Executive AI Analysis'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Insights Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((ins, idx) => {
          const typeBorders = {
            growth: 'border-teal-500/40 bg-teal-50/40 dark:bg-teal-950/20',
            warning: 'border-red-500/40 bg-red-50/40 dark:bg-red-950/20',
            opportunity: 'border-amber-500/40 bg-amber-50/40 dark:bg-amber-950/20',
            pricing: 'border-indigo-500/40 bg-indigo-50/40 dark:bg-indigo-950/20',
          };

          const typeIcons = {
            growth: <TrendingUp className="w-5 h-5 text-teal-600" />,
            warning: <AlertTriangle className="w-5 h-5 text-red-600" />,
            opportunity: <Lightbulb className="w-5 h-5 text-amber-600" />,
            pricing: <Sparkles className="w-5 h-5 text-indigo-600" />,
          };

          return (
            <div
              key={idx}
              className={`p-6 rounded-3xl border ${typeBorders[ins.type] || 'border-slate-200'} shadow-sm space-y-4 flex flex-col justify-between`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="w-10 h-10 rounded-2xl bg-white dark:bg-slate-800 shadow-2xs flex items-center justify-center">
                    {typeIcons[ins.type]}
                  </div>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    {ins.type}
                  </span>
                </div>

                <h3 className="font-bold text-base text-slate-900 dark:text-white leading-snug">
                  {ins.title}
                </h3>

                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  {ins.description}
                </p>
              </div>

              <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between">
                <span className="text-xs font-bold text-teal-800 dark:text-teal-300 flex items-center gap-1 cursor-pointer hover:underline">
                  <span>{ins.action}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
