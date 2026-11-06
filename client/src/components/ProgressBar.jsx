import React from 'react';

/**
 * Reusable progress bar component with smooth transitions and status coloring.
 * @param {number} percentage - Progress value 0 to 100
 * @param {string} label - Optional custom label
 * @param {boolean} showPercentage - Whether to render percentage text
 * @param {string} height - CSS height (default '8px')
 */
export default function ProgressBar({
  percentage = 0,
  label = null,
  showPercentage = true,
  height = '8px'
}) {
  const clampedPercentage = Math.min(100, Math.max(0, Math.round(percentage)));

  let colorClass = '';
  if (clampedPercentage === 100) {
    colorClass = 'completed';
  } else if (clampedPercentage < 30 && clampedPercentage > 0) {
    colorClass = 'warning';
  }

  return (
    <div className="progress-bar-wrapper">
      {(label || showPercentage) && (
        <div className="progress-bar-header">
          {label && <span className="text-secondary">{label}</span>}
          {showPercentage && (
            <span style={{ fontWeight: 700, color: 'var(--lavender-700)', marginLeft: 'auto' }}>
              {clampedPercentage}%
            </span>
          )}
        </div>
      )}
      <div className="progress-track" style={{ height }}>
        <div
          className={`progress-fill ${colorClass}`}
          style={{ width: `${clampedPercentage}%` }}
          role="progressbar"
          aria-valuenow={clampedPercentage}
          aria-valuemin="0"
          aria-valuemax="100"
        />
      </div>
    </div>
  );
}

