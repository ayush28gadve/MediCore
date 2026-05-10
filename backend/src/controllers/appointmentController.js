const Appointment = require('../models/Appointment');

// @desc    Get appointments for a specific doctor
// @route   GET /api/appointments/doctor/:doctorId
// @access  Private/Doctor
const getDoctorAppointments = async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    
    // In a real app we might filter by today, but for MVP we get all
    const appointments = await Appointment.find({ doctor: req.params.doctorId })
      .populate('patient')
      .sort({ createdAt: 1 });
      
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update appointment status
// @route   PUT /api/appointments/:id/status
// @access  Private/Doctor
const updateAppointmentStatus = async (req, res) => {
  const { status } = req.body;
  try {
    const appointment = await Appointment.findById(req.params.id);
    
    if (appointment) {
      appointment.status = status;
      const updatedAppointment = await appointment.save();
      res.json(updatedAppointment);
    } else {
      res.status(404).json({ message: 'Appointment not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getDoctorAppointments,
  updateAppointmentStatus
};
