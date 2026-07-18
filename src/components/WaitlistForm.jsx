import React from 'react';
import { ArrowRight, ChevronDown } from 'lucide-react';
import { useWaitlist } from '../hooks/useWaitlist';

const INTEREST_OPTIONS = ['Student', 'Educator', 'Institution', 'Just Curious'];

export function WaitlistForm({ className = '' }) {
  const { joinWaitlist, loading, error, success } = useWaitlist();
  const interestMenuRef = React.useRef(null);
  const [interestOpen, setInterestOpen] = React.useState(false);
  const [formValues, setFormValues] = React.useState({
    name: '',
    email: '',
    interest: 'Student',
  });

  React.useEffect(() => {
    const handlePointerDown = (event) => {
      if (interestMenuRef.current && !interestMenuRef.current.contains(event.target)) {
        setInterestOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setInterestOpen(false);
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    document.addEventListener('keydown', handleEscape);

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const statusMessage = success
    ? 'Welcome! You\'re officially on the waitlist.'
    : error;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const submitted = await joinWaitlist(formValues);
    if (submitted) {
      setFormValues((current) => ({
        ...current,
        name: '',
        email: '',
      }));
      setInterestOpen(false);
    }
  };

  return (
    <form className={`waitlist-form glass-panel ${className}`} onSubmit={handleSubmit}>
      <div className="waitlist-form-head">
        <p className="section-kicker mb-0">Join the waitlist</p>
        <p className="waitlist-form-copy">Be first to try OptiStudy when the mock site goes live.</p>
      </div>

      <div className="waitlist-grid">
        <label className="waitlist-field">
          <span>Name <span className="waitlist-optional">(optional)</span></span>
          <input
            type="text"
            name="name"
            value={formValues.name}
            onChange={handleChange}
            placeholder="Your name"
            autoComplete="name"
            disabled={loading}
          />
        </label>

        <label className="waitlist-field">
          <span>Email</span>
          <input
            type="email"
            name="email"
            value={formValues.email}
            onChange={handleChange}
            placeholder="you@example.com"
            autoComplete="email"
            required
            disabled={loading}
          />
        </label>
      </div>

      <div className="waitlist-field waitlist-dropdown-field" ref={interestMenuRef}>
        <span>Interest</span>
        <button
          type="button"
          className="waitlist-dropdown-trigger"
          onClick={() => setInterestOpen((current) => !current)}
          disabled={loading}
          aria-haspopup="listbox"
          aria-expanded={interestOpen}
          aria-label={`Interest, current option ${formValues.interest}`}
        >
          <span>{formValues.interest}</span>
          <ChevronDown size={18} />
        </button>

        {interestOpen ? (
          <div className="waitlist-dropdown-menu glass-panel" role="listbox" aria-label="Interest options">
            {INTEREST_OPTIONS.map((option) => {
              const isSelected = formValues.interest === option;
              return (
                <button
                  key={option}
                  type="button"
                  className={`waitlist-dropdown-option ${isSelected ? 'is-selected' : ''}`}
                  onClick={() => {
                    setFormValues((current) => ({
                      ...current,
                      interest: option,
                    }));
                    setInterestOpen(false);
                  }}
                  role="option"
                  aria-selected={isSelected}
                  disabled={loading}
                >
                  {option}
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      <div className="waitlist-actions">
        <button type="submit" className="primary-button waitlist-submit" disabled={loading}>
          {loading ? (
            <>
              <span className="waitlist-spinner" aria-hidden="true" />
              Submitting
            </>
          ) : (
            <>
              <span>Join the waitlist</span>
              <ArrowRight size={16} />
            </>
          )}
        </button>

        <p className={`waitlist-status ${error ? 'is-error' : success ? 'is-success' : ''}`} aria-live="polite">
          {statusMessage}
        </p>
      </div>
    </form>
  );
}
