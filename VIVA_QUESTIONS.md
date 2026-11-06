# Skillora – Academic Viva Voce Preparation Guide (25 Questions & Answers)

This guide contains the most probable questions external examiners and faculty ask during a B.Tech practical examination and project viva defense, along with precise technical answers referencing the **Skillora** codebase.

---

## Part 1: Core React Concepts in Skillora

### Q1: What is the Virtual DOM and how does React update the UI in Skillora?
**Answer:**  
The Virtual DOM (VDOM) is a lightweight, in-memory representation of the real DOM. When state changes in Skillora (for example, when a user checks off a task in `TaskList.jsx`), React creates a new VDOM tree and compares it with the previous VDOM tree using a process called **Reconciliation** (driven by the Diffing Algorithm). React calculates the minimal set of changes needed and efficiently batches updates to the real DOM, avoiding expensive full-page re-renders.

### Q2: How does Skillora demonstrate the concept of "Props"?
**Answer:**  
Props (properties) allow parent components to pass data and event callbacks down to child components.
- In `SkillCard.jsx`, props like `skill`, `onManageTasks`, `onEditSkill`, and `onDeleteSkill` are passed from the parent `Skills.jsx` page.
- In `ProgressBar.jsx`, `percentage`, `height`, and `label` are passed as props to render customized progress bars across the Dashboard, Skills, and Portfolio views.
- Props are strictly read-only (immutable) for the child component.

### Q3: What is State, and how is `useState` utilized across Skillora?
**Answer:**  
State represents data that changes over time based on user interactions. We use the `useState` hook for:
- Form inputs (`name`, `category`, `description` in `SkillForm.jsx`).
- Filtering and search parameters (`searchQuery`, `selectedCategory`, `progressFilter`, `sortBy` in `Skills.jsx`).
- Modal visibility controls (`isSkillModalOpen`, `activeTasksSkillId`, `confirmModal` in `App.jsx`).
- Primary application datasets (`skills`, `goals`, `profile`, `activityLog`) in `App.jsx`.

### Q4: Why is state lifted up to `App.jsx` instead of keeping it in individual pages?
**Answer:**  
This is the principle of **Lifting State Up**. Multiple pages share the same data:
- The **Dashboard** needs the skills array to calculate overall progress and display skills needing attention.
- The **Skills** page needs to edit and delete skills.
- The **Analytics** page uses the skills array to generate Recharts graphs.
- The **Portfolio** page reads the skills array to export PDF and CSV files.  
By keeping `skills`, `goals`, and `profile` in `App.jsx`, state acts as a **single source of truth** across the whole application.

### Q5: How are dynamic lists rendered, and why is the `key` prop essential?
**Answer:**  
Dynamic lists are rendered using JavaScript's `.map()` method (e.g. `skills.map(skill => <SkillCard key={skill.id} ... />)`).  
The `key` prop gives each item a stable identity. During reconciliation, React uses the `key` to identify which items were added, modified, or removed. Using stable IDs (like `skill.id`) rather than array indices prevents rendering bugs when items are deleted or sorted.

### Q6: What are Controlled Components, and where are they implemented?
**Answer:**  
A controlled component is an input element whose value is controlled by React state rather than the DOM. Skillora implements controlled components in `SkillForm.jsx`, `GoalForm.jsx`, `Profile.jsx`, `Contact.jsx`, and `TaskList.jsx`:
```jsx
<input
  type="text"
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```
Every keystroke updates state, enabling instant validation, error messages, and disabled submit states.

### Q7: How does Skillora implement Conditional Rendering?
**Answer:**  
Conditional rendering is used to display different UI states based on conditions:
1. **Empty States**: If `filteredSkills.length === 0`, `<EmptyState />` is rendered instead of the grid.
2. **Modals & Overlays**: `isOpen && <Modal ... />` ensures modals only mount when active.
3. **In-App Reminders**: Renders deadline warning banners only when `reminders.enabled` is true and upcoming deadlines exist.
4. **Status Pills**: Renders green for "Completed", lavender for "In Progress", and grey for "Not Started".

### Q8: What role does the `useEffect` hook play in Skillora?
**Answer:**  
`useEffect` handles side effects such as data synchronization and lifecycle events:
- In `App.jsx`, `useEffect` listens to state changes on `skills`, `goals`, and `profile` and automatically writes the updated state to browser `localStorage`.
- In `SkillForm.jsx` and `GoalForm.jsx`, `useEffect` resets or pre-populates form inputs whenever the `initialSkill` or `isOpen` props change.

---

## Part 2: Architecture & Calculations

### Q9: What is the formula for calculating skill progress in Skillora?
**Answer:**  
$$\text{Progress (\%)} = \left( \frac{\text{Completed Tasks}}{\text{Total Tasks}} \right) \times 100$$
If `totalTasks === 0`, the function safely returns `0%` and status `"Not Started"`, eliminating `NaN` and division-by-zero errors.

### Q10: Why is progress calculated dynamically instead of being stored as a fixed percentage?
**Answer:**  
Storing a static percentage in state would introduce data redundancy and state synchronization issues (an anti-pattern). If a user adds, toggles, or deletes a task, storing a static percentage would require manually updating both the task list and the percentage. By deriving progress dynamically via `calculateSkillProgress(skill)`, the value is always mathematically guaranteed to match the task list.

### Q11: How does Skillora calculate learning streaks without random numbers?
**Answer:**  
In `src/utils/streaks.js`:
1. When a task is checked off, a log entry is created with the current local date (`YYYY-MM-DD`).
2. Unique dates are extracted and sorted chronologically.
3. The algorithm checks if today or yesterday contains activity.
4. It iterates backwards in time day by day. As long as consecutive dates exist, `currentStreak` increments.
5. The `longestStreak` is computed by finding the longest contiguous chain of consecutive calendar days across the entire dataset.

### Q12: How is data persisted across browser refreshes without a backend server?
**Answer:**  
Skillora uses the browser's `localStorage` Web API.
- Data is converted to a string using `JSON.stringify(value)` before saving.
- On application boot, `loadFromStorage(key, fallback)` parses data using `JSON.parse(raw)`.
- A `try/catch` block protects the application against corrupted JSON or restricted storage environments, falling back gracefully to the sample dataset.

### Q13: What happens if a user accidentally deletes their demo data or wants to restart?
**Answer:**  
Skillora includes a **"Reset Demo Data"** action in the sidebar. Clicking it opens a `ConfirmationModal`. Upon confirmation, `resetAllStorage()` restores the initial realistic student dataset (`INITIAL_SKILLS`, `INITIAL_GOALS`, `INITIAL_PROFILE`) and notifies the user with a toast message.

---

## Part 3: Advanced Libraries & Features

### Q14: Which library is used for analytics and why?
**Answer:**  
**Recharts** is used because:
- It is a declarative, component-based charting library built specifically for React.
- It renders pure SVG elements that scale smoothly across mobile and desktop screens.
- It seamlessly integrates with React state for dynamic tooltips, animations, and color cell mapping.

### Q15: How does the PDF Export feature work?
**Answer:**  
In `src/utils/exportPDF.js`, we use **jsPDF**:
- We instantiate `new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })`.
- We draw branding header banners, student profile details, verified skills, and visual progress bars (`doc.roundedRect`).
- An `ensureSpace(neededHeight)` helper checks remaining vertical space and triggers `doc.addPage()` to prevent cutoffs.
- Finally, `doc.save(...)` triggers a direct client-side download without contacting any server.

### Q16: How is CSV export handled, and why is escaping necessary?
**Answer:**  
In `src/utils/exportCSV.js`, skills and task progress are compiled into comma-separated values following RFC 4180. Escaping is necessary because descriptions or skill names may contain commas, double quotes, or newlines. If unescaped, a comma inside a description would split that text into an unintended column, corrupting the spreadsheet.

### Q17: What is the purpose of the Public Shareable Portfolio?
**Answer:**  
The portfolio page (`Portfolio.jsx`) allows students to showcase their verified achievements. It includes a **Visibility Customizer** where the user can toggle which sections (Bio, Education, Goals, Streaks) and which specific skills appear. It also features a "Copy Share Link" button that copies the local demo link (`?view=portfolio`).

---

## Part 4: Code Quality & Performance

### Q18: What is the difference between synthetic events and native events in React?
**Answer:**  
In Skillora, event handlers like `onClick={(e) => ...}` receive a React **SyntheticEvent**. SyntheticEvent is a cross-browser wrapper around the browser's native DOM event. It provides a consistent interface across different browsers and improves memory performance by utilizing event delegation on the root container.

### Q19: Why was Vite chosen over Create React App (CRA)?
**Answer:**  
- **Vite** leverages native ES modules (ESM) in the browser during development, offering near-instant cold start times.
- **Rollup** handles production bundling with optimized code splitting (as configured in our `vite.config.js`).
- Create React App is officially deprecated and relies on slower Webpack bundling with heavy configuration overhead.

### Q20: How are bundle chunk sizes optimized in `vite.config.js`?
**Answer:**  
In `vite.config.js`, we configured Rollup `manualChunks`:
```javascript
manualChunks(id) {
  if (id.includes('node_modules')) {
    if (id.includes('recharts')) return 'charts';
    if (id.includes('jspdf') || id.includes('html2canvas')) return 'pdf';
    if (id.includes('lucide-react')) return 'icons';
    return 'vendor';
  }
}
```
This isolates heavy third-party libraries (Recharts, jsPDF) into separate cacheable chunks, keeping the main application bundle lightweight.

### Q21: What are the main limitations of this pure frontend application?
**Answer:**  
1. **Device Isolation**: Data stored in `localStorage` stays in that specific browser; it does not automatically sync to other devices.
2. **In-App Only Reminders**: Reminders trigger while the tab is open; there are no background push notification servers.
3. **Local Share Links**: The "Copy Share Link" runs on the local origin; it requires web hosting (e.g. Vercel or Netlify) to be accessed publicly.

### Q22: How does Skillora prevent memory leaks with toast messages?
**Answer:**  
Toasts use `setTimeout` with auto-dismiss timers (3500ms) that clean up array state by filtering out dismissed IDs. In addition, users can manually dismiss toasts using the close button.

### Q23: How is responsive design achieved without external CSS frameworks like Tailwind or Bootstrap?
**Answer:**  
Skillora uses pure CSS3 with custom CSS variables (Design Tokens), Flexbox, CSS Grid (`grid-template-columns: repeat(3, 1fr)`), and responsive `@media` queries at `1024px`, `900px`, and `680px`. The sidebar turns into an off-canvas mobile drawer on mobile devices.

### Q24: What is immutable state updating, and why is it used when updating tasks?
**Answer:**  
In React, state should never be modified directly (e.g. `skill.tasks[0].completed = true` is bad). Instead, Skillora creates new array copies using `.map()` and spread syntax (`{ ...task, completed: !task.completed }`). This ensures React detects the state reference change and triggers a re-render.

### Q25: How would you scale Skillora in a future version (Version 2.0)?
**Answer:**  
1. Connect a Node.js / Express or FastAPI backend with PostgreSQL / MongoDB for multi-user authentication (JWT / OAuth2).
2. Add Web Push API and email services (Nodemailer / SendGrid) for background deadline reminders.
3. Introduce cloud file uploads (AWS S3 / Supabase Storage) for portfolio asset attachments.
4. Implement social sharing with vanity URLs (`skillora.dev/u/ananya`).

