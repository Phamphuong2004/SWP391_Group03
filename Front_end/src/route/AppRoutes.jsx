import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import HomePage from "../Home/HomePage";
import ReceiveBooking from "../ReceiveBooking/ReceiveBooking";
import Payment from "../Payment/Payment";
import "../ServiceInfo/ServiceDetails/ServiceDetail.css";
import ServiceDetail from "../ServiceInfo/ServiceDetails/ServiceDetail";
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
import Feedback from "../Feedback/Feedback.jsx";
import RegisterNotification from "../register/RegisterNotification";
import AuthNotification from "../AuthNotification/AuthNotification";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "../Profile/Profile";
import AppointmentHistory from "../History/AppointmentHistory";
import History from "../History/History";
import ForgotPassword from "../Password/ForgotPassword";
import BookingNotification from "../Booking/BookingNotification";
import { administrativeServices } from "../ServiceInfo/servicesData";

// DNA Testing Service Components - Sửa import paths
import AdministrativeTestGuide from "../ServiceInfo/ServiceDetails/administrative-test";
import CivilTestGuide from "../ServiceInfo/ServiceDetails/civil-test";
import FetalTestGuide from "../ServiceInfo/ServiceDetails/fetal-test";
import GeneticAnalysisGuide from "../ServiceInfo/ServiceDetails/genetic-analysis";
import LegalAnalysisGuide from "../ServiceInfo/ServiceDetails/legal-analysis";
import OtherTestGuide from "../ServiceInfo/ServiceDetails/other-test";
import PaternityLegalGuide from "../ServiceInfo/ServiceDetails/paternity-legal";
import PersonalTestGuide from "../ServiceInfo/ServiceDetails/personal-test";
import PrenatalTestGuide from "../ServiceInfo/ServiceDetails/prenatal-test";
import RemainsIdentificationGuide from "../ServiceInfo/ServiceDetails/remains-identification";
import ServiceTracking from "../ServiceTracking/ServiceTracking.jsx";
import ServiceManagement from "../ServiceManagement/ServiceManagement";
import AccountManagement from "../AccountManagement/AccountManagement";
import UpdateRolePage from "../rolePage/UpdateRolePage";
import ViewFeedback from "../Feedback/ViewFeedback";
import InvoiceList from "../Payment/InvoiceList";
import SampleManagement from "../SampleManagement/SampleManagement";
import KitManagement from "../Kit/KitManagement";
import SampleWorkspace from "../SampleWorkspace/SampleWorkspace";
import ManagerDashboard from "../Dashboard/ManagerDashboard";
import StaffResult from "../StaffResult/StaffResult";
import Report from "../Report/Report";
import TestCategoryManager from "../TestCategory/TestCategoryManager";
import TestPurposeManager from "../TestPurpose/TestPurposeManager";
import ParallelManagement from "../TestPurposeAndCategoryManagement/ParallelManagement";
import ServiceTestPurposeStaff from "../servicetestpurpose/servicetestpurposestafff";
import CustomerServiceDetail from "../ServiceInfo/CustomerServiceDetail";

function AppContent() {
  const { pathname } = useLocation();
  const hideNavbar = ["/login", "/register", "/forgot-password"].includes(
    pathname
  );

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
        <Route path="/service-detail/:id" element={<CustomerServiceDetail />} />

        {/* DNA Testing Service Routes - Chỉ những service có file jsx */}
        <Route
          path="/service/administrative-test"
          element={<AdministrativeTestGuide />}
        />
        <Route path="/service/civil-test" element={<CivilTestGuide />} />
        <Route path="/service/fetal-test" element={<FetalTestGuide />} />
        <Route
          path="/service/genetic-analysis"
          element={<GeneticAnalysisGuide />}
        />
        <Route
          path="/service/legal-analysis"
          element={<LegalAnalysisGuide />}
        />
        <Route path="/service/other-test" element={<OtherTestGuide />} />
        <Route
          path="/service/paternity-legal"
          element={<PaternityLegalGuide />}
        />
        <Route path="/service/personal-test" element={<PersonalTestGuide />} />
        <Route path="/service/prenatal-test" element={<PrenatalTestGuide />} />
        <Route
          path="/service/remains-identification"
          element={<RemainsIdentificationGuide />}
        />

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
            <ProtectedRoute allowedRoles={["customer", "guest"]}>
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
        <Route
          path="/view-feedback"
          element={
            <ProtectedRoute allowedRoles={["manager", "staff"]}>
              <ViewFeedback />
            </ProtectedRoute>
          }
        />
        <Route
          path="/invoices"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <InvoiceList />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sample-management"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <SampleManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/kit-management"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <KitManagement />
            </ProtectedRoute>
          }
        />
        <Route
          path="/sample-workspace"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <SampleWorkspace />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manager-dashboard"
          element={
            <ProtectedRoute allowedRoles={["manager"]}>
              <ManagerDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/staff-result"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <StaffResult />
            </ProtectedRoute>
          }
        />
        <Route
          path="/report"
          element={
            <ProtectedRoute allowedRoles={["staff", "manager"]}>
              <Report />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-category"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <TestCategoryManager />
            </ProtectedRoute>
          }
        />
        <Route
          path="/test-purpose"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <TestPurposeManager />
            </ProtectedRoute>
          }
        />
        <Route path="/parallel-management" element={<ParallelManagement />} />
        <Route
          path="/service-check"
          element={
            <ProtectedRoute allowedRoles={["staff"]}>
              <ServiceTestPurposeStaff />
            </ProtectedRoute>
          }
        />
        <Route path="/service-tracking" element={<ServiceTracking />} />
      </Routes>
    </>
  );
}

export default function AppRoutes() {
  return <AppContent />;
}
