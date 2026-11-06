import React from 'react';
import { Calendar, CheckSquare, Edit3, Trash2, ListChecks } from 'lucide-react';
import ProgressBar from './ProgressBar';
import { calculateSkillProgress, formatDate } from '../utils/calculations';

/**
 * Reusable SkillCard component displaying skill metrics, status, progress, and actions.
 */
export default function SkillCard({
  skill,
  onManageTasks,
  onEditSkill,
  onDeleteSkill
}) {
  const stats = calculateSkillProgress(skill);

  const getStatusBadge = () => {
    switch (stats.status) {
      case 'Completed':
        return <span className="editorial-pill" style={{ background: 'var(--success-bg)', color: 'var(--success-text)', borderColor: 'var(--success-border)' }}>Completed</span>;
      case 'In Progress':
        return <span className="editorial-pill" style={{ background: 'var(--lavender-100)', color: 'var(--lavender-700)', borderColor: 'var(--lavender-200)' }}>In Progress</span>;
      default:
        return <span className="editorial-pill" style={{ background: 'var(--bg-cream-alt)', color: 'var(--text-muted)', borderColor: 'var(--border-default)' }}>Not Started</span>;
    }
  };

  return (
    <div className="editorial-card skill-card">
      <div>
        <div className="skill-card-top">
          <span className="skill-category-badge">{skill.category || 'General'}</span>
          {getStatusBadge()}
        </div>

        <h3 className="skill-card-title">{skill.name}</h3>
        {skill.description && <p className="skill-card-desc">{skill.description}</p>}
      </div>

      <div>
        {/* Tasks Summary */}
        <div className="skill-tasks-summary" style={{ marginBottom: '0.5rem' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <CheckSquare size={14} color="var(--lavender-600)" />
            {stats.completedTasks} / {stats.totalTasks} Tasks
          </span>
          {skill.startDate && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.76rem', color: 'var(--text-muted)' }}>
              <Calendar size={13} /> {formatDate(skill.startDate)}
            </span>
          )}
        </div>

        {/* Progress Bar */}
        <ProgressBar percentage={stats.percentage} />
      </div>

      <div className="skill-actions-bar">
        <button
          className="btn btn-secondary btn-sm"
          onClick={() => onManageTasks(skill)}
          style={{ flex: 1, gap: '0.35rem' }}
          title="Open checklist to add, complete or delete tasks"
        >
          <ListChecks size={15} color="var(--lavender-600)" /> Manage Tasks
        </button>

        <button
          className="btn-icon"
          onClick={() => onEditSkill(skill)}
          title="Edit skill details"
          aria-label="Edit skill details"
        >
          <Edit3 size={15} />
        </button>

        <button
          className="btn-icon delete"
          onClick={() => onDeleteSkill(skill)}
          title="Delete skill"
          aria-label="Delete skill"
        >
          <Trash2 size={15} />
        </button>
      </div>
    </div>
  );
}

