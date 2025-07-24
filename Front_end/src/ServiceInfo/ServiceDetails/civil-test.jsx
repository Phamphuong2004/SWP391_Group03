import React from "react";
import "./ServiceDetail.css";
import { useNavigate } from "react-router-dom";
import serviceTypes from "../../serviceTypes";

const tags = ["#XétNghiệmDânSự", "#TranhChấp", "#ADNTesting"];

const CivilTestGuide = () => {
  const navigate = useNavigate();
  const service = serviceTypes.find(s => s.service_name === "Xét nghiệm ADN dân sự");
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>
            Xét nghiệm ADN dân sự: Giải quyết tranh chấp & xác nhận huyết thống
          </h1>
          <div className="service-category">Dân sự</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Dùng trong tranh chấp dân sự như phân chia tài sản, xác nhận quan hệ
            huyết thống. Dịch vụ đảm bảo bảo mật, chính xác và có giá trị pháp
            lý khi cần thiết.
          </p>

          <h2>1. Ứng dụng chính</h2>
          <ul>
            <li>Tranh chấp thừa kế, phân chia tài sản</li>
            <li>Xác nhận quan hệ huyết thống phục vụ tòa án dân sự</li>
            <li>Giải quyết tranh chấp quyền nuôi con</li>
            <li>Yêu cầu xác minh huyết thống ngoài tố tụng</li>
          </ul>

          <h2>2. Quy trình thực hiện</h2>
          <ol>
            <li>Tư vấn và tiếp nhận hồ sơ</li>
            <li>Lấy mẫu sinh học các bên liên quan</li>
            <li>Phân tích ADN tại phòng lab</li>
            <li>Trả kết quả và tư vấn pháp lý</li>
          </ol>

          <h2>3. Hồ sơ yêu cầu</h2>
          <ul>
            <li>CMND/CCCD các bên liên quan</li>
            <li>Giấy tờ liên quan đến tranh chấp (nếu có)</li>
          </ul>

          <h2>4. Thông tin dịch vụ</h2>
          <ul>
            <li>
              <strong>Thời gian có kết quả:</strong> 7-10 ngày làm việc
            </li>
            <li>
              <strong>Chi phí:</strong> 4,800,000 VNĐ
            </li>
            <li>
              <strong>Bảo mật:</strong> Tuyệt đối
            </li>
            <li>
              <strong>Giá trị pháp lý:</strong> Có thể sử dụng tại tòa án
            </li>
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

export default CivilTestGuide;
