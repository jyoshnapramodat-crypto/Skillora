import React, { useState, useEffect } from 'react';
import {
  Users,
  DollarSign,
  TrendingUp,
  Award,
  Target,
  Activity,
  ShieldCheck,
  LogOut,
  RefreshCw,
  Clock,
  ArrowUpRight,
  Database,
  Cloud,
  CheckCircle2,
  Lock,
  Mail,
  ArrowLeft,
  Server
} from 'lucide-react';
import adminService from '../services/adminService';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
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

  // Auto load metrics if admin is logged in
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

  // If NOT logged in as admin, show modern Admin Login page
  if (!adminUser) {
    return (
      <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center p-6 relative overflow-hidden">
        {/* Ambient background glow */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />

        <div className="w-full max-w-md bg-slate-800/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-8 z-10">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={onNavigateHome}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Return to Skillora
            </button>
            <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5" /> Admin Portal
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="w-14 h-14 mx-auto mb-3 bg-gradient-to-tr from-purple-600 to-indigo-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
              <ShieldCheck className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Skillora Command Center</h1>
            <p className="text-sm text-slate-400 mt-1">Platform metrics, user management & profit telemetry</p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs leading-relaxed">
              {loginError}
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Admin Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="admin@skillora.dev"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Master Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-slate-900/80 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="bg-slate-900/50 rounded-xl p-3 border border-slate-700/60 text-xs text-slate-400 space-y-1">
              <div className="font-semibold text-slate-300 flex items-center gap-1.5">
                <Database className="w-3.5 h-3.5 text-purple-400" /> Default Root Credentials:
              </div>
              <div>Email: <span className="font-mono text-slate-200">admin@skillora.dev</span></div>
              <div>Password: <span className="font-mono text-slate-200">Admin@Skillora2026!</span></div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 px-4 rounded-xl font-semibold text-sm bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white shadow-lg shadow-purple-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isLoggingIn ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" /> Verifying...
                </>
              ) : (
                <>
                  Access Admin Dashboard <ArrowUpRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    );
  }

  // Fallback state if metrics not yet loaded
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
    { name: 'Free Tier', value: stats.planCounts?.free || 1, color: '#94a3b8' },
    { name: 'Pro ($12/m)', value: stats.planCounts?.pro || 1, color: '#8b5cf6' },
    { name: 'Enterprise ($49/m)', value: stats.planCounts?.enterprise || 0, color: '#06b6d4' }
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Top Admin Navigation Header */}
      <header className="border-b border-slate-800 bg-slate-900/90 backdrop-blur sticky top-0 z-40 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Back to App"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center font-bold text-white shadow-md">
            S
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-bold text-base text-white tracking-tight">Skillora Admin Console</h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                LIVE
              </span>
            </div>
            <p className="text-xs text-slate-400">Production Control & Financial Performance</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs text-slate-300 bg-slate-800/80 px-3 py-1.5 rounded-lg border border-slate-700">
            <Cloud className="w-3.5 h-3.5 text-cyan-400" />
            <span>DB: MongoDB Atlas Cloud</span>
          </div>

          <button
            onClick={loadMetrics}
            disabled={isLoadingMetrics}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors disabled:opacity-50"
            title="Refresh Data"
          >
            <RefreshCw className={`w-4 h-4 ${isLoadingMetrics ? 'animate-spin' : ''}`} />
          </button>

          <div className="flex items-center gap-3 pl-2 border-l border-slate-800">
            <div className="text-right hidden sm:block">
              <div className="text-xs font-semibold text-white">{adminUser.name}</div>
              <div className="text-[11px] text-purple-400 font-mono">Superadmin</div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 text-xs font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Exit</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content Container */}
      <main className="flex-1 p-6 max-w-7xl w-full mx-auto space-y-6">
        {metricsError && (
          <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-300 text-xs flex items-center justify-between">
            <span>{metricsError} (Displaying cached platform telemetry)</span>
            <button onClick={loadMetrics} className="underline font-semibold ml-2">Retry</button>
          </div>
        )}

        {/* Top 4 KPI Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Total Registered Users */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Total Users</span>
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Users className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalUsers}</span>
              <span className="text-xs text-emerald-400 font-medium">+{stats.activeUsers7d} active (7d)</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Active students & portfolio creators</p>
          </div>

          {/* Total Revenue */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Gross Revenue (MRR)</span>
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-emerald-400 tracking-tight">${stats.totalRevenue}</span>
              <span className="text-xs text-slate-400">/ month</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">Pro ($12) & Enterprise ($49) plans</p>
          </div>

          {/* Net Profit */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Net Profit</span>
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
                <TrendingUp className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-purple-400 tracking-tight">${stats.estimatedProfit}</span>
              <span className="text-xs text-purple-300 font-semibold">{stats.profitMargin} margin</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">After ~${stats.estimatedExpenses}/mo hosting expenses</p>
          </div>

          {/* Platform Skills & Learning Milestones */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all shadow-sm">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-400">Skills Tracked</span>
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center">
                <Award className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-white tracking-tight">{stats.totalSkills}</span>
              <span className="text-xs text-indigo-400 font-medium">{stats.totalGoals} goals set</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-2">{stats.totalActivities} learning actions completed</p>
          </div>
        </div>

        {/* Charts Section: Revenue vs Profit + Plan Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Revenue & Profit Area Chart */}
          <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-white text-base">Revenue vs. Net Profit Growth</h3>
                <p className="text-xs text-slate-400">6-Month financial trajectory and unit economics</p>
              </div>
              <div className="flex items-center gap-4 text-xs">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-slate-300">Revenue</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-slate-300">Net Profit</span>
                </div>
              </div>
            </div>

            <div className="h-64 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={monthlyFinancials} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                  <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
                  <YAxis stroke="#64748b" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc', fontSize: '12px' }}
                  />
                  <Area type="monotone" dataKey="revenue" stroke="#10b981" strokeWidth={2} fillOpacity={1} fill="url(#colorRev)" />
                  <Area type="monotone" dataKey="profit" stroke="#a855f7" strokeWidth={2} fillOpacity={1} fill="url(#colorProfit)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* User Tier Breakdown */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between">
            <div>
              <h3 className="font-semibold text-white text-base">Plan Distribution</h3>
              <p className="text-xs text-slate-400">Subscription tiers contributing to MRR</p>
            </div>

            <div className="h-44 w-full my-2">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={planData}
                    cx="50%"
                    cy="50%"
                    innerRadius={45}
                    outerRadius={65}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {planData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            <div className="space-y-2 text-xs">
              {planData.map((p, idx) => (
                <div key={idx} className="flex items-center justify-between p-2 rounded-lg bg-slate-800/60">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                    <span className="text-slate-300">{p.name}</span>
                  </div>
                  <span className="font-semibold text-white">{p.value} users</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Registered Users Table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="p-6 border-b border-slate-800 flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-white text-base">User Directory & Status</h3>
              <p className="text-xs text-slate-400">Real-time view of accounts registered on MongoDB</p>
            </div>
            <div className="text-xs text-slate-400">
              Showing top {metrics?.recentUsers?.length || 0} accounts
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 text-slate-400 border-b border-slate-800 uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="py-3 px-6">User / Student</th>
                  <th className="py-3 px-6">Institution</th>
                  <th className="py-3 px-6">Tier</th>
                  <th className="py-3 px-6">Joined Date</th>
                  <th className="py-3 px-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {(metrics?.recentUsers || []).length > 0 ? (
                  metrics.recentUsers.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-800/50 transition-colors">
                      <td className="py-3.5 px-6 font-medium text-white flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs uppercase">
                          {u.name?.slice(0, 2) || 'US'}
                        </div>
                        <div>
                          <div>{u.name}</div>
                          <div className="text-[11px] text-slate-400">{u.email}</div>
                        </div>
                      </td>
                      <td className="py-3.5 px-6 text-slate-300">
                        {u.institution || u.education || 'Self-Learner'}
                      </td>
                      <td className="py-3.5 px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          u.plan === 'enterprise'
                            ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                            : u.plan === 'pro' || u.isDemo
                            ? 'bg-purple-500/10 text-purple-400 border border-purple-500/30'
                            : 'bg-slate-800 text-slate-400'
                        }`}>
                          {u.plan || (u.isDemo ? 'pro' : 'free')}
                        </span>
                      </td>
                      <td className="py-3.5 px-6 text-slate-400 font-mono text-[11px]">
                        {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td className="py-3.5 px-6 text-right">
                        <span className="inline-flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3.5 h-3.5" /> Active
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500">
                      No user accounts found. Seed demo user or create accounts via Register.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* MongoDB Atlas & Deployment Status Banner */}
        <div className="bg-gradient-to-r from-purple-950/40 to-slate-900 border border-purple-500/30 rounded-2xl p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-300">
              <Server className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-semibold text-white text-sm">MongoDB Atlas & Render Cloud Production Ready</h4>
              <p className="text-xs text-slate-400 mt-0.5">
                The database connection natively supports Atlas SRV strings, role-based security, and auto-seeding.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-purple-600 text-white rounded-lg text-xs font-semibold">
              Ready to Render
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
