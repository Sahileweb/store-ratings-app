const express = require('express');
const { submitRating } = require('../controllers/ratingController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.put('/:storeId', requireAuth, requireRole('user'), submitRating);

module.exports = router;
