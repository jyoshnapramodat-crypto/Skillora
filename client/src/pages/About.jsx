import React from 'react';
import {
  Compass,
  Code2,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  CheckCircle2,
  Award
} from 'lucide-react';

/**
 * About page detailing project architecture and React academic syllabus mapping.
 */
export default function About({ onNavigateToContact }) {
  const reactConcepts = [
    {
      concept: 'Props',
      usage: 'Passed data and callbacks into StatCard, SkillCard, GoalCard, ProgressBar, ChartCard, and TaskItem.',
      codeExample: '<SkillCard skill={item} onManageTasks={handleOpenTasks} />'
    },
    {
      concept: 'State (useState)',
      usage: 'Maintained interactive state for skills array, task checklists, filters, search query, modal open/close states, and form inputs.',
      codeExample: 'const [skills, setSkills] = useState(initialSkills);'
    },
    {
      concept: 'Dynamic Lists (map)',
      usage: 'Rendered dynamic arrays of skills, nested task items, active goals, category chips, and activity history.',
      codeExample: 'skills.map(skill => <SkillCard key={skill.id} ... />)'
    },
    {
      concept: 'Controlled Components & Forms',
      usage: 'SkillForm, GoalForm, Task inputs, ProfileForm, and ContactForm manage input values through React state with real-time validation.',
      codeExample: '<input value={name} onChange={e => setName(e.target.value)} />'
    },
    {
      concept: 'Component-Driven UI',
      usage: 'Clean separation into pages, reusable cards, modals, navigation bars, and utility helper libraries.',
      codeExample: 'src/components/ vs src/pages/ vs src/utils/'
    },
    {
      concept: 'Conditional Rendering',
      usage: 'Handled empty states, modal overlays, priority pill styling, in-app reminder alerts, and success toasts.',
      codeExample: '{isOpen && <Modal ... />} or {empty ? <EmptyState /> : <List />}'
    },
    {
      concept: 'Event Handling',
      usage: 'Seamlessly handled onClick, onChange, onSubmit, onKeyDown, and custom parent callbacks across the component hierarchy.',
      codeExample: 'onSubmit={handleSubmit}, onToggle={id => handleToggle(id)}'
    },
    {
      concept: 'Data Management & LocalStorage',
      usage: 'Safe JSON parsing with fallback to initial sample datasets, synchronous state synchronization, and zero-server persistence.',
      codeExample: 'localStorage.setItem("skillora_skills", JSON.stringify(data));'
    }
  ];

  return (
    <div className="page-wrapper">
      <div className="section-header-center" style={{ marginBottom: '2.5rem' }}>
        <div className="editorial-pill" style={{ marginBottom: '0.65rem' }}>
          <Sparkles size={12} />
          <span>Academic Project Defense Reference</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '2.3rem' }}>
          About Skillora & Academic Architecture
        </h1>
        <p className="section-description">
          Skillora was engineered as a comprehensive React.js mini project designed to demonstrate clean architectural principles, modular component design, and verifiable progress algorithms.
        </p>
      </div>

      {/* Purpose & Philosophy */}
      <div className="editorial-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Compass size={20} color="var(--lavender-700)" /> Project Purpose & The Core Problem Solved
        </h3>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.95rem', marginBottom: '1rem' }}>
          In traditional portfolio builders, skill ratings are usually vanity sliders (e.g. "React - 90%", "Python - 80%"). These figures are arbitrary and lack proof. Skillora solves this through <strong>Task-Based Progress Tracking</strong>: each skill is backed by an explicit list of learning deliverables.
        </p>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.95rem' }}>
          Every percentage displayed on the dashboard, analytics, and exported PDF is calculated dynamically using the formula:
        </p>
        <div
          style={{
            background: 'var(--bg-cream-alt)',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.9rem',
            color: 'var(--lavender-800)',
            margin: '0.85rem 0',
            border: '1px solid var(--border-default)'
          }}
        >
          Skill Progress (%) = (Completed Tasks / Total Tasks) × 100
        </div>
        <p style={{ color: 'var(--text-secondary)', lineHeight: 1.65, fontSize: '0.95rem' }}>
          Edge cases (such as skills with 0 tasks) are safeguarded to prevent division-by-zero or NaN errors.
        </p>
      </div>

      {/* React Syllabus Concept Mapping Table */}
      <div className="editorial-card" style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Code2 size={20} color="var(--lavender-700)" /> React Examination & Viva Concept Mapping
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border-default)', background: 'var(--bg-cream-alt)' }}>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--lavender-800)' }}>React Concept</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--lavender-800)' }}>Where It Is Implemented</th>
                <th style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--lavender-800)' }}>Code Illustration</th>
              </tr>
            </thead>
            <tbody>
              {reactConcepts.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--border-light)' }}>
                  <td style={{ padding: '0.85rem 1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {item.concept}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', color: 'var(--text-secondary)' }}>
                    {item.usage}
                  </td>
                  <td style={{ padding: '0.85rem 1rem', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: 'var(--lavender-700)' }}>
                    {item.codeExample}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Technology Stack */}
      <div className="editorial-card" style={{ padding: '2rem' }}>
        <h3 style={{ fontSize: '1.25rem', fontWeight: 800, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Cpu size={20} color="var(--lavender-700)" /> Technology Stack & Libraries Used
        </h3>

        <div className="grid-3">
          <div style={{ background: 'var(--bg-cream-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>React 18 & Vite</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Blazing fast lightning build tooling and modern React component rendering engine.
            </p>
          </div>

          <div style={{ background: 'var(--bg-cream-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>Recharts</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Responsive SVG-based charting library powering bar, pie, and activity trend visualizations.
            </p>
          </div>

          <div style={{ background: 'var(--bg-cream-alt)', padding: '1rem', borderRadius: 'var(--radius-md)' }}>
            <span style={{ fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>jsPDF</span>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              Client-side PDF document generation formatted with fonts, color bars, and progress indicators.
            </p>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <button className="btn btn-secondary btn-sm" onClick={onNavigateToContact}>
            Have questions or feedback? Contact us
          </button>
        </div>
      </div>
    </div>
  );
}

