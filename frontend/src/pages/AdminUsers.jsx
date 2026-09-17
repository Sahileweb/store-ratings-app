import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axios';
import SortableHeader from '../components/SortableHeader';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [loading, setLoading] = useState(true);

  async function fetchUsers() {
    setLoading(true);
    try {
      const { data } = await api.get('/users', { params: { ...filters, sortBy, order } });
      setUsers(data.users);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, [sortBy, order]);

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function handleSearch(e) {
    e.preventDefault();
    fetchUsers();
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
        <h2>Users</h2>
        <Link className="btn" to="/admin/users/new">Add user</Link>
      </div>

      <form className="filter-bar" onSubmit={handleSearch}>
        <input type="text" name="name" placeholder="Name" value={filters.name} onChange={handleFilterChange} />
        <input type="text" name="email" placeholder="Email" value={filters.email} onChange={handleFilterChange} />
        <input type="text" name="address" placeholder="Address" value={filters.address} onChange={handleFilterChange} />
        <select name="role" value={filters.role} onChange={handleFilterChange}>
          <option value="">All roles</option>
          <option value="admin">Admin</option>
          <option value="user">Normal user</option>
          <option value="owner">Store owner</option>
        </select>
        <button type="submit">Search</button>
      </form>

      {loading ? (
        <p>Loading users...</p>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <SortableHeader label="Name" field="name" sortBy={sortBy} order={order} onSort={handleSort} />
              <SortableHeader label="Email" field="email" sortBy={sortBy} order={order} onSort={handleSort} />
              <SortableHeader label="Address" field="address" sortBy={sortBy} order={order} onSort={handleSort} />
              <SortableHeader label="Role" field="role" sortBy={sortBy} order={order} onSort={handleSort} />
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.address}</td>
                <td className="role-badge-cell"><span className={`role-badge role-${u.role}`}>{u.role}</span></td>
                <td><Link to={`/admin/users/${u.id}`}>View</Link></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
