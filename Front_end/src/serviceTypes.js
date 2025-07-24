const serviceTypes = [
  { service_id: 1, service_name: "Xét nghiệm huyết thống", description: "Xác định quan hệ huyết thống giữa các thành viên trong gia đình.", kits: [
    { kitComponentName: "Buccal Swab", introduction: "Tăm bông lấy mẫu niêm mạc miệng" },
    { kitComponentName: "Sample Storage Bag", introduction: "Túi lưu trữ mẫu sinh học" },
    { kitComponentName: "User Manual", introduction: "Hướng dẫn sử dụng bộ kit" }
  ] },
  { service_id: 2, service_name: "Xét nghiệm hài cốt", description: "Giám định ADN từ mẫu hài cốt để xác minh danh tính.", kits: [
    { kitComponentName: "Bone Collection Tube", introduction: "Ống thu thập mẫu xương" },
    { kitComponentName: "Shockproof Box", introduction: "Hộp chống sốc bảo vệ mẫu" },
    { kitComponentName: "User Manual", introduction: "Hướng dẫn sử dụng bộ kit" }
  ] },
  { service_id: 3, service_name: "Xét nghiệm ADN cá nhân", description: "Kiểm tra cấu trúc ADN cá nhân phục vụ mục đích cá nhân hoặc sức khỏe.", kits: [
    { kitComponentName: "Personal DNA Test Kit", introduction: "Bộ kit lấy mẫu ADN cá nhân" },
    { kitComponentName: "Sample Envelope", introduction: "Phong bì lưu trữ mẫu" }
  ] },
  { service_id: 4, service_name: "Xét nghiệm ADN pháp lý", description: "Xét nghiệm ADN phục vụ mục đích pháp lý, hành chính.", kits: [
    { kitComponentName: "Legal Confirmation Form", introduction: "Phiếu xác nhận pháp lý" },
    { kitComponentName: "Administrative Form", introduction: "Phiếu hành chính" },
    { kitComponentName: "Legal File Cover", introduction: "Bìa hồ sơ pháp lý" }
  ] },
  { service_id: 5, service_name: "Xét nghiệm ADN trước sinh", description: "Xét nghiệm ADN cho thai nhi không xâm lấn.", kits: [
    { kitComponentName: "Prenatal DNA Test Kit", introduction: "Bộ kit lấy mẫu ADN trước sinh" },
    { kitComponentName: "Pregnancy Safety Guide", introduction: "Hướng dẫn an toàn thai kỳ" },
    { kitComponentName: "Safety Instruction", introduction: "Hướng dẫn an toàn sử dụng kit" }
  ] },
  { service_id: 6, service_name: "Xét nghiệm ADN khác", description: "Các loại xét nghiệm ADN đặc thù khác theo yêu cầu.", kits: [
    { kitComponentName: "Custom DNA Kit", introduction: "Bộ kit ADN tùy chỉnh theo yêu cầu" }
  ] },
  { service_id: 7, service_name: "Xét nghiệm ADN thai nhi", description: "Xét nghiệm ADN xác định huyết thống thai nhi.", kits: [
    { kitComponentName: "Prenatal DNA Test Kit", introduction: "Bộ kit lấy mẫu ADN thai nhi" },
    { kitComponentName: "Safety Instruction", introduction: "Hướng dẫn an toàn sử dụng kit" }
  ] },
  { service_id: 8, service_name: "Xét nghiệm ADN di truyền", description: "Xét nghiệm ADN phát hiện bệnh lý di truyền.", kits: [
    { kitComponentName: "Genetic History Form", introduction: "Phiếu khai thông tin di truyền" },
    { kitComponentName: "Gene Report Guide", introduction: "Hướng dẫn đọc kết quả gen" }
  ] },
  { service_id: 9, service_name: "Xét nghiệm ADN hành chính", description: "Xét nghiệm ADN phục vụ mục đích hành chính.", kits: [
    { kitComponentName: "Administrative Form", introduction: "Phiếu hành chính" },
    { kitComponentName: "Legal File Cover", introduction: "Bìa hồ sơ pháp lý" }
  ] },
  { service_id: 10, service_name: "Xét nghiệm ADN dân sự", description: "Xét nghiệm ADN phục vụ mục đích dân sự, tranh chấp.", kits: [
    { kitComponentName: "Civil Dispute Form", introduction: "Phiếu tranh chấp dân sự" },
    { kitComponentName: "Judicial File", introduction: "Hồ sơ tư pháp" }
  ] },
];

export default serviceTypes;
