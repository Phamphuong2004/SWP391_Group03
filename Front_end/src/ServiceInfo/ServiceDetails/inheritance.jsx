import React from "react";
import "./ServiceDetail.css";

const tags = ["#ThủTụcThừaKế", "#HướngDẫn", "#PhápLý"];

const InheritanceGuide = () => {
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Hướng dẫn thủ tục thừa kế: Những điều cần biết</h1>
          <div className="service-category">Hướng dẫn pháp lý</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Thủ tục thừa kế là quá trình xác lập quyền sở hữu tài sản của người thừa kế đối với di sản do người đã mất để lại. Bài viết này sẽ hướng dẫn bạn các bước cơ bản để thực hiện thủ tục thừa kế đúng quy định pháp luật tại Việt Nam.
          </p>

          <h2>1. Đối tượng và điều kiện thừa kế</h2>
          <ul>
            <li>Cá nhân là người thừa kế theo di chúc hoặc theo pháp luật.</li>
            <li>Người để lại di sản đã qua đời và có tài sản hợp pháp để lại.</li>
            <li>Không thuộc các trường hợp bị tước quyền thừa kế theo quy định pháp luật.</li>
          </ul>

          <h2>2. Hồ sơ cần chuẩn bị</h2>
          <ul>
            <li>Đơn đề nghị giải quyết thừa kế (theo mẫu).</li>
            <li>Giấy chứng tử của người để lại di sản.</li>
            <li>Di chúc (nếu có).</li>
            <li>Giấy tờ chứng minh quan hệ thừa kế (giấy khai sinh, sổ hộ khẩu, giấy đăng ký kết hôn, v.v.).</li>
            <li>Giấy tờ chứng minh quyền sở hữu tài sản (sổ đỏ, giấy đăng ký xe, sổ tiết kiệm, v.v.).</li>
            <li>Các giấy tờ liên quan khác theo yêu cầu của cơ quan chức năng.</li>
          </ul>

          <h2>3. Quy trình thực hiện</h2>
          <ol>
            <li>Nộp hồ sơ tại UBND cấp xã/phường hoặc tổ chức công chứng nơi có tài sản thừa kế.</li>
            <li>Cơ quan tiếp nhận kiểm tra, xác minh thông tin và giấy tờ.</li>
            <li>Niêm yết công khai (nếu cần thiết).</li>
            <li>Phân chia di sản và cấp giấy xác nhận quyền thừa kế.</li>
          </ol>

          <h2>4. Lưu ý khi thực hiện thủ tục</h2>
          <ul>
            <li>Chuẩn bị đầy đủ giấy tờ, hồ sơ theo quy định.</li>
            <li>Thời gian giải quyết thường từ 7-30 ngày làm việc tùy từng trường hợp.</li>
            <li>Nên tham khảo ý kiến tư vấn pháp lý nếu hồ sơ phức tạp hoặc có tranh chấp.</li>
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

export default InheritanceGuide;
