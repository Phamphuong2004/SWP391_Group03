import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ADNTestingServices from "../listOfServices";
import "./Payment.css";
import { toast } from "react-toastify";
import axios from "axios";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment: appointmentFromState } = location.state || {};

  const [appointment, setAppointment] = useState(appointmentFromState || null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [editForm, setEditForm] = useState(null);

  // Lấy lại thông tin lịch hẹn nếu không có trong state
  useEffect(() => {
    if (!appointment) {
      const appointmentId = localStorage.getItem("lastServiceId");
      if (appointmentId) {
        setLoading(true);
        axios
          .get(`/api/view-appointment/${appointmentId}`)
          .then((res) => {
            setAppointment(res.data);
            setEditForm({
              fullName: res.data.fullName,
              appointmentDate: res.data.appointmentDate,
              collectionTime: res.data.collectionTime,
              serviceType: res.data.serviceType,
            });
          })
          .catch(() => {
            toast.error("Không tìm thấy thông tin lịch hẹn");
          })
          .finally(() => setLoading(false));
      }
    } else {
      setEditForm({
        fullName: appointment.fullName,
        appointmentDate: appointment.appointmentDate,
        collectionTime: appointment.collectionTime,
        serviceType: appointment.serviceType,
      });
    }
  }, [appointment]);

  if (loading) return <div>Đang tải thông tin lịch hẹn...</div>;

  if (!appointment || !editForm) {
    return (
      <div className="payment-container">
        <div className="payment-card" style={{ textAlign: "center" }}>
          <h1 className="payment-title">Không tìm thấy thông tin lịch hẹn</h1>
          <p style={{ margin: "1.5rem 0" }}>
            Vui lòng quay lại và đặt lịch hẹn trước khi thanh toán.
          </p>
          <button
            onClick={() => navigate("/booking")}
            className="btn btn-primary"
          >
            Đặt lịch ngay
          </button>
        </div>
      </div>
    );
  }

  const user =
    appointment.user || JSON.parse(localStorage.getItem("user") || "{}");

  const serviceDetails = ADNTestingServices.find(
    (service) => service.testType === editForm.serviceType
  );

  const getTime = (str) => {
    if (!str || typeof str !== "string" || str.length < 16) return "";
    return str.substring(11, 16);
  };

  // Xử lý thay đổi form chỉnh sửa
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thanh toán
  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.warn("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    setLoading(true);
    try {
      // Cập nhật thông tin chỉnh sửa trước khi thanh toán (nếu có thay đổi)
      await axios.put(`/api/update-appointment/${appointment.appointmentId}`, {
        ...editForm,
        paymentStatus: "PAID",
      });
      toast.success(
        "Thanh toán thành công! Lịch hẹn của bạn đã được xác nhận."
      );
      setPaymentSuccess(true);
      // Cập nhật lại appointment để hiển thị thông tin mới
      setAppointment((prev) => ({
        ...prev,
        ...editForm,
        paymentStatus: "PAID",
      }));
    } catch (err) {
      toast.error("Thanh toán thất bại. Vui lòng thử lại!");
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

  // Hiển thị màn hình thanh toán thành công
  if (paymentSuccess) {
    return (
      <div className="payment-container">
        <div className="payment-card success-card">
          <div className="success-icon">✓</div>
          <h1 className="payment-title success-title">
            Thanh toán thành công!
          </h1>
          <div className="success-message">
            <p>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.</p>
            <p>
              Lịch hẹn của bạn đã được xác nhận và sẽ được xử lý trong thời gian
              sớm nhất.
            </p>
          </div>
          <div className="appointment-summary">
            <h3>Thông tin lịch hẹn:</h3>
            <p>
              <strong>Họ và tên:</strong> {editForm.fullName}
            </p>
            <p>
              <strong>Ngày hẹn:</strong>{" "}
              {new Date(editForm.appointmentDate).toLocaleDateString()}
            </p>
            <p>
              <strong>Giờ lấy mẫu:</strong> {getTime(editForm.collectionTime)}
            </p>
            <p>
              <strong>Loại dịch vụ:</strong> {editForm.serviceType}
            </p>
            <p>
              <strong>Số tiền:</strong> {serviceDetails?.price}
            </p>
          </div>
          <div className="success-actions">
            <button onClick={handleBackToHome} className="btn-home">
              Quay lại trang chủ
            </button>
            <button
              onClick={() => navigate("/service-tracking")}
              className="btn-history"
            >
              Theo dõi đơn
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">Xác nhận và Thanh toán</h1>

        <div className="appointment-details">
          <h2>Chi tiết lịch hẹn</h2>
          <label>
            <strong>Họ và tên:</strong>
            <input
              type="text"
              name="fullName"
              value={editForm.fullName}
              onChange={handleEditChange}
            />
          </label>
          <label>
            <strong>Ngày hẹn:</strong>
            <input
              type="date"
              name="appointmentDate"
              value={editForm.appointmentDate?.slice(0, 10) || ""}
              onChange={handleEditChange}
            />
          </label>
          <label>
            <strong>Giờ lấy mẫu:</strong>
            <input
              type="time"
              name="collectionTime"
              value={getTime(editForm.collectionTime)}
              onChange={(e) => {
                // Cập nhật lại collectionTime theo ISO
                const date = editForm.appointmentDate?.slice(0, 10) || "";
                setEditForm((prev) => ({
                  ...prev,
                  collectionTime:
                    date && e.target.value
                      ? `${date}T${e.target.value}:00`
                      : "",
                }));
              }}
            />
          </label>
          <label>
            <strong>Loại dịch vụ:</strong>
            <input
              type="text"
              name="serviceType"
              value={editForm.serviceType}
              onChange={handleEditChange}
            />
          </label>
        </div>

        {serviceDetails && (
          <div className="service-details">
            <h2>Chi tiết dịch vụ</h2>
            <p>
              <strong>Mô tả:</strong> {serviceDetails.description}
            </p>
            <p className="price">
              <strong>Tổng tiền:</strong> {serviceDetails.price}
            </p>
          </div>
        )}

        <div className="payment-methods">
          <h2>Chọn phương thức thanh toán</h2>
          <div className="method-option">
            <input
              type="radio"
              id="cod"
              name="paymentMethod"
              value="cod"
              checked={paymentMethod === "cod"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="cod">Thanh toán khi đến lấy mẫu (COD)</label>
          </div>
          <div className="method-option">
            <input
              type="radio"
              id="online"
              name="paymentMethod"
              value="online"
              checked={paymentMethod === "online"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />
            <label htmlFor="online">
              Thanh toán trực tuyến (VNPAY, Momo, ...)
            </label>
          </div>
        </div>

        <button
          className="btn btn-primary"
          onClick={handlePayment}
          disabled={loading}
        >
          Xác nhận & Thanh toán
        </button>
      </div>
    </div>
  );
};

export default Payment;
