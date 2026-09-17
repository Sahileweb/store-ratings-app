import { useState } from 'react';
import api from '../api/axios';

export default function UpdatePassword() {
  const [form, setForm] = useState({ currentPassword: '', newPassword: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage('');
    setError('');
    setSubmitting(true);
    try {
      const { data } = await api.put('/auth/password', form);
      setMessage(data.message);
      setForm({ currentPassword: '', newPassword: '' });
    } catch (err) {
      setError(err.response?.data?.message || err.response?.data?.errors?.newPassword || 'Could not update password');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-page">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Update password</h2>
        {message && <div className="form-success">{message}</div>}
        {error && <div className="form-error">{error}</div>}
        <label>
          Current password
          <input type="password" name="currentPassword" value={form.currentPassword} onChange={handleChange} required />
        </label>
        <label>
          New password
          <input type="password" name="newPassword" value={form.newPassword} onChange={handleChange} required />
          <span className="field-hint">8-16 characters, one uppercase letter, one special character</span>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Updating...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}
