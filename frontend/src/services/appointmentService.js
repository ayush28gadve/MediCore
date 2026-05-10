import api from './api';

const getDoctorAppointments = async (doctorId) => {
  const response = await api.get(`/appointments/doctor/${doctorId}`);
  return response.data;
};

const updateStatus = async (appointmentId, status) => {
  const response = await api.put(`/appointments/${appointmentId}/status`, { status });
  return response.data;
};

export const appointmentService = {
  getDoctorAppointments,
  updateStatus
};
