import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#DiTruyền", "#TầmSoátBệnh", "#ADN"];

const GeneticAnalysisGuide = () => {
  const navigate = useNavigate();
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm ADN di truyền");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Xét nghiệm ADN di truyền</h1>
          <div className="service-category">Dân sự</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Tầm soát các bệnh di truyền hoặc đột biến gen, giúp lập kế hoạch
            sinh sản và tư vấn sức khỏe cá nhân, gia đình.
          </p>
          <h2>Đặc điểm</h2>
          <ul>
            <li>Phát hiện bệnh di truyền</li>
            <li>Tư vấn sức khỏe</li>
            <li>Lập kế hoạch sinh sản</li>
            <li>Bảo mật thông tin</li>
          </ul>
          <h2>Yêu cầu</h2>
          <ul>
            <li>CMND/CCCD của người xét nghiệm</li>
            <li>Mẫu sinh học (máu, niêm mạc miệng, ...)</li>
          </ul>
          <h2>Quy trình</h2>
          <ol>
            <li>Tư vấn và tiếp nhận mẫu</li>
            <li>Phân tích ADN tại phòng lab</li>
            <li>Đánh giá nguy cơ di truyền</li>
            <li>Tư vấn kết quả</li>
          </ol>
          <h2>Thông tin dịch vụ</h2>
          <ul>
            <li>Thời gian: 10-12 ngày làm việc</li>
            <li>Giá: 6,000,000 VNĐ</li>
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
                navigate("/booking", { state: { serviceId: String(service?.service_id), fixedPurpose: "Dân sự" } })
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

export default GeneticAnalysisGuide;
