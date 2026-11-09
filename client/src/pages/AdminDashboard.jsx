import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Database,
  Cloud,
  CheckCircle2,
  Lock,
  Mail,
  ArrowLeft,
  Server,
  Zap,
  Activity
} from 'lucide-react';
import adminService from '../services/adminService';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard({ onNavigateHome, onAdminLoggedOut }) {
  const [adminUser, setAdminUser] = useState(() => adminService.getCurrentAdmin());
  const [loginEmail, setLoginEmail] = useState('admin@skillora.dev');
  const [loginPassword, setLoginPassword] = useState('Admin@Skillora2026!');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [metrics, setMetrics] = useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [metricsError, setMetricsError] = useState('');

  useEffect(() => {
    if (adminUser) {
      loadMetrics();
    }
  }, [adminUser]);

  const loadMetrics = async () => {
    setIsLoadingMetrics(true);
    setMetricsError('');
    try {
      const data = await adminService.getMetrics();
      if (data.success) {
        setMetrics(data);
      }
    } catch (err) {
      setMetricsError(err.message || 'Failed to fetch admin metrics. Make sure backend is running.');
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  const handleAdminLogin = async (e) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError('');
    try {
      const res = await adminService.login(loginEmail, loginPassword);
      if (res.success) {
        setAdminUser(res.user);
      }
    } catch (err) {
      setLoginError(err.message || 'Invalid administrator credentials.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleLogout = () => {
    adminService.logout();
    setAdminUser(null);
    setMetrics(null);
    if (onAdminLoggedOut) onAdminLoggedOut();
  };

  // ------------------ ADMIN LOGIN SCREEN ------------------
  if (!adminUser) {
    return (
      <div
        style={{
          minHeight: '100vh',
          backgroundColor: '#faf7f2',
          backgroundImage: 'radial-gradient(#eedfce 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem 1.5rem',
          fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif",
          color: '#24202e'
        }}
      >
        <div
          style={{
            width: '100%',
            maxWidth: '460px',
            backgroundColor: '#ffffff',
            borderRadius: '20px',
            border: '1px solid #e8dfd5',
            boxShadow: '0 20px 45px -15px rgba(68, 36, 127, 0.12), 0 0 0 1px rgba(220, 205, 190, 0.4)',
            padding: '2.5rem',
            boxSizing: 'border-box'
          }}
        >
          {/* Top header navigation */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '2rem'
            }}
          >
            <button
              type="button"
              onClick={onNavigateHome}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
                fontSize: '0.82rem',
                fontWeight: 600,
                color: '#57339b',
                background: '#f6f3fc',
                border: '1px solid #ddd0f1',
                padding: '0.45rem 0.85rem',
                borderRadius: '8px',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
            >
              <ArrowLeft size={14} /> Back to Skillora
            </button>

            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.72rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                color: '#57339b',
                backgroundColor: '#eee7f8',
                padding: '0.3rem 0.65rem',
                borderRadius: '999px',
                border: '1px solid #ddd0f1'
              }}
            >
              <ShieldCheck size={13} /> Admin Portal
            </span>
          </div>

          {/* Icon and Title */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div
              style={{
                width: '60px',
                height: '60px',
                margin: '0 auto 1.25rem',
                background: 'linear-gradient(135deg, #6f47b6, #44247f)',
                borderRadius: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 8px 20px -4px rgba(111, 71, 182, 0.35)',
                color: '#ffffff'
              }}
            >
              <ShieldCheck size={30} />
            </div>
            <h1
              style={{
                fontSize: '1.65rem',
                fontWeight: 800,
                color: '#24202e',
                letterSpacing: '-0.02em',
                margin: '0 0 0.5rem 0'
              }}
            >
              Skillora Command Center
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#6e677c', margin: 0, lineHeight: 1.5 }}>
              Platform metrics, registered user analytics & revenue telemetry
            </p>
          </div>

          {loginError && (
            <div
              style={{
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                backgroundColor: '#fdf2f2',
                border: '1px solid #f8b4b4',
                borderRadius: '10px',
                color: '#9b1c1c',
                fontSize: '0.84rem',
                lineHeight: 1.4
              }}
            >
              {loginError}
            </div>
          )}

          {/* Admin Login Form */}
          <form onSubmit={handleAdminLogin}>
            <div style={{ marginBottom: '1.25rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#44247f',
                  marginBottom: '0.45rem'
                }}
              >
                Admin Email Address
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Mail
                  size={16}
                  style={{ position: 'absolute', left: '1rem', color: '#8862cb', pointerEvents: 'none' }}
                />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    fontSize: '0.92rem',
                    borderRadius: '10px',
                    border: '1.5px solid #dcd3c7',
                    backgroundColor: '#fbf9f6',
                    color: '#24202e',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="admin@skillora.dev"
                />
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label
                style={{
                  display: 'block',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#44247f',
                  marginBottom: '0.45rem'
                }}
              >
                Master Password
              </label>
              <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                <Lock
                  size={16}
                  style={{ position: 'absolute', left: '1rem', color: '#8862cb', pointerEvents: 'none' }}
                />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '0.75rem 1rem 0.75rem 2.6rem',
                    fontSize: '0.92rem',
                    borderRadius: '10px',
                    border: '1.5px solid #dcd3c7',
                    backgroundColor: '#fbf9f6',
                    color: '#24202e',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            {/* Default credential hint banner */}
            <div
              style={{
                backgroundColor: '#f6f3fc',
                border: '1px solid #ddd0f1',
                borderRadius: '10px',
                padding: '0.85rem 1rem',
                marginBottom: '1.5rem',
                fontSize: '0.8rem',
                color: '#44247f'
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <Database size={13} color="#6f47b6" /> Default Root Credentials:
              </div>
              <div style={{ color: '#57339b' }}>
                Email: <code style={{ backgroundColor: '#ffffff', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #ddd0f1' }}>admin@skillora.dev</code>
              </div>
              <div style={{ color: '#57339b', marginTop: '0.2rem' }}>
                Password: <code style={{ backgroundColor: '#ffffff', padding: '0.1rem 0.35rem', borderRadius: '4px', border: '1px solid #ddd0f1' }}>Admin@Skillora2026!</code>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              style={{
                width: '100%',
                padding: '0.85rem 1.25rem',
                fontSize: '0.95rem',
                fontWeight: 700,
                color: '#ffffff',
                background: 'linear-gradient(135deg, #6f47b6, #44247f)',
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                boxShadow: '0 8px 18px -4px rgba(111, 71, 182, 0.4)',
                opacity: isLoggingIn ? 0.7 : 1,
                boxSizing: 'border-box'
              }}
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw size={16} className="spin-animation" /> Verifying Credentials...
                </>
              ) : (
                <>
                  Access Admin Dashboard <ShieldCheck size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <style>{`
          .spin-animation {
            animation: spin 1s linear infinite;
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // ------------------ ADMIN METRICS DASHBOARD ------------------
  const stats = metrics?.stats || {
    totalUsers: 0,
    activeUsers7d: 0,
    totalRevenue: 0,
    estimatedExpenses: 15,
    estimatedProfit: 0,
    profitMargin: '0%',
    planCounts: { free: 0, pro: 0, enterprise: 0 },
    totalSkills: 0,
    totalGoals: 0,
    totalActivities: 0
  };

  const monthlyFinancials = metrics?.monthlyFinancials || [
    { month: 'Jun', revenue: 45, profit: 30, users: 4 },
    { month: 'Jul', revenue: 80, profit: 55, users: 8 },
    { month: 'Aug', revenue: 120, profit: 85, users: 12 },
    { month: 'Sep', revenue: 170, profit: 125, users: 16 },
    { month: 'Oct', revenue: 220, profit: 160, users: 20 },
    { month: 'Nov', revenue: 275, profit: 210, users: 25 }
  ];

  const planData = [
    { name: 'Free Tier', value: stats.planCounts?.free || 1, color: '#8b8599' },
    { name: 'Pro ($12/m)', value: stats.planCounts?.pro || 1, color: '#6f47b6' },
    { name: 'Enterprise ($49/m)', value: stats.planCounts?.enterprise || 0, color: '#cf5571' }
  ];

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#faf7f2',
        color: '#24202e',
        fontFamily: "'Plus Jakarta Sans', system-ui, -apple-system, sans-serif"
      }}
    >
      {/* Top Navigation Bar */}
      <header
        style={{
          backgroundColor: '#ffffff',
          borderBottom: '1px solid #e8dfd5',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 40,
          boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <button
            type="button"
            onClick={onNavigateHome}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: '#f4eee6',
              border: '1px solid #e4dcd0',
              color: '#24202e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Return to Skillora App"
          >
            <ArrowLeft size={16} />
          </button>
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #6f47b6, #44247f)',
              color: '#ffffff',
              fontWeight: 800,
              fontSize: '1.1rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            S
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontWeight: 800, fontSize: '1.05rem', color: '#24202e' }}>
                Skillora Admin Console
              </span>
              <span
                style={{
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  backgroundColor: '#eaf6ee',
                  color: '#1d743a',
                  border: '1px solid #c6e9d0',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '999px'
                }}
              >
                LIVE ATLAS
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: '#6e677c' }}>
              User telemetry, MRR economics & MongoDB cloud metrics
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              fontSize: '0.78rem',
              color: '#44247f',
              backgroundColor: '#f6f3fc',
              border: '1px solid #ddd0f1',
              padding: '0.4rem 0.75rem',
              borderRadius: '8px'
            }}
          >
            <Cloud size={14} color="#6f47b6" />
            <span>MongoDB Atlas Cluster</span>
          </div>

          <button
            type="button"
            onClick={loadMetrics}
            disabled={isLoadingMetrics}
            style={{
              padding: '0.45rem 0.65rem',
              borderRadius: '8px',
              backgroundColor: '#f4eee6',
              border: '1px solid #e4dcd0',
              color: '#24202e',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center'
            }}
            title="Refresh Metrics"
          >
            <RefreshCw size={15} className={isLoadingMetrics ? 'spin-animation' : ''} />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              backgroundColor: '#fdf2f2',
              border: '1px solid #f8b4b4',
              color: '#9b1c1c',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            <LogOut size={14} /> Exit
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        {metricsError && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              backgroundColor: '#fef7e8',
              border: '1px solid #f9d89c',
              borderRadius: '12px',
              color: '#966007',
              fontSize: '0.85rem',
              marginBottom: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <span>{metricsError}</span>
            <button
              onClick={loadMetrics}
              style={{ fontWeight: 700, textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', color: '#966007' }}
            >
              Retry
            </button>
          </div>
        )}

        {/* 4 Key Performance Metric Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: '1.25rem',
            marginBottom: '2rem'
          }}
        >
          {/* Card 1: Total Users */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e8dfd5',
              padding: '1.5rem',
              boxShadow: '0 4px 15px -2px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6e677c', textTransform: 'uppercase' }}>
                Total Registered Users
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#eee7f8',
                  color: '#6f47b6',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Users size={16} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#24202e' }}>{stats.totalUsers}</span>
              <span style={{ fontSize: '0.78rem', color: '#1d743a', fontWeight: 700 }}>
                +{stats.activeUsers7d} active (7d)
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#8b8599', marginTop: '0.4rem' }}>
              Accounts in MongoDB Atlas
            </div>
          </div>

          {/* Card 2: Gross Monthly Revenue */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e8dfd5',
              padding: '1.5rem',
              boxShadow: '0 4px 15px -2px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6e677c', textTransform: 'uppercase' }}>
                Gross Revenue (MRR)
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#eaf6ee',
                  color: '#1d743a',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <DollarSign size={16} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.35rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#1d743a' }}>${stats.totalRevenue}</span>
              <span style={{ fontSize: '0.8rem', color: '#6e677c' }}>/ month</span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#8b8599', marginTop: '0.4rem' }}>
              Pro ($12) & Enterprise ($49) plans
            </div>
          </div>

          {/* Card 3: Net Profit */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e8dfd5',
              padding: '1.5rem',
              boxShadow: '0 4px 15px -2px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6e677c', textTransform: 'uppercase' }}>
                Estimated Net Profit
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#eee7f8',
                  color: '#57339b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <TrendingUp size={16} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#57339b' }}>${stats.estimatedProfit}</span>
              <span
                style={{
                  fontSize: '0.72rem',
                  fontWeight: 700,
                  backgroundColor: '#eee7f8',
                  color: '#57339b',
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px'
                }}
              >
                {stats.profitMargin} margin
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#8b8599', marginTop: '0.4rem' }}>
              After ~${stats.estimatedExpenses}/mo hosting expenses
            </div>
          </div>

          {/* Card 4: Platform Milestones */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e8dfd5',
              padding: '1.5rem',
              boxShadow: '0 4px 15px -2px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#6e677c', textTransform: 'uppercase' }}>
                Skills & Activity
              </span>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '8px',
                  backgroundColor: '#fdf3f5',
                  color: '#cf5571',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Award size={16} />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#24202e' }}>{stats.totalSkills}</span>
              <span style={{ fontSize: '0.78rem', color: '#cf5571', fontWeight: 700 }}>
                {stats.totalGoals} goals set
              </span>
            </div>
            <div style={{ fontSize: '0.76rem', color: '#8b8599', marginTop: '0.4rem' }}>
              {stats.totalActivities} learning actions verified
            </div>
          </div>
        </div>

        {/* Charts: Revenue vs Net Profit + Plan Distribution */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '1.5rem',
            marginBottom: '2rem'
          }}
        >
          {/* Revenue vs Profit Growth Area Chart */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e8dfd5',
              padding: '1.75rem',
              boxShadow: '0 4px 15px -2px rgba(0,0,0,0.03)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#24202e' }}>
                  Revenue & Net Profit Trajectory
                </h3>
                <div style={{ fontSize: '0.78rem', color: '#6e677c', marginTop: '0.2rem' }}>
                  6-month unit economics & cashflow simulation
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.78rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#1d743a' }} />
                  <span style={{ color: '#24202e', fontWeight: 600 }}>Revenue</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#6f47b6' }} />
                  <span style={{ color: '#24202e', fontWeight: 600 }}>Net Profit</span>
                </div>
              </div>
            </div>

            <div style={{ width: '100%', height: '220px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRevWarm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#1d743a" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#1d743a" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfitWarm" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#6f47b6" stopOpacity={0.35} />
                      <stop offset="95%" stopColor="#6f47b6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#eee7de" />
                  <XAxis dataKey="month" stroke="#8b8599" tick={{ fontSize: 11 }} />
                  <YAxis stroke="#8b8599" tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderColor: '#e8dfd5', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#1d743a" strokeWidth={2.5} fillOpacity={1} fill="url(#colorRevWarm)" />
                  <Area type="monotone" dataKey="profit" stroke="#6f47b6" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProfitWarm)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Plan Distribution Chart */}
          <div
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              border: '1px solid #e8dfd5',
              padding: '1.75rem',
              boxShadow: '0 4px 15px -2px rgba(0,0,0,0.03)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: '#24202e' }}>
                Subscription Plan Tiers
              </h3>
              <div style={{ fontSize: '0.78rem', color: '#6e677c', marginTop: '0.2rem' }}>
                Active user breakdown contributing to MRR
              </div>
            </div>

            <div style={{ width: '100%', height: '150px' }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
              {planData.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.5rem 0.85rem',
                    borderRadius: '8px',
                    backgroundColor: '#faf7f2',
                    border: '1px solid #eee7de',
                    fontSize: '0.8rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: p.color }} />
                    <span style={{ color: '#24202e', fontWeight: 600 }}>{p.name}</span>
                  </div>
                  <span style={{ fontWeight: 800, color: '#57339b' }}>{p.value} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Live MongoDB Atlas User Directory Table */}
        <div
          style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1px solid #e8dfd5',
            boxShadow: '0 4px 15px -2px rgba(0,0,0,0.03)',
            overflow: 'hidden'
          }}
        >
          <div
            style={{
              padding: '1.25rem 1.75rem',
              borderBottom: '1px solid #e8dfd5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              backgroundColor: '#fdfbf7'
            }}
          >
            <div>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: '#24202e' }}>
                Registered User Directory
              </h3>
              <div style={{ fontSize: '0.76rem', color: '#6e677c' }}>
                Real-time user accounts stored in MongoDB Atlas
              </div>
            </div>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: 700,
                color: '#57339b',
                backgroundColor: '#eee7f8',
                padding: '0.25rem 0.65rem',
                borderRadius: '6px'
              }}
            >
              {metrics?.recentUsers?.length || 0} Accounts Found
            </span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#faf7f2', borderBottom: '1px solid #e8dfd5', color: '#6e677c', fontSize: '0.74rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Student / User</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Institution / Degree</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Tier</th>
                  <th style={{ padding: '0.85rem 1.5rem' }}>Joined Date</th>
                  <th style={{ padding: '0.85rem 1.5rem', textAlign: 'right' }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {(metrics?.recentUsers || []).length > 0 ? (
                  metrics.recentUsers.map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #f4eee6' }}>
                      <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: '#24202e' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                          <div
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '50%',
                              backgroundColor: '#eee7f8',
                              color: '#6f47b6',
                              fontWeight: 700,
                              fontSize: '0.78rem',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center'
                            }}
                          >
                            {u.name?.slice(0, 2).toUpperCase() || 'ST'}
                          </div>
                          <div>
                            <div>{u.name}</div>
                            <div style={{ fontSize: '0.75rem', color: '#8b8599', fontWeight: 400 }}>{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#5a5468' }}>
                        {u.institution || u.education || 'Self-Directed Learner'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem' }}>
                        <span
                          style={{
                            fontSize: '0.72rem',
                            fontWeight: 700,
                            textTransform: 'uppercase',
                            padding: '0.2rem 0.55rem',
                            borderRadius: '6px',
                            backgroundColor: u.plan === 'enterprise' ? '#fdf3f5' : '#eee7f8',
                            color: u.plan === 'enterprise' ? '#cf5571' : '#57339b',
                            border: `1px solid ${u.plan === 'enterprise' ? '#f6ccd5' : '#ddd0f1'}`
                          }}
                        >
                          {u.plan || (u.isDemo ? 'pro' : 'free')}
                        </span>
                      </td>
                      <td style={{ padding: '1rem 1.5rem', color: '#8b8599', fontSize: '0.8rem' }}>
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Active'}
                      </td>
                      <td style={{ padding: '1rem 1.5rem', textAlign: 'right' }}>
                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', color: '#1d743a', fontWeight: 700, fontSize: '0.78rem' }}>
                          <CheckCircle2 size={14} /> Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" style={{ padding: '2.5rem', textAlign: 'center', color: '#8b8599' }}>
                      No user accounts found. Seed demo user or create an account via the Register tab.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>

      <style>{`
        .spin-animation {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
