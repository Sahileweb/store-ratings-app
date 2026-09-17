import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function AdminAddStore() {
  const [form, setForm] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchOwners() {
      const { data } = await api.get('/users/owners');
      setOwners(data.owners);
    }
    fetchOwners();
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setErrors({});
    setSubmitError('');
    setSubmitting(true);
    try {
      await api.post('/stores/admin', { ...form, ownerId: form.ownerId || null });
      navigate('/admin/stores');
    } catch (err) {
      if (err.response?.data?.errors) {
        setErrors(err.response.data.errors);
      } else {
        setSubmitError(err.response?.data?.message || 'Could not create store');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page">
      <h2>Add store</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        {submitError && <div className="form-error">{submitError}</div>}
        <label>
          Store name
          <input type="text" name="name" value={form.name} onChange={handleChange} required />
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
          Store owner (optional)
          <select name="ownerId" value={form.ownerId} onChange={handleChange}>
            <option value="">No owner assigned</option>
            {owners.map((o) => (
              <option key={o.id} value={o.id}>{o.name} ({o.email})</option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={submitting}>
          {submitting ? 'Creating...' : 'Create store'}
        </button>
      </form>
    </div>
  );
}
