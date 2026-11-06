import React, { useState } from 'react';
import {
  User,
  Mail,
  GraduationCap,
  Building,
  Linkedin,
  Github,
  Globe,
  Save,
  RotateCcw,
  Plus,
  X,
  CheckCircle2,
  Bell,
  Database,
  CloudUpload
} from 'lucide-react';

/**
 * User Profile Management Page.
 * Demonstrates Controlled Form Inputs, Array Tags manipulation, Reminder Settings, and State Persistence.
 */
export default function Profile({
  profile,
  reminders,
  onSaveProfile,
  onSaveReminders,
  onResetDemo,
  onMigrateData
}) {
  const [formData, setFormData] = useState({
    name: profile.name || '',
    email: profile.email || '',
    bio: profile.bio || '',
    education: profile.education || '',
    institution: profile.institution || '',
    linkedin: profile.linkedin || '',
    github: profile.github || '',
    portfolioUrl: profile.portfolioUrl || '',
    avatarUrl: profile.avatarUrl || ''
  });

  const [reminderSettings, setReminderSettings] = useState(
    reminders || { enabled: true, daysBeforeDeadline: 5, showDashboardBanner: true }
  );

  const [interests, setInterests] = useState(profile.interests || []);
  const [newTagInput, setNewTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSavedSuccess, setIsSavedSuccess] = useState(false);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) {
      errs.name = 'Full name is required.';
    }
    if (!formData.email.trim()) {
      errs.email = 'Email address is required.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    return errs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
    setIsSavedSuccess(false);
  };

  const handleAddInterest = (e) => {
    e.preventDefault();
    if (newTagInput.trim() && !interests.includes(newTagInput.trim())) {
      setInterests([...interests, newTagInput.trim()]);
      setNewTagInput('');
      setIsSavedSuccess(false);
    }
  };

  const handleRemoveInterest = (tagToRemove) => {
    setInterests(interests.filter((t) => t !== tagToRemove));
    setIsSavedSuccess(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    // Compute initials
    const initials = formData.name
      .split(' ')
      .filter(Boolean)
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || 'AS';

    const updated = {
      ...profile,
      ...formData,
      avatarInitials: initials,
      interests
    };

    onSaveProfile(updated);
    if (onSaveReminders) {
      onSaveReminders(reminderSettings);
    }
    setIsSavedSuccess(true);
    setTimeout(() => setIsSavedSuccess(false), 3500);
  };

  return (
    <div className="page-wrapper">
      <div className="page-header-row">
        <div>
          <h1 className="font-editorial" style={{ fontSize: '1.9rem' }}>
            User Profile Settings
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Update your professional information and credentials for your public portfolio.
          </p>
        </div>

        {isSavedSuccess && (
          <div
            className="editorial-pill"
            style={{
              background: 'var(--success-bg)',
              color: 'var(--success-text)',
              borderColor: 'var(--success-border)',
              padding: '0.5rem 1rem'
            }}
          >
            <CheckCircle2 size={16} /> Profile Saved Successfully!
          </div>
        )}
      </div>

      <div className="profile-layout-grid">
        {/* Sticky Profile Summary Card */}
        <div>
          <div className="profile-card-sticky">
            <div className="profile-avatar-big">
              {formData.avatarUrl ? (
                <img
                  src={formData.avatarUrl}
                  alt={formData.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span>
                  {formData.name
                    ? formData.name
                        .split(' ')
                        .filter(Boolean)
                        .map((p) => p[0])
                        .join('')
                        .toUpperCase()
                        .slice(0, 2)
                    : 'AS'}
                </span>
              )}
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>{formData.name || 'Your Name'}</h3>
            <p style={{ fontSize: '0.86rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {formData.education || 'Student Degree'}
            </p>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              {formData.institution || 'University Name'}
            </p>

            <div style={{ marginTop: '1.25rem', borderTop: '1px solid var(--border-light)', paddingTop: '1.25rem' }}>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Interests & Focus
              </span>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', justifyContent: 'center', marginTop: '0.5rem' }}>
                {interests.map((tag) => (
                  <span key={tag} className="editorial-pill" style={{ fontSize: '0.72rem' }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Profile Edit Form */}
        <div className="editorial-card" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit}>
            {/* Full Name & Email */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-name">
                  Full Name *
                </label>
                <input
                  id="profile-name"
                  type="text"
                  name="name"
                  className="input-control"
                  value={formData.name}
                  onChange={handleInputChange}
                />
                {errors.name && <div className="form-error">{errors.name}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-email">
                  Email Address *
                </label>
                <input
                  id="profile-email"
                  type="email"
                  name="email"
                  className="input-control"
                  value={formData.email}
                  onChange={handleInputChange}
                />
                {errors.email && <div className="form-error">{errors.email}</div>}
              </div>
            </div>

            {/* Bio */}
            <div className="form-group">
              <label className="form-label" htmlFor="profile-bio">
                Short Bio / Academic Summary
              </label>
              <textarea
                id="profile-bio"
                name="bio"
                className="input-control"
                rows={3}
                placeholder="Brief summary of your learning focus and career objectives..."
                value={formData.bio}
                onChange={handleInputChange}
              />
            </div>

            {/* Education & Institution */}
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label" htmlFor="profile-education">
                  Degree / Program
                </label>
                <input
                  id="profile-education"
                  type="text"
                  name="education"
                  className="input-control"
                  placeholder="e.g. B.Tech in Computer Science & Engineering"
                  value={formData.education}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="profile-institution">
                  Institution / College
                </label>
                <input
                  id="profile-institution"
                  type="text"
                  name="institution"
                  className="input-control"
                  placeholder="e.g. National Institute of Technology"
                  value={formData.institution}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Social Links */}
            <div style={{ marginTop: '0.5rem', marginBottom: '1.25rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'block', marginBottom: '0.75rem' }}>
                Professional Links & Profiles
              </span>

              <div className="grid-3">
                <div className="form-group">
                  <label className="form-label" htmlFor="profile-linkedin">
                    LinkedIn Profile URL
                  </label>
                  <input
                    id="profile-linkedin"
                    type="url"
                    name="linkedin"
                    className="input-control"
                    placeholder="https://linkedin.com/in/username"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-github">
                    GitHub Profile URL
                  </label>
                  <input
                    id="profile-github"
                    type="url"
                    name="github"
                    className="input-control"
                    placeholder="https://github.com/username"
                    value={formData.github}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="profile-portfolio">
                    Website / Portfolio URL
                  </label>
                  <input
                    id="profile-portfolio"
                    type="url"
                    name="portfolioUrl"
                    className="input-control"
                    placeholder="https://mywebsite.dev"
                    value={formData.portfolioUrl}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            {/* Avatar URL option */}
            <div className="form-group">
              <label className="form-label" htmlFor="profile-avatar">
                Custom Avatar Image URL (Optional)
              </label>
              <input
                id="profile-avatar"
                type="url"
                name="avatarUrl"
                className="input-control"
                placeholder="Leave blank to use elegant initials avatar"
                value={formData.avatarUrl}
                onChange={handleInputChange}
              />
            </div>

            {/* Interests Tag List Manager */}
            <div className="form-group">
              <label className="form-label">
                Skills & Interests Tags
              </label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  className="input-control"
                  placeholder="Add a skill or interest (e.g. Distributed Systems)..."
                  value={newTagInput}
                  onChange={(e) => setNewTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddInterest(e);
                    }
                  }}
                />
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleAddInterest}
                >
                  <Plus size={15} /> Add
                </button>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {interests.map((tag) => (
                  <span
                    key={tag}
                    className="editorial-pill"
                    style={{ paddingRight: '0.4rem', display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(tag)}
                      style={{ color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X size={12} />
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* In-App Reminder Preferences Section */}
            <div
              style={{
                marginTop: '1.75rem',
                marginBottom: '1.25rem',
                background: 'var(--bg-cream-alt)',
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Bell size={18} color="var(--lavender-700)" />
                <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                  In-App Deadline Reminder Settings
                </span>
              </div>

              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                Configure in-app deadline notifications. (Note: Because Skillora is a frontend application, reminders trigger within the active browser session and do not dispatch remote emails).
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', cursor: 'pointer', fontSize: '0.86rem' }}>
                  <input
                    type="checkbox"
                    checked={Boolean(reminderSettings.enabled)}
                    onChange={(e) => setReminderSettings({ ...reminderSettings, enabled: e.target.checked })}
                    style={{ accentColor: 'var(--lavender-600)' }}
                  />
                  <span>Enable in-app upcoming deadline reminders</span>
                </label>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                  <label style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    Warning Alert Threshold:
                  </label>
                  <select
                    className="input-control"
                    style={{ width: '200px', padding: '0.4rem 0.65rem', fontSize: '0.84rem' }}
                    value={reminderSettings.daysBeforeDeadline}
                    onChange={(e) => setReminderSettings({ ...reminderSettings, daysBeforeDeadline: Number(e.target.value) })}
                    disabled={!reminderSettings.enabled}
                  >
                    <option value={3}>3 Days Before Deadline</option>
                    <option value={5}>5 Days Before (Default)</option>
                    <option value={7}>7 Days Before (1 Week)</option>
                    <option value={14}>14 Days Before (2 Weeks)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* MongoDB Cloud Synchronization & LocalStorage Migration Section */}
            {onMigrateData && (
              <div
                style={{
                  marginTop: '1.75rem',
                  marginBottom: '1.25rem',
                  background: 'var(--lavender-50)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--lavender-200)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div className="brand-logo-icon" style={{ width: '32px', height: '32px' }}>
                      <Database size={16} />
                    </div>
                    <div>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                        MongoDB Cloud Synchronization & Migration
                      </span>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                        Safely synchronize all local workspace data (skills, tasks, streaks, and goals) directly into your MongoDB database.
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onMigrateData}
                    style={{ fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}
                  >
                    <CloudUpload size={15} /> Sync to MongoDB Cloud
                  </button>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)' }}>
              <button type="submit" className="btn btn-primary">
                <Save size={16} /> Save Profile Details
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

