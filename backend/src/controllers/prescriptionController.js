const Prescription = require('../models/Prescription');
const Appointment = require('../models/Appointment');

// @desc    Create new prescription
// @route   POST /api/prescriptions/create
// @access  Private/Doctor
const createPrescription = async (req, res) => {
  const { patient, diagnosis, medicines, notes, followUpDate, appointmentId } = req.body;

  try {
    const prescription = await Prescription.create({
      patient,
      doctor: req.user._id,
      diagnosis,
      medicines,
      notes,
      followUpDate
    });

    // Mark appointment as Completed
    if (appointmentId) {
      await Appointment.findByIdAndUpdate(appointmentId, { status: 'Completed' });
    }

    res.status(201).json(prescription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get prescriptions for a specific patient
// @route   GET /api/prescriptions/:patientId
// @access  Private
const getPatientPrescriptions = async (req, res) => {
  try {
    const prescriptions = await Prescription.find({ patient: req.params.patientId })
      .populate('doctor', 'name department')
      .sort({ createdAt: -1 });
      
    res.json(prescriptions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPrescription,
  getPatientPrescriptions
};
