import { useEffect, useState } from 'react';
import api from '../api/axios';
import StarRating from '../components/StarRating';

export default function UserStores() {
  const [stores, setStores] = useState([]);
  const [filters, setFilters] = useState({ name: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);

  async function fetchStores() {
    setLoading(true);
    try {
      const { data } = await api.get('/stores', {
        params: { ...filters, sortBy, order },
      });
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

  async function handleRate(storeId, rating) {
    setSavingId(storeId);
    try {
      await api.put(`/ratings/${storeId}`, { rating });
      await fetchStores();
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div className="page">
      <h2>Browse stores</h2>
      <form className="filter-bar" onSubmit={handleSearch}>
        <input
          type="text"
          name="name"
          placeholder="Search by name"
          value={filters.name}
          onChange={handleFilterChange}
        />
        <input
          type="text"
          name="address"
          placeholder="Search by address"
          value={filters.address}
          onChange={handleFilterChange}
        />
        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
          <option value="name">Sort by name</option>
          <option value="average_rating">Sort by rating</option>
        </select>
        <select value={order} onChange={(e) => setOrder(e.target.value)}>
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading stores...</p>
      ) : stores.length === 0 ? (
        <p>No stores match your search.</p>
      ) : (
        <div className="store-grid">
          {stores.map((store) => (
            <div className="store-card" key={store.id}>
              <h3>{store.name}</h3>
              <p className="store-address">{store.address}</p>
              <p className="store-overall">
                Overall rating: {Number(store.average_rating).toFixed(1)} ({store.rating_count} ratings)
              </p>
              <div className="store-rate-section">
                <p>Your rating:</p>
                <StarRating
                  value={store.user_rating || 0}
                  disabled={savingId === store.id}
                  onChange={(value) => handleRate(store.id, value)}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
