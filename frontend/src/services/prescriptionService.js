import api from './api';

const create = async (prescriptionData) => {
  const response = await api.post('/prescriptions/create', prescriptionData);
  return response.data;
};

const getPatientPrescriptions = async (patientId) => {
  const response = await api.get(`/prescriptions/${patientId}`);
  return response.data;
};

export const prescriptionService = {
  create,
  getPatientPrescriptions
};
