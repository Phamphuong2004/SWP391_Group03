import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { administrativeServices } from "../servicesData";
import "./ServiceDetail.css";

const Adoption = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    adoptiveParentName: "",
    adoptiveParentId: "",
    adoptiveParentAddress: "",
    adoptiveParentPhone: "",
    adoptiveParentEmail: "",
    adoptiveParentJob: "",
    adoptiveParentIncome: "",
    adoptiveParentMaritalStatus: "",
    childName: "",
    childDateOfBirth: "",
    childGender: "",
    childPlaceOfBirth: "",
    biologicalParentName: "",
    biologicalParentId: "",
    biologicalParentAddress: "",
    biologicalParentPhone: "",
    reason: "",
    adoptionType: "",
    additionalInfo: "",
  });

  const [files, setFiles] = useState({
    adoptiveParentIdCard: null,
    adoptiveParentMarriageCertificate: null,
    adoptiveParentIncomeProof: null,
    adoptiveParentCriminalRecord: null,
    childBirthCertificate: null,
    biologicalParentConsent: null,
    biologicalParentIdCard: null,
    adoptionAgreement: null,
  });

  const [uploadStatus, setUploadStatus] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const service = administrativeServices.find((s) => s.id === "adoption");

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
    if (!formData.adoptiveParentName)
      errors.adoptiveParentName = "Vui lòng nhập tên người nhận nuôi";
    if (!formData.adoptiveParentId)
      errors.adoptiveParentId = "Vui lòng nhập CMND/CCCD người nhận nuôi";
    if (!formData.adoptiveParentAddress)
      errors.adoptiveParentAddress = "Vui lòng nhập địa chỉ người nhận nuôi";
    if (!formData.adoptiveParentPhone)
      errors.adoptiveParentPhone = "Vui lòng nhập số điện thoại";
    if (!formData.adoptiveParentEmail)
      errors.adoptiveParentEmail = "Vui lòng nhập email";
    if (!formData.adoptiveParentJob)
      errors.adoptiveParentJob = "Vui lòng nhập nghề nghiệp";
    if (!formData.adoptiveParentIncome)
      errors.adoptiveParentIncome = "Vui lòng nhập thu nhập";
    if (!formData.childName) errors.childName = "Vui lòng nhập tên trẻ";
    if (!formData.childDateOfBirth)
      errors.childDateOfBirth = "Vui lòng nhập ngày sinh của trẻ";
    if (!formData.childGender)
      errors.childGender = "Vui lòng chọn giới tính của trẻ";
    if (!formData.reason) errors.reason = "Vui lòng nhập lý do nhận nuôi";
    if (!files.adoptiveParentIdCard)
      errors.adoptiveParentIdCard =
        "Vui lòng tải lên CMND/CCCD người nhận nuôi";
    if (!files.childBirthCertificate)
      errors.childBirthCertificate = "Vui lòng tải lên giấy khai sinh của trẻ";
    if (!files.biologicalParentConsent)
      errors.biologicalParentConsent =
        "Vui lòng tải lên giấy đồng ý của cha mẹ đẻ";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const submitData = new FormData();
      Object.keys(formData).forEach((key) => {
        submitData.append(key, formData[key]);
      });
      Object.keys(files).forEach((key) => {
        if (files[key]) {
          submitData.append(key, files[key]);
        }
      });

      const response = await fetch("/api/adoption", {
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

          <form onSubmit={handleSubmit} className="adoption-form">
            <div className="form-section">
              <h3>Thông tin người nhận nuôi</h3>
              <div className="form-group">
                <label htmlFor="adoptiveParentName">
                  Họ và tên người nhận nuôi *
                </label>
                <input
                  type="text"
                  id="adoptiveParentName"
                  name="adoptiveParentName"
                  value={formData.adoptiveParentName}
                  onChange={handleInputChange}
                  className={formErrors.adoptiveParentName ? "error" : ""}
                />
                {formErrors.adoptiveParentName && (
                  <span className="error-message">
                    {formErrors.adoptiveParentName}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adoptiveParentId">
                  CMND/CCCD người nhận nuôi *
                </label>
                <input
                  type="text"
                  id="adoptiveParentId"
                  name="adoptiveParentId"
                  value={formData.adoptiveParentId}
                  onChange={handleInputChange}
                  className={formErrors.adoptiveParentId ? "error" : ""}
                />
                {formErrors.adoptiveParentId && (
                  <span className="error-message">
                    {formErrors.adoptiveParentId}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adoptiveParentAddress">Địa chỉ *</label>
                <input
                  type="text"
                  id="adoptiveParentAddress"
                  name="adoptiveParentAddress"
                  value={formData.adoptiveParentAddress}
                  onChange={handleInputChange}
                  className={formErrors.adoptiveParentAddress ? "error" : ""}
                />
                {formErrors.adoptiveParentAddress && (
                  <span className="error-message">
                    {formErrors.adoptiveParentAddress}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adoptiveParentPhone">Số điện thoại *</label>
                <input
                  type="tel"
                  id="adoptiveParentPhone"
                  name="adoptiveParentPhone"
                  value={formData.adoptiveParentPhone}
                  onChange={handleInputChange}
                  className={formErrors.adoptiveParentPhone ? "error" : ""}
                />
                {formErrors.adoptiveParentPhone && (
                  <span className="error-message">
                    {formErrors.adoptiveParentPhone}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adoptiveParentEmail">Email *</label>
                <input
                  type="email"
                  id="adoptiveParentEmail"
                  name="adoptiveParentEmail"
                  value={formData.adoptiveParentEmail}
                  onChange={handleInputChange}
                  className={formErrors.adoptiveParentEmail ? "error" : ""}
                />
                {formErrors.adoptiveParentEmail && (
                  <span className="error-message">
                    {formErrors.adoptiveParentEmail}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adoptiveParentJob">Nghề nghiệp *</label>
                <input
                  type="text"
                  id="adoptiveParentJob"
                  name="adoptiveParentJob"
                  value={formData.adoptiveParentJob}
                  onChange={handleInputChange}
                  className={formErrors.adoptiveParentJob ? "error" : ""}
                />
                {formErrors.adoptiveParentJob && (
                  <span className="error-message">
                    {formErrors.adoptiveParentJob}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adoptiveParentIncome">
                  Thu nhập hàng tháng *
                </label>
                <input
                  type="text"
                  id="adoptiveParentIncome"
                  name="adoptiveParentIncome"
                  value={formData.adoptiveParentIncome}
                  onChange={handleInputChange}
                  className={formErrors.adoptiveParentIncome ? "error" : ""}
                />
                {formErrors.adoptiveParentIncome && (
                  <span className="error-message">
                    {formErrors.adoptiveParentIncome}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="adoptiveParentMaritalStatus">
                  Tình trạng hôn nhân
                </label>
                <select
                  id="adoptiveParentMaritalStatus"
                  name="adoptiveParentMaritalStatus"
                  value={formData.adoptiveParentMaritalStatus}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn tình trạng hôn nhân</option>
                  <option value="single">Độc thân</option>
                  <option value="married">Đã kết hôn</option>
                  <option value="divorced">Đã ly hôn</option>
                  <option value="widowed">Góa</option>
                </select>
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin trẻ em</h3>
              <div className="form-group">
                <label htmlFor="childName">Họ và tên trẻ *</label>
                <input
                  type="text"
                  id="childName"
                  name="childName"
                  value={formData.childName}
                  onChange={handleInputChange}
                  className={formErrors.childName ? "error" : ""}
                />
                {formErrors.childName && (
                  <span className="error-message">{formErrors.childName}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="childDateOfBirth">Ngày sinh *</label>
                <input
                  type="date"
                  id="childDateOfBirth"
                  name="childDateOfBirth"
                  value={formData.childDateOfBirth}
                  onChange={handleInputChange}
                  className={formErrors.childDateOfBirth ? "error" : ""}
                />
                {formErrors.childDateOfBirth && (
                  <span className="error-message">
                    {formErrors.childDateOfBirth}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="childGender">Giới tính *</label>
                <select
                  id="childGender"
                  name="childGender"
                  value={formData.childGender}
                  onChange={handleInputChange}
                  className={formErrors.childGender ? "error" : ""}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {formErrors.childGender && (
                  <span className="error-message">
                    {formErrors.childGender}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="childPlaceOfBirth">Nơi sinh</label>
                <input
                  type="text"
                  id="childPlaceOfBirth"
                  name="childPlaceOfBirth"
                  value={formData.childPlaceOfBirth}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin cha mẹ đẻ</h3>
              <div className="form-group">
                <label htmlFor="biologicalParentName">
                  Họ và tên cha mẹ đẻ
                </label>
                <input
                  type="text"
                  id="biologicalParentName"
                  name="biologicalParentName"
                  value={formData.biologicalParentName}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="biologicalParentId">CMND/CCCD cha mẹ đẻ</label>
                <input
                  type="text"
                  id="biologicalParentId"
                  name="biologicalParentId"
                  value={formData.biologicalParentId}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="biologicalParentAddress">Địa chỉ</label>
                <input
                  type="text"
                  id="biologicalParentAddress"
                  name="biologicalParentAddress"
                  value={formData.biologicalParentAddress}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="biologicalParentPhone">Số điện thoại</label>
                <input
                  type="tel"
                  id="biologicalParentPhone"
                  name="biologicalParentPhone"
                  value={formData.biologicalParentPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin bổ sung</h3>
              <div className="form-group">
                <label htmlFor="adoptionType">Loại nhận nuôi *</label>
                <select
                  id="adoptionType"
                  name="adoptionType"
                  value={formData.adoptionType}
                  onChange={handleInputChange}
                >
                  <option value="">Chọn loại nhận nuôi</option>
                  <option value="domestic">Nhận nuôi trong nước</option>
                  <option value="international">Nhận nuôi quốc tế</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="reason">Lý do nhận nuôi *</label>
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

              <div className="form-group">
                <label htmlFor="additionalInfo">Thông tin bổ sung</label>
                <textarea
                  id="additionalInfo"
                  name="additionalInfo"
                  value={formData.additionalInfo}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Tải lên giấy tờ cần thiết</h3>
              {renderFileUpload(
                "adoptiveParentIdCard",
                "CMND/CCCD người nhận nuôi"
              )}
              {renderFileUpload(
                "adoptiveParentMarriageCertificate",
                "Giấy đăng ký kết hôn (nếu có)",
                false
              )}
              {renderFileUpload(
                "adoptiveParentIncomeProof",
                "Giấy tờ chứng minh thu nhập",
                false
              )}
              {renderFileUpload(
                "adoptiveParentCriminalRecord",
                "Lý lịch tư pháp",
                false
              )}
              {renderFileUpload(
                "childBirthCertificate",
                "Giấy khai sinh của trẻ"
              )}
              {renderFileUpload(
                "biologicalParentConsent",
                "Giấy đồng ý của cha mẹ đẻ"
              )}
              {renderFileUpload(
                "biologicalParentIdCard",
                "CMND/CCCD cha mẹ đẻ",
                false
              )}
              {renderFileUpload(
                "adoptionAgreement",
                "Thỏa thuận nhận nuôi",
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

export default Adoption;
