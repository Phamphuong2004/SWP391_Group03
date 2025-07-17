import React, { useState, useEffect } from "react";
import { getAllServices } from "../ServiceInfo/ServiceApi";

export default function ServiceTestPurposeStaff() {
  const [data, setData] = useState([]);
  const [serviceSearch, setServiceSearch] = useState("");
  const [selectedService, setSelectedService] = useState(null);
  const [purposeSearch, setPurposeSearch] = useState("");
  const [newPurpose, setNewPurpose] = useState("");
  const [editPurpose, setEditPurpose] = useState({ idx: null, value: "" });
  const [error, setError] = useState("");

  useEffect(() => {
    getAllServices()
      .then((res) => {
        // Giả sử API trả về mảng các service với các trường: service_id, service_name, ...
        // Thêm testPurposes: [] cho mỗi service để tương thích UI hiện tại
        setData(
          res.data.map((s) => ({
            ...s,
            id: s.service_id,
            name: s.service_name,
            testPurposes: s.testPurposes || [],
          }))
        );
      })
      .catch((err) => console.error(err));
  }, []);

  // Lọc service theo tên
  const filteredServices = data.filter(
    (service) =>
      service.name &&
      service.name.toLowerCase().includes(serviceSearch.toLowerCase())
  );

  // Lọc test purpose theo search trong service đã chọn
  const getFilteredPurposes = (service) => {
    if (!service) return [];
    return service.testPurposes.filter((tp) =>
      tp.toLowerCase().includes(purposeSearch.toLowerCase())
    );
  };

  // Thêm test purpose mới cho service đã chọn (chỉ local demo, muốn lưu DB cần gọi API create)
  const handleAddPurpose = () => {
    setError("");
    if (!selectedService) {
      setError("Vui lòng chọn dịch vụ.");
      return;
    }
    if (!newPurpose.trim()) {
      setError("Test purpose không được để trống.");
      return;
    }
    if (selectedService.testPurposes.includes(newPurpose.trim())) {
      setError("Test purpose đã tồn tại.");
      return;
    }
    setData((prev) =>
      prev.map((s) =>
        s.id === selectedService.id
          ? { ...s, testPurposes: [...s.testPurposes, newPurpose.trim()] }
          : s
      )
    );
    setNewPurpose("");
  };

  // Sửa test purpose cho service đã chọn (chỉ local demo, muốn lưu DB cần gọi API update)
  const handleEditPurpose = () => {
    setError("");
    if (!editPurpose.value.trim() || editPurpose.idx === null) {
      setError("Test purpose không được để trống.");
      return;
    }
    if (selectedService.testPurposes.includes(editPurpose.value.trim())) {
      setError("Test purpose đã tồn tại.");
      return;
    }
    setData((prev) =>
      prev.map((s) =>
        s.id === selectedService.id
          ? {
              ...s,
              testPurposes: s.testPurposes.map((tp, idx) =>
                idx === editPurpose.idx ? editPurpose.value.trim() : tp
              ),
            }
          : s
      )
    );
    setEditPurpose({ idx: null, value: "" });
  };

  // Khi chọn service
  const handleSelectService = (service) => {
    setSelectedService(service);
    setPurposeSearch("");
    setNewPurpose("");
    setEditPurpose({ idx: null, value: "" });
  };

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: "0 auto" }}>
      <h2>Quản lý Test Purpose của Service</h2>
      <input
        type="text"
        placeholder="Tìm kiếm dịch vụ..."
        value={serviceSearch}
        onChange={(e) => setServiceSearch(e.target.value)}
        style={{ marginBottom: 16, width: 300, padding: 6 }}
      />
      <table
        style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24 }}
      >
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={{ border: "1px solid #1976d2", padding: 8 }}>
              Tên dịch vụ
            </th>
            <th style={{ border: "1px solid #1976d2", padding: 8 }}>
              Số lượng Test Purpose
            </th>
            <th style={{ border: "1px solid #1976d2", padding: 8 }}>
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredServices.map((service) => (
            <tr
              key={service.id}
              style={{
                background:
                  selectedService && selectedService.id === service.id
                    ? "#e3f2fd"
                    : "white",
              }}
            >
              <td style={{ border: "1px solid #1976d2", padding: 8 }}>
                {service.name}
              </td>
              <td style={{ border: "1px solid #1976d2", padding: 8 }}>
                {service.testPurposes.length}
              </td>
              <td style={{ border: "1px solid #1976d2", padding: 8 }}>
                <button onClick={() => handleSelectService(service)}>
                  Xem Test Purpose
                </button>
              </td>
            </tr>
          ))}
          {filteredServices.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center", padding: 16 }}>
                Không tìm thấy dịch vụ
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {selectedService && (
        <div
          style={{
            border: "1px solid #1976d2",
            borderRadius: 8,
            padding: 18,
            marginTop: 12,
          }}
        >
          <h3>Test Purpose của dịch vụ: {selectedService.name}</h3>
          {error && (
            <div style={{ color: "red", marginBottom: 8 }}>{error}</div>
          )}
          <input
            type="text"
            placeholder="Tìm kiếm test purpose..."
            value={purposeSearch}
            onChange={(e) => setPurposeSearch(e.target.value)}
            style={{ marginBottom: 12, width: 250, padding: 6 }}
          />
          <ul>
            {getFilteredPurposes(selectedService).map((tp, idx) => (
              <li key={idx} style={{ marginBottom: 4 }}>
                {editPurpose.idx === idx ? (
                  <>
                    <input
                      value={editPurpose.value}
                      onChange={(e) =>
                        setEditPurpose({
                          ...editPurpose,
                          value: e.target.value,
                        })
                      }
                      onBlur={handleEditPurpose}
                      autoFocus
                      style={{ marginRight: 8 }}
                    />
                    <button onClick={handleEditPurpose}>Lưu</button>
                  </>
                ) : (
                  <>
                    {tp}
                    <button
                      style={{ marginLeft: 8 }}
                      onClick={() => setEditPurpose({ idx, value: tp })}
                    >
                      Sửa
                    </button>
                  </>
                )}
              </li>
            ))}
            {getFilteredPurposes(selectedService).length === 0 && (
              <li style={{ color: "#888" }}>
                Không có test purpose nào phù hợp
              </li>
            )}
          </ul>
          <div style={{ marginTop: 8 }}>
            <input
              type="text"
              placeholder="Thêm test purpose mới..."
              value={newPurpose}
              onChange={(e) => setNewPurpose(e.target.value)}
              style={{ marginRight: 8 }}
            />
            <button onClick={handleAddPurpose} disabled={!newPurpose.trim()}>
              Thêm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
