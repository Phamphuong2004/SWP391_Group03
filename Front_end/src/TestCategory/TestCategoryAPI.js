import axios from "axios";

const API_BASE = "/api/";

function getAuthHeader() {
  const userString = localStorage.getItem("user");
  const token = userString ? JSON.parse(userString).token : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const getTestCategoryById = (id) =>
  axios.get(`${API_BASE}test-category/get-by-id/${id}`, {
    headers: getAuthHeader(),
  });

export const getAllTestCategoriesByService = () =>
  axios.get(`${API_BASE}test-category/by-service/all`, {
    headers: getAuthHeader(),
  });

export const getActiveTestCategoriesByService = (serviceName) =>
  axios.get(
    `${API_BASE}test-category/by-service/active?serviceName=${encodeURIComponent(
      serviceName
    )}`,
    {
      headers: getAuthHeader(),
    }
  );

export const createTestCategory = (data) =>
  axios.post(`${API_BASE}test-category/create`, data, {
    headers: getAuthHeader(),
  });

export const updateTestCategory = (id, data) =>
  axios.put(`${API_BASE}test-category/update/${id}`, data, {
    headers: getAuthHeader(),
  });

export const deleteTestCategory = (id) =>
  axios.delete(`${API_BASE}test-category/delete/${id}`, {
    headers: getAuthHeader(),
  });
