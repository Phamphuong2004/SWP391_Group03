import React, { useState } from "react";

// Dữ liệu ánh xạ giữa service và mục đích
const serviceTestPurposes = {
  xacnhan_quanhegiadinh: ["Hành chính", "Dân sự"],
  dichvu_A: ["Hành chính"],
  dichvu_B: ["Dân sự"],
};

// Hàm kiểm tra
function hasPurpose(serviceId, purpose) {
  return serviceTestPurposes[serviceId]?.includes(purpose);
}

const allServices = [
  { id: "xacnhan_quanhegiadinh", name: "Xác nhận quan hệ gia đình" },
  { id: "dichvu_A", name: "Dịch vụ A" },
  { id: "dichvu_B", name: "Dịch vụ B" },
];

export default function ServiceTestPurposeCustomer() {
  const [selectedService, setSelectedService] = useState("");
  const [result, setResult] = useState("");

  const handleCheck = () => {
    if (!selectedService) {
      setResult("Vui lòng chọn dịch vụ.");
      return;
    }
    const hasHanhChinh = hasPurpose(selectedService, "Hành chính");
    const hasDanSu = hasPurpose(selectedService, "Dân sự");
    let msg = "";
    if (!hasHanhChinh && !hasDanSu) {
      msg = "Dịch vụ này không hỗ trợ Hành chính hoặc Dân sự.";
    } else {
      msg = `Dịch vụ này hỗ trợ: ${hasHanhChinh ? "Hành chính " : ""}${
        hasDanSu ? "Dân sự" : ""
      }`.trim();
    }
    setResult(msg);
  };

  return (
    <div style={{ padding: 24 }}>
      <h3>Kiểm tra mục đích xét nghiệm của dịch vụ</h3>
      <label>
        Chọn dịch vụ:
        <select
          value={selectedService}
          onChange={(e) => setSelectedService(e.target.value)}
        >
          <option value="">-- Chọn dịch vụ --</option>
          {allServices.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>
      </label>
      <button
        style={{ marginLeft: 12 }}
        onClick={handleCheck}
        disabled={!selectedService}
      >
        Kiểm tra
      </button>
      <div
        style={{
          marginTop: 16,
          color:
            result.startsWith("Vui lòng") ||
            result.startsWith("Dịch vụ này không hỗ trợ")
              ? "red"
              : "blue",
        }}
      >
        {result}
      </div>
    </div>
  );
}
