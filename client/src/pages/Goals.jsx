import React, { useState, useMemo } from 'react';
import {
  Target,
  Plus,
  CheckCircle,
  Clock,
  AlertTriangle,
  Layers,
  Calendar
} from 'lucide-react';
import GoalCard from '../components/GoalCard';
import EmptyState from '../components/EmptyState';
import { analyzeGoalDeadlines } from '../utils/calculations';

/**
 * Learning Goals page.
 * Demonstrates Tab Filtering, Dynamic Lists, Props, and State Management.
 */
export default function Goals({
  goals = [],
  skills = [],
  onOpenAddGoal,
  onOpenEditGoal,
  onDeleteGoal,
  onToggleGoalComplete
}) {
  const [activeTab, setActiveTab] = useState('all'); // 'all' | 'in-progress' | 'completed' | 'overdue'

  // Map skillId to skillName for quick lookup
  const skillNameMap = useMemo(() => {
    const map = {};
    skills.forEach((s) => {
      map[s.id] = s.name;
    });
    return map;
  }, [skills]);

  const analysis = useMemo(() => {
    return analyzeGoalDeadlines(goals, 365);
  }, [goals]);

  // Filter goals based on active tab
  const displayedGoals = useMemo(() => {
    if (activeTab === 'in-progress') {
      return goals.filter((g) => g.status !== 'Completed');
    }
    if (activeTab === 'completed') {
      return goals.filter((g) => g.status === 'Completed');
    }
    if (activeTab === 'overdue') {
      return analysis.overdue;
    }
    return goals;
  }, [goals, activeTab, analysis]);

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className="page-header-row">
        <div>
          <h1 className="font-editorial" style={{ fontSize: '1.9rem' }}>
            Strategic Learning Goals
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem' }}>
            Set deadlines, assign priorities, and link milestones directly to your skills.
          </p>
        </div>

        <button className="btn btn-primary" onClick={onOpenAddGoal}>
          <Plus size={16} /> Create Goal
        </button>
      </div>

      {/* Tabs */}
      <div className="goal-tabs">
        <button
          className={`goal-tab-btn ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          <Target size={16} /> All Goals ({goals.length})
        </button>

        <button
          className={`goal-tab-btn ${activeTab === 'in-progress' ? 'active' : ''}`}
          onClick={() => setActiveTab('in-progress')}
        >
          <Clock size={16} /> In Progress ({analysis.inProgress.length})
        </button>

        <button
          className={`goal-tab-btn ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          <CheckCircle size={16} /> Completed ({analysis.completed.length})
        </button>

        <button
          className={`goal-tab-btn ${activeTab === 'overdue' ? 'active' : ''}`}
          onClick={() => setActiveTab('overdue')}
          style={{ color: analysis.overdue.length > 0 ? 'var(--danger-text)' : undefined }}
        >
          <AlertTriangle size={16} /> Overdue ({analysis.overdue.length})
        </button>
      </div>

      {/* Goals Grid */}
      {displayedGoals.length === 0 ? (
        <EmptyState
          icon={Target}
          title={
            activeTab === 'completed'
              ? 'No completed goals yet'
              : activeTab === 'overdue'
              ? 'No overdue goals — you are right on schedule!'
              : 'No learning goals found'
          }
          description={
            activeTab === 'completed'
              ? 'Mark tasks and goals done as you accomplish them to see them archived here.'
              : 'Add your first target deadline with priority to stay focused and consistent.'
          }
          actionLabel={activeTab !== 'overdue' ? '+ Create New Goal' : null}
          onAction={onOpenAddGoal}
        />
      ) : (
        <div className="grid-3">
          {displayedGoals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              skillName={goal.skillId ? skillNameMap[goal.skillId] : null}
              onToggleComplete={onToggleGoalComplete}
              onEdit={onOpenEditGoal}
              onDelete={onDeleteGoal}
            />
          ))}
        </div>
      )}
    </div>
  );
}

