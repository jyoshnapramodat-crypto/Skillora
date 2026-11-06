import React from 'react';
import { Sparkles } from 'lucide-react';

/**
 * Reusable EmptyState component for conditional rendering.
 */
export default function EmptyState({
  icon: Icon = Sparkles,
  title = 'No records found',
  description = 'Try adjusting your filters, search terms, or add your first item to get started.',
  actionLabel = null,
  onAction = null
}) {
  return (
    <div className="empty-state-box">
      <div className="empty-state-icon">
        <Icon size={28} />
      </div>
      <h3 className="empty-state-title">{title}</h3>
      <p className="empty-state-desc">{description}</p>
      {actionLabel && onAction && (
        <button className="btn btn-primary btn-sm" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

