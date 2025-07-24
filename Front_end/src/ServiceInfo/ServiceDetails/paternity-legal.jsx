import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#XétNghiệmHuyếtThống", "#PhápLý", "#ADNTesting"];

const PaternityLegalGuide = () => {
  const navigate = useNavigate();
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm huyết thống");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Xét nghiệm huyết thống</h1>
          <div className="service-category">Hành chính</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Kiểm tra mối quan hệ huyết thống giữa các cá nhân, phục vụ các thủ
            tục pháp lý, hành chính hoặc cá nhân với độ chính xác cao.
          </p>
          <h2>Đặc điểm</h2>
          <ul>
            <li>Có giá trị pháp lý cao</li>
            <li>Phục vụ cơ quan nhà nước</li>
            <li>Quy trình nghiêm ngặt</li>
            <li>Báo cáo chính thức</li>
          </ul>
          <h2>Yêu cầu</h2>
          <ul>
            <li>CMND/CCCD của các bên liên quan</li>
            <li>Giấy chuyển từ cơ quan có thẩm quyền</li>
            <li>Mẫu sinh học được lấy tại lab</li>
          </ul>
          <h2>Quy trình</h2>
          <ol>
            <li>Tư vấn và tiếp nhận hồ sơ</li>
            <li>Lấy mẫu sinh học tại phòng xét nghiệm</li>
            <li>Phân tích ADN tại phòng lab</li>
            <li>Trả kết quả và báo cáo pháp lý</li>
          </ol>
          <h2>Thông tin dịch vụ</h2>
          <ul>
            <li>Thời gian: 5-7 ngày làm việc</li>
            <li>Giá: 3,500,000 VNĐ</li>
          </ul>
          <div className="blog-tags" style={{ marginTop: "24px" }}>
            {tags.map((tag, idx) => (
              <span key={tag || idx} className="blog-tag">
                {tag}
              </span>
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 32 }}>
            <button
              onClick={() =>
                navigate("/booking", { state: { serviceId: String(service?.service_id), fixedPurpose: "Hành chính" } })
              }
              style={{
                background: "#1976d2",
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "12px 36px",
                fontWeight: 700,
                fontSize: 20,
                cursor: "pointer",
                boxShadow: "0 2px 8px #1976d233",
                transition: "background 0.2s",
              }}
            >
              Đặt lịch
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaternityLegalGuide;
