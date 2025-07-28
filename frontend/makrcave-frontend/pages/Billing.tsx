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



const Billing: React.FC = () => {
  const { user } = useAuth();
  const {
    state,
    showCheckout,
    hideCheckout,
    setTransactionFilters,
    setInvoiceFilters,
    downloadReceipt,
    downloadInvoice,
    retryTransaction,
    fetchAnalytics,
    exportReport,
    addPaymentMethod,
    setDefaultPaymentMethod,
    deletePaymentMethod
  } = useBilling();

  const [activeTab, setActiveTab] = useState('overview');

  // Calculate billing stats from context data
  const billingStats = {
    total_spent: state.analytics?.revenue.total || 0,
    this_month_spent: state.analytics?.revenue.monthly || 0,
    pending_amount: state.transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    credits_balance: state.creditWallet?.balance || 0,
    successful_transactions: state.analytics?.transactions.successful_count || 0,
    failed_transactions: state.analytics?.transactions.failed_count || 0
  };

  const formatCurrency = (amount: number, currency: string = 'INR') => {
    const symbol = currency === 'INR' ? '₹' : '$';
    return `${symbol}${amount.toFixed(2)}`;
  };

  const handleBuyCredits = () => {
    const creditItems = [
      {
        id: 'credits',
        type: 'credits' as const,
        title: 'Credit Purchase',
        description: 'Purchase credits for makerspace services',
        price: 100,
        quantity: 1
      }
    ];
    showCheckout(creditItems);
  };

  const handleExportReports = () => {
    exportReport('month', 'csv');
  };

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
