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
  { name: "Buccal Swab" },
  { name: "Sample Storage Bag" },
  { name: "User Manual" },
  { name: "Bone Collection Tube" },
  { name: "Shockproof Box" },
  { name: "Personal DNA Test Kit" },
  { name: "Sample Envelope" },
  { name: "Legal Confirmation Form" },
  { name: "Prenatal DNA Test Kit" },
  { name: "Pregnancy Safety Guide" },
  { name: "Custom DNA Kit" },
  { name: "EDTA Tube" },
  { name: "Safety Instruction" },
  { name: "Genetic History Form" },
  { name: "Gene Report Guide" },
  { name: "Administrative Form" },
  { name: "Legal File Cover" },
  { name: "Civil Dispute Form" },
  { name: "Judicial File" },
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
    form.setFieldsValue({
      kit_component_id: record.kit_component_id,
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
      const payload = {
        kit_component_id: values.kit_component_id,
        name: values.name,
        description: values.description,
      };
      if (editingSampleType) {
        await updateSampleType(editingSampleType.id, payload, user?.token);
        message.success("Cập nhật loại mẫu thành công");
      } else {
        await createSampleType(payload, user?.token);
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
            name="kit_component_id"
            label="ID bộ kit"
            rules={[
              { required: true, message: "Vui lòng nhập ID bộ kit" },
              {
                type: "number",
                transform: (value) => Number(value),
                message: "ID phải là số",
              },
              {
                validator: (_, value) =>
                  value > 0
                    ? Promise.resolve()
                    : Promise.reject("ID phải lớn hơn 0"),
              },
            ]}
          >
            <Input type="number" />
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
