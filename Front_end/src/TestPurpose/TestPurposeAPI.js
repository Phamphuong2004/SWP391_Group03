import axios from "axios";

const API_BASE = "/api/";

function getAuthHeader() {
  const userString = localStorage.getItem("user");
  const token = userString ? JSON.parse(userString).token : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getTestPurposeById = (testPurposeId) =>
  axios.get(`${API_BASE}test-purpose/get-by-id/${testPurposeId}`, {
    headers: getAuthHeader(),
  });

export const createTestPurpose = (data) =>
  axios.post(`${API_BASE}test-purpose/create`, data, {
    headers: getAuthHeader(),
  });

export const updateTestPurpose = (testPurposeId, data) =>
  axios.put(`${API_BASE}test-purpose/update/${testPurposeId}`, data, {
    headers: getAuthHeader(),
  });

export const deleteTestPurpose = (testPurposeId) =>
  axios.delete(`${API_BASE}test-purpose/delete/${testPurposeId}`, {
    headers: getAuthHeader(),
  });
