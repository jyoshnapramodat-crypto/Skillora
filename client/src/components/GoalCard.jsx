import React from 'react';
import { Calendar, CheckCircle, Clock, Edit2, Trash2, AlertCircle } from 'lucide-react';
import { formatDate } from '../utils/calculations';

/**
 * Reusable GoalCard component.
 */
export default function GoalCard({
  goal,
  skillName = null,
  onToggleComplete,
  onEdit,
  onDelete
}) {
  const isCompleted = goal.status === 'Completed';

  // Check if overdue
  let isOverdue = false;
  let daysLeft = null;
  if (!isCompleted && goal.targetDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(goal.targetDate + 'T00:00:00');
    const diffTime = target.getTime() - today.getTime();
    daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    if (daysLeft < 0) {
      isOverdue = true;
    }
  }

  const priorityClass = (goal.priority || 'Medium').toLowerCase();

  return (
    <div
      className={`editorial-card goal-card priority-${priorityClass} ${isCompleted ? 'completed' : ''}`}
    >
      <div>
        <div className="goal-header">
          <span className={`priority-pill ${priorityClass}`}>{goal.priority} Priority</span>
          {skillName && (
            <span
              className="editorial-pill"
              style={{ fontSize: '0.72rem', maxWidth: '170px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {skillName}
            </span>
          )}
        </div>

        <h4 className="goal-title" style={{ textDecoration: isCompleted ? 'line-through' : 'none' }}>
          {goal.title}
        </h4>

        {goal.description && (
          <p
            style={{
              fontSize: '0.85rem',
              color: 'var(--text-secondary)',
              marginTop: '0.35rem',
              lineHeight: 1.45
            }}
          >
            {goal.description}
          </p>
        )}
      </div>

      <div>
        {/* Deadline information */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', fontSize: '0.8rem' }}>
          <span
            className={`goal-deadline-badge ${isOverdue ? 'overdue' : daysLeft !== null && daysLeft <= 3 ? 'soon' : ''}`}
          >
            {isOverdue ? (
              <>
                <AlertCircle size={14} /> Overdue by {Math.abs(daysLeft)} {Math.abs(daysLeft) === 1 ? 'day' : 'days'}
              </>
            ) : isCompleted ? (
              <>
                <CheckCircle size={14} color="#2ea043" /> Completed
              </>
            ) : (
              <>
                <Calendar size={14} /> Target: {formatDate(goal.targetDate)}
                {daysLeft !== null && daysLeft >= 0 && (
                  <span style={{ color: 'var(--text-muted)' }}>({daysLeft}d left)</span>
                )}
              </>
            )}
          </span>
        </div>

        {/* Action toolbar */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '0.65rem', borderTop: '1px solid var(--border-light)' }}>
          <button
            className={`btn btn-sm ${isCompleted ? 'btn-secondary' : 'btn-primary'}`}
            onClick={() => onToggleComplete(goal._id || goal.id)}
            style={{ padding: '0.35rem 0.75rem', fontSize: '0.78rem' }}
          >
            <CheckCircle size={14} />
            {isCompleted ? 'Mark Active' : 'Mark Completed'}
          </button>

          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button className="btn-icon" onClick={() => onEdit(goal)} title="Edit goal" aria-label="Edit goal">
              <Edit2 size={14} />
            </button>
            <button className="btn-icon delete" onClick={() => onDelete(goal._id || goal.id)} title="Delete goal" aria-label="Delete goal">
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

