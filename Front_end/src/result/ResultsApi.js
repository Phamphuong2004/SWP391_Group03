import axios from "axios";

const API_BASE = "/api/results";

export const getResultList = (token) =>
  axios.get(`${API_BASE}/getList`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const getResultById = (resultId, token) =>
  axios.get(`${API_BASE}/${resultId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const createResult = (data, token) =>
  axios.post(`${API_BASE}/create`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const updateResult = (resultId, data, token) =>
  axios.put(`${API_BASE}/${resultId}`, data, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const deleteResult = (resultId, token) =>
  axios.delete(`${API_BASE}/${resultId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const getResultByAppointmentId = (appointmentId, token) =>
  axios.get(`${API_BASE}/appointment/${appointmentId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
