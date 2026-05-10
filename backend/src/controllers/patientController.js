const Patient = require('../models/Patient');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

// @desc    Register a new patient & create appointment
// @route   POST /api/patients/register
// @access  Private/Reception
const registerPatient = async (req, res) => {
  const {
    fullName,
    age,
    gender,
    mobile,
    address,
    bloodGroup,
    allergies,
    medicalHistory,
    doctorId,
    appointmentTime,
    symptoms
  } = req.body;

  try {
    // Generate simple Patient ID (e.g. MC-005)
    const count = await Patient.countDocuments();
    const patientId = `MC-${String(count + 1).padStart(3, '0')}`;

    const patient = await Patient.create({
      patientId,
      fullName,
      age,
      gender,
      mobile,
      address,
      bloodGroup,
      allergies,
      medicalHistory,
      createdBy: req.user._id,
      assignedDoctor: doctorId
    });

    if (patient) {
      // Create Appointment
      const today = new Date().toISOString().split('T')[0];
      const apptCount = await Appointment.countDocuments({ appointmentDate: today, doctor: doctorId });
      const queueNumber = `Q-${String(apptCount + 1).padStart(2, '0')}`;

      const appointment = await Appointment.create({
        patient: patient._id,
        doctor: doctorId,
        symptoms: symptoms || 'General Checkup',
        appointmentDate: today,
        appointmentTime: appointmentTime || '10:00 AM',
        queueNumber
      });

      res.status(201).json({
        patient,
        appointment
      });
    } else {
      res.status(400).json({ message: 'Invalid patient data' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all patients
// @route   GET /api/patients
// @access  Private
const getPatients = async (req, res) => {
  try {
    const patients = await Patient.find({}).populate('assignedDoctor', 'name department');
    res.json(patients);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get patient by ID
// @route   GET /api/patients/:id
// @access  Private
const getPatientById = async (req, res) => {
  try {
    const patient = await Patient.findById(req.params.id).populate('assignedDoctor', 'name department');
    if (patient) {
      res.json(patient);
    } else {
      res.status(404).json({ message: 'Patient not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  registerPatient,
  getPatients,
  getPatientById
};
