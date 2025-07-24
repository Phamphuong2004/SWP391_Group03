import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Booking from "./Booking";

// Mock dependencies
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
  useLocation: () => ({ state: null }),
}));
vi.mock("axios", () => ({
  default: { post: vi.fn() },
}));
vi.mock("react-toastify", () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));
vi.mock("../Provinces", () => ({
  default: [
    { name: "Hà Nội", districts: ["Ba Đình", "Hoàn Kiếm"] },
    { name: "Hồ Chí Minh", districts: ["Quận 1", "Quận 2"] },
  ],
}));
vi.mock("../serviceTypes", () => ({
  default: [
    {
      service_id: 1,
      service_name: "Test Service",
      description: "Test Description",
      kits: [{ kitComponentName: "Kit1", introduction: "Intro1" }],
    },
  ],
}));

describe("Booking Component", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it("renders basic form fields", () => {
    render(<Booking />);
    expect(screen.getByText(/Họ và tên/i)).toBeInTheDocument();
    expect(screen.getByText(/Email/i)).toBeInTheDocument();
    expect(screen.getByText(/Số điện thoại/i)).toBeInTheDocument();
    expect(screen.getByText(/Loại dịch vụ/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    render(<Booking />);
    fireEvent.click(screen.getByRole("button", { name: /đặt lịch hẹn/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/Họ và tên không được để trống/i)
      ).toBeInTheDocument();
    });
  });

  it("can fill basic form fields", () => {
    render(<Booking />);

    // Fill name
    fireEvent.change(screen.getByPlaceholderText(/Nhập họ và tên/i), {
      target: { value: "Nguyen Van A" },
    });

    // Fill phone
    fireEvent.change(screen.getByPlaceholderText(/Nhập số điện thoại/i), {
      target: { value: "0912345678" },
    });

    // Fill email
    fireEvent.change(screen.getByPlaceholderText(/Nhập email/i), {
      target: { value: "test@email.com" },
    });

    expect(screen.getByDisplayValue("Nguyen Van A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("0912345678")).toBeInTheDocument();
    expect(screen.getByDisplayValue("test@email.com")).toBeInTheDocument();
  });

  it("can select province and district", () => {
    render(<Booking />);

    // Select province
    const provinceSelect = screen.getByRole("combobox", {
      name: /tỉnh\/thành phố/i,
    });
    fireEvent.change(provinceSelect, { target: { value: "Hà Nội" } });

    expect(provinceSelect.value).toBe("Hà Nội");

    // District should be enabled and have options
    const districtSelect = screen.getByRole("combobox", {
      name: /quận\/huyện/i,
    });
    expect(districtSelect).not.toBeDisabled();

    fireEvent.change(districtSelect, { target: { value: "Ba Đình" } });
    expect(districtSelect.value).toBe("Ba Đình");
  });
});
render(<Booking />);
console.log(screen.debug()); // Xem DOM thực tế
describe("Booking", () => {
  it("renders basic component", () => {
    render(<Booking />);
    console.log(screen.debug());
    // Chỉ test render được, không test gì khác
  });
});
