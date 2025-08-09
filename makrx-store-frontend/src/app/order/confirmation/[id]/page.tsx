'use client'

import React from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { 
  CheckCircle, 
  Package, 
  Truck, 
  CreditCard, 
  MapPin, 
  Calendar,
  Download,
  Mail,
  Phone,
  ArrowRight,
  Share,
  Print,
  Star
} from 'lucide-react'
import { products } from '@/data/products'

export default function OrderConfirmationPage() {
  const params = useParams()
  const orderId = params.id as string

  // Mock order data - in real app this would come from API
  const order = {
    id: orderId,
    number: orderId,
    status: 'confirmed',
    date: new Date().toISOString(),
    customer: {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1 (555) 123-4567'
    },
    shippingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States'
    },
    billingAddress: {
      name: 'John Doe',
      address: '123 Main Street',
      apartment: 'Apt 4B',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      country: 'United States'
    },
    items: [
      { id: '1', product: products[0], quantity: 1, price: products[0].price },
      { id: '2', product: products[3], quantity: 3, price: products[3].price }
    ],
    payment: {
      method: 'Credit Card',
      last4: '4242',
      brand: 'Visa'
    },
    shipping: {
      method: 'Standard Shipping',
      cost: 0,
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
    },
    subtotal: 1131.97,
    tax: 90.56,
    shippingCost: 0,
    total: 1222.53
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const estimatedDelivery = order.shipping.estimatedDelivery.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  })

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-store-text mb-4">Order Confirmed!</h1>
            <p className="text-xl text-store-text-muted mb-2">
              Thank you for your purchase, {order.customer.name.split(' ')[0]}
            </p>
            <div className="flex items-center justify-center gap-4 text-store-text-muted">
              <span>Order #{order.number}</span>
              <span>•</span>
              <span>{formatDate(order.date)}</span>
            </div>
          </div>

          <div className="max-w-4xl mx-auto">
            {/* Order Status Timeline */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
              <h2 className="text-xl font-semibold text-store-text mb-6">Order Status</h2>
              <div className="flex items-center justify-between">
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white mb-2">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-green-600">Order Placed</span>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
                    <Package className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Processing</span>
                  <span className="text-xs text-gray-500">1-2 days</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
                    <Truck className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Shipped</span>
                  <span className="text-xs text-gray-500">3-5 days</span>
                </div>
                <div className="flex-1 h-0.5 bg-gray-200 mx-4"></div>
                <div className="flex flex-col items-center">
                  <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 mb-2">
                    <CheckCircle className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-medium text-gray-500">Delivered</span>
                  <span className="text-xs text-gray-500">{estimatedDelivery}</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center text-blue-800">
                  <Truck className="h-5 w-5 mr-2" />
                  <span className="font-medium">Estimated delivery: {estimatedDelivery}</span>
                </div>
                <p className="text-sm text-blue-600 mt-1">
                  You'll receive tracking information via email once your order ships.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Order Details */}
              <div className="lg:col-span-2 space-y-6">
                {/* Order Items */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-store-text mb-4">Order Items</h3>
                  <div className="space-y-4">
                    {order.items.map((item) => (
                      <div key={item.id} className="flex items-center gap-4 pb-4 border-b border-gray-200 last:border-b-0 last:pb-0">
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                        />
                        <div className="flex-1">
                          <h4 className="font-medium text-store-text line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-sm text-store-text-muted">
                            SKU: {item.product.sku}
                          </p>
                          <p className="text-sm text-store-text-muted">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-store-text">
                            ${(item.price * item.quantity).toFixed(2)}
                          </div>
                          {item.quantity > 1 && (
                            <div className="text-sm text-store-text-muted">
                              ${item.price.toFixed(2)} each
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-store-text mb-4 flex items-center">
                    <MapPin className="h-5 w-5 mr-2" />
                    Shipping Address
                  </h3>
                  <div className="text-store-text-muted">
                    <p className="font-medium text-store-text">{order.shippingAddress.name}</p>
                    <p>{order.shippingAddress.address}</p>
                    {order.shippingAddress.apartment && <p>{order.shippingAddress.apartment}</p>}
                    <p>
                      {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.zipCode}
                    </p>
                    <p>{order.shippingAddress.country}</p>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-store-text mb-4 flex items-center">
                    <CreditCard className="h-5 w-5 mr-2" />
                    Payment Method
                  </h3>
                  <div className="flex items-center">
                    <div className="w-10 h-6 bg-blue-600 rounded flex items-center justify-center mr-3">
                      <span className="text-white text-xs font-bold">VISA</span>
                    </div>
                    <div>
                      <p className="font-medium text-store-text">
                        {order.payment.brand} ending in {order.payment.last4}
                      </p>
                      <p className="text-sm text-store-text-muted">
                        Charged ${order.total.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Order Summary & Actions */}
              <div className="space-y-6">
                {/* Order Summary */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-store-text mb-4">Order Summary</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-store-text-muted">Subtotal</span>
                      <span className="text-store-text">${order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-store-text-muted">Shipping</span>
                      <span className="text-store-text">
                        {order.shippingCost === 0 ? 'FREE' : `$${order.shippingCost.toFixed(2)}`}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-store-text-muted">Tax</span>
                      <span className="text-store-text">${order.tax.toFixed(2)}</span>
                    </div>
                    <div className="border-t border-gray-200 pt-3">
                      <div className="flex justify-between">
                        <span className="text-lg font-semibold text-store-text">Total</span>
                        <span className="text-lg font-bold text-store-text">${order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-store-text mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button className="w-full justify-start" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download Invoice
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Print className="h-4 w-4 mr-2" />
                      Print Order
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Share className="h-4 w-4 mr-2" />
                      Share Order
                    </Button>
                  </div>
                </div>

                {/* Contact Info */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-store-text mb-4">Need Help?</h3>
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-store-primary mr-3" />
                      <div>
                        <p className="font-medium text-store-text">Email Support</p>
                        <p className="text-sm text-store-text-muted">support@makrx.store</p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-store-primary mr-3" />
                      <div>
                        <p className="font-medium text-store-text">Phone Support</p>
                        <p className="text-sm text-store-text-muted">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Next Steps */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-lg font-semibold text-store-text mb-4">What's Next?</h3>
                  <div className="space-y-3">
                    <Link href="/account/orders">
                      <Button className="w-full justify-start" variant="outline">
                        <Package className="h-4 w-4 mr-2" />
                        Track Your Orders
                      </Button>
                    </Link>
                    <Link href="/catalog">
                      <Button className="w-full justify-start" variant="outline">
                        <ArrowRight className="h-4 w-4 mr-2" />
                        Continue Shopping
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Confirmation Notice */}
            <div className="mt-8 p-6 bg-blue-50 border border-blue-200 rounded-xl">
              <div className="flex items-start">
                <Mail className="h-6 w-6 text-blue-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-blue-900 mb-2">Confirmation Email Sent</h3>
                  <p className="text-blue-700 mb-4">
                    We've sent a confirmation email to <strong>{order.customer.email}</strong> with your order details and tracking information.
                  </p>
                  <p className="text-sm text-blue-600">
                    If you don't see it in your inbox, please check your spam folder.
                  </p>
                </div>
              </div>
            </div>

            {/* Review Request */}
            <div className="mt-8 p-6 bg-yellow-50 border border-yellow-200 rounded-xl">
              <div className="flex items-start">
                <Star className="h-6 w-6 text-yellow-600 mt-0.5 mr-3" />
                <div>
                  <h3 className="font-semibold text-yellow-900 mb-2">Love Your Purchase?</h3>
                  <p className="text-yellow-700 mb-4">
                    Help other makers by leaving a review once you receive your items. Your feedback helps our community make better purchasing decisions.
                  </p>
                  <Button variant="outline" className="border-yellow-300 text-yellow-700 hover:bg-yellow-100">
                    Remind Me Later
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
