import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  DollarSign,
  Download,
  Plus,
  TrendingUp,
  Calendar,
  Wallet,
  CheckCircle,
  TrendingDown
} from 'lucide-react';
import CreditWalletWidget from '../components/billing/CreditWalletWidget';
import PaymentMethodCard from '../components/billing/PaymentMethodCard';
import TransactionsList from '../components/billing/TransactionsList';
import InvoicesList from '../components/billing/InvoicesList';
import BillingAnalytics from '../components/billing/BillingAnalytics';
import CheckoutModal from '../components/billing/CheckoutModal';
import { useAuth } from '../contexts/AuthContext';
import { useBilling } from '../contexts/BillingContext';

interface Transaction {
  id: string;
  amount: number;
  currency: string;
  type: string;
  status: string;
  description: string;
  gateway: string;
  created_at: string;
  completed_at?: string;
}

interface Invoice {
  id: string;
  invoice_number: string;
  amount: number;
  total_amount: number;
  currency: string;
  status: string;
  title: string;
  issue_date: string;
  due_date?: string;
  paid_date?: string;
}

interface BillingStats {
  total_spent: number;
  this_month_spent: number;
  pending_amount: number;
  credits_balance: number;
  successful_transactions: number;
  failed_transactions: number;
}

const Billing: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [billingStats, setBillingStats] = useState<BillingStats>({
    total_spent: 2450.50,
    this_month_spent: 320.75,
    pending_amount: 0,
    credits_balance: 150,
    successful_transactions: 24,
    failed_transactions: 1
  });
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);

  // Mock data for demonstration
  const mockTransactions: Transaction[] = [
    {
      id: '1',
      amount: 99.99,
      currency: 'INR',
      type: 'membership',
      status: 'success',
      description: 'Pro Maker Membership - Monthly',
      gateway: 'razorpay',
      created_at: '2024-01-20T10:30:00Z',
      completed_at: '2024-01-20T10:31:15Z'
    },
    {
      id: '2',
      amount: 150.00,
      currency: 'INR',
      type: 'credit_purchase',
      status: 'success',
      description: 'Credit Purchase - 150 Credits',
      gateway: 'razorpay',
      created_at: '2024-01-18T14:20:00Z',
      completed_at: '2024-01-18T14:21:05Z'
    },
    {
      id: '3',
      amount: 45.50,
      currency: 'INR',
      type: 'printing_3d',
      status: 'success',
      description: '3D Print Job #PRT001',
      gateway: 'credit',
      created_at: '2024-01-17T09:15:00Z',
      completed_at: '2024-01-17T09:15:00Z'
    },
    {
      id: '4',
      amount: 25.25,
      currency: 'INR',
      type: 'laser_cutting',
      status: 'failed',
      description: 'Laser Cut Job #LC003',
      gateway: 'razorpay',
      created_at: '2024-01-16T16:45:00Z'
    },
    {
      id: '5',
      amount: 200.00,
      currency: 'INR',
      type: 'workshop',
      status: 'pending',
      description: 'Arduino Workshop Registration',
      gateway: 'razorpay',
      created_at: '2024-01-15T11:00:00Z'
    }
  ];

  const mockInvoices: Invoice[] = [
    {
      id: '1',
      invoice_number: 'INV-2024-01-00124',
      amount: 99.99,
      total_amount: 99.99,
      currency: 'INR',
      status: 'paid',
      title: 'Pro Maker Membership',
      issue_date: '2024-01-20T00:00:00Z',
      due_date: '2024-02-19T00:00:00Z',
      paid_date: '2024-01-20T10:31:15Z'
    },
    {
      id: '2',
      invoice_number: 'INV-2024-01-00125',
      amount: 150.00,
      total_amount: 150.00,
      currency: 'INR',
      status: 'paid',
      title: 'Credit Purchase',
      issue_date: '2024-01-18T00:00:00Z',
      paid_date: '2024-01-18T14:21:05Z'
    },
    {
      id: '3',
      invoice_number: 'INV-2024-01-00126',
      amount: 200.00,
      total_amount: 200.00,
      currency: 'INR',
      status: 'pending',
      title: 'Arduino Workshop Registration',
      issue_date: '2024-01-15T00:00:00Z',
      due_date: '2024-01-30T00:00:00Z'
    }
  ];

  useEffect(() => {
    setTransactions(mockTransactions);
    setInvoices(mockInvoices);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
      case 'paid':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-600" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      success: 'bg-green-100 text-green-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      pending: 'bg-yellow-100 text-yellow-800',
      overdue: 'bg-red-100 text-red-800',
    };
    
    return (
      <Badge variant="outline" className={variants[status as keyof typeof variants] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'membership':
        return <CreditCard className="h-4 w-4 text-blue-600" />;
      case 'credit_purchase':
        return <Wallet className="h-4 w-4 text-purple-600" />;
      case 'printing_3d':
        return <FileText className="h-4 w-4 text-green-600" />;
      case 'laser_cutting':
        return <FileText className="h-4 w-4 text-orange-600" />;
      case 'workshop':
        return <Calendar className="h-4 w-4 text-indigo-600" />;
      default:
        return <Receipt className="h-4 w-4 text-gray-600" />;
    }
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'Invalid date';
    }
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    // Simulate invoice download
    console.log(`Downloading invoice ${invoiceId}`);
  };

  const handleViewTransaction = (transactionId: string) => {
    console.log(`Viewing transaction ${transactionId}`);
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = invoice.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         invoice.invoice_number.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Billing & Payments</h1>
          <p className="text-gray-600">Manage your payments, invoices, and billing information</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => setShowCheckoutModal(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Buy Credits
          </Button>
          <Button onClick={() => window.location.href = '/portal/billing/invoices'}>
            <Download className="h-4 w-4 mr-2" />
            Download Reports
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Spent</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(billingStats.total_spent)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  All time
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(billingStats.this_month_spent)}</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from last month
                </p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Credits Balance</p>
                <p className="text-2xl font-bold text-gray-900">{billingStats.credits_balance}</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  <Wallet className="h-3 w-3 mr-1" />
                  Available credits
                </p>
              </div>
              <Wallet className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold text-gray-900">96%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  {billingStats.successful_transactions}/{billingStats.successful_transactions + billingStats.failed_transactions} transactions
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Credit Wallet Widget */}
      <CreditWalletWidget />

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Transactions
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('transactions')}>
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        {getTypeIcon(transaction.type)}
                        <div>
                          <p className="font-medium text-sm">{transaction.description}</p>
                          <p className="text-xs text-gray-500">
                            {formatDate(transaction.created_at)} • {transaction.gateway}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(transaction.amount, transaction.currency)}</p>
                        {getStatusBadge(transaction.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Invoices */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent Invoices
                  <Button variant="ghost" size="sm" onClick={() => setActiveTab('invoices')}>
                    View All
                    <ArrowUpRight className="h-4 w-4 ml-1" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {invoices.slice(0, 5).map((invoice) => (
                    <div key={invoice.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <Receipt className="h-4 w-4 text-blue-600" />
                        <div>
                          <p className="font-medium text-sm">{invoice.invoice_number}</p>
                          <p className="text-xs text-gray-500">
                            {invoice.title} • {formatDate(invoice.issue_date)}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
                        {getStatusBadge(invoice.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          {/* Search and Filters */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search transactions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-32">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                  
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="membership">Membership</SelectItem>
                      <SelectItem value="credit_purchase">Credits</SelectItem>
                      <SelectItem value="printing_3d">3D Printing</SelectItem>
                      <SelectItem value="laser_cutting">Laser Cutting</SelectItem>
                      <SelectItem value="workshop">Workshop</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>Transactions ({filteredTransactions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Receipt className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No transactions found</p>
                  <p className="text-sm">Try adjusting your search or filters</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          {getTypeIcon(transaction.type)}
                          <div>
                            <h3 className="font-medium">{transaction.description}</h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>ID: {transaction.id}</span>
                              <span>•</span>
                              <span>{formatDate(transaction.created_at)}</span>
                              <span>•</span>
                              <span className="capitalize">{transaction.gateway}</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-lg">{formatCurrency(transaction.amount, transaction.currency)}</p>
                            <div className="flex items-center gap-2">
                              {getStatusIcon(transaction.status)}
                              {getStatusBadge(transaction.status)}
                            </div>
                          </div>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleViewTransaction(transaction.id)}>
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Download className="h-4 w-4 mr-2" />
                                Download Receipt
                              </DropdownMenuItem>
                              {transaction.status === 'failed' && (
                                <DropdownMenuItem>
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Retry Payment
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoices ({filteredInvoices.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredInvoices.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No invoices found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInvoices.map((invoice) => (
                    <div key={invoice.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Receipt className="h-8 w-8 text-blue-600" />
                          <div>
                            <h3 className="font-medium">{invoice.invoice_number}</h3>
                            <p className="text-sm text-gray-600">{invoice.title}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                              <span>Issued: {formatDate(invoice.issue_date)}</span>
                              {invoice.due_date && (
                                <>
                                  <span>•</span>
                                  <span>Due: {formatDate(invoice.due_date)}</span>
                                </>
                              )}
                              {invoice.paid_date && (
                                <>
                                  <span>•</span>
                                  <span>Paid: {formatDate(invoice.paid_date)}</span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="font-medium text-lg">{formatCurrency(invoice.total_amount, invoice.currency)}</p>
                            {getStatusBadge(invoice.status)}
                          </div>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(invoice.id)}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <BillingAnalytics />
        </TabsContent>
      </Tabs>

      {/* Checkout Modal */}
      <CheckoutModal
        open={showCheckoutModal}
        onOpenChange={setShowCheckoutModal}
      />
    </div>
  );
};

export default Billing;
