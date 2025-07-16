const serviceTypes = [
  { service_id: 1, service_name: "Xét nghiệm huyết thống", description: "Xác định quan hệ huyết thống giữa các thành viên trong gia đình.", kits: ["Buccal Swab", "Sample Storage Bag", "User Manual"] },
  { service_id: 2, service_name: "Xét nghiệm hài cốt", description: "Giám định ADN từ mẫu hài cốt để xác minh danh tính.", kits: ["Bone Collection Tube", "Shockproof Box", "User Manual"] },
  { service_id: 3, service_name: "Xét nghiệm ADN cá nhân", description: "Kiểm tra cấu trúc ADN cá nhân phục vụ mục đích cá nhân hoặc sức khỏe.", kits: ["Personal DNA Test Kit", "Sample Envelope"] },
  { service_id: 4, service_name: "Xét nghiệm ADN pháp lý", description: "Xét nghiệm ADN phục vụ mục đích pháp lý, hành chính.", kits: ["Legal Confirmation Form", "Administrative Form", "Legal File Cover"] },
  { service_id: 5, service_name: "Xét nghiệm ADN trước sinh", description: "Xét nghiệm ADN cho thai nhi không xâm lấn.", kits: ["Prenatal DNA Test Kit", "Pregnancy Safety Guide", "Safety Instruction"] },
  { service_id: 6, service_name: "Xét nghiệm ADN khác", description: "Các loại xét nghiệm ADN đặc thù khác theo yêu cầu.", kits: ["Custom DNA Kit"] },
  { service_id: 7, service_name: "Xét nghiệm ADN thai nhi", description: "Xét nghiệm ADN xác định huyết thống thai nhi.", kits: ["Prenatal DNA Test Kit", "Safety Instruction"] },
  { service_id: 8, service_name: "Xét nghiệm ADN di truyền", description: "Xét nghiệm ADN phát hiện bệnh lý di truyền.", kits: ["Genetic History Form", "Gene Report Guide"] },
  { service_id: 9, service_name: "Xét nghiệm ADN hành chính", description: "Xét nghiệm ADN phục vụ mục đích hành chính.", kits: ["Administrative Form", "Legal File Cover"] },
  { service_id: 10, service_name: "Xét nghiệm ADN dân sự", description: "Xét nghiệm ADN phục vụ mục đích dân sự, tranh chấp.", kits: ["Civil Dispute Form", "Judicial File"] },
];

export default serviceTypes;
