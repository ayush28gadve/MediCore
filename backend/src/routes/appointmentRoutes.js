const express = require('express');
const router = express.Router();
const { getDoctorAppointments, updateAppointmentStatus } = require('../controllers/appointmentController');
const { protect, restrictTo } = require('../middleware/authMiddleware');

router.route('/doctor/:doctorId')
  .get(protect, getDoctorAppointments);

router.route('/:id/status')
  .put(protect, restrictTo('doctor', 'reception', 'admin'), updateAppointmentStatus);

module.exports = router;
