import React, { useState } from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./ServiceCard.css";

const ServiceCard = ({ service }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="service-card">
      <div className="service-icon">{service.icon}</div>
      <h3>{service.title}</h3>
      <p>{service.description}</p>
      <div className="service-actions">
        <button className="service-button" onClick={toggleExpand}>
          {isExpanded ? "Thu gọn" : "Chi tiết"}
        </button>
        <Link
          to={`/service/${service.id}`}
          className="service-button view-more"
        >
          Xem thêm
        </Link>
      </div>

      {isExpanded && (
        <div className="service-details">
          <h4>Giấy tờ thiết yếu:</h4>
          <ul>
            {service.requirements?.map((req, index) => (
              <li key={req.id || index}>{req}</li>
            ))}
          </ul>
          <p className="process-time">
            Thời gian xử lý: {service.processingTime}
          </p>
        </div>
      )}
    </div>
  );
};

ServiceCard.propTypes = {
  service: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
    requirements: PropTypes.arrayOf(PropTypes.string),
    processingTime: PropTypes.string,
  }).isRequired,
};

export default ServiceCard;
