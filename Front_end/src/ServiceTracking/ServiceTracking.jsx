import React, { useEffect, useState } from "react";
import GuestServiceTracking from "./GuestServiceTracking";
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

const ServiceTracking = () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.role || user.role.toLowerCase() !== "customer") {
    return <GuestServiceTracking />;
  }

  const [appointments, setAppointments] = useState([]);
  const [selected, setSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Lấy danh sách lịch sử
  useEffect(() => {
    if (!selected) {
      setLoading(true);
      setError(null);
      axios
        .get("/api/view-appointments-user", {
          headers: { Authorization: `Bearer ${user.token}` },
        })
        .then((res) => {
          const arr = Array.isArray(res.data)
            ? res.data
            : res.data
            ? [res.data]
            : [];
          arr.sort(
            (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
          );
          setAppointments(arr);
        })
        .catch(() => setError("Không lấy được lịch sử đặt lịch!"))
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [selected]);

  // Lấy chi tiết khi chọn
  const handleViewDetail = (item) => {
    setLoading(true);
    setError(null);
    axios
      .get(`/api/view-appointment/${item.appointmentId}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      })
      .then((res) => setSelected(res.data))
      .catch(() =>
        setError("Không tìm thấy đơn này hoặc bạn không có quyền xem!")
      )
      .finally(() => setLoading(false));
  };

  const handleBackToList = () => {
    setSelected(null);
    setError(null);
  };

  // Render chi tiết
  if (selected) {
    if (loading)
      return (
        <div style={{ textAlign: "center", marginTop: 40 }}>
          Đang tải chi tiết đơn...
        </div>
      );
    if (error)
      return (
        <div style={{ textAlign: "center", marginTop: 40, color: "red" }}>
          {error}
        </div>
      );
    return (
      <div className="tracking-container">
        <div className="tracking-header">
          <h1>Theo dõi lịch hẹn</h1>
          <p>Kiểm tra trạng thái và thông tin chi tiết cho lịch hẹn của bạn.</p>
        </div>
        <button onClick={handleBackToList} style={{ marginBottom: 24 }}>
          Quay lại
        </button>
        <div className="tracking-card status-card">
          <h3>Trạng thái đơn hàng</h3>
          <StatusTimeline status={selected.status} />
        </div>
        <div className="tracking-card details-card">
          <h3>Thông tin chi tiết</h3>
          <div className="detail-grid">
            <DetailItem
              icon="fa-user"
              label="Họ tên"
              value={selected.fullName}
            />
            <DetailItem
              icon="fa-envelope"
              label="Email"
              value={selected.email}
            />
            <DetailItem
              icon="fa-phone"
              label="Số điện thoại"
              value={selected.phone}
            />
            <DetailItem
              icon="fa-calendar-days"
              label="Ngày sinh"
              value={formatDate(selected.dob)}
            />
            <DetailItem
              icon="fa-venus-mars"
              label="Giới tính"
              value={selected.gender}
            />
            <DetailItem
              icon="fa-map-marker-alt"
              label="Địa chỉ lấy mẫu"
              value={`${selected.district}, ${selected.province}`}
            />
            <DetailItem
              icon="fa-calendar-days"
              label="Ngày hẹn"
              value={formatDate(selected.appointmentDate)}
            />
            <DetailItem
              icon="fa-clock"
              label="Giờ hẹn"
              value={formatTime(selected.appointmentDate)}
            />
            <DetailItem
              icon="fa-calendar-check"
              label="Ngày lấy mẫu"
              value={formatDate(selected.collectionSampleTime)}
            />
            <DetailItem
              icon="fa-hourglass-half"
              label="Giờ lấy mẫu"
              value={formatTime(selected.collectionSampleTime)}
            />
            <DetailItem
              icon="fa-dna"
              label="Loại dịch vụ"
              value={selected.serviceType}
            />
            <DetailItem
              icon="fa-bullseye"
              label="Mục đích"
              value={selected.testpurpose}
            />
            <DetailItem
              icon="fa-tags"
              label="Phân loại"
              value={selected.testcategory}
            />
            <DetailItem
              icon="fa-sticky-note"
              label="Ghi chú"
              value={selected.note}
            />
          </div>
        </div>
      </div>
    );
  }

  // Render danh sách
  if (loading)
    return (
      <div style={{ textAlign: "center", marginTop: 40 }}>
        Đang tải dữ liệu...
      </div>
    );
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: 40, color: "red" }}>
        {error}
      </div>
    );
  return (
    <div style={{ maxWidth: 900, margin: "40px auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: 24 }}>
        Lịch sử đặt lịch của bạn
      </h2>
      {appointments.length === 0 ? (
        <div style={{ textAlign: "center" }}>Bạn chưa có lịch sử đặt lịch.</div>
      ) : (
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 32,
            justifyContent: "center",
          }}
        >
          {appointments.map((item) => (
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
                onClick={() => handleViewDetail(item)}
              >
                Xem chi tiết
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ServiceTracking;
