import React from "react";
import PropTypes from "prop-types";
import ServiceCard from "./ServiceCard";
import { administrativeServices } from "./servicesData";
import "./AdministrativeService.css";
import { useNavigate } from "react-router-dom";

const AdministrativeService = () => {
  const navigate = useNavigate();

  const handleServiceClick = (serviceId) => {
    if (serviceId === "birth-certificate") {
      navigate("/service/birth-certificate");
    } else if (serviceId === "household-registration") {
      navigate("/service/household-registration");
    } else if (serviceId === "adoption") {
      navigate("/service/adoption");
    }
  };

  return (
    <div className="admin-service-container">
      <div className="admin-service-header">
        <h1>Dịch vụ Hành chính</h1>
        <p className="service-intro">
          Dịch vụ hành chính hỗ trợ các thủ tục pháp lý như: làm giấy khai sinh,
          nhập hộ khẩu, nhận con nuôi, bổ sung hồ sơ hành chính, xác nhận quan
          hệ huyết thống phục vụ cho các cơ quan nhà nước, v.v.
        </p>
      </div>

      <div className="services-grid">
        {administrativeServices.map((service, idx) => (
          <div key={service.id || idx}>
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => handleServiceClick(service.id)}
            />
          </div>
        ))}
      </div>

      <div className="contact-section">
        <h2>Liên hệ tư vấn</h2>
        <p>
          Để được tư vấn chi tiết về các dịch vụ hành chính, vui lòng liên hệ:
        </p>
        <div className="contact-info">
          <div className="contact-item">
            <span className="contact-icon">📞</span>
            <div>
              <h3>Hotline</h3>
              <p>1900 1234</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">✉️</span>
            <div>
              <h3>Email</h3>
              <p>support@admin-service.com</p>
            </div>
          </div>
          <div className="contact-item">
            <span className="contact-icon">🏢</span>
            <div>
              <h3>Địa chỉ</h3>
              <p>123 Đường ABC, Quận XYZ, TP. Hồ Chí Minh</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdministrativeService;
