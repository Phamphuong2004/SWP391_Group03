import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#ADNThaiNhi", "#TầmSoátDiTruyền", "#HuyếtThống"];

const FetalTestGuide = () => {
  const navigate = useNavigate();
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm ADN thai nhi");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Xét nghiệm ADN thai nhi</h1>
          <div className="service-category">Dân sự</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Phân tích ADN thai nhi để kiểm tra huyết thống hoặc tầm soát các
            bệnh di truyền, đảm bảo an toàn và tư vấn sức khỏe cho mẹ và bé.
          </p>
          <h2>Đặc điểm</h2>
          <ul>
            <li>Kiểm tra huyết thống thai nhi</li>
            <li>Tầm soát bệnh di truyền</li>
            <li>Tư vấn sức khỏe</li>
          </ul>
          <h2>Yêu cầu</h2>
          <ul>
            <li>Thai kỳ từ 9 tuần</li>
            <li>CMND/CCCD của mẹ</li>
            <li>Mẫu máu tĩnh mạch</li>
          </ul>
          <h2>Quy trình</h2>
          <ol>
            <li>Tư vấn và tiếp nhận mẫu</li>
            <li>Tách chiết ADN thai nhi</li>
            <li>Phân tích và so sánh kết quả</li>
            <li>Tư vấn kết quả</li>
          </ol>
          <h2>Thông tin dịch vụ</h2>
          <ul>
            <li>Thời gian: 10-12 ngày làm việc</li>
            <li>Giá: 8,500,000 VNĐ</li>
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

export default FetalTestGuide;
