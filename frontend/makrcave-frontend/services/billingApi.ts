// Billing API Service for MakrCave Frontend
// Connects frontend components with the backend billing system

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

// Transaction interfaces
export interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: 'membership' | 'credit_purchase' | 'printing_3d' | 'laser_cutting' | 'workshop' | 'materials' | 'refund';
  status: 'success' | 'pending' | 'failed' | 'cancelled' | 'refunded';
  description: string;
  gateway: 'razorpay' | 'stripe' | 'credit' | 'bank_transfer';
  gateway_transaction_id?: string;
  created_at: string;
  completed_at?: string;
  failure_reason?: string;
  metadata?: Record<string, any>;
}

// Invoice interfaces
export interface Invoice {
  id: string;
  invoice_number: string;
  title: string;
  description?: string;
  amount: number;
  total_amount: number;
  tax_amount?: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled' | 'refunded';
  issue_date: string;
  due_date?: string;
  paid_date?: string;
  customer_name: string;
  customer_email: string;
  payment_method?: string;
  transaction_id?: string;
  file_url?: string;
  metadata?: Record<string, any>;
}

// Credit Wallet interfaces
export interface CreditWallet {
  id: string;
  balance: number;
  total_earned: number;
  total_spent: number;
  conversion_rate: number;
  auto_recharge_enabled: boolean;
  auto_recharge_threshold: number;
  auto_recharge_amount: number;
}

export interface CreditTransaction {
  id: string;
  type: 'earned' | 'spent' | 'refund' | 'manual_adjustment';
  amount: number;
  description: string;
  created_at: string;
  balance_after: number;
  metadata?: Record<string, any>;
}

// Payment Method interfaces
export interface PaymentMethod {
  id: string;
  type: 'card' | 'bank_account' | 'upi';
  provider: 'razorpay' | 'stripe';
  last_four: string;
  brand?: string;
  expiry_month?: number;
  expiry_year?: number;
  holder_name: string;
  is_default: boolean;
  is_verified: boolean;
  created_at: string;
  bank_name?: string;
  account_type?: string;
  upi_id?: string;
}

// Analytics interfaces
export interface BillingAnalytics {
  revenue: {
    total: number;
    monthly: number;
    weekly: number;
    daily: number;
    growth_rate: number;
    previous_period: number;
  };
  transactions: {
    total_count: number;
    successful_count: number;
    failed_count: number;
    pending_count: number;
    success_rate: number;
    average_amount: number;
  };
  revenue_by_type: Record<string, number>;
  revenue_by_month: Array<{
    month: string;
    revenue: number;
    transactions: number;
  }>;
  top_customers: Array<{
    customer_name: string;
    customer_email: string;
    total_spent: number;
    transaction_count: number;
  }>;
  payment_methods: Record<string, number>;
}

// Request interfaces
export interface CreateTransactionRequest {
  amount: number;
  currency: string;
  type: string;
  description: string;
  gateway: string;
  metadata?: Record<string, any>;
}

export interface CreateInvoiceRequest {
  title: string;
  description?: string;
  amount: number;
  currency: string;
  customer_name: string;
  customer_email: string;
  due_date?: string;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
  }>;
  metadata?: Record<string, any>;
}

export interface UpdateCreditWalletRequest {
  auto_recharge_enabled?: boolean;
  auto_recharge_threshold?: number;
  auto_recharge_amount?: number;
}

export interface AddPaymentMethodRequest {
  type: 'card' | 'bank_account' | 'upi';
  provider: 'razorpay' | 'stripe';
  holder_name: string;
  token: string; // Payment gateway token
  is_default?: boolean;
}

// Helper function for API calls
async function apiCall<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  try {
    const token = localStorage.getItem('authToken');
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    console.error('API call failed:', error);
    return { error: error instanceof Error ? error.message : 'Unknown error occurred' };
  }
}

// Transaction API
export const transactionApi = {
  // Get all transactions with filtering
  getTransactions: async (params?: {
    status?: string;
    type?: string;
    gateway?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Transaction[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return apiCall<Transaction[]>(`/api/billing/transactions?${queryParams}`);
  },

  // Get transaction by ID
  getTransaction: async (transactionId: string): Promise<ApiResponse<Transaction>> => {
    return apiCall<Transaction>(`/api/billing/transactions/${transactionId}`);
  },

  // Create new transaction
  createTransaction: async (data: CreateTransactionRequest): Promise<ApiResponse<Transaction>> => {
    return apiCall<Transaction>('/api/billing/transactions', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Retry failed transaction
  retryTransaction: async (transactionId: string): Promise<ApiResponse<Transaction>> => {
    return apiCall<Transaction>(`/api/billing/transactions/${transactionId}/retry`, {
      method: 'POST',
    });
  },

  // Download transaction receipt
  downloadReceipt: async (transactionId: string): Promise<ApiResponse<Blob>> => {
    return apiCall<Blob>(`/api/billing/transactions/${transactionId}/receipt`);
  },
};

// Invoice API
export const invoiceApi = {
  // Get all invoices with filtering
  getInvoices: async (params?: {
    status?: string;
    start_date?: string;
    end_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<Invoice[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return apiCall<Invoice[]>(`/api/billing/invoices?${queryParams}`);
  },

  // Get invoice by ID
  getInvoice: async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    return apiCall<Invoice>(`/api/billing/invoices/${invoiceId}`);
  },

  // Create new invoice
  createInvoice: async (data: CreateInvoiceRequest): Promise<ApiResponse<Invoice>> => {
    return apiCall<Invoice>('/api/billing/invoices', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Download invoice PDF
  downloadInvoice: async (invoiceId: string): Promise<ApiResponse<Blob>> => {
    return apiCall<Blob>(`/api/billing/invoices/${invoiceId}/download`);
  },

  // Send invoice to customer
  sendInvoice: async (invoiceId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>(`/api/billing/invoices/${invoiceId}/send`, {
      method: 'POST',
    });
  },

  // Mark invoice as paid
  markAsPaid: async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    return apiCall<Invoice>(`/api/billing/invoices/${invoiceId}/mark-paid`, {
      method: 'POST',
    });
  },

  // Cancel invoice
  cancelInvoice: async (invoiceId: string): Promise<ApiResponse<Invoice>> => {
    return apiCall<Invoice>(`/api/billing/invoices/${invoiceId}/cancel`, {
      method: 'POST',
    });
  },
};

// Credit Wallet API
export const creditWalletApi = {
  // Get wallet information
  getWallet: async (): Promise<ApiResponse<CreditWallet>> => {
    return apiCall<CreditWallet>('/api/billing/credit-wallet');
  },

  // Update wallet settings
  updateWallet: async (data: UpdateCreditWalletRequest): Promise<ApiResponse<CreditWallet>> => {
    return apiCall<CreditWallet>('/api/billing/credit-wallet', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  // Get credit transactions
  getCreditTransactions: async (params?: {
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<CreditTransaction[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return apiCall<CreditTransaction[]>(`/api/billing/credit-wallet/transactions?${queryParams}`);
  },

  // Purchase credits
  purchaseCredits: async (amount: number, paymentMethodId?: string): Promise<ApiResponse<Transaction>> => {
    return apiCall<Transaction>('/api/billing/credit-wallet/purchase', {
      method: 'POST',
      body: JSON.stringify({ amount, payment_method_id: paymentMethodId }),
    });
  },

  // Manual credit adjustment (admin only)
  adjustCredits: async (amount: number, reason: string): Promise<ApiResponse<CreditTransaction>> => {
    return apiCall<CreditTransaction>('/api/billing/credit-wallet/adjust', {
      method: 'POST',
      body: JSON.stringify({ amount, reason }),
    });
  },
};

// Payment Methods API
export const paymentMethodApi = {
  // Get all payment methods
  getPaymentMethods: async (): Promise<ApiResponse<PaymentMethod[]>> => {
    return apiCall<PaymentMethod[]>('/api/billing/payment-methods');
  },

  // Add new payment method
  addPaymentMethod: async (data: AddPaymentMethodRequest): Promise<ApiResponse<PaymentMethod>> => {
    return apiCall<PaymentMethod>('/api/billing/payment-methods', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Set default payment method
  setDefaultPaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<PaymentMethod>> => {
    return apiCall<PaymentMethod>(`/api/billing/payment-methods/${paymentMethodId}/set-default`, {
      method: 'POST',
    });
  },

  // Delete payment method
  deletePaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>(`/api/billing/payment-methods/${paymentMethodId}`, {
      method: 'DELETE',
    });
  },

  // Verify payment method
  verifyPaymentMethod: async (paymentMethodId: string): Promise<ApiResponse<PaymentMethod>> => {
    return apiCall<PaymentMethod>(`/api/billing/payment-methods/${paymentMethodId}/verify`, {
      method: 'POST',
    });
  },
};

// Analytics API
export const analyticsApi = {
  // Get billing analytics
  getBillingAnalytics: async (timeRange?: string): Promise<ApiResponse<BillingAnalytics>> => {
    const params = timeRange ? `?time_range=${timeRange}` : '';
    return apiCall<BillingAnalytics>(`/api/billing/analytics${params}`);
  },

  // Export analytics report
  exportReport: async (timeRange?: string, format: 'csv' | 'pdf' = 'csv'): Promise<ApiResponse<Blob>> => {
    const params = new URLSearchParams();
    if (timeRange) params.append('time_range', timeRange);
    params.append('format', format);
    return apiCall<Blob>(`/api/billing/analytics/export?${params}`);
  },

  // Get revenue trends
  getRevenueTrends: async (timeRange?: string): Promise<ApiResponse<any>> => {
    const params = timeRange ? `?time_range=${timeRange}` : '';
    return apiCall<any>(`/api/billing/analytics/revenue-trends${params}`);
  },
};

// Checkout and Payment Processing API
export const checkoutApi = {
  // Create checkout session
  createCheckoutSession: async (data: {
    items: Array<{
      type: string;
      description: string;
      amount: number;
      quantity: number;
      metadata?: Record<string, any>;
    }>;
    currency: string;
    payment_method_id?: string;
    credits_to_use?: number;
    billing_details?: Record<string, any>;
  }): Promise<ApiResponse<{
    session_id: string;
    client_secret?: string;
    redirect_url?: string;
  }>> => {
    return apiCall('/api/billing/checkout/create-session', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Verify payment
  verifyPayment: async (sessionId: string, paymentId?: string): Promise<ApiResponse<Transaction>> => {
    return apiCall<Transaction>('/api/billing/checkout/verify-payment', {
      method: 'POST',
      body: JSON.stringify({ session_id: sessionId, payment_id: paymentId }),
    });
  },

  // Handle webhook (for internal use)
  handleWebhook: async (webhookData: any): Promise<ApiResponse<{ message: string }>> => {
    return apiCall<{ message: string }>('/api/billing/webhooks/payment', {
      method: 'POST',
      body: JSON.stringify(webhookData),
    });
  },
};

// Refund API
export const refundApi = {
  // Request refund
  requestRefund: async (transactionId: string, amount?: number, reason?: string): Promise<ApiResponse<any>> => {
    return apiCall('/api/billing/refunds', {
      method: 'POST',
      body: JSON.stringify({
        transaction_id: transactionId,
        amount,
        reason,
      }),
    });
  },

  // Get refund status
  getRefundStatus: async (refundId: string): Promise<ApiResponse<any>> => {
    return apiCall(`/api/billing/refunds/${refundId}`);
  },

  // Get all refunds
  getRefunds: async (params?: {
    status?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<any[]>> => {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) queryParams.append(key, value.toString());
      });
    }
    return apiCall<any[]>(`/api/billing/refunds?${queryParams}`);
  },
};

// Export all APIs
export const billingApi = {
  transactions: transactionApi,
  invoices: invoiceApi,
  creditWallet: creditWalletApi,
  paymentMethods: paymentMethodApi,
  analytics: analyticsApi,
  checkout: checkoutApi,
  refunds: refundApi,
};

export default billingApi;
