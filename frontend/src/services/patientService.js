import api from './api';

const register = async (patientData) => {
  const response = await api.post('/patients/register', patientData);
  return response.data;
};

const getAll = async () => {
  const response = await api.get('/patients');
  return response.data;
};

const getById = async (id) => {
  const response = await api.get(`/patients/${id}`);
  return response.data;
};

export const patientService = {
  register,
  getAll,
  getById
};
