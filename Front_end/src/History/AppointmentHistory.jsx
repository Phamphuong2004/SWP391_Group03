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
  const user = JSON.parse(localStorage.getItem("user"));

  const [selectedAppointment, setSelectedAppointment] = useState(null);

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
    setSelectedAppointment(appointment);
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

  if (!isGuest && loading) {
    return <div className="history-loading">Đang tải lịch sử đặt lịch...</div>;
  }

  if (!isGuest && error) {
    return <div className="history-error">Lỗi: {error}</div>;
  }

  return (
    <div className="appointment-history-container">
      {selectedAppointment ? (
        <div className="tracking-container">
          <div className="tracking-header">
            <h1>Theo dõi lịch hẹn</h1>
            <p>
              Kiểm tra trạng thái và thông tin chi tiết cho lịch hẹn của bạn.
            </p>
          </div>
          <button
            onClick={() => setSelectedAppointment(null)}
            style={{ marginBottom: 24 }}
          >
            Quay lại
          </button>
          <div className="tracking-card status-card">
            <h3>Trạng thái đơn hàng</h3>
            <StatusTimeline status={selectedAppointment.status} />
          </div>
          <div className="tracking-card details-card">
            <h3>Thông tin chi tiết</h3>
            <div className="detail-grid">
              <DetailItem
                icon="fa-user"
                label="Họ tên"
                value={selectedAppointment.fullName}
              />
              <DetailItem
                icon="fa-envelope"
                label="Email"
                value={selectedAppointment.email}
              />
              <DetailItem
                icon="fa-phone"
                label="Số điện thoại"
                value={selectedAppointment.phone}
              />
              <DetailItem
                icon="fa-calendar-days"
                label="Ngày sinh"
                value={formatDate(selectedAppointment.dob)}
              />
              <DetailItem
                icon="fa-venus-mars"
                label="Giới tính"
                value={selectedAppointment.gender}
              />
              <DetailItem
                icon="fa-map-marker-alt"
                label="Địa chỉ lấy mẫu"
                value={`${selectedAppointment.district}, ${selectedAppointment.province}`}
              />
              <DetailItem
                icon="fa-calendar-days"
                label="Ngày hẹn"
                value={formatDate(selectedAppointment.appointmentDate)}
              />
              <DetailItem
                icon="fa-clock"
                label="Giờ hẹn"
                value={formatTime(selectedAppointment.appointmentDate)}
              />
              <DetailItem
                icon="fa-calendar-check"
                label="Ngày lấy mẫu"
                value={formatDate(selectedAppointment.collectionSampleTime)}
              />
              <DetailItem
                icon="fa-hourglass-half"
                label="Giờ lấy mẫu"
                value={formatTime(selectedAppointment.collectionSampleTime)}
              />
              <DetailItem
                icon="fa-dna"
                label="Loại dịch vụ"
                value={selectedAppointment.serviceType}
              />
              <DetailItem
                icon="fa-bullseye"
                label="Mục đích"
                value={selectedAppointment.testPurpose}
              />
              <DetailItem
                icon="fa-tags"
                label="Phân loại"
                value={selectedAppointment.testCategory}
              />
              <DetailItem
                icon="fa-sticky-note"
                label="Ghi chú"
                value={selectedAppointment.note}
              />
            </div>
          </div>
        </div>
      ) : (
        <>
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
              <p>
                Nhập email và số điện thoại để xem lịch sử đặt lịch của guest:
              </p>
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
                Đây là danh sách tất cả các lịch hẹn bạn đã đặt. Nhấp vào "Theo
                dõi" để xem chi tiết.
              </p>
              <div className="appointment-list">
                {appointments.length > 0 ? (
                  appointments.map((app) => (
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
                      <div className="card-footer">
                        <button
                          className="track-button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTrackClick(app);
                          }}
                        >
                          Theo dõi chi tiết
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Bạn chưa có lịch hẹn nào.</p>
                )}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AppointmentHistory;
