import React from "react";
import "./ADNIntro.css";

export default function ADNIntro() {
  return (
    <div className="adn-intro-container">
      <div className="text-center mb-4">
        <h2 className="adn-intro-title">
          Chào mừng đến với Hệ thống Dịch vụ Xét nghiệm ADN
        </h2>
        <p className="adn-intro-subtitle">
          Khám phá sự thật, kết nối yêu thương, xây dựng niềm tin!
        </p>
        <p className="adn-intro-desc">
          Website Dịch vụ Xét nghiệm ADN là nơi cung cấp các giải pháp xét
          nghiệm hiện đại, nhanh chóng và chính xác cho mọi nhu cầu về huyết
          thống, pháp lý, y học và truy tìm nguồn gốc. Chúng tôi cam kết bảo mật
          thông tin, hỗ trợ tận tâm và đồng hành cùng bạn trên hành trình tìm
          kiếm sự thật và xây dựng niềm tin vững chắc cho gia đình.
        </p>
      </div>
      <div className="adn-intro-card">
        <div className="adn-intro-card-content">
          <h2 className="adn-intro-card-title">
            Thông tin về trang web xét nghiệm ADN của chúng tôi
          </h2>
          <p className="adn-intro-card-text">
            Trang web của chúng tôi là nền tảng hỗ trợ tra cứu thông tin, đăng
            ký xét nghiệm, theo dõi tiến trình và nhận kết quả nhanh chóng,
            chính xác. Với đội ngũ chuyên gia giàu kinh nghiệm, công nghệ hiện
            đại và dịch vụ tận tâm, chúng tôi cam kết mang đến trải nghiệm an
            toàn, bảo mật và sự hài lòng tuyệt đối cho khách hàng.
          </p>
        </div>
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQwjR3jsDoG0FSSCtkdeGXWoQ-TehqeAIqz8A&s"
          alt="ADN Service"
          className="adn-intro-card-img"
        />
      </div>
    </div>
  );
}
