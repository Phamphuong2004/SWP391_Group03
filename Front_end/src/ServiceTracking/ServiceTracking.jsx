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
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { state } = useLocation();

  useEffect(() => {
    console.log("--- SERVICE TRACKING RENDER ---");
    console.log("1. ID từ URL (useParams):", appointmentId);
    console.log("2. Dữ liệu từ trang trước (useLocation state):", state);

    const fetchAppointment = async () => {
      // PATH 1: Data passed from Booking page (first navigation)
      if (state?.appointment) {
        console.log("PATH 1: Dữ liệu state có tồn tại. Đang dùng dữ liệu này.");
        setAppointment(state.appointment);
        if (appointmentId) {
          console.log(
            `PATH 1: Bắt đầu lưu vào sessionStorage với key: 'appointment_${appointmentId}'`
          );
          sessionStorage.setItem(
            `appointment_${appointmentId}`,
            JSON.stringify(state.appointment)
          );
          console.log(
            "PATH 1: ĐÃ LƯU XONG. Bạn có thể kiểm tra trong tab Application -> Session Storage."
          );
        } else {
          console.warn(
            "PATH 1: CẢNH BÁO - Không có ID trên URL để dùng làm key khi lưu cache."
          );
        }
        setLoading(false);
        return;
      }

      // PATH 2: Page refresh or direct navigation - try cache first
      if (appointmentId) {
        const cachedDataString = sessionStorage.getItem(
          `appointment_${appointmentId}`
        );
        if (cachedDataString) {
          const cachedAppointment = JSON.parse(cachedDataString);
          const currentUser = JSON.parse(localStorage.getItem("user"));

          // SECURITY CHECK: Verify that the cached appointment belongs to the current user.
          if (
            currentUser &&
            cachedAppointment.user?.username === currentUser.username
          ) {
            setAppointment(cachedAppointment);
            setLoading(false);
            return;
          } else {
            // If ownership fails, clear the stale cache and fall back to API call.
            sessionStorage.removeItem(`appointment_${appointmentId}`);
          }
        }
      }

      // PATH 3: Fallback to API if no state and no cache
      console.log(
        "PATH 3: Bắt đầu gọi API '/api/view-appointments-user' để tìm thủ công."
      );
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user?.token) {
        setError("Bạn cần đăng nhập để xem thông tin này.");
        setLoading(false);
        return;
      }
      try {
        // Since fetching by specific ID is problematic, fetch all and find.
        const res = await axios.get(`/api/view-appointments-user`, {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        if (!res.data || !Array.isArray(res.data)) {
          throw new Error("Dữ liệu trả về không hợp lệ.");
        }

        // Match by the long ID if possible, otherwise by the numeric one
        const foundAppointment = res.data.find(
          (item) => String(item.appointmentId) === appointmentId
        );

        if (!foundAppointment) {
          throw new Error(
            "Không thể tải thông tin mới nhất cho lịch hẹn này. Vui lòng quay lại trang Lịch sử và thử lại."
          );
        }
        setAppointment(foundAppointment);
        // Also cache this result
        sessionStorage.setItem(
          `appointment_${appointmentId}`,
          JSON.stringify(foundAppointment)
        );
      } catch (err) {
        setError(err.message || "Lỗi không xác định khi tải dữ liệu.");
      } finally {
        setLoading(false);
      }
    };
    if (appointmentId) {
      fetchAppointment();
    } else {
      setError("Không có mã lịch hẹn nào được cung cấp.");
      console.error("LỖI: Không có appointmentId trên URL.");
      setLoading(false);
    }
  }, [appointmentId, state]);

  if (loading) {
    return (
      <div className="tracking-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Đang tải thông tin lịch hẹn...</p>
        </div>
      </div>
    );
  }

  if (error) {
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

  if (!appointment) {
    return (
      <div className="tracking-container">
        <div className="error-message">
          <h3>Không có dữ liệu</h3>
          <p>Không thể tải thông tin cho lịch hẹn này.</p>
          <button onClick={() => navigate("/history")} className="btn-back">
            Quay về Lịch sử
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="tracking-container">
      <div className="tracking-header">
        <h1>Theo dõi lịch hẹn</h1>
        <p>Kiểm tra trạng thái và thông tin chi tiết cho lịch hẹn của bạn.</p>
      </div>

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
};

export default ServiceTracking;
