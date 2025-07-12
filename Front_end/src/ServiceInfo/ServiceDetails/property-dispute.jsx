import React from "react";
import "./ServiceDetail.css";

const tags = ["#TranhChấpTàiSản", "#HướngDẫn", "#PhápLý"];

const PropertyDisputeGuide = () => {
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Hướng dẫn thủ tục giải quyết tranh chấp tài sản: Những điều cần biết</h1>
          <div className="service-category">Hướng dẫn pháp lý</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Tranh chấp tài sản là một trong những vấn đề pháp lý phổ biến, liên quan đến quyền sở hữu, sử dụng hoặc phân chia tài sản giữa các cá nhân, tổ chức. Bài viết này sẽ hướng dẫn bạn các bước cơ bản để thực hiện thủ tục giải quyết tranh chấp tài sản đúng quy định pháp luật tại Việt Nam.
          </p>

          <h2>1. Đối tượng và điều kiện giải quyết tranh chấp tài sản</h2>
          <ul>
            <li>Cá nhân, tổ chức có tranh chấp về quyền sở hữu, sử dụng, phân chia tài sản.</li>
            <li>Có giấy tờ, tài liệu chứng minh quyền sở hữu hoặc liên quan đến tài sản tranh chấp.</li>
            <li>Không thuộc các trường hợp bị hạn chế quyền khởi kiện theo quy định pháp luật.</li>
          </ul>

          <h2>2. Hồ sơ cần chuẩn bị</h2>
          <ul>
            <li>Đơn yêu cầu giải quyết tranh chấp tài sản (theo mẫu).</li>
            <li>Giấy tờ chứng minh quyền sở hữu tài sản (sổ đỏ, giấy đăng ký xe, v.v.).</li>
            <li>Các tài liệu, chứng cứ liên quan đến tranh chấp.</li>
            <li>CMND/CCCD của các bên liên quan.</li>
            <li>Các giấy tờ khác theo yêu cầu của cơ quan chức năng.</li>
          </ul>

          <h2>3. Quy trình thực hiện</h2>
          <ol>
            <li>Nộp hồ sơ tại Tòa án nhân dân có thẩm quyền hoặc cơ quan giải quyết tranh chấp.</li>
            <li>Cơ quan tiếp nhận kiểm tra, xác minh thông tin và giấy tờ.</li>
            <li>Tổ chức hòa giải (nếu có thể).</li>
            <li>Ra quyết định giải quyết tranh chấp theo quy định pháp luật.</li>
          </ol>

          <h2>4. Lưu ý khi thực hiện thủ tục</h2>
          <ul>
            <li>Chuẩn bị đầy đủ giấy tờ, hồ sơ theo quy định.</li>
            <li>Thời gian giải quyết tùy thuộc vào tính chất, mức độ phức tạp của vụ việc.</li>
            <li>Nên tham khảo ý kiến tư vấn pháp lý để bảo vệ quyền lợi tốt nhất.</li>
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

export default PropertyDisputeGuide;
