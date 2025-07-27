# 📄 Hướng Dẫn: Từ Code .test.jsx Ra File HTML

## 🎯 Tổng quan

Có 4 cách chính để từ code `.test.jsx` tạo ra file HTML:

## 1. 📊 **Test Coverage HTML Report**

### Cách sử dụng:

```bash
npm run test:coverage
```

### Kết quả:

- 📁 Tạo folder `coverage/`
- 📄 File `coverage/index.html`
- 🎨 Giao diện web hiển thị:
  - % Coverage của từng file
  - Dòng code nào đã được test (xanh)
  - Dòng code nào chưa test (đỏ)
  - Chi tiết từng file

### Ví dụ output:

```
coverage/
├── index.html          # Trang chính
├── Front_end/
│   ├── src/
│   │   ├── Payment/
│   │   │   ├── Payment.jsx.html
│   │   │   └── InvoiceList.jsx.html
│   │   └── ...
└── ...
```

---

## 2. 🖥️ **Vitest UI (Interactive)**

### Cài đặt:

```bash
npm install --save-dev @vitest/ui
```

### Chạy:

```bash
npm run test:ui
```

### Tính năng:

- ✅ Giao diện web interactive
- 🔄 Real-time test results
- 📊 Test coverage tích hợp
- 🎮 Chạy/dừng tests từ UI
- 📝 Xem test output chi tiết

---

## 3. 📋 **Test Results HTML Report**

### Cách sử dụng:

```bash
npm run test:html
```

### Kết quả:

- 📄 File `test-results.html`
- 📊 Báo cáo kết quả test
- ✅ Pass/Fail status
- ⏱️ Execution time
- 📈 Test statistics

---

## 4. 📚 **Test Documentation HTML**

### Cách sử dụng:

```bash
npm run test:docs
```

### Kết quả:

- 📄 File `test-documentation.html`
- 📖 Documentation format đẹp
- 📋 Danh sách tất cả test cases
- 📁 Nhóm theo component
- 📊 Statistics tổng quát

### Tính năng:

- 🎨 Giao diện responsive
- 📱 Mobile-friendly
- 🔍 Easy navigation
- 📈 Test metrics

---

## 🚀 **Tất Cả Lệnh Có Sẵn**

### Test Commands:

```bash
# Chạy tests cơ bản
npm test

# Test với coverage HTML
npm run test:coverage

# Interactive UI
npm run test:ui

# Test results HTML
npm run test:html

# Coverage + Results HTML
npm run test:all-html

# Test documentation HTML
npm run test:docs

# Coverage summary (terminal)
npm run coverage:summary
```

---

## 📊 **So Sánh Các Phương Pháp**

| Phương pháp       | File Output               | Mục đích           | Tính năng chính             |
| ----------------- | ------------------------- | ------------------ | --------------------------- |
| **Coverage**      | `coverage/index.html`     | Đo độ bao phủ code | Code coverage, line-by-line |
| **Vitest UI**     | Browser app               | Development        | Interactive, real-time      |
| **Test Results**  | `test-results.html`       | Báo cáo kết quả    | Pass/fail, timing           |
| **Documentation** | `test-documentation.html` | Tài liệu           | Beautiful docs, overview    |

---

## 🎯 **Workflow Khuyến Nghị**

### 🔄 **Development (Hàng ngày):**

```bash
npm run test:ui
```

- Interactive development
- Real-time feedback

### 📊 **Code Review:**

```bash
npm run test:coverage
```

- Kiểm tra coverage
- Identify missing tests

### 📋 **Reporting:**

```bash
npm run test:docs
```

- Tạo documentation đẹp
- Share với team

### 🎯 **CI/CD:**

```bash
npm run test:all-html
```

- Coverage + results
- Artifact cho build pipeline

---

## 🎨 **Customization**

### Thay đổi Coverage config:

```javascript
// vite.config.js
coverage: {
  reporter: ['text', 'json', 'html', 'lcov'],
  outputFile: './coverage-report.html'
}
```

### Thay đổi Test reporter:

```javascript
// vite.config.js
test: {
  reporters: ['verbose', 'html', 'json'],
  outputFile: {
    html: './my-test-results.html'
  }
}
```

---

## 📱 **Mobile & Sharing**

### Tất cả HTML files đều:

- ✅ Responsive design
- 📱 Mobile-friendly
- 🔗 Shareable links
- 📊 Professional look

### Share với team:

1. Host trên web server
2. Send file HTML trực tiếp
3. Include trong Git repository
4. Attach vào email/Slack

---

## 🔧 **Troubleshooting**

### Nếu HTML không generate:

```bash
# Kiểm tra dependencies
npm list @vitest/ui

# Reinstall nếu cần
npm install --save-dev @vitest/ui

# Clear cache
rm -rf node_modules/.vite
npm test
```

### Nếu file HTML trống:

```bash
# Chạy tests trước
npm test

# Rồi mới generate HTML
npm run test:coverage
```

---

## 💡 **Tips & Tricks**

### 1. **Auto-open browser:**

```json
// package.json
"test:coverage:open": "npm run test:coverage && start coverage/index.html"
```

### 2. **Combined script:**

```json
"test:all": "npm run test:coverage && npm run test:docs"
```

### 3. **Watch mode với HTML:**

```json
"test:watch:html": "vitest --ui --coverage"
```

---

Bây giờ bạn có đầy đủ tools để tạo HTML từ test files! 🎉
