import React from "react";
import "./Footer.css";

export default function Footer() {
  return (
    <div className="main-footer footer-animated">
      <footer className="footer">
        <div className="footer-grid">
          <div className="footer-brand">
            <img
              src="data:image/png;base64,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"
              alt="ADN Logo"
              className="footer-logo"
            />
            <h2>Hệ Thống Xét Nghiệm ADN</h2>
            <p>
              Dịch vụ xét nghiệm ADN uy tín cho gia đình, sức khỏe và pháp lý.
              <br />
              <span className="footer-highlight">
                Bảo mật và chính xác là ưu tiên hàng đầu của chúng tôi.
              </span>
            </p>
          </div>
          <div className="footer-links">
            <h4>Liên kết nhanh</h4>
            <ul>
              <li>
                <a href="#">Trang chủ</a>
              </li>
              <li>
                <a href="#">Dịch vụ</a>
              </li>
              <li>
                <a href="#">Đăng ký</a>
              </li>
              <li>
                <a href="#">Liên hệ</a>
              </li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Liên hệ</h4>
            <ul>
              <li>
                <i className="fas fa-envelope"></i>
                <a href="mailto:xetnghiemADN@gmail.com">
                  xetnghiemADN@gmail.com
                </a>
              </li>
              <li>
                <i className="fas fa-phone"></i>
                0123 456 789
              </li>
              <li>
                <i className="fas fa-map-marker-alt"></i>
                123 Đường Y tế, Quận 1, TP. Hồ Chí Minh
              </li>
            </ul>
            <div className="footer-socials">
              <a href="#" aria-label="Facebook">
                <i className="fab fa-facebook-f"></i>
              </a>
              <a href="#" aria-label="Instagram">
                <i className="fab fa-instagram"></i>
              </a>
              <a href="#" aria-label="Twitter">
                <i className="fab fa-twitter"></i>
              </a>
              <a href="#" aria-label="GitHub">
                <i className="fab fa-github"></i>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-divider"></div>
        <div className="footer-bottom-alt">
          © {new Date().getFullYear()} Hệ Thống Xét Nghiệm ADN. Đã đăng ký bản
          quyền.
        </div>
      </footer>
    </div>
  );
}
