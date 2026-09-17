const express = require('express');
const { getDashboardStats } = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/dashboard', requireAuth, requireRole('admin'), getDashboardStats);

module.exports = router;
