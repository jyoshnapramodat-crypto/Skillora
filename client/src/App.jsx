import React, { useState, useEffect, useCallback } from 'react';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import SkillForm from './components/SkillForm';
import TaskList from './components/TaskList';
import GoalForm from './components/GoalForm';
import ConfirmationModal from './components/ConfirmationModal';
import ToastMessage from './components/ToastMessage';

import Landing from './pages/Landing';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Skills from './pages/Skills';
import Goals from './pages/Goals';
import Analytics from './pages/Analytics';
import Profile from './pages/Profile';
import Portfolio from './pages/Portfolio';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminDashboard from './pages/AdminDashboard';

import {
  initializeStorage,
  getActiveUser,
  setActiveUser,
  DEMO_ACCOUNT,
  authenticateUser,
  registerAccount,
  loadUserData,
  saveUserData,
  resetAllStorage
} from './utils/storage';
import { exportSkillsToCSV } from './utils/exportCSV';
import { exportPortfolioToPDF } from './utils/exportPDF';
import { getLocalDateString } from './utils/streaks';

import authService from './services/authService';
import skillService from './services/skillService';
import goalService from './services/goalService';
import reminderService from './services/reminderService';
import portfolioService from './services/portfolioService';
import migrationService from './services/migrationService';
import { getStoredToken, clearStoredToken } from './services/api';

export default function App() {
  // Navigation state (supports direct portfolio preview via ?view=portfolio or ?portfolio=slug, or admin via ?view=admin)
  const [currentPage, setCurrentPage] = useState(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('view') === 'portfolio' || params.get('portfolio')) {
      return 'portfolio';
    }
    if (params.get('view') === 'admin' || window.location.pathname === '/admin') {
      return 'admin';
    }
    return 'landing';
  });

  // Active authenticated user account
  const [currentUser, setCurrentUser] = useState(() => getActiveUser());

  // Load user-scoped data bundle
  const [userBundle, setUserBundle] = useState(() => loadUserData(currentUser?.id));

  // Extract individual state slices
  const profile = userBundle.profile;
  const skills = userBundle.skills || [];
  const customCategories = userBundle.customCategories || [];
  const goals = userBundle.goals || [];
  const activityLog = userBundle.activityLog || [];
  const reminders = userBundle.reminders;

  // Auth page mode ('login' | 'register')
  const [authMode, setAuthMode] = useState('login');

  // Mobile sidebar drawer state
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Modals state
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [activeTasksSkillId, setActiveTasksSkillId] = useState(null);

  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState(null);

  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    confirmVariant: 'danger',
    onConfirm: () => {}
  });

  // Toast notifications state
  const [toasts, setToasts] = useState([]);

  const addToast = (title, message = '', type = 'info') => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`;
    const newToast = { id, title, message, type };
    setToasts((prev) => [...prev, newToast]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  };

  const handleDismissToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Helper to update and persist user data bundle in localStorage as cache
  const updateBundle = useCallback((updater) => {
    setUserBundle((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : { ...prev, ...updater };
      saveUserData(currentUser?.id || currentUser?._id, next);
      return next;
    });
  }, [currentUser]);

  // Load full data bundle from MongoDB backend
  const loadBackendData = useCallback(async (user) => {
    try {
      const [backendSkills, backendGoals, reminderData, settingsData] = await Promise.all([
        skillService.getSkills().catch(() => []),
        goalService.getGoals().catch(() => []),
        reminderService.getReminders().catch(() => ({ settings: null })),
        portfolioService.getSettings().catch(() => null)
      ]);

      setUserBundle((prev) => {
        const next = {
          ...prev,
          profile: {
            ...prev.profile,
            name: user.name || prev.profile.name,
            email: user.email || prev.profile.email,
            bio: user.bio !== undefined ? user.bio : prev.profile.bio,
            education: user.education !== undefined ? user.education : prev.profile.education,
            institution: user.institution !== undefined ? user.institution : prev.profile.institution,
            interests: Array.isArray(user.interests) && user.interests.length > 0 ? user.interests : prev.profile.interests,
            linkedin: user.linkedin !== undefined ? user.linkedin : prev.profile.linkedin,
            github: user.github !== undefined ? user.github : prev.profile.github,
            portfolioUrl: user.portfolioUrl !== undefined ? user.portfolioUrl : prev.profile.portfolioUrl,
            avatarUrl: user.avatarUrl !== undefined ? user.avatarUrl : prev.profile.avatarUrl,
            avatarInitials: user.avatarInitials || prev.profile.avatarInitials,
            publicId: user.publicId || prev.profile.publicId,
            visibility: settingsData || prev.profile.visibility
          },
          skills: backendSkills.map((s) => ({
            id: s._id,
            _id: s._id,
            name: s.name,
            category: s.category,
            description: s.description,
            startDate: s.startDate,
            percentage: s.percentage,
            status: s.status,
            totalTasks: s.totalTasks,
            completedTasks: s.completedTasks,
            tasks: s.tasks || []
          })),
          goals: backendGoals.map((g) => ({
            id: g._id,
            _id: g._id,
            title: g.title,
            description: g.description,
            skillId: g.skillId,
            skillName: g.skillName,
            targetDate: g.targetDate,
            priority: g.priority,
            status: g.status,
            isOverdue: g.isOverdue
          })),
          reminders: reminderData?.settings || prev.reminders
        };
        saveUserData(user.id || user._id, next);
        return next;
      });
    } catch (e) {
      console.warn('[Sync] Could not load all backend datasets:', e.message);
    }
  }, []);

  // Initialize storage baseline on app boot & rehydrate backend session if JWT exists
  useEffect(() => {
    initializeStorage();

    const token = getStoredToken();
    if (token) {
      authService
        .getMe()
        .then((user) => {
          setCurrentUser(user);
          setActiveUser(user);
          loadBackendData(user);
        })
        .catch(() => {
          clearStoredToken();
        });
    }
  }, [loadBackendData]);

  // Log activity event
  const logActivity = (type, skillId, skillName, taskTitle) => {
    const today = new Date();
    const newEntry = {
      id: `act-${Date.now()}`,
      type,
      skillId,
      skillName,
      taskTitle,
      timestamp: today.toISOString(),
      date: getLocalDateString(today)
    };

    updateBundle((prev) => ({
      ...prev,
      activityLog: [newEntry, ...(prev.activityLog || [])]
    }));
  };

  // --- Authentication Handlers ---
  const handleDemoLogin = async () => {
    try {
      const res = await authService.demoLogin();
      if (res?.user) {
        setCurrentUser(res.user);
        setActiveUser(res.user);
        await loadBackendData(res.user);
        setCurrentPage('dashboard');
        addToast('Demo Workspace Ready', 'Loaded Ananya Sharma student dataset from MongoDB.', 'success');
        return;
      }
    } catch (err) {
      console.warn('Backend demo login fallback to local cache:', err.message);
    }

    // Fallback to local storage if server unreachable
    setCurrentUser(DEMO_ACCOUNT);
    setActiveUser(DEMO_ACCOUNT);
    const loaded = loadUserData(DEMO_ACCOUNT.id);
    setUserBundle(loaded);
    setCurrentPage('dashboard');
    addToast('Demo Workspace Ready', 'Loaded Ananya Sharma preloaded student dataset.', 'success');
  };

  const handleLoginSuccess = async (email, password) => {
    try {
      const res = await authService.login(email, password);
      if (res?.user) {
        setCurrentUser(res.user);
        setActiveUser(res.user);
        await loadBackendData(res.user);
        setCurrentPage('dashboard');
        addToast('Welcome Back!', `Signed in as ${res.user.name}.`, 'success');
        return { success: true };
      }
    } catch (err) {
      // Check local storage accounts for offline fallback
      const localResult = authenticateUser(email, password);
      if (localResult.success) {
        setCurrentUser(localResult.user);
        setActiveUser(localResult.user);
        const loaded = loadUserData(localResult.user.id);
        setUserBundle(loaded);
        setCurrentPage('dashboard');
        addToast('Welcome Back!', `Signed in as ${localResult.user.name} (offline cache).`, 'success');
        return { success: true };
      }
      return { success: false, message: err.message || 'Login failed. Please check your credentials.' };
    }
  };

  const handleRegisterSuccess = async (registrationData) => {
    try {
      const res = await authService.register({
        name: registrationData.name,
        email: registrationData.email,
        password: registrationData.password
      });

      if (res?.user) {
        setCurrentUser(res.user);
        setActiveUser(res.user);

        if (registrationData.education || registrationData.institution) {
          await authService.updateProfile({
            education: registrationData.education,
            institution: registrationData.institution
          });
        }

        // If preloadStarter, add a starter skill
        if (registrationData.preloadStarter) {
          try {
            await skillService.createSkill({
              name: 'Web Engineering & React Fundamentals',
              category: 'Web Development',
              description: 'Understanding components, hooks, state lifecycle, and responsive design systems.',
              tasks: [
                { id: `task-${Date.now()}-1`, title: 'Review JSX syntax and React component architecture', completed: true },
                { id: `task-${Date.now()}-2`, title: 'Build controlled forms and interactive checklists', completed: true },
                { id: `task-${Date.now()}-3`, title: 'Connect to MongoDB backend REST API and JWT auth', completed: false }
              ]
            });
          } catch (e) {
            console.warn('Starter skill preload warning:', e.message);
          }
        }

        await loadBackendData(res.user);
        setCurrentPage('dashboard');
        addToast(
          'Account Created! 🎉',
          `Welcome to Skillora, ${res.user.name}. Your full-stack workspace is active!`,
          'success'
        );
        return { success: true };
      }
    } catch (err) {
      // Local fallback
      const localResult = registerAccount(registrationData);
      if (localResult.success) {
        setCurrentUser(localResult.user);
        setActiveUser(localResult.user);
        setUserBundle({
          profile: localResult.profile,
          skills: localResult.skills,
          goals: localResult.goals,
          activityLog: localResult.activityLog,
          customCategories: localResult.customCategories,
          reminders: localResult.reminders
        });
        setCurrentPage('dashboard');
        addToast('Account Created! 🎉', `Welcome to Skillora, ${localResult.user.name}.`, 'success');
        return { success: true };
      }
      return { success: false, message: err.message || 'Registration failed. Please try again.' };
    }
  };

  const handleLogout = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Sign Out / Exit Workspace?',
      message: 'Your progress and data are safely saved. Would you like to exit to the landing page?',
      confirmText: 'Exit to Landing Page',
      confirmVariant: 'primary',
      onConfirm: () => {
        authService.logout();
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        setCurrentPage('landing');
        addToast('Logged Out', 'Returned to landing page. Your workspace data is safe.', 'info');
      }
    });
  };

  // --- Skill Management Handlers ---
  const handleOpenAddSkill = () => {
    setEditingSkill(null);
    setIsSkillModalOpen(true);
  };

  const handleOpenEditSkill = (skill) => {
    setEditingSkill(skill);
    setIsSkillModalOpen(true);
  };

  const handleSaveSkill = async (skillData) => {
    const nowISO = new Date().toISOString();

    try {
      if (editingSkill) {
        const skillId = editingSkill._id || editingSkill.id;
        const updatedSkill = await skillService.updateSkill(skillId, skillData);
        const mappedSkill = {
          ...updatedSkill,
          id: updatedSkill._id || skillId
        };
        updateBundle((prev) => ({
          ...prev,
          skills: prev.skills.map((s) => ((s._id || s.id) === skillId ? mappedSkill : s))
        }));
        addToast('Skill Updated', `"${skillData.name}" has been updated.`, 'success');
      } else {
        const createdSkill = await skillService.createSkill(skillData);
        const mappedSkill = {
          ...createdSkill,
          id: createdSkill._id
        };
        updateBundle((prev) => ({
          ...prev,
          skills: [mappedSkill, ...prev.skills]
        }));
        addToast('Skill Created', `"${mappedSkill.name}" was added to your portfolio.`, 'success');
      }
    } catch (err) {
      console.warn('API error, saving locally:', err.message);
      // Local fallback
      if (editingSkill) {
        const updated = skills.map((s) => {
          if ((s._id || s.id) === (editingSkill._id || editingSkill.id)) {
            return { ...s, ...skillData, updatedAt: nowISO };
          }
          return s;
        });
        updateBundle({ skills: updated });
        addToast('Skill Updated (Local)', `"${skillData.name}" saved in local cache.`, 'success');
      } else {
        const newSkill = {
          id: `skill-${Date.now()}`,
          ...skillData,
          createdAt: nowISO,
          updatedAt: nowISO,
          tasks: skillData.tasks || []
        };
        updateBundle({ skills: [newSkill, ...skills] });
        addToast('Skill Created (Local)', `"${newSkill.name}" added to local cache.`, 'success');
      }
    }
  };

  const handleDeleteSkill = (skill) => {
    const skillId = skill._id || skill.id;
    setConfirmModal({
      isOpen: true,
      title: 'Delete Skill?',
      message: `Are you sure you want to delete "${skill.name}"? All associated tasks and progress will be permanently removed.`,
      confirmText: 'Delete Skill',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await skillService.deleteSkill(skillId);
        } catch (e) {
          console.warn('Skill delete API warning:', e.message);
        }
        const updated = skills.filter((s) => (s._id || s.id) !== skillId);
        updateBundle({ skills: updated });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('Skill Deleted', `"${skill.name}" was removed.`, 'info');
      }
    });
  };

  const handleAddCustomCategory = (newCat) => {
    if (newCat && !customCategories.includes(newCat)) {
      updateBundle({ customCategories: [...customCategories, newCat] });
    }
  };

  // --- Task Management Handlers ---
  const activeTasksSkill = skills.find((s) => (s._id || s.id) === activeTasksSkillId) || null;

  const handleOpenManageTasks = (skill) => {
    setActiveTasksSkillId(skill._id || skill.id);
  };

  const handleAddTask = async (skillId, taskTitle) => {
    try {
      const updatedSkill = await skillService.addTask(skillId, taskTitle);
      const mapped = { ...updatedSkill, id: updatedSkill._id || skillId };
      updateBundle((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => ((s._id || s.id) === skillId ? mapped : s))
      }));
      addToast('Task Added', `Added "${taskTitle}" to checklist.`, 'success');
    } catch (err) {
      // Local fallback
      const newTask = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        completed: false
      };
      const updated = skills.map((s) => {
        if ((s._id || s.id) === skillId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            tasks: [...(s.tasks || []), newTask]
          };
        }
        return s;
      });
      updateBundle({ skills: updated });
      addToast('Task Added', `Added "${taskTitle}" to checklist.`, 'success');
    }
  };

  const handleToggleTask = async (skillId, taskId) => {
    const targetSkill = skills.find((s) => (s._id || s.id) === skillId);
    const targetTask = targetSkill?.tasks?.find((t) => t.id === taskId);
    const newCompleted = !targetTask?.completed;

    try {
      const updatedSkill = await skillService.updateTask(skillId, taskId, { completed: newCompleted });
      const mapped = { ...updatedSkill, id: updatedSkill._id || skillId };
      updateBundle((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => ((s._id || s.id) === skillId ? mapped : s))
      }));

      if (newCompleted) {
        logActivity('TASK_COMPLETED', skillId, targetSkill?.name || 'Skill', targetTask?.title || 'Task');
        addToast('Task Completed! 🎉', `"${targetTask?.title || 'Task'}" completed. Progress: ${mapped.percentage}%!`, 'success');
      } else {
        addToast('Task Marked Incomplete', `"${targetTask?.title || 'Task'}" reverted to pending.`, 'info');
      }
    } catch (err) {
      // Local fallback
      let completedState = false;
      let targetSkillName = '';
      let targetTaskTitle = '';

      const updated = skills.map((s) => {
        if ((s._id || s.id) === skillId) {
          targetSkillName = s.name;
          const newTasks = (s.tasks || []).map((t) => {
            if (t.id === taskId) {
              completedState = !t.completed;
              targetTaskTitle = t.title;
              return {
                ...t,
                completed: completedState,
                completedAt: completedState ? new Date().toISOString() : null
              };
            }
            return t;
          });
          return { ...s, updatedAt: new Date().toISOString(), tasks: newTasks };
        }
        return s;
      });

      updateBundle({ skills: updated });

      if (completedState) {
        logActivity('TASK_COMPLETED', skillId, targetSkillName, targetTaskTitle);
        addToast('Task Completed! 🎉', `"${targetTaskTitle}" finished. Streak updated!`, 'success');
      } else {
        addToast('Task Marked Incomplete', `"${targetTaskTitle}" reverted to pending.`, 'info');
      }
    }
  };

  const handleEditTask = async (skillId, taskId, newTitle) => {
    try {
      const updatedSkill = await skillService.updateTask(skillId, taskId, { title: newTitle });
      const mapped = { ...updatedSkill, id: updatedSkill._id || skillId };
      updateBundle((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => ((s._id || s.id) === skillId ? mapped : s))
      }));
      addToast('Task Updated', 'Task description saved.', 'success');
    } catch (err) {
      const updated = skills.map((s) => {
        if ((s._id || s.id) === skillId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            tasks: (s.tasks || []).map((t) => (t.id === taskId ? { ...t, title: newTitle } : t))
          };
        }
        return s;
      });
      updateBundle({ skills: updated });
      addToast('Task Updated', 'Task description saved.', 'success');
    }
  };

  const handleDeleteTask = async (skillId, taskId) => {
    try {
      const updatedSkill = await skillService.deleteTask(skillId, taskId);
      const mapped = { ...updatedSkill, id: updatedSkill._id || skillId };
      updateBundle((prev) => ({
        ...prev,
        skills: prev.skills.map((s) => ((s._id || s.id) === skillId ? mapped : s))
      }));
      addToast('Task Deleted', 'Task removed from checklist.', 'info');
    } catch (err) {
      const updated = skills.map((s) => {
        if ((s._id || s.id) === skillId) {
          return {
            ...s,
            updatedAt: new Date().toISOString(),
            tasks: (s.tasks || []).filter((t) => t.id !== taskId)
          };
        }
        return s;
      });
      updateBundle({ skills: updated });
      addToast('Task Deleted', 'Task removed from checklist.', 'info');
    }
  };

  // --- Goal Management Handlers ---
  const handleOpenAddGoal = () => {
    setEditingGoal(null);
    setIsGoalModalOpen(true);
  };

  const handleOpenEditGoal = (goal) => {
    setEditingGoal(goal);
    setIsGoalModalOpen(true);
  };

  const handleSaveGoal = async (goalData) => {
    const nowISO = new Date().toISOString();

    try {
      if (editingGoal) {
        const goalId = editingGoal._id || editingGoal.id;
        const updatedGoal = await goalService.updateGoal(goalId, goalData);
        const mapped = { ...updatedGoal, id: updatedGoal._id || goalId };
        updateBundle((prev) => ({
          ...prev,
          goals: prev.goals.map((g) => ((g._id || g.id) === goalId ? mapped : g))
        }));
        addToast('Goal Updated', `"${goalData.title}" was updated.`, 'success');
      } else {
        const createdGoal = await goalService.createGoal(goalData);
        const mapped = { ...createdGoal, id: createdGoal._id };
        updateBundle((prev) => ({
          ...prev,
          goals: [mapped, ...prev.goals]
        }));
        addToast('Goal Created', `"${mapped.title}" was added to learning targets.`, 'success');
      }
    } catch (err) {
      console.warn('Goal API error, saving locally:', err.message);
      if (editingGoal) {
        const updated = goals.map((g) => {
          if ((g._id || g.id) === (editingGoal._id || editingGoal.id)) {
            return { ...g, ...goalData, updatedAt: nowISO };
          }
          return g;
        });
        updateBundle({ goals: updated });
        addToast('Goal Updated', `"${goalData.title}" was updated.`, 'success');
      } else {
        const newGoal = {
          id: `goal-${Date.now()}`,
          ...goalData,
          createdAt: nowISO
        };
        updateBundle({ goals: [newGoal, ...goals] });
        addToast('Goal Created', `"${newGoal.title}" was added to learning targets.`, 'success');
      }
    }
  };

  const handleToggleGoalComplete = async (goalId) => {
    try {
      const updatedGoal = await goalService.toggleGoal(goalId);
      const mapped = { ...updatedGoal, id: updatedGoal._id || goalId };
      updateBundle((prev) => ({
        ...prev,
        goals: prev.goals.map((g) => ((g._id || g.id) === goalId ? mapped : g))
      }));

      if (mapped.status === 'Completed') {
        logActivity('GOAL_COMPLETED', null, 'Goal Achievement', `Completed Goal: ${mapped.title}`);
        addToast('Goal Achieved! 🏆', `Awesome! You completed "${mapped.title}".`, 'success');
      } else {
        addToast('Goal Marked Active', `"${mapped.title}" marked back in progress.`, 'info');
      }
    } catch (err) {
      let isCompletedNow = false;
      let goalTitle = '';

      const updated = goals.map((g) => {
        if ((g._id || g.id) === goalId) {
          goalTitle = g.title;
          isCompletedNow = g.status !== 'Completed';
          return {
            ...g,
            status: isCompletedNow ? 'Completed' : 'In Progress',
            completedAt: isCompletedNow ? new Date().toISOString() : null
          };
        }
        return g;
      });

      updateBundle({ goals: updated });

      if (isCompletedNow) {
        logActivity('GOAL_COMPLETED', null, 'Goal Achievement', `Completed Goal: ${goalTitle}`);
        addToast('Goal Achieved! 🏆', `Awesome! You completed "${goalTitle}".`, 'success');
      } else {
        addToast('Goal Marked Active', `"${goalTitle}" marked back in progress.`, 'info');
      }
    }
  };

  const handleDeleteGoal = (goalId) => {
    const goal = goals.find((g) => (g._id || g.id) === goalId);
    setConfirmModal({
      isOpen: true,
      title: 'Delete Learning Goal?',
      message: `Are you sure you want to delete "${goal?.title || 'this goal'}"?`,
      confirmText: 'Delete Goal',
      confirmVariant: 'danger',
      onConfirm: async () => {
        try {
          await goalService.deleteGoal(goalId);
        } catch (e) {
          console.warn('Goal delete API warning:', e.message);
        }
        const updated = goals.filter((g) => (g._id || g.id) !== goalId);
        updateBundle({ goals: updated });
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('Goal Removed', 'Learning goal deleted.', 'info');
      }
    });
  };

  // --- Reset Demo Data Handler (only for demo user) ---
  const handleResetDemoData = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Reset Demo Data?',
      message:
        'This will replace your current skills, tasks, and goals with the default realistic academic demo dataset. Are you sure you want to continue?',
      confirmText: 'Reset Demo',
      confirmVariant: 'danger',
      onConfirm: async () => {
        resetAllStorage();
        if (currentUser) {
          try {
            await authService.demoLogin();
            await loadBackendData(currentUser);
          } catch (e) {
            console.warn('Reset demo backend error:', e.message);
          }
        }
        const reloaded = loadUserData(DEMO_ACCOUNT.id);
        setUserBundle(reloaded);
        setConfirmModal((prev) => ({ ...prev, isOpen: false }));
        addToast('Demo Data Reset', 'Restored original demo workspace dataset.', 'success');
      }
    });
  };

  // --- Profile & Visibility Handlers ---
  const handleSaveProfile = async (newProfile) => {
    try {
      const updatedUser = await authService.updateProfile(newProfile);
      if (updatedUser) {
        setCurrentUser(updatedUser);
        setActiveUser(updatedUser);
      }
    } catch (e) {
      console.warn('Profile API update warning:', e.message);
    }
    updateBundle({ profile: newProfile });
    addToast('Profile Updated', 'Profile credentials saved successfully in database.', 'success');
  };

  const handleSaveReminders = async (newReminders) => {
    try {
      await reminderService.updateReminders(newReminders);
    } catch (e) {
      console.warn('Reminders API update warning:', e.message);
    }
    updateBundle({ reminders: newReminders });
    addToast('Reminder Settings Saved', `Alert threshold set to ${newReminders.daysBeforeDeadline} days before deadline.`, 'success');
  };

  const handleUpdateVisibility = async (newVisibility) => {
    try {
      await portfolioService.updateSettings(newVisibility);
    } catch (e) {
      console.warn('Portfolio settings API update warning:', e.message);
    }
    updateBundle((prev) => ({
      ...prev,
      profile: {
        ...prev.profile,
        visibility: newVisibility
      }
    }));
    addToast('Visibility Updated', 'Portfolio display preferences saved.', 'info');
  };

  // --- LocalStorage to MongoDB Migration Handler ---
  const handleMigrateLocalStorageToMongoDB = async () => {
    try {
      const payload = {
        profile,
        skills,
        goals,
        reminderSettings: reminders,
        activityDates: (activityLog || []).map((a) => a.date)
      };

      const result = await migrationService.importLocalStorageData(payload);
      if (result.success) {
        addToast(
          'MongoDB Synced! ☁️',
          result.message || 'LocalStorage workspace data safely synced to MongoDB.',
          'success'
        );
        if (currentUser) {
          await loadBackendData(currentUser);
        }
      }
    } catch (err) {
      addToast('Sync Failed', err.message || 'Failed to sync with MongoDB.', 'danger');
    }
  };

  // --- Exports ---
  const handleExportCSV = () => {
    const success = exportSkillsToCSV(skills);
    if (success) {
      addToast('CSV Downloaded', 'Skills export spreadsheet generated.', 'success');
    }
  };

  const handleExportPDF = () => {
    const success = exportPortfolioToPDF(profile, skills, goals);
    if (success) {
      addToast('PDF Portfolio Generated', 'Your verified portfolio PDF was downloaded.', 'success');
    }
  };

  // 1. Landing Page View
  if (currentPage === 'landing') {
    return (
      <>
        <Landing
          onEnterDemo={handleDemoLogin}
          onNavigateToLogin={() => {
            setAuthMode('login');
            setCurrentPage('auth');
          }}
          onNavigateToRegister={() => {
            setAuthMode('register');
            setCurrentPage('auth');
          }}
          onNavigateToAbout={() => setCurrentPage('about')}
          onNavigateToContact={() => setCurrentPage('contact')}
          onNavigateToAdmin={() => setCurrentPage('admin')}
        />
        <ToastMessage toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // 1.5. Admin Dashboard / Portal View
  if (currentPage === 'admin') {
    return (
      <>
        <AdminDashboard
          onNavigateHome={() => setCurrentPage('landing')}
          onAdminLoggedOut={() => setCurrentPage('landing')}
        />
        <ToastMessage toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // 2. Auth / Login / Create Account View
  if (currentPage === 'auth') {
    return (
      <>
        <Auth
          initialMode={authMode}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onDemoLogin={handleDemoLogin}
          onBackToHome={() => setCurrentPage('landing')}
          onNavigateToAdmin={() => setCurrentPage('admin')}
        />
        <ToastMessage toasts={toasts} onDismiss={handleDismissToast} />
      </>
    );
  }

  // 3. Workspace Application Views
  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        currentPage={currentPage}
        currentUser={currentUser}
        onNavigate={setCurrentPage}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onOpenResetModal={currentUser?.isDemo ? handleResetDemoData : null}
        onLogout={handleLogout}
      />

      <div className="main-content">
        {/* Top Navbar */}
        <Navbar
          currentPage={currentPage}
          profile={profile}
          currentUser={currentUser}
          onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          onNavigate={setCurrentPage}
          onOpenAddSkillModal={currentPage === 'skills' || currentPage === 'dashboard' ? handleOpenAddSkill : null}
          onExportCSV={handleExportCSV}
          onLogout={handleLogout}
        />

        {/* Page Routing Switch */}
        <main>
          {currentPage === 'dashboard' && (
            <Dashboard
              profile={profile}
              skills={skills}
              goals={goals}
              activityLog={activityLog}
              reminders={reminders}
              onNavigate={setCurrentPage}
              onOpenAddSkill={handleOpenAddSkill}
              onOpenManageTasks={handleOpenManageTasks}
            />
          )}

          {currentPage === 'skills' && (
            <Skills
              skills={skills}
              customCategories={customCategories}
              onOpenAddSkill={handleOpenAddSkill}
              onOpenEditSkill={handleOpenEditSkill}
              onDeleteSkill={handleDeleteSkill}
              onManageTasks={handleOpenManageTasks}
            />
          )}

          {currentPage === 'goals' && (
            <Goals
              goals={goals}
              skills={skills}
              onOpenAddGoal={handleOpenAddGoal}
              onOpenEditGoal={handleOpenEditGoal}
              onDeleteGoal={handleDeleteGoal}
              onToggleGoalComplete={handleToggleGoalComplete}
            />
          )}

          {currentPage === 'analytics' && (
            <Analytics
              skills={skills}
              goals={goals}
              activityLog={activityLog}
            />
          )}

          {currentPage === 'profile' && (
            <Profile
              profile={profile}
              reminders={reminders}
              onSaveProfile={handleSaveProfile}
              onSaveReminders={handleSaveReminders}
              onResetDemo={currentUser?.isDemo ? handleResetDemoData : null}
              onMigrateData={handleMigrateLocalStorageToMongoDB}
            />
          )}

          {currentPage === 'portfolio' && (
            <Portfolio
              profile={profile}
              skills={skills}
              goals={goals}
              activityLog={activityLog}
              onUpdateVisibility={handleUpdateVisibility}
              onExportPDF={handleExportPDF}
              onExportCSV={handleExportCSV}
            />
          )}

          {currentPage === 'about' && (
            <About onNavigateToContact={() => setCurrentPage('contact')} />
          )}

          {currentPage === 'contact' && <Contact />}
        </main>
      </div>

      {/* Modals & Dialogs */}
      <SkillForm
        isOpen={isSkillModalOpen}
        initialSkill={editingSkill}
        customCategories={customCategories}
        existingSkills={skills}
        onClose={() => setIsSkillModalOpen(false)}
        onSubmit={handleSaveSkill}
        onAddCustomCategory={handleAddCustomCategory}
      />

      <TaskList
        isOpen={Boolean(activeTasksSkillId)}
        skill={activeTasksSkill}
        onClose={() => setActiveTasksSkillId(null)}
        onAddTask={handleAddTask}
        onToggleTask={handleToggleTask}
        onEditTask={handleEditTask}
        onDeleteTask={handleDeleteTask}
      />

      <GoalForm
        isOpen={isGoalModalOpen}
        initialGoal={editingGoal}
        skills={skills}
        onClose={() => setIsGoalModalOpen(false)}
        onSubmit={handleSaveGoal}
      />

      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        title={confirmModal.title}
        message={confirmModal.message}
        confirmText={confirmModal.confirmText}
        confirmVariant={confirmModal.confirmVariant}
        onConfirm={confirmModal.onConfirm}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, isOpen: false }))}
      />

      {/* Floating Toast Feedback Notifications */}
      <ToastMessage toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}
