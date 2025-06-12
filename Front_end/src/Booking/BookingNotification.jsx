import React from "react";
import { useNavigate } from "react-router-dom";
import "./BookingNotification.css";

export default function BookingNotification() {
  const navigate = useNavigate();

  return (
    <div className="booking-notification-container">
      <h2 className="booking-notification-title">Đặt lịch thành công!</h2>
      <p className="booking-notification-message">
        Cảm ơn bạn đã đặt lịch xét nghiệm.
        <br />
        Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
      </p>
      <button
        className="booking-notification-home-btn"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
}
