import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function OwnerDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDashboard() {
      try {
        const { data: response } = await api.get('/stores/owner/dashboard');
        setData(response);
      } finally {
        setLoading(false);
      }
    }
    fetchDashboard();
  }, []);

  if (loading) return <div className="page">Loading...</div>;

  if (!data?.store) {
    return (
      <div className="page">
        <h2>Store dashboard</h2>
        <p>No store is currently linked to your account. Please contact an administrator.</p>
      </div>
    );
  }

  return (
    <div className="page">
      <h2>{data.store.name}</h2>
      <p className="store-address">{data.store.address}</p>

      <div className="stat-cards">
        <div className="stat-card">
          <span className="stat-value">{Number(data.averageRating).toFixed(1)}</span>
          <span className="stat-label">Average rating</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">{data.raters.length}</span>
          <span className="stat-label">Ratings submitted</span>
        </div>
      </div>

      <h3>Customer ratings</h3>
      {data.raters.length === 0 ? (
        <p>No ratings have been submitted yet.</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {data.raters.map((r) => (
              <tr key={r.id}>
                <td>{r.name}</td>
                <td>{r.email}</td>
                <td>{r.rating}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
