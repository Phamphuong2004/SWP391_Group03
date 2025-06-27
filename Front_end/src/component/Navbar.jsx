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

function MyNavbar() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);
  const lastGuest = JSON.parse(
    localStorage.getItem("lastGuestAppointment") || "null"
  );

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    else setUser(null);
  }, [location]);

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
        onClick={() => navigate("/")}
        style={{ cursor: "pointer" }}
      >
        <img
          src="/ADN TESTING.png"
          alt="Logo ADN Testing"
          className="navbar-logo-ontop"
        />
      </div>
      <Navbar expand="lg" className="navbar shadow-lg">
        <Container fluid>
          <Navbar.Brand href="/" className="navbar-brand">
            {/* Logo removed from here */}
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav
              className="me-auto my-2 my-lg-0 navbar-nav"
              style={{ maxHeight: "100px" }}
              navbarScroll
            >
              <Nav.Link href="/" className="nav-link">
                Trang chủ
              </Nav.Link>
              <Nav.Link href="/booking" className="nav-link">
                Đặt lịch
              </Nav.Link>
              <NavDropdown title="Dịch vụ" id="navbarScrollingDropdown">
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
              <Nav.Link href="/blog" className="nav-link">
                Blog
              </Nav.Link>
              <Nav.Link
                onClick={() => navigate("/dashboard")}
                className="nav-link"
              >
                Xem kết quả
              </Nav.Link>
              <Nav.Link
                onClick={() => {
                  const lastGuest = JSON.parse(
                    localStorage.getItem("lastGuestAppointment") || "null"
                  );
                  if (
                    lastGuest &&
                    lastGuest.appointmentId &&
                    lastGuest.email &&
                    lastGuest.phone
                  ) {
                    navigate("/service-tracking", {
                      state: {
                        guestEmail: lastGuest.email,
                        guestPhone: lastGuest.phone,
                        appointmentId: lastGuest.appointmentId,
                      },
                    });
                  } else if (user) {
                    navigate("/history");
                  } else {
                    navigate("/service-tracking");
                  }
                }}
                className="nav-link"
              >
                Theo dõi đơn
              </Nav.Link>
              {user &&
                (user.role.toLowerCase() === "staff" ||
                  user.role.toLowerCase() === "manager") && (
                  <Nav.Link href="/receive-booking" className="nav-link">
                    Quản lý đơn
                  </Nav.Link>
                )}
              {user &&
                ["manager", "staff", "customer"].includes(
                  user.role.toLowerCase()
                ) && (
                  <Nav.Link href="/login-history" className="nav-link">
                    Lịch Sử Người Dùng
                  </Nav.Link>
                )}
              {user && user.role.toLowerCase() === "customer" && (
                <Nav.Link href="/payment" className="nav-link">
                  Thanh toán
                </Nav.Link>
              )}
              {user && user.role && user.role.toLowerCase() === "manager" && (
                <Nav.Link
                  onClick={() => navigate("/service-management")}
                  className="nav-link"
                >
                  Quản lý dịch vụ
                </Nav.Link>
              )}
              {user && user.role && user.role.toLowerCase() === "manager" && (
                <Nav.Link
                  onClick={() => navigate("/account-management")}
                  className="nav-link"
                >
                  Quản lý tài khoản
                </Nav.Link>
              )}
            </Nav>
            <Form className="d-flex align-items-center" style={{ gap: "8px" }}>
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
                style={{ margin: "0 8px" }}
                onClick={() => navigate("/feedback")}
              >
                Feedback
              </Button>
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
                        src={
                          user.avatar ||
                          "https://ui-avatars.com/api/?name=" +
                            encodeURIComponent(user.name)
                        }
                        alt="avatar"
                        className="user-avatar"
                      />
                      <div className="user-info">
                        <div className="user-name">{user.name}</div>
                        <div className="user-username">{user.username}</div>
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
                <div style={{ display: "flex", gap: "8px" }}>
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
            </Form>
            <div className="theme-toggle-wrapper" style={{ zIndex: 1 }}>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                <span
                  className={`theme-icon ${theme === "dark" ? "sun" : "moon"}`}
                >
                  {theme === "dark" ? "☀️" : "🌙"}
                </span>
                {theme === "dark" ? "Light" : "Dark"}
              </button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </>
  );
}

export default MyNavbar;
