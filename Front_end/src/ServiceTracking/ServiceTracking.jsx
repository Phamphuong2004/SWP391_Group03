import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import "./ServiceTracking.css";

// Helper functions to format date and time
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

// Status Timeline Component
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

// Detail Item Component
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

const ServiceTracking = () => {
  const { appointmentId } = useParams();
  const navigate = useNavigate();
  const { state } = useLocation();

  // Lấy user hiện tại
  const user = JSON.parse(localStorage.getItem("user"));

  // Nếu user đăng nhập, xóa localStorage guest để tránh nhầm lẫn
  useEffect(() => {
    if (user && localStorage.getItem("lastGuestAppointment")) {
      localStorage.removeItem("lastGuestAppointment");
    }
  }, [user]);

  // State cho guest
  const [guestEmail, setGuestEmail] = useState(state?.guestEmail || "");
  const [guestPhone, setGuestPhone] = useState(state?.guestPhone || "");
  const [guestAppointmentId, setGuestAppointmentId] = useState(
    state?.appointmentId || ""
  );
  const [guestList, setGuestList] = useState([]);
  const [guestError, setGuestError] = useState(null);
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guestMode, setGuestMode] = useState(
    !!(state?.guestEmail && state?.guestPhone)
  );

  // Debug state ở đầu component
  console.log(
    "guestMode:",
    guestMode,
    "guestList:",
    guestList,
    "appointment:",
    appointment,
    "loading:",
    loading,
    "guestError:",
    guestError
  );

  // Khi guest tra cứu, gọi API và lưu localStorage
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
      console.log("API guest trả về:", res.data);
      let arr = Array.isArray(res.data) ? res.data : res.data ? [res.data] : [];
      console.log("Mảng arr sau khi xử lý:", arr);
      if (arr && arr.length > 0) {
        setGuestList(arr);
        // Lưu vào localStorage
        localStorage.setItem(
          "lastGuestAppointment",
          JSON.stringify({
            email: guestEmail,
            phone: guestPhone,
            appointmentId: arr[0]?.appointmentId || "",
          })
        );
        setGuestMode(true);
      } else {
        // Không có đơn, reset về form và show lỗi
        setGuestList([]);
        setGuestMode(false);
        setGuestError("Không tìm thấy đơn nào cho thông tin này.");
        localStorage.removeItem("lastGuestAppointment");
      }
    } catch (err) {
      setGuestList([]);
      setGuestMode(false);
      setGuestError("Không tìm thấy đơn nào cho thông tin này.");
      localStorage.removeItem("lastGuestAppointment");
      console.error("Lỗi khi tra cứu guest:", err);
    } finally {
      setLoading(false);
    }
  };

  // Khi chọn chi tiết đơn
  const handleSelectAppointment = (item) => {
    setAppointment(item);
    setGuestAppointmentId(item.appointmentId);
    // Cập nhật localStorage để ưu tiên đơn này
    localStorage.setItem(
      "lastGuestAppointment",
      JSON.stringify({
        email: guestEmail,
        phone: guestPhone,
        appointmentId: item.appointmentId,
      })
    );
  };

  // Khi bấm quay lại tra cứu
  const handleBackToSearch = () => {
    setAppointment(null);
    setGuestAppointmentId("");
    setGuestList([]);
    setGuestError(null);
    setGuestMode(false);
  };

  // Nếu user đăng nhập, chỉ cho xem lịch sử user
  if (user && user.token) {
    // ... giữ nguyên logic cho user ...
    // ... existing code ...
  }

  // Guest: Nếu chưa nhập email/phone hoặc chưa tra cứu, hiển thị form
  if (!guestMode) {
    console.log("Render: guest form");
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

  // Guest: Nếu có danh sách đơn, chưa chọn chi tiết
  if (guestList.length > 0 && !appointment) {
    console.log("Render: guest list");
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

  // Guest: Nếu đang xem chi tiết đơn
  if (appointment) {
    console.log("Render: guest detail");
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
              icon="fa-cake-candles"
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

  // Guest: Nếu guestMode=true nhưng guestList rỗng, render lại form tra cứu
  if (guestMode && guestList.length === 0 && !loading) {
    console.log("Render: guest form (guestMode=true, guestList rỗng)");
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

  // Loading
  if (loading) {
    console.log("Render: loading");
    return (
      <div className="tracking-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải thông tin lịch hẹn...</p>
        </div>
      </div>
    );
  }

  // Lỗi chung
  if (error) {
    console.log("Render: error");
    return (
      <div className="tracking-container">
        <div className="error-message">
          <h3>Rất tiếc, đã có lỗi xảy ra</h3>
          <p>{error}</p>
          <button onClick={() => navigate("/history")} className="btn-back">
            Quay về Lịch sử
          </button>
        </div>
      </div>
    );
  }

  // Fallback render nếu không khớp bất kỳ điều kiện nào
  console.log("Render: fallback - không khớp điều kiện nào!");
  return (
    <div
      style={{
        textAlign: "center",
        marginTop: 60,
        color: "#e74c3c",
        fontWeight: 700,
      }}
    >
      Đã xảy ra lỗi không xác định. Vui lòng thử lại hoặc liên hệ hỗ trợ!
    </div>
  );
};

export default ServiceTracking;
