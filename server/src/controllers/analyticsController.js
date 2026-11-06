import Skill from '../models/Skill.js';
import Goal from '../models/Goal.js';
import Activity from '../models/Activity.js';

/**
 * Helper to calculate active learning streaks from ISO date strings
 */
function calculateStreakStats(dateStrings) {
  if (!dateStrings || dateStrings.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalActiveDays: 0,
      lastActiveDate: null
    };
  }

  const uniqueDates = Array.from(new Set(dateStrings)).sort().reverse();
  const totalActiveDays = uniqueDates.length;
  const lastActiveDate = uniqueDates[0];

  const today = new Date();
  const todayStr = today.toISOString().split('T')[0];
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  // Calculate current streak
  let currentStreak = 0;
  let checkDate = null;

  if (uniqueDates.includes(todayStr)) {
    checkDate = new Date(todayStr);
  } else if (uniqueDates.includes(yesterdayStr)) {
    checkDate = new Date(yesterdayStr);
  }

  if (checkDate) {
    while (true) {
      const dStr = checkDate.toISOString().split('T')[0];
      if (uniqueDates.includes(dStr)) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  // Calculate longest streak across history
  let longestStreak = 0;
  let tempStreak = 0;
  const sortedAsc = [...uniqueDates].sort();

  for (let i = 0; i < sortedAsc.length; i++) {
    if (i === 0) {
      tempStreak = 1;
    } else {
      const prev = new Date(sortedAsc[i - 1]);
      const curr = new Date(sortedAsc[i]);
      const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        tempStreak++;
      } else if (diffDays > 1) {
        tempStreak = 1;
      }
    }
    if (tempStreak > longestStreak) {
      longestStreak = tempStreak;
    }
  }

  return {
    currentStreak,
    longestStreak: Math.max(longestStreak, currentStreak),
    totalActiveDays,
    lastActiveDate
  };
}

/**
 * @desc    Get aggregated dashboard statistics
 * @route   GET /api/analytics/dashboard
 * @access  Private
 */
export async function getDashboardStats(req, res, next) {
  try {
    const userId = req.user._id;

    // Fetch user's skills, goals, activities
    const [skills, goals, activities] = await Promise.all([
      Skill.find({ user: userId }),
      Goal.find({ user: userId }).sort({ targetDate: 1 }),
      Activity.find({ user: userId }).sort({ timestamp: -1 })
    ]);

    // Task & Progress Calculations
    const totalSkills = skills.length;
    let completedTasks = 0;
    let totalTasks = 0;

    const categoryMap = {};

    skills.forEach((skill) => {
      totalTasks += skill.totalTasks || 0;
      completedTasks += skill.completedTasks || 0;

      const cat = skill.category || 'General';
      if (!categoryMap[cat]) {
        categoryMap[cat] = {
          category: cat,
          count: 0,
          totalTasks: 0,
          completedTasks: 0,
          percentages: []
        };
      }
      categoryMap[cat].count += 1;
      categoryMap[cat].totalTasks += skill.totalTasks || 0;
      categoryMap[cat].completedTasks += skill.completedTasks || 0;
      categoryMap[cat].percentages.push(skill.percentage || 0);
    });

    const overallProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const categoryStats = Object.values(categoryMap).map((c) => ({
      category: c.category,
      count: c.count,
      totalTasks: c.totalTasks,
      completedTasks: c.completedTasks,
      avgProgress:
        c.percentages.length > 0
          ? Math.round(c.percentages.reduce((a, b) => a + b, 0) / c.percentages.length)
          : 0
    }));

    // Goal Stats
    const activeGoals = goals.filter((g) => g.status === 'In Progress');
    const completedGoals = goals.filter((g) => g.status === 'Completed');

    const todayStr = new Date().toISOString().split('T')[0];

    // Deadlines in next 7 days
    const upcomingDeadlines = activeGoals.filter((g) => {
      const diffMs = new Date(g.targetDate) - new Date(todayStr);
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    });

    // Overdue goals
    const overdueGoals = activeGoals.filter((g) => g.targetDate < todayStr);

    // Skills needing attention (percentage < 60 or 0 completed tasks, sorted lowest progress)
    const skillsNeedingAttention = [...skills]
      .filter((s) => s.percentage < 60 || s.status === 'Not Started')
      .sort((a, b) => a.percentage - b.percentage)
      .slice(0, 4);

    // Streak and consistency
    const activityDates = activities.map((a) => a.date);
    const streak = calculateStreakStats(activityDates);

    // Recent 10 activities
    const recentActivities = activities.slice(0, 10);

    return res.json({
      success: true,
      stats: {
        totalSkills,
        completedTasks,
        totalTasks,
        overallProgress,
        activeGoalsCount: activeGoals.length,
        completedGoalsCount: completedGoals.length,
        streak,
        categoryStats,
        skillsNeedingAttention,
        upcomingDeadlines,
        overdueGoals,
        recentActivities
      }
    });
  } catch (error) {
    next(error);
  }
}

/**
 * @desc    Get chart-ready data for analytics page
 * @route   GET /api/analytics/charts
 * @access  Private
 */
export async function getChartData(req, res, next) {
  try {
    const userId = req.user._id;

    const [skills, activities] = await Promise.all([
      Skill.find({ user: userId }),
      Activity.find({ user: userId })
    ]);

    // 1. Skill Progress Comparison
    const skillProgressData = skills.map((s) => ({
      name: s.name.length > 18 ? s.name.substring(0, 16) + '...' : s.name,
      fullName: s.name,
      percentage: s.percentage,
      completedTasks: s.completedTasks,
      totalTasks: s.totalTasks,
      category: s.category
    }));

    // 2. Category Distribution
    const catMap = {};
    skills.forEach((s) => {
      catMap[s.category] = (catMap[s.category] || 0) + 1;
    });
    const categoryDistribution = Object.entries(catMap).map(([name, value]) => ({
      name,
      value
    }));

    // 3. Weekly / Daily Activity Trend (Past 14 days)
    const trendDays = [];
    const now = new Date();
    for (let i = 13; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short', month: 'numeric', day: 'numeric' });
      trendDays.push({
        date: dStr,
        label: dayLabel,
        count: 0
      });
    }

    const dayCountMap = {};
    activities.forEach((act) => {
      dayCountMap[act.date] = (dayCountMap[act.date] || 0) + 1;
    });

    const activityTrend = trendDays.map((td) => ({
      ...td,
      count: dayCountMap[td.date] || 0
    }));

    return res.json({
      success: true,
      data: {
        skillProgressData,
        categoryDistribution,
        activityTrend
      }
    });
  } catch (error) {
    next(error);
  }
}

