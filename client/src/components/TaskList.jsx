import React, { useState } from 'react';
import { Plus, X, ListCheck } from 'lucide-react';
import TaskItem from './TaskItem';
import ProgressBar from './ProgressBar';
import { calculateSkillProgress, formatDate } from '../utils/calculations';

/**
 * TaskList Modal / Manager component for a selected skill.
 * Directly demonstrates React Controlled Components, State, Dynamic Lists, and Event Handling.
 */
export default function TaskList({
  isOpen,
  skill,
  onClose,
  onAddTask,
  onToggleTask,
  onEditTask,
  onDeleteTask
}) {
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [error, setError] = useState('');

  if (!isOpen || !skill) return null;

  const stats = calculateSkillProgress(skill);

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
      setError('Task title cannot be empty.');
      return;
    }
    onAddTask(skill.id, newTaskTitle.trim());
    setNewTaskTitle('');
    setError('');
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="stat-card-icon-wrap" style={{ width: '34px', height: '34px' }}>
              <ListCheck size={18} />
            </div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>{skill.name}</h3>
                <span className="skill-category-badge" style={{ fontSize: '0.72rem' }}>
                  {skill.category}
                </span>
              </div>
              {skill.startDate && (
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                  Started: {formatDate(skill.startDate)}
                </div>
              )}
            </div>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close tasks modal">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body">
          {/* Skill Description */}
          {skill.description && (
            <p
              style={{
                fontSize: '0.86rem',
                color: 'var(--text-secondary)',
                marginBottom: '1rem',
                lineHeight: 1.5,
                background: '#ffffff',
                padding: '0.65rem 0.85rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-default)'
              }}
            >
              {skill.description}
            </p>
          )}

          {/* Progress overview */}
          <div style={{ marginBottom: '1.25rem', background: 'var(--bg-cream-alt)', padding: '0.9rem 1.1rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.85rem', fontWeight: 600 }}>
              <span>Learning Progress</span>
              <span style={{ color: 'var(--lavender-700)' }}>
                {stats.completedTasks} of {stats.totalTasks} completed ({stats.percentage}%)
              </span>
            </div>
            <ProgressBar percentage={stats.percentage} showPercentage={false} height="10px" />
          </div>

          {/* Add New Task Form */}
          <form onSubmit={handleAddSubmit} style={{ marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <input
                type="text"
                className="input-control"
                placeholder="Add a new learning task (e.g., Build 3 custom hooks)..."
                value={newTaskTitle}
                onChange={(e) => {
                  setNewTaskTitle(e.target.value);
                  if (error) setError('');
                }}
              />
              <button type="submit" className="btn btn-primary btn-sm" style={{ padding: '0.5rem 1rem' }}>
                <Plus size={16} /> Add
              </button>
            </div>
            {error && <div className="form-error">{error}</div>}
          </form>

          {/* Dynamic Task List */}
          <div className="task-list-container" style={{ maxHeight: '340px', overflowY: 'auto' }}>
            {!skill.tasks || skill.tasks.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '2rem 1rem',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem'
                }}
              >
                No learning tasks created yet. Add your first step above to begin tracking progress!
              </div>
            ) : (
              skill.tasks.map((task) => (
                <TaskItem
                  key={task.id}
                  task={task}
                  onToggle={(taskId) => onToggleTask(skill.id, taskId)}
                  onEdit={(taskId, newTitle) => onEditTask(skill.id, taskId, newTitle)}
                  onDelete={(taskId) => onDeleteTask(skill.id, taskId)}
                />
              ))
            )}
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn btn-secondary btn-sm" onClick={onClose}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

