import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { BrowserRouter } from "react-router-dom";
import Payment from "./Payment";

// Hoisted mock objects
const mockNavigate = vi.hoisted(() => vi.fn());
const mockLocation = vi.hoisted(() => ({
  state: null,
  pathname: "/payment",
}));

const mockToast = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warn: vi.fn(),
  info: vi.fn(),
}));

const mockPaymentApi = vi.hoisted(() => ({
  createPayment: vi.fn(),
}));

const mockLocalStorage = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
}));

const mockFetch = vi.hoisted(() => vi.fn());

// Mock react-router-dom
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useLocation: () => mockLocation,
    BrowserRouter: ({ children }) => children,
  };
});

// Mock react-toastify
vi.mock("react-toastify", () => ({
  toast: mockToast,
}));

// Mock PaymentApi
vi.mock("./PaymentApi", () => mockPaymentApi);

// Mock listOfServices
vi.mock("../listOfServices", () => ({
  default: [
    {
      id: "test-service-1",
      testType: "Xét nghiệm DNA",
      price: "$150",
      description: "Xét nghiệm ADN chính xác",
    },
    {
      id: "test-service-2",
      testType: "Xét nghiệm huyết thống",
      price: "$200",
      description: "Xét nghiệm huyết thống cha-con",
    },
  ],
}));

// Mock CSS
vi.mock("./Payment.css", () => ({}));

// Mock global fetch
Object.defineProperty(window, "fetch", {
  value: mockFetch,
  writable: true,
});

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
  writable: true,
});

// Wrapper component for router
const PaymentWrapper = ({ children, initialState = null }) => {
  mockLocation.state = initialState;
  return <BrowserRouter>{children}</BrowserRouter>;
};

describe("Payment", () => {
  const user = userEvent.setup();

  const mockAppointment = {
    appointmentId: 1,
    fullName: "Nguyễn Văn A",
    appointmentDate: "2024-12-25",
    collectionSampleTime: "2024-12-25T09:00:00.000Z",
    serviceType: "Xét nghiệm DNA",
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "user") return JSON.stringify({ token: "mock-token" });
      if (key === "lastServiceId") return "1";
      return null;
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders without crashing", () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );
    expect(screen.getByText("Xác nhận và Thanh toán")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    mockFetch.mockImplementation(() => new Promise(() => {})); // Never resolves
    mockLocation.state = null;

    render(
      <PaymentWrapper>
        <Payment />
      </PaymentWrapper>
    );

    expect(
      screen.getByText("Đang tải thông tin lịch hẹn...")
    ).toBeInTheDocument();
  });

  it("shows no appointment message when no appointment data", () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocation.state = null;

    render(
      <PaymentWrapper>
        <Payment />
      </PaymentWrapper>
    );

    expect(
      screen.getByText("Không tìm thấy thông tin lịch hẹn")
    ).toBeInTheDocument();
    expect(screen.getByText("Đặt lịch ngay")).toBeInTheDocument();
  });

  it('navigates to booking when "Đặt lịch ngay" is clicked', async () => {
    mockLocalStorage.getItem.mockReturnValue(null);
    mockLocation.state = null;

    render(
      <PaymentWrapper>
        <Payment />
      </PaymentWrapper>
    );

    const bookingButton = screen.getByText("Đặt lịch ngay");
    await user.click(bookingButton);

    expect(mockNavigate).toHaveBeenCalledWith("/booking");
  });

  it("displays appointment details from state", () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    expect(screen.getByDisplayValue("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByDisplayValue("2024-12-25")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Xét nghiệm DNA")).toBeInTheDocument();
  });

  it("fetches appointment data from API when not in state", async () => {
    const mockData = {
      fullName: "Trần Thị B",
      appointmentDate: "2024-12-26",
      collectionSampleTime: "2024-12-26T10:00:00.000Z",
      serviceType: "Xét nghiệm huyết thống",
    };

    mockFetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    mockLocation.state = null;

    render(
      <PaymentWrapper>
        <Payment />
      </PaymentWrapper>
    );

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/view-appointment/1");
    });

    await waitFor(() => {
      expect(screen.getByDisplayValue("Trần Thị B")).toBeInTheDocument();
    });
  });

  it("handles API fetch error", async () => {
    mockFetch.mockRejectedValueOnce(new Error("API Error"));
    mockLocation.state = null;

    render(
      <PaymentWrapper>
        <Payment />
      </PaymentWrapper>
    );

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Không tìm thấy thông tin lịch hẹn"
      );
    });
  });

  it("allows editing form fields", async () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const nameInput = screen.getByDisplayValue("Nguyễn Văn A");
    await user.clear(nameInput);
    await user.type(nameInput, "Nguyễn Văn B");

    expect(screen.getByDisplayValue("Nguyễn Văn B")).toBeInTheDocument();
  });

  it("displays service details when service is found", () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    expect(screen.getByText("Chi tiết dịch vụ")).toBeInTheDocument();
    expect(screen.getByText("Xét nghiệm ADN chính xác")).toBeInTheDocument();
    expect(screen.getByText("$150")).toBeInTheDocument();
  });

  it("allows selecting payment method", async () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    const onlineRadio = screen.getByLabelText(/Thanh toán trực tuyến/i);

    await user.click(cashRadio);
    expect(cashRadio).toBeChecked();
    expect(onlineRadio).not.toBeChecked();

    await user.click(onlineRadio);
    expect(onlineRadio).toBeChecked();
    expect(cashRadio).not.toBeChecked();
  });

  it("shows QR section when online payment is selected", async () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const onlineRadio = screen.getByLabelText(/Thanh toán trực tuyến/i);
    await user.click(onlineRadio);

    expect(screen.getByText("Quét mã QR để thanh toán")).toBeInTheDocument();
    expect(
      screen.getByText(
        "Vui lòng quét mã QR bằng app ngân hàng hoặc ví điện tử để thanh toán."
      )
    ).toBeInTheDocument();
  });

  it("warns when trying to pay without selecting payment method", async () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    expect(mockToast.warn).toHaveBeenCalledWith(
      "Vui lòng chọn phương thức thanh toán."
    );
  });

  it("processes cash payment successfully", async () => {
    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(mockPaymentApi.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentId: 1,
          amount: "$150",
          paymentMethod: "CASH",
          status: "PENDING",
        }),
        "mock-token"
      );
    });

    await waitFor(() => {
      expect(mockToast.success).toHaveBeenCalledWith(
        "Thanh toán thành công! Lịch hẹn của bạn đã được xác nhận."
      );
    });
  });

  it("processes online payment successfully", async () => {
    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const onlineRadio = screen.getByLabelText(/Thanh toán trực tuyến/i);
    await user.click(onlineRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(mockPaymentApi.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentId: 1,
          amount: "$150",
          paymentMethod: "ONLINE",
          status: "PAID",
        }),
        "mock-token"
      );
    });
  });

  it("handles payment failure", async () => {
    const error = {
      response: {
        data: {
          message: "Payment failed",
        },
      },
    };
    mockPaymentApi.createPayment.mockRejectedValueOnce(error);

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Thanh toán thất bại. Payment failed"
      );
    });
  });

  it("handles payment failure without response message", async () => {
    const error = new Error("Network error");
    mockPaymentApi.createPayment.mockRejectedValueOnce(error);

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith(
        "Thanh toán thất bại. Network error"
      );
    });
  });

  it("successfully processes payment flow", async () => {
    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    // Should eventually show success page
    await waitFor(() => {
      expect(screen.getByText("Thanh toán thành công!")).toBeInTheDocument();
    });

    expect(mockPaymentApi.createPayment).toHaveBeenCalledWith(
      expect.objectContaining({
        appointmentId: 1,
        paymentMethod: "CASH",
      }),
      "mock-token"
    );
  });

  it("displays success page after successful payment", async () => {
    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText("Thanh toán thành công!")).toBeInTheDocument();
    });

    expect(screen.getByText("Thông tin lịch hẹn:")).toBeInTheDocument();
    expect(screen.getByText("Nguyễn Văn A")).toBeInTheDocument();
    expect(screen.getByText("Xét nghiệm DNA")).toBeInTheDocument();
  });

  it("navigates to home from success page", async () => {
    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText("Quay lại trang chủ")).toBeInTheDocument();
    });

    const homeButton = screen.getByText("Quay lại trang chủ");
    await user.click(homeButton);

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });

  it("navigates to service tracking from success page", async () => {
    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(screen.getByText("Theo dõi đơn")).toBeInTheDocument();
    });

    const trackingButton = screen.getByText("Theo dõi đơn");
    await user.click(trackingButton);

    expect(mockNavigate).toHaveBeenCalledWith("/service-tracking");
  });

  it("handles getTime utility function correctly", () => {
    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    // Collection time should be displayed as full ISO string since getTime function shows substring
    const timeInput = screen.getByDisplayValue("2024-12-25T09:00:00.000Z");
    expect(timeInput).toBeInTheDocument();
  });

  it("handles missing service details gracefully", () => {
    const appointmentWithUnknownService = {
      ...mockAppointment,
      serviceType: "Unknown Service",
    };

    render(
      <PaymentWrapper
        initialState={{ appointment: appointmentWithUnknownService }}
      >
        <Payment />
      </PaymentWrapper>
    );

    // Should not crash and should not show service details section
    expect(screen.queryByText("Chi tiết dịch vụ")).not.toBeInTheDocument();
    expect(screen.getByText("Xác nhận và Thanh toán")).toBeInTheDocument();
  });

  it("handles payment without token", async () => {
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "lastServiceId") return "1";
      return null; // No user token
    });

    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper initialState={{ appointment: mockAppointment }}>
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(mockPaymentApi.createPayment).toHaveBeenCalledWith(
        expect.any(Object),
        null // Should pass null token
      );
    });
  });

  it("uses default amount when service price is not available", async () => {
    // Clear mock to ensure no user token
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === "lastServiceId") return "1";
      return null; // No user token
    });

    const appointmentWithUnknownService = {
      ...mockAppointment,
      serviceType: "Unknown Service",
    };

    mockPaymentApi.createPayment.mockResolvedValueOnce({ success: true });

    render(
      <PaymentWrapper
        initialState={{ appointment: appointmentWithUnknownService }}
      >
        <Payment />
      </PaymentWrapper>
    );

    const cashRadio = screen.getByLabelText(/Thanh toán khi đến lấy mẫu/i);
    await user.click(cashRadio);

    const payButton = screen.getByText("Xác nhận & Thanh toán");
    await user.click(payButton);

    await waitFor(() => {
      expect(mockPaymentApi.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          amount: 1, // Default amount
        }),
        null // Should pass null token
      );
    });
  });
});
