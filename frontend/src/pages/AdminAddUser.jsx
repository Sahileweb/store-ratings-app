import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminAddUser() {
  const [form, setForm] = useState({ name: '', email: '', address: '', password: '', role: 'user' });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
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
      await api.post('/users', form);
      navigate('/admin/users');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setSubmitError(err.response?.data?.message || 'Could not create user');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h2>Add user</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
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
        <label>
          Role
          <select name="role" value={form.role} onChange={handleChange}>
            <option value="user">Normal user</option>
            <option value="admin">System administrator</option>
            <option value="owner">Store owner</option>
          </select>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create user'}
        </button>
      </form>
    </div>
  );
}
