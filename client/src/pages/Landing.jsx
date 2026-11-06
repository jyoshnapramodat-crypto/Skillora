import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Award,
  Layers,
  FileText,
  ShieldCheck,
  Target,
  Download,
  Github,
  Linkedin,
  ExternalLink,
  UserPlus,
  LogIn,
  Send,
  HelpCircle,
  Code2
} from 'lucide-react';

/**
 * Public Landing Page for Skillora.
 * Editorial lavender-and-cream aesthetic with hero, workflow, feature breakdown,
 * dedicated About & Contact sections, and authentication entry points.
 */
export default function Landing({
  onEnterDemo,
  onNavigateToLogin,
  onNavigateToRegister,
  onNavigateToContact,
  onNavigateToAbout
}) {
  const [quickContactName, setQuickContactName] = useState('');
  const [quickContactEmail, setQuickContactEmail] = useState('');
  const [quickContactMessage, setQuickContactMessage] = useState('');
  const [quickContactSent, setQuickContactSent] = useState(false);

  const handleQuickContactSubmit = (e) => {
    e.preventDefault();
    if (quickContactName.trim() && quickContactEmail.trim() && quickContactMessage.trim()) {
      setQuickContactSent(true);
      setQuickContactName('');
      setQuickContactEmail('');
      setQuickContactMessage('');
      setTimeout(() => setQuickContactSent(false), 5000);
    }
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div style={{ backgroundColor: 'var(--bg-cream)', minHeight: '100vh' }}>
      {/* Landing Navbar */}
      <nav className="landing-navbar">
        <div
          className="brand-badge"
          style={{ cursor: 'pointer' }}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <div className="brand-logo-icon">
            <Compass size={18} />
          </div>
          <span>Skillora</span>
        </div>

        <ul className="landing-nav-links">
          <li><a onClick={() => scrollToSection('features')}>Features</a></li>
          <li><a onClick={() => scrollToSection('how-it-works')}>How It Works</a></li>
          <li><a onClick={() => scrollToSection('benefits')}>Benefits</a></li>
          <li><a onClick={() => scrollToSection('about')}>About</a></li>
          <li><a onClick={() => scrollToSection('contact')}>Contact</a></li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onNavigateToLogin}
            style={{ fontSize: '0.85rem' }}
          >
            <LogIn size={15} /> Sign In
          </button>

          <button
            className="btn btn-primary btn-sm"
            onClick={onEnterDemo}
            style={{ fontSize: '0.85rem' }}
            title="Jump directly into preloaded demo workspace"
          >
            Explore Demo <ArrowRight size={14} />
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="landing-hero">
        <div className="editorial-pill landing-hero-tag">
          <Sparkles size={13} />
          <span>A Smart Skill Progress Portfolio Platform</span>
        </div>

        <h1 className="landing-hero-title font-editorial">
          Organize your learning, track real milestones, and <span>showcase verifiable growth.</span>
        </h1>

        <p className="landing-hero-subtitle">
          Say goodbye to decorative percentages. Skillora automatically calculates your progress from verified learning tasks, tracks active streaks, and transforms your development into an editorial-grade, shareable portfolio.
        </p>

        <div className="hero-cta-group">
          <button className="btn btn-primary btn-lg" onClick={onEnterDemo}>
            Explore Demo Workspace <ArrowRight size={18} />
          </button>
          <button className="btn btn-secondary btn-lg" onClick={onNavigateToRegister}>
            <UserPlus size={18} /> Create Your Account
          </button>
        </div>

        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '-2.2rem', marginBottom: '3.5rem' }}>
          Already have an account?{' '}
          <button
            onClick={onNavigateToLogin}
            style={{ color: 'var(--lavender-700)', fontWeight: 700, textDecoration: 'underline' }}
          >
            Sign In here
          </button>
        </div>

        {/* Live Interactive Hero Preview Card */}
        <div className="hero-preview-card">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem', borderBottom: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ff5f56' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#ffbd2e' }} />
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: '#27c93f' }} />
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '0.5rem', fontWeight: 600 }}>
                Skillora Studio Workspace Preview
              </span>
            </div>
            <span className="editorial-pill" style={{ fontSize: '0.72rem' }}>
              Instant Local Demo
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
            <div style={{ background: 'var(--bg-cream-alt)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lavender-700)', textTransform: 'uppercase' }}>
                Mathematical Progress
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem' }}>67% Verified</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Progress = (4 completed / 6 tasks) × 100. Dynamically recalculated with zero division-by-zero flaws.
              </p>
            </div>

            <div style={{ background: 'var(--bg-cream-alt)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lavender-700)', textTransform: 'uppercase' }}>
                Real Streak Engine
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem' }}>5 Days Active</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Recorded strictly from task completion timestamps. No fake or randomized streak counters.
              </p>
            </div>

            <div style={{ background: 'var(--bg-cream-alt)', padding: '1.25rem', borderRadius: 'var(--radius-md)', textAlign: 'left' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--lavender-700)', textTransform: 'uppercase' }}>
                Export Ready
              </div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800, marginTop: '0.2rem' }}>PDF & CSV</div>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                One-click client-side jsPDF generation and RFC-compliant CSV data downloads.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="landing-section">
        <div className="section-header-center">
          <div className="section-eyebrow">Core Capabilities</div>
          <h2 className="section-title font-editorial">Everything you need to master your craft</h2>
          <p className="section-description">
            Skillora is built specifically for students, engineers, and creators who want clean organization and authentic progress tracking.
          </p>
        </div>

        <div className="grid-3">
          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Layers size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Task-Based Progress Calculation</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Progress isn't a vanity slider. Add actionable tasks to any skill. Skillora dynamically computes exact completion percentages based on finished steps.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Target size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Learning Goals & Deadlines</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Assign high, medium, or low priority goals. Track active, upcoming, and overdue deadlines with proactive in-app reminder alerts.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <Award size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Real Consistency Streaks</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Build study habits that stick. Streaks are computed directly from chronological activity dates so your dedication is honestly reflected.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <BarChart3 size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Interactive Analytics</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Visual charts illustrate skill-wise progress, category distributions, completed tasks versus pending items, and weekly activity trends.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <FileText size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Verified PDF Export</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Generate a polished, beautifully typeset PDF document of your profile, verified skills, and goals for interviews, mentors, and academic vivas.
            </p>
          </div>

          <div className="feature-box">
            <div className="feature-icon-wrapper">
              <ShieldCheck size={22} />
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700 }}>User Accounts & Instant Demo</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Create your own personal account or explore instantly as a demo user. All state lives securely in your browser localStorage.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="landing-section" style={{ background: 'var(--bg-cream-alt)', borderRadius: 'var(--radius-xl)' }}>
        <div className="section-header-center">
          <div className="section-eyebrow">Seamless Workflow</div>
          <h2 className="section-title font-editorial">How Skillora Works in 3 Simple Steps</h2>
          <p className="section-description">
            A frictionless learning system designed to eliminate overwhelm and foster deep focus.
          </p>
        </div>

        <div className="grid-3">
          <div className="step-card">
            <div className="step-num">01</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Create Your Skills</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Select from predefined domains like Programming, Web Development, Design, or add custom categories tailored to your syllabus.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">02</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Break Down Actionable Tasks</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Add hands-on exercises, chapters, or interview questions. As you mark items done, your progress bars and streaks automatically advance.
            </p>
          </div>

          <div className="step-card">
            <div className="step-num">03</div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.5rem' }}>Export & Showcase</h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.55 }}>
              Switch to Public Portfolio view, customize which milestones are visible, copy your sharing link, or download your PDF report.
            </p>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="landing-section">
        <div className="section-header-center">
          <div className="section-eyebrow">Why Track Learning?</div>
          <h2 className="section-title font-editorial">The power of deliberate skill documentation</h2>
        </div>

        <div style={{ maxWidth: '820px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {[
            {
              title: 'Defend Academic Vivas with Confidence',
              text: 'Clearly explain component trees, state hooks, array methods, and real-time computation to evaluators.'
            },
            {
              title: 'Eliminate the Illusion of Competence',
              text: 'Watching tutorials does not equal mastery. Checking off concrete tasks provides truthful verification of capability.'
            },
            {
              title: 'Impress Recruiters and Mentors',
              text: 'Instead of saying "I know React", show a verified breakdown of component design, custom hooks, and testing milestones.'
            },
            {
              title: 'Maintain Momentum with Honest Streaks',
              text: 'Seeing your daily consistency visualized keeps you engaged through challenging algorithms and coursework.'
            }
          ].map((b, idx) => (
            <div key={idx} className="editorial-card" style={{ padding: '1.25rem 1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={22} color="var(--lavender-600)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.2rem' }}>{b.title}</h4>
                <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>{b.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* About Section on Landing Page */}
      <section id="about" className="landing-section" style={{ background: 'var(--bg-cream-alt)', borderRadius: 'var(--radius-xl)' }}>
        <div className="section-header-center">
          <div className="section-eyebrow">About Skillora</div>
          <h2 className="section-title font-editorial">Purpose-Built for Meaningful Growth</h2>
          <p className="section-description">
            Designed as an academic mini project demonstrating modular React.js architecture, component-driven UI, and zero-server client persistence.
          </p>
        </div>

        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          <div className="editorial-card" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div className="feature-icon-wrapper" style={{ width: '38px', height: '38px' }}>
                <Compass size={18} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>The Philosophy</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Learning shouldn't be measured by guesswork. By anchoring skills to granular task checklists, Skillora produces genuine metrics that reflect real effort and preparation.
            </p>
          </div>

          <div className="editorial-card" style={{ padding: '1.75rem', background: '#ffffff' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem' }}>
              <div className="feature-icon-wrapper" style={{ width: '38px', height: '38px' }}>
                <Code2 size={18} />
              </div>
              <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Academic Foundation</h4>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              Crafted to illustrate fundamental B.Tech React syllabus concepts including Props, State, Controlled Inputs, Dynamic Lists, LocalStorage, and Recharts analytics.
            </p>
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <button className="btn btn-secondary btn-sm" onClick={onNavigateToAbout}>
            Read Full Academic & Viva Defense Guide <ArrowRight size={14} />
          </button>
        </div>
      </section>

      {/* Contact Section on Landing Page */}
      <section id="contact" className="landing-section">
        <div className="section-header-center">
          <div className="section-eyebrow">Connect & Inquiries</div>
          <h2 className="section-title font-editorial">Have Questions or Suggestions?</h2>
          <p className="section-description">
            Send us a quick message regarding project evaluation, feature requests, or academic practical viva inquiries.
          </p>
        </div>

        <div style={{ maxWidth: '640px', margin: '0 auto' }}>
          <div className="editorial-card" style={{ padding: '2rem' }}>
            {quickContactSent ? (
              <div style={{ textAlign: 'center', padding: '1.5rem', background: 'var(--success-bg)', borderRadius: 'var(--radius-md)', color: 'var(--success-text)' }}>
                <CheckCircle2 size={32} style={{ margin: '0 auto 0.5rem' }} />
                <h4 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Inquiry Received!</h4>
                <p style={{ fontSize: '0.86rem', marginTop: '0.25rem', color: 'var(--text-secondary)' }}>
                  Thank you! Your feedback message has been acknowledged. (Client-side demo confirmation).
                </p>
              </div>
            ) : (
              <form onSubmit={handleQuickContactSubmit}>
                <div className="grid-2">
                  <div className="form-group">
                    <label className="form-label">Your Name *</label>
                    <input
                      type="text"
                      className="input-control"
                      placeholder="e.g. Rahul Sharma"
                      value={quickContactName}
                      onChange={(e) => setQuickContactName(e.target.value)}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      className="input-control"
                      placeholder="e.g. rahul@example.com"
                      value={quickContactEmail}
                      onChange={(e) => setQuickContactEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea
                    className="input-control"
                    rows={3}
                    placeholder="How can we assist you with Skillora?"
                    value={quickContactMessage}
                    onChange={(e) => setQuickContactMessage(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem' }}>
                  <button
                    type="button"
                    onClick={onNavigateToContact}
                    style={{ fontSize: '0.82rem', color: 'var(--lavender-700)', textDecoration: 'underline' }}
                  >
                    Open Full Support Page & FAQs
                  </button>

                  <button type="submit" className="btn btn-primary btn-sm">
                    <Send size={14} /> Send Inquiry
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section style={{ padding: '3rem 2rem 4rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '3.5rem 2rem', background: 'linear-gradient(135deg, #ffffff, var(--lavender-100))', border: '1px solid var(--lavender-200)', borderRadius: 'var(--radius-xl)', boxShadow: 'var(--shadow-md)' }}>
          <h2 className="font-editorial" style={{ fontSize: '2.4rem', marginBottom: '1rem' }}>
            Ready to structure your learning journey?
          </h2>
          <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', marginBottom: '2rem', maxWidth: '540px', margin: '0 auto 2rem' }}>
            Create your account now to start tracking your individual goals, or jump in as a demo user.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <button className="btn btn-primary btn-lg" onClick={onEnterDemo}>
              Explore Demo Workspace <ArrowRight size={18} />
            </button>
            <button className="btn btn-secondary btn-lg" onClick={onNavigateToRegister}>
              <UserPlus size={18} /> Create Account
            </button>
          </div>
        </div>
      </section>

      {/* Landing Footer */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div>
            <div className="brand-badge" style={{ marginBottom: '0.85rem' }}>
              <div className="brand-logo-icon">
                <Compass size={18} />
              </div>
              <span>Skillora</span>
            </div>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, maxWidth: '320px' }}>
              A personal skill progress portfolio application demonstrating React core concepts: Props, State, Dynamic Lists, Forms, and LocalStorage persistence.
            </p>
          </div>

          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Account</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <li><a onClick={onNavigateToLogin} style={{ cursor: 'pointer' }}>Sign In</a></li>
              <li><a onClick={onNavigateToRegister} style={{ cursor: 'pointer' }}>Create Free Account</a></li>
              <li><a onClick={onEnterDemo} style={{ cursor: 'pointer' }}>Demo Student Workspace</a></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Documentation</h5>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.88rem' }}>
              <li><a onClick={onNavigateToAbout} style={{ cursor: 'pointer' }}>About Skillora</a></li>
              <li><a onClick={onNavigateToContact} style={{ cursor: 'pointer' }}>Contact & Feedback</a></li>
              <li><a onClick={onEnterDemo} style={{ cursor: 'pointer' }}>Public Portfolio Demo</a></li>
            </ul>
          </div>

          <div>
            <h5 style={{ fontSize: '0.9rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>Project Details</h5>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: 1.5, marginBottom: '0.75rem' }}>
              B.Tech Academic Project in Full-Stack MERN (React, Node.js, Express & MongoDB).
            </p>
            <div style={{ display: 'flex', gap: '0.65rem' }}>
              <a
                href="https://github.com/jyoshnapramodat-crypto/Skillora.git"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                title="GitHub Repository"
                aria-label="GitHub Repository"
              >
                <Github size={16} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-icon"
                title="LinkedIn Profile"
                aria-label="LinkedIn"
              >
                <Linkedin size={16} />
              </a>
            </div>
          </div>
        </div>

        <div className="footer-copyright">
          <span>© {new Date().getFullYear()} Skillora Portfolio Platform. Created for Academic Evaluation & Viva Defense.</span>
          <span style={{ color: 'var(--lavender-700)', fontWeight: 600 }}>Full-Stack MERN Architecture (React + Express + MongoDB)</span>
        </div>
      </footer>
    </div>
  );
}
