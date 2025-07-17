import axios from "axios";

// Lấy payment theo paymentId
export const getPaymentById = async (paymentId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.get(`/api/payments/${paymentId}`, config);
  return res.data;
};

// Cập nhật payment theo paymentId
export const updatePayment = async (paymentId, paymentData, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.put(
    `/api/payments/${paymentId}`,
    paymentData,
    config
  );
  return res.data;
};

// Xóa payment theo paymentId
export const deletePayment = async (paymentId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.delete(`/api/payments/${paymentId}`, config);
  return res.data;
};

// Đặt trạng thái refund cho payment theo appointmentId
export const setPaymentStatusRefund = async (appointmentId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.post(
    `/api/payments/set-payment-status/refund/${appointmentId}`,
    {},
    config
  );
  return res.data;
};

// Tạo/refund payment theo appointmentId
export const refundPaymentByAppointmentId = async (appointmentId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.post(
    `/api/payments/refund/${appointmentId}`,
    {},
    config
  );
  return res.data;
};

// Tạo payment mới
export const createPayment = async (paymentData, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.post("/api/payments/create", paymentData, config);
  return res.data;
};

// Lấy danh sách payment theo appointmentId
export const getPaymentsByAppointmentId = async (appointmentId, token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.get(
    `/api/payments/appointment/${appointmentId}`,
    config
  );
  return res.data;
};

// Lấy tất cả payment
export const getAllPayments = async (token) => {
  const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
  const res = await axios.get("/api/payments/all", config);
  return res.data;
};
