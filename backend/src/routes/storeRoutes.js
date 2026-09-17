const express = require('express');
const {
  createStore,
  listStoresForUser,
  listStoresForAdmin,
  getOwnerDashboard,
} = require('../controllers/storeController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', requireAuth, requireRole('user', 'admin'), listStoresForUser);
router.get('/owner/dashboard', requireAuth, requireRole('owner'), getOwnerDashboard);
router.get('/admin', requireAuth, requireRole('admin'), listStoresForAdmin);
router.post('/admin', requireAuth, requireRole('admin'), createStore);

module.exports = router;
