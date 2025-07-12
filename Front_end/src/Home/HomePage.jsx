import React from "react";
import ADNIntro from "../Intro/ADNIntro";
import Banner from "../component/Banner";
import MyCard from "../component/MyCard";
import ADNTestingServices from "../listOfServices";
import Footer from "../component/Footer";
import ADNTestingActivities from "../Activities/ADNTestingActivities";

export default function HomePage() {
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
          {ADNTestingServices.map((service) => (
            <div
              key={service.id}
              className="col-lg-4 col-md-6 col-sm-12 d-flex align-items-stretch"
              style={{ maxWidth: "400px", marginBottom: "24px" }}
            >
              <MyCard service={service} />
            </div>
          ))}
        </div>
      </div>
      <ADNTestingActivities />
      <Footer />
    </>
  );
}
