import React from 'react';
import './ServiceDetail.css';

const ServiceDetail = ({ service }) => {
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
                                <li key={index}>{feature}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="service-requirements">
                        <h3>Yêu cầu</h3>
                        <ul>
                            {service.requirements?.map((req, index) => (
                                <li key={index}>{req}</li>
                            ))}
                        </ul>
                    </div>

                    <div className="service-process">
                        <h3>Quy trình</h3>
                        <ol>
                            {service.process?.map((step, index) => (
                                <li key={index}>{step}</li>
                            ))}
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail; 