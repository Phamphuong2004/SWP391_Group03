import React from "react";
import "./ServiceDetail.css";

const tags = ["#NhậnConNuôi", "#HướngDẫn", "#PhápLý"];

const AdoptionGuide = () => {
  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>Hướng dẫn thủ tục nhận con nuôi: Những điều cần biết</h1>
          <div className="service-category">Hướng dẫn pháp lý</div>
        </div>
        <div className="service-info">
          <h2>Giới thiệu</h2>
          <p>
            Nhận con nuôi là một thủ tục pháp lý quan trọng, giúp trẻ em có hoàn cảnh khó khăn được chăm sóc, nuôi dưỡng trong môi trường gia đình mới. Bài viết này sẽ hướng dẫn bạn các bước cần thiết để thực hiện thủ tục nhận con nuôi tại Việt Nam.
          </p>

          <h2>1. Điều kiện nhận con nuôi</h2>
          <ul>
            <li>Người nhận con nuôi phải từ 21 tuổi trở lên, có năng lực hành vi dân sự đầy đủ.</li>
            <li>Có điều kiện về sức khỏe, kinh tế, đạo đức tốt, không vi phạm pháp luật.</li>
            <li>Chênh lệch tuổi giữa người nhận nuôi và trẻ em ít nhất 16 tuổi.</li>
            <li>Không thuộc các trường hợp bị cấm nhận con nuôi theo quy định pháp luật.</li>
          </ul>

          <h2>2. Hồ sơ cần chuẩn bị</h2>
          <ul>
            <li>Đơn xin nhận con nuôi (theo mẫu).</li>
            <li>Bản sao hộ chiếu, CMND/CCCD của người nhận nuôi.</li>
            <li>Giấy xác nhận tình trạng hôn nhân.</li>
            <li>Giấy khám sức khỏe, xác nhận thu nhập, tài sản.</li>
            <li>Lý lịch tư pháp.</li>
            <li>Giấy khai sinh của trẻ em được nhận nuôi.</li>
            <li>Giấy đồng ý của cha mẹ đẻ hoặc người giám hộ (nếu có).</li>
          </ul>

          <h2>3. Quy trình thực hiện</h2>
          <ol>
            <li>Nộp hồ sơ tại UBND cấp xã nơi trẻ em thường trú.</li>
            <li>Cơ quan có thẩm quyền kiểm tra, xác minh hồ sơ.</li>
            <li>Niêm yết công khai việc nhận con nuôi tại trụ sở UBND xã.</li>
            <li>Ra quyết định công nhận việc nhận con nuôi nếu đủ điều kiện.</li>
          </ol>

          <h2>4. Lưu ý khi thực hiện thủ tục</h2>
          <ul>
            <li>Chuẩn bị đầy đủ giấy tờ, hồ sơ theo quy định.</li>
            <li>Thời gian giải quyết thường từ 30-60 ngày làm việc.</li>
            <li>Nên liên hệ trước với UBND xã/phường để được hướng dẫn chi tiết.</li>
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

export default AdoptionGuide;
