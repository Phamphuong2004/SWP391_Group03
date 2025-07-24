import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#XétNghiệmHànhChính", "#Visa", "#QuốcTịch"];

const AdministrativeTestGuide = () => {
  const navigate = useNavigate();
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm ADN hành chính");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Xét nghiệm ADN hành chính</h1>
          <div className="service-category">Hành chính</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Sử dụng trong các thủ tục hành chính như nhập quốc tịch, thị thực,
            chứng minh quan hệ gia đình phục vụ các thủ tục pháp lý quốc tế.
          </p>
          <h2>Đặc điểm</h2>
          <ul>
            <li>Phục vụ thủ tục visa</li>
            <li>Chứng minh quan hệ gia đình</li>
            <li>Đáp ứng chuẩn quốc tế</li>
            <li>Dịch thuật đa ngôn ngữ</li>
          </ul>
          <h2>Yêu cầu</h2>
          <ul>
            <li>CMND/CCCD các bên liên quan</li>
            <li>Giấy tờ chứng minh quan hệ (nếu có)</li>
          </ul>
          <h2>Quy trình</h2>
          <ol>
            <li>Tư vấn và tiếp nhận hồ sơ</li>
            <li>Lấy mẫu sinh học</li>
            <li>Phân tích ADN</li>
            <li>Trả kết quả và hỗ trợ thủ tục hành chính</li>
          </ol>
          <h2>Thông tin dịch vụ</h2>
          <ul>
            <li>Thời gian: 5-8 ngày làm việc</li>
            <li>Giá: 4,500,000 VNĐ</li>
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

export default AdministrativeTestGuide;
