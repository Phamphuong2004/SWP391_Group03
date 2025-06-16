export const administrativeServices = [
    {
        id: 'birth-certificate',
        title: 'Làm Giấy Khai Sinh',
        description: 'Hỗ trợ thủ tục làm giấy khai sinh cho trẻ em, bao gồm cả trường hợp khai sinh muộn',
        icon: '📄',
        price: 'Liên hệ',
        category: 'Hành chính',
        image: '/images/birth-certificate.jpg',
        features: [
            'Hỗ trợ làm giấy khai sinh cho trẻ em dưới 1 tuổi',
            'Hỗ trợ làm giấy khai sinh muộn cho trẻ em trên 1 tuổi',
            'Tư vấn thủ tục và hồ sơ cần thiết',
            'Hỗ trợ điền đơn và chuẩn bị hồ sơ'
        ],
        requirements: [
            "Giấy chứng sinh",
            "Sổ hộ khẩu",
            "CMND/CCCD của cha mẹ",
            "Giấy đăng ký kết hôn (nếu có)"
        ],
        process: [
            "Tư vấn và kiểm tra hồ sơ",
            "Điền đơn và chuẩn bị hồ sơ",
            "Nộp hồ sơ tại UBND phường/xã",
            "Theo dõi tiến độ xử lý",
            "Nhận kết quả và bàn giao cho khách hàng"
        ],
        processingTime: "3-5 ngày làm việc"
    },
    {
        id: 'household-registration',
        title: "Nhập hộ khẩu",
        description: "Hỗ trợ thủ tục nhập hộ khẩu, chuyển hộ khẩu và các vấn đề liên quan đến hộ khẩu.",
        icon: "🏠",
        category: 'Hành chính',
        image: '/images/household-registration.jpg',
        features: [
            'Hỗ trợ nhập hộ khẩu mới',
            'Hỗ trợ chuyển hộ khẩu',
            'Tư vấn thủ tục và hồ sơ cần thiết',
            'Hỗ trợ điền đơn và chuẩn bị hồ sơ'
        ],
        requirements: [
            "Sổ hộ khẩu",
            "CMND/CCCD",
            "Giấy tờ chứng minh nơi ở hợp pháp",
            "Đơn xin nhập hộ khẩu"
        ],
        process: [
            "Tư vấn và kiểm tra hồ sơ",
            "Điền đơn và chuẩn bị hồ sơ",
            "Nộp hồ sơ tại UBND phường/xã",
            "Theo dõi tiến độ xử lý",
            "Nhận kết quả và bàn giao cho khách hàng"
        ],
        processingTime: "5-7 ngày làm việc"
    },
    {
        id: 'adoption',
        title: "Nhận con nuôi",
        description: "Tư vấn và hỗ trợ các thủ tục pháp lý liên quan đến việc nhận con nuôi.",
        icon: "👨‍👩‍👧‍👦",
        category: 'Hành chính',
        image: '/images/adoption.jpg',
        features: [
            'Tư vấn pháp lý về thủ tục nhận con nuôi',
            'Hỗ trợ chuẩn bị hồ sơ',
            'Hỗ trợ thủ tục tại cơ quan nhà nước',
            'Theo dõi tiến độ xử lý hồ sơ'
        ],
        requirements: [
            "Đơn xin nhận con nuôi",
            "CMND/CCCD của người nhận nuôi",
            "Giấy tờ chứng minh điều kiện nuôi con",
            "Giấy tờ của trẻ em"
        ],
        process: [
            "Tư vấn pháp lý",
            "Kiểm tra điều kiện nhận nuôi",
            "Chuẩn bị hồ sơ",
            "Nộp hồ sơ tại cơ quan có thẩm quyền",
            "Theo dõi tiến độ xử lý",
            "Nhận kết quả và bàn giao cho khách hàng"
        ],
        processingTime: "30-45 ngày làm việc"
    },
    {
        id: 'family-relationship',
        title: "Xác nhận quan hệ huyết thống",
        description: "Cung cấp dịch vụ xác nhận quan hệ huyết thống phục vụ cho các cơ quan nhà nước.",
        icon: "🧬",
        category: 'Hành chính',
        image: '/images/family-relationship.jpg',
        features: [
            'Xác nhận quan hệ cha mẹ - con',
            'Xác nhận quan hệ anh chị em',
            'Xác nhận quan hệ ông bà - cháu',
            'Hỗ trợ thủ tục pháp lý'
        ],
        requirements: [
            "CMND/CCCD của các bên liên quan",
            "Giấy tờ chứng minh quan hệ",
            "Đơn xin xác nhận quan hệ"
        ],
        process: [
            "Tư vấn và kiểm tra hồ sơ",
            "Chuẩn bị hồ sơ",
            "Nộp hồ sơ tại cơ quan có thẩm quyền",
            "Theo dõi tiến độ xử lý",
            "Nhận kết quả và bàn giao cho khách hàng"
        ],
        processingTime: "7-10 ngày làm việc"
    }
]; 