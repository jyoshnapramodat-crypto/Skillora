export const PREDEFINED_CATEGORIES = [
  'Web Development',
  'Programming',
  'Data Science',
  'Design',
  'Cloud & DevOps',
  'Mobile Development',
  'Artificial Intelligence',
  'Cybersecurity',
  'Database Management',
  'Soft Skills',
  'Other'
];

export const INITIAL_PROFILE = {
  name: 'Ananya Sharma',
  email: 'ananya.sharma@example.edu',
  bio: 'Final-year Computer Science undergraduate passionate about full-stack engineering, clean UI/UX systems, and practical machine learning.',
  education: 'B.Tech in Computer Science & Engineering (2023 - 2027)',
  institution: 'National Institute of Technology',
  interests: ['React.js', 'Data Structures', 'UI/UX Design', 'Full Stack Development', 'System Design'],
  linkedin: 'https://linkedin.com/in/ananya-sharma-demo',
  github: 'https://github.com/ananya-sharma-demo',
  portfolioUrl: 'https://ananya-portfolio.dev',
  avatarUrl: '',
  avatarInitials: 'AS'
};

export const INITIAL_SKILLS = [
  {
    id: 'skill-1',
    name: 'React & Modern Frontend',
    category: 'Web Development',
    description: 'Mastering component-driven user interfaces, React hooks, state management, and modern build tooling.',
    startDate: '2026-09-01',
    tasks: [
      { id: 'task-1-1', title: 'Understand JSX, Props, and component composition', completed: true, completedAt: '2026-10-15T10:00:00.000Z' },
      { id: 'task-1-2', title: 'Master useState and useEffect lifecycle patterns', completed: true, completedAt: '2026-10-22T10:00:00.000Z' },
      { id: 'task-1-3', title: 'Implement controlled forms with validation', completed: true, completedAt: '2026-11-03T10:00:00.000Z' },
      { id: 'task-1-4', title: 'Build task tracking with dynamic list rendering', completed: true, completedAt: '2026-11-05T10:00:00.000Z' },
      { id: 'task-1-5', title: 'Integrate MongoDB REST API and JWT authentication', completed: true, completedAt: '2026-11-06T10:00:00.000Z' },
      { id: 'task-1-6', title: 'Prepare for viva questions on reconciliation & virtual DOM', completed: false }
    ]
  },
  {
    id: 'skill-2',
    name: 'Data Structures & Algorithms',
    category: 'Programming',
    description: 'Solving competitive programming problems, time complexity optimization, and core algorithms.',
    startDate: '2026-08-15',
    tasks: [
      { id: 'task-2-1', title: 'Arrays, Strings and Two-Pointer technique', completed: true, completedAt: '2026-09-10T10:00:00.000Z' },
      { id: 'task-2-2', title: 'Linked Lists, Stacks, and Queues implementation', completed: true, completedAt: '2026-09-28T10:00:00.000Z' },
      { id: 'task-2-3', title: 'Binary Search and Divide & Conquer algorithms', completed: true, completedAt: '2026-11-04T10:00:00.000Z' },
      { id: 'task-2-4', title: 'Binary Trees and Depth/Breadth First Search', completed: false },
      { id: 'task-2-5', title: 'Dynamic Programming memoization & tabulation', completed: false }
    ]
  },
  {
    id: 'skill-3',
    name: 'UI/UX & Design Systems',
    category: 'Design',
    description: 'Crafting editorial lavender-and-cream design palettes, typographic hierarchy, and responsive layouts.',
    startDate: '2026-09-20',
    tasks: [
      { id: 'task-3-1', title: 'Define color tokens (lavender, cream, charcoal)', completed: true, completedAt: '2026-10-05T10:00:00.000Z' },
      { id: 'task-3-2', title: 'Establish responsive typography scale with Plus Jakarta Sans', completed: true, completedAt: '2026-10-18T10:00:00.000Z' },
      { id: 'task-3-3', title: 'Design editorial card layouts and soft shadow depth', completed: true, completedAt: '2026-10-30T10:00:00.000Z' },
      { id: 'task-3-4', title: 'Ensure WCAG AA contrast compliance for light theme', completed: true, completedAt: '2026-11-06T10:00:00.000Z' }
    ]
  },
  {
    id: 'skill-4',
    name: 'Python for Data Analysis',
    category: 'Data Science',
    description: 'Data wrangling, statistical analysis, and interactive data visualization for analytical insights.',
    startDate: '2026-10-01',
    tasks: [
      { id: 'task-4-1', title: 'NumPy vectorized arrays & broadcasting', completed: true, completedAt: '2026-10-14T10:00:00.000Z' },
      { id: 'task-4-2', title: 'Pandas DataFrames cleaning and group aggregation', completed: true, completedAt: '2026-11-02T10:00:00.000Z' },
      { id: 'task-4-3', title: 'Exploratory data analysis with Seaborn & Matplotlib', completed: false },
      { id: 'task-4-4', title: 'Build reproducible Jupyter notebook report', completed: false }
    ]
  },
  {
    id: 'skill-5',
    name: 'Node.js & MongoDB Backend Architecture',
    category: 'Web Development',
    description: 'REST API design, Mongoose schemas, JWT authentication, and secure password hashing with bcrypt.',
    startDate: '2026-10-10',
    tasks: [
      { id: 'task-5-1', title: 'Configure Express.js router & CORS middleware', completed: true, completedAt: '2026-10-25T10:00:00.000Z' },
      { id: 'task-5-2', title: 'Build Mongoose models with validation & hooks', completed: true, completedAt: '2026-11-05T10:00:00.000Z' },
      { id: 'task-5-3', title: 'Implement protected JWT routes & public endpoints', completed: true, completedAt: '2026-11-06T10:00:00.000Z' }
    ]
  }
];

export const INITIAL_GOALS = [
  {
    id: 'goal-1',
    title: 'Complete 100 LeetCode DSA Problems',
    description: 'Focus consistently on Trees, Graphs, and Dynamic Programming to prepare for technical interview rounds.',
    targetDate: '2026-11-20',
    priority: 'High',
    status: 'In Progress'
  },
  {
    id: 'goal-2',
    title: 'Deploy Full-Stack Skillora Live',
    description: 'Launch MERN stack application with Express REST API, MongoDB persistence, and responsive UI.',
    targetDate: '2026-11-12',
    priority: 'High',
    status: 'Completed',
    completedAt: '2026-11-05T10:00:00.000Z'
  },
  {
    id: 'goal-3',
    title: 'Publish Editorial Design System Spec',
    description: 'Document the lavender-cream color token architecture, typography hierarchy, and accessibility rules.',
    targetDate: '2026-11-25',
    priority: 'Medium',
    status: 'In Progress'
  },
  {
    id: 'goal-4',
    title: 'Rehearse Academic Viva Voce Defense',
    description: 'Practice explaining React props, state hooks, Express middleware, Mongoose models, and JWT flow.',
    targetDate: '2026-11-15',
    priority: 'High',
    status: 'In Progress'
  }
];

export const INITIAL_ACTIVITY_LOG = [
  {
    id: 'act-1',
    type: 'TASK_COMPLETED',
    description: 'Completed learning task milestone on 2026-11-02',
    taskTitle: 'Mastered Pandas DataFrames cleaning',
    date: '2026-11-02',
    timestamp: '2026-11-02T10:00:00.000Z'
  },
  {
    id: 'act-2',
    type: 'TASK_COMPLETED',
    description: 'Completed learning task milestone on 2026-11-03',
    taskTitle: 'Implemented controlled forms with validation',
    date: '2026-11-03',
    timestamp: '2026-11-03T10:00:00.000Z'
  },
  {
    id: 'act-3',
    type: 'TASK_COMPLETED',
    description: 'Completed learning task milestone on 2026-11-04',
    taskTitle: 'Binary Search and Divide & Conquer algorithms',
    date: '2026-11-04',
    timestamp: '2026-11-04T10:00:00.000Z'
  },
  {
    id: 'act-4',
    type: 'TASK_COMPLETED',
    description: 'Completed learning task milestone on 2026-11-05',
    taskTitle: 'Build Mongoose models with validation & hooks',
    date: '2026-11-05',
    timestamp: '2026-11-05T10:00:00.000Z'
  },
  {
    id: 'act-5',
    type: 'TASK_COMPLETED',
    description: 'Completed learning task milestone on 2026-11-06',
    taskTitle: 'Ensure WCAG AA contrast compliance for light theme',
    date: '2026-11-06',
    timestamp: '2026-11-06T10:00:00.000Z'
  }
];

export const INITIAL_REMINDER_SETTINGS = {
  enabled: true,
  frequency: 'daily',
  time: '18:00',
  customMessage: 'Time for your daily Skillora learning sprint! Keep the momentum going.'
};

