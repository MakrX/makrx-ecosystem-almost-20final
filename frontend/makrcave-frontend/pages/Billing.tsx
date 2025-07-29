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
  const { user, hasPermission, isMakerspaceAdmin } = useAuth();
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
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
  const [makerspaceUsers, setMakerspaceUsers] = useState<any[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Check if user can manage billing for others
  const canManageBilling = hasPermission('billing', 'manage_payments', { isAssignedMakerspace: true });
  const canCollectPayments = hasPermission('billing', 'collect_payments', { isAssignedMakerspace: true });

  // Calculate billing stats from context data
  const billingStats = {
    total_spent: state.analytics?.revenue.total || 0,
    this_month_spent: state.analytics?.revenue.monthly || 0,
    pending_amount: state.transactions.filter(t => t.status === 'pending').reduce((sum, t) => sum + t.amount, 0),
    credits_balance: state.creditWallet?.balance || 0,
    successful_transactions: state.analytics?.transactions.successful_count || 0,
    failed_transactions: state.analytics?.transactions.failed_count || 0
  };

  // Mock data for makerspace users billing
  const getMakerspaceUsersBilling = () => [
    {
      id: 'mkr-1',
      name: 'Casey Williams',
      email: 'casey.williams@makrcave.local',
      credits_balance: 150,
      total_spent: 850,
      this_month_spent: 120,
      pending_amount: 45,
      last_payment: '2024-01-15',
      status: 'active'
    },
    {
      id: 'sp-1',
      name: 'Riley Thompson',
      email: 'riley.thompson@makrcave.local',
      credits_balance: 0,
      total_spent: 320,
      this_month_spent: 80,
      pending_amount: 25,
      last_payment: '2024-01-10',
      status: 'overdue'
    },
    {
      id: 'mkr-2',
      name: 'Alex Johnson',
      email: 'alex.johnson@makrcave.local',
      credits_balance: 300,
      total_spent: 1200,
      this_month_spent: 180,
      pending_amount: 0,
      last_payment: '2024-01-18',
      status: 'active'
    }
  ];

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
          <p className="text-gray-600">
            {isMakerspaceAdmin
              ? "Manage billing and payments for your makerspace users"
              : "Manage your payments, invoices, and billing information"
            }
          </p>
        </div>
        <div className="flex items-center gap-3">
          {canCollectPayments && (
            <Button variant="outline">
              <DollarSign className="h-4 w-4 mr-2" />
              Collect Payment
            </Button>
          )}
          <Button variant="outline" onClick={handleBuyCredits}>
            <Plus className="h-4 w-4 mr-2" />
            Buy Credits
          </Button>
          <Button onClick={handleExportReports}>
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
        <TabsList className={`grid w-full ${isMakerspaceAdmin ? 'grid-cols-5' : 'grid-cols-4'}`}>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="transactions">Transactions</TabsTrigger>
          <TabsTrigger value="invoices">Invoices</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          {isMakerspaceAdmin && (
            <TabsTrigger value="users">User Billing</TabsTrigger>
          )}
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <TransactionsList
              transactions={state.transactions.slice(0, 5)}
              showSearch={false}
              showFilters={false}
              showPagination={false}
              onViewTransaction={(transaction) => console.log('View transaction:', transaction)}
              onDownloadReceipt={downloadReceipt}
              onRetryPayment={retryTransaction}
            />

            {/* Recent Invoices */}
            <InvoicesList
              invoices={state.invoices.slice(0, 5)}
              showSearch={false}
              showFilters={false}
              showPagination={false}
              onViewInvoice={(invoice) => console.log('View invoice:', invoice)}
              onDownloadInvoice={downloadInvoice}
            />
          </div>
        </TabsContent>

        {/* Transactions Tab */}
        <TabsContent value="transactions" className="space-y-6">
          <TransactionsList
            transactions={state.transactions}
            showSearch={true}
            showFilters={true}
            showPagination={true}
            onViewTransaction={(transaction) => console.log('View transaction:', transaction)}
            onDownloadReceipt={downloadReceipt}
            onRetryPayment={retryTransaction}
          />
        </TabsContent>

        {/* Invoices Tab */}
        <TabsContent value="invoices" className="space-y-6">
          <InvoicesList
            invoices={state.invoices}
            showSearch={true}
            showFilters={true}
            showPagination={true}
            onViewInvoice={(invoice) => console.log('View invoice:', invoice)}
            onDownloadInvoice={downloadInvoice}
          />
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <BillingAnalytics
            data={state.analytics}
            onExportReport={handleExportReports}
          />
        </TabsContent>

        {/* User Billing Tab - Only for Makerspace Admins */}
        {isMakerspaceAdmin && (
          <TabsContent value="users" className="space-y-6">
            <div className="space-y-6">
              {/* Makerspace Billing Overview */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Users</p>
                        <p className="text-2xl font-bold text-gray-900">{getMakerspaceUsersBilling().length}</p>
                        <p className="text-xs text-gray-500">Active members</p>
                      </div>
                      <Users className="h-8 w-8 text-blue-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                        <p className="text-2xl font-bold text-gray-900">
                          {formatCurrency(getMakerspaceUsersBilling().reduce((sum, user) => sum + user.total_spent, 0))}
                        </p>
                        <p className="text-xs text-green-600">From all users</p>
                      </div>
                      <DollarSign className="h-8 w-8 text-green-600" />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                        <p className="text-2xl font-bold text-red-600">
                          {formatCurrency(getMakerspaceUsersBilling().reduce((sum, user) => sum + user.pending_amount, 0))}
                        </p>
                        <p className="text-xs text-red-500">Requires attention</p>
                      </div>
                      <AlertTriangle className="h-8 w-8 text-red-600" />
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Users Billing Table */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    User Billing Management
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getMakerspaceUsersBilling().map((user) => (
                      <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-sm font-medium">{user.name.split(' ').map(n => n[0]).join('')}</span>
                          </div>
                          <div>
                            <h3 className="font-semibold">{user.name}</h3>
                            <p className="text-sm text-gray-600">{user.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Badge variant={user.status === 'active' ? 'default' : 'destructive'}>
                                {user.status}
                              </Badge>
                              {user.pending_amount > 0 && (
                                <Badge variant="outline" className="text-red-600">
                                  {formatCurrency(user.pending_amount)} pending
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="grid grid-cols-3 gap-4 text-sm mb-2">
                            <div>
                              <p className="text-gray-500">Credits</p>
                              <p className="font-medium">{formatCurrency(user.credits_balance)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">This Month</p>
                              <p className="font-medium">{formatCurrency(user.this_month_spent)}</p>
                            </div>
                            <div>
                              <p className="text-gray-500">Total</p>
                              <p className="font-medium">{formatCurrency(user.total_spent)}</p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View Details
                            </Button>
                            {user.pending_amount > 0 && (
                              <Button size="sm">
                                <DollarSign className="h-4 w-4 mr-1" />
                                Collect Payment
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        )}
      </Tabs>

      {/* Payment Methods Section */}
      {activeTab === 'overview' && (
        <PaymentMethodCard
          paymentMethods={state.paymentMethods}
          onAddPaymentMethod={() => console.log('Add payment method')}
          onEditPaymentMethod={(method) => console.log('Edit payment method:', method)}
          onDeletePaymentMethod={deletePaymentMethod}
          onSetDefaultMethod={setDefaultPaymentMethod}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        open={state.showCheckoutModal}
        onOpenChange={hideCheckout}
        items={state.checkoutItems}
        availablePaymentMethods={state.paymentMethods}
        creditBalance={state.creditWallet?.balance || 0}
        onProcessPayment={(paymentData) => console.log('Process payment:', paymentData)}
        onAddPaymentMethod={() => console.log('Add payment method from checkout')}
      />
    </div>
  );
};

export default Billing;
