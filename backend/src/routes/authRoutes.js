const express = require('express');
const { signup, login, updatePassword, me } = require('../controllers/authController');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);
router.put('/password', requireAuth, updatePassword);
router.get('/me', requireAuth, me);

module.exports = router;
