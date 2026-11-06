import React from 'react';
import {
  Layers,
  CheckCircle2,
  TrendingUp,
  Target,
  Flame,
  AlertTriangle,
  Clock,
  ArrowRight,
  ListPlus,
  Sparkles,
  Calendar,
  History,
  Award
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Cell
} from 'recharts';
import StatCard from '../components/StatCard';
import StreakCard from '../components/StreakCard';
import ProgressBar from '../components/ProgressBar';
import ChartCard from '../components/ChartCard';
import {
  calculateOverallMetrics,
  calculateSkillProgress,
  calculateCategoryStats,
  getSkillsNeedingAttention,
  analyzeGoalDeadlines,
  formatDate
} from '../utils/calculations';
import { calculateStreakStats } from '../utils/streaks';

/**
 * Dashboard page providing a comprehensive, dynamic overview of learning journey.
 * Demonstrates calculated state, component composition, and dynamic charts.
 */
export default function Dashboard({
  profile,
  skills = [],
  goals = [],
  activityLog = [],
  reminders,
  onNavigate,
  onOpenAddSkill,
  onOpenManageTasks
}) {
  const metrics = calculateOverallMetrics(skills);
  const streakStats = calculateStreakStats(activityLog);
  const categoryStats = calculateCategoryStats(skills);
  const attentionSkills = getSkillsNeedingAttention(skills).slice(0, 4);
  const goalAnalysis = analyzeGoalDeadlines(goals, reminders?.daysBeforeDeadline || 7);

  // Data for quick overview chart (top 5 skills)
  const chartData = (skills || []).slice(0, 6).map((skill) => {
    const stats = calculateSkillProgress(skill);
    const sName = skill?.name || 'Untitled';
    return {
      name: sName.length > 14 ? sName.slice(0, 14) + '...' : sName,
      fullName: sName,
      progress: stats.percentage,
      category: skill?.category || 'General'
    };
  });

  return (
    <div className="page-wrapper">
      {/* Top Welcome Banner */}
      <div className="dashboard-banner">
        <div className="banner-welcome-text">
          <div className="editorial-pill" style={{ marginBottom: '0.65rem' }}>
            <Sparkles size={12} />
            <span>Academic Skill Portfolio</span>
          </div>
          <h1 className="font-editorial">
            Welcome back, {profile?.name ? profile.name.split(' ')[0] : 'Learner'}!
          </h1>
          <p>
            Track your verified tasks, maintain consistency streaks, and monitor strategic deadlines toward your B.Tech viva and career goals.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button className="btn btn-primary" onClick={onOpenAddSkill}>
            <ListPlus size={16} /> Add Skill
          </button>
          <button className="btn btn-secondary" onClick={() => onNavigate('portfolio')}>
            View Public Portfolio <ArrowRight size={15} />
          </button>
        </div>
      </div>

      {/* In-App Reminder Banner for Upcoming Deadlines */}
      {reminders?.enabled && goalAnalysis.upcoming.length > 0 && (
        <div className="reminder-alert-strip">
          <div className="reminder-content">
            <Clock size={18} />
            <span>
              <strong>In-App Reminder:</strong> You have {goalAnalysis.upcoming.length}{' '}
              {goalAnalysis.upcoming.length === 1 ? 'goal' : 'goals'} due within the next{' '}
              {reminders.daysBeforeDeadline} days! (Closest: "{goalAnalysis.upcoming[0].title}" on{' '}
              {formatDate(goalAnalysis.upcoming[0].targetDate)})
            </span>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => onNavigate('goals')}
            style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 700 }}
          >
            Review Goals
          </button>
        </div>
      )}

      {/* Overdue Alert Banner if any */}
      {goalAnalysis.overdue.length > 0 && (
        <div
          className="reminder-alert-strip"
          style={{
            backgroundColor: 'var(--danger-bg)',
            borderColor: 'var(--danger-border)',
            color: 'var(--danger-text)'
          }}
        >
          <div className="reminder-content">
            <AlertTriangle size={18} />
            <span>
              <strong>Attention Needed:</strong> {goalAnalysis.overdue.length}{' '}
              {goalAnalysis.overdue.length === 1 ? 'goal has' : 'goals have'} passed their deadline.
            </span>
          </div>
          <button
            className="btn btn-sm"
            onClick={() => onNavigate('goals')}
            style={{ color: 'inherit', textDecoration: 'underline', fontWeight: 700 }}
          >
            Manage Overdue
          </button>
        </div>
      )}

      {/* Top 4 Stat Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Total Skills"
          value={metrics.totalSkills}
          icon={Layers}
          description={`${metrics.completedSkillsCount} completed • ${metrics.inProgressSkillsCount} in progress`}
          onClick={() => onNavigate('skills')}
        />

        <StatCard
          title="Completed Tasks"
          value={`${metrics.totalCompletedTasks} / ${metrics.totalTasks}`}
          icon={CheckCircle2}
          description="Verified units of real learning work"
          accentColor="var(--success-bg)"
          iconColor="var(--success-text)"
          onClick={() => onNavigate('skills')}
        />

        <StatCard
          title="Overall Progress"
          value={`${metrics.overallProgress}%`}
          icon={TrendingUp}
          description="Calculated from all active skill tasks"
          accentColor="var(--lavender-100)"
          iconColor="var(--lavender-700)"
          onClick={() => onNavigate('analytics')}
        />

        <StatCard
          title="Active Goals"
          value={goalAnalysis.inProgress.length}
          icon={Target}
          description={`${goalAnalysis.completed.length} goals achieved so far`}
          accentColor="var(--blush-100)"
          iconColor="var(--blush-700)"
          onClick={() => onNavigate('goals')}
        />
      </div>

      {/* 2-Column Section: Streak Card + Skill Progress Chart */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        <StreakCard activityLog={activityLog} />

        <ChartCard
          title="Skill Progress Benchmark"
          subtitle="Real completion percentages derived from task checklists"
          action={
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('analytics')}
              style={{ fontSize: '0.78rem' }}
            >
              Full Analytics <ArrowRight size={14} />
            </button>
          }
          empty={chartData.length === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={chartData} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: 'var(--text-secondary)' }} />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div
                        style={{
                          background: '#ffffff',
                          padding: '0.6rem 0.8rem',
                          borderRadius: '8px',
                          border: '1px solid var(--border-default)',
                          boxShadow: 'var(--shadow-md)',
                          fontSize: '0.82rem'
                        }}
                      >
                        <div style={{ fontWeight: 700 }}>{data.fullName}</div>
                        <div style={{ color: 'var(--lavender-700)', marginTop: '2px' }}>
                          Progress: {data.progress}% ({data.category})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.progress === 100 ? '#2ea043' : entry.progress > 50 ? '#8862cb' : '#c5b0e6'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* 2-Column Section: Skills Needing Attention + Upcoming Deadlines */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Skills Needing Attention */}
        <div className="editorial-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Skills Needing Attention</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Skills with progress under 50% or incomplete task milestones
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('skills')}
              style={{ fontSize: '0.78rem' }}
            >
              View All
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {attentionSkills.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                Awesome work! All your skills have substantial progress.
              </div>
            ) : (
              attentionSkills.map((skill) => {
                const stats = calculateSkillProgress(skill);
                return (
                  <div key={skill._id || skill.id} className="attention-card-item">
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.92rem' }}>{skill.name}</span>
                        <span className="skill-category-badge" style={{ fontSize: '0.68rem', padding: '0.1rem 0.5rem' }}>
                          {skill.category}
                        </span>
                      </div>
                      <ProgressBar percentage={stats.percentage} height="6px" />
                    </div>

                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => onOpenManageTasks(skill)}
                      style={{ padding: '0.35rem 0.65rem', fontSize: '0.76rem', flexShrink: 0 }}
                      title="Open task checklist"
                    >
                      Tasks
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Upcoming Goal Deadlines */}
        <div className="editorial-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Upcoming Milestones</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Targets scheduled for completion in the coming days
              </p>
            </div>
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => onNavigate('goals')}
              style={{ fontSize: '0.78rem' }}
            >
              All Goals
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {goalAnalysis.upcoming.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No goals approaching within {reminders?.daysBeforeDeadline || 7} days. Set a new target on the Goals page!
              </div>
            ) : (
              goalAnalysis.upcoming.slice(0, 4).map((goal) => (
                <div key={goal._id || goal.id} className="attention-card-item">
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '0.2rem' }}>
                      {goal.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span className={`priority-pill ${(goal.priority || 'medium').toLowerCase()}`}>
                        {goal.priority}
                      </span>
                      <span>Target: {formatDate(goal.targetDate)}</span>
                      <span style={{ color: 'var(--lavender-700)', fontWeight: 600 }}>
                        ({goal.daysLeft} days left)
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* 2-Column Section: Category-Wise Progress & Recent Activity Feed */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Category-Wise Progress Breakdown Summary */}
        <div className="editorial-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Domain Progress</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Completion rate aggregated by skill category
              </p>
            </div>
            <span className="editorial-pill" style={{ fontSize: '0.7rem' }}>
              {categoryStats.length} Categories
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {categoryStats.map((cat) => (
              <div
                key={cat.category}
                style={{
                  background: 'var(--bg-cream-alt)',
                  padding: '0.75rem 0.95rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border-light)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>{cat.category}</span>
                  <span style={{ fontSize: '0.78rem', color: 'var(--lavender-700)', fontWeight: 600 }}>
                    {cat.completedTasks} / {cat.totalTasks} Tasks ({cat.progress}%)
                  </span>
                </div>
                <ProgressBar percentage={cat.progress} height="6px" showPercentage={false} />
              </div>
            ))}
          </div>
        </div>

        {/* Recent Learning Activity Feed */}
        <div className="editorial-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Recent Learning Activity</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Chronological record of verified task and goal achievements
              </p>
            </div>
            <span className="editorial-pill" style={{ fontSize: '0.7rem' }}>
              {activityLog.length} Recorded
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {activityLog.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '1.75rem', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
                No learning activity logged yet. Check off items in your skills checklist to build your consistency history!
              </div>
            ) : (
              activityLog.slice(0, 5).map((act) => (
                <div key={act.id} className="attention-card-item">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', minWidth: 0, flex: 1 }}>
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '50%',
                        background: act.type === 'GOAL_COMPLETED' ? 'var(--blush-100)' : 'var(--success-bg)',
                        color: act.type === 'GOAL_COMPLETED' ? 'var(--blush-700)' : 'var(--success-text)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}
                    >
                      {act.type === 'GOAL_COMPLETED' ? <Award size={16} /> : <CheckCircle2 size={16} />}
                    </div>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <div
                        style={{
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          color: 'var(--text-primary)',
                          textOverflow: 'ellipsis',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {act.taskTitle}
                      </div>
                      <div
                        style={{
                          fontSize: '0.75rem',
                          color: 'var(--text-muted)',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.4rem',
                          marginTop: '2px'
                        }}
                      >
                        {act.skillName && (
                          <span
                            className="skill-category-badge"
                            style={{ fontSize: '0.65rem', padding: '0.05rem 0.4rem' }}
                          >
                            {act.skillName}
                          </span>
                        )}
                        <span>{formatDate(act.date || act.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

