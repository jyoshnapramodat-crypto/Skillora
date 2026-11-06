import React from 'react';
import { Flame, Award, Calendar, CheckCircle2 } from 'lucide-react';
import { calculateStreakStats, getWeeklyActivityView } from '../utils/streaks';

/**
 * StreakCard component rendering dynamic streak calculations and 7-day consistency strip.
 */
export default function StreakCard({ activityLog = [] }) {
  const streakStats = calculateStreakStats(activityLog);
  const weeklyDays = getWeeklyActivityView(activityLog);

  return (
    <div className="editorial-card streak-card">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span className="stat-card-label">Consistency Streak</span>
        <span
          className="editorial-pill"
          style={{
            background: streakStats.activeToday ? 'var(--success-bg)' : 'var(--bg-cream-alt)',
            color: streakStats.activeToday ? 'var(--success-text)' : 'var(--text-muted)',
            borderColor: streakStats.activeToday ? 'var(--success-border)' : 'var(--border-default)'
          }}
        >
          {streakStats.activeToday ? 'Active Today' : 'No tasks logged today'}
        </span>
      </div>

      <div className="streak-big-stat">
        <div className="streak-flame-icon">
          <Flame size={30} />
        </div>
        <div>
          <div style={{ fontSize: '2.2rem', fontWeight: 800, lineHeight: 1 }}>
            {streakStats.currentStreak}{' '}
            <span style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
              {streakStats.currentStreak === 1 ? 'Day' : 'Days'}
            </span>
          </div>
          <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Award size={14} color="#d99126" /> Longest streak: {streakStats.longestStreak} days
          </div>
        </div>
      </div>

      {/* 7-Day Consistency View */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
          <span>Past 7 Days Consistency</span>
          <span>{streakStats.totalActivityDays} total logged days</span>
        </div>

        <div className="weekly-strip">
          {weeklyDays.map((day) => (
            <div
              key={day.dateStr}
              className={`weekly-day-box ${day.isActive ? 'active' : ''} ${day.isToday ? 'today' : ''}`}
              title={`${day.dateStr}: ${day.count} activity items logged`}
            >
              <span style={{ fontWeight: 600, opacity: 0.85 }}>{day.dayName}</span>
              <span style={{ fontWeight: 700, fontSize: '0.85rem', margin: '2px 0' }}>
                {day.dayNumber}
              </span>
              {day.isActive ? (
                <CheckCircle2 size={12} color={day.isActive ? '#ffffff' : 'var(--lavender-600)'} />
              ) : (
                <span style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--border-default)', display: 'inline-block' }} />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

