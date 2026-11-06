/**
 * Calculate progress percentage and status for a single skill based on its task list.
 * Formula: (completedTasks / totalTasks) * 100
 * Handles 0 tasks safely without NaN or division by zero.
 */
export function calculateSkillProgress(skill) {
  if (!skill || !Array.isArray(skill.tasks) || skill.tasks.length === 0) {
    return {
      totalTasks: 0,
      completedTasks: 0,
      pendingTasks: 0,
      percentage: 0,
      status: 'Not Started'
    };
  }

  const totalTasks = skill.tasks.length;
  const completedTasks = skill.tasks.filter((t) => Boolean(t.completed)).length;
  const pendingTasks = totalTasks - completedTasks;
  const percentage = Math.round((completedTasks / totalTasks) * 100);

  let status = 'In Progress';
  if (completedTasks === 0) {
    status = 'Not Started';
  } else if (completedTasks === totalTasks) {
    status = 'Completed';
  }

  return {
    totalTasks,
    completedTasks,
    pendingTasks,
    percentage,
    status
  };
}

/**
 * Calculate overall learning metrics across all skills.
 */
export function calculateOverallMetrics(skills = []) {
  let totalTasks = 0;
  let totalCompletedTasks = 0;

  skills.forEach((skill) => {
    if (Array.isArray(skill.tasks)) {
      totalTasks += skill.tasks.length;
      totalCompletedTasks += skill.tasks.filter((t) => t.completed).length;
    }
  });

  const overallProgress = totalTasks > 0 ? Math.round((totalCompletedTasks / totalTasks) * 100) : 0;
  const completedSkillsCount = skills.filter((s) => {
    const { percentage, totalTasks } = calculateSkillProgress(s);
    return totalTasks > 0 && percentage === 100;
  }).length;

  return {
    totalSkills: skills.length,
    completedSkillsCount,
    inProgressSkillsCount: skills.length - completedSkillsCount,
    totalTasks,
    totalCompletedTasks,
    totalPendingTasks: totalTasks - totalCompletedTasks,
    overallProgress
  };
}

/**
 * Summarize statistics per category.
 */
export function calculateCategoryStats(skills = []) {
  const map = {};

  skills.forEach((skill) => {
    const category = skill.category || 'Other';
    if (!map[category]) {
      map[category] = {
        category,
        count: 0,
        totalTasks: 0,
        completedTasks: 0,
        skills: []
      };
    }

    const { totalTasks, completedTasks } = calculateSkillProgress(skill);
    map[category].count += 1;
    map[category].totalTasks += totalTasks;
    map[category].completedTasks += completedTasks;
    map[category].skills.push(skill);
  });

  return Object.values(map).map((cat) => {
    const progress = cat.totalTasks > 0 ? Math.round((cat.completedTasks / cat.totalTasks) * 100) : 0;
    return {
      ...cat,
      progress
    };
  });
}

/**
 * Identify skills that need immediate user attention:
 * - Skills in progress with progress below 50%
 * - Or skills with zero completed tasks
 */
export function getSkillsNeedingAttention(skills = []) {
  return skills
    .map((skill) => ({
      ...skill,
      progressInfo: calculateSkillProgress(skill)
    }))
    .filter((item) => item.progressInfo.percentage < 50 || item.progressInfo.totalTasks === 0)
    .sort((a, b) => a.progressInfo.percentage - b.progressInfo.percentage);
}

/**
 * Filter and categorize goals by deadline (upcoming within N days, overdue, completed).
 */
export function analyzeGoalDeadlines(goals = [], withinDays = 7) {
  const now = new Date();
  const todayStr = now.toISOString().split('T')[0];
  const maxTarget = new Date(now.getTime() + withinDays * 24 * 60 * 60 * 1000);

  const upcoming = [];
  const overdue = [];
  const completed = [];
  const inProgress = [];

  goals.forEach((goal) => {
    if (goal.status === 'Completed') {
      completed.push(goal);
      return;
    }

    inProgress.push(goal);

    if (goal.targetDate) {
      const target = new Date(goal.targetDate + 'T23:59:59');
      if (target < now) {
        overdue.push(goal);
      } else if (target <= maxTarget) {
        const diffMs = target.getTime() - now.getTime();
        const daysLeft = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        upcoming.push({ ...goal, daysLeft });
      }
    }
  });

  // Sort upcoming by closest deadline first
  upcoming.sort((a, b) => new Date(a.targetDate) - new Date(b.targetDate));

  return {
    upcoming,
    overdue,
    completed,
    inProgress,
    totalGoals: goals.length
  };
}

/**
 * Format date string into readable format (e.g., "Nov 15, 2026").
 */
export function formatDate(dateString) {
  if (!dateString) return 'No date';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return dateString;
  }
}

