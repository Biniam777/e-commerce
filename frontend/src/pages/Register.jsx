import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
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
      await register(form);
      navigate('/', { replace: true });
    } catch (requestError) {
      setError(requestError.message || 'Unable to register. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="form-page">
      <p className="eyebrow">Account</p>
      <h1>Create an account</h1>
      <p className="page-description">Register to access your shopping account.</p>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label>
          Name
          <input name="name" onChange={updateField} required type="text" value={form.name} />
        </label>
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
          {submitting ? 'Creating account...' : 'Create account'}
        </button>
      </form>
    </section>
  );
}

export default Register;