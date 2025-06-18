import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./RegisterNotification.css";

export default function RegisterNotification() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="register-notification-container">
      <h2 className="register-notification-title">Đăng ký thành công!</h2>
      <p className="register-notification-message">
        Cảm ơn bạn đã đăng ký tài khoản.
        <br />
        Bạn sẽ được chuyển về trang đăng nhập trong giây lát.
      </p>
    </div>
  );
}
