const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  patient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Patient',
    required: true,
  },
  doctor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  diagnosis: {
    type: String,
    required: true,
  },
  medicines: [{
    name: { type: String },
    dosage: { type: String }
  }],
  notes: {
    type: String,
  },
  followUpDate: {
    type: String,
  }
}, {
  timestamps: true,
});

const Prescription = mongoose.model('Prescription', prescriptionSchema);

module.exports = Prescription;
