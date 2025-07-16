import axios from "axios";

// Hàm lấy token từ localStorage
const getAuthHeader = () => {
  const token = JSON.parse(localStorage.getItem("user") || "null")?.token;
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Lấy danh sách mục đích xét nghiệm theo tên dịch vụ
export const getTestPurposesByServiceName = (serviceName) => {
  return axios.get(`/api/service-test-purpose/by-service-name/${serviceName}`, {
    headers: getAuthHeader(),
  });
};

// Lấy tất cả mục đích xét nghiệm theo tên dịch vụ (nếu cần lấy nhiều bản ghi)
export const getAllTestPurposesByServiceName = (serviceName) => {
  return axios.get(
    `/api/service-test-purpose/by-service-name-all/${serviceName}`,
    {
      headers: getAuthHeader(),
    }
  );
};

// Tạo mới mục đích xét nghiệm
export const createTestPurpose = (data) => {
  return axios.post("/api/service-test-purpose/create", data, {
    headers: getAuthHeader(),
  });
};

// Cập nhật mục đích xét nghiệm
export const updateTestPurpose = (id, data) => {
  return axios.put(`/api/service-test-purpose/update/${id}`, data, {
    headers: getAuthHeader(),
  });
};

// Xóa mục đích xét nghiệm
export const deleteTestPurpose = (id) => {
  return axios.delete(`/api/service-test-purpose/delete/${id}`, {
    headers: getAuthHeader(),
  });
};
