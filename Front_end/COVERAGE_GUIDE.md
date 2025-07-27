# 📊 Hướng Dẫn Code Coverage Testing

## 🎯 Tổng quan

Code coverage cho biết phần trăm code đã được test bao phủ, giúp đánh giá chất lượng testing.

## 🛠️ Các lệnh có sẵn

### 1. Chạy test với coverage

```bash
npm run test:coverage
```

- Chạy tất cả unit tests và tạo báo cáo coverage
- Tạo folder `coverage/` với các file báo cáo

### 2. Xem báo cáo tóm tắt

```bash
npm run coverage:summary
```

- Hiển thị tóm tắt coverage trong terminal
- Liệt kê các file có coverage cao/thấp

### 3. Xem báo cáo chi tiết HTML

```bash
# Mở file coverage/index.html trong browser
start coverage/index.html  # Windows
open coverage/index.html   # macOS
```

### 4. Chạy test cụ thể với coverage

```bash
npx vitest run src/Payment/Payment.test.jsx --coverage
```

## 📈 Các chỉ số Coverage

### **Statements** (Câu lệnh)

- Phần trăm các câu lệnh code đã được thực thi
- **Mục tiêu:** ≥ 80%

### **Branches** (Nhánh điều kiện)

- Phần trăm các nhánh if/else, switch đã được test
- **Mục tiêu:** ≥ 75%

### **Functions** (Hàm)

- Phần trăm các function đã được gọi trong test
- **Mục tiêu:** ≥ 85%

### **Lines** (Dòng code)

- Phần trăm dòng code đã được thực thi
- **Mục tiêu:** ≥ 80%

## 🎯 Ngưỡng Coverage hiện tại

Cấu hình trong `vite.config.js`:

```javascript
coverage: {
  thresholds: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

## 📊 Tình trạng Coverage hiện tại

### ✅ **Files đã có test tốt:**

- `Payment.jsx`: **98.18%** statements
- `InvoiceList.jsx`: **91.96%** statements
- `SampleManagement.jsx`: **88.21%** statements

### ❌ **Files cần viết test:**

- `Booking.jsx`: 0% coverage
- `Login.jsx`: 0% coverage
- `Register.jsx`: 0% coverage
- `Dashboard.jsx`: 0% coverage
- Và nhiều components khác...

## 🚀 Cách cải thiện Coverage

### 1. **Viết test cho components chưa có**

```bash
# Ví dụ: tạo test cho Login component
touch src/login/Login.test.jsx
```

### 2. **Bổ sung test cases cho coverage thấp**

- Kiểm tra các nhánh `if/else` chưa được test
- Test các error scenarios
- Test edge cases

### 3. **Loại trừ files không cần test**

Thêm vào `vite.config.js`:

```javascript
coverage: {
  exclude: ["src/assets/**", "src/**/*.css", "src/main.jsx"];
}
```

## 📝 Best Practices

### ✅ **Nên làm:**

- Viết test cho business logic quan trọng
- Test các user interactions chính
- Test error handling
- Duy trì coverage ≥ 80%

### ❌ **Không nên:**

- Chỉ tập trung vào con số coverage
- Test những function đơn giản (getters, setters)
- Bỏ qua test integration

## 🔍 Debug Coverage thấp

### 1. **Xem file HTML report**

- Mở `coverage/index.html`
- Click vào file cụ thể
- Xem dòng code nào chưa được cover (màu đỏ)

### 2. **Chạy test với verbose**

```bash
npx vitest run --coverage --reporter=verbose
```

### 3. **Kiểm tra mocking**

- Đảm bảo mock đúng dependencies
- Test cả success và error scenarios

## 📅 Quy trình thường xuyên

### **Hàng ngày:**

```bash
npm run test:coverage
npm run coverage:summary
```

### **Trước khi commit:**

```bash
# Đảm bảo coverage không giảm
npm run test:coverage
```

### **Weekly review:**

- Xem báo cáo HTML chi tiết
- Lập kế hoạch viết test cho files coverage thấp
- Cập nhật threshold nếu cần

## 🎯 Roadmap Coverage

### **Phase 1** (Hiện tại)

- [x] Payment components: 90%+
- [x] SampleManagement: 88%+

### **Phase 2** (Tiếp theo)

- [ ] Booking component: Target 80%
- [ ] Authentication (Login/Register): Target 85%
- [ ] Dashboard: Target 75%

### **Phase 3** (Dài hạn)

- [ ] Tất cả components: Target 80%+
- [ ] Integration tests
- [ ] E2E testing

---

**💡 Tip:** Coverage cao không có nghĩa là test tốt. Quan trọng là test quality và test các scenarios thực tế!
