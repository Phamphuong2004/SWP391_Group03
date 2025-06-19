import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import MyNavbar from "../component/Navbar";
import ADNIntro from "../Intro/ADNIntro";
import MyCard from "../component/MyCard";
import ADNTestingServices from "../listOfServices";
import Footer from "../component/Footer";
import Login from "../login/Login";
import "../component/Navbar.css";
import "../component/Banner.css";
import "../component/MyCard.css";
import "../component/Footer.css";
import "../App.css";
import Register from "../register/Register";
import "../register/Register.css";
import Booking from "../Booking/Booking";
import "../Booking/Booking.css";
import Blog from "../Blog/Blog";
import BlogDetail from "../Blog/BlogDetail";
import AdministrativeService from "../ServiceInfo/AdministrativeService";
import CivilService from "../ServiceInfo/CivilService";
import Dashboard from "../Dashboard/Dashboard";
import ADNTestingActivities from "../Activities/ADNTestingActivities";
import Banner from "../component/Banner";
import Feedback from "../Feedback/Feedback";
import RegisterNotification from "../register/RegisterNotification";
import AuthNotification from "../AuthNotification/AuthNotification";
import AdminDashboard from "../Dashboard/AdminDashboard";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../Profile/Profile";
import StaffDashboard from "../Dashboard/StaffDashboard";
import ManagerDashboard from "../Dashboard/ManagerDashboard";
import History from "../History/History"; // Import the History component
import ForgotPassword from "../Password/ForgotPassword";
import BookingNotification from "../Booking/BookingNotification";
import ServiceDetail from "../ServiceInfo/ServiceDetails/ServiceDetail";
import { administrativeServices } from "../ServiceInfo/servicesData";
import BirthCertificate from "../ServiceInfo/ServiceDetails/birth-certificate";
import HouseholdRegistration from "../ServiceInfo/ServiceDetails/household-registration";
import Adoption from "../ServiceInfo/ServiceDetails/adoption";
import ServiceTracking from "../ServiceTracking/ServiceTracking";
import FamilyRelationship from "../ServiceInfo/ServiceDetails/family-relationship";
import PropertyDispute from "../ServiceInfo/ServiceDetails/property-dispute";
import Inheritance from "../ServiceInfo/ServiceDetails/inheritance";
import CivilContract from "../ServiceInfo/ServiceDetails/civil-contract";
import ViewDetails from "../ViewDetails/ViewDetails";
import ReceiveBooking from "../ReceiveBooking/ReceiveBooking";
import "../ReceiveBooking/ReceiveBooking.css";

function HomePage() {
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

function AppContent() {
  const { pathname } = useLocation();
  const hideNavbar = pathname === "/login" || pathname === "/register";

  return (
    <>
      {!hideNavbar && <MyNavbar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/register-notification"
          element={<RegisterNotification />}
        />
        <Route path="/booking" element={<Booking />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:id" element={<BlogDetail />} />
        {/* Chỉ admin mới xem được dashboard */}
        <Route
          path="/admin-dashboard"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        {/* Staff dashboard chỉ cho staff */}
        <Route
          path="/staff-dashboard"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <StaffDashboard />
            </ProtectedRoute>
          }
        />
        {/* Manager dashboard chỉ cho manager */}
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        {/* Route cho trang lịch sử, chỉ cho admin */}
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route
          path="/services/hanh-chinh"
          element={<AdministrativeService />}
        />
        <Route path="/services/dan-su" element={<CivilService />} />
        <Route
          path="/administrative-service"
          element={<AdministrativeService />}
        />
        <Route path="/civil-service" element={<CivilService />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/auth-notification" element={<AuthNotification />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/booking-notification" element={<BookingNotification />} />
        <Route
          path="/service/:id"
          element={<ServiceDetail services={administrativeServices} />}
        />
        <Route
          path="/service/birth-certificate"
          element={<BirthCertificate />}
        />
        <Route
          path="/service/household-registration"
          element={<HouseholdRegistration />}
        />
        <Route path="/service/adoption" element={<Adoption />} />
        <Route
          path="/service-tracking/:serviceId"
          element={<ServiceTracking />}
        />
        <Route
          path="/service/family-relationship"
          element={<FamilyRelationship />}
        />
        <Route path="/service/property-dispute" element={<PropertyDispute />} />
        <Route path="/service/inheritance" element={<Inheritance />} />
        <Route path="/service/civil-contract" element={<CivilContract />} />
        <Route path="/service-detail/:id" element={<ViewDetails />} />
        {/* Route cho staff và manager tiếp nhận booking */}
        <Route
          path="/receive-booking"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <ReceiveBooking />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}
