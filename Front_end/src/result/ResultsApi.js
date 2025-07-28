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

export const createResult = (data, token) => {
  // Nếu là FormData (upload file), KHÔNG set Content-Type thủ công
  const isFormData = data instanceof FormData;
  return axios.post(`${API_BASE}/create`, data, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });
};

export const updateResult = (resultId, data, token) => {
  const isFormData = data instanceof FormData;
  return axios.put(`${API_BASE}/${resultId}`, data, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
    },
  });
};

export const deleteResult = (resultId, token) =>
  axios.delete(`${API_BASE}/${resultId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

export const getResultByAppointmentId = (appointmentId, token) =>
  axios.get(`${API_BASE}/appointment/${appointmentId}`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

// Download file kết quả
export const downloadResultFile = (fileName) => {
  // Trả về link trực tiếp, FE nên dùng window.open hoặc gán href cho <a>
  return `${API_BASE}/download/${fileName}`;
};

// Upload file kết quả
export const uploadResultFile = async (file, token) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post("/api/results/upload", formData, {
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  });
  return res.data; // trả về tên file
};
