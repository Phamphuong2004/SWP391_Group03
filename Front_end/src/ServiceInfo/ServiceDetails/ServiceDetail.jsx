import React from "react";
import { useParams } from "react-router-dom";
import { allServices } from "../servicesData";
import "./ServiceDetail.css";

const ServiceDetail = ({ service }) => {
  if (!service) {
    return (
      <div className="service-detail-container">
        <p>Không tìm thấy thông tin dịch vụ.</p>
      </div>
    );
  }

  return (
    <div className="service-detail-container">
      <div className="service-detail-header">
        <h1>{service.title}</h1>
        <div className="service-category">{service.category}</div>
      </div>

      <div className="service-detail-content">
        <div className="service-image">
          <img src={service.image} alt={service.title} />
        </div>

        <div className="service-info">
          <h2>Thông tin dịch vụ</h2>
          <p>{service.description}</p>

          <div className="service-features">
            <h3>Đặc điểm</h3>
            <ul>
              {service.features?.map((feature, index) => (
                <li key={feature.id || index}>{feature}</li>
              ))}
            </ul>
          </div>

          <div className="service-requirements">
            <h3>Yêu cầu</h3>
            <ul>
              {service.requirements?.map((req, index) => (
                <li key={req.id || index}>{req}</li>
              ))}
            </ul>
          </div>

          <div className="service-process">
            <h3>Quy trình</h3>
            <ol>
              {service.process?.map((step, index) => (
                <li key={step.id || index}>{step}</li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

const ServiceDetailPage = () => {
  const { id } = useParams();
  const service = allServices.find((s) => s.id === id);

  return <ServiceDetail service={service} />;
};

export default ServiceDetailPage;
