import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#XétNghiệmTrướcSinh", "#ADNThaiNhi", "#AnToàn"];

const PrenatalTestGuide = () => {
  const navigate = useNavigate();
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm ADN trước sinh");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Xét nghiệm ADN trước sinh</h1>
          <div className="service-category">Dân sự</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Xét nghiệm ADN thai nhi không xâm lấn để xác định quan hệ huyết
            thống, an toàn cho mẹ và bé, kết quả từ tuần thứ 9 của thai kỳ.
          </p>
          <h2>Đặc điểm</h2>
          <ul>
            <li>An toàn cho mẹ và bé</li>
            <li>Kết quả từ tuần thứ 9</li>
            <li>Không cần thủ tục phức tạp</li>
            <li>Tư vấn di truyền</li>
          </ul>
          <h2>Yêu cầu</h2>
          <ul>
            <li>Thai kỳ từ 9 tuần</li>
            <li>CMND/CCCD của mẹ</li>
            <li>Mẫu máu tĩnh mạch</li>
          </ul>
          <h2>Quy trình</h2>
          <ol>
            <li>Tư vấn và đánh giá tình trạng thai kỳ</li>
            <li>Lấy mẫu máu tĩnh mạch của mẹ</li>
            <li>Lấy mẫu ADN của người cha nghi ngờ</li>
            <li>Tách ADN thai nhi từ mẫu máu mẹ bằng công nghệ tiên tiến</li>
            <li>Phân tích so sánh ADN</li>
            <li>Tư vấn kết quả và chuyên gia di truyền</li>
          </ol>
          <h2>Thông tin dịch vụ</h2>
          <ul>
            <li>Thời gian: 7-10 ngày làm việc</li>
            <li>Giá: 9,000,000 VNĐ</li>
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

export default PrenatalTestGuide;
