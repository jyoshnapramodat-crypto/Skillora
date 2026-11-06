import React, { useState, useEffect } from 'react';
import { X, Sparkles } from 'lucide-react';
import { PREDEFINED_CATEGORIES } from '../data/sampleData';

/**
 * Modal form for creating or editing skills.
 * Demonstrates React Controlled Components, Form Validation, and State.
 */
export default function SkillForm({
  isOpen,
  initialSkill = null,
  customCategories = [],
  existingSkills = [],
  onClose,
  onSubmit,
  onAddCustomCategory
}) {
  const isEditing = Boolean(initialSkill);

  const [name, setName] = useState('');
  const [category, setCategory] = useState(PREDEFINED_CATEGORIES[0]);
  const [customCatInput, setCustomCatInput] = useState('');
  const [showCustomCatField, setShowCustomCatField] = useState(false);
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('');
  const [initialTask1, setInitialTask1] = useState('');
  const [initialTask2, setInitialTask2] = useState('');
  const [errors, setErrors] = useState({});

  const allCategories = Array.from(new Set([...PREDEFINED_CATEGORIES, ...customCategories]));

  useEffect(() => {
    if (initialSkill) {
      setName(initialSkill.name || '');
      setCategory(initialSkill.category || PREDEFINED_CATEGORIES[0]);
      setDescription(initialSkill.description || '');
      setStartDate(initialSkill.startDate || '');
      setShowCustomCatField(false);
      setCustomCatInput('');
      setInitialTask1('');
      setInitialTask2('');
      setErrors({});
    } else {
      setName('');
      setCategory(PREDEFINED_CATEGORIES[0]);
      setDescription('');
      setStartDate(new Date().toISOString().split('T')[0]);
      setShowCustomCatField(false);
      setCustomCatInput('');
      setInitialTask1('');
      setInitialTask2('');
      setErrors({});
    }
  }, [initialSkill, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const errs = {};
    if (!name.trim()) {
      errs.name = 'Skill name is required.';
    } else {
      const duplicate = existingSkills.find(
        (s) => s.name.toLowerCase() === name.trim().toLowerCase() && (!initialSkill || s.id !== initialSkill.id)
      );
      if (duplicate) {
        errs.name = 'A skill with this name already exists.';
      }
    }

    if (showCustomCatField && !customCatInput.trim()) {
      errs.category = 'Please enter your custom category name.';
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

    let finalCategory = category;
    if (showCustomCatField && customCatInput.trim()) {
      finalCategory = customCatInput.trim();
      onAddCustomCategory(finalCategory);
    }

    const payload = {
      name: name.trim(),
      category: finalCategory,
      description: description.trim(),
      startDate: startDate || new Date().toISOString().split('T')[0]
    };

    if (!isEditing) {
      // Gather initial tasks if typed
      const tasks = [];
      if (initialTask1.trim()) {
        tasks.push({
          id: `task-${Date.now()}-1`,
          title: initialTask1.trim(),
          completed: false
        });
      }
      if (initialTask2.trim()) {
        tasks.push({
          id: `task-${Date.now()}-2`,
          title: initialTask2.trim(),
          completed: false
        });
      }
      payload.tasks = tasks;
    }

    onSubmit(payload);
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div className="stat-card-icon-wrap" style={{ width: '34px', height: '34px' }}>
              <Sparkles size={18} />
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700 }}>
              {isEditing ? 'Edit Skill Details' : 'Add New Skill'}
            </h3>
          </div>
          <button className="btn-icon" onClick={onClose} aria-label="Close modal">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            {/* Skill Name */}
            <div className="form-group">
              <label className="form-label" htmlFor="skill-name">
                Skill Name *
              </label>
              <input
                id="skill-name"
                type="text"
                className="input-control"
                placeholder="e.g. Next.js & Server Components, TypeScript, System Design"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (errors.name) setErrors({ ...errors, name: null });
                }}
              />
              {errors.name && <div className="form-error">{errors.name}</div>}
            </div>

            {/* Category */}
            <div className="form-group">
              <label className="form-label" htmlFor="skill-category">
                Category *
              </label>
              {!showCustomCatField ? (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <select
                    id="skill-category"
                    className="input-control"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowCustomCatField(true)}
                  >
                    + Custom
                  </button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <input
                    type="text"
                    className="input-control"
                    placeholder="Enter custom category name..."
                    value={customCatInput}
                    onChange={(e) => setCustomCatInput(e.target.value)}
                    autoFocus
                  />
                  <button
                    type="button"
                    className="btn btn-secondary btn-sm"
                    onClick={() => setShowCustomCatField(false)}
                  >
                    Cancel
                  </button>
                </div>
              )}
              {errors.category && <div className="form-error">{errors.category}</div>}
            </div>

            {/* Description */}
            <div className="form-group">
              <label className="form-label" htmlFor="skill-desc">
                Short Description
              </label>
              <textarea
                id="skill-desc"
                className="input-control"
                rows={2}
                placeholder="What is your learning scope or curriculum for this skill?"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Start Date */}
            <div className="form-group">
              <label className="form-label" htmlFor="skill-date">
                Learning Start Date
              </label>
              <input
                id="skill-date"
                type="date"
                className="input-control"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* Initial Tasks (only when adding a new skill) */}
            {!isEditing && (
              <div style={{ marginTop: '1.25rem', padding: '1rem', background: 'var(--bg-cream-alt)', borderRadius: 'var(--radius-md)' }}>
                <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
                  Add First Two Learning Steps (Optional)
                </span>
                <input
                  type="text"
                  className="input-control"
                  style={{ marginBottom: '0.5rem', background: '#fff' }}
                  placeholder="Task 1: e.g. Read official documentation overview"
                  value={initialTask1}
                  onChange={(e) => setInitialTask1(e.target.value)}
                />
                <input
                  type="text"
                  className="input-control"
                  style={{ background: '#fff' }}
                  placeholder="Task 2: e.g. Build hands-on starter project"
                  value={initialTask2}
                  onChange={(e) => setInitialTask2(e.target.value)}
                />
              </div>
            )}
          </div>

          <div className="modal-footer">
            <button type="button" className="btn btn-secondary btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary btn-sm">
              {isEditing ? 'Save Changes' : 'Create Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

