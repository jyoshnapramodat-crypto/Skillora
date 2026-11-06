import User from '../models/User.js';
import Skill from '../models/Skill.js';
import Goal from '../models/Goal.js';
import Activity from '../models/Activity.js';
import Reminder from '../models/Reminder.js';
import PortfolioSettings from '../models/PortfolioSettings.js';

export const DEMO_USER_DATA = {
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.edu',
  password: 'demo123',
  education: 'B.Tech in Computer Science & Engineering (2023 - 2027)',
  institution: 'National Institute of Technology',
  bio: 'Final-year Computer Science undergraduate passionate about full-stack engineering, clean UI/UX systems, and practical machine learning.',
  interests: ['React.js', 'Data Structures', 'UI/UX Design', 'Full Stack Development', 'System Design'],
  linkedin: 'https://linkedin.com/in/ananya-sharma-demo',
  github: 'https://github.com/ananya-sharma-demo',
  portfolioUrl: 'https://ananya-portfolio.dev',
  avatarUrl: '',
  avatarInitials: 'AS',
  publicId: 'ananya-sharma',
  isDemo: true
};

export const INITIAL_SKILLS_DATA = [
  {
    name: 'React & Modern Frontend',
    category: 'Web Development',
    description: 'Mastering component-driven user interfaces, React hooks, state management, and modern build tooling.',
    startDate: '2026-09-01',
    tasks: [
      { id: 'task-1-1', title: 'Understand JSX, Props, and component composition', completed: true, completedAt: new Date('2026-10-15') },
      { id: 'task-1-2', title: 'Master useState and useEffect lifecycle patterns', completed: true, completedAt: new Date('2026-10-22') },
      { id: 'task-1-3', title: 'Implement controlled forms with validation', completed: true, completedAt: new Date('2026-11-03') },
      { id: 'task-1-4', title: 'Build task tracking with dynamic list rendering', completed: true, completedAt: new Date('2026-11-05') },
      { id: 'task-1-5', title: 'Integrate MongoDB REST API and JWT authentication', completed: true, completedAt: new Date('2026-11-06') },
      { id: 'task-1-6', title: 'Prepare for viva questions on reconciliation & virtual DOM', completed: false }
    ]
  },
  {
    name: 'Data Structures & Algorithms',
    category: 'Programming',
    description: 'Solving competitive programming problems, time complexity optimization, and core algorithms.',
    startDate: '2026-08-15',
    tasks: [
      { id: 'task-2-1', title: 'Arrays, Strings and Two-Pointer technique', completed: true, completedAt: new Date('2026-09-10') },
      { id: 'task-2-2', title: 'Linked Lists, Stacks, and Queues implementation', completed: true, completedAt: new Date('2026-09-28') },
      { id: 'task-2-3', title: 'Binary Search and Divide & Conquer algorithms', completed: true, completedAt: new Date('2026-11-04') },
      { id: 'task-2-4', title: 'Binary Trees and Depth/Breadth First Search', completed: false },
      { id: 'task-2-5', title: 'Dynamic Programming memoization & tabulation', completed: false }
    ]
  },
  {
    name: 'UI/UX & Design Systems',
    category: 'Design',
    description: 'Crafting editorial lavender-and-cream design palettes, typographic hierarchy, and responsive layouts.',
    startDate: '2026-09-20',
    tasks: [
      { id: 'task-3-1', title: 'Define color tokens (lavender, cream, charcoal)', completed: true, completedAt: new Date('2026-10-05') },
      { id: 'task-3-2', title: 'Establish responsive typography scale with Plus Jakarta Sans', completed: true, completedAt: new Date('2026-10-18') },
      { id: 'task-3-3', title: 'Design editorial card layouts and soft shadow depth', completed: true, completedAt: new Date('2026-10-30') },
      { id: 'task-3-4', title: 'Ensure WCAG AA contrast compliance for light theme', completed: true, completedAt: new Date('2026-11-06') }
    ]
  },
  {
    name: 'Python for Data Analysis',
    category: 'Data Science',
    description: 'Data wrangling, statistical analysis, and interactive data visualization for analytical insights.',
    startDate: '2026-10-01',
    tasks: [
      { id: 'task-4-1', title: 'NumPy vectorized arrays & broadcasting', completed: true, completedAt: new Date('2026-10-14') },
      { id: 'task-4-2', title: 'Pandas DataFrames cleaning and group aggregation', completed: true, completedAt: new Date('2026-11-02') },
      { id: 'task-4-3', title: 'Exploratory data analysis with Seaborn & Matplotlib', completed: false },
      { id: 'task-4-4', title: 'Build reproducible Jupyter notebook report', completed: false }
    ]
  },
  {
    name: 'Node.js & MongoDB Backend Architecture',
    category: 'Web Development',
    description: 'REST API design, Mongoose schemas, JWT authentication, and secure password hashing with bcrypt.',
    startDate: '2026-10-10',
    tasks: [
      { id: 'task-5-1', title: 'Configure Express.js router & CORS middleware', completed: true, completedAt: new Date('2026-10-25') },
      { id: 'task-5-2', title: 'Build Mongoose models with validation & hooks', completed: true, completedAt: new Date('2026-11-05') },
      { id: 'task-5-3', title: 'Implement protected JWT routes & public endpoints', completed: true, completedAt: new Date('2026-11-06') }
    ]
  }
];

export const INITIAL_GOALS_DATA = [
  {
    title: 'Complete 100 LeetCode DSA Problems',
    description: 'Focus consistently on Trees, Graphs, and Dynamic Programming to prepare for technical interview rounds.',
    targetDate: '2026-11-20',
    priority: 'High',
    status: 'In Progress'
  },
  {
    title: 'Deploy Full-Stack Skillora Live',
    description: 'Launch MERN stack application with Express REST API, MongoDB persistence, and responsive UI.',
    targetDate: '2026-11-12',
    priority: 'High',
    status: 'Completed',
    completedAt: new Date('2026-11-05')
  },
  {
    title: 'Publish Editorial Design System Spec',
    description: 'Document the lavender-cream color token architecture, typography hierarchy, and accessibility rules.',
    targetDate: '2026-11-25',
    priority: 'Medium',
    status: 'In Progress'
  },
  {
    title: 'Rehearse Academic Viva Voce Defense',
    description: 'Practice explaining React props, state hooks, Express middleware, Mongoose models, and JWT flow.',
    targetDate: '2026-11-15',
    priority: 'High',
    status: 'In Progress'
  }
];

/**
 * Seed or verify Demo Student account in MongoDB
 */
export async function seedDemoUser() {
  try {
    let demoUser = await User.findOne({ email: DEMO_USER_DATA.email }).select('+password');

    if (!demoUser) {
      console.log('[Seed] Seeding Demo Student Account (Ananya Sharma)...');
      demoUser = await User.create(DEMO_USER_DATA);

      // Seed Skills
      for (const skillItem of INITIAL_SKILLS_DATA) {
        await Skill.create({
          user: demoUser._id,
          ...skillItem
        });
      }

      // Seed Goals
      for (const goalItem of INITIAL_GOALS_DATA) {
        await Goal.create({
          user: demoUser._id,
          ...goalItem
        });
      }

      // Seed Activity Log
      const dates = ['2026-11-02', '2026-11-03', '2026-11-04', '2026-11-05', '2026-11-06'];
      for (let i = 0; i < dates.length; i++) {
        await Activity.create({
          user: demoUser._id,
          type: 'TASK_COMPLETED',
          description: `Completed learning task milestone on ${dates[i]}`,
          taskTitle: `Verified milestone step #${i + 1}`,
          date: dates[i],
          timestamp: new Date(`${dates[i]}T10:00:00Z`)
        });
      }

      // Seed Reminder Settings
      await Reminder.create({
        user: demoUser._id,
        enabled: true,
        daysBeforeDeadline: 5,
        showDashboardBanner: true
      });

      // Seed Portfolio Settings
      await PortfolioSettings.create({
        user: demoUser._id,
        publicId: demoUser.publicId,
        isPublic: true,
        showBio: true,
        showEducation: true,
        showSocials: true,
        showGoals: true,
        showStreaks: true,
        selectedSkillIds: []
      });

      console.log('[Seed] Demo Student Account seeded successfully into MongoDB!');
    }

    return demoUser;
  } catch (error) {
    console.error('[Seed] Error in seedDemoUser:', error.message);
  }
}

