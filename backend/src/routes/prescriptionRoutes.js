const express = require('express');
const router = express.Router();
const { createPrescription, getPatientPrescriptions } = require('../controllers/prescriptionController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/create')
  .post(protect, restrictTo('doctor'), createPrescription);

router.route('/:patientId')
  .get(protect, getPatientPrescriptions);

module.exports = router;
