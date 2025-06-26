import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import MyNavbar from "../component/Navbar";
import Login from "../login/Login";
import "../App.css";
import Register from "../register/Register";
import Booking from "../Booking/Booking";
import Blog from "../Blog/Blog";
import BlogDetail from "../Blog/BlogDetail";
import AdministrativeService from "../ServiceInfo/AdministrativeService";
import CivilService from "../ServiceInfo/CivilService";
import Dashboard from "../Dashboard/Dashboard";
import Feedback from "../Feedback/Feedback";
import RegisterNotification from "../register/RegisterNotification";
import AuthNotification from "../AuthNotification/AuthNotification";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../Profile/Profile";
import AppointmentHistory from "../History/AppointmentHistory";
import History from "../History/History";
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
import HomePage from "../Home/HomePage";
import Payment from "../Payment/Payment";
import ServiceManagement from "../ServiceManagement/ServiceManagement";
import AccountManagement from "../AccountManagement/AccountManagement";
import UpdateRolePage from "../rolePage/UpdateRolePage";

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
        <Route
          path="/history"
          element={
            <ProtectedRoute allowedRoles={["manager", "staff", "customer"]}>
              <AppointmentHistory />
            </ProtectedRoute>
          }
        />
        <Route
          path="/login-history"
          element={
            <ProtectedRoute allowedRoles={["manager", "staff", "customer"]}>
              <History />
            </ProtectedRoute>
          }
        />
        <Route path="/dashboard" element={<Dashboard />} />
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
        <Route path="/service-tracking/:id" element={<ServiceTracking />} />
        <Route path="/service-tracking" element={<ServiceTracking />} />
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
        <Route
          path="/payment"
          element={
            <ProtectedRoute allowedRoles={["customer"]}>
              <Payment />
            </ProtectedRoute>
          }
        />
        <Route
          path="/service-management"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ServiceManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/account-management"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <AccountManagement />
            </ProtectedRoute>
          }
        />
        <Route path="/update-role" element={<UpdateRolePage />} />
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
