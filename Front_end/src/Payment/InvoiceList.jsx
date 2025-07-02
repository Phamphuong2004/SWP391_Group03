import React, { useEffect, useState } from "react";
import { getAllPayments } from "./PaymentApi";
import "./InvoiceList.css";

const InvoiceList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("ALL");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userString = localStorage.getItem("user");
        const token = userString ? JSON.parse(userString).token : null;
        if (!token) throw new Error("Bạn cần đăng nhập!");
        const data = await getAllPayments(token);
        setInvoices(data);
      } catch {
        setInvoices([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredInvoices = invoices.filter((inv) => {
    if (statusFilter === "ALL") return true;
    if (statusFilter === "PAID") return inv.status === "PAID";
    if (statusFilter === "PENDING") return inv.status === "PENDING";
    return true;
  });

  return (
    <div className="payment-container">
      <div className="payment-card">
        <h1 className="payment-title">Danh sách hóa đơn</h1>
        <div style={{ marginBottom: 16 }}>
          <label>Lọc trạng thái: </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ marginLeft: 8 }}
          >
            <option value="ALL">Tất cả</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="PENDING">Chưa thanh toán</option>
          </select>
        </div>
        {loading ? (
          <div>Đang tải dữ liệu...</div>
        ) : filteredInvoices.length === 0 ? (
          <div>Không có hóa đơn nào.</div>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Mã hóa đơn</th>
                <th>Mã lịch hẹn</th>
                <th>Số tiền</th>
                <th>Phương thức</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((inv) => (
                <tr key={inv.paymentId}>
                  <td>{inv.paymentId}</td>
                  <td>{inv.appointmentId}</td>
                  <td>{inv.amount}</td>
                  <td>{inv.method}</td>
                  <td>
                    {inv.status === "PAID" ? (
                      <span style={{ color: "green", fontWeight: 600 }}>
                        Đã thanh toán
                      </span>
                    ) : (
                      <span style={{ color: "orange", fontWeight: 600 }}>
                        Chưa thanh toán
                      </span>
                    )}
                  </td>
                  <td>
                    {inv.createdAt
                      ? new Date(inv.createdAt).toLocaleString()
                      : ""}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
