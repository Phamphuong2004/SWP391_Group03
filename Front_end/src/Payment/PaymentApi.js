import axios from "axios";

// Lấy payment theo paymentId
export const getPaymentById = async (paymentId, token) => {
  const res = await axios.get(`/api/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Cập nhật payment theo paymentId
export const updatePayment = async (paymentId, paymentData, token) => {
  const res = await axios.put(`/api/payments/${paymentId}`, paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Xóa payment theo paymentId
export const deletePayment = async (paymentId, token) => {
  const res = await axios.delete(`/api/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Đặt trạng thái refund cho payment theo appointmentId
export const setPaymentStatusRefund = async (appointmentId, token) => {
  const res = await axios.post(
    `/api/payments/set-payment-status/refund/${appointmentId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Tạo/refund payment theo appointmentId
export const refundPaymentByAppointmentId = async (appointmentId, token) => {
  const res = await axios.post(
    `/api/payments/refund/${appointmentId}`,
    {},
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
  return res.data;
};

// Tạo payment mới
export const createPayment = async (paymentData, token) => {
  const res = await axios.post("/api/payments/create", paymentData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Lấy danh sách payment theo appointmentId
export const getPaymentsByAppointmentId = async (appointmentId, token) => {
  const res = await axios.get(`/api/payments/appointment/${appointmentId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Lấy tất cả payment
export const getAllPayments = async (token) => {
  const res = await axios.get("/api/payments/all", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
