import React from "react";
import "./ServiceDetail.css";

const tags = ["#HợpĐồngDânSự", "#HướngDẫn", "#PhápLý"];

const CivilContractGuide = () => {
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Hướng dẫn thủ tục hợp đồng dân sự: Những điều cần biết</h1>
          <div className="service-category">Hướng dẫn pháp lý</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Hợp đồng dân sự là sự thỏa thuận giữa các bên về việc xác lập, thay đổi hoặc chấm dứt quyền, nghĩa vụ dân sự. Việc lập hợp đồng đúng quy định giúp bảo vệ quyền lợi và hạn chế rủi ro pháp lý cho các bên tham gia. Bài viết này sẽ hướng dẫn bạn các bước cơ bản để thực hiện thủ tục hợp đồng dân sự tại Việt Nam.
          </p>

          <h2>1. Các loại hợp đồng dân sự phổ biến</h2>
          <ul>
            <li>Hợp đồng mua bán tài sản</li>
            <li>Hợp đồng cho thuê tài sản</li>
            <li>Hợp đồng vay mượn tài sản</li>
            <li>Hợp đồng dịch vụ</li>
            <li>Hợp đồng tặng cho tài sản</li>
            <li>Các loại hợp đồng dân sự khác theo quy định pháp luật</li>
          </ul>

          <h2>2. Hồ sơ cần chuẩn bị</h2>
          <ul>
            <li>Giấy tờ tùy thân của các bên (CMND/CCCD/Hộ chiếu)</li>
            <li>Bản dự thảo hợp đồng (nếu có)</li>
            <li>Các giấy tờ chứng minh quyền sở hữu tài sản (nếu liên quan)</li>
            <li>Các tài liệu hỗ trợ khác tùy từng loại hợp đồng</li>
          </ul>

          <h2>3. Quy trình thực hiện</h2>
          <ol>
            <li>Các bên thỏa thuận, soạn thảo nội dung hợp đồng</li>
            <li>Kiểm tra tính pháp lý và các điều khoản hợp đồng</li>
            <li>Ký kết hợp đồng (có thể công chứng hoặc chứng thực nếu pháp luật yêu cầu)</li>
            <li>Lưu giữ hợp đồng và thực hiện các nghĩa vụ đã cam kết</li>
          </ol>

          <h2>4. Lưu ý khi thực hiện hợp đồng dân sự</h2>
          <ul>
            <li>Đọc kỹ các điều khoản, quyền và nghĩa vụ của các bên trước khi ký kết</li>
            <li>Nên tham khảo ý kiến tư vấn pháp lý nếu hợp đồng có giá trị lớn hoặc phức tạp</li>
            <li>Giữ lại bản hợp đồng và các giấy tờ liên quan để làm bằng chứng khi cần thiết</li>
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

export default CivilContractGuide;
