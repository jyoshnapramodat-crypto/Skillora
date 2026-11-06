import React, { useState, useEffect } from 'react';
import { Target, X } from 'lucide-react';

/**
 * Modal form for creating and editing Learning Goals.
 */
export default function GoalForm({
  isOpen,
  initialGoal = null,
  skills = [],
  onClose,
  onSubmit
}) {
  const isEditing = Boolean(initialGoal);

  const [title, setTitle] = useState('');
  const [skillId, setSkillId] = useState('');
  const [targetDate, setTargetDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('In Progress');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (initialGoal) {
      setTitle(initialGoal.title || '');
      setSkillId(initialGoal.skillId || (skills[0]?.id || ''));
      setTargetDate(initialGoal.targetDate || '');
      setPriority(initialGoal.priority || 'Medium');
      setDescription(initialGoal.description || '');
      setStatus(initialGoal.status || 'In Progress');
      setErrors({});
    } else {
      setTitle('');
      setSkillId(skills[0]?.id || '');
      // Default target date 14 days from today
      const defaultDate = new Date();
      defaultDate.setDate(defaultDate.getDate() + 14);
      setTargetDate(defaultDate.toISOString().split('T')[0]);
      setPriority('High');
      setDescription('');
      setStatus('In Progress');
      setErrors({});
    }
  }, [initialGoal, isOpen, skills]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!title.trim()) {
      errs.title = 'Goal title is required.';
    }
    if (!targetDate) {
      errs.targetDate = 'Target date is required.';
    }
    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit({
      title: title.trim(),
      skillId: skillId || null,
      targetDate,
      priority,
      description: description.trim(),
      status
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="stat-card-icon-wrap" style={{ width: '34px', height: '34px' }}>
              <Target size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {isEditing ? 'Edit Learning Goal' : 'Create New Learning Goal'}
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close goal modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Title */}
            <div className="form-group">
              <label className="form-label" htmlFor="goal-title">
                Goal Title *
              </label>
              <input
                id="goal-title"
                type="text"
                className="input-control"
                placeholder="e.g. Master Tree Traversal & Binary Heaps, Build Portfolio PDF"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                  if (errors.title) setErrors({ ...errors, title: null });
                }}
              />
              {errors.title && <div className="form-error">{errors.title}</div>}
            </div>

            {/* Related Skill */}
            <div className="form-group">
              <label className="form-label" htmlFor="goal-skill">
                Related Skill
              </label>
              <select
                id="goal-skill"
                className="input-control"
                value={skillId}
                onChange={(e) => setSkillId(e.target.value)}
              >
                <option value="">-- Independent Goal (No specific skill) --</option>
                {skills.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.name} ({s.category})
                  </option>
                ))}
              </select>
            </div>

            {/* Target Date & Priority in 2-col grid */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="goal-date">
                  Target Deadline *
                </label>
                <input
                  id="goal-date"
                  type="date"
                  className="input-control"
                  value={targetDate}
                  onChange={(e) => {
                    setTargetDate(e.target.value);
                    if (errors.targetDate) setErrors({ ...errors, targetDate: null });
                  }}
                />
                {errors.targetDate && <div className="form-error">{errors.targetDate}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="goal-priority">
                  Priority
                </label>
                <select
                  id="goal-priority"
                  className="input-control"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value)}
                >
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="goal-desc">
                Description / Success Criteria
              </label>
              <textarea
                id="goal-desc"
                className="input-control"
                rows={2}
                placeholder="What will success look like when this goal is completed?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Status (if editing) */}
            {isEditing && (
              <div className="form-group">
                <label className="form-label" htmlFor="goal-status">
                  Status
                </label>
                <select
                  id="goal-status"
                  className="input-control"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {isEditing ? 'Save Changes' : 'Create Goal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

