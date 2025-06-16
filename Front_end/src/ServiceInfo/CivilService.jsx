import React, { useState } from "react";
import "./CivilService.css";
import ServiceCard from "./ServiceCard";
import { useNavigate } from "react-router-dom";
import { administrativeServices } from "./servicesData";

// Simple Registration Form Component
const RegisterForm = ({ onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
    onClose();
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="register-form-overlay">
      <div className="register-form-container">
        <button className="close-button" onClick={onClose}>×</button>
        <h2>Đăng ký tư vấn</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Họ và tên</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="phone">Số điện thoại</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="service">Dịch vụ quan tâm</label>
            <select
              id="service"
              name="service"
              value={formData.service}
              onChange={handleChange}
              required
            >
              <option value="">Chọn dịch vụ</option>
              <option value="xac-minh">Xác minh quan hệ huyết thống</option>
              <option value="tranh-chap">Giải quyết tranh chấp tài sản</option>
              <option value="thua-ke">Thừa kế</option>
              <option value="hop-dong">Hợp đồng dân sự</option>
            </select>
          </div>
          <button type="submit" className="submit-button">Gửi yêu cầu</button>
        </form>
      </div>
    </div>
  );
};

export default function CivilService() {
  const navigate = useNavigate();
  const services = [
    {
      id: "family-relationship",
      title: "Xác minh quan hệ huyết thống",
      description: "Giám định ADN để xác định mối quan hệ huyết thống giữa các thành viên trong gia đình.",
      icon: "🧬",
      features: ["Xét nghiệm ADN chính xác", "Kết quả nhanh chóng", "Bảo mật thông tin"],
      type: "administrative"
    },
    {
      id: "property-dispute",
      title: "Giải quyết tranh chấp tài sản",
      description: "Tư vấn và hỗ trợ giải quyết các vấn đề liên quan đến tài sản, quyền sở hữu và phân chia tài sản.",
      icon: "🏠",
      features: ["Tư vấn pháp lý", "Hòa giải tranh chấp", "Đại diện pháp lý"],
      type: "civil"
    },
    {
      id: "inheritance",
      title: "Thừa kế",
      description: "Tư vấn về quyền thừa kế, di chúc và các vấn đề pháp lý liên quan đến tài sản thừa kế.",
      icon: "📜",
      features: ["Soạn thảo di chúc", "Giải quyết tranh chấp", "Tư vấn thừa kế"],
      type: "civil"
    },
    {
      id: "civil-contract",
      title: "Hợp đồng dân sự",
      description: "Soạn thảo và tư vấn về các loại hợp đồng dân sự, đảm bảo tính pháp lý và quyền lợi của các bên.",
      icon: "📝",
      features: ["Soạn thảo hợp đồng", "Rà soát pháp lý", "Tư vấn điều khoản"],
      type: "civil"
    }
  ];

  const testimonials = [
    {
      name: "Nguyễn Văn A",
      role: "Khách hàng",
      content: "Dịch vụ tư vấn rất chuyên nghiệp, đội ngũ luật sư nhiệt tình và am hiểu. Tôi rất hài lòng với kết quả đạt được.",
      avatar: "👨‍💼"
    },
    {
      name: "Trần Thị B",
      role: "Khách hàng",
      content: "Quá trình xử lý vấn đề thừa kế của tôi được giải quyết nhanh chóng và hiệu quả. Cảm ơn đội ngũ tư vấn viên.",
      avatar: "👩‍💼"
    },
    {
      name: "Lê Văn C",
      role: "Khách hàng",
      content: "Dịch vụ xác minh quan hệ huyết thống rất chính xác và bảo mật. Tôi hoàn toàn tin tưởng vào kết quả.",
      avatar: "👨‍💼"
    }
  ];

  const [showForm, setShowForm] = useState(false);
  const handleOpenForm = () => setShowForm(true);
  const handleCloseForm = () => setShowForm(false);

  const handleServiceClick = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    if (service) {
      if (service.type === "administrative") {
        navigate(`/service/${serviceId}`);
      } else {
        navigate(`/civil-service/${serviceId}`);
      }
    }
  };

  return (
    <div className="civil-service-page">
      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1>Dịch vụ Tư vấn Dân sự Chuyên nghiệp</h1>
          <p>Giải pháp pháp lý toàn diện cho mọi vấn đề dân sự của bạn</p>
          <button className="cta-button">Tư vấn miễn phí</button>
        </div>
      </div>

      <div className="civil-service-container">
        {/* Introduction Section */}
        <div className="service-header">
          <h2>Dịch vụ Dân sự</h2>
          <p className="service-intro">
            Chúng tôi cung cấp các dịch vụ tư vấn và hỗ trợ pháp lý chuyên nghiệp trong lĩnh vực dân sự,
            giúp khách hàng giải quyết các vấn đề pháp lý một cách hiệu quả và đúng pháp luật.
          </p>
        </div>

        {/* Services Grid */}
        <div className="services-grid">
          {services.map((service, index) => (
            <ServiceCard
              key={index}
              service={service}
              onDetail={() => handleServiceClick(service.id)}
              onMore={() => handleServiceClick(service.id)}
            />
          ))}
        </div>

        {/* Why Choose Us Section */}
        <div className="why-choose-us">
          <h2>Tại sao chọn chúng tôi?</h2>
          <div className="features-grid">
            <div className="feature-item">
              <span className="feature-icon">⚖️</span>
              <h3>Đội ngũ chuyên gia</h3>
              <p>Luật sư giàu kinh nghiệm, am hiểu pháp luật</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">🔒</span>
              <h3>Bảo mật thông tin</h3>
              <p>Cam kết bảo mật tuyệt đối thông tin khách hàng</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">⚡</span>
              <h3>Giải quyết nhanh chóng</h3>
              <p>Xử lý vấn đề hiệu quả trong thời gian ngắn nhất</p>
            </div>
          </div>
        </div>

        {/* Testimonials Section */}
        <div className="testimonials-section">
          <h2>Khách hàng nói gì về chúng tôi?</h2>
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <div className="testimonial-avatar">{testimonial.avatar}</div>
                <p className="testimonial-content">{testimonial.content}</p>
                <div className="testimonial-author">
                  <h4>{testimonial.name}</h4>
                  <p>{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Section */}
        <div className="contact-section">
          <h2>Liên hệ tư vấn</h2>
          <p>
            Để được tư vấn chi tiết về các dịch vụ dân sự, vui lòng liên hệ với chúng tôi qua:
          </p>
          <div className="contact-info">
            <div className="contact-item">
              <span className="contact-icon">📞</span>
              <div>
                <h4>Hotline</h4>
                <p>1900-xxxx</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">✉️</span>
              <div>
                <h4>Email</h4>
                <p>contact@example.com</p>
              </div>
            </div>
            <div className="contact-item">
              <span className="contact-icon">🏢</span>
              <div>
                <h4>Địa chỉ</h4>
                <p>123 Đường ABC, Quận XYZ, TP. HCM</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showForm && <RegisterForm onClose={handleCloseForm} />}
    </div>
  );
}
