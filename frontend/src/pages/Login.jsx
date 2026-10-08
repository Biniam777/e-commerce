import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
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
      await login(form);
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to log in. Please try again.');
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
            <p className="eyebrow">Welcome back</p>
            <h1>Everything you need, in one place.</h1>
            <p>
              Sign in to continue shopping, manage your cart, and keep track
              of your orders.
            </p>
          </div>

          <div className="auth-brand-footer">
            <span>Simple shopping.</span>
            <span>Thoughtfully designed.</span>
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
            <p className="eyebrow">Your account</p>
            <h2>Welcome back</h2>
            <p>
              Sign in to continue to your account.
            </p>
          </div>

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="login-email">Email address</label>
              <input
                autoComplete="email"
                id="login-email"
                name="email"
                onChange={updateField}
                placeholder="you@example.com"
                required
                type="email"
                value={form.email}
              />
            </div>

            <div className="auth-field">
              <div className="auth-field-heading">
                <label htmlFor="login-password">Password</label>
              </div>

              <input
                autoComplete="current-password"
                id="login-password"
                name="password"
                onChange={updateField}
                placeholder="Enter your password"
                required
                type="password"
                value={form.password}
              />
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
              {submitting ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account?{' '}
            <Link to="/register">Create one</Link>
          </p>
        </div>
      </div>
    </section>
  );
}

export default Login;
