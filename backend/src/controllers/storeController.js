const pool = require('../config/db');
const { validateName, validateAddress, validateEmail } = require('../utils/validators');

const SORTABLE_FIELDS = ['name', 'email', 'address', 'average_rating'];

function buildSort(sortBy, order) {
  const field = SORTABLE_FIELDS.includes(sortBy) ? sortBy : 'name';
  const direction = order === 'desc' ? 'DESC' : 'ASC';
  return `${field} ${direction}`;
}

async function createStore(req, res) {
  const { name, email, address, ownerId } = req.body;
  const errors = {};
  const nameErr = validateName(name);
  const emailErr = validateEmail(email);
  const addressErr = validateAddress(address);
  if (nameErr) errors.name = nameErr;
  if (emailErr) errors.email = emailErr;
  if (addressErr) errors.address = addressErr;
  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    if (ownerId) {
      const ownerCheck = await pool.query('SELECT id, role FROM users WHERE id = $1', [ownerId]);
      if (ownerCheck.rows.length === 0) {
        return res.status(400).json({ message: 'Selected store owner does not exist' });
      }
    }

    const existing = await pool.query('SELECT id FROM stores WHERE email = $1', [email]);
    if (existing.rows.length > 0) {
      return res.status(409).json({ message: 'A store with this email already exists' });
    }

    const result = await pool.query(
      `INSERT INTO stores (name, email, address, owner_id)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, address, owner_id, created_at`,
      [name.trim(), email.toLowerCase(), address.trim(), ownerId || null]
    );

    return res.status(201).json({ store: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Could not create store', error: err.message });
  }
}

async function listStoresForUser(req, res) {
  const { name = '', address = '', sortBy = 'name', order = 'asc' } = req.query;
  const orderClause = buildSort(sortBy, order);
  const userId = req.user.id;

  try {
    const result = await pool.query(
      `SELECT
         s.id, s.name, s.email, s.address,
         COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating,
         COUNT(r.id) AS rating_count,
         ur.rating AS user_rating
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       LEFT JOIN ratings ur ON ur.store_id = s.id AND ur.user_id = $1
       WHERE s.name ILIKE $2 AND s.address ILIKE $3
       GROUP BY s.id, ur.rating
       ORDER BY ${orderClause}`,
      [userId, `%${name}%`, `%${address}%`]
    );
    return res.json({ stores: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch stores', error: err.message });
  }
}

async function listStoresForAdmin(req, res) {
  const { name = '', email = '', address = '', sortBy = 'name', order = 'asc' } = req.query;
  const orderClause = buildSort(sortBy, order);

  try {
    const result = await pool.query(
      `SELECT
         s.id, s.name, s.email, s.address,
         COALESCE(AVG(r.rating), 0)::numeric(3,2) AS average_rating,
         COUNT(r.id) AS rating_count
       FROM stores s
       LEFT JOIN ratings r ON r.store_id = s.id
       WHERE s.name ILIKE $1 AND s.email ILIKE $2 AND s.address ILIKE $3
       GROUP BY s.id
       ORDER BY ${orderClause}`,
      [`%${name}%`, `%${email}%`, `%${address}%`]
    );
    return res.json({ stores: result.rows });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch stores', error: err.message });
  }
}

async function getOwnerDashboard(req, res) {
  const ownerId = req.user.id;

  try {
    const storeResult = await pool.query('SELECT id, name, email, address FROM stores WHERE owner_id = $1', [ownerId]);
    if (storeResult.rows.length === 0) {
      return res.json({ store: null, averageRating: 0, raters: [] });
    }

    const store = storeResult.rows[0];

    const ratersResult = await pool.query(
      `SELECT u.id, u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = $1
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    const avgResult = await pool.query(
      'SELECT COALESCE(AVG(rating), 0)::numeric(3,2) AS average_rating FROM ratings WHERE store_id = $1',
      [store.id]
    );

    return res.json({
      store,
      averageRating: avgResult.rows[0].average_rating,
      raters: ratersResult.rows,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch dashboard', error: err.message });
  }
}

module.exports = {
  createStore,
  listStoresForUser,
  listStoresForAdmin,
  getOwnerDashboard,
};
