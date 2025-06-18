import React, { useState, useEffect } from "react";
import axios from "axios";
import { Table, Button, Modal, Form, message } from "antd";
import { useNavigate } from "react-router-dom";

const ReceiveBooking = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [form] = Form.useForm();
  const navigate = useNavigate();

  // Fetch bookings
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await axios.get("http://localhost:8080/api/bookings");
      setBookings(response.data);
    } catch (error) {
      message.error("Failed to fetch bookings");
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
        `http://localhost:8080/api/bookings/${bookingId}/status`,
        {
          status: newStatus,
        }
      );
      message.success("Booking status updated successfully");
      fetchBookings();
    } catch (error) {
      message.error("Failed to update booking status");
    }
  };

  // Show booking details modal
  const showBookingDetails = (booking) => {
    setSelectedBooking(booking);
    form.setFieldsValue(booking);
    setIsModalVisible(true);
  };

  // Handle form submission
  const handleSubmit = async (values) => {
    try {
      await axios.put(
        `http://localhost:8080/api/bookings/${selectedBooking.id}`,
        values
      );
      message.success("Booking updated successfully");
      setIsModalVisible(false);
      fetchBookings();
    } catch (error) {
      message.error("Failed to update booking");
    }
  };

  const columns = [
    {
      title: "Booking ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Customer Name",
      dataIndex: "customerName",
      key: "customerName",
    },
    {
      title: "Date",
      dataIndex: "bookingDate",
      key: "bookingDate",
    },
    {
      title: "Time",
      dataIndex: "bookingTime",
      key: "bookingTime",
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <>
          <Button
            type="primary"
            onClick={() => showBookingDetails(record)}
            style={{ marginRight: 8 }}
          >
            View Details
          </Button>
          <Button
            type="primary"
            onClick={() => handleStatusUpdate(record.id, "CONFIRMED")}
            style={{ marginRight: 8 }}
          >
            Confirm
          </Button>
          <Button
            danger
            onClick={() => handleStatusUpdate(record.id, "CANCELLED")}
          >
            Cancel
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: "24px" }}>
      <h1>Receive Bookings</h1>
      <Table
        columns={columns}
        dataSource={bookings}
        loading={loading}
        rowKey="id"
      />

      <Modal
        title="Booking Details"
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            name="customerName"
            label="Customer Name"
            rules={[{ required: true }]}
          >
            <input />
          </Form.Item>
          <Form.Item
            name="bookingDate"
            label="Booking Date"
            rules={[{ required: true }]}
          >
            <input type="date" />
          </Form.Item>
          <Form.Item
            name="bookingTime"
            label="Booking Time"
            rules={[{ required: true }]}
          >
            <input type="time" />
          </Form.Item>
          <Form.Item name="status" label="Status" rules={[{ required: true }]}>
            <select>
              <option value="PENDING">Pending</option>
              <option value="CONFIRMED">Confirmed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Update Booking
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ReceiveBooking;
