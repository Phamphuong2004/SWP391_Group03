import React from "react";
import Button from "react-bootstrap/Button";
import "./MyCard.css";
import Card from "react-bootstrap/Card";
import ADNTestingServices from "../listOfServices";
import { useNavigate } from "react-router-dom";

export default function MyCard({ service }) {
  const navigate = useNavigate();
  return (
    <div className="card my-card-animated">
      <Card className="h-100">
        <Card.Img
          variant="top"
          src={
            service.image || "https://via.placeholder.com/300x200?text=No+Image"
          }
          style={{ height: "200px", objectFit: "cover" }}
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title>{service.testType}</Card.Title>
          <Card.Text className="text-muted mb-2">
            <strong>Mẫu cần lấy:</strong> {service.sampleRequired}
          </Card.Text>
          <Card.Text className="text-muted mb-2">
            <strong>Thời gian trả kết quả:</strong> {service.turnaroundTime}
          </Card.Text>
          <Card.Text className="text-muted mb-2">
            <strong>Giá:</strong> {service.price}
          </Card.Text>
          <Card.Text className="text-muted mb-2">
            <strong>Đánh giá:</strong> ⭐ {service.rating}/5.0
          </Card.Text>
          <Card.Text className="mb-2">
            <span
              className={`badge ${
                service.isAccredited ? "bg-success" : "bg-warning"
              }`}
            >
              {service.isAccredited ? "Đã kiểm định" : "Chưa kiểm định"}
            </span>
          </Card.Text>
          <Card.Text className="mb-3">{service.description}</Card.Text>
          <Button
            variant="outline-primary"
            className="mt-auto"
            onClick={() => navigate(`/service-detail/${service.id}`)}
          >
            Xem chi tiết
          </Button>
          <Button
            variant="danger"
            className="mt-2"
            onClick={() => navigate('/booking', { state: { serviceId: service.id } })}
          >
            Đặt lịch
          </Button>
        </Card.Body>
      </Card>
    </div>
  );
}
