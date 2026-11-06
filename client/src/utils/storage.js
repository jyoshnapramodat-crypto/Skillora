import {
  INITIAL_PROFILE,
  INITIAL_SKILLS,
  INITIAL_GOALS,
  INITIAL_ACTIVITY_LOG,
  INITIAL_REMINDER_SETTINGS,
  PREDEFINED_CATEGORIES
} from '../data/sampleData.js';

const KEYS = {
  ACCOUNTS: 'skillora_accounts',
  ACTIVE_USER_ID: 'skillora_active_user_id',
  PROFILE: 'skillora_profile',
  SKILLS: 'skillora_skills',
  CUSTOM_CATEGORIES: 'skillora_custom_categories',
  GOALS: 'skillora_goals',
  ACTIVITY_LOG: 'skillora_activity_log',
  REMINDERS: 'skillora_reminders'
};

export const DEMO_ACCOUNT = {
  id: 'demo-user-1',
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.edu',
  password: 'demo123',
  education: 'B.Tech in Computer Science & Engineering (2023 - 2027)',
  institution: 'National Institute of Technology',
  isDemo: true,
  createdAt: '2026-09-01T10:00:00.000Z'
};

/**
 * Safely parse data from browser localStorage with a fallback value.
 */
export function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed !== null && parsed !== undefined ? parsed : fallback;
  } catch (error) {
    console.warn(`[Skillora] Error reading "${key}" from localStorage:`, error);
    return fallback;
  }
}

/**
 * Safely write data to browser localStorage.
 */
export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`[Skillora] Error writing "${key}" to localStorage:`, error);
  }
}

/**
 * Get user-scoped storage key
 */
function getUserKey(userId, keyName) {
  if (!userId || userId === DEMO_ACCOUNT.id) {
    return keyName;
  }
  return `${keyName}_${userId}`;
}

/**
 * Get all registered user accounts
 */
export function getAllAccounts() {
  const accounts = loadFromStorage(KEYS.ACCOUNTS, null);
  if (!accounts || !Array.isArray(accounts) || accounts.length === 0) {
    const initial = [DEMO_ACCOUNT];
    saveToStorage(KEYS.ACCOUNTS, initial);
    return initial;
  }
  // Ensure demo account always exists in list
  if (!accounts.some((acc) => acc.id === DEMO_ACCOUNT.id)) {
    accounts.unshift(DEMO_ACCOUNT);
    saveToStorage(KEYS.ACCOUNTS, accounts);
  }
  return accounts;
}

/**
 * Get the currently logged-in account
 */
export function getActiveUser() {
  const activeId = loadFromStorage(KEYS.ACTIVE_USER_ID, null);
  const accounts = getAllAccounts();
  if (activeId) {
    const found = accounts.find((a) => a.id === activeId);
    if (found) return found;
  }
  // Default to DEMO_ACCOUNT
  return DEMO_ACCOUNT;
}

/**
 * Set active user
 */
export function setActiveUser(user) {
  if (user && user.id) {
    saveToStorage(KEYS.ACTIVE_USER_ID, user.id);
  } else {
    localStorage.removeItem(KEYS.ACTIVE_USER_ID);
  }
}

/**
 * Register a new user account with isolated storage
 */
export function registerAccount({
  name,
  email,
  password,
  education = '',
  institution = '',
  preloadStarter = true
}) {
  const accounts = getAllAccounts();
  const cleanEmail = email.toLowerCase().trim();

  // Check if email already registered
  if (accounts.some((acc) => acc.email.toLowerCase() === cleanEmail)) {
    return {
      success: false,
      message: 'An account with this email address already exists. Please sign in instead.'
    };
  }

  const userId = `user-${Date.now()}`;
  const newUser = {
    id: userId,
    name: name.trim(),
    email: cleanEmail,
    password,
    education: education.trim() || 'B.Tech Student',
    institution: institution.trim() || 'University',
    isDemo: false,
    createdAt: new Date().toISOString()
  };

  // Add to accounts list
  accounts.push(newUser);
  saveToStorage(KEYS.ACCOUNTS, accounts);
  saveToStorage(KEYS.ACTIVE_USER_ID, userId);

  // Compute initials
  const initials = newUser.name
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'ST';

  // Initialize personalized profile
  const userProfile = {
    name: newUser.name,
    email: newUser.email,
    bio: `Hi, I am ${newUser.name}. Welcome to my Skillora learning portfolio!`,
    education: newUser.education,
    institution: newUser.institution,
    interests: ['Web Development', 'Problem Solving', 'Data Structures'],
    linkedin: '',
    github: '',
    portfolioUrl: '',
    avatarUrl: '',
    avatarInitials: initials,
    visibility: {
      showBio: true,
      showEducation: true,
      showSocials: true,
      showGoals: true,
      showStreaks: true,
      selectedSkillIds: []
    }
  };

  // Initial starter skills if requested
  const starterSkills = preloadStarter
    ? [
        {
          id: `skill-${Date.now()}-1`,
          name: 'Core Programming & Data Structures',
          category: 'Programming',
          description: 'Fundamental problem solving, algorithm design, and coding practice.',
          startDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tasks: [
            { id: `task-${Date.now()}-1`, title: 'Review Time and Space Complexity (Big-O)', completed: true, completedAt: new Date().toISOString() },
            { id: `task-${Date.now()}-2`, title: 'Implement Stack and Queue operations', completed: false },
            { id: `task-${Date.now()}-3`, title: 'Practice 10 LeetCode array questions', completed: false }
          ]
        },
        {
          id: `skill-${Date.now()}-2`,
          name: 'Modern Web Development',
          category: 'Web Development',
          description: 'Frontend component architectures, responsive design, and state management.',
          startDate: new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          tasks: [
            { id: `task-${Date.now()}-4`, title: 'Build interactive React components with props and useState', completed: true, completedAt: new Date().toISOString() },
            { id: `task-${Date.now()}-5`, title: 'Integrate dynamic list rendering and form validation', completed: false },
            { id: `task-${Date.now()}-6`, title: 'Deploy portfolio project to production', completed: false }
          ]
        }
      ]
    : [];

  const starterGoals = preloadStarter
    ? [
        {
          id: `goal-${Date.now()}-1`,
          title: 'Complete First Learning Project',
          description: 'Finish all core milestones and document key deliverables.',
          skillId: starterSkills[0]?.id || null,
          targetDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          priority: 'High',
          status: 'In Progress',
          createdAt: new Date().toISOString()
        }
      ]
    : [];

  const todayStr = new Date().toISOString().split('T')[0];
  const starterActivity = preloadStarter
    ? [
        {
          id: `act-${Date.now()}-1`,
          type: 'TASK_COMPLETED',
          skillId: starterSkills[0]?.id,
          skillName: starterSkills[0]?.name,
          taskTitle: 'Review Time and Space Complexity (Big-O)',
          timestamp: new Date().toISOString(),
          date: todayStr
        }
      ]
    : [];

  // Save scoped data
  saveToStorage(getUserKey(userId, KEYS.PROFILE), userProfile);
  saveToStorage(getUserKey(userId, KEYS.SKILLS), starterSkills);
  saveToStorage(getUserKey(userId, KEYS.CUSTOM_CATEGORIES), []);
  saveToStorage(getUserKey(userId, KEYS.GOALS), starterGoals);
  saveToStorage(getUserKey(userId, KEYS.ACTIVITY_LOG), starterActivity);
  saveToStorage(getUserKey(userId, KEYS.REMINDERS), INITIAL_REMINDER_SETTINGS);

  return {
    success: true,
    user: newUser,
    profile: userProfile,
    skills: starterSkills,
    goals: starterGoals,
    activityLog: starterActivity,
    customCategories: [],
    reminders: INITIAL_REMINDER_SETTINGS
  };
}

/**
 * Authenticate existing user with email and password
 */
export function authenticateUser(email, password) {
  const accounts = getAllAccounts();
  const cleanEmail = email.toLowerCase().trim();

  const user = accounts.find((acc) => acc.email.toLowerCase() === cleanEmail);
  if (!user) {
    return {
      success: false,
      message: 'No account found with this email address. Please check your spelling or create a new account.'
    };
  }

  if (user.password !== password) {
    return {
      success: false,
      message: 'Incorrect password. Please try again or use the Demo Student login.'
    };
  }

  saveToStorage(KEYS.ACTIVE_USER_ID, user.id);
  return {
    success: true,
    user
  };
}

/**
 * Load user-specific data bundle for the given user ID
 */
export function loadUserData(userId) {
  const isDemo = !userId || userId === DEMO_ACCOUNT.id;

  if (isDemo) {
    return {
      profile: loadFromStorage(KEYS.PROFILE, INITIAL_PROFILE),
      skills: loadFromStorage(KEYS.SKILLS, INITIAL_SKILLS),
      customCategories: loadFromStorage(KEYS.CUSTOM_CATEGORIES, []),
      goals: loadFromStorage(KEYS.GOALS, INITIAL_GOALS),
      activityLog: loadFromStorage(KEYS.ACTIVITY_LOG, INITIAL_ACTIVITY_LOG),
      reminders: loadFromStorage(KEYS.REMINDERS, INITIAL_REMINDER_SETTINGS)
    };
  }

  return {
    profile: loadFromStorage(getUserKey(userId, KEYS.PROFILE), INITIAL_PROFILE),
    skills: loadFromStorage(getUserKey(userId, KEYS.SKILLS), []),
    customCategories: loadFromStorage(getUserKey(userId, KEYS.CUSTOM_CATEGORIES), []),
    goals: loadFromStorage(getUserKey(userId, KEYS.GOALS), []),
    activityLog: loadFromStorage(getUserKey(userId, KEYS.ACTIVITY_LOG), []),
    reminders: loadFromStorage(getUserKey(userId, KEYS.REMINDERS), INITIAL_REMINDER_SETTINGS)
  };
}

/**
 * Save user-specific data bundle
 */
export function saveUserData(userId, { profile, skills, customCategories, goals, activityLog, reminders }) {
  const isDemo = !userId || userId === DEMO_ACCOUNT.id;

  if (isDemo) {
    if (profile !== undefined) saveToStorage(KEYS.PROFILE, profile);
    if (skills !== undefined) saveToStorage(KEYS.SKILLS, skills);
    if (customCategories !== undefined) saveToStorage(KEYS.CUSTOM_CATEGORIES, customCategories);
    if (goals !== undefined) saveToStorage(KEYS.GOALS, goals);
    if (activityLog !== undefined) saveToStorage(KEYS.ACTIVITY_LOG, activityLog);
    if (reminders !== undefined) saveToStorage(KEYS.REMINDERS, reminders);
  } else {
    if (profile !== undefined) saveToStorage(getUserKey(userId, KEYS.PROFILE), profile);
    if (skills !== undefined) saveToStorage(getUserKey(userId, KEYS.SKILLS), skills);
    if (customCategories !== undefined) saveToStorage(getUserKey(userId, KEYS.CUSTOM_CATEGORIES), customCategories);
    if (goals !== undefined) saveToStorage(getUserKey(userId, KEYS.GOALS), goals);
    if (activityLog !== undefined) saveToStorage(getUserKey(userId, KEYS.ACTIVITY_LOG), activityLog);
    if (reminders !== undefined) saveToStorage(getUserKey(userId, KEYS.REMINDERS), reminders);
  }
}

/**
 * Initialize storage with default demo dataset if not already present.
 */
export function initializeStorage() {
  getAllAccounts();

  const profile = loadFromStorage(KEYS.PROFILE, null);
  if (!profile) {
    saveToStorage(KEYS.PROFILE, INITIAL_PROFILE);
  }

  const skills = loadFromStorage(KEYS.SKILLS, null);
  if (!skills) {
    saveToStorage(KEYS.SKILLS, INITIAL_SKILLS);
  }

  const customCategories = loadFromStorage(KEYS.CUSTOM_CATEGORIES, null);
  if (!customCategories) {
    saveToStorage(KEYS.CUSTOM_CATEGORIES, []);
  }

  const goals = loadFromStorage(KEYS.GOALS, null);
  if (!goals) {
    saveToStorage(KEYS.GOALS, INITIAL_GOALS);
  }

  const activityLog = loadFromStorage(KEYS.ACTIVITY_LOG, null);
  if (!activityLog) {
    saveToStorage(KEYS.ACTIVITY_LOG, INITIAL_ACTIVITY_LOG);
  }

  const reminders = loadFromStorage(KEYS.REMINDERS, null);
  if (!reminders) {
    saveToStorage(KEYS.REMINDERS, INITIAL_REMINDER_SETTINGS);
  }
}

/**
 * Reset all Skillora keys in localStorage back to realistic sample demo data.
 */
export function resetAllStorage() {
  saveToStorage(KEYS.PROFILE, INITIAL_PROFILE);
  saveToStorage(KEYS.SKILLS, INITIAL_SKILLS);
  saveToStorage(KEYS.CUSTOM_CATEGORIES, []);
  saveToStorage(KEYS.GOALS, INITIAL_GOALS);
  saveToStorage(KEYS.ACTIVITY_LOG, INITIAL_ACTIVITY_LOG);
  saveToStorage(KEYS.REMINDERS, INITIAL_REMINDER_SETTINGS);
}

export { KEYS, getUserKey };
