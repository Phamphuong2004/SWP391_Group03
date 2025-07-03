import axios from "axios";

const API_BASE = "/api/kit";

function getAuthHeader() {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  const token = user?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

// Tạo kit component mới cho service
export const createKitComponent = (serviceId, data) =>
  axios.post(`${API_BASE}/create/${serviceId}`, data, {
    headers: getAuthHeader(),
  });

// Cập nhật kit component
export const updateKitComponent = (kitComponentId, data) =>
  axios.put(`${API_BASE}/update/${kitComponentId}`, data, {
    headers: getAuthHeader(),
  });

// Lấy kit component theo serviceId
export const getKitByServiceId = (serviceId) =>
  axios.get(`${API_BASE}/get/${serviceId}`, { headers: getAuthHeader() });

// Xóa kit component
export const deleteKitComponent = (kitComponentId) =>
  axios.delete(`${API_BASE}/delete/${kitComponentId}`, {
    headers: getAuthHeader(),
  });
