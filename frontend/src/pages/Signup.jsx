import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

export default function Signup() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      const { data } = await api.post('/auth/signup', form);
      login(data.token, data.user);
      navigate('/');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setSubmitError(err.response?.data?.message || 'Registration failed');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Create an account</h2>
        {submitError && <div className="form-error">{submitError}</div>}
        <label>
          Full name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
          <span className="field-hint">20-60 characters</span>
          {errors.name && <span className="field-error">{errors.name}</span>}
        </label>
        <label>
          Email
          <input type="email" name="email" value={form.email} onChange={handleChange} required />
          {errors.email && <span className="field-error">{errors.email}</span>}
        </label>
        <label>
          Address
          <textarea name="address" value={form.address} onChange={handleChange} maxLength={400} required />
          {errors.address && <span className="field-error">{errors.address}</span>}
        </label>
        <label>
          Password
          <input type="password" name="password" value={form.password} onChange={handleChange} required />
          <span className="field-hint">8-16 characters, one uppercase letter, one special character</span>
          {errors.password && <span className="field-error">{errors.password}</span>}
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating account...' : 'Sign up'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </form>
    </div>
  );
}
