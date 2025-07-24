import React from "react";
import { useParams } from "react-router-dom";
import ADNTestingServices from "../listOfServices";
import "./CustomerServiceDetail.css";

const CustomerServiceDetail = () => {
  const { id } = useParams();
  const service = ADNTestingServices.find((s) => s.id === id);

  if (!service) {
    return (
      <div className="customer-service-detail-container">
        <p>Không tìm thấy thông tin dịch vụ.</p>
      </div>
    );
  }

  return (
    <div className="customer-service-detail-container">
      <div className="customer-service-detail-title">{service.testType}</div>
      <div className="customer-service-detail-row">
        {/* Bảng trái */}
        <div className="customer-service-detail-col-left">
          <img
            src={service.image}
            alt={service.testType}
            className="customer-service-detail-img"
          />
          <div className="customer-service-detail-section">
            <h4>Thông tin thêm</h4>
            <ul className="customer-service-detail-info-list">
              <li>
                <b>Mẫu cần lấy:</b> {service.sampleRequired}
              </li>
              <li>
                <b>Thời gian trả kết quả:</b> {service.turnaroundTime}
              </li>
              <li>
                <b>Giá:</b> {service.price}
              </li>
              <li>
                <b>Đánh giá:</b> ⭐ {service.rating}/5.0
              </li>
              <li>
                <b>Kiểm định:</b>{" "}
                {service.isAccredited ? "Đã kiểm định" : "Chưa kiểm định"}
              </li>
            </ul>
          </div>
        </div>
        {/* Bảng phải */}
        <div className="customer-service-detail-col-right">
          <div className="customer-service-detail-section">
            <h4>Thông tin dịch vụ</h4>
            <p>{service.description}</p>
          </div>
          <div className="customer-service-detail-box">
            <h3>Đặc điểm</h3>
            <ul>
              {service.features.map((feature, idx) => (
                <li key={idx}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="customer-service-detail-box">
            <h3>Yêu cầu</h3>
            <ul>
              {service.requirements.map((req, idx) => (
                <li key={idx}>{req}</li>
              ))}
            </ul>
          </div>
          <div className="customer-service-detail-box">
            <h3>Quy trình</h3>
            <ol>
              {service.process.map((step, idx) => (
                <li key={idx}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerServiceDetail;
