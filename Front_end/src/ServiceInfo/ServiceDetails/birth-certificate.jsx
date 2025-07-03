import React from "react";
import "./ServiceDetail.css";

const tags = ["#GiấyKhaiSinh", "#HướngDẫn", "#PhápLý"];

const BirthCertificateGuide = () => {
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Hướng dẫn thủ tục đăng ký giấy khai sinh: Những điều cần biết</h1>
          <div className="service-category">Hướng dẫn pháp lý</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Đăng ký giấy khai sinh là thủ tục pháp lý đầu tiên và quan trọng nhất của mỗi cá nhân, xác nhận sự ra đời và các thông tin nhân thân cơ bản. Bài viết này sẽ hướng dẫn bạn các bước cần thiết để thực hiện thủ tục đăng ký giấy khai sinh tại Việt Nam.
          </p>

          <h2>1. Điều kiện đăng ký giấy khai sinh</h2>
          <ul>
            <li>Trẻ em sinh ra trên lãnh thổ Việt Nam đều phải được đăng ký khai sinh.</li>
            <li>Cha, mẹ hoặc người giám hộ có trách nhiệm đăng ký khai sinh cho trẻ.</li>
            <li>Thời hạn đăng ký khai sinh là 60 ngày kể từ ngày trẻ được sinh ra.</li>
          </ul>

          <h2>2. Hồ sơ cần chuẩn bị</h2>
          <ul>
            <li>Tờ khai đăng ký khai sinh (theo mẫu).</li>
            <li>Giấy chứng sinh do cơ sở y tế cấp hoặc giấy tờ thay thế.</li>
            <li>CMND/CCCD hoặc hộ chiếu của cha, mẹ (bản chính và bản sao).</li>
            <li>Sổ hộ khẩu hoặc giấy tờ chứng minh nơi cư trú.</li>
            <li>Giấy đăng ký kết hôn của cha mẹ (nếu có).</li>
          </ul>

          <h2>3. Quy trình thực hiện</h2>
          <ol>
            <li>Nộp hồ sơ tại UBND cấp xã/phường nơi cư trú của cha, mẹ hoặc nơi trẻ sinh ra.</li>
            <li>Cán bộ tư pháp kiểm tra, tiếp nhận hồ sơ và ghi vào sổ khai sinh.</li>
            <li>Ký và cấp giấy khai sinh cho trẻ.</li>
          </ol>

          <h2>4. Lưu ý khi thực hiện thủ tục</h2>
          <ul>
            <li>Chuẩn bị đầy đủ giấy tờ, hồ sơ theo quy định.</li>
            <li>Thời gian giải quyết thường trong ngày làm việc.</li>
            <li>Trường hợp nộp hồ sơ muộn sau 60 ngày, cần làm thêm thủ tục khai sinh quá hạn.</li>
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

export default BirthCertificateGuide;
