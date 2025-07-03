import axios from "axios";

const API_BASE = "/api/results";

export const getResultList = () => axios.get(`${API_BASE}/getList`);

export const getResultById = (resultId) => axios.get(`${API_BASE}/${resultId}`);

export const createResult = (data) => axios.post(`${API_BASE}/create`, data);

export const updateResult = (resultId, data) =>
  axios.put(`${API_BASE}/${resultId}`, data);

export const deleteResult = (resultId) =>
  axios.delete(`${API_BASE}/${resultId}`);
