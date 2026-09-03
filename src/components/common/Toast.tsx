import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all transform translate-y-0 ${
            t.type === 'success'
              ? 'bg-neutral-900 border-neutral-800 text-white'
              : t.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-900'
              : 'bg-white border-neutral-200 text-neutral-900'
          }`}
        >
          {t.type === 'success' && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />}
          {t.type === 'error' && <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />}
          {t.type === 'info' && <Info className="w-5 h-5 text-neutral-600 shrink-0 mt-0.5" />}

          <p className="text-xs sm:text-sm font-medium leading-snug flex-1">{t.message}</p>

          <button
            type="button"
            onClick={() => onDismiss(t.id)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
};
