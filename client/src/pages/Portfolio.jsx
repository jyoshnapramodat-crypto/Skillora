import React, { useState, useEffect } from 'react';
import {
  Share2,
  Download,
  FileText,
  Copy,
  Check,
  Globe,
  Github,
  Linkedin,
  Mail,
  GraduationCap,
  Sparkles,
  Layers,
  Target,
  Flame,
  CheckCircle2,
  Sliders,
  Eye,
  EyeOff,
  Compass
} from 'lucide-react';
import ProgressBar from '../components/ProgressBar';
import { calculateSkillProgress, formatDate } from '../utils/calculations';
import { calculateStreakStats } from '../utils/streaks';
import portfolioService from '../services/portfolioService';

/**
 * Public Shareable Portfolio Page & Verified PDF / CSV Exporter.
 * Demonstrates Client-Side Export pipelines, Dynamic Filtering, and Visibility Preferences.
 */
export default function Portfolio({
  profile = {},
  skills = [],
  goals = [],
  activityLog = [],
  onUpdateVisibility,
  onExportPDF,
  onExportCSV
}) {
  const [copiedLink, setCopiedLink] = useState(false);
  const [showConfigModal, setShowConfigModal] = useState(false);
  const [publicData, setPublicData] = useState(null);
  const [isLoadingPublic, setIsLoadingPublic] = useState(false);
  const [publicError, setPublicError] = useState('');

  const [isPreviewMode, setIsPreviewMode] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    return params.get('view') === 'portfolio' || Boolean(params.get('portfolio'));
  });

  // Check for public portfolio param on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const publicId = params.get('portfolio');
    if (publicId) {
      setIsLoadingPublic(true);
      portfolioService
        .getPublicPortfolio(publicId)
        .then((data) => {
          setPublicData(data);
          setIsPreviewMode(true);
        })
        .catch((err) => {
          setPublicError(err.message || 'Unable to load public portfolio.');
        })
        .finally(() => {
          setIsLoadingPublic(false);
        });
    }
  }, []);

  // Use public data if loaded via public link, otherwise use props
  const activeProfile = publicData ? publicData.user : profile;
  const activeSkills = publicData ? publicData.skills : skills;
  const activeGoals = publicData ? publicData.goals : goals;

  const visibility = (publicData ? publicData.settings : profile.visibility) || {
    showBio: true,
    showEducation: true,
    showSocials: true,
    showGoals: true,
    showStreaks: true,
    selectedSkillIds: activeSkills.map((s) => s.id || s._id)
  };

  const selectedSkillIds = visibility.selectedSkillIds || [];

  // Filter skills according to visibility settings
  const visibleSkills = activeSkills.filter(
    (s) => selectedSkillIds.length === 0 || selectedSkillIds.includes(s.id || s._id)
  );

  const streakStats = publicData?.stats?.streak || calculateStreakStats(activityLog);

  // Handle Copy shareable URL
  const handleCopyLink = () => {
    const publicId = activeProfile.publicId || 'ananya-sharma';
    const publicUrl = `${window.location.origin}${window.location.pathname}?portfolio=${encodeURIComponent(publicId)}`;
    navigator.clipboard
      .writeText(publicUrl)
      .then(() => {
        setCopiedLink(true);
        setTimeout(() => setCopiedLink(false), 3000);
      })
      .catch(() => {
        // Fallback prompt if clipboard API blocked
        prompt('Copy this shareable portfolio link:', publicUrl);
      });
  };

  // Toggle skill selection in configuration
  const handleToggleSkillSelection = (skillId) => {
    const exists = selectedSkillIds.includes(skillId);
    let updated;
    if (exists) {
      updated = selectedSkillIds.filter((id) => id !== skillId);
    } else {
      updated = [...selectedSkillIds, skillId];
    }
    onUpdateVisibility({
      ...visibility,
      selectedSkillIds: updated
    });
  };

  const handleToggleVisibilityField = (field) => {
    onUpdateVisibility({
      ...visibility,
      [field]: !visibility[field]
    });
  };

  if (isLoadingPublic) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div className="brand-logo-icon" style={{ margin: '0 auto 1.5rem', width: '56px', height: '56px' }}>
          <Compass size={32} />
        </div>
        <h2 className="font-editorial" style={{ fontSize: '1.8rem', color: 'var(--text-primary)' }}>Loading Verified Portfolio...</h2>
        <p style={{ color: 'var(--text-muted)' }}>Retrieving skills, milestones, and credentials from Skillora cloud database.</p>
      </div>
    );
  }

  if (publicError) {
    return (
      <div className="page-wrapper" style={{ textAlign: 'center', padding: '6rem 2rem' }}>
        <div style={{ maxWidth: '500px', margin: '0 auto', background: '#fff', padding: '2.5rem', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-md)', border: '1px solid var(--border-light)' }}>
          <h2 className="font-editorial" style={{ fontSize: '1.8rem', color: 'var(--danger-text)', marginBottom: '0.75rem' }}>Portfolio Not Found</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{publicError}</p>
          <a href="/" className="btn btn-primary" style={{ display: 'inline-flex', textDecoration: 'none' }}>
            Return to Skillora Home
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="page-wrapper">
      {/* Top Banner Toolbar or Preview Bar */}
      {isPreviewMode ? (
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            border: '1px solid var(--lavender-300)',
            borderRadius: 'var(--radius-lg)',
            padding: '0.85rem 1.4rem',
            marginBottom: '2rem',
            boxShadow: 'var(--shadow-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.75rem',
            position: 'sticky',
            top: '1rem',
            zIndex: 50
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div className="brand-logo-icon" style={{ width: '28px', height: '28px' }}>
              <Eye size={16} />
            </div>
            <div>
              <span style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                Public Portfolio Live Preview
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginLeft: '0.5rem' }}>
                (Standalone Visitor Perspective)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button className="btn btn-secondary btn-sm" onClick={handleCopyLink}>
              {copiedLink ? <Check size={14} color="#2ea043" /> : <Copy size={14} />}
              {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
            </button>

            <button className="btn btn-primary btn-sm" onClick={onExportPDF}>
              <FileText size={14} /> Download PDF
            </button>

            <button className="btn btn-secondary btn-sm" onClick={() => setIsPreviewMode(false)}>
              <EyeOff size={14} /> Exit Preview
            </button>
          </div>
        </div>
      ) : (
        <div className="portfolio-share-banner">
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: 'var(--lavender-800)' }}>
              <Sparkles size={16} />
              <span>Public Portfolio & Export Hub</span>
            </div>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px' }}>
              Curate your public-facing showcases, download your verified PDF resume, or export raw CSV data.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setIsPreviewMode(true)}
              title="Open public portfolio preview mode"
            >
              <Eye size={14} /> Open Public Preview
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={() => setShowConfigModal(!showConfigModal)}
              title="Configure which skills and sections appear on your portfolio"
            >
              <Sliders size={14} /> Customize Visibility
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={handleCopyLink}
              title="Copy client-side shareable link"
            >
              {copiedLink ? <Check size={14} color="#2ea043" /> : <Copy size={14} />}
              {copiedLink ? 'Link Copied!' : 'Copy Share Link'}
            </button>

            <button
              className="btn btn-secondary btn-sm"
              onClick={onExportCSV}
              title="Download CSV spreadsheet of skills and tasks"
            >
              <Download size={14} /> Download CSV
            </button>

            <button
              className="btn btn-primary btn-sm"
              onClick={onExportPDF}
              title="Generate and download verified PDF portfolio"
            >
              <FileText size={14} /> Download PDF Portfolio
            </button>
          </div>
        </div>
      )}

      {/* Visibility Customizer Dropdown / Box */}
      {showConfigModal && (
        <div
          className="editorial-card"
          style={{ padding: '1.5rem', marginBottom: '2rem', background: 'var(--bg-cream-alt)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700 }}>
              Customize Public Visibility
            </h4>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              Client-side preferences saved automatically
            </span>
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1.25rem', marginBottom: '1.25rem', fontSize: '0.85rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={visibility.showBio}
                onChange={() => handleToggleVisibilityField('showBio')}
              />
              Show Bio
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={visibility.showEducation}
                onChange={() => handleToggleVisibilityField('showEducation')}
              />
              Show Education
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={visibility.showSocials}
                onChange={() => handleToggleVisibilityField('showSocials')}
              />
              Show Social Links
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={visibility.showGoals}
                onChange={() => handleToggleVisibilityField('showGoals')}
              />
              Show Learning Goals
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={visibility.showStreaks}
                onChange={() => handleToggleVisibilityField('showStreaks')}
              />
              Show Consistency Streak
            </label>
          </div>

          <div style={{ borderTop: '1px solid var(--border-default)', paddingTop: '0.85rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.5rem' }}>
              Include Specific Skills in Portfolio:
            </span>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {skills.map((s) => {
                const isSelected = selectedSkillIds.includes(s.id);
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => handleToggleSkillSelection(s.id)}
                    className={`category-chip ${isSelected ? 'active' : ''}`}
                    style={{ fontSize: '0.78rem' }}
                  >
                    {isSelected ? '✓ ' : '+ '} {s.name}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Share Link Disclaimer Pill */}
      <div
        style={{
          background: 'var(--info-bg)',
          border: '1px solid var(--info-border)',
          borderRadius: 'var(--radius-md)',
          padding: '0.75rem 1.15rem',
          fontSize: '0.82rem',
          color: 'var(--info-text)',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}
      >
        <Globe size={16} />
        <span>
          <strong>Client-Side Demo Note:</strong> This portfolio view is generated dynamically inside your browser session using localStorage. Shareable links run locally on your client and do not require external cloud storage or user databases.
        </span>
      </div>

      {/* The Printable / Public Editorial Portfolio Sheet */}
      <article className="public-portfolio-sheet">
        {/* Header Profile Section */}
        <header className="portfolio-header-strip">
          <div style={{ display: 'flex', gap: '1.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="profile-avatar-big" style={{ margin: 0, width: '92px', height: '92px', fontSize: '2rem' }}>
              {profile.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={profile.name}
                  style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }}
                />
              ) : (
                <span>{profile.avatarInitials || 'AS'}</span>
              )}
            </div>

            <div>
              <div className="editorial-pill" style={{ marginBottom: '0.35rem', fontSize: '0.72rem' }}>
                Verified Skill Portfolio
              </div>
              <h1 className="font-editorial" style={{ fontSize: '2.3rem', color: 'var(--text-primary)' }}>
                {profile.name || 'Student Portfolio'}
              </h1>

              {visibility.showEducation && profile.education && (
                <div style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <GraduationCap size={16} color="var(--lavender-600)" />
                  <span>
                    {profile.education} • {profile.institution || 'University'}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Social Links */}
          {visibility.showSocials && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', alignItems: 'flex-start' }}>
              {profile.email && (
                <a
                  href={`mailto:${profile.email}`}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Mail size={14} /> {profile.email}
                </a>
              )}
              {profile.linkedin && (
                <a
                  href={profile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Linkedin size={14} /> LinkedIn
                </a>
              )}
              {profile.github && (
                <a
                  href={profile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Github size={14} /> GitHub
                </a>
              )}
              {profile.portfolioUrl && (
                <a
                  href={profile.portfolioUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
                >
                  <Globe size={14} /> Website
                </a>
              )}
            </div>
          )}
        </header>

        {/* Bio & Academic Statement */}
        {visibility.showBio && profile.bio && (
          <section className="portfolio-section-block">
            <h3 className="portfolio-section-heading">
              <Sparkles size={16} /> Candidate Profile & Statement
            </h3>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.65, fontStyle: 'italic', background: 'var(--bg-cream-alt)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', borderLeft: '3px solid var(--lavender-500)' }}>
              "{profile.bio}"
            </p>
          </section>
        )}

        {/* Consistency Streak Highlight */}
        {visibility.showStreaks && (
          <section className="portfolio-section-block">
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, var(--lavender-50), #fff)', padding: '1.25rem 1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--lavender-200)' }}>
              <div className="streak-flame-icon" style={{ width: '44px', height: '44px' }}>
                <Flame size={24} />
              </div>
              <div>
                <div style={{ fontWeight: 800, fontSize: '1.15rem' }}>
                  {streakStats.currentStreak} Days Consecutive Study Streak
                </div>
                <div style={{ fontSize: '0.84rem', color: 'var(--text-secondary)' }}>
                  Verified across {streakStats.totalActivityDays} distinct learning sessions with a peak streak of {streakStats.longestStreak} days.
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Verified Skills & Calculated Progress Section */}
        <section className="portfolio-section-block">
          <h3 className="portfolio-section-heading">
            <Layers size={16} /> Verified Skills & Progress
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {visibleSkills.length === 0 ? (
              <div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontStyle: 'italic' }}>
                No public skills selected. Adjust your visibility settings to display skills.
              </div>
            ) : (
              visibleSkills.map((skill) => {
                const stats = calculateSkillProgress(skill);
                return (
                  <div
                    key={skill.id}
                    style={{
                      padding: '1.25rem',
                      background: 'var(--bg-card-subtle)',
                      border: '1px solid var(--border-default)',
                      borderRadius: 'var(--radius-md)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.4rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <div>
                        <span style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
                          {skill.name}
                        </span>
                        <span className="skill-category-badge" style={{ marginLeft: '0.65rem', fontSize: '0.72rem' }}>
                          {skill.category}
                        </span>
                      </div>
                      <span style={{ fontWeight: 700, fontSize: '0.92rem', color: 'var(--lavender-700)' }}>
                        {stats.percentage}% ({stats.completedTasks}/{stats.totalTasks} Tasks)
                      </span>
                    </div>

                    {skill.description && (
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.75rem', lineHeight: 1.45 }}>
                        {skill.description}
                      </p>
                    )}

                    <ProgressBar percentage={stats.percentage} height="8px" showPercentage={false} />

                    {/* Compact finished tasks summary */}
                    {skill.tasks && skill.tasks.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.75rem' }}>
                        {skill.tasks
                          .filter((t) => t.completed)
                          .slice(0, 4)
                          .map((t) => (
                            <span
                              key={t.id}
                              style={{
                                fontSize: '0.75rem',
                                color: 'var(--text-secondary)',
                                background: '#ffffff',
                                border: '1px solid var(--border-light)',
                                padding: '0.15rem 0.5rem',
                                borderRadius: '4px',
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '0.25rem'
                              }}
                            >
                              <CheckCircle2 size={11} color="#2ea043" /> {t.title}
                            </span>
                          ))}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </section>

        {/* Active Strategic Goals Section */}
        {visibility.showGoals && goals.length > 0 && (
          <section className="portfolio-section-block">
            <h3 className="portfolio-section-heading">
              <Target size={16} /> Strategic Learning Goals
            </h3>

            <div className="grid-2">
              {goals.slice(0, 4).map((goal) => (
                <div
                  key={goal.id}
                  style={{
                    padding: '1rem',
                    background: 'var(--bg-cream-alt)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-light)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span className={`priority-pill ${(goal.priority || 'medium').toLowerCase()}`}>
                      {goal.priority}
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Target: {formatDate(goal.targetDate)}
                    </span>
                  </div>
                  <div style={{ fontWeight: 700, fontSize: '0.92rem' }}>{goal.title}</div>
                  {goal.description && (
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                      {goal.description}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Portfolio Verification Stamp */}
        <footer style={{ marginTop: '3rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: 'var(--text-muted)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Skillora Academic Mini Project • Authenticated Local Portfolio</span>
          <span>Verified Timestamp: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
        </footer>
      </article>
    </div>
  );
}

