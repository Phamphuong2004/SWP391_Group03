import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#XétNghiệmHàiCốt", "#NhậnDạng", "#PhápLý"];

const RemainsIdentificationGuide = () => {
  const navigate = useNavigate();
  // Lấy đúng serviceId của dịch vụ này
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm hài cốt");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Xét nghiệm hài cốt</h1>
          <div className="service-category">Hành chính</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Phân tích ADN từ hài cốt để xác định danh tính hoặc quan hệ huyết
            thống, hỗ trợ công tác pháp y và xác định người mất tích.
          </p>
          <h2>Đặc điểm</h2>
          <ul>
            <li>Nhận dạng hài cốt</li>
            <li>Hỗ trợ công tác pháp y</li>
            <li>Xác định người mất tích</li>
            <li>Có giá trị pháp lý</li>
          </ul>
          <h2>Yêu cầu</h2>
          <ul>
            <li>Mẫu hài cốt (xương, răng)</li>
            <li>Giấy chuyển từ cơ quan công an/tòa án</li>
            <li>Mẫu tham chiếu từ người thân</li>
          </ul>
          <h2>Quy trình</h2>
          <ol>
            <li>Tư vấn và tiếp nhận hồ sơ</li>
            <li>Tách chiết ADN từ mẫu hài cốt</li>
            <li>So sánh với mẫu tham chiếu</li>
            <li>Trả kết quả và báo cáo</li>
          </ol>
          <h2>Thông tin dịch vụ</h2>
          <ul>
            <li>Thời gian: 10-15 ngày làm việc</li>
            <li>Giá: 7,000,000 VNĐ</li>
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

export default RemainsIdentificationGuide;
