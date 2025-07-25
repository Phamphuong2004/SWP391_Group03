import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

// Mock CSS import
vi.mock("./ServiceManagement.css", () => ({}));

// Mock axios
vi.mock("axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

import axios from "axios";
import ServiceManagement from "./ServiceManagement";

// Mock localStorage
const mockLocalStorage = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value.toString();
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock window.confirm
window.confirm = vi.fn();

const mockServices = [
  {
    serviceId: 1,
    service_id: 1,
    service_name: "ADN Testing",
    description: "DNA analysis service",
    price: 1000000,
    service_type: "ADN",
  },
  {
    serviceId: 2,
    service_id: 2,
    service_name: "Blood Test",
    description: "Complete blood count",
    price: 500000,
    service_type: "Medical",
  },
];

const mockUser = {
  token: "mock-token",
  user_id: 1,
  role: "admin",
};

describe("ServiceManagement Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
    axios.get.mockResolvedValue({ data: mockServices });
  });

  it("renders the component title", async () => {
    render(<ServiceManagement />);
    expect(screen.getByText("Quản lý Dịch vụ")).toBeInTheDocument();
  });

  it("loads and displays services on mount", async () => {
    render(<ServiceManagement />);

    await waitFor(() => {
      expect(screen.getByText("ADN Testing")).toBeInTheDocument();
      expect(screen.getByText("Blood Test")).toBeInTheDocument();
    });

    expect(axios.get).toHaveBeenCalledWith("/api/services/view-all-service", {
      headers: { Authorization: "Bearer mock-token" },
    });
  });

  it("shows loading state while fetching services", () => {
    render(<ServiceManagement />);
    expect(screen.getByText("Đang tải...")).toBeInTheDocument();
  });

  it("handles error when loading services fails", async () => {
    axios.get.mockRejectedValue(new Error("API Error"));
    render(<ServiceManagement />);

    await waitFor(() => {
      expect(
        screen.getByText("Không thể tải danh sách dịch vụ.")
      ).toBeInTheDocument();
    });
  });

  it("opens add service modal when clicking add button", async () => {
    const user = userEvent.setup();
    render(<ServiceManagement />);

    await waitFor(() => {
      expect(screen.getByText("ADN Testing")).toBeInTheDocument();
    });

    const addButton = screen.getByText("+ Thêm dịch vụ");
    await user.click(addButton);

    expect(screen.getByText("Thêm dịch vụ")).toBeInTheDocument();
  });

  it("handles search functionality", async () => {
    const user = userEvent.setup();
    const searchMockData = [mockServices[0]];
    axios.get.mockResolvedValueOnce({ data: mockServices });
    axios.get.mockResolvedValueOnce({ data: searchMockData });

    render(<ServiceManagement />);

    await waitFor(() => {
      expect(screen.getByText("ADN Testing")).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(
      "Tìm kiếm theo tên dịch vụ..."
    );
    const searchButton = screen.getByText("Tìm kiếm");

    await user.type(searchInput, "ADN");
    await user.click(searchButton);

    await waitFor(() => {
      expect(axios.get).toHaveBeenCalledWith(
        "/api/services/search-by-name?name=ADN",
        { headers: { Authorization: "Bearer mock-token" } }
      );
    });
  });

  it("handles delete with confirmation", async () => {
    const user = userEvent.setup();
    window.confirm.mockReturnValue(true);
    axios.delete.mockResolvedValue({ data: { success: true } });

    render(<ServiceManagement />);

    await waitFor(() => {
      expect(screen.getByText("ADN Testing")).toBeInTheDocument();
    });

    const deleteButtons = screen.getAllByText("Xóa");
    await user.click(deleteButtons[0]);

    expect(window.confirm).toHaveBeenCalledWith(
      "Bạn có chắc chắn muốn xóa dịch vụ này?"
    );

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalled();
    });
  });

  it("shows modal correctly when opened", async () => {
    const user = userEvent.setup();
    render(<ServiceManagement />);

    await waitFor(() => {
      expect(screen.getByText("ADN Testing")).toBeInTheDocument();
    });

    // Open add modal
    const addButton = screen.getByText("+ Thêm dịch vụ");
    await user.click(addButton);

    // Check modal elements are present
    await waitFor(() => {
      expect(screen.getByText("Thêm dịch vụ")).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Lưu" })).toBeInTheDocument();
      expect(screen.getByRole("button", { name: "Hủy" })).toBeInTheDocument();
    });
  });

  it("handles empty services list", async () => {
    axios.get.mockResolvedValue({ data: [] });
    render(<ServiceManagement />);

    await waitFor(() => {
      expect(screen.getByText("Không có dịch vụ nào.")).toBeInTheDocument();
    });
  });
});
