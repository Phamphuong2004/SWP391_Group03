import React, { useState } from "react";
import "./Notification.css";

export default function Notification() {
  const [show, setShow] = useState(true);

  if (!show) return null;

  return (
    <div className="notification-bar">
      <span>
        🎉 Ưu đãi đặc biệt: Giảm 10% cho khách hàng đăng ký xét nghiệm ADN trong
        tháng này!
      </span>
      <button className="notification-close" onClick={() => setShow(false)}>
        &times;
      </button>
    </div>
  );
}
