import React, { useContext, useState, useEffect } from "react";
import { ThemeContext } from "./ThemeContext";
import Button from "react-bootstrap/Button";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Dropdown from "react-bootstrap/Dropdown";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.css";
import { useMediaQuery } from "react-responsive";
import {
  FaHome,
  FaCalendarAlt,
  FaFileAlt,
  FaBoxOpen,
  FaBlog,
  FaSearch,
  FaCommentDots,
  FaSignInAlt,
  FaUserPlus,
  FaMoon,
  FaSun,
} from "react-icons/fa";

function getAvatar(avatar, name, fallback = "Người dùng") {
  const displayName = name && name.trim() ? name : fallback;
  return avatar && avatar.trim()
    ? avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}`;
}

function MyNavbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const isMobile = useMediaQuery({ maxWidth: 991 });
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    else setUser(null);
  }, [location]);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "user") {
        const userData = localStorage.getItem("user");
        if (userData) setUser(JSON.parse(userData));
        else setUser(null);
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  useEffect(() => {
    const handleUserUpdated = () => {
      const userData = localStorage.getItem("user");
      if (userData) setUser(JSON.parse(userData));
      else setUser(null);
    };
    window.addEventListener("userUpdated", handleUserUpdated);
    return () => window.removeEventListener("userUpdated", handleUserUpdated);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("userFullName");
    setUser(null);
    navigate("/");
  };

  return (
    <>
      <div
        className="navbar-logo-wrapper"
        onClick={() => {
          navigate("/");
          setExpanded(false);
        }}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/ADN TESTING.png"
          alt="Logo ADN Testing"
          className="navbar-logo-ontop"
        />
      </div>
      <Navbar expand="lg" className="navbar shadow-lg" expanded={expanded}>
        <Container fluid>
          <Navbar.Brand href="/" className="navbar-brand">
            {/* Logo removed from here */}
          </Navbar.Brand>
          <Navbar.Toggle
            aria-controls="navbarScroll"
            onClick={() => setExpanded(expanded ? false : true)}
          />
          <Navbar.Collapse id="navbarScroll">
            {isMobile ? (
              expanded && (
                <>
                  {/* Nav links group */}
                  <Nav
                    className="me-auto my-2 my-lg-0 navbar-nav"
                    style={{
                      width: "100%",
                      flexDirection: "column",
                      alignItems: "center",
                      marginBottom: 12,
                    }}
                    navbarScroll
                  >
                    <Nav.Link
                      className="nav-link"
                      style={{
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onClick={() => {
                        navigate("/");
                        setExpanded(false);
                      }}
                    >
                      <FaHome style={{ fontSize: 18 }} /> Trang chủ
                    </Nav.Link>
                    <Nav.Link
                      className="nav-link"
                      style={{
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onClick={() => {
                        navigate("/booking");
                        setExpanded(false);
                      }}
                    >
                      <FaCalendarAlt style={{ fontSize: 18 }} /> Đặt lịch
                    </Nav.Link>
                    <Nav.Link
                      className="nav-link"
                      style={{
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onClick={() => {
                        navigate("/dashboard");
                        setExpanded(false);
                      }}
                    >
                      <FaFileAlt style={{ fontSize: 18 }} /> Xem kết quả
                    </Nav.Link>
                    <Nav.Link
                      className="nav-link"
                      style={{
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onClick={() => {
                        navigate("/service-tracking");
                        setExpanded(false);
                      }}
                    >
                      <FaBoxOpen style={{ fontSize: 18 }} /> Theo dõi đơn
                    </Nav.Link>
                    <Nav.Link
                      className="nav-link"
                      style={{
                        fontSize: 16,
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                      }}
                      onClick={() => {
                        navigate("/blog");
                        setExpanded(false);
                      }}
                    >
                      <FaBlog style={{ fontSize: 18 }} /> Blog
                    </Nav.Link>
                  </Nav>
                  {/* Chức năng group */}
                  <div
                    className="navbar-actions responsive-navbar-actions"
                    style={{ width: "100%", marginBottom: 12 }}
                  >
                    <Form
                      className="d-flex align-items-center navbar-form-actions responsive-navbar-form-actions"
                      style={{ width: "100%" }}
                      onSubmit={(e) => {
                        e.preventDefault();
                        setExpanded(false);
                      }}
                    >
                      <Form.Control
                        type="search"
                        placeholder="Tìm kiếm"
                        className="me-2 form-control"
                        aria-label="Search"
                        style={{ fontSize: 15 }}
                      />
                      <Button
                        variant="info"
                        className="btn-info"
                        style={{
                          marginBottom: 8,
                          fontWeight: 600,
                          fontSize: 15,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onClick={() => setExpanded(false)}
                      >
                        <FaSearch /> Search
                      </Button>
                      <Button
                        variant="warning"
                        className="btn-warning"
                        style={{
                          marginBottom: 8,
                          fontWeight: 600,
                          fontSize: 15,
                          display: "flex",
                          alignItems: "center",
                          gap: 6,
                        }}
                        onClick={() => {
                          navigate("/feedback");
                          setExpanded(false);
                        }}
                      >
                        <FaCommentDots /> Feedback
                      </Button>
                    </Form>
                    {user ? (
                      <div className="user-menu">
                        <Dropdown align="end">
                          <Dropdown.Toggle
                            variant="link"
                            id="dropdown-user"
                            className="user-dropdown-toggle"
                            style={{
                              boxShadow: "none",
                              border: "none",
                              padding: 0,
                              background: "transparent",
                              display: "flex",
                              alignItems: "center",
                              gap: "12px",
                            }}
                          >
                            <img
                              src={getAvatar(
                                user.avatar,
                                user.fullName ||
                                  user.full_name ||
                                  user.fullname ||
                                  user.name
                              )}
                              alt="avatar"
                              className="user-avatar"
                            />
                            <div className="user-info">
                              <div className="user-name">
                                {user.fullName ||
                                  user.full_name ||
                                  user.fullname ||
                                  user.name}
                              </div>
                            </div>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item
                              onClick={() => {
                                navigate("/profile");
                                setExpanded(false);
                              }}
                            >
                              👤 Thông tin cá nhân
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => {
                                handleLogout();
                                setExpanded(false);
                              }}
                              className="text-danger"
                            >
                              🚪 Đăng xuất
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </div>
                    ) : (
                      <div
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "8px",
                          width: "100%",
                        }}
                        className="responsive-auth-btns"
                      >
                        <Button
                          variant="primary"
                          className="btn-primary"
                          style={{
                            marginBottom: 8,
                            fontWeight: 600,
                            fontSize: 15,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onClick={() => {
                            navigate("/login");
                            setExpanded(false);
                          }}
                        >
                          <FaSignInAlt /> Đăng nhập
                        </Button>
                        <Button
                          variant="secondary"
                          className="btn-secondary"
                          style={{
                            marginBottom: 8,
                            fontWeight: 600,
                            fontSize: 15,
                            display: "flex",
                            alignItems: "center",
                            gap: 6,
                          }}
                          onClick={() => {
                            navigate("/register");
                            setExpanded(false);
                          }}
                        >
                          <FaUserPlus /> Đăng ký
                        </Button>
                      </div>
                    )}
                  </div>
                  {/* Đổi theme group */}
                  <div
                    className="theme-toggle-wrapper responsive-theme-toggle"
                    style={{ zIndex: 1, width: "100%" }}
                  >
                    <button
                      className="theme-toggle-btn"
                      onClick={() => {
                        toggleTheme();
                        setExpanded(false);
                      }}
                      style={{
                        fontWeight: 600,
                        fontSize: 15,
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                      }}
                    >
                      {theme === "dark" ? <FaSun /> : <FaMoon />}{" "}
                      {theme === "dark" ? "Sáng" : "Tối"}
                    </button>
                  </div>
                </>
              )
            ) : (
              <>
                <Nav
                  className="me-auto my-2 my-lg-0 navbar-nav"
                  style={{ maxHeight: "100px", gap: "16px" }}
                  navbarScroll
                >
                  <Nav.Link href="/" className="nav-link">
                    Trang chủ
                  </Nav.Link>
                  {/* Ẩn hoàn toàn các nút quản lý khi là manager, chỉ giữ lại Trang chủ và Quản trị hệ thống */}
                  {user &&
                  user.role &&
                  user.role.toLowerCase() === "manager" ? (
                    <>
                      <NavDropdown
                        title="Quản trị hệ thống"
                        id="manager-system-dropdown"
                        className="nav-link"
                      >
                        <NavDropdown.Item href="/manager-dashboard">
                          Trang quản trị
                        </NavDropdown.Item>
                      </NavDropdown>
                    </>
                  ) : (
                    <>
                      {/* Đặt lịch chỉ cho guest và customer */}
                      {(!user ||
                        (user.role &&
                          user.role.toLowerCase() === "customer")) && (
                        <>
                          <NavDropdown
                            title="Dịch vụ"
                            id="navbarScrollingDropdown"
                          >
                            <NavDropdown.Item
                              href="/administrative-service"
                              className="dropdown-item"
                            >
                              Hành chính
                            </NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item
                              href="/civil-service"
                              className="dropdown-item"
                            >
                              Dân sự
                            </NavDropdown.Item>
                          </NavDropdown>
                          <Nav.Link href="/booking" className="nav-link">
                            Đặt lịch
                          </Nav.Link>
                          <Nav.Link href="/blog" className="nav-link">
                            Blog
                          </Nav.Link>
                        </>
                      )}
                      {/* Xem kết quả chỉ cho guest và customer */}
                      {(!user ||
                        (user.role &&
                          user.role.toLowerCase() === "customer")) && (
                        <Nav.Link
                          onClick={() => navigate("/dashboard")}
                          className="nav-link"
                        >
                          Xem kết quả
                        </Nav.Link>
                      )}
                      {/* Theo dõi đơn cho tất cả các loại tài khoản */}
                      <Nav.Link
                        onClick={() => {
                          if (user) {
                            navigate("/history");
                          } else {
                            navigate("/service-tracking");
                          }
                        }}
                        className="nav-link"
                      >
                        Theo dõi đơn
                      </Nav.Link>
                      {user && user.role.toLowerCase() === "staff" && (
                        <>
                          <Nav.Link
                            href="/receive-booking"
                            className="nav-link"
                          >
                            Quản lý đơn
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => navigate("/view-feedback")}
                            className="nav-link"
                          >
                            Xem đơn feedback
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => navigate("/invoices")}
                            className="nav-link"
                          >
                            Xem hóa đơn
                          </Nav.Link>
                          <Nav.Link
                            onClick={() => navigate("/kit-management")}
                            className="nav-link"
                          >
                            Quản lý Kit
                          </Nav.Link>
                          <Nav.Link
                            href="/sample-workspace"
                            className="nav-link"
                          >
                            Quản lý mẫu (Tổng hợp)
                          </Nav.Link>
                          <Nav.Link href="/staff-result" className="nav-link">
                            Kết quả xét nghiệm
                          </Nav.Link>
                          {/* Đã xóa hai nút quản lý test category và test purpose */}
                        </>
                      )}
                      {user &&
                        user.role &&
                        user.role.toLowerCase() === "staff" && (
                          <Nav.Link
                            onClick={() => navigate("/service-check")}
                            className="nav-link"
                          >
                            Kiểm tra dịch vụ
                          </Nav.Link>
                        )}
                      {user &&
                        ["manager", "staff"].includes(
                          user.role.toLowerCase()
                        ) && (
                          <>
                            <Nav.Link
                              href="/login-history"
                              className="nav-link"
                            >
                              Lịch Sử Người Dùng
                            </Nav.Link>
                            <Nav.Link href="/report" className="nav-link">
                              Báo cáo
                            </Nav.Link>
                          </>
                        )}
                      {user && user.role.toLowerCase() === "customer" && (
                        <>
                          <Nav.Link href="/payment" className="nav-link">
                            Thanh toán
                          </Nav.Link>
                        </>
                      )}
                      {user &&
                        ["manager", "staff"].includes(
                          user.role?.toLowerCase()
                        ) && (
                          <Nav.Link
                            href="/parallel-management"
                            className="nav-link"
                          >
                            Quản lý song song
                          </Nav.Link>
                        )}
                    </>
                  )}
                </Nav>
                {/* Di chuyển các phần actions và theme-toggle vào trong Collapse */}
                <div className="navbar-actions responsive-navbar-actions">
                  <Form className="d-flex align-items-center navbar-form-actions responsive-navbar-form-actions">
                    <Form.Control
                      type="search"
                      placeholder="Search"
                      className="me-2 form-control"
                      aria-label="Search"
                    />
                    <Button variant="info" className="btn-info">
                      Search
                    </Button>
                    <Button
                      variant="warning"
                      className="btn-warning"
                      style={{ margin: 0 }}
                      onClick={() => navigate("/feedback")}
                    >
                      Feedback
                    </Button>
                  </Form>
                  {user ? (
                    <div className="user-menu">
                      <Dropdown align="end">
                        <Dropdown.Toggle
                          variant="link"
                          id="dropdown-user"
                          className="user-dropdown-toggle"
                          style={{
                            boxShadow: "none",
                            border: "none",
                            padding: 0,
                            background: "transparent",
                            display: "flex",
                            alignItems: "center",
                            gap: "12px",
                          }}
                        >
                          <img
                            src={getAvatar(
                              user.avatar,
                              user.fullName ||
                                user.full_name ||
                                user.fullname ||
                                user.name
                            )}
                            alt="avatar"
                            className="user-avatar"
                          />
                          <div className="user-info">
                            <div className="user-name">
                              {user.fullName ||
                                user.full_name ||
                                user.fullname ||
                                user.name}
                            </div>
                          </div>
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
                          <Dropdown.Item onClick={() => navigate("/profile")}>
                            Thông tin cá nhân
                          </Dropdown.Item>
                          <Dropdown.Divider />
                          <Dropdown.Item
                            onClick={handleLogout}
                            className="text-danger"
                          >
                            Đăng xuất
                          </Dropdown.Item>
                        </Dropdown.Menu>
                      </Dropdown>
                    </div>
                  ) : (
                    <div
                      style={{ display: "flex", gap: "8px" }}
                      className="responsive-auth-btns"
                    >
                      <Button
                        variant="primary"
                        className="btn-primary"
                        onClick={() => navigate("/login")}
                      >
                        Đăng nhập
                      </Button>
                      <Button
                        variant="secondary"
                        className="btn-secondary"
                        onClick={() => navigate("/register")}
                      >
                        Đăng ký
                      </Button>
                    </div>
                  )}
                </div>
                <div
                  className="theme-toggle-wrapper responsive-theme-toggle"
                  style={{ zIndex: 1 }}
                >
                  <button className="theme-toggle-btn" onClick={toggleTheme}>
                    <span
                      className={`theme-icon ${
                        theme === "dark" ? "sun" : "moon"
                      }`}
                    >
                      {theme === "dark" ? "☀️" : "🌙"}
                    </span>
                    {theme === "dark" ? "Light" : "Dark"}
                  </button>
                </div>
              </>
            )}
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
