import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    async function fetchStats() {
      const { data } = await api.get('/admin/dashboard');
      setStats(data);
    }
    fetchStats();
  }, []);

  if (!stats) return <div className="page">Loading...</div>;

  return (
    <div className="page">
      <h2>Admin dashboard</h2>
      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-value">{stats.totalUsers}</span>
          <span className="stat-label">Total users</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalStores}</span>
          <span className="stat-label">Total stores</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{stats.totalRatings}</span>
          <span className="stat-label">Total ratings</span>
        </div>
      </div>
    </div>
  );
}
