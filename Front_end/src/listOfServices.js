import React from "react";

const ADNTestingServices = [
  {
    id: "paternity-legal",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.IkWNucyRYfZ0YsKDfS5b7gHaE7?rs=1&pid=ImgDetMain",
    testType: "Xét nghiệm huyết thống cha-con",
    sampleRequired: "Mẫu máu hoặc mẫu niêm mạc miệng",
    turnaroundTime: "5-7 ngày",
    price: "$200",
    rating: "4.8",
    isAccredited: true,
    description:
      "Xác định quan hệ cha-con chính xác và bảo mật. Kết quả có giá trị pháp lý nếu cần.",
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
  },
  {
    id: "personal-test",
    image:
      "https://th.bing.com/th/id/OIP.k76QJAyU8XZp8MaGuRPMgQHaFj?rs=1&pid=ImgDetMain",
    testType: "Xét nghiệm huyết thống mẹ-con",
    sampleRequired: "Mẫu máu hoặc mẫu niêm mạc miệng",
    turnaroundTime: "5-7 ngày",
    price: "$180",
    rating: "4.6",
    isAccredited: true,
    description:
      "Xác minh mối quan hệ mẹ-con. Quy trình nhanh gọn, kết quả chính xác.",
    features: [
      "Kiểm tra quan hệ huyết thống cá nhân",
      "Bảo mật thông tin",
      "Kết quả nhanh chóng",
    ],
    requirements: [
      "CMND/CCCD của người xét nghiệm",
      "Mẫu sinh học (máu, niêm mạc miệng, tóc, móng, ... )",
    ],
    process: [
      "Tư vấn và tiếp nhận mẫu",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và tư vấn",
    ],
    benefits: [
      "Kết quả nhanh chóng, bảo mật tuyệt đối",
      "Hỗ trợ tư vấn miễn phí trước và sau xét nghiệm",
      "Có thể sử dụng kết quả cho mục đích cá nhân hoặc pháp lý",
    ],
    suitableFor: [
      "Cá nhân muốn xác minh quan hệ huyết thống mẹ-con",
      "Gia đình cần xác nhận huyết thống cho thủ tục hành chính",
    ],
    notes: [
      "Khách hàng nên mang đầy đủ giấy tờ tùy thân khi đến lấy mẫu",
      "Không ăn uống, súc miệng kỹ trước khi lấy mẫu niêm mạc miệng",
    ],
    faqs: [
      {
        question: "Kết quả xét nghiệm có bảo mật không?",
        answer: "Chúng tôi cam kết bảo mật tuyệt đối thông tin khách hàng.",
      },
      {
        question: "Có thể lấy mẫu tại nhà không?",
        answer: "Bạn có thể đăng ký dịch vụ lấy mẫu tại nhà với phụ phí nhỏ.",
      },
    ],
  },
  {
    id: "civil-test",
    image:
      "https://adnlhb.vn/wp-content/uploads/2023/04/20160411171204-anh-em6.jpg",
    testType: "Xét nghiệm anh/chị/em ruột",
    sampleRequired: "Mẫu niêm mạc miệng",
    turnaroundTime: "7-10 ngày",
    price: "$220",
    rating: "4.5",
    isAccredited: true,
    description:
      "Xác định quan hệ anh/chị/em ruột với độ chính xác cao. Có thể áp dụng cho mục đích hành chính.",
    features: [
      "Độ chính xác cao cho quan hệ anh/chị/em ruột",
      "Phù hợp cho các mục đích hành chính và cá nhân",
      "Bảo mật thông tin khách hàng",
    ],
    requirements: [
      "CMND/CCCD của các bên liên quan",
      "Mẫu niêm mạc miệng lấy tại phòng xét nghiệm",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu niêm mạc miệng",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và tư vấn",
    ],
    benefits: [
      "Giúp xác định chính xác mối quan hệ anh/chị/em ruột",
      "Hỗ trợ các thủ tục pháp lý, hành chính",
      "Bảo mật tuyệt đối thông tin khách hàng",
    ],
    suitableFor: [
      "Gia đình muốn xác minh quan hệ anh/chị/em ruột",
      "Các trường hợp tranh chấp tài sản, thừa kế",
    ],
    notes: [
      "Nên lấy mẫu tại phòng xét nghiệm để đảm bảo kết quả",
      "Không ăn uống, súc miệng kỹ trước khi lấy mẫu",
    ],
    faqs: [
      {
        question: "Có thể dùng kết quả cho mục đích pháp lý không?",
        answer:
          "Kết quả có thể sử dụng cho các thủ tục hành chính, pháp lý nếu cần.",
      },
      {
        question: "Thời gian trả kết quả là bao lâu?",
        answer: "Thông thường từ 7-10 ngày làm việc.",
      },
    ],
  },
  {
    id: "remains-identification",
    image:
      "https://th.bing.com/th/id/OIP.rPOolSmkx_MXofAT4HdPyAHaE8?w=245&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    testType: "Xét nghiệm ông/bà - cháu",
    sampleRequired: "Mẫu niêm mạc miệng",
    turnaroundTime: "7-10 ngày",
    price: "$250",
    rating: "4.4",
    isAccredited: true,
    description:
      "Xác minh quan hệ huyết thống giữa ông/bà và cháu, hỗ trợ các thủ tục pháp lý.",
    features: [
      "Xác minh quan hệ huyết thống thế hệ kế tiếp",
      "Hỗ trợ các thủ tục pháp lý, hành chính",
      "Bảo mật thông tin khách hàng",
    ],
    requirements: [
      "CMND/CCCD của các bên liên quan",
      "Mẫu niêm mạc miệng lấy tại phòng xét nghiệm",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu niêm mạc miệng",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và tư vấn",
    ],
    benefits: [
      "Giúp xác minh quan hệ huyết thống giữa các thế hệ",
      "Hỗ trợ các thủ tục pháp lý, hành chính",
      "Bảo mật tuyệt đối thông tin khách hàng",
    ],
    suitableFor: [
      "Gia đình muốn xác minh quan hệ ông/bà - cháu",
      "Các trường hợp tranh chấp tài sản, thừa kế",
    ],
    notes: [
      "Nên lấy mẫu tại phòng xét nghiệm để đảm bảo kết quả",
      "Không ăn uống, súc miệng kỹ trước khi lấy mẫu",
    ],
    faqs: [
      {
        question: "Kết quả có giá trị pháp lý không?",
        answer:
          "Kết quả có thể sử dụng cho các thủ tục hành chính, pháp lý nếu cần.",
      },
      {
        question: "Có thể lấy mẫu tại nhà không?",
        answer: "Bạn có thể đăng ký dịch vụ lấy mẫu tại nhà với phụ phí nhỏ.",
      },
    ],
  },
  {
    id: "5",
    image:
      "https://th.bing.com/th/id/OIP.pBVDhS_3ebAJbuAYleUPBwHaE8?w=233&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    testType: "Xét nghiệm song sinh",
    sampleRequired: "Mẫu niêm mạc miệng",
    turnaroundTime: "5-7 ngày",
    price: "$150",
    rating: "4.7",
    isAccredited: true,
    description:
      "Phân biệt song sinh cùng trứng hay khác trứng, giúp xác định mối quan hệ di truyền.",
    features: [
      "Phân biệt song sinh cùng trứng/khác trứng",
      "Độ chính xác cao",
      "Bảo mật thông tin khách hàng",
    ],
    requirements: [
      "CMND/CCCD của các bên liên quan",
      "Mẫu niêm mạc miệng lấy tại phòng xét nghiệm",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu niêm mạc miệng",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và tư vấn",
    ],
    benefits: [
      "Giúp xác định chính xác loại song sinh",
      "Hỗ trợ tư vấn di truyền cho gia đình",
      "Bảo mật tuyệt đối thông tin khách hàng",
    ],
    suitableFor: [
      "Gia đình có con song sinh muốn xác định loại song sinh",
      "Các trường hợp cần tư vấn di truyền",
    ],
    notes: [
      "Nên lấy mẫu tại phòng xét nghiệm để đảm bảo kết quả",
      "Không ăn uống, súc miệng kỹ trước khi lấy mẫu",
    ],
    faqs: [
      {
        question: "Kết quả có chính xác không?",
        answer: "Kết quả có độ chính xác rất cao nhờ công nghệ hiện đại.",
      },
      {
        question: "Có thể lấy mẫu tại nhà không?",
        answer: "Bạn có thể đăng ký dịch vụ lấy mẫu tại nhà với phụ phí nhỏ.",
      },
    ],
  },
  {
    id: "6",
    image:
      "https://th.bing.com/th/id/OIP.RNmVhydcDYkxiEm2ftvhHgHaEw?w=269&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    testType: "Xét nghiệm ADN trước sinh",
    sampleRequired: "Máu mẹ và mẫu của cha giả định",
    turnaroundTime: "10-14 ngày",
    price: "$800",
    rating: "4.9",
    isAccredited: true,
    description:
      "Xét nghiệm huyết thống trước sinh không xâm lấn, đảm bảo an toàn cho mẹ và thai nhi.",
    features: [
      "Không xâm lấn, an toàn cho mẹ và bé",
      "Độ chính xác cao",
      "Bảo mật thông tin khách hàng",
    ],
    requirements: [
      "CMND/CCCD của mẹ",
      "Mẫu máu tĩnh mạch của mẹ và mẫu của cha giả định",
    ],
    process: [
      "Tư vấn và đánh giá tình trạng thai kỳ",
      "Lấy mẫu máu tĩnh mạch của mẹ",
      "Lấy mẫu ADN của người cha nghi ngờ",
      "Tách ADN thai nhi từ mẫu máu mẹ bằng công nghệ tiên tiến",
      "Phân tích so sánh ADN",
      "Tư vấn kết quả và chuyên gia di truyền",
    ],
    benefits: [
      "Giúp xác định huyết thống thai nhi an toàn, không xâm lấn",
      "Hỗ trợ tư vấn di truyền cho gia đình",
      "Bảo mật tuyệt đối thông tin khách hàng",
    ],
    suitableFor: [
      "Phụ nữ mang thai muốn xác định huyết thống thai nhi",
      "Gia đình cần tư vấn di truyền trước sinh",
    ],
    notes: [
      "Nên lấy mẫu tại phòng xét nghiệm để đảm bảo kết quả",
      "Tham khảo ý kiến bác sĩ trước khi thực hiện",
    ],
    faqs: [
      {
        question: "Xét nghiệm có an toàn cho mẹ và bé không?",
        answer: "Xét nghiệm không xâm lấn, an toàn cho cả mẹ và thai nhi.",
      },
      {
        question: "Thời gian trả kết quả là bao lâu?",
        answer: "Thông thường từ 10-14 ngày làm việc.",
      },
    ],
  },
  {
    id: "7",
    image:
      "https://th.bing.com/th/id/R.f110b45b4407018ecdaf0301a18ae6fe?rik=AsQP%2fnsGSJ5%2bfg&pid=ImgRaw&r=0",
    testType: "Xét nghiệm phả hệ di truyền",
    sampleRequired: "Mẫu niêm mạc miệng",
    turnaroundTime: "14-21 ngày",
    price: "$300",
    rating: "4.2",
    isAccredited: false,
    description:
      "Khám phá nguồn gốc tổ tiên di truyền, hỗ trợ tìm hiểu lịch sử gia đình.",
    features: [
      "Khám phá nguồn gốc tổ tiên di truyền",
      "Hỗ trợ tìm hiểu lịch sử gia đình",
      "Bảo mật thông tin khách hàng",
    ],
    requirements: [
      "CMND/CCCD của người xét nghiệm",
      "Mẫu niêm mạc miệng lấy tại phòng xét nghiệm",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu niêm mạc miệng",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và tư vấn",
    ],
    benefits: [
      "Giúp khám phá nguồn gốc tổ tiên di truyền",
      "Hỗ trợ tìm hiểu lịch sử gia đình",
      "Bảo mật tuyệt đối thông tin khách hàng",
    ],
    suitableFor: [
      "Cá nhân muốn tìm hiểu nguồn gốc tổ tiên",
      "Gia đình muốn khám phá lịch sử di truyền",
    ],
    notes: [
      "Nên lấy mẫu tại phòng xét nghiệm để đảm bảo kết quả",
      "Không ăn uống, súc miệng kỹ trước khi lấy mẫu",
    ],
    faqs: [
      {
        question: "Kết quả có chính xác không?",
        answer: "Kết quả có độ chính xác rất cao nhờ công nghệ hiện đại.",
      },
      {
        question: "Có thể lấy mẫu tại nhà không?",
        answer: "Bạn có thể đăng ký dịch vụ lấy mẫu tại nhà với phụ phí nhỏ.",
      },
    ],
  },
  {
    id: "8",
    image:
      "https://th.bing.com/th/id/OIP.J2jei1Wl3bJYFD1G9I1IAgHaB7?w=341&h=91&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    testType: "Xét nghiệm gen bệnh lý di truyền",
    sampleRequired: "Mẫu niêm mạc miệng",
    turnaroundTime: "10-14 ngày",
    price: "$350",
    rating: "4.3",
    isAccredited: true,
    description:
      "Xác định nguy cơ mắc các bệnh di truyền phổ biến, giúp tầm soát sức khỏe.",
    features: [
      "Tầm soát các bệnh di truyền phổ biến",
      "Hỗ trợ tư vấn sức khỏe di truyền",
      "Bảo mật thông tin khách hàng",
    ],
    requirements: [
      "CMND/CCCD của người xét nghiệm",
      "Mẫu niêm mạc miệng lấy tại phòng xét nghiệm",
    ],
    process: [
      "Tư vấn và tiếp nhận hồ sơ",
      "Lấy mẫu niêm mạc miệng",
      "Phân tích ADN tại phòng lab",
      "Trả kết quả và tư vấn",
    ],
    benefits: [
      "Giúp tầm soát nguy cơ bệnh di truyền",
      "Hỗ trợ tư vấn sức khỏe di truyền cho gia đình",
      "Bảo mật tuyệt đối thông tin khách hàng",
    ],
    suitableFor: [
      "Cá nhân muốn tầm soát bệnh di truyền",
      "Gia đình có tiền sử bệnh di truyền",
    ],
    notes: [
      "Nên lấy mẫu tại phòng xét nghiệm để đảm bảo kết quả",
      "Tham khảo ý kiến bác sĩ trước khi thực hiện",
    ],
    faqs: [
      {
        question: "Kết quả có chính xác không?",
        answer: "Kết quả có độ chính xác rất cao nhờ công nghệ hiện đại.",
      },
      {
        question: "Có thể lấy mẫu tại nhà không?",
        answer: "Bạn có thể đăng ký dịch vụ lấy mẫu tại nhà với phụ phí nhỏ.",
      },
    ],
  },
];

export default ADNTestingServices;
