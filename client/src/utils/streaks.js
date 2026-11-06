/**
 * Real streak calculations based strictly on actual activity log dates.
 * No hardcoded or randomized values.
 */

/**
 * Returns 'YYYY-MM-DD' formatted string for a given Date object in local time.
 */
export function getLocalDateString(d = new Date()) {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Calculate current streak, longest streak, and weekly activity from real activity history.
 */
export function calculateStreakStats(activityLog = []) {
  if (!Array.isArray(activityLog) || activityLog.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeToday: false,
      totalActivityDays: 0,
      recentDates: []
    };
  }

  // Filter tasks/goals completed activities and extract unique valid dates
  const uniqueDatesSet = new Set();
  activityLog.forEach((item) => {
    if (item.date) {
      uniqueDatesSet.add(item.date);
    } else if (item.timestamp) {
      uniqueDatesSet.add(item.timestamp.split('T')[0]);
    }
  });

  const sortedDates = Array.from(uniqueDatesSet).sort(); // Ascending order YYYY-MM-DD
  const totalActivityDays = sortedDates.length;

  if (totalActivityDays === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeToday: false,
      totalActivityDays: 0,
      recentDates: []
    };
  }

  // Calculate Longest Streak
  let longestStreak = 1;
  let currentRun = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const prevDate = new Date(sortedDates[i - 1] + 'T00:00:00');
    const currDate = new Date(sortedDates[i] + 'T00:00:00');
    const diffTime = currDate.getTime() - prevDate.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      currentRun += 1;
      if (currentRun > longestStreak) {
        longestStreak = currentRun;
      }
    } else if (diffDays > 1) {
      currentRun = 1;
    }
  }

  // Calculate Current Streak
  const today = new Date();
  const todayStr = getLocalDateString(today);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  const hasActivityToday = uniqueDatesSet.has(todayStr);
  const hasActivityYesterday = uniqueDatesSet.has(yesterdayStr);

  let currentStreak = 0;

  if (hasActivityToday || hasActivityYesterday) {
    // Start counting backwards from the most recent active date (either today or yesterday)
    let checkDate = hasActivityToday ? new Date(today) : new Date(yesterday);
    while (true) {
      const checkStr = getLocalDateString(checkDate);
      if (uniqueDatesSet.has(checkStr)) {
        currentStreak += 1;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }
  }

  if (currentStreak > longestStreak) {
    longestStreak = currentStreak;
  }

  return {
    currentStreak,
    longestStreak,
    activeToday: hasActivityToday,
    totalActivityDays,
    recentDates: sortedDates.slice(-7)
  };
}

/**
 * Generate a 7-day visual consistency strip (Last 7 days ending today).
 */
export function getWeeklyActivityView(activityLog = []) {
  const result = [];
  const dateCounts = {};

  activityLog.forEach((item) => {
    const d = item.date || (item.timestamp ? item.timestamp.split('T')[0] : null);
    if (d) {
      dateCounts[d] = (dateCounts[d] || 0) + 1;
    }
  });

  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const target = new Date(today);
    target.setDate(today.getDate() - i);
    const dateStr = getLocalDateString(target);
    const dayName = target.toLocaleDateString('en-US', { weekday: 'short' });
    const count = dateCounts[dateStr] || 0;

    result.push({
      dateStr,
      dayName,
      dayNumber: target.getDate(),
      count,
      isActive: count > 0,
      isToday: i === 0
    });
  }

  return result;
}

