const bcrypt = require('bcryptjs');
const pool = require('../config/db');
const { validateSignupPayload } = require('../utils/validators');

const SORTABLE_FIELDS = ['name', 'email', 'address', 'role'];
const ALLOWED_ROLES = ['admin', 'user', 'owner'];

function buildSort(sortBy, order) {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'name';
  const direction = order === 'desc' ? 'DESC' : 'ASC';
  return `${field} ${direction}`;
}

async function createUser(req, res) {
  const { name, email, address, password, role } = req.body;
  const errors = validateSignupPayload({ name, email, address, password });
  if (role && !ALLOWED_ROLES.includes(role)) {
    errors.role = 'Invalid role';
  }
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const hashed = await bcrypt.hash(password, 10);
    const result = await pool.query(
      `INSERT INTO users (name, email, password, address, role)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, name, email, address, role, created_at`,
      [name.trim(), email.toLowerCase(), hashed, address.trim(), role || 'user']
    );

    return res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Could not create user', error: err.message });
  }
}

async function listUsers(req, res) {
  const { name = '', email = '', address = '', role = '', sortBy = 'name', order = 'asc' } = req.query;
  const orderClause = buildSort(sortBy, order);

  try {
    const params = [`%${name}%`, `%${email}%`, `%${address}%`];
    let roleFilter = '';
    if (role && ALLOWED_ROLES.includes(role)) {
      params.push(role);
      roleFilter = `AND role = $${params.length}`;
    }

    const result = await pool.query(
      `SELECT id, name, email, address, role, created_at
       FROM users
       WHERE name ILIKE $1 AND email ILIKE $2 AND address ILIKE $3 ${roleFilter}
       ORDER BY ${orderClause}`,
      params
    );
    return res.json({ users: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch users', error: err.message });
  }
}

async function getUserDetail(req, res) {
  const { id } = req.params;

  try {
    const result = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = $1',
      [id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = result.rows[0];

    if (user.role === 'owner') {
      const storeResult = await pool.query('SELECT id FROM stores WHERE owner_id = $1', [id]);
      if (storeResult.rows.length > 0) {
        const avgResult = await pool.query(
          'SELECT COALESCE(AVG(rating), 0)::numeric(3,2) AS average_rating FROM ratings WHERE store_id = $1',
          [storeResult.rows[0].id]
        );
        user.averageRating = avgResult.rows[0].average_rating;
      } else {
        user.averageRating = null;
      }
    }

    return res.json({ user });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch user', error: err.message });
  }
}

async function listStoreOwners(req, res) {
  try {
    const result = await pool.query(
      "SELECT id, name, email FROM users WHERE role = 'owner' ORDER BY name ASC"
    );
    return res.json({ owners: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch store owners', error: err.message });
  }
}

module.exports = { createUser, listUsers, getUserDetail, listStoreOwners };
