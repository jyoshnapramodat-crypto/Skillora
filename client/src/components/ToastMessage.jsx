import React from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

/**
 * Toast notification component for user feedback on actions.
 */
export default function ToastMessage({ toasts = [], onDismiss }) {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';

        return (
          <div key={toast.id} className={`toast-item ${toast.type || 'info'}`}>
            <div style={{ flexShrink: 0 }}>
              {isSuccess && <CheckCircle2 size={18} color="#2ea043" />}
              {isError && <AlertCircle size={18} color="#d73a49" />}
              {!isSuccess && !isError && <Info size={18} color="var(--lavender-600)" />}
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>{toast.title}</div>
              {toast.message && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
                  {toast.message}
                </div>
              )}
            </div>

            {onDismiss && (
              <button
                className="btn-icon"
                onClick={() => onDismiss(toast.id)}
                aria-label="Dismiss toast"
                style={{ width: '22px', height: '22px' }}
              >
                <X size={14} />
              </button>
            )}
          </div>
        );
      })}
    </div>
  );
}

