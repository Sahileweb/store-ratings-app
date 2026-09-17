import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api/axios';

export default function AdminUserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function fetchUser() {
      const { data } = await api.get(`/users/${id}`);
      setUser(data.user);
    }
    fetchUser();
  }, [id]);

  if (!user) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <Link to="/admin/users">&larr; Back to users</Link>
      <h2>{user.name}</h2>
      <div className="detail-grid">
        <div>
          <span className="detail-label">Email</span>
          <span>{user.email}</span>
        </div>
        <div>
          <span className="detail-label">Address</span>
          <span>{user.address}</span>
        </div>
        <div>
          <span className="detail-label">Role</span>
          <span className={`role-badge role-${user.role}`}>{user.role}</span>
        </div>
        {user.role === 'owner' && (
          <div>
            <span className="detail-label">Store rating</span>
            <span>{user.averageRating !== null ? Number(user.averageRating).toFixed(1) : 'No store assigned'}</span>
          </div>
        )}
      </div>
    </div>
  );
}
