import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./AppointmentHistory.css"; // We will create this CSS file later

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isGuest, setIsGuest] = useState(false);
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [guestAppointments, setGuestAppointments] = useState([]);
  const [guestError, setGuestError] = useState(null);
  const [guestLoading, setGuestLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (isGuest) return; // Không fetch cho user khi đang ở chế độ guest
    if (!user || !user.token) {
      setError("Bạn cần đăng nhập để xem lịch sử đặt lịch.");
      setLoading(false);
      return;
    }

    const fetchAppointments = async () => {
      try {
        console.log("--- BẮT ĐẦU LẤY LỊCH SỬ ĐƠN HÀNG ---");
        console.log("1. Người dùng hiện tại (từ localStorage):", user);
        console.log("2. Đang gửi yêu cầu đến API: /api/view-appointments-user");

        const response = await axios.get("/api/view-appointments-user", {
          headers: { Authorization: `Bearer ${user.token}` },
        });

        console.log(
          "3. ĐÃ NHẬN PHẢN HỒI TỪ MÁY CHỦ. Dữ liệu thô:",
          response.data
        );

        // Sort appointments by date in descending order (newest first)
        const sortedAppointments = response.data.sort(
          (a, b) => new Date(b.appointmentDate) - new Date(a.appointmentDate)
        );
        setAppointments(sortedAppointments);
        console.log(
          "4. Dữ liệu sau khi đã sắp xếp và lưu vào state:",
          sortedAppointments
        );
      } catch (err) {
        setError("Không thể tải lịch sử đặt lịch. Vui lòng thử lại sau.");
        console.error("LỖI KHI GỌI API:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.token, isGuest]);

  // Hàm lấy lịch sử cho guest
  const fetchGuestAppointments = async () => {
    setGuestLoading(true);
    setGuestError(null);
    try {
      const res = await axios.get(
        `/api/view-appointment-guest?email=${encodeURIComponent(
          guestEmail
        )}&phone=${encodeURIComponent(guestPhone)}`
      );
      setGuestAppointments(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setGuestError("Không tìm thấy lịch sử cho thông tin này.");
      setGuestAppointments([]);
    } finally {
      setGuestLoading(false);
    }
  };

  const handleTrackClick = (appointment) => {
    // We must pass the appointment data in state to avoid refetching issues
    navigate(`/service-tracking/${appointment.appointmentId}`, {
      state: { appointment: appointment },
    });
  };

  const formatDate = (isoString) => {
    if (!isoString) return "N/A";
    const date = new Date(isoString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  if (!isGuest && loading) {
    return <div className="history-loading">Đang tải lịch sử đặt lịch...</div>;
  }

  if (!isGuest && error) {
    return <div className="history-error">Lỗi: {error}</div>;
  }

  return (
    <div className="appointment-history-container">
      <h1>Lịch sử Đặt lịch</h1>
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => setIsGuest(false)} disabled={!isGuest}>
          Lịch sử của tôi (user)
        </button>
        {!user && (
          <button
            onClick={() => setIsGuest(true)}
            disabled={isGuest}
            style={{ marginLeft: 8 }}
          >
            Lịch sử cho khách (guest)
          </button>
        )}
      </div>
      {isGuest && !user ? (
        <div>
          <p>Nhập email và số điện thoại để xem lịch sử đặt lịch của guest:</p>
          <input
            type="email"
            placeholder="Nhập email guest"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <input
            type="text"
            placeholder="Nhập số điện thoại guest"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            style={{ marginRight: 8 }}
          />
          <button
            onClick={fetchGuestAppointments}
            disabled={!guestEmail || !guestPhone || guestLoading}
          >
            Xem lịch sử
          </button>
          {guestLoading && <div>Đang tải...</div>}
          {guestError && <div style={{ color: "red" }}>{guestError}</div>}
          <div className="appointment-list">
            {guestAppointments.length > 0 ? (
              guestAppointments.map((app) => (
                <div key={app.appointmentId} className="appointment-card">
                  <div className="card-header">
                    <span className="service-type">{app.serviceType}</span>
                    <span
                      className={`status status-${app.status?.toLowerCase()}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Mã đơn:</strong> {app.appointmentId}
                    </p>
                    <p>
                      <strong>Ngày hẹn:</strong>{" "}
                      {formatDate(app.appointmentDate)}
                    </p>
                    <p>
                      <strong>Khách hàng:</strong> {app.fullName}
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p>Không có lịch sử nào cho guest này.</p>
            )}
          </div>
        </div>
      ) : (
        <>
          <p>
            Đây là danh sách tất cả các lịch hẹn bạn đã đặt. Nhấp vào "Theo dõi"
            để xem chi tiết.
          </p>
          <div className="appointment-list">
            {appointments.length > 0 ? (
              appointments.map((app) => (
                <div
                  key={app.appointmentId}
                  className="appointment-card"
                  onClick={() => handleTrackClick(app)}
                >
                  <div className="card-header">
                    <span className="service-type">{app.serviceType}</span>
                    <span
                      className={`status status-${app.status?.toLowerCase()}`}
                    >
                      {app.status}
                    </span>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Mã đơn:</strong> {app.appointmentId}
                    </p>
                    <p>
                      <strong>Ngày hẹn:</strong>{" "}
                      {formatDate(app.appointmentDate)}
                    </p>
                    <p>
                      <strong>Khách hàng:</strong> {app.fullName}
                    </p>
                  </div>
                  <div className="card-footer">
                    <button className="track-button">Theo dõi chi tiết</button>
                  </div>
                </div>
              ))
            ) : (
              <p>Bạn chưa có lịch hẹn nào.</p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default AppointmentHistory;
