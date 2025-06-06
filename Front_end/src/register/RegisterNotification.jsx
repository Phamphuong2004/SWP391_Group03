import React from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterNotification.css";

export default function RegisterNotification() {
  const navigate = useNavigate();

  return (
    <div className="register-notification-container">
      <h2 className="register-notification-title">Đặt lịch thành công!</h2>
      <p className="register-notification-message">
        Cảm ơn bạn đã đặt lịch xét nghiệm.
        <br />
        Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
      </p>
      <button
        className="register-notification-home-btn"
        onClick={() => navigate("/")}
      >
        Về trang chủ
      </button>
    </div>
  );
}
