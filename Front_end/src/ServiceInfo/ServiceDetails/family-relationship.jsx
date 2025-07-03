import React from "react";
import "./ServiceDetail.css";

const tags = ["#QuanHệGiaĐình", "#HướngDẫn", "#PhápLý"];

const FamilyRelationshipGuide = () => {
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Hướng dẫn thủ tục xác nhận quan hệ gia đình: Những điều cần biết</h1>
          <div className="service-category">Hướng dẫn pháp lý</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Xác nhận quan hệ gia đình là thủ tục cần thiết để chứng minh mối quan hệ huyết thống hoặc nuôi dưỡng giữa các thành viên trong gia đình, phục vụ cho các mục đích pháp lý, hành chính hoặc dân sự. Bài viết này sẽ hướng dẫn bạn các bước cơ bản để thực hiện thủ tục xác nhận quan hệ gia đình tại Việt Nam.
          </p>

          <h2>1. Các loại quan hệ gia đình thường xác nhận</h2>
          <ul>
            <li>Quan hệ cha/mẹ - con</li>
            <li>Quan hệ anh/chị/em ruột</li>
            <li>Quan hệ ông/bà - cháu</li>
            <li>Quan hệ cô/dì/chú/bác - cháu</li>
            <li>Các quan hệ gia đình khác theo quy định pháp luật</li>
          </ul>

          <h2>2. Hồ sơ cần chuẩn bị</h2>
          <ul>
            <li>Đơn đề nghị xác nhận quan hệ gia đình (theo mẫu)</li>
            <li>CMND/CCCD của các bên liên quan</li>
            <li>Giấy khai sinh, sổ hộ khẩu, giấy đăng ký kết hôn (nếu có)</li>
            <li>Các giấy tờ chứng minh mối quan hệ (nếu có)</li>
            <li>Các tài liệu bổ sung khác theo yêu cầu của cơ quan chức năng</li>
          </ul>

          <h2>3. Quy trình thực hiện</h2>
          <ol>
            <li>Nộp hồ sơ tại UBND cấp xã/phường nơi cư trú hoặc cơ quan có thẩm quyền</li>
            <li>Cơ quan tiếp nhận kiểm tra, xác minh thông tin và giấy tờ</li>
            <li>Thực hiện phỏng vấn hoặc xác minh thực tế (nếu cần)</li>
            <li>Cấp giấy xác nhận quan hệ gia đình nếu đủ điều kiện</li>
          </ol>

          <h2>4. Lưu ý khi thực hiện thủ tục</h2>
          <ul>
            <li>Chuẩn bị đầy đủ giấy tờ, hồ sơ theo quy định</li>
            <li>Thời gian giải quyết thường từ 3-7 ngày làm việc</li>
            <li>Nên liên hệ trước với UBND xã/phường để được hướng dẫn chi tiết</li>
          </ul>

          <div className="blog-tags" style={{marginTop: '24px'}}>
            {tags.map((tag, idx) => (
              <span key={idx} className="blog-tag" style={{marginRight: '8px', background: '#e3f2fd', padding: '4px 12px', borderRadius: '12px', fontSize: '14px'}}>{tag}</span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyRelationshipGuide;
