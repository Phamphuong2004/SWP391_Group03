import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import InvoiceList from './InvoiceList'

// Hoisted mock objects
const mockMessage = vi.hoisted(() => ({
  success: vi.fn(),
  error: vi.fn(),
  warning: vi.fn(),
  info: vi.fn()
}))

const mockPaymentApi = vi.hoisted(() => ({
  getAllPayments: vi.fn(),
  deletePayment: vi.fn(),
  getPaymentById: vi.fn(),
  createPayment: vi.fn(),
  updatePayment: vi.fn(),
  refundPaymentByAppointmentId: vi.fn(),
  setPaymentStatusRefund: vi.fn()
}))

const mockLocalStorage = vi.hoisted(() => ({
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn()
}))

const mockConfirm = vi.hoisted(() => vi.fn())

// Mock antd
vi.mock('antd', () => ({
  message: mockMessage
}))

// Mock PaymentApi
vi.mock('./PaymentApi', () => mockPaymentApi)

// Mock CSS
vi.mock('./InvoiceList.css', () => ({}))

// Mock localStorage
Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage,
  writable: true
})

// Mock window.confirm
Object.defineProperty(window, 'confirm', {
  value: mockConfirm,
  writable: true
})

describe('InvoiceList', () => {
  const user = userEvent.setup()
  
  const mockInvoices = [
    {
      paymentId: 1,
      appointmentId: 123,
      amount: 1000,
      paymentMethod: 'CASH',
      status: 'PAID',
      createdAt: '2024-12-25T10:00:00.000Z'
    },
    {
      paymentId: 2,
      appointmentId: 456,
      amount: 1500,
      paymentMethod: 'ONLINE',
      status: 'PENDING',
      createdAt: '2024-12-26T11:00:00.000Z'
    },
    {
      paymentId: 3,
      appointmentId: 789,
      amount: 2000,
      paymentMethod: 'ONLINE',
      status: 'REFUNDED',
      createdAt: '2024-12-27T12:00:00.000Z'
    }
  ]

  const mockUser = {
    token: 'mock-token',
    role: 'Manager'
  }

  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.getItem.mockImplementation((key) => {
      if (key === 'user') return JSON.stringify(mockUser)
      return null
    })
    mockPaymentApi.getAllPayments.mockResolvedValue(mockInvoices)
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('renders without crashing', () => {
    render(<InvoiceList />)
    expect(screen.getByText('Danh sách hóa đơn')).toBeInTheDocument()
  })

  it('displays loading state initially', () => {
    mockPaymentApi.getAllPayments.mockImplementation(() => new Promise(() => {}))
    
    render(<InvoiceList />)
    expect(screen.getByText('Đang tải dữ liệu...')).toBeInTheDocument()
  })

  it('fetches and displays invoices on mount', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(mockPaymentApi.getAllPayments).toHaveBeenCalledWith('mock-token')
    })
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument() // Payment ID
      expect(screen.getByText('123')).toBeInTheDocument() // Appointment ID
      expect(screen.getByText('1000')).toBeInTheDocument() // Amount
    })
  })

  it('handles authentication error', async () => {
    mockLocalStorage.getItem.mockReturnValue(null)
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith(
        expect.stringContaining('Bạn cần đăng nhập!')
      )
    })
  })

  it('handles API fetch error', async () => {
    mockPaymentApi.getAllPayments.mockRejectedValue(new Error('API Error'))
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith(
        expect.stringContaining('Không thể tải danh sách hóa đơn!')
      )
    })
  })

  it('displays "no invoices" message when list is empty', async () => {
    mockPaymentApi.getAllPayments.mockResolvedValue([])
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('Không có hóa đơn nào.')).toBeInTheDocument()
    })
  })

  it('filters invoices by status', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
      expect(screen.getByText('2')).toBeInTheDocument()
    })
    
    // Filter by PAID
    const statusFilter = screen.getByDisplayValue('Tất cả')
    await user.selectOptions(statusFilter, 'PAID')
    
    expect(screen.getByText('1')).toBeInTheDocument() // PAID invoice
    expect(screen.queryByText('2')).not.toBeInTheDocument() // PENDING invoice should be hidden
  })

  it('displays correct status labels', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      // Check for status labels in the table rows using className
      expect(screen.getByText('1')).toBeInTheDocument() // Make sure table is loaded
    })
    
    // Check status spans in the table by className
    expect(document.querySelector('.status-paid')).toBeInTheDocument()
    expect(document.querySelector('.status-pending')).toBeInTheDocument()
    expect(document.querySelector('.status-refunded')).toBeInTheDocument()
    
    // Verify text content of status spans
    expect(document.querySelector('.status-paid')?.textContent).toBe('Đã thanh toán')
    expect(document.querySelector('.status-pending')?.textContent).toBe('Chưa thanh toán')
    expect(document.querySelector('.status-refunded')?.textContent).toBe('Đã hoàn tiền')
  })

  it('opens create modal when "Thêm mới hóa đơn" is clicked', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const createButton = screen.getByRole('button', { name: 'Thêm mới hóa đơn' })
    await user.click(createButton)
    
    expect(screen.getByRole('heading', { name: 'Thêm mới hóa đơn' })).toBeInTheDocument()
    expect(screen.getByText('Tạo mới')).toBeInTheDocument()
  })

  it('handles view invoice', async () => {
    const mockInvoiceDetail = {
      paymentId: 1,
      appointmentId: 123,
      amount: 1000,
      paymentMethod: 'CASH',
      status: 'PAID',
      paymentDate: '2024-12-25T10:00:00.000Z'
    }
    mockPaymentApi.getPaymentById.mockResolvedValue(mockInvoiceDetail)
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const viewButtons = screen.getAllByText('Xem')
    await user.click(viewButtons[0])
    
    await waitFor(() => {
      expect(mockPaymentApi.getPaymentById).toHaveBeenCalledWith(1, 'mock-token')
      expect(screen.getByText('Chi tiết hóa đơn')).toBeInTheDocument()
    })
  })

  it('handles edit invoice', async () => {
    const mockInvoiceDetail = {
      paymentId: 1,
      appointmentId: 123,
      amount: 1000,
      paymentMethod: 'CASH',
      status: 'PAID',
      paymentDate: '2024-12-25T10:00:00.000Z'
    }
    mockPaymentApi.getPaymentById.mockResolvedValue(mockInvoiceDetail)
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const editButtons = screen.getAllByText('Sửa')
    await user.click(editButtons[0])
    
    await waitFor(() => {
      expect(mockPaymentApi.getPaymentById).toHaveBeenCalledWith(1, 'mock-token')
      expect(screen.getByText('Sửa hóa đơn')).toBeInTheDocument()
      expect(screen.getByText('Lưu')).toBeInTheDocument()
    })
  })

  it('handles delete invoice with confirmation', async () => {
    mockConfirm.mockReturnValue(true)
    mockPaymentApi.deletePayment.mockResolvedValue({})
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const deleteButtons = screen.getAllByText('Xóa')
    await user.click(deleteButtons[0])
    
    expect(mockConfirm).toHaveBeenCalledWith('Bạn có chắc chắn muốn xóa hóa đơn này?')
    
    await waitFor(() => {
      expect(mockPaymentApi.deletePayment).toHaveBeenCalledWith(1, 'mock-token')
      expect(mockMessage.success).toHaveBeenCalledWith('Xóa hóa đơn thành công!')
    })
  })

  it('cancels delete when user does not confirm', async () => {
    mockConfirm.mockReturnValue(false)
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const deleteButtons = screen.getAllByText('Xóa')
    await user.click(deleteButtons[0])
    
    expect(mockConfirm).toHaveBeenCalled()
    expect(mockPaymentApi.deletePayment).not.toHaveBeenCalled()
  })

  it('validates invoice data before saving', async () => {
    render(<InvoiceList />)
    
    const createButton = screen.getByText('Thêm mới hóa đơn')
    await user.click(createButton)
    
    // Try to save without filling required fields
    const saveButton = screen.getByText('Tạo mới')
    await user.click(saveButton)
    
    expect(mockMessage.error).toHaveBeenCalledWith('Mã lịch hẹn không được để trống!')
  })

  it('creates new invoice successfully', async () => {
    mockPaymentApi.createPayment.mockResolvedValue({})
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const createButton = screen.getByRole('button', { name: 'Thêm mới hóa đơn' })
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Thêm mới hóa đơn' })).toBeInTheDocument()
    })
    
    // Fill form fields using more specific selectors
    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], '999') // appointmentId
    await user.type(inputs[1], '1500') // amount
    await user.type(inputs[2], 'ONLINE') // paymentMethod
    
    const saveButton = screen.getByText('Tạo mới')
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(mockPaymentApi.createPayment).toHaveBeenCalledWith(
        expect.objectContaining({
          appointmentId: '999',
          amount: '1500',
          paymentMethod: 'ONLINE',
          status: 'PENDING'
        }),
        'mock-token'
      )
      expect(mockMessage.success).toHaveBeenCalledWith('Tạo hóa đơn thành công!')
    })
  })

  it('handles create invoice error', async () => {
    mockPaymentApi.createPayment.mockRejectedValue(new Error('Create failed'))
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const createButton = screen.getByRole('button', { name: 'Thêm mới hóa đơn' })
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Thêm mới hóa đơn' })).toBeInTheDocument()
    })
    
    // Fill required fields first
    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], '999') // appointmentId
    await user.type(inputs[1], '1500') // amount
    await user.type(inputs[2], 'ONLINE') // paymentMethod
    
    const saveButton = screen.getByText('Tạo mới')
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith(
        expect.stringContaining('Không thể tạo hóa đơn!')
      )
    })
  })

  it('updates invoice successfully', async () => {
    const mockInvoiceDetail = {
      paymentId: 1,
      appointmentId: 123,
      amount: 1000,
      paymentMethod: 'CASH',
      status: 'PAID',
      paymentDate: '2024-12-25T10:00:00.000Z'
    }
    mockPaymentApi.getPaymentById.mockResolvedValue(mockInvoiceDetail)
    mockPaymentApi.updatePayment.mockResolvedValue({})
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const editButtons = screen.getAllByText('Sửa')
    await user.click(editButtons[0])
    
    await waitFor(() => {
      expect(screen.getByText('Sửa hóa đơn')).toBeInTheDocument()
    })
    
    const saveButton = screen.getByText('Lưu')
    await user.click(saveButton)
    
    await waitFor(() => {
      expect(mockPaymentApi.updatePayment).toHaveBeenCalledWith(
        1,
        expect.objectContaining({
          paymentId: 1,
          appointmentId: 123,
          amount: 1000
        }),
        'mock-token'
      )
      expect(mockMessage.success).toHaveBeenCalledWith('Cập nhật hóa đơn thành công!')
    })
  })

  it('shows refund buttons only for PAID invoices', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('Hoàn tiền')).toBeInTheDocument() // Should exist for PAID invoice
      expect(screen.getByText('Set Refund Status')).toBeInTheDocument()
    })
    
    // Check that refund buttons are not visible for PENDING invoices
    const refundButtons = screen.getAllByText('Hoàn tiền')
    expect(refundButtons).toHaveLength(1) // Only one for the PAID invoice
  })

  it('handles refund successfully', async () => {
    mockPaymentApi.refundPaymentByAppointmentId.mockResolvedValue({})
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('Hoàn tiền')).toBeInTheDocument()
    })
    
    const refundButton = screen.getByText('Hoàn tiền')
    await user.click(refundButton)
    
    await waitFor(() => {
      expect(mockPaymentApi.refundPaymentByAppointmentId).toHaveBeenCalledWith(123, 'mock-token')
      expect(mockMessage.success).toHaveBeenCalledWith('Hoàn tiền thành công!', 6)
    })
  })

  it('handles refund with error response', async () => {
    mockPaymentApi.refundPaymentByAppointmentId.mockResolvedValue('Refund failed')
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('Hoàn tiền')).toBeInTheDocument()
    })
    
    const refundButton = screen.getByText('Hoàn tiền')
    await user.click(refundButton)
    
    await waitFor(() => {
      expect(mockMessage.error).toHaveBeenCalledWith('Refund failed')
    })
  })

  it('handles set refund status successfully', async () => {
    mockPaymentApi.setPaymentStatusRefund.mockResolvedValue('Payment status updated successfully')
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('Set Refund Status')).toBeInTheDocument()
    })
    
    const setRefundButton = screen.getByText('Set Refund Status')
    await user.click(setRefundButton)
    
    await waitFor(() => {
      expect(mockPaymentApi.setPaymentStatusRefund).toHaveBeenCalledWith(123, 'mock-token')
      expect(mockMessage.success).toHaveBeenCalledWith('Payment status updated successfully')
    })
  })

  it('closes modal when "Đóng" is clicked', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const createButton = screen.getByRole('button', { name: 'Thêm mới hóa đơn' })
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Thêm mới hóa đơn' })).toBeInTheDocument()
    })
    
    const closeButton = screen.getByText('Đóng')
    await user.click(closeButton)
    
    await waitFor(() => {
      expect(screen.queryByRole('heading', { name: 'Thêm mới hóa đơn' })).not.toBeInTheDocument()
    })
  })

  it('validates amount field correctly', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const createButton = screen.getByRole('button', { name: 'Thêm mới hóa đơn' })
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Thêm mới hóa đơn' })).toBeInTheDocument()
    })
    
    // Fill required fields with invalid amount
    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], '999') // appointmentId
    await user.type(inputs[1], '-100') // invalid amount
    await user.type(inputs[2], 'ONLINE') // paymentMethod
    
    const saveButton = screen.getByText('Tạo mới')
    await user.click(saveButton)
    
    expect(mockMessage.error).toHaveBeenCalledWith('Số tiền phải là số dương!')
  })

  it('validates payment method field correctly', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const createButton = screen.getByRole('button', { name: 'Thêm mới hóa đơn' })
    await user.click(createButton)
    
    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Thêm mới hóa đơn' })).toBeInTheDocument()
    })
    
    // Fill required fields with empty payment method
    const inputs = screen.getAllByRole('textbox')
    await user.type(inputs[0], '999') // appointmentId
    await user.type(inputs[1], '1500') // amount
    // Don't fill payment method (inputs[2])
    
    const saveButton = screen.getByText('Tạo mới')
    await user.click(saveButton)
    
    expect(mockMessage.error).toHaveBeenCalledWith('Phương thức thanh toán không được để trống!')
  })

  it('displays formatted date correctly', async () => {
    render(<InvoiceList />)
    
    await waitFor(() => {
      // Check that date is formatted and displayed
      const dateElements = screen.getAllByText(/25\/12\/2024|26\/12\/2024|27\/12\/2024/)
      expect(dateElements.length).toBeGreaterThan(0)
    })
  })

  it('handles array data correctly when API returns non-array', async () => {
    mockPaymentApi.getAllPayments.mockResolvedValue(mockInvoices[0]) // Single object instead of array
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('Không có hóa đơn nào.')).toBeInTheDocument()
    })
  })

  it('handles modal form editing', async () => {
    const mockInvoiceDetail = {
      paymentId: 1,
      appointmentId: 123,
      amount: 1000,
      paymentMethod: 'CASH',
      status: 'PAID',
      paymentDate: '2024-12-25T10:00:00.000Z'
    }
    mockPaymentApi.getPaymentById.mockResolvedValue(mockInvoiceDetail)
    
    render(<InvoiceList />)
    
    await waitFor(() => {
      expect(screen.getByText('1')).toBeInTheDocument()
    })
    
    const editButtons = screen.getAllByText('Sửa')
    await user.click(editButtons[0])
    
    await waitFor(() => {
      expect(screen.getByDisplayValue('123')).toBeInTheDocument()
      expect(screen.getByDisplayValue('1000')).toBeInTheDocument()
      expect(screen.getByDisplayValue('CASH')).toBeInTheDocument()
    })
    
    // Test editing amount
    const amountInput = screen.getByDisplayValue('1000')
    await user.clear(amountInput)
    await user.type(amountInput, '1200')
    
    expect(screen.getByDisplayValue('1200')).toBeInTheDocument()
  })
})
