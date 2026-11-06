# Skillora – A Smart Skill Progress Portfolio (Full-Stack MERN Edition)

> **Academic Full-Stack Project: React.js + Node.js + Express.js + MongoDB + Mongoose + JWT + Vite**  
> Designed with an editorial lavender-and-cream visual identity for verified student skill tracking, authentic task-based progress calculation, goal management, streak consistency, and shareable public portfolios.

---

## 1. Project Overview

Skillora solves the primary problem found in traditional portfolio platforms: **decorative, unverifiable skill ratings**. In most portfolio builders, skills are assigned arbitrary percentages with sliders that lack proof.

In **Skillora**, skill progress is calculated strictly through **Task-Based Verification**:
$$\text{Skill Progress (\%)} = \left( \frac{\text{Number of Completed Tasks}}{\text{Total Number of Tasks}} \right) \times 100$$

When a user completes or unchecks a task, the Mongoose pre-save hook and backend REST API automatically recalculate the skill's progress, update portfolio metrics, track activity timestamps in MongoDB, and refresh streaks in real time.

---

## 2. Technology Stack

### Frontend (`client/`)
- **Framework**: React.js (v18.3)
- **Tooling & Build System**: Vite (v6.4)
- **Language**: JavaScript (ES6+ / JSX)
- **Styling**: Pure CSS3 with custom design tokens (`--bg-cream`, `--lavender-*`, `--blush-*`), editorial typography, responsive flex/grid layouts
- **HTTP Client**: Axios with JWT Bearer Token interceptors and error handling
- **Data Visualizations**: Recharts (Responsive SVG Bar Charts, Pie Charts, Line Charts)
- **Document Export**: jsPDF (Client-side styled PDF generation)
- **Data Export**: RFC 4180 compliant CSV generator with string escaping
- **Icons**: Lucide React line icon set

### Backend (`server/`)
- **Runtime Environment**: Node.js (ESM modules)
- **Web Framework**: Express.js (v4.21)
- **Database**: MongoDB (v8.2+) with persistent local data storage
- **Object Data Modeling (ODM)**: Mongoose (v8.9) with schemas, pre-save hooks, and population
- **Authentication**: JSON Web Tokens (`jsonwebtoken`) with `Bearer` header validation
- **Password Hashing**: `bcryptjs` with salt rounds
- **Middleware**: CORS, Morgan HTTP logger, JSON body parser, custom error handlers
- **Environment Management**: `dotenv`

---

## 3. Project Structure

```
Skillora/
├── package.json                 # Root script runner (concurrently running server and client)
├── README.md                    # Project documentation & viva guide
├── VIVA_QUESTIONS.md            # Comprehensive academic viva voce preparation guide
│
├── client/                      # React Frontend Application
│   ├── index.html               # HTML5 entry with Google Fonts (Plus Jakarta Sans & Playfair Display)
│   ├── package.json             # Frontend dependencies (React, Vite, Recharts, jsPDF, Axios)
│   ├── vite.config.js           # Vite bundler configuration & backend API proxy (/api)
│   ├── src/
│   │   ├── main.jsx             # React root injection with StrictMode
│   │   ├── App.jsx              # Root state orchestration & backend service integration
│   │   ├── services/            # Axios API service layer
│   │   │   ├── api.js           # Central Axios instance with Bearer token interceptors
│   │   │   ├── authService.js   # Register, Login, DemoLogin, Profile update
│   │   │   ├── skillService.js  # Skill & Task CRUD endpoints
│   │   │   ├── goalService.js   # Goal management & toggle endpoints
│   │   │   ├── analyticsService.js # Dashboard metrics & chart aggregations
│   │   │   ├── reminderService.js  # Deadline alert preferences
│   │   │   ├── portfolioService.js # Public showcase & visibility settings
│   │   │   └── migrationService.js # LocalStorage-to-MongoDB cloud sync
│   │   ├── components/          # Reusable component library
│   │   │   ├── Navbar.jsx, Sidebar.jsx, StatCard.jsx, SkillCard.jsx, SkillForm.jsx
│   │   │   ├── TaskList.jsx, TaskItem.jsx, GoalCard.jsx, GoalForm.jsx, ProgressBar.jsx
│   │   │   ├── StreakCard.jsx, ChartCard.jsx, EmptyState.jsx, ToastMessage.jsx
│   │   │   └── ConfirmationModal.jsx
│   │   ├── pages/               # Application view modules
│   │   │   ├── Landing.jsx, Auth.jsx, Dashboard.jsx, Skills.jsx, Goals.jsx
│   │   │   ├── Analytics.jsx, Profile.jsx, Portfolio.jsx, About.jsx, Contact.jsx
│   │   ├── utils/               # Client helper functions (PDF export, CSV, storage, calculations)
│   │   └── styles/              # Global variables, component styles, and page layouts
│
└── server/                      # Node.js & Express REST API Server
    ├── package.json             # Server dependencies (Express, Mongoose, JWT, bcryptjs)
    ├── .env                     # Server environment variables (PORT, MONGODB_URI, JWT_SECRET)
    ├── .env.example             # Template environment variables
    ├── data/                    # Persistent MongoDB storage directory
    └── src/
        ├── server.js            # Express server entry point, route mounting & DB seed
        ├── config/
        │   └── db.js            # Mongoose connection utility
        ├── models/              # Mongoose Data Schemas
        │   ├── User.js          # User schema with bcrypt password hashing
        │   ├── Skill.js         # Skill schema with auto-calculating progress pre-save hook
        │   ├── Goal.js          # Learning goals with priority and status
        │   ├── Activity.js      # Learning activity logging for streak calculation
        │   ├── Reminder.js      # In-app deadline threshold settings
        │   └── PortfolioSettings.js # Public portfolio visibility controls
        ├── controllers/         # Business logic & database queries
        │   ├── authController.js, skillController.js, goalController.js
        │   ├── analyticsController.js, reminderController.js
        │   ├── portfolioController.js, migrationController.js
        ├── routes/              # Express route endpoints
        ├── middleware/          # JWT protect & error handling middleware
        └── utils/
            ├── jwt.js           # Token generator
            └── seedDemo.js      # Pre-seeds demo student account (Ananya Sharma)
```

---

## 4. How to Run the Project

### Prerequisites
1. **Node.js** (v18 or higher)
2. **MongoDB** installed locally (or a free MongoDB Atlas connection URI)

### Quick Start (Both Server & Client with One Command)

From the root `Skillora/` directory:

1. **Install dependencies**:
   ```bash
   npm run install:all
   ```

2. **Ensure MongoDB is running**:
   - If using local MongoDB:
     ```powershell
     mongod --dbpath server/data/db --port 27017
     ```
   - (Or configure your cloud MongoDB Atlas URI in `server/.env`).

3. **Start the Full-Stack Application**:
   ```bash
   npm run dev
   ```

   This launches:
   - **Backend API**: `http://localhost:5000`
   - **Frontend App**: `http://localhost:5173`

---

## 5. API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new user account with hashed password |
| `POST` | `/api/auth/login` | Public | Authenticate user & receive JWT token |
| `POST` | `/api/auth/demo` | Public | 1-Click login to pre-seeded demo student workspace |
| `GET` | `/api/auth/me` | Private | Retrieve current authenticated user profile |
| `PUT` | `/api/auth/profile` | Private | Update student profile, bio, institution & links |

### Skill Management (`/api/skills`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Private | List skills with search, category & progress filter |
| `POST` | `/api/skills` | Private | Create new skill with tasks (auto calculates percentage) |
| `GET` | `/api/skills/:id` | Private | Get single skill details |
| `PUT` | `/api/skills/:id` | Private | Update skill information and tasks |
| `DELETE` | `/api/skills/:id` | Private | Delete skill and its tasks |
| `POST` | `/api/skills/:id/tasks` | Private | Add task to checklist (recalculates percentage) |
| `PATCH` | `/api/skills/:id/tasks/:taskId` | Private | Toggle task completion & log activity event |
| `DELETE` | `/api/skills/:id/tasks/:taskId` | Private | Remove task from checklist |

### Learning Goals (`/api/goals`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/goals` | Private | Retrieve all goals with overdue annotations |
| `POST` | `/api/goals` | Private | Create milestone target with deadline and priority |
| `PUT` | `/api/goals/:id` | Private | Update goal information |
| `PATCH` | `/api/goals/:id/toggle` | Private | Toggle goal status (`In Progress` $\leftrightarrow$ `Completed`) |
| `DELETE` | `/api/goals/:id` | Private | Delete learning goal |

### Analytics & Streaks (`/api/analytics`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics/dashboard` | Private | Aggregated stats: total skills, completed tasks, overall progress, streak count, category stats |
| `GET` | `/api/analytics/charts` | Private | Chart-ready data for Recharts: skill comparisons, category breakdown, 14-day activity trend |

### Public Shareable Portfolio (`/api/portfolio`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/portfolio/public/:publicId` | **Public** | Public showcase view by slug (sanitized; excludes email & internal IDs) |
| `GET` | `/api/portfolio/settings` | Private | Retrieve user's portfolio visibility preferences |
| `PUT` | `/api/portfolio/settings` | Private | Update visibility toggles and selected skills |

### LocalStorage to MongoDB Migration (`/api/migration`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/migration/import` | Private | Synchronizes browser localStorage workspace state into MongoDB database |

---

## 6. Key Full-Stack Concepts for Viva Voce

1. **How is password security enforced?**
   Passwords are never stored in plain text. When a user registers, `bcryptjs.genSalt(10)` creates a salt, and `bcrypt.hash()` produces a cryptographic one-way hash. The field is set to `select: false` in Mongoose to prevent accidental exposure in API responses.

2. **How does JWT Authentication work?**
   Upon successful login or registration, the backend signs a token containing the user's ID using `jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })`. The frontend Axios interceptor automatically attaches this token as `Authorization: Bearer <token>` for all protected requests. The `protect` middleware verifies the token and attaches `req.user`.

3. **How is skill progress calculated in the database?**
   The `Skill` Mongoose model contains a `pre('save')` hook:
   $$\text{percentage} = \text{round}\left(\frac{\text{completedTasks}}{\text{totalTasks}} \times 100\right)$$
   If total tasks is 0, percentage safely defaults to 0 and status is `'Not Started'`. When tasks equal completed tasks, status automatically becomes `'Completed'`.

4. **How does the public portfolio prevent security leaks?**
   The `/api/portfolio/public/:publicId` endpoint specifically queries using `.select()` to exclude sensitive fields such as passwords, email addresses, and internal user references. If `isPublic` is set to `false`, it returns a 404 response.

5. **How does LocalStorage migration work?**
   The application provides a 1-click cloud sync option in Profile. It takes the client-side localStorage bundle (`skills`, `goals`, `reminders`, `activityLog`) and sends it to `/api/migration/import`, which creates or merges the documents in MongoDB under the authenticated user account.

---

## 7. License & Academic Attribution
Developed as an academic software engineering project demonstrating modern full-stack MERN practices, component-driven UI design, and verified learning metrics.
