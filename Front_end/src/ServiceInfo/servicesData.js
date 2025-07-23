// Dịch vụ Hành chính (Administrative Services) - Phục vụ cơ quan nhà nước
export const administrativeServices = [
  {
    id: "paternity-legal",
    title: "Xét nghiệm huyết thống",
    description: "Kiểm tra mối quan hệ huyết thống giữa các cá nhân.",
    icon: "🧬",
    price: "3,500,000 VNĐ",
    category: "Hành chính",
    image: "/images/paternity-legal.jpg",
    features: [
      "Có giá trị pháp lý cao",
      "Phục vụ cơ quan nhà nước",
      "Quy trình nghiêm ngặt",
      "Báo cáo chính thức",
    ],
    requirements: [
      "CMND/CCCD của các bên liên quan",
      "Giấy chuyển từ cơ quan có thẩm quyền",
      "Mẫu sinh học được lấy tại lab",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu sinh học tại phòng xét nghiệm",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và báo cáo pháp lý",
    ],
    processingTime: "5-7 ngày làm việc",
  },
  {
    id: "remains-identification",
    title: "Xét nghiệm hài cốt",
    description:
      "Phân tích ADN từ hài cốt để xác định danh tính hoặc quan hệ huyết thống.",
    icon: "🦴",
    price: "7,000,000 VNĐ",
    category: "Hành chính",
    image: "/images/remains.jpg",
    features: [
      "Nhận dạng hài cốt",
      "Hỗ trợ công tác pháp y",
      "Xác định người mất tích",
      "Có giá trị pháp lý",
    ],
    requirements: [
      "Mẫu hài cốt (xương, răng)",
      "Giấy chuyển từ cơ quan công an/tòa án",
      "Mẫu tham chiếu từ người thân",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Tách chiết ADN từ mẫu hài cốt",
      "So sánh với mẫu tham chiếu",
      "Trả kết quả và báo cáo",
    ],
    processingTime: "10-15 ngày làm việc",
  },
  {
    id: "legal-analysis",
    title: "Xét nghiệm ADN pháp lý",
    description:
      "ADN được sử dụng trong hỗ trợ pháp lý, yêu cầu của cơ quan có thẩm quyền.",
    icon: "⚖️",
    price: "5,000,000 VNĐ",
    category: "Cả hai",
    image: "/images/forensic.jpg",
    features: [
      "Phục vụ điều tra hình sự",
      "Xác định danh tính nghi phạm",
      "Hỗ trợ tòa án",
      "Báo cáo chuyên môn cao",
    ],
    requirements: [
      "CMND/CCCD các bên liên quan",
      "Giấy chuyển từ cơ quan có thẩm quyền",
    ],
    process: [
      "Tiếp nhận hồ sơ pháp lý",
      "Lấy mẫu sinh học",
      "Phân tích ADN",
      "Xuất báo cáo pháp lý",
    ],
    processingTime: "7-10 ngày làm việc",
  },
  {
    id: "administrative-test",
    title: "Xét nghiệm ADN hành chính",
    description:
      "Sử dụng trong các thủ tục hành chính như nhập quốc tịch, thị thực.",
    icon: "🛂",
    price: "4,500,000 VNĐ",
    category: "Hành chính",
    image: "/images/immigration.jpg",
    features: [
      "Phục vụ thủ tục visa",
      "Chứng minh quan hệ gia đình",
      "Đáp ứng chuẩn quốc tế",
      "Dịch thuật đa ngôn ngữ",
    ],
    requirements: [
      "CMND/CCCD các bên liên quan",
      "Giấy tờ chứng minh quan hệ (nếu có)",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu sinh học",
      "Phân tích ADN",
      "Trả kết quả và hỗ trợ thủ tục hành chính",
    ],
    processingTime: "5-8 ngày làm việc",
  },
];

// Dịch vụ Dân sự (Civil Services) - Phục vụ nhu cầu cá nhân
export const civilServices = [
  {
    id: "personal-test",
    title: "Xét nghiệm ADN cá nhân",
    description:
      "Xét nghiệm ADN phục vụ mục đích cá nhân, kiểm tra quan hệ huyết thống.",
    icon: "👤",
    price: "2,500,000 VNĐ",
    category: "Dân sự",
    image: "/images/personal.jpg",
    features: [
      "Kiểm tra quan hệ huyết thống cá nhân",
      "Bảo mật thông tin",
      "Kết quả nhanh chóng",
    ],
    requirements: [
      "CMND/CCCD của người xét nghiệm",
      "Mẫu sinh học (máu, niêm mạc miệng, tóc, móng, ...)",
    ],
    process: [
      "Tư vấn và tiếp nhận mẫu",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và tư vấn",
    ],
    processingTime: "5-7 ngày làm việc",
  },
  {
    id: "prenatal-test",
    title: "Xét nghiệm ADN trước sinh",
    description:
      "Xét nghiệm ADN thai nhi không xâm lấn để xác định quan hệ huyết thống.",
    icon: "🤱",
    price: "9,000,000 VNĐ",
    category: "Dân sự",
    image: "/images/prenatal.jpg",
    features: [
      "An toàn cho mẹ và bé",
      "Kết quả từ tuần thứ 9",
      "Không cần thủ tục phức tạp",
      "Tư vấn di truyền",
    ],
    requirements: [
      "Thai kỳ từ 9 tuần",
      "CMND/CCCD của mẹ",
      "Mẫu máu tĩnh mạch",
    ],
    process: [
      "Tư vấn và đánh giá tình trạng thai kỳ",
      "Lấy mẫu máu tĩnh mạch của mẹ",
      "Lấy mẫu ADN của người cha nghi ngờ",
      "Tách ADN thai nhi từ mẫu máu mẹ bằng công nghệ tiên tiến",
      "Phân tích so sánh ADN",
      "Tư vấn kết quả và chuyên gia di truyền",
    ],
    processingTime: "7-10 ngày làm việc",
  },
  {
    id: "other-test",
    title: "Xét nghiệm ADN khác",
    description:
      "Dịch vụ xét nghiệm ADN đặc thù khác theo yêu cầu của khách hàng.",
    icon: "🧪",
    price: "6,000,000 VNĐ",
    category: "Dân sự",
    image: "/images/other.jpg",
    features: [
      "Xét nghiệm theo yêu cầu",
      "Tư vấn di truyền",
      "Bảo mật thông tin",
    ],
    requirements: [
      "CMND/CCCD các bên liên quan (nếu cần)",
      "Mẫu sinh học phù hợp với yêu cầu",
    ],
    process: [
      "Tư vấn và tiếp nhận yêu cầu",
      "Lấy mẫu sinh học",
      "Phân tích ADN",
      "Trả kết quả và tư vấn",
    ],
    processingTime: "7-10 ngày làm việc",
  },
  {
    id: "fetal-test",
    title: "Xét nghiệm ADN thai nhi",
    description:
      "Phân tích ADN thai nhi để kiểm tra huyết thống hoặc bệnh di truyền.",
    icon: "👶",
    price: "8,500,000 VNĐ",
    category: "Dân sự",
    image: "/images/fetal.jpg",
    features: [
      "Kiểm tra huyết thống thai nhi",
      "Tầm soát bệnh di truyền",
      "Tư vấn sức khỏe",
    ],
    requirements: [
      "Thai kỳ từ 9 tuần",
      "CMND/CCCD của mẹ",
      "Mẫu máu tĩnh mạch",
    ],
    process: [
      "Tư vấn và tiếp nhận mẫu",
      "Tách chiết ADN thai nhi",
      "Phân tích và so sánh kết quả",
      "Tư vấn kết quả",
    ],
    processingTime: "10-12 ngày làm việc",
  },
  {
    id: "genetic-analysis",
    title: "Xét nghiệm ADN di truyền",
    description: "Tầm soát các bệnh di truyền hoặc đột biến gen.",
    icon: "🔬",
    price: "6,000,000 VNĐ",
    category: "Dân sự",
    image: "/images/genetic.jpg",
    features: [
      "Phát hiện bệnh di truyền",
      "Tư vấn sức khỏe",
      "Lập kế hoạch sinh sản",
      "Bảo mật thông tin",
    ],
    requirements: [
      "CMND/CCCD của người xét nghiệm",
      "Mẫu sinh học (máu, niêm mạc miệng, ...)",
    ],
    process: [
      "Tư vấn và tiếp nhận mẫu",
      "Phân tích ADN tại phòng lab",
      "Đánh giá nguy cơ di truyền",
      "Tư vấn kết quả",
    ],
    processingTime: "10-12 ngày làm việc",
  },
  {
    id: "civil-test",
    title: "Xét nghiệm ADN dân sự",
    description:
      "Dùng trong tranh chấp dân sự như phân chia tài sản, xác nhận quan hệ huyết thống.",
    icon: "📄",
    price: "4,800,000 VNĐ",
    category: "Dân sự",
    image: "/images/civil.jpg",
    features: [
      "Phục vụ tranh chấp dân sự",
      "Có giá trị pháp lý",
      "Bảo mật thông tin",
    ],
    requirements: [
      "CMND/CCCD các bên liên quan",
      "Giấy tờ liên quan đến tranh chấp (nếu có)",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu sinh học",
      "Phân tích ADN",
      "Trả kết quả và tư vấn pháp lý",
    ],
    processingTime: "7-10 ngày làm việc",
  },
];

export const allServices = [...administrativeServices, ...civilServices];
