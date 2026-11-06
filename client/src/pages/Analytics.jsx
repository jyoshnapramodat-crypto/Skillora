import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  Cell,
  Legend
} from 'recharts';
import {
  TrendingUp,
  PieChart as PieIcon,
  CheckCircle2,
  Calendar,
  Flame,
  Target,
  BarChart2
} from 'lucide-react';
import ChartCard from '../components/ChartCard';
import StatCard from '../components/StatCard';
import ProgressBar from '../components/ProgressBar';
import {
  calculateOverallMetrics,
  calculateSkillProgress,
  calculateCategoryStats,
  analyzeGoalDeadlines
} from '../utils/calculations';
import { calculateStreakStats, getWeeklyActivityView } from '../utils/streaks';

const CATEGORY_COLORS = [
  '#7053b8',
  '#cf5571',
  '#2ea043',
  '#d99126',
  '#3182ce',
  '#805ad5',
  '#dd6b20',
  '#319795',
  '#718096'
];

/**
 * Analytics page providing rich data visualization of skills, tasks, and streaks.
 * Demonstrates Recharts integration, data aggregation algorithms, and reactive updates.
 */
export default function Analytics({
  skills = [],
  goals = [],
  activityLog = []
}) {
  const metrics = calculateOverallMetrics(skills);
  const streakStats = calculateStreakStats(activityLog);
  const categoryStats = calculateCategoryStats(skills);
  const goalAnalysis = analyzeGoalDeadlines(goals, 365);
  const weeklyActivity = getWeeklyActivityView(activityLog);

  // 1. Skill-wise progress comparison data
  const skillComparisonData = (skills || []).map((s) => {
    const stats = calculateSkillProgress(s);
    const sName = s?.name || 'Untitled';
    return {
      name: sName.length > 15 ? sName.slice(0, 15) + '...' : sName,
      fullName: sName,
      progress: stats.percentage,
      category: s?.category || 'General'
    };
  });

  // 2. Category distribution data for Pie Chart
  const categoryPieData = categoryStats.map((cat) => ({
    name: cat.category,
    value: cat.count,
    progress: cat.progress
  }));

  // 3. Completed vs Pending Tasks Donut Data
  const tasksBreakdownData = [
    { name: 'Completed Tasks', value: metrics.totalCompletedTasks, color: '#2ea043' },
    { name: 'Pending Tasks', value: metrics.totalPendingTasks, color: '#ddd0f1' }
  ];

  // 4. Weekly Activity Trend Data
  const weeklyTrendData = weeklyActivity.map((day) => ({
    day: day.dayName,
    date: day.dateStr,
    tasksLogged: day.count
  }));

  // Goal completion rate
  const goalCompletionPercentage =
    goals.length > 0 ? Math.round((goalAnalysis.completed.length / goals.length) * 100) : 0;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="font-editorial" style={{ fontSize: '1.9rem' }}>
            Learning Analytics & Metrics
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Quantitative evaluation of verified tasks, domain categories, and consistency trends.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid-4" style={{ marginBottom: '1.75rem' }}>
        <StatCard
          title="Overall Completion"
          value={`${metrics.overallProgress}%`}
          icon={TrendingUp}
          description={`${metrics.totalCompletedTasks} of ${metrics.totalTasks} total tasks`}
        />

        <StatCard
          title="Consistency Streak"
          value={`${streakStats.currentStreak} Days`}
          icon={Flame}
          description={`Longest streak: ${streakStats.longestStreak} days`}
          accentColor="#ffebee"
          iconColor="#e53935"
        />

        <StatCard
          title="Goal Completion"
          value={`${goalCompletionPercentage}%`}
          icon={Target}
          description={`${goalAnalysis.completed.length} of ${goals.length} goals achieved`}
          accentColor="var(--blush-100)"
          iconColor="var(--blush-700)"
        />

        <StatCard
          title="Active Domains"
          value={categoryStats.length}
          icon={PieIcon}
          description="Categories of study tracked"
          accentColor="var(--info-bg)"
          iconColor="var(--info-text)"
        />
      </div>

      {/* Charts Grid: Skill Progress BarChart & Category Distribution PieChart */}
      <div className="grid-2" style={{ marginBottom: '1.75rem' }}>
        {/* Skill Progress BarChart */}
        <ChartCard
          title="Skill-Wise Progress Benchmark"
          subtitle="Direct comparison of calculated progress per skill"
          empty={skillComparisonData.length === 0}
        >
          <ResponsiveContainer width="100%" height={270}>
            <BarChart
              data={skillComparisonData}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 20, bottom: 10 }}
            >
              <XAxis type="number" domain={[0, 100]} unit="%" tick={{ fontSize: 11 }} />
              <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
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
                          {data.progress}% Completed ({data.category})
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar dataKey="progress" radius={[0, 4, 4, 0]}>
                {skillComparisonData.map((entry, index) => (
                  <Cell
                    key={`bar-${index}`}
                    fill={entry.progress === 100 ? '#2ea043' : '#8862cb'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Category Distribution PieChart */}
        <ChartCard
          title="Category Distribution"
          subtitle="Proportion of skills tracked by subject category"
          empty={categoryPieData.length === 0}
        >
          <ResponsiveContainer width="100%" height={270}>
            <PieChart>
              <Pie
                data={categoryPieData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={85}
                innerRadius={45}
                paddingAngle={3}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                labelLine={false}
              >
                {categoryPieData.map((entry, index) => (
                  <Cell
                    key={`pie-${index}`}
                    fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Charts Grid: Weekly Activity Trend & Tasks Breakdown */}
      <div className="grid-2">
        {/* Weekly Activity LineChart */}
        <ChartCard
          title="Weekly Learning Activity"
          subtitle="Number of tasks completed per day over the past week"
          empty={weeklyTrendData.length === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={weeklyTrendData}
              margin={{ top: 20, right: 30, left: -10, bottom: 10 }}
            >
              <XAxis dataKey="day" tick={{ fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
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
                        <div style={{ fontWeight: 700 }}>{data.date}</div>
                        <div style={{ color: 'var(--lavender-700)', marginTop: '2px' }}>
                          {data.tasksLogged} Tasks Finished
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Line
                type="monotone"
                dataKey="tasksLogged"
                stroke="#6f47b6"
                strokeWidth={3}
                dot={{ r: 5, fill: '#6f47b6' }}
                activeDot={{ r: 7 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Completed vs Pending Tasks Donut Chart */}
        <ChartCard
          title="Task Execution Status"
          subtitle="Completed vs pending tasks across entire portfolio"
          empty={metrics.totalTasks === 0}
        >
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={tasksBreakdownData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={4}
              >
                {tasksBreakdownData.map((entry, index) => (
                  <Cell key={`task-pie-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}

