import React, { useState } from 'react';
import { Mail, Send, CheckCircle2, MessageSquare, HelpCircle, Sparkles } from 'lucide-react';

/**
 * Support & Contact Page.
 * Demonstrates Controlled Forms, Validation, and Client-Side Demonstration Messages.
 */
export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState({});
  const [submittedMessage, setSubmittedMessage] = useState(null);

  const validate = () => {
    const errs = {};
    if (!formData.name.trim()) errs.name = 'Please provide your name.';
    if (!formData.email.trim()) {
      errs.email = 'Please provide your email.';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errs.email = 'Please enter a valid email address.';
    }
    if (!formData.subject.trim()) errs.subject = 'Subject cannot be empty.';
    if (!formData.message.trim() || formData.message.trim().length < 10) {
      errs.message = 'Please provide a message with at least 10 characters.';
    }
    return errs;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valErrors = validate();
    if (Object.keys(valErrors).length > 0) {
      setErrors(valErrors);
      return;
    }

    // Record demo submission
    setSubmittedMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      time: new Date().toLocaleTimeString()
    });

    // Reset form
    setFormData({
      name: '',
      email: '',
      subject: '',
      message: ''
    });
  };

  return (
    <div className="page-wrapper">
      <div className="section-header-center" style={{ marginBottom: '2.5rem' }}>
        <div className="editorial-pill" style={{ marginBottom: '0.65rem' }}>
          <Sparkles size={12} />
          <span>Feedback & Inquiries</span>
        </div>
        <h1 className="font-editorial" style={{ fontSize: '2.3rem' }}>
          Get in Touch with Skillora
        </h1>
        <p className="section-description">
          Have questions about the project implementation, viva defense, or feedback on features? Send a message through this demo form.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.2fr) minmax(0, 0.8fr)', gap: '2rem' }}>
        {/* Contact Form */}
        <div className="editorial-card" style={{ padding: '2rem' }}>
          {submittedMessage ? (
            <div
              style={{
                background: 'var(--success-bg)',
                border: '1px solid var(--success-border)',
                borderRadius: 'var(--radius-lg)',
                padding: '2rem',
                textAlign: 'center'
              }}
            >
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '50%',
                  background: '#2ea043',
                  color: '#fff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem'
                }}
              >
                <CheckCircle2 size={28} />
              </div>

              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--success-text)', marginBottom: '0.5rem' }}>
                Demo Submission Successfully Received!
              </h3>

              <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', lineHeight: 1.6, maxWidth: '480px', margin: '0 auto 1.5rem' }}>
                Thank you, <strong>{submittedMessage.name}</strong>. Your message regarding "
                <em>{submittedMessage.subject}</em>" was received at {submittedMessage.time}.
              </p>

              <div
                style={{
                  background: 'rgba(255,255,255,0.7)',
                  padding: '0.85rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  border: '1px dashed var(--success-border)',
                  marginBottom: '1.5rem'
                }}
              >
                <strong>Academic Demo Note:</strong> As Skillora operates purely on the client-side without an external mail server, no real SMTP email was dispatched over the internet. The form validation and state transitions executed successfully.
              </div>

              <button
                className="btn btn-secondary btn-sm"
                onClick={() => setSubmittedMessage(null)}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="grid-2">
                <div className="form-group">
                  <label className="form-label" htmlFor="contact-name">
                    Your Name *
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    name="name"
                    className="input-control"
                    placeholder="e.g. Rahul Verma"
                    value={formData.name}
                    onChange={handleInputChange}
                  />
                  {errors.name && <div className="form-error">{errors.name}</div>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="contact-email">
                    Email Address *
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    name="email"
                    className="input-control"
                    placeholder="e.g. rahul@example.com"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                  {errors.email && <div className="form-error">{errors.email}</div>}
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-subject">
                  Subject *
                </label>
                <input
                  id="contact-subject"
                  type="text"
                  name="subject"
                  className="input-control"
                  placeholder="e.g. Academic Examination Inquiry, Feature Suggestion"
                  value={formData.subject}
                  onChange={handleInputChange}
                />
                {errors.subject && <div className="form-error">{errors.subject}</div>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="contact-message">
                  Message *
                </label>
                <textarea
                  id="contact-message"
                  name="message"
                  className="input-control"
                  rows={4}
                  placeholder="Type your message or viva inquiry here..."
                  value={formData.message}
                  onChange={handleInputChange}
                />
                {errors.message && <div className="form-error">{errors.message}</div>}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-primary">
                  <Send size={15} /> Send Message
                </button>
              </div>
            </form>
          )}
        </div>

        {/* FAQ & Support Context */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div className="editorial-card" style={{ padding: '1.5rem' }}>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <HelpCircle size={18} color="var(--lavender-700)" /> Frequently Asked Questions
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Is my data saved permanently?</h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                  Yes! All skills, tasks, streak histories, and profile settings are persisted directly in your browser's localStorage. Refreshing or reopening the browser preserves your modifications.
                </p>
              </div>

              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>How do streaks work?</h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                  When you check off any task, Skillora logs an activity timestamp for today's date. The streak algorithm verifies consecutive days without resorting to fake random numbers.
                </p>
              </div>

              <div>
                <h5 style={{ fontSize: '0.9rem', fontWeight: 700 }}>Can I reset demo data?</h5>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', marginTop: '2px', lineHeight: 1.45 }}>
                  Yes! Simply click "Reset Demo Data" in the sidebar navigation or settings to restore the original realistic student dataset.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

