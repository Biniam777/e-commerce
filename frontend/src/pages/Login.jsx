import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

function Login() {
  const { login } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const updateField = (event) => {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
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
    <section className="form-page">
      <p className="eyebrow">Account</p>
      <h1>Log in</h1>
      <p className="page-description">Use your account to continue.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Email
          <input name="email" onChange={updateField} required type="email" value={form.email} />
        </label>
        <label>
          Password
          <input name="password" onChange={updateField} required type="password" value={form.password} />
        </label>
        {error && <p className="form-error" role="alert">{error}</p>}
        <button disabled={submitting} type="submit">
          {submitting ? 'Logging in...' : 'Log in'}
        </button>
      </form>
    </section>
  );
}

export default Login;