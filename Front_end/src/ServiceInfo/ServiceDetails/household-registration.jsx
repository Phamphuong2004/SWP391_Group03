import React from "react";
import "./ServiceDetail.css";

const tags = ["#ĐăngKýHộKhẩu", "#HướngDẫn", "#PhápLý"];

const HouseholdRegistrationGuide = () => {
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Hướng dẫn thủ tục đăng ký hộ khẩu: Những điều cần biết</h1>
          <div className="service-category">Hướng dẫn pháp lý</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Đăng ký hộ khẩu là thủ tục pháp lý quan trọng để xác lập nơi cư trú hợp pháp của cá nhân, hộ gia đình tại Việt Nam. Bài viết này sẽ hướng dẫn bạn các bước cần thiết để thực hiện thủ tục đăng ký hộ khẩu một cách nhanh chóng và đúng quy định.
          </p>

          <h2>1. Đối tượng và điều kiện đăng ký hộ khẩu</h2>
          <ul>
            <li>Công dân Việt Nam có nhu cầu đăng ký thường trú tại địa phương.</li>
            <li>Có chỗ ở hợp pháp tại địa chỉ đăng ký.</li>
            <li>Không thuộc các trường hợp bị cấm đăng ký thường trú theo quy định pháp luật.</li>
          </ul>

          <h2>2. Hồ sơ cần chuẩn bị</h2>
          <ul>
            <li>Tờ khai đăng ký hộ khẩu (theo mẫu).</li>
            <li>CMND/CCCD của người đăng ký và các thành viên trong hộ.</li>
            <li>Giấy tờ chứng minh chỗ ở hợp pháp (sổ đỏ, hợp đồng thuê nhà, v.v.).</li>
            <li>Sổ hộ khẩu cũ (nếu chuyển hộ khẩu).</li>
            <li>Giấy đăng ký kết hôn, giấy khai sinh của các thành viên (nếu có).</li>
          </ul>

          <h2>3. Quy trình thực hiện</h2>
          <ol>
            <li>Nộp hồ sơ tại Công an xã/phường nơi đăng ký thường trú.</li>
            <li>Cơ quan tiếp nhận kiểm tra, xác minh thông tin và giấy tờ.</li>
            <li>Nhận kết quả đăng ký hộ khẩu theo giấy hẹn.</li>
          </ol>

          <h2>4. Lưu ý khi thực hiện thủ tục</h2>
          <ul>
            <li>Chuẩn bị đầy đủ giấy tờ, hồ sơ theo quy định.</li>
            <li>Thời gian giải quyết thường từ 7-15 ngày làm việc.</li>
            <li>Nên liên hệ trước với Công an xã/phường để được hướng dẫn chi tiết.</li>
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

export default HouseholdRegistrationGuide;
