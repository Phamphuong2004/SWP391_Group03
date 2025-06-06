import React from "react";
import MyNavbar from "../component/Navbar"; // Sửa lại đường dẫn import Navbar
import "./AdministrativeService.css";

export default function AdministrativeService() {
  return (
    <>
      <div className="admin-service-container">
        <h1>Dịch vụ Hành chính</h1>
        <p>
          Dịch vụ hành chính hỗ trợ các thủ tục pháp lý như: làm giấy khai sinh,
          nhập hộ khẩu, nhận con nuôi, bổ sung hồ sơ hành chính, xác nhận quan
          hệ huyết thống phục vụ cho các cơ quan nhà nước, v.v.
        </p>
      </div>
    </>
  );
}
