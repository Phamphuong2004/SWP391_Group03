import axios from "axios";

const API_BASE = "/api/";

export const getTestPurposeById = (testPurposeId) =>
  axios.get(`${API_BASE}test-purpose/get-by-id/${testPurposeId}`);

export const createTestPurpose = (data) =>
  axios.post(`${API_BASE}test-purpose/create`, data);

export const updateTestPurpose = (testPurposeId, data) =>
  axios.put(`${API_BASE}test-purpose/update/${testPurposeId}`, data);

export const deleteTestPurpose = (testPurposeId) =>
  axios.delete(`${API_BASE}test-purpose/delete/${testPurposeId}`);
