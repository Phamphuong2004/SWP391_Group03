import React, { useState } from "react";
import axios from "axios";
import "./ServiceTracking.css";

const formatDate = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Date";
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  } catch (e) {
    return "Invalid Date";
  }
};

const formatTime = (isoString) => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return "Invalid Time";
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${hours}:${minutes}:${seconds}`;
  } catch (e) {
    return "Invalid Time";
  }
};

const statusTranslations = {
  PENDING: "Chờ xác nhận",
  CONFIRMED: "Đã xác nhận",
  SAMPLING: "Đang lấy mẫu",
  TESTING: "Đang xét nghiệm",
  COMPLETED: "Hoàn thành",
};

const StatusTimeline = ({ status }) => {
  const mainStatuses = [
    "PENDING",
    "CONFIRMED",
    "SAMPLING",
    "TESTING",
    "COMPLETED",
  ];
  if (status === "CANCELLED") {
    return (
      <div className="status-cancelled-container">
        <span className="cancelled-icon">✖</span>
        <p className="cancelled-text">Lịch hẹn đã bị hủy</p>
      </div>
    );
  }
  const currentStatusIndex = mainStatuses.indexOf(status);
  return (
    <div className="status-timeline">
      <div className="status-line-bg"></div>
      <div
        className="status-line-progress"
        style={{
          width: `${(currentStatusIndex / (mainStatuses.length - 1)) * 100}%`,
        }}
      ></div>
      {mainStatuses.map((s, index) => (
        <div
          key={s}
          className={`status-point ${
            index <= currentStatusIndex ? "completed" : ""
          } ${index === currentStatusIndex ? "current" : ""}`}
        >
          <div className="status-dot"></div>
          <div className="status-label">{statusTranslations[s] || s}</div>
        </div>
      ))}
    </div>
  );
};

const DetailItem = ({ icon, label, value }) => (
  <div className="detail-item">
    <span className="detail-icon">
      <i className={`fa-solid ${icon}`}></i>
    </span>
    <div className="detail-text">
      <span className="detail-label">{label}</span>
      <span className="detail-value">{value || "N/A"}</span>
    </div>
  </div>
);

export default function GuestServiceTracking() {
  const [guestEmail, setGuestEmail] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestList, setGuestList] = useState([]);
  const [guestError, setGuestError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGuestSearch = async () => {
    setLoading(true);
    setGuestError(null);
    setAppointment(null);
    setGuestList([]);
    try {
      const res = await axios.get(
        `/api/view-appointment-guest?email=${encodeURIComponent(
          guestEmail
        )}&phone=${encodeURIComponent(guestPhone)}`
      );
      let arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      if (arr && arr.length > 0) {
        setGuestList(arr);
      } else {
        setGuestList([]);
        setGuestError("Không tìm thấy đơn nào cho thông tin này.");
      }
    } catch (err) {
      setGuestList([]);
      setGuestError("Không tìm thấy đơn nào cho thông tin này.");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectAppointment = (item) => {
    setAppointment(item);
  };

  const handleBackToSearch = () => {
    setAppointment(null);
    setGuestList([]);
    setGuestError(null);
  };

  // Form tra cứu
  if (!guestList.length && !appointment) {
    return (
      <div className="guest-tracking-form">
        <h2>Tra cứu đơn cho khách</h2>
        <input
          type="email"
          placeholder="Email"
          value={guestEmail}
          onChange={(e) => setGuestEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Số điện thoại"
          value={guestPhone}
          onChange={(e) => setGuestPhone(e.target.value)}
        />
        <button
          onClick={handleGuestSearch}
          disabled={!guestEmail || !guestPhone || loading}
        >
          {loading ? "Đang tra cứu..." : "Tra cứu"}
        </button>
        {guestError && (
          <div style={{ color: "#e74c3c", marginTop: 12, fontWeight: 600 }}>
            {guestError}
          </div>
        )}
      </div>
    );
  }

  // Danh sách đơn
  if (guestList.length > 0 && !appointment) {
    return (
      <div className="guest-tracking-list">
        <h2 style={{ textAlign: "center", margin: "24px 0" }}>
          Lịch sử Đặt lịch của bạn
        </h2>
        <div
          style={{
            display: "flex",
            gap: 32,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {guestList.map((item) => (
            <div
              key={item.appointmentId}
              style={{
                background: "#fff",
                borderRadius: 16,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                padding: 24,
                minWidth: 300,
                maxWidth: 340,
                marginBottom: 24,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
            >
              <div
                style={{ fontWeight: "bold", fontSize: 18, marginBottom: 8 }}
              >
                {item.serviceType || "Dịch vụ ADN"}
                <span
                  style={{
                    background: "#f7e7b7",
                    color: "#bfa100",
                    borderRadius: 8,
                    padding: "2px 10px",
                    fontSize: 14,
                    marginLeft: 12,
                  }}
                >
                  {item.status}
                </span>
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>Mã đơn:</b> {item.appointmentId}
              </div>
              <div style={{ marginBottom: 8 }}>
                <b>Ngày hẹn:</b> {formatDate(item.appointmentDate)}
              </div>
              <div style={{ marginBottom: 16 }}>
                <b>Khách hàng:</b> {item.fullName}
              </div>
              <button
                style={{
                  background: "#3b82f6",
                  color: "#fff",
                  border: "none",
                  borderRadius: 8,
                  padding: "10px 0",
                  width: "100%",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => handleSelectAppointment(item)}
              >
                Theo dõi chi tiết
              </button>
            </div>
          ))}
        </div>
        <button onClick={handleBackToSearch} style={{ marginTop: 24 }}>
          Quay lại tra cứu
        </button>
      </div>
    );
  }

  // Chi tiết đơn
  if (appointment) {
    return (
      <div className="tracking-container">
        <div className="tracking-header">
          <h1>Theo dõi lịch hẹn</h1>
          <p>Kiểm tra trạng thái và thông tin chi tiết cho lịch hẹn của bạn.</p>
        </div>
        <button onClick={handleBackToSearch} style={{ marginBottom: 24 }}>
          Quay lại tra cứu
        </button>
        <div className="tracking-card status-card">
          <h3>Trạng thái đơn hàng</h3>
          <StatusTimeline status={appointment.status} />
        </div>
        <div className="tracking-card details-card">
          <h3>Thông tin chi tiết</h3>
          <div className="detail-grid">
            <DetailItem
              icon="fa-user"
              label="Họ tên"
              value={appointment.fullName}
            />
            <DetailItem
              icon="fa-envelope"
              label="Email"
              value={appointment.email}
            />
            <DetailItem
              icon="fa-phone"
              label="Số điện thoại"
              value={appointment.phone}
            />
            <DetailItem
              icon="fa-calendar-days"
              label="Ngày sinh"
              value={formatDate(appointment.dob)}
            />
            <DetailItem
              icon="fa-venus-mars"
              label="Giới tính"
              value={appointment.gender}
            />
            <DetailItem
              icon="fa-map-marker-alt"
              label="Địa chỉ lấy mẫu"
              value={`${appointment.district}, ${appointment.province}`}
            />
            <DetailItem
              icon="fa-calendar-days"
              label="Ngày hẹn"
              value={formatDate(appointment.appointmentDate)}
            />
            <DetailItem
              icon="fa-clock"
              label="Giờ hẹn"
              value={formatTime(appointment.appointmentDate)}
            />
            <DetailItem
              icon="fa-calendar-check"
              label="Ngày lấy mẫu"
              value={formatDate(appointment.collectionSampleTime)}
            />
            <DetailItem
              icon="fa-hourglass-half"
              label="Giờ lấy mẫu"
              value={formatTime(appointment.collectionSampleTime)}
            />
            <DetailItem
              icon="fa-dna"
              label="Loại dịch vụ"
              value={appointment.serviceType}
            />
            <DetailItem
              icon="fa-bullseye"
              label="Mục đích"
              value={appointment.testPurpose}
            />
            <DetailItem
              icon="fa-tags"
              label="Phân loại"
              value={appointment.testCategory}
            />
            <DetailItem
              icon="fa-sticky-note"
              label="Ghi chú"
              value={appointment.note}
            />
          </div>
        </div>
      </div>
    );
  }
}
