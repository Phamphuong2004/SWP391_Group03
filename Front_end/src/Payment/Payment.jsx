import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ADNTestingServices from "../listOfServices";
import "./Payment.css";
import { toast } from "react-toastify";
import { createPayment } from "./PaymentApi";

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { appointment: appointmentFromState } = location.state || {};

  const [appointment, setAppointment] = useState(appointmentFromState || null);
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    if (!appointment) {
      const appointmentId = localStorage.getItem("lastServiceId");
      if (appointmentId) {
        setLoading(true);
        fetch(`/api/view-appointment/${appointmentId}`)
          .then((res) => res.json())
          .then((data) => {
            setAppointment(data);
            setEditForm({
              fullName: data.fullName,
              appointmentDate: data.appointmentDate,
              collectionTime: data.collectionSampleTime, // lấy đúng trường giờ lấy mẫu
              serviceType: data.serviceType,
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
        collectionTime: appointment.collectionSampleTime, // lấy đúng trường giờ lấy mẫu
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

  const serviceDetails = ADNTestingServices.find(
    (service) => service.testType === editForm.serviceType
  );

  const getTime = (str) => {
    if (!str || typeof str !== "string" || str.length < 16) return "";
    return str.substring(11, 16);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý thanh toán sử dụng PaymentApi.js
  const handlePayment = async () => {
    if (!paymentMethod) {
      toast.warn("Vui lòng chọn phương thức thanh toán.");
      return;
    }
    setLoading(true);
    try {
      const userString = localStorage.getItem("user");
      const token = userString ? JSON.parse(userString).token : null;
      let status = "PENDING";
      if (paymentMethod.toLowerCase() === "online") status = "PAID";
      const paymentData = {
        appointmentId: appointment.appointmentId,
        amount: serviceDetails?.price || 1,
        paymentMethod: paymentMethod.toUpperCase(),
        status,
        paymentDate: new Date().toISOString(),
      };
      await createPayment(paymentData, token); // truyền token nếu có, không có thì truyền null
      toast.success(
        "Thanh toán thành công! Lịch hẹn của bạn đã được xác nhận."
      );
      setPaymentSuccess(true);
    } catch (err) {
      toast.error(
        "Thanh toán thất bại. " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate("/");
  };

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
    <div className="payment-bg">
      <div className="payment-card payment-shadow">
        <h1 className="payment-title">Xác nhận và Thanh toán</h1>
        <div className="appointment-details">
          <h2 className="section-title">Chi tiết lịch hẹn</h2>
          <div className="form-row">
            <label>
              <span className="label-title">Họ và tên:</span>
              <input
                type="text"
                name="fullName"
                value={editForm.fullName}
                onChange={handleEditChange}
                className="input-field"
              />
            </label>
            <label>
              <span className="label-title">Ngày hẹn:</span>
              <input
                type="date"
                name="appointmentDate"
                value={editForm.appointmentDate?.slice(0, 10) || ""}
                onChange={handleEditChange}
                className="input-field"
              />
            </label>
            <label>
              <span className="label-title">Giờ lấy mẫu:</span>
              <input
                type="text"
                value={editForm?.collectionTime || ""}
                readOnly
                disabled
              />
            </label>
            <label>
              <span className="label-title">Loại dịch vụ:</span>
              <input
                type="text"
                name="serviceType"
                value={editForm.serviceType}
                onChange={handleEditChange}
                className="input-field"
              />
            </label>
          </div>
        </div>
        {serviceDetails && (
          <div className="service-details">
            <h2 className="section-title">Chi tiết dịch vụ</h2>
            <p>
              <strong>Mô tả:</strong> {serviceDetails.description}
            </p>
            <p className="price">
              <strong>Tổng tiền:</strong> {serviceDetails.price}
            </p>
          </div>
        )}
        <div className="payment-methods">
          <h2 className="section-title">Chọn phương thức thanh toán</h2>
          <div className="method-options">
            <label
              className={`method-option radio-large ${
                paymentMethod === "cash" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                id="cash"
                name="paymentMethod"
                value="cash"
                checked={paymentMethod === "cash"}
                onChange={() => setPaymentMethod("cash")}
              />
              <span className="radio-icon">💵</span>
              <span>Thanh toán khi đến lấy mẫu (COD)</span>
            </label>
            <label
              className={`method-option radio-large ${
                paymentMethod === "online" ? "selected" : ""
              }`}
            >
              <input
                type="radio"
                id="online"
                name="paymentMethod"
                value="online"
                checked={paymentMethod === "online"}
                onChange={() => setPaymentMethod("online")}
              />
              <span className="radio-icon">💳</span>
              <span>Thanh toán trực tuyến (VNPAY, Momo, ...)</span>
            </label>
          </div>
        </div>
        {paymentMethod === "online" && (
          <div className="qr-section">
            <h3>Quét mã QR để thanh toán</h3>
            <div className="qr-box">
              <img
                src="z6747527619716_88085c5bdad6c2700ec8923daaf73e09.jpg"
                alt="QR code"
                className="qr-img"
              />
            </div>
            <p className="qr-note">
              Vui lòng quét mã QR bằng app ngân hàng hoặc ví điện tử để thanh
              toán.
            </p>
            <ol className="qr-guide">
              <li>Mở ứng dụng ngân hàng hoặc ví điện tử trên điện thoại.</li>
              <li>Chọn tính năng quét mã QR.</li>
              <li>Quét mã QR hiển thị trên màn hình.</li>
              <li>Kiểm tra thông tin và nhập số tiền (nếu cần).</li>
              <li>Xác nhận thanh toán.</li>
              <li>
                Nhấn <b>"Xác nhận & Thanh toán"</b> bên dưới sau khi hoàn tất.
              </li>
            </ol>
          </div>
        )}
        <button
          className="btn-confirm"
          onClick={handlePayment}
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Xác nhận & Thanh toán"}
        </button>
      </div>
    </div>
  );
};

export default Payment;
