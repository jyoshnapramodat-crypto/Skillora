import React, { useState } from 'react';
import { Check, Edit2, Trash2, X } from 'lucide-react';

/**
 * TaskItem component representing a single task in a skill.
 * Supports inline editing, toggle completion, and deletion.
 */
export default function TaskItem({
  task,
  onToggle,
  onEdit,
  onDelete
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(task.title || '');

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (editedTitle.trim()) {
      onEdit(task.id, editedTitle.trim());
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setEditedTitle(task.title || '');
    setIsEditing(false);
  };

  return (
    <div className={`task-item ${task.completed ? 'completed' : ''}`}>
      {isEditing ? (
        <form
          onSubmit={handleSaveEdit}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%' }}
        >
          <input
            type="text"
            className="input-control"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            autoFocus
            style={{ padding: '0.35rem 0.6rem', fontSize: '0.85rem' }}
          />
          <button type="submit" className="btn-icon" title="Save">
            <Check size={16} color="var(--success-text)" />
          </button>
          <button type="button" className="btn-icon" onClick={handleCancelEdit} title="Cancel">
            <X size={16} />
          </button>
        </form>
      ) : (
        <>
          <div className="task-item-left">
            <input
              type="checkbox"
              className="task-checkbox"
              checked={Boolean(task.completed)}
              onChange={() => onToggle(task.id)}
              aria-label={`Mark task ${task.title} as ${task.completed ? 'incomplete' : 'complete'}`}
            />
            <span className={`task-title ${task.completed ? 'strike' : ''}`}>
              {task.title}
            </span>
          </div>

          <div className="task-actions">
            <button
              className="btn-icon"
              onClick={() => setIsEditing(true)}
              title="Edit task"
              aria-label="Edit task"
            >
              <Edit2 size={14} />
            </button>
            <button
              className="btn-icon delete"
              onClick={() => onDelete(task.id)}
              title="Delete task"
              aria-label="Delete task"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </>
      )}
    </div>
  );
}

