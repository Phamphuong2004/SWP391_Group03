import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { administrativeServices } from "../servicesData";
import "./ServiceDetail.css";

const HouseholdRegistration = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    householdHead: "",
    householdHeadId: "",
    address: "",
    phoneNumber: "",
    email: "",
    currentAddress: "",
    reason: "",
    householdMembers: [
      {
        name: "",
        id: "",
        relationship: "",
        dateOfBirth: "",
        gender: "",
      },
    ],
  });

  const [files, setFiles] = useState({
    idCard: null,
    householdBook: null,
    proofOfResidence: null,
    marriageCertificate: null,
  });

  const [uploadStatus, setUploadStatus] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const service = administrativeServices.find(
    (s) => s.id === "household-registration"
  );

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleMemberChange = (index, field, value) => {
    const newMembers = [...formData.householdMembers];
    newMembers[index] = {
      ...newMembers[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      householdMembers: newMembers,
    }));
  };

  const addHouseholdMember = () => {
    setFormData((prev) => ({
      ...prev,
      householdMembers: [
        ...prev.householdMembers,
        {
          name: "",
          id: "",
          relationship: "",
          dateOfBirth: "",
          gender: "",
        },
      ],
    }));
  };

  const removeHouseholdMember = (index) => {
    const newMembers = formData.householdMembers.filter((_, i) => i !== index);
    setFormData((prev) => ({
      ...prev,
      householdMembers: newMembers,
    }));
  };

  const handleFileChange = (e, fileType) => {
    const file = e.target.files[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [fileType]: file,
      }));
      setUploadStatus((prev) => ({
        ...prev,
        [fileType]: "pending",
      }));
    }
  };

  const handleFileUpload = async (fileType) => {
    const file = files[fileType];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileType", fileType);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        setUploadStatus((prev) => ({
          ...prev,
          [fileType]: "success",
        }));
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      setUploadStatus((prev) => ({
        ...prev,
        [fileType]: "error",
      }));
      console.error("Upload error:", error);
    }
  };

  const validateForm = () => {
    const errors = {};
    if (!formData.householdHead)
      errors.householdHead = "Vui lòng nhập tên chủ hộ";
    if (!formData.householdHeadId)
      errors.householdHeadId = "Vui lòng nhập CMND/CCCD chủ hộ";
    if (!formData.address) errors.address = "Vui lòng nhập địa chỉ mới";
    if (!formData.phoneNumber)
      errors.phoneNumber = "Vui lòng nhập số điện thoại";
    if (!formData.email) errors.email = "Vui lòng nhập email";
    if (!formData.currentAddress)
      errors.currentAddress = "Vui lòng nhập địa chỉ hiện tại";
    if (!formData.reason) errors.reason = "Vui lòng nhập lý do đăng ký";
    if (!files.idCard) errors.idCard = "Vui lòng tải lên CMND/CCCD";
    if (!files.proofOfResidence)
      errors.proofOfResidence =
        "Vui lòng tải lên giấy tờ chứng minh nơi cư trú";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "householdMembers") {
          submitData.append(key, JSON.stringify(formData[key]));
        } else {
          submitData.append(key, formData[key]);
        }
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      const response = await fetch("/api/household-registration", {
        method: "POST",
        body: submitData,
      });

      if (response.ok) {
        const data = await response.json();
        const serviceId = data.serviceId || "default-id";
        localStorage.setItem("lastServiceId", serviceId);

        alert("Đơn đăng ký của bạn đã được gửi thành công!");

        navigate(`/service-tracking/${serviceId}`);
      } else {
        throw new Error("Submit failed");
      }
    } catch (error) {
      alert("Có lỗi xảy ra khi gửi đơn. Vui lòng thử lại sau.");
      console.error("Submit error:", error);
    }
  };

  const renderFileUpload = (fileType, label, required = true) => {
    const status = uploadStatus[fileType];
    return (
      <div className="upload-section">
        <label className="upload-label">
          {label} {required && "*"}
          <input
            type="file"
            onChange={(e) => handleFileChange(e, fileType)}
            accept=".pdf,.jpg,.jpeg,.png"
            className="file-input"
          />
        </label>
        {files[fileType] && (
          <div className="upload-status">
            <span className="file-name">{files[fileType].name}</span>
            <button
              type="button"
              onClick={() => handleFileUpload(fileType)}
              className={`upload-button ${
                status === "success" ? "success" : ""
              }`}
              disabled={status === "success"}
            >
              {status === "success" ? "Đã tải lên" : "Tải lên"}
            </button>
          </div>
        )}
        {formErrors[fileType] && (
          <span className="error-message">{formErrors[fileType]}</span>
        )}
      </div>
    );
  };

  if (!service) {
    return <div>Không tìm thấy dịch vụ</div>;
  }

  return (
    <div className="service-detail-container">
      <div className="service-detail-content">
        <div className="service-detail-header">
          <h1>{service.title}</h1>
          <div className="service-category">{service.category}</div>
        </div>
        <div className="service-info">
          <h2>Thông tin dịch vụ</h2>
          <p>{service.description}</p>

          <form onSubmit={handleSubmit} className="household-registration-form">
            <div className="form-section">
              <h3>Thông tin chủ hộ</h3>
              <div className="form-group">
                <label htmlFor="householdHead">Họ và tên chủ hộ *</label>
                <input
                  type="text"
                  id="householdHead"
                  name="householdHead"
                  value={formData.householdHead}
                  onChange={handleInputChange}
                  className={formErrors.householdHead ? "error" : ""}
                />
                {formErrors.householdHead && (
                  <span className="error-message">
                    {formErrors.householdHead}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="householdHeadId">CMND/CCCD chủ hộ *</label>
                <input
                  type="text"
                  id="householdHeadId"
                  name="householdHeadId"
                  value={formData.householdHeadId}
                  onChange={handleInputChange}
                  className={formErrors.householdHeadId ? "error" : ""}
                />
                {formErrors.householdHeadId && (
                  <span className="error-message">
                    {formErrors.householdHeadId}
                  </span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin đăng ký</h3>
              <div className="form-group">
                <label htmlFor="address">Địa chỉ mới *</label>
                <input
                  type="text"
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  className={formErrors.address ? "error" : ""}
                />
                {formErrors.address && (
                  <span className="error-message">{formErrors.address}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="currentAddress">Địa chỉ hiện tại *</label>
                <input
                  type="text"
                  id="currentAddress"
                  name="currentAddress"
                  value={formData.currentAddress}
                  onChange={handleInputChange}
                  className={formErrors.currentAddress ? "error" : ""}
                />
                {formErrors.currentAddress && (
                  <span className="error-message">
                    {formErrors.currentAddress}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="reason">Lý do đăng ký *</label>
                <textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleInputChange}
                  className={formErrors.reason ? "error" : ""}
                />
                {formErrors.reason && (
                  <span className="error-message">{formErrors.reason}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin liên hệ</h3>
              <div className="form-group">
                <label htmlFor="phoneNumber">Số điện thoại *</label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className={formErrors.phoneNumber ? "error" : ""}
                />
                {formErrors.phoneNumber && (
                  <span className="error-message">
                    {formErrors.phoneNumber}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={formErrors.email ? "error" : ""}
                />
                {formErrors.email && (
                  <span className="error-message">{formErrors.email}</span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Thành viên trong hộ</h3>
              {formData.householdMembers.map((member, index) => (
                <div key={index} className="member-section">
                  <h4>Thành viên {index + 1}</h4>
                  <div className="form-group">
                    <label>Họ và tên</label>
                    <input
                      type="text"
                      value={member.name}
                      onChange={(e) =>
                        handleMemberChange(index, "name", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>CMND/CCCD</label>
                    <input
                      type="text"
                      value={member.id}
                      onChange={(e) =>
                        handleMemberChange(index, "id", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Quan hệ với chủ hộ</label>
                    <input
                      type="text"
                      value={member.relationship}
                      onChange={(e) =>
                        handleMemberChange(
                          index,
                          "relationship",
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Ngày sinh</label>
                    <input
                      type="date"
                      value={member.dateOfBirth}
                      onChange={(e) =>
                        handleMemberChange(index, "dateOfBirth", e.target.value)
                      }
                    />
                  </div>
                  <div className="form-group">
                    <label>Giới tính</label>
                    <select
                      value={member.gender}
                      onChange={(e) =>
                        handleMemberChange(index, "gender", e.target.value)
                      }
                    >
                      <option value="">Chọn giới tính</option>
                      <option value="male">Nam</option>
                      <option value="female">Nữ</option>
                      <option value="other">Khác</option>
                    </select>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeHouseholdMember(index)}
                      className="remove-member-button"
                    >
                      Xóa thành viên
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addHouseholdMember}
                className="add-member-button"
              >
                Thêm thành viên
              </button>
            </div>

            <div className="form-section">
              <h3>Tải lên giấy tờ cần thiết</h3>
              {renderFileUpload("idCard", "CMND/CCCD")}
              {renderFileUpload("householdBook", "Sổ hộ khẩu (nếu có)", false)}
              {renderFileUpload(
                "proofOfResidence",
                "Giấy tờ chứng minh nơi cư trú"
              )}
              {renderFileUpload(
                "marriageCertificate",
                "Giấy đăng ký kết hôn (nếu có)",
                false
              )}
            </div>

            <div className="form-submit">
              <button type="submit" className="submit-button">
                Gửi đơn đăng ký
              </button>
            </div>
          </form>

          <div className="service-process">
            <h3>Quy trình</h3>
            <ol>
              {service.process?.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>

          <div className="processing-time">
            <h3>Thời gian xử lý</h3>
            <p>{service.processingTime}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HouseholdRegistration;
