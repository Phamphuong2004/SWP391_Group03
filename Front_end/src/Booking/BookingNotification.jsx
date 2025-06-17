import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./BookingNotification.css";

export default function BookingNotification() {
  const navigate = useNavigate();
  const serviceId = localStorage.getItem("lastServiceId");

  // Tự động chuyển sau 5 giây
  useEffect(() => {
    if (serviceId) {
      const timer = setTimeout(() => {
        navigate(`/service-tracking/${serviceId}`);
      }, 5000); // 5 giây
      return () => clearTimeout(timer);
    }
  }, [navigate, serviceId]);

  return (
    <div className="booking-notification-container">
      <h2 className="booking-notification-title">Đặt lịch thành công!</h2>
      <p className="booking-notification-message">
        Cảm ơn bạn đã đặt lịch xét nghiệm.
        <br />
        Chúng tôi sẽ liên hệ xác nhận trong thời gian sớm nhất.
        <br />
        <b>Bạn sẽ được chuyển sang trang theo dõi đơn trong giây lát...</b>
      </p>
    </div>
  );
}
