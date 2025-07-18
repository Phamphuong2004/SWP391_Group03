import React, { useState } from "react";
import "./KitManagement.css";
import {
  getKitByServiceId,
  createKitComponent,
  deleteKitComponent,
  updateKitComponent,
} from "./KitApi";
import { Table, Button, Popconfirm, message, Form, Input, Card } from "antd";

const KitManagement = () => {
  const [serviceId, setServiceId] = useState("");
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [editingKit, setEditingKit] = useState(null);
  const [form] = Form.useForm();

  const fetchKits = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getKitByServiceId(serviceId);
      setKits(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      setError("Không thể lấy danh sách kit!");
      setKits([]);
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    form.setFieldsValue({ [name]: value });
  };

  const handleAddKit = async (values) => {
    setError(null);
    // Validation
    if (!serviceId || serviceId.trim() === "") {
      setError("Vui lòng nhập mã dịch vụ.");
      return;
    }
    if (!values.componentName || values.componentName.trim() === "") {
      setError("Tên kit không được để trống.");
      return;
    }
    if (values.quantity === undefined || values.quantity === "") {
      setError("Số lượng không được để trống.");
      return;
    }
    if (isNaN(Number(values.quantity)) || Number(values.quantity) < 0) {
      setError("Số lượng phải là số dương.");
      return;
    }
    try {
      await createKitComponent(serviceId, values);
      form.resetFields();
      setRefresh((r) => !r);
    } catch (err) {
      setError("Thêm kit thất bại!");
    }
  };

  const handleEdit = (kit) => {
    console.log("Editing kit:", kit); // Debug log
    setEditingKit(kit);
    form.setFieldsValue({
      componentName: kit.kitComponentName || kit.componentName || "",
      quantity:
        kit.quantity !== undefined && kit.quantity !== null ? kit.quantity : "",
      introduction: kit.introduction || "",
    });
  };

  const handleUpdateKit = async (values) => {
    // Validation
    if (!editingKit) return;
    if (!serviceId || serviceId.trim() === "") {
      setError("Vui lòng nhập mã dịch vụ.");
      return;
    }
    if (!values.componentName || values.componentName.trim() === "") {
      setError("Tên kit không được để trống.");
      return;
    }
    if (values.quantity === undefined || values.quantity === "") {
      setError("Số lượng không được để trống.");
      return;
    }
    if (isNaN(Number(values.quantity)) || Number(values.quantity) < 0) {
      setError("Số lượng phải là số dương.");
      return;
    }
    try {
      await updateKitComponent(
        editingKit.kitComponentId || editingKit.id,
        values
      );
      setEditingKit(null);
      form.resetFields();
      setRefresh((r) => !r);
    } catch (err) {
      console.error("Error in handleUpdateKit:", err);
      setError("Cập nhật kit thất bại!");
    }
  };

  const handleCancelEdit = () => {
    setEditingKit(null);
    form.resetFields();
  };

  const handleDelete = async (kitComponentId) => {
    setError(null);
    try {
      await deleteKitComponent(kitComponentId);
      setRefresh((r) => !r);
    } catch (err) {
      setError("Xóa kit thất bại!");
    }
  };

  React.useEffect(() => {
    if (serviceId) fetchKits();
    // eslint-disable-next-line
  }, [serviceId, refresh]);

  // Chuẩn bị columns cho AntD Table
  const columns = [
    {
      title: "Tên kit",
      dataIndex: "componentName",
      key: "componentName",
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Hướng dẫn",
      dataIndex: "introduction",
      key: "introduction",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, kit) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button type="primary" onClick={() => handleEdit(kit)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(kit.kitComponentId || kit.id)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="kit-management-card">
      <h2 className="kit-management-title">Quản lý Kit</h2>
      <div className="kit-management-serviceid-row">
        <label htmlFor="serviceId">Nhập mã dịch vụ:</label>
        <div className="serviceid-input-group">
          <Input
            id="serviceId"
            className="kit-service-id-input"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            placeholder="Nhập mã dịch vụ"
            style={{ width: 200, marginRight: 8 }}
          />
          <Button
            className="btn-load-kit"
            onClick={fetchKits}
            disabled={!serviceId}
            type="primary"
          >
            Tải kit
          </Button>
        </div>
      </div>
      {error && <div className="kit-management-error">{error}</div>}
      {loading ? (
        <div>Đang tải...</div>
      ) : (
        <Table
          columns={columns}
          dataSource={kits}
          rowKey={(kit) => kit.kitComponentId || kit.id}
          pagination={false}
          bordered
          locale={{ emptyText: "Không có kit nào" }}
          style={{ borderRadius: 8, marginTop: 16 }}
        />
      )}
      <Card style={{ maxWidth: 500, margin: "32px auto 0", borderRadius: 8 }}>
        <h3 className="kit-management-subtitle" style={{ textAlign: "center" }}>
          {editingKit ? "Cập nhật kit" : "Thêm kit mới"}
        </h3>
        <Form
          form={form}
          layout="vertical"
          onFinish={editingKit ? handleUpdateKit : handleAddKit}
        >
          <Form.Item
            label="Tên kit"
            name="componentName"
            rules={[{ required: true, message: "Vui lòng nhập tên kit" }]}
          >
            <Input
              placeholder="Tên kit"
              onChange={handleInputChange}
              name="componentName"
            />
          </Form.Item>
          <Form.Item
            label="Số lượng"
            name="quantity"
            rules={[{ required: true, message: "Vui lòng nhập số lượng" }]}
          >
            <Input
              type="number"
              placeholder="Số lượng"
              onChange={handleInputChange}
              name="quantity"
            />
          </Form.Item>
          <Form.Item label="Hướng dẫn" name="introduction">
            <Input
              placeholder="Hướng dẫn"
              onChange={handleInputChange}
              name="introduction"
            />
          </Form.Item>
          <div style={{ display: "flex", gap: 8, justifyContent: "center" }}>
            <Button type="primary" htmlType="submit" disabled={!serviceId}>
              {editingKit ? "Cập nhật kit" : "Thêm kit"}
            </Button>
            {editingKit && (
              <Button
                type="default"
                className="btn-cancel"
                onClick={handleCancelEdit}
              >
                Hủy
              </Button>
            )}
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default KitManagement;
