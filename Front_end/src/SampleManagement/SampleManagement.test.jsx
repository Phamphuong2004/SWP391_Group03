import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SampleManagement from "./SampleManagement";

// Hoisted mock objects - định nghĩa trước khi vi.mock()
const mockAntdComponents = vi.hoisted(() => ({
  mockTable: vi.fn(({ dataSource, columns }) => (
    <div data-testid="mock-table">
      {dataSource?.map((item, index) => (
        <div key={index} data-testid={`table-row-${index}`}>
          {columns.map((col, colIndex) => (
            <span key={colIndex} data-testid={`cell-${index}-${colIndex}`}>
              {typeof col.render === "function"
                ? col.render(item[col.dataIndex], item)
                : item[col.dataIndex]}
            </span>
          ))}
        </div>
      ))}
    </div>
  )),
  mockModal: vi.fn(({ children, open, onCancel, onOk, title }) =>
    open ? (
      <div data-testid="mock-modal">
        <div data-testid="modal-title">{title}</div>
        <div data-testid="modal-content">{children}</div>
        <button data-testid="modal-cancel" onClick={onCancel}>
          Cancel
        </button>
        <button data-testid="modal-ok" onClick={onOk}>
          OK
        </button>
      </div>
    ) : null
  ),
  mockForm: vi.fn(({ children, form, onFinish }) => (
    <form
      data-testid="mock-form"
      onSubmit={(e) => {
        e.preventDefault();
        onFinish?.();
      }}
    >
      {children}
    </form>
  )),
  mockUseForm: vi.fn(() => [
    {
      validateFields: vi.fn().mockResolvedValue({}),
      setFieldsValue: vi.fn(),
      resetFields: vi.fn(),
      getFieldsValue: vi.fn().mockReturnValue({}),
    },
  ]),
  mockFormItem: vi.fn(({ children, name, label }) => (
    <div data-testid={`form-item-${name}`}>
      <label>{label}</label>
      {children}
    </div>
  )),
  mockInput: vi.fn((props) => (
    <input
      data-testid={`input-${props.placeholder || "default"}`}
      placeholder={props.placeholder}
      value={props.value}
      onChange={props.onChange}
    />
  )),
  mockButton: vi.fn(({ children, onClick, type, ...props }) => (
    <button
      data-testid={`button-${
        children?.toString().toLowerCase().replace(/\s+/g, "-") || "default"
      }`}
      onClick={onClick}
      type={type}
      {...props}
    >
      {children}
    </button>
  )),
  mockMessage: {
    success: vi.fn(),
    error: vi.fn(),
    warning: vi.fn(),
    info: vi.fn(),
  },
}));

// Mock Ant Design components
vi.mock("antd", () => ({
  Table: mockAntdComponents.mockTable,
  Modal: mockAntdComponents.mockModal,
  Form: Object.assign(mockAntdComponents.mockForm, {
    useForm: mockAntdComponents.mockUseForm,
    Item: mockAntdComponents.mockFormItem,
  }),
  Input: mockAntdComponents.mockInput,
  Button: mockAntdComponents.mockButton,
  message: mockAntdComponents.mockMessage,
}));

// Mock API
const mockApi = vi.hoisted(() => ({
  getSampleByAppointmentId: vi.fn(),
  createSampleByAppointmentId: vi.fn(),
  updateSample: vi.fn(),
  deleteSample: vi.fn(),
}));

vi.mock("../SampleManagement/SampleApi", () => mockApi);

// Mock localStorage
const mockLocalStorage = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}));

Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

describe("SampleManagement", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "role") return "Staff";
      if (key === "token") return "mock-token";
      return null;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(<SampleManagement />);
    expect(screen.getByTestId("mock-table")).toBeInTheDocument();
  });

  it("renders search input and search button", () => {
    render(<SampleManagement />);
    expect(
      screen.getByTestId("input-Nhập mã lịch hẹn (appointmentId)")
    ).toBeInTheDocument();
    expect(screen.getByTestId("button-tìm-kiếm")).toBeInTheDocument();
  });

  it("shows Add Sample button for Staff role", () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });

    render(<SampleManagement />);
    expect(screen.getByTestId("button-thêm-mẫu")).toBeInTheDocument();
  });

  it("hides Add Sample button for Customer role", () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Customer", token: "mock-token" });
      return null;
    });

    render(<SampleManagement />);
    expect(screen.queryByTestId("button-thêm-mẫu")).not.toBeInTheDocument();
  });

  it("calls API when search button is clicked", async () => {
    const mockSamples = [
      {
        sampleId: 1,
        appointmentId: 123,
        sampleCode: "S001",
        status: "Pending",
      },
    ];
    mockApi.getSampleByAppointmentId.mockResolvedValue(mockSamples);

    render(<SampleManagement />);

    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    const searchButton = screen.getByTestId("button-tìm-kiếm");

    await user.type(searchInput, "123");
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockApi.getSampleByAppointmentId).toHaveBeenCalledWith(
        "123",
        undefined
      );
    });
  });

  it("displays samples in table after successful search", async () => {
    const mockSamples = [
      {
        sampleId: 1,
        appointmentId: 123,
        sampleCode: "S001",
        status: "Pending",
      },
    ];
    mockApi.getSampleByAppointmentId.mockResolvedValue(mockSamples);

    render(<SampleManagement />);

    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    const searchButton = screen.getByTestId("button-tìm-kiếm");

    await user.type(searchInput, "123");
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
    });
  });

  it("shows error message when search fails", async () => {
    mockApi.getSampleByAppointmentId.mockRejectedValue(new Error("API Error"));

    render(<SampleManagement />);

    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    const searchButton = screen.getByTestId("button-tìm-kiếm");

    await user.type(searchInput, "123");
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockAntdComponents.mockMessage.error).toHaveBeenCalledWith(
        "Không thể tải danh sách mẫu"
      );
    });
  });

  it("opens add modal when Add Sample button is clicked", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });

    render(<SampleManagement />);

    const addButton = screen.getByTestId("button-thêm-mẫu");
    await user.click(addButton);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Thêm mẫu mới");
  });

  it("opens edit modal when edit button is clicked", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });
    const mockSamples = [
      {
        sampleId: 1,
        appointmentId: 123,
        sampleCode: "S001",
        status: "Pending",
      },
    ];
    mockApi.getSampleByAppointmentId.mockResolvedValue(mockSamples);

    render(<SampleManagement />);

    // First search to populate table
    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    const searchButton = screen.getByTestId("button-tìm-kiếm");
    await user.type(searchInput, "123");
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
    });

    // Click on edit button in actions column (will be rendered by mock)
    const editButton = screen.getByTestId("button-sửa");
    await user.click(editButton);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();
    expect(screen.getByTestId("modal-title")).toHaveTextContent("Cập nhật mẫu");
  });

  it("creates sample successfully", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });
    mockApi.createSampleByAppointmentId.mockResolvedValue({
      data: { success: true },
    });
    mockApi.getSampleByAppointmentId.mockResolvedValue([]);

    render(<SampleManagement />);

    // Open add modal
    const addButton = screen.getByTestId("button-thêm-mẫu");
    await user.click(addButton);

    // Click OK to create
    const okButton = screen.getByTestId("modal-ok");
    await user.click(okButton);

    await waitFor(() => {
      expect(mockApi.createSampleByAppointmentId).toHaveBeenCalled();
      expect(mockAntdComponents.mockMessage.success).toHaveBeenCalledWith(
        "Thêm mẫu thành công"
      );
    });
  });

  it("handles create sample error", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });
    mockApi.createSampleByAppointmentId.mockRejectedValue(
      new Error("Create failed")
    );

    render(<SampleManagement />);

    // Open add modal
    const addButton = screen.getByTestId("button-thêm-mẫu");
    await user.click(addButton);

    // Click OK to create
    const okButton = screen.getByTestId("modal-ok");
    await user.click(okButton);

    await waitFor(() => {
      expect(mockAntdComponents.mockMessage.error).toHaveBeenCalledWith(
        "Create failed"
      );
    });
  });

  it("updates sample successfully", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });
    const mockSamples = [
      {
        sampleId: 1,
        appointmentId: 123,
        sampleCode: "S001",
        status: "Pending",
      },
    ];
    mockApi.getSampleByAppointmentId.mockResolvedValue(mockSamples);
    mockApi.updateSample.mockResolvedValue({ data: { success: true } });

    render(<SampleManagement />);

    // Search and populate table
    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    const searchButton = screen.getByTestId("button-tìm-kiếm");
    await user.type(searchInput, "123");
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
    });

    // Click edit button to edit
    const editButton = screen.getByTestId("button-sửa");
    await user.click(editButton);

    // Click OK to update
    const okButton = screen.getByTestId("modal-ok");
    await user.click(okButton);

    await waitFor(() => {
      expect(mockApi.updateSample).toHaveBeenCalled();
      expect(mockAntdComponents.mockMessage.success).toHaveBeenCalledWith(
        "Cập nhật mẫu thành công"
      );
    });
  });

  it("handles update sample error", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });
    const mockSamples = [
      {
        sampleId: 1,
        appointmentId: 123,
        sampleCode: "S001",
        status: "Pending",
      },
    ];
    mockApi.getSampleByAppointmentId.mockResolvedValue(mockSamples);
    mockApi.updateSample.mockRejectedValue(new Error("Update failed"));

    render(<SampleManagement />);

    // Search and populate table
    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    const searchButton = screen.getByTestId("button-tìm-kiếm");
    await user.type(searchInput, "123");
    await user.click(searchButton);

    await waitFor(() => {
      expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
    });

    // Click edit button to edit
    const editButton = screen.getByTestId("button-sửa");
    await user.click(editButton);

    // Click OK to update
    const okButton = screen.getByTestId("modal-ok");
    await user.click(okButton);

    await waitFor(() => {
      expect(mockAntdComponents.mockMessage.error).toHaveBeenCalledWith(
        "Update failed"
      );
    });
  });

  it("closes modal when cancel is clicked", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });

    render(<SampleManagement />);

    // Open add modal
    const addButton = screen.getByTestId("button-thêm-mẫu");
    await user.click(addButton);

    expect(screen.getByTestId("mock-modal")).toBeInTheDocument();

    // Cancel modal
    const cancelButton = screen.getByTestId("modal-cancel");
    await user.click(cancelButton);

    await waitFor(() => {
      expect(screen.queryByTestId("mock-modal")).not.toBeInTheDocument();
    });
  });

  it("requires appointment ID for search", async () => {
    render(<SampleManagement />);

    const searchButton = screen.getByTestId("button-tìm-kiếm");
    await user.click(searchButton);

    expect(mockAntdComponents.mockMessage.warning).toHaveBeenCalledWith(
      "Nhập mã lịch hẹn để tìm kiếm"
    );
  });

  it("handles empty search results", async () => {
    mockApi.getSampleByAppointmentId.mockResolvedValue([]);

    render(<SampleManagement />);

    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    const searchButton = screen.getByTestId("button-tìm-kiếm");

    await user.type(searchInput, "999");
    await user.click(searchButton);

    await waitFor(() => {
      expect(mockApi.getSampleByAppointmentId).toHaveBeenCalledWith(
        "999",
        undefined
      );
    });

    // Table should be empty
    expect(screen.queryByTestId("table-row-0")).not.toBeInTheDocument();
  });

  it("shows different buttons based on user role", () => {
    // Test Manager role
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Manager", token: "mock-token" });
      return null;
    });

    const { rerender } = render(<SampleManagement />);
    expect(screen.getByTestId("button-thêm-mẫu")).toBeInTheDocument();

    // Test Customer role
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Customer", token: "mock-token" });
      return null;
    });

    rerender(<SampleManagement />);
    expect(screen.queryByTestId("button-thêm-mẫu")).not.toBeInTheDocument();
  });

  it("handles form validation in modal", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });

    render(<SampleManagement />);

    // Open add modal
    const addButton = screen.getByTestId("button-thêm-mẫu");
    await user.click(addButton);

    // Modal should contain form
    expect(screen.getByTestId("mock-form")).toBeInTheDocument();
  });

  it("refreshes data after successful operations", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user")
        return JSON.stringify({ role: "Staff", token: "mock-token" });
      return null;
    });
    mockApi.createSampleByAppointmentId.mockResolvedValue({
      data: { success: true },
    });
    mockApi.getSampleByAppointmentId.mockResolvedValue([]);

    render(<SampleManagement />);

    // Set search term
    const searchInput = screen.getByTestId(
      "input-Nhập mã lịch hẹn (appointmentId)"
    );
    await user.type(searchInput, "123");

    // Add sample
    const addButton = screen.getByTestId("button-thêm-mẫu");
    await user.click(addButton);

    const okButton = screen.getByTestId("modal-ok");
    await user.click(okButton);

    await waitFor(() => {
      // Should call API twice: once for create, once for refresh
      expect(mockApi.getSampleByAppointmentId).toHaveBeenCalledTimes(1);
    });
  });
});
