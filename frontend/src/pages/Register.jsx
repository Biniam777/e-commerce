import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      await register(form);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-brand-panel">
        <div className="auth-brand-content">
          <Link className="auth-brand" to="/">
            Meridian Market
          </Link>

          <div className="auth-brand-copy">
            <p className="eyebrow">Join Meridian</p>
            <h1>A better way to shop for everyday essentials.</h1>
            <p>
              Create your account and get a simpler, more personal shopping
              experience from the start.
            </p>
          </div>

          <div className="auth-brand-footer">
            <span>Discover.</span>
            <span>Choose.</span>
            <span>Enjoy.</span>
          </div>
        </div>
      </div>

      <div className="auth-form-panel">
        <div className="auth-form-container">
          <div className="auth-mobile-brand">
            <Link className="auth-brand" to="/">
              Meridian Market
            </Link>
          </div>

          <div className="auth-heading">
            <p className="eyebrow">Create your account</p>
            <h2>Get started</h2>
            <p>
              Set up your account and start shopping.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="register-name">Full name</label>
              <input
                autoComplete="name"
                id="register-name"
                name="name"
                onChange={updateField}
                placeholder="Biniam Markos"
                required
                type="text"
                value={form.name}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-email">Email address</label>
              <input
                autoComplete="email"
                id="register-email"
                name="email"
                onChange={updateField}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="register-password">Password</label>
              <input
                autoComplete="new-password"
                id="register-password"
                name="password"
                onChange={updateField}
                placeholder="Create a password"
                required
                type="password"
                value={form.password}
              />
              <p className="auth-field-help">
                Use at least 8 characters.
              </p>
            </div>

            {error && (
              <p className="form-error auth-error" role="alert">
                {error}
              </p>
            )}

            <button
              className="auth-submit-button"
              disabled={submitting}
              type="submit"
            >
              {submitting ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account?{' '}
            <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Register;
