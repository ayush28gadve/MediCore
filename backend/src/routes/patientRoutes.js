const express = require('express');
const router = express.Router();
const { registerPatient, getPatients, getPatientById } = require('../controllers/patientController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getPatients);

router.route('/register')
  .post(protect, restrictTo('reception', 'admin'), registerPatient);

router.route('/:id')
  .get(protect, getPatientById);

module.exports = router;
