import React, { useState } from "react";
import ADNIntro from "../Intro/ADNIntro";
import Banner from "../component/Banner";
import MyCard from "../component/MyCard";
import ADNTestingServices from "../listOfServices";
import Footer from "../component/Footer";
import ADNTestingActivities from "../Activities/ADNTestingActivities";

export default function HomePage() {
  const [currentPage, setCurrentPage] = useState(1);
  const servicesPerPage = 4;
  const totalPages = Math.ceil(ADNTestingServices.length / servicesPerPage);
  const startIdx = (currentPage - 1) * servicesPerPage;
  const endIdx = startIdx + servicesPerPage;
  const currentServices = ADNTestingServices.slice(startIdx, endIdx);

  return (
    <>
      <ADNIntro />
      <Banner />
      <h1
        className="text-center mt-4"
        style={{ color: "#c0392b", fontWeight: "bold" }}
      >
        Dịch vụ xét nghiệm khách hàng có thể tìm hiểu
      </h1>
      <div className="container-fluid py-4">
        <div className="row g-4 justify-content-center">
          {currentServices.map((service, idx) => (
            <div
              key={service.id || idx}
              className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch"
              style={{ maxWidth: "400px", marginBottom: "24px" }}
            >
              <MyCard service={service} />
            </div>
          ))}
        </div>
        {/* Pagination */}
        <div
          style={{ display: "flex", justifyContent: "center", marginTop: 24 }}
        >
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i + 1}
              onClick={() => setCurrentPage(i + 1)}
              style={{
                margin: "0 6px",
                padding: "6px 16px",
                borderRadius: 6,
                border:
                  currentPage === i + 1
                    ? "2px solid #c0392b"
                    : "1px solid #ccc",
                background: currentPage === i + 1 ? "#fbeee0" : "#fff",
                color: currentPage === i + 1 ? "#c0392b" : "#333",
                fontWeight: currentPage === i + 1 ? 700 : 400,
                cursor: "pointer",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
      <ADNTestingActivities />
      <Footer />
    </>
  );
}
