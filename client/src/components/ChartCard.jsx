import React from 'react';

/**
 * Reusable wrapper card for Recharts visual graphs.
 */
export default function ChartCard({
  title,
  subtitle,
  children,
  action = null,
  empty = false,
  emptyMessage = 'Not enough data available to render this chart.'
}) {
  return (
    <div className="chart-container-card editorial-card">
      <div className="chart-header">
        <div>
          <h3 className="chart-title">{title}</h3>
          {subtitle && <p className="chart-subtitle">{subtitle}</p>}
        </div>
        {action && <div>{action}</div>}
      </div>

      <div style={{ width: '100%', minHeight: '260px', position: 'relative' }}>
        {empty ? (
          <div
            style={{
              height: '240px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              textAlign: 'center',
              padding: '1rem'
            }}
          >
            {emptyMessage}
          </div>
        ) : (
          children
        )}
      </div>
    </div>
  );
}

