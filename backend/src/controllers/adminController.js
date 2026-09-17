const pool = require('../config/db');

async function getDashboardStats(req, res) {
  try {
    const [usersCount, storesCount, ratingsCount] = await Promise.all([
      pool.query('SELECT COUNT(*)::int AS count FROM users'),
      pool.query('SELECT COUNT(*)::int AS count FROM stores'),
      pool.query('SELECT COUNT(*)::int AS count FROM ratings'),
    ]);

    return res.json({
      totalUsers: usersCount.rows[0].count,
      totalStores: storesCount.rows[0].count,
      totalRatings: ratingsCount.rows[0].count,
    });
  } catch (err) {
    return res.status(500).json({ message: 'Could not fetch dashboard statistics', error: err.message });
  }
}

module.exports = { getDashboardStats };
