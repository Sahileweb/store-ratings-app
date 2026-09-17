const express = require('express');
const { createUser, listUsers, getUserDetail, listStoreOwners } = require('../controllers/userController');
const { requireAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.post('/', requireAuth, requireRole('admin'), createUser);
router.get('/', requireAuth, requireRole('admin'), listUsers);
router.get('/owners', requireAuth, requireRole('admin'), listStoreOwners);
router.get('/:id', requireAuth, requireRole('admin'), getUserDetail);

module.exports = router;
