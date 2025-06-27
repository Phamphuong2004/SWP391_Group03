import React, { useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { administrativeServices } from "../servicesData";
import "./ServiceDetail.css";

const FamilyRelationship = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const isAdministrative = location.pathname.includes("/service/");

  const [formData, setFormData] = useState({
    relationshipType: "",
    person1Name: "",
    person1Id: "",
    person1DateOfBirth: "",
    person1Gender: "",
    person1Address: "",
    person1Phone: "",
    person1Email: "",
    person2Name: "",
    person2Id: "",
    person2DateOfBirth: "",
    person2Gender: "",
    person2Address: "",
    person2Phone: "",
    person2Email: "",
    reason: "",
    additionalInfo: "",
  });

  const [files, setFiles] = useState({
    person1IdCard: null,
    person2IdCard: null,
    birthCertificate: null,
    householdBook: null,
    marriageCertificate: null,
    otherDocuments: null,
  });

  const [uploadStatus, setUploadStatus] = useState({});
  const [formErrors, setFormErrors] = useState({});

  const service = administrativeServices.find(
    (s) => s.id === "family-relationship"
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
      formData.append(
        "serviceType",
        isAdministrative ? "administrative" : "civil"
      );

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
    if (!formData.relationshipType)
      errors.relationshipType = "Vui lòng chọn loại quan hệ";
    if (!formData.person1Name)
      errors.person1Name = "Vui lòng nhập tên người thứ nhất";
    if (!formData.person1Id)
      errors.person1Id = "Vui lòng nhập CMND/CCCD người thứ nhất";
    if (!formData.person1DateOfBirth)
      errors.person1DateOfBirth = "Vui lòng nhập ngày sinh người thứ nhất";
    if (!formData.person1Gender)
      errors.person1Gender = "Vui lòng chọn giới tính người thứ nhất";
    if (!formData.person2Name)
      errors.person2Name = "Vui lòng nhập tên người thứ hai";
    if (!formData.person2Id)
      errors.person2Id = "Vui lòng nhập CMND/CCCD người thứ hai";
    if (!formData.person2DateOfBirth)
      errors.person2DateOfBirth = "Vui lòng nhập ngày sinh người thứ hai";
    if (!formData.person2Gender)
      errors.person2Gender = "Vui lòng chọn giới tính người thứ hai";
    if (!formData.reason) errors.reason = "Vui lòng nhập lý do xác nhận";
    if (!files.person1IdCard)
      errors.person1IdCard = "Vui lòng tải lên CMND/CCCD người thứ nhất";
    if (!files.person2IdCard)
      errors.person2IdCard = "Vui lòng tải lên CMND/CCCD người thứ hai";

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
      submitData.append(
        "serviceType",
        isAdministrative ? "administrative" : "civil"
      );

      const response = await fetch("/api/family-relationship", {
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
        </div>
        <div className="service-info">
          <h2>Thông tin dịch vụ</h2>
          <p>{service.description}</p>

          <form onSubmit={handleSubmit} className="family-relationship-form">
            <div className="form-section">
              <h3>Loại quan hệ</h3>
              <div className="form-group">
                <label htmlFor="relationshipType">
                  Loại quan hệ cần xác nhận *
                </label>
                <select
                  id="relationshipType"
                  name="relationshipType"
                  value={formData.relationshipType}
                  onChange={handleInputChange}
                  className={formErrors.relationshipType ? "error" : ""}
                >
                  <option value="">Chọn loại quan hệ</option>
                  <option value="parent-child">Cha/mẹ - Con</option>
                  <option value="siblings">Anh/chị/em ruột</option>
                  <option value="grandparent-grandchild">Ông/bà - Cháu</option>
                  <option value="uncle-aunt-nephew-niece">
                    Cô/dì/chú/bác - Cháu
                  </option>
                </select>
                {formErrors.relationshipType && (
                  <span className="error-message">
                    {formErrors.relationshipType}
                  </span>
                )}
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin người thứ nhất</h3>
              <div className="form-group">
                <label htmlFor="person1Name">Họ và tên *</label>
                <input
                  type="text"
                  id="person1Name"
                  name="person1Name"
                  value={formData.person1Name}
                  onChange={handleInputChange}
                  className={formErrors.person1Name ? "error" : ""}
                />
                {formErrors.person1Name && (
                  <span className="error-message">
                    {formErrors.person1Name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person1Id">CMND/CCCD *</label>
                <input
                  type="text"
                  id="person1Id"
                  name="person1Id"
                  value={formData.person1Id}
                  onChange={handleInputChange}
                  className={formErrors.person1Id ? "error" : ""}
                />
                {formErrors.person1Id && (
                  <span className="error-message">{formErrors.person1Id}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person1DateOfBirth">Ngày sinh *</label>
                <input
                  type="date"
                  id="person1DateOfBirth"
                  name="person1DateOfBirth"
                  value={formData.person1DateOfBirth}
                  onChange={handleInputChange}
                  className={formErrors.person1DateOfBirth ? "error" : ""}
                />
                {formErrors.person1DateOfBirth && (
                  <span className="error-message">
                    {formErrors.person1DateOfBirth}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person1Gender">Giới tính *</label>
                <select
                  id="person1Gender"
                  name="person1Gender"
                  value={formData.person1Gender}
                  onChange={handleInputChange}
                  className={formErrors.person1Gender ? "error" : ""}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {formErrors.person1Gender && (
                  <span className="error-message">
                    {formErrors.person1Gender}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person1Address">Địa chỉ</label>
                <input
                  type="text"
                  id="person1Address"
                  name="person1Address"
                  value={formData.person1Address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="person1Phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="person1Phone"
                  name="person1Phone"
                  value={formData.person1Phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="person1Email">Email</label>
                <input
                  type="email"
                  id="person1Email"
                  name="person1Email"
                  value={formData.person1Email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin người thứ hai</h3>
              <div className="form-group">
                <label htmlFor="person2Name">Họ và tên *</label>
                <input
                  type="text"
                  id="person2Name"
                  name="person2Name"
                  value={formData.person2Name}
                  onChange={handleInputChange}
                  className={formErrors.person2Name ? "error" : ""}
                />
                {formErrors.person2Name && (
                  <span className="error-message">
                    {formErrors.person2Name}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person2Id">CMND/CCCD *</label>
                <input
                  type="text"
                  id="person2Id"
                  name="person2Id"
                  value={formData.person2Id}
                  onChange={handleInputChange}
                  className={formErrors.person2Id ? "error" : ""}
                />
                {formErrors.person2Id && (
                  <span className="error-message">{formErrors.person2Id}</span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person2DateOfBirth">Ngày sinh *</label>
                <input
                  type="date"
                  id="person2DateOfBirth"
                  name="person2DateOfBirth"
                  value={formData.person2DateOfBirth}
                  onChange={handleInputChange}
                  className={formErrors.person2DateOfBirth ? "error" : ""}
                />
                {formErrors.person2DateOfBirth && (
                  <span className="error-message">
                    {formErrors.person2DateOfBirth}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person2Gender">Giới tính *</label>
                <select
                  id="person2Gender"
                  name="person2Gender"
                  value={formData.person2Gender}
                  onChange={handleInputChange}
                  className={formErrors.person2Gender ? "error" : ""}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </select>
                {formErrors.person2Gender && (
                  <span className="error-message">
                    {formErrors.person2Gender}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="person2Address">Địa chỉ</label>
                <input
                  type="text"
                  id="person2Address"
                  name="person2Address"
                  value={formData.person2Address}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="person2Phone">Số điện thoại</label>
                <input
                  type="tel"
                  id="person2Phone"
                  name="person2Phone"
                  value={formData.person2Phone}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="person2Email">Email</label>
                <input
                  type="email"
                  id="person2Email"
                  name="person2Email"
                  value={formData.person2Email}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="form-section">
              <h3>Thông tin bổ sung</h3>
              <div className="form-group">
                <label htmlFor="reason">Lý do xác nhận quan hệ *</label>
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
              {renderFileUpload("person1IdCard", "CMND/CCCD người thứ nhất")}
              {renderFileUpload("person2IdCard", "CMND/CCCD người thứ hai")}
              {renderFileUpload(
                "birthCertificate",
                "Giấy khai sinh (nếu có)",
                false
              )}
              {renderFileUpload("householdBook", "Sổ hộ khẩu (nếu có)", false)}
              {renderFileUpload(
                "marriageCertificate",
                "Giấy đăng ký kết hôn (nếu có)",
                false
              )}
              {renderFileUpload(
                "otherDocuments",
                "Giấy tờ khác (nếu có)",
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

export default FamilyRelationship;
