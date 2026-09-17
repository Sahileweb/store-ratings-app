const pool = require('../config/db');
const { validateRating } = require('../utils/validators');

async function submitRating(req, res) {
  const { storeId } = req.params;
  const { rating } = req.body;
  const userId = req.user.id;

  const ratingErr = validateRating(rating);
  if (ratingErr) {
    return res.status(400).json({ message: ratingErr });
  }

  try {
    const storeCheck = await pool.query('SELECT id FROM stores WHERE id = $1', [storeId]);
    if (storeCheck.rows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    const result = await pool.query(
      `INSERT INTO ratings (user_id, store_id, rating)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, store_id)
       DO UPDATE SET rating = EXCLUDED.rating, updated_at = NOW()
       RETURNING id, user_id, store_id, rating, updated_at`,
      [userId, storeId, rating]
    );

    return res.status(200).json({ rating: result.rows[0] });
  } catch (err) {
    return res.status(500).json({ message: 'Could not submit rating', error: err.message });
  }
}

module.exports = { submitRating };
