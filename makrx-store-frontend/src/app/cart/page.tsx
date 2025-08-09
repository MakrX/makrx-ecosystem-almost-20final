'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { 
  Minus, 
  Plus, 
  X, 
  ShoppingCart, 
  Truck, 
  Shield, 
  ArrowRight, 
  ArrowLeft,
  Heart,
  Gift,
  Percent,
  AlertCircle,
  Package
} from 'lucide-react'
import { products } from '@/data/products'

interface CartItem {
  id: string
  product: typeof products[0]
  quantity: number
  selectedOptions?: { [key: string]: string }
}

export default function CartPage() {
  // Mock cart data - in real app this would come from state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      product: products[0], // Prusa MK4
      quantity: 1
    },
    {
      id: '2', 
      product: products[3], // Prusament PLA
      quantity: 3
    },
    {
      id: '3',
      product: products[4], // Arduino UNO
      quantity: 2
    }
  ])

  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState<{code: string, discount: number} | null>(null)

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId)
      return
    }
    setCartItems(items => 
      items.map(item => 
        item.id === itemId ? { ...item, quantity: newQuantity } : item
      )
    )
  }

  const removeItem = (itemId: string) => {
    setCartItems(items => items.filter(item => item.id !== itemId))
  }

  const applyCoupon = () => {
    if (couponCode.toLowerCase() === 'welcome10') {
      setAppliedCoupon({ code: 'WELCOME10', discount: 0.1 })
      setCouponCode('')
    } else if (couponCode.toLowerCase() === 'maker20') {
      setAppliedCoupon({ code: 'MAKER20', discount: 0.2 })
      setCouponCode('')
    }
  }

  const removeCoupon = () => {
    setAppliedCoupon(null)
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
  const discountAmount = appliedCoupon ? subtotal * appliedCoupon.discount : 0
  const discountedSubtotal = subtotal - discountAmount
  const shipping = discountedSubtotal > 75 ? 0 : 9.99
  const tax = discountedSubtotal * 0.08 // 8% tax
  const total = discountedSubtotal + shipping + tax

  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  if (cartItems.length === 0) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingCart className="h-12 w-12 text-gray-400" />
            </div>
            <h1 className="text-2xl font-bold text-store-text mb-2">Your cart is empty</h1>
            <p className="text-store-text-muted mb-8">
              Looks like you haven't added anything to your cart yet. Start exploring our products!
            </p>
            <div className="space-y-3">
              <Link href="/catalog">
                <Button className="w-full font-semibold">
                  Browse Products
                </Button>
              </Link>
              <Link href="/3d-printing">
                <Button variant="outline" className="w-full">
                  Upload for 3D Printing
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 text-sm text-store-text-muted mb-2">
              <Link href="/" className="hover:text-store-primary">Home</Link>
              <ArrowRight className="h-3 w-3" />
              <span>Shopping Cart</span>
            </div>
            <h1 className="text-3xl font-bold text-store-text">Shopping Cart</h1>
            <p className="text-store-text-muted mt-1">{cartItems.length} item{cartItems.length !== 1 ? 's' : ''} in your cart</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <Link href={`/product/${item.product.id}`}>
                      <img 
                        src={item.product.images[0]} 
                        alt={item.product.name}
                        className="w-24 h-24 object-cover rounded-lg border border-gray-200 hover:opacity-80 transition-opacity"
                      />
                    </Link>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <Link href={`/product/${item.product.id}`}>
                            <h3 className="font-semibold text-store-text hover:text-store-primary transition-colors line-clamp-2">
                              {item.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-store-text-muted mt-1">
                            SKU: {item.product.sku}
                          </p>
                          <p className="text-sm text-store-text-muted">
                            Brand: {item.product.brand}
                          </p>
                          {item.product.inStock ? (
                            <div className="flex items-center mt-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                              <span className="text-sm text-green-600 font-medium">In Stock</span>
                            </div>
                          ) : (
                            <div className="flex items-center mt-2">
                              <AlertCircle className="h-4 w-4 text-red-500 mr-2" />
                              <span className="text-sm text-red-600 font-medium">Out of Stock</span>
                            </div>
                          )}
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      {/* Quantity and Price Controls */}
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-3">
                          <span className="text-sm font-medium text-store-text">Quantity:</span>
                          <div className="flex items-center border border-gray-300 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-2 text-gray-600 hover:text-store-primary disabled:opacity-50"
                              disabled={item.quantity <= 1}
                            >
                              <Minus className="h-4 w-4" />
                            </button>
                            <span className="px-4 py-2 min-w-[3rem] text-center font-medium">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-2 text-gray-600 hover:text-store-primary"
                            >
                              <Plus className="h-4 w-4" />
                            </button>
                          </div>
                        </div>

                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-store-text">
                              ${(item.product.price * item.quantity).toFixed(2)}
                            </span>
                            {item.quantity > 1 && (
                              <span className="text-sm text-store-text-muted">
                                (${item.product.price.toFixed(2)} each)
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
                        <button className="flex items-center text-sm text-store-text-muted hover:text-store-primary transition-colors">
                          <Heart className="h-4 w-4 mr-1" />
                          Save for later
                        </button>
                        <button className="flex items-center text-sm text-store-text-muted hover:text-store-primary transition-colors">
                          <Gift className="h-4 w-4 mr-1" />
                          Add gift wrap
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <div className="flex justify-between items-center pt-4">
                <Link href="/catalog">
                  <Button variant="outline" className="flex items-center">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Continue Shopping
                  </Button>
                </Link>
                <button
                  onClick={() => setCartItems([])}
                  className="text-sm text-store-text-muted hover:text-red-500 transition-colors"
                >
                  Clear cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="space-y-6">
              {/* Coupon Code */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-store-text mb-4 flex items-center">
                  <Percent className="h-5 w-5 mr-2" />
                  Promo Code
                </h3>
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div>
                      <span className="font-medium text-green-800">{appliedCoupon.code}</span>
                      <span className="text-sm text-green-600 ml-2">
                        {(appliedCoupon.discount * 100)}% off
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-store-primary focus:border-store-primary"
                    />
                    <Button 
                      onClick={applyCoupon}
                      variant="outline"
                      disabled={!couponCode.trim()}
                    >
                      Apply
                    </Button>
                  </div>
                )}
                <p className="text-xs text-store-text-muted mt-2">
                  Try: WELCOME10 or MAKER20
                </p>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-store-text mb-4">Order Summary</h3>
                
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-store-text-muted">Subtotal ({cartItems.length} items)</span>
                    <span className="text-store-text">${subtotal.toFixed(2)}</span>
                  </div>
                  
                  {appliedCoupon && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span className="text-store-text-muted">Shipping</span>
                    <span className="text-store-text">
                      {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                    </span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-store-text-muted">Tax</span>
                    <span className="text-store-text">${tax.toFixed(2)}</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-3">
                    <div className="flex justify-between">
                      <span className="text-lg font-semibold text-store-text">Total</span>
                      <span className="text-lg font-bold text-store-text">${total.toFixed(2)}</span>
                    </div>
                  </div>
                </div>

                {shipping === 0 ? (
                  <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center text-green-800">
                      <Truck className="h-4 w-4 mr-2" />
                      <span className="text-sm font-medium">FREE shipping included!</span>
                    </div>
                  </div>
                ) : (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="text-blue-800 text-sm">
                      <Truck className="h-4 w-4 inline mr-2" />
                      Add ${(75 - discountedSubtotal).toFixed(2)} more for FREE shipping
                    </div>
                  </div>
                )}

                <Link href="/checkout">
                  <Button className="w-full mt-6 font-semibold" size="lg">
                    Proceed to Checkout
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>

                <div className="mt-4 text-center">
                  <div className="flex items-center justify-center text-sm text-store-text-muted">
                    <Shield className="h-4 w-4 mr-2" />
                    Secure checkout • Estimated delivery: {estimatedDelivery}
                  </div>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="font-semibold text-store-text mb-4">Why Shop With Us?</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Truck className="h-5 w-5 text-store-primary mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium text-store-text">Fast Shipping</div>
                      <div className="text-sm text-store-text-muted">Free shipping on orders over $75</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Shield className="h-5 w-5 text-store-primary mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium text-store-text">Secure Payment</div>
                      <div className="text-sm text-store-text-muted">256-bit SSL encryption</div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Package className="h-5 w-5 text-store-primary mt-0.5 mr-3" />
                    <div>
                      <div className="font-medium text-store-text">Easy Returns</div>
                      <div className="text-sm text-store-text-muted">30-day return policy</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
