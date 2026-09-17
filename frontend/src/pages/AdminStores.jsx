import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SortableHeader from '../components/SortableHeader';

export default function AdminStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  async function fetchStores() {
    setLoading(true);
    try {
      const { data } = await api.get('/stores/admin', { params: { ...filters, sortBy, order } });
      setStores(data.stores);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStores();
  }, [sortBy, order]);

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchStores();
  }

  function handleSort(field) {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  }

  return (
    <div className="page">
      <div className="page-header">
        <h2>Stores</h2>
        <Link className="btn" to="/admin/stores/new">Add store</Link>
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input type="text" name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
        <input type="text" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Address" value={filters.address} onChange={handleFilterChange} />
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading stores...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <SortableHeader label="Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} />
              <SortableHeader label="Email" field="email" sortBy={sortBy} order={order} onSort={handleSort} />
              <SortableHeader label="Address" field="address" sortBy={sortBy} order={order} onSort={handleSort} />
              <SortableHeader label="Rating" field="average_rating" sortBy={sortBy} order={order} onSort={handleSort} />
            </tr>
          </thead>
          <tbody>
            {stores.map((s) => (
              <tr key={s.id}>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td>{s.address}</td>
                <td>{Number(s.average_rating).toFixed(1)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
