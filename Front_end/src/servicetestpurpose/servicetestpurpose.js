import axios from "axios";

// Lấy danh sách mục đích xét nghiệm theo tên dịch vụ
export const getTestPurposesByServiceName = (serviceName) => {
  return axios.get(`/api/service-test-purpose/by-service-name/${serviceName}`);
};

// Lấy tất cả mục đích xét nghiệm theo tên dịch vụ (nếu cần lấy nhiều bản ghi)
export const getAllTestPurposesByServiceName = (serviceName) => {
  return axios.get(`/api/service-test-purpose/by-service-name-all/${serviceName}`);
};

// Tạo mới mục đích xét nghiệm
export const createTestPurpose = (data) => {
  return axios.post('/api/service-test-purpose/create', data);
};

// Cập nhật mục đích xét nghiệm
export const updateTestPurpose = (id, data) => {
  return axios.put(`/api/service-test-purpose/update/${id}`, data);
};

// Xóa mục đích xét nghiệm
export const deleteTestPurpose = (id) => {
  return axios.delete(`/api/service-test-purpose/delete/${id}`);
};
