import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./AuthNotification.css";

export default function AuthNotification() {
  const location = useLocation();
  const navigate = useNavigate();
  const type = location.state?.type || "login";
  const message =
    type === "register"
      ? "Đăng ký tài khoản thành công! Bạn có thể đăng nhập ngay."
      : "Đăng nhập thành công!";

  return (
    <div className="auth-notification-container">
      <div className="auth-notification-message">{message}</div>
      <button
        className="auth-notification-btn"
        onClick={() => navigate("/login")}
      >
        Đăng nhập
      </button>
    </div>
  );
}
