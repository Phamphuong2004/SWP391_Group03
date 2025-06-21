import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, message, Input, Select } from "antd";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

const ReceiveBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  // Fetch bookings based on user role
  const fetchBookings = async () => {
    if (!user || !user.token) {
      message.error("Bạn phải đăng nhập để xem các đơn đặt lịch.");
      return;
    }
    try {
      setLoading(true);
      let apiUrl = "";
      const userRole = user.role.toLowerCase();
      if (userRole === "staff" || userRole === "manager") {
        apiUrl = "/api/get-all-appointments";
      } else if (userRole === "customer") {
        apiUrl = "/api/view-appointments-user";
      } else {
        message.error("Vai trò của bạn không được hỗ trợ.");
        setLoading(false);
        return;
      }

      const response = await axios.get(apiUrl, {
        headers: { Authorization: `Bearer ${user.token}` },
      });

      // The response data might be the array itself, or it might be nested.
      const appointments = Array.isArray(response.data)
        ? response.data
        : response.data.data && Array.isArray(response.data.data)
        ? response.data.data
        : [];

      setBookings(appointments);
    } catch (error) {
      message.error("Không thể tải danh sách đơn đặt lịch.");
      console.error("Fetch bookings error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Handle booking status update
  const handleStatusUpdate = async (bookingId, newStatus) => {
    try {
      await axios.put(
        `/api/update-appointment/${bookingId}`,
        { status: newStatus }, // Send status in the body
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Cập nhật trạng thái thành công");
      fetchBookings();
    } catch (error) {
      message.error("Không thể cập nhật trạng thái");
      console.error(
        "Status update error:",
        error.response?.data || error.message
      );
    }
  };

  // Handle delete booking
  const handleDelete = (bookingId) => {
    Modal.confirm({
      title: "Bạn có chắc chắn muốn xóa đơn này?",
      content: "Hành động này không thể hoàn tác.",
      okText: "Có",
      okType: "danger",
      cancelText: "Không",
      onOk: async () => {
        try {
          await axios.delete(
            `http://localhost:8080/api/delete-appointment/${bookingId}`,
            { headers: { Authorization: `Bearer ${user.token}` } }
          );
          message.success("Xóa đơn thành công");
          fetchBookings();
        } catch (error) {
          message.error("Không thể xóa đơn");
        }
      },
    });
  };

  // Show booking details modal
  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    // Ensure date and time are formatted correctly for the form
    const bookingDetails = {
      ...booking,
      bookingDate: booking.bookingDate
        ? new Date(booking.bookingDate).toISOString().split("T")[0]
        : "",
      bookingTime: booking.bookingTime || "",
    };
    form.setFieldsValue(bookingDetails);
    setIsModalVisible(true);
  };

  // Handle form submission for update
  const handleSubmit = async (values) => {
    try {
      await axios.put(
        `http://localhost:8080/api/update-appointment/${selectedBooking.id}`,
        values,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      message.success("Cập nhật đơn thành công");
      setIsModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Không thể cập nhật đơn");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Tên khách hàng",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày đặt",
      dataIndex: "bookingDate",
      key: "bookingDate",
      render: (text) => new Date(text).toLocaleDateString(),
    },
    {
      title: "Giờ đặt",
      dataIndex: "bookingTime",
      key: "bookingTime",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Hành động",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showBookingDetails(record)}
            style={{ marginRight: 8 }}
          >
            Xem chi tiết
          </Button>
          {(user.role.toLowerCase() === "staff" ||
            user.role.toLowerCase() === "manager") && (
            <>
              <Button
                type="primary"
                onClick={() => handleStatusUpdate(record.id, "CONFIRMED")}
                style={{
                  marginRight: 8,
                  background: "#52c41a",
                  borderColor: "#52c41a",
                }}
              >
                Xác nhận
              </Button>
              <Button
                danger
                onClick={() => handleStatusUpdate(record.id, "CANCELLED")}
                style={{ marginRight: 8 }}
              >
                Hủy
              </Button>
              <Button
                danger
                type="primary"
                onClick={() => handleDelete(record.id)}
              >
                Xóa
              </Button>
            </>
          )}
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1>
        {user.role === "customer"
          ? "Các đơn đã đặt của bạn"
          : "Quản lý đơn đặt lịch"}
      </h1>
      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Chi tiết đơn đặt lịch"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={
          user.role.toLowerCase() === "staff" ||
          user.role.toLowerCase() === "manager"
            ? [
                <Button key="back" onClick={() => setIsModalVisible(false)}>
                  Hủy
                </Button>,
                <Button
                  key="submit"
                  type="primary"
                  onClick={() => form.submit()}
                >
                  Cập nhật
                </Button>,
              ]
            : null
        }
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          disabled={user.role.toLowerCase() === "customer"}
        >
          <Form.Item
            name="name"
            label="Tên khách hàng"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[{ required: true, type: "email" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="bookingDate"
            label="Ngày đặt"
            rules={[{ required: true }]}
          >
            <Input type="date" />
          </Form.Item>
          <Form.Item
            name="bookingTime"
            label="Giờ đặt"
            rules={[{ required: true }]}
          >
            <Input type="time" />
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="PENDING">Pending</Option>
              <Option value="CONFIRMED">Confirmed</Option>
              <Option value="CANCELLED">Cancelled</Option>
              <Option value="COMPLETED">Completed</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReceiveBooking;
