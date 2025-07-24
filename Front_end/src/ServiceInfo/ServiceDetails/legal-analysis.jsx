import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#XétNghiệmPhápLý", "#ADNPhápLý", "#PhápLý"];

const LegalAnalysisGuide = () => {
  const navigate = useNavigate();
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm ADN pháp lý");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Xét nghiệm ADN pháp lý</h1>
          <div className="service-category">Cả hai</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            ADN được sử dụng trong hỗ trợ pháp lý, yêu cầu của cơ quan có thẩm
            quyền, phục vụ điều tra hình sự, xác định danh tính nghi phạm và hỗ
            trợ tòa án.
          </p>
          <h2>Đặc điểm</h2>
          <ul>
            <li>Phục vụ điều tra hình sự</li>
            <li>Xác định danh tính nghi phạm</li>
            <li>Hỗ trợ tòa án</li>
            <li>Báo cáo chuyên môn cao</li>
          </ul>
          <h2>Yêu cầu</h2>
          <ul>
            <li>CMND/CCCD các bên liên quan</li>
            <li>Giấy chuyển từ cơ quan có thẩm quyền</li>
          </ul>
          <h2>Quy trình</h2>
          <ol>
            <li>Tiếp nhận hồ sơ pháp lý</li>
            <li>Lấy mẫu sinh học</li>
            <li>Phân tích ADN</li>
            <li>Xuất báo cáo pháp lý</li>
          </ol>
          <h2>Thông tin dịch vụ</h2>
          <ul>
            <li>Thời gian: 7-10 ngày làm việc</li>
            <li>Giá: 5,000,000 VNĐ</li>
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
                navigate("/booking", { state: { serviceId: String(service?.service_id), fixedPurpose: "Cả hai" } })
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

export default LegalAnalysisGuide;
