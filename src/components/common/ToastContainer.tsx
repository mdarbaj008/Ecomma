import React from 'react';
import { useStore } from '../../store/useStore';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useStore();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const icons = {
          success: <CheckCircle2 className="w-5 h-5 text-teal-600 shrink-0" />,
          error: <AlertCircle className="w-5 h-5 text-coral-600 shrink-0 text-red-500" />,
          info: <Info className="w-5 h-5 text-amber-600 shrink-0" />,
        };

        const borders = {
          success: 'border-teal-500/30 bg-teal-50/90 text-teal-950',
          error: 'border-red-500/30 bg-red-50/90 text-red-950',
          info: 'border-amber-500/30 bg-amber-50/90 text-amber-950',
        };

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-start gap-3 p-3.5 rounded-xl shadow-lg border backdrop-blur-md transition-all duration-300 ${
              borders[toast.type]
            }`}
          >
            {icons[toast.type]}
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-xs leading-snug">{toast.title}</div>
              {toast.message && (
                <div className="text-[11px] opacity-80 mt-0.5 truncate">{toast.message}</div>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-slate-400 hover:text-slate-700 transition-colors p-0.5 rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
