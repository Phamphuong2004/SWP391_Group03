import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Select,
} from "antd";
import {
  getAllSampleTypes,
  createSampleType,
  updateSampleType,
  deleteSampleType,
} from "../SampleManagement/SampleApi";
import "./SampleTypeManagement.css";

const kitComponents = [
  { id: 1, name: "Buccal Swab" },
  { id: 2, name: "Sample Storage Bag" },
  { id: 3, name: "User Manual" },
  { id: 4, name: "Bone Collection Tube" },
  { id: 5, name: "Shockproof Box" },
  { id: 6, name: "Personal DNA Test Kit" },
  { id: 7, name: "Sample Envelope" },
  { id: 8, name: "Legal Confirmation Form" },
  { id: 9, name: "Prenatal DNA Test Kit" },
  { id: 10, name: "Pregnancy Safety Guide" },
  { id: 11, name: "Custom DNA Kit" },
  { id: 12, name: "EDTA Tube" },
  { id: 13, name: "Safety Instruction" },
  { id: 14, name: "Genetic History Form" },
  { id: 15, name: "Gene Report Guide" },
  { id: 16, name: "Administrative Form" },
  { id: 17, name: "Legal File Cover" },
  { id: 18, name: "Civil Dispute Form" },
  { id: 19, name: "Judicial File" },
];

const SampleTypeManagement = () => {
  const [sampleTypes, setSampleTypes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingSampleType, setEditingSampleType] = useState(null);
  const [form] = Form.useForm();
  const user = JSON.parse(localStorage.getItem("user"));

  const fetchSampleTypes = async () => {
    setLoading(true);
    try {
      const data = await getAllSampleTypes(user?.token);
      setSampleTypes(data);
    } catch {
      message.error("Không thể tải danh sách loại mẫu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSampleTypes();
    // eslint-disable-next-line
  }, []);

  const handleAdd = () => {
    setEditingSampleType(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record) => {
    setEditingSampleType(record);
    // Tìm tên kit theo id
    const kitObj = kitComponents.find(k => k.id === record.kitComponentId || k.name === record.kitComponentName);
    form.setFieldsValue({
      kitComponentName: kitObj ? kitObj.name : "",
      name: record.name,
      description: record.description,
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteSampleType(id, user?.token);
      message.success("Xóa loại mẫu thành công");
      fetchSampleTypes();
    } catch {
      message.error("Không thể xóa loại mẫu");
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      // Tìm id bộ kit theo tên
      const kitObj = kitComponents.find(k => k.name === values.kitComponentName);
      const kitComponentId = kitObj ? kitObj.id : undefined;
      const payload = {
        name: values.name,
        description: values.description,
        componentName: values.kitComponentName,
      };
      if (editingSampleType) {
        await updateSampleType(editingSampleType.id, payload, user?.token);
        message.success("Cập nhật loại mẫu thành công");
      } else {
        await createSampleType(payload, user?.token, kitComponentId);
        message.success("Thêm loại mẫu thành công");
      }
      setIsModalVisible(false);
      fetchSampleTypes();
    } catch (err) {
      // Nếu là lỗi validation của form
      if (err && err.errorFields) return;
      // Nếu là lỗi từ server
      if (
        err &&
        err.response &&
        err.response.data &&
        err.response.data.message
      ) {
        message.error(err.response.data.message);
      } else if (err && err.message) {
        message.error(err.message);
      } else {
        message.error("Lưu loại mẫu thất bại");
      }
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Tên loại mẫu", dataIndex: "name", key: "name" },
    { title: "Mô tả", dataIndex: "description", key: "description" },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            className="button"
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger className="button">
              Xóa
            </Button>
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="sample-type-management-container">
      <h1 className="sample-type-management-title">Quản lý loại mẫu</h1>
      <Button
        type="primary"
        className="button"
        onClick={handleAdd}
        style={{ marginBottom: 16 }}
      >
        Thêm loại mẫu
      </Button>
      <Table
        className="sample-type-management-table"
        columns={columns}
        dataSource={sampleTypes}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
      <Modal
        title={editingSampleType ? "Cập nhật loại mẫu" : "Thêm loại mẫu mới"}
        open={isModalVisible}
        onOk={handleModalOk}
        onCancel={() => setIsModalVisible(false)}
        okText="Lưu"
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="kitComponentName"
            label="Tên bộ kit"
            rules={[{ required: true, message: "Vui lòng chọn tên bộ kit" }]}
          >
            <Select placeholder="Chọn tên bộ kit">
              {kitComponents.map((kit) => (
                <Select.Option key={kit.id} value={kit.name}>
                  {kit.name}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên loại mẫu"
            rules={[
              { required: true, message: "Vui lòng nhập tên loại mẫu" },
              { min: 2, message: "Tên loại mẫu phải có ít nhất 2 ký tự" },
              {
                pattern: /^[A-Za-zÀ-ỹ0-9\s]+$/,
                message: "Chỉ nhập chữ, số và khoảng trắng",
              },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[
              { required: true, message: "Vui lòng nhập mô tả" },
              { min: 5, message: "Mô tả phải có ít nhất 5 ký tự" },
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SampleTypeManagement;
