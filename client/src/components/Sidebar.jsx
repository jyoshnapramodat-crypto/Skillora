import React from 'react';
import {
  LayoutDashboard,
  Layers,
  Target,
  BarChart3,
  User,
  Share2,
  Info,
  Mail,
  RotateCcw,
  LogOut,
  X,
  Compass,
  UserCheck
} from 'lucide-react';

export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'skills', label: 'Skills & Tasks', icon: Layers },
  { id: 'goals', label: 'Learning Goals', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  { id: 'profile', label: 'My Profile', icon: User },
  { id: 'portfolio', label: 'Shareable Portfolio', icon: Share2 },
  { id: 'about', label: 'About Skillora', icon: Info },
  { id: 'contact', label: 'Support & Contact', icon: Mail }
];

/**
 * Sidebar component supporting desktop persistent and mobile drawer layouts.
 */
export default function Sidebar({
  currentPage,
  currentUser,
  onNavigate,
  isOpen,
  onClose,
  onOpenResetModal,
  onLogout
}) {
  const isDemo = currentUser?.isDemo;

  return (
    <>
      {/* Mobile Drawer Overlay */}
      <div
        className={`sidebar-overlay ${isOpen ? 'open' : ''}`}
        onClick={onClose}
        aria-hidden="true"
      />

      <aside className={`app-sidebar ${isOpen ? 'open' : ''}`}>
        {/* Sidebar Header */}
        <div className="sidebar-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div
            className="brand-badge"
            style={{ cursor: 'pointer' }}
            onClick={() => onNavigate('dashboard')}
          >
            <div className="brand-logo-icon">
              <Compass size={18} />
            </div>
            <span>Skillora</span>
          </div>

          <button
            className="btn-icon mobile-close-btn"
            onClick={onClose}
            aria-label="Close sidebar menu"
            style={{ display: isOpen ? 'flex' : 'none' }}
          >
            <X size={18} />
          </button>
        </div>

        {/* Sidebar Menu Items */}
        <ul className="sidebar-menu">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <li key={item.id}>
                <button
                  type="button"
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onNavigate(item.id);
                    if (onClose) onClose();
                  }}
                  style={{ width: '100%', textAlign: 'left' }}
                >
                  <span className="sidebar-link-icon">
                    <Icon size={18} />
                  </span>
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        {/* Sidebar Bottom / User Session & Demo Options */}
        <div className="sidebar-footer">
          <div className="sidebar-demo-badge" style={{ marginBottom: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.82rem' }}>
                {currentUser?.name || 'Student Account'}
              </span>
              <span
                className="editorial-pill"
                style={{
                  fontSize: '0.65rem',
                  padding: '0.1rem 0.4rem',
                  background: isDemo ? 'var(--lavender-100)' : 'var(--success-bg)',
                  color: isDemo ? 'var(--lavender-700)' : 'var(--success-text)'
                }}
              >
                {isDemo ? 'Demo Mode' : 'Active Account'}
              </span>
            </div>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              {isDemo ? 'Preloaded student dataset' : currentUser?.email}
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {isDemo && onOpenResetModal && (
              <button
                className="btn btn-secondary btn-sm"
                onClick={onOpenResetModal}
                style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.78rem' }}
                title="Reset all skills, tasks, and goals back to default demo state"
              >
                <RotateCcw size={13} /> Reset Demo Data
              </button>
            )}

            <button
              className="btn btn-sm"
              onClick={onLogout}
              style={{
                width: '100%',
                justifyContent: 'flex-start',
                fontSize: '0.78rem',
                color: 'var(--text-muted)'
              }}
              title="Log out and return to the login screen"
            >
              <LogOut size={13} /> Switch Account / Log Out
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
