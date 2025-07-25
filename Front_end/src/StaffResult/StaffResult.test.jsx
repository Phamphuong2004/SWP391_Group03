import React from "react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { message } from "antd";
import StaffResult from "./StaffResult";
import {
  getResultList,
  createResult,
  updateResult,
  deleteResult,
  getResultById,
} from "../result/ResultsApi";

// Mock dependencies
vi.mock("../result/ResultsApi", () => ({
  getResultList: vi.fn(),
  createResult: vi.fn(),
  updateResult: vi.fn(),
  deleteResult: vi.fn(),
  getResultById: vi.fn(),
}));

vi.mock("antd", async () => {
  const actual = await vi.importActual("antd");
  return {
    ...actual,
    message: {
      error: vi.fn(),
      success: vi.fn(),
    },
  };
});

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: mockLocalStorage,
});

// Mock fetch for filter functionality
global.fetch = vi.fn();

describe("StaffResult Component", () => {
  const mockUser = {
    username: "testuser",
    token: "mock-token",
  };

  const mockResultData = [
    {
      resultId: 1,
      resultDate: "2024-01-15",
      resultData: "Test Result 1",
      interpretation: "Normal",
      status: "Completed",
      sampleId: [1, 2],
      username: "testuser",
      appointmentId: 123,
      resultFile: "result1.pdf",
    },
    {
      resultId: 2,
      resultDate: "2024-01-16",
      resultData: "Test Result 2",
      interpretation: "Abnormal",
      status: "Pending",
      sampleId: [3],
      username: "testuser2",
      appointmentId: 124,
      resultFile: "result2.pdf",
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    mockLocalStorage.getItem.mockReturnValue(JSON.stringify(mockUser));
    getResultList.mockResolvedValue({ data: mockResultData });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("renders component and loads results on mount", async () => {
    render(<StaffResult />);

    expect(screen.getByText("Quản lý kết quả xét nghiệm")).toBeInTheDocument();
    expect(screen.getByText("Thêm kết quả")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Lọc theo mã lịch hẹn")
    ).toBeInTheDocument();

    // Wait for data to load
    await waitFor(() => {
      expect(getResultList).toHaveBeenCalledWith("mock-token");
    });

    // Check if table data is rendered
    await waitFor(() => {
      expect(screen.getByText("Test Result 1")).toBeInTheDocument();
      expect(screen.getByText("Test Result 2")).toBeInTheDocument();
    });
  });

  it("handles error when fetching results", async () => {
    getResultList.mockRejectedValue(new Error("API Error"));

    render(<StaffResult />);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith(
        "Không thể tải danh sách kết quả"
      );
    });
  });

  it("opens add modal when clicking add button", async () => {
    render(<StaffResult />);

    const addButton = screen.getByText("Thêm kết quả");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Thêm kết quả mới")).toBeInTheDocument();
      expect(screen.getByLabelText("Ngày trả kết quả")).toBeInTheDocument();
      expect(screen.getByLabelText("Kết quả xét nghiệm")).toBeInTheDocument();
    });
  });

  it("opens edit modal when clicking edit button", async () => {
    render(<StaffResult />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test Result 1")).toBeInTheDocument();
    });

    const editButtons = screen.getAllByText("Sửa");
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Cập nhật kết quả")).toBeInTheDocument();
    });
  });

  it("creates new result successfully", async () => {
    createResult.mockResolvedValue({ data: { resultId: 3 } });
    const user = userEvent.setup();

    render(<StaffResult />);

    // Open add modal
    const addButton = screen.getByText("Thêm kết quả");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Thêm kết quả mới")).toBeInTheDocument();
    });

    // Fill form fields
    await user.type(
      screen.getByLabelText("Kết quả xét nghiệm"),
      "New Test Result"
    );
    await user.type(screen.getByLabelText("Nhận định"), "New Interpretation");
    await user.type(screen.getByLabelText("Trạng thái"), "New Status");
    await user.type(screen.getByLabelText("Người nhập"), "testuser");
    await user.type(screen.getByLabelText("Mã lịch hẹn"), "125");

    // Set date
    const dateInput = screen.getByLabelText("Ngày trả kết quả");
    fireEvent.change(dateInput, { target: { value: "2024-01-17" } });

    // Select samples
    const sampleSelect = screen.getByLabelText("ID mẫu");
    fireEvent.mouseDown(sampleSelect);
    await waitFor(() => {
      const option = screen.getByText("Mẫu 1");
      fireEvent.click(option);
    });

    // Mock file upload - find by type since the label association is not proper
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const saveButton = screen.getByText("Lưu");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(createResult).toHaveBeenCalled();
      expect(message.success).toHaveBeenCalledWith("Thêm kết quả thành công");
    });
  });

  it("updates existing result successfully", async () => {
    updateResult.mockResolvedValue({ data: { resultId: 1 } });

    render(<StaffResult />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test Result 1")).toBeInTheDocument();
    });

    // Click edit button
    const editButtons = screen.getAllByText("Sửa");
    fireEvent.click(editButtons[0]);

    await waitFor(() => {
      expect(screen.getByText("Cập nhật kết quả")).toBeInTheDocument();
    });

    // Update a field
    const interpretationInput = screen.getByDisplayValue("Normal");
    fireEvent.change(interpretationInput, {
      target: { value: "Updated Interpretation" },
    });

    // Submit form
    const saveButton = screen.getByText("Lưu");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(updateResult).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          interpretation: "Updated Interpretation",
        }),
        "mock-token"
      );
      expect(message.success).toHaveBeenCalledWith(
        "Cập nhật kết quả thành công"
      );
    });
  });

  it("deletes result successfully", async () => {
    deleteResult.mockResolvedValue({});

    render(<StaffResult />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test Result 1")).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText("Xóa");
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    await waitFor(() => {
      const confirmButton = screen.getByText("OK");
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(deleteResult).toHaveBeenCalledWith(1, "mock-token");
      expect(message.success).toHaveBeenCalledWith("Xóa kết quả thành công");
    });
  });

  it("handles delete error", async () => {
    deleteResult.mockRejectedValue(new Error("Delete error"));

    render(<StaffResult />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test Result 1")).toBeInTheDocument();
    });

    // Click delete button
    const deleteButtons = screen.getAllByText("Xóa");
    fireEvent.click(deleteButtons[0]);

    // Confirm deletion
    await waitFor(() => {
      const confirmButton = screen.getByText("OK");
      fireEvent.click(confirmButton);
    });

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Không thể xóa kết quả");
    });
  });

  it("views result detail successfully", async () => {
    const mockDetailData = {
      resultId: 1,
      resultDate: "2024-01-15",
      resultData: "Detailed Test Result",
      interpretation: "Detailed Normal",
      status: "Completed",
    };
    getResultById.mockResolvedValue({ data: mockDetailData });

    render(<StaffResult />);

    // Wait for data to load
    await waitFor(() => {
      expect(screen.getByText("Test Result 1")).toBeInTheDocument();
    });

    // Click view detail button
    const detailButtons = screen.getAllByText("Xem chi tiết");
    fireEvent.click(detailButtons[0]);

    await waitFor(() => {
      expect(getResultById).toHaveBeenCalledWith(1, "mock-token");
      expect(screen.getByText("Chi tiết kết quả")).toBeInTheDocument();
    });
  });

  it("filters results by appointment ID", async () => {
    const mockFilteredData = [mockResultData[0]];
    fetch.mockResolvedValue({
      json: () => Promise.resolve(mockFilteredData),
    });

    render(<StaffResult />);

    // Enter filter value
    const filterInput = screen.getByPlaceholderText("Lọc theo mã lịch hẹn");
    fireEvent.change(filterInput, { target: { value: "123" } });

    // Click filter button
    const filterButton = screen.getByText("Lọc");
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("/api/results/appointment/123", {
        headers: { Authorization: "Bearer mock-token" },
      });
    });
  });

  it("handles invalid appointment ID filter", async () => {
    render(<StaffResult />);

    // Enter invalid filter value
    const filterInput = screen.getByPlaceholderText("Lọc theo mã lịch hẹn");
    fireEvent.change(filterInput, { target: { value: "abc" } });

    // Click filter button
    const filterButton = screen.getByText("Lọc");
    fireEvent.click(filterButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Mã lịch hẹn phải là số!");
    });
  });

  it("clears filter and reloads all results", async () => {
    render(<StaffResult />);

    // Enter filter value
    const filterInput = screen.getByPlaceholderText("Lọc theo mã lịch hẹn");
    fireEvent.change(filterInput, { target: { value: "123" } });

    // Click clear filter button
    const clearButton = screen.getByText("Bỏ lọc");
    fireEvent.click(clearButton);

    expect(filterInput.value).toBe("");
    await waitFor(() => {
      expect(getResultList).toHaveBeenCalled();
    });
  });

  it("handles file upload correctly", async () => {
    render(<StaffResult />);

    // Open add modal
    const addButton = screen.getByText("Thêm kết quả");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Thêm kết quả mới")).toBeInTheDocument();
    });

    // Upload file - find by type since the label association is not proper
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["test content"], "test.pdf", {
      type: "application/pdf",
    });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // The file name should be set in the form
    await waitFor(() => {
      expect(fileInput.files[0]).toBe(file);
      expect(fileInput.files[0].name).toBe("test.pdf");
    });
  });

  it("validates required fields in form", async () => {
    render(<StaffResult />);

    // Open add modal
    const addButton = screen.getByText("Thêm kết quả");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Thêm kết quả mới")).toBeInTheDocument();
    });

    // Try to submit without filling required fields
    const saveButton = screen.getByText("Lưu");
    fireEvent.click(saveButton);

    // Form validation should prevent submission
    await waitFor(() => {
      expect(createResult).not.toHaveBeenCalled();
    });
  });

  it("handles form submission error", async () => {
    createResult.mockRejectedValue(new Error("Submit error"));

    render(<StaffResult />);

    // Open add modal and fill required fields
    const addButton = screen.getByText("Thêm kết quả");
    fireEvent.click(addButton);

    await waitFor(() => {
      expect(screen.getByText("Thêm kết quả mới")).toBeInTheDocument();
    });

    // Fill minimum required fields
    fireEvent.change(screen.getByLabelText("Ngày trả kết quả"), {
      target: { value: "2024-01-17" },
    });
    fireEvent.change(screen.getByLabelText("Kết quả xét nghiệm"), {
      target: { value: "Test" },
    });
    fireEvent.change(screen.getByLabelText("Nhận định"), {
      target: { value: "Test interpretation" },
    });
    fireEvent.change(screen.getByLabelText("Trạng thái"), {
      target: { value: "Test status" },
    });
    fireEvent.change(screen.getByLabelText("Người nhập"), {
      target: { value: "testuser" },
    });
    fireEvent.change(screen.getByLabelText("Mã lịch hẹn"), {
      target: { value: "125" },
    });

    // Mock file upload - find by type since the label association is not proper
    const fileInput = document.querySelector('input[type="file"]');
    const file = new File(["test"], "test.pdf", { type: "application/pdf" });
    fireEvent.change(fileInput, { target: { files: [file] } });

    // Submit form
    const saveButton = screen.getByText("Lưu");
    fireEvent.click(saveButton);

    await waitFor(() => {
      expect(message.error).toHaveBeenCalledWith("Lưu kết quả thất bại");
    });
  });
});
