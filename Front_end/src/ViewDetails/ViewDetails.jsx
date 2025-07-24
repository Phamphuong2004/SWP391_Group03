import { useParams, useNavigate } from "react-router-dom";
import ADNTestingServices from "../listOfServices";

export default function ViewDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const service = ADNTestingServices.find((s) => String(s.id) === String(id));

  if (!service) return <div>Không tìm thấy dịch vụ!</div>;

  return (
    <div
      className="service-detail-container"
      style={{
        maxWidth: 600,
        margin: "40px auto",
        background: "#fff",
        borderRadius: 16,
        boxShadow: "0 4px 32px rgba(0,0,0,0.10)",
        padding: 32,
      }}
    >
      <button onClick={() => navigate(-1)} style={{ marginBottom: 16 }}>
        Quay lại
      </button>
      <h2 style={{ marginBottom: 16 }}>{service.testType}</h2>
      <img
        src={
          service.image || "https://via.placeholder.com/300x200?text=No+Image"
        }
        alt={service.testType}
        style={{ width: "100%", borderRadius: 8, marginBottom: 16 }}
      />
      <p>
        <b>Mẫu cần lấy:</b> {service.sampleRequired}
      </p>
      <p>
        <b>Thời gian trả kết quả:</b> {service.turnaroundTime}
      </p>
      <p>
        <b>Giá:</b> {service.price}
      </p>
      <p>
        <b>Đánh giá:</b> ⭐ {service.rating}/5.0
      </p>
      <p>
        <span
          className={`badge ${
            service.isAccredited ? "bg-success" : "bg-warning"
          }`}
        >
          {service.isAccredited ? "Đã kiểm định" : "Chưa kiểm định"}
        </span>
      </p>
      <p>
        <b>Mô tả:</b> {service.description}
      </p>
      <button
        style={{
          marginTop: 24,
          background: '#1976d2',
          color: '#fff',
          border: 'none',
          borderRadius: 8,
          padding: '12px 36px',
          fontWeight: 700,
          fontSize: 20,
          cursor: 'pointer',
          boxShadow: '0 2px 8px #1976d233',
          transition: 'background 0.2s',
        }}
        onClick={() => navigate('/booking', { state: { serviceId: String(service.id) } })}
      >
        Đặt lịch
      </button>
    </div>
  );
}
