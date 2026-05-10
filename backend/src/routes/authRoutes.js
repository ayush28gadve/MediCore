const express = require('express');
const router = express.Router();
const { loginUser, getDoctors } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

router.post('/login', loginUser);
router.get('/doctors', protect, getDoctors);

module.exports = router;
