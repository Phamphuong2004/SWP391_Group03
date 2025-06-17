import React from "react";
import activities from "../ADNActivites";
import "./ADNTestingActivities.css";

export default function ADNTestingActivities() {
  return (
    <div className="adn-activities-container adn-activities-animated">
      <div className="container my-5">
        <div className="bg-white rounded shadow p-4">
          <h2
            className="text-center mb-4"
            style={{ color: "#c0392b", fontWeight: "bold" }}
          >
            Các hoạt động xét nghiệm ADN
          </h2>
          <div className="row g-4 justify-content-center">
            {activities.map((act) => (
              <div
                key={act.id}
                className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch"
              >
                <div className="card" style={{ width: "100%" }}>
                  <img
                    src={act.image}
                    className="card-img-top"
                    alt={act.title}
                    style={{ height: "180px", objectFit: "cover" }}
                  />
                  <div className="card-body">
                    <h5
                      className="card-title"
                      style={{ color: "#c0392b", fontWeight: "bold" }}
                    >
                      {act.title}
                    </h5>
                    <p className="card-text">{act.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
