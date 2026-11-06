import React, { useState } from 'react';
import { Menu, User, Download, Plus, LogOut, ChevronDown, Sparkles } from 'lucide-react';
import { NAV_ITEMS } from './Sidebar';

/**
 * Top Navbar component for the Skillora workspace.
 * Displays page title, active account avatar chip with dropdown, and quick action buttons.
 */
export default function Navbar({
  currentPage,
  profile,
  currentUser,
  onToggleSidebar,
  onNavigate,
  onOpenAddSkillModal,
  onExportCSV,
  onLogout
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const currentNav = NAV_ITEMS.find((item) => item.id === currentPage) || {
    label: 'Workspace'
  };

  const isDemo = currentUser?.isDemo;

  return (
    <header className="top-navbar">
      <div className="top-navbar-left">
        <button
          className="btn-icon mobile-menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation menu"
          style={{ display: 'none' }}
        >
          <Menu size={20} />
        </button>

        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, letterSpacing: '0.04em' }}>
              Skillora Workspace
            </span>
            {isDemo && (
              <span
                className="editorial-pill"
                style={{ fontSize: '0.65rem', padding: '0.1rem 0.45rem', background: 'var(--lavender-100)', color: 'var(--lavender-700)' }}
              >
                Demo Student
              </span>
            )}
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)', marginTop: '-2px' }}>
            {currentNav.label}
          </h2>
        </div>
      </div>

      <div className="top-navbar-right">
        {onExportCSV && (
          <button
            className="btn btn-secondary btn-sm export-csv-btn"
            onClick={onExportCSV}
            title="Export all current skills and task progress to CSV"
          >
            <Download size={14} /> Export CSV
          </button>
        )}

        {onOpenAddSkillModal && (
          <button
            className="btn btn-primary btn-sm"
            onClick={onOpenAddSkillModal}
            title="Create a new skill"
          >
            <Plus size={15} /> Add Skill
          </button>
        )}

        {/* User profile dropdown pill */}
        <div style={{ position: 'relative' }}>
          <div
            className="nav-user-chip"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            title="User account options"
          >
            <div className="user-avatar-circle">
              {profile?.avatarUrl ? (
                <img src={profile.avatarUrl} alt={profile.name} />
              ) : (
                <span>{profile?.avatarInitials || 'AS'}</span>
              )}
            </div>
            <span style={{ maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {profile?.name ? profile.name.split(' ')[0] : 'Account'}
            </span>
            <ChevronDown size={14} color="var(--text-muted)" />
          </div>

          {/* Account Dropdown Menu */}
          {isDropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '220px',
                background: '#ffffff',
                border: '1px solid var(--border-default)',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-lg)',
                padding: '0.6rem 0',
                zIndex: 60,
                animation: 'slideUp 0.15s ease-out'
              }}
            >
              <div style={{ padding: '0.6rem 1rem 0.8rem', borderBottom: '1px solid var(--border-light)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                  {profile?.name || 'Student'}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {profile?.email || currentUser?.email}
                </div>
                {isDemo ? (
                  <span className="editorial-pill" style={{ fontSize: '0.65rem', marginTop: '0.35rem' }}>
                    Demo Mode
                  </span>
                ) : (
                  <span className="editorial-pill" style={{ fontSize: '0.65rem', marginTop: '0.35rem', background: 'var(--success-bg)', color: 'var(--success-text)', borderColor: 'var(--success-border)' }}>
                    Personal Account
                  </span>
                )}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onNavigate('profile');
                }}
                className="sidebar-link"
                style={{ width: '100%', borderRadius: 0, padding: '0.55rem 1rem', fontSize: '0.85rem' }}
              >
                <User size={15} /> Edit Profile
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsDropdownOpen(false);
                  onLogout();
                }}
                className="sidebar-link"
                style={{ width: '100%', borderRadius: 0, padding: '0.55rem 1rem', fontSize: '0.85rem', color: 'var(--danger-text)' }}
              >
                <LogOut size={15} /> Switch / Log Out
              </button>
            </div>
          )}
        </div>
      </div>

      <style>{`
        @media (max-width: 900px) {
          .mobile-menu-toggle {
            display: flex !important;
          }
          .export-csv-btn {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
}
