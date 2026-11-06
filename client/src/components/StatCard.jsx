import React from 'react';

/**
 * Reusable StatCard component demonstrating React Props and modular UI.
 */
export default function StatCard({
  title,
  value,
  icon: Icon,
  description,
  accentColor = 'var(--lavender-100)',
  iconColor = 'var(--lavender-700)',
  badge = null,
  onClick = null
}) {
  return (
    <div
      className="editorial-card stat-card"
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="stat-card-header">
        <span className="stat-card-label">{title}</span>
        {Icon && (
          <div
            className="stat-card-icon-wrap"
            style={{ backgroundColor: accentColor, color: iconColor }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>

      <div className="stat-card-value">
        {value}
        {badge && (
          <span
            className="editorial-pill"
            style={{ fontSize: '0.72rem', marginLeft: '0.6rem', verticalAlign: 'middle' }}
          >
            {badge}
          </span>
        )}
      </div>

      {description && <div className="stat-card-desc">{description}</div>}
    </div>
  );
}

