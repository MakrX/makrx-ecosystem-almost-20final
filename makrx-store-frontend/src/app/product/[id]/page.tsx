'use client'

import React, { useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { 
  ShoppingCart,
  Heart,
  Share,
  Star,
  Truck,
  Shield,
  RotateCcw,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Check,
  X,
  Package,
  Home,
  ArrowRight,
  Eye,
  Compare,
  Minus,
  Plus,
  Info
} from 'lucide-react'
import { getProductById, products, type Product } from '@/data/products'

export default function ProductDetailPage() {
  const params = useParams()
  const productId = params.id as string
  const product = getProductById(productId)
  
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [showSpecs, setShowSpecs] = useState(false)
  const [showCompatibility, setShowCompatibility] = useState(false)
  const [showDelivery, setShowDelivery] = useState(false)

  if (!product) {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-store-text mb-2">Product Not Found</h1>
            <p className="text-store-text-muted mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/catalog">
              <Button>Browse All Products</Button>
            </Link>
          </div>
        </div>
      </Layout>
    )
  }

  const relatedProducts = products
    .filter(p => p.id !== product.id && (p.category === product.category || p.brand === product.brand))
    .slice(0, 4)

  const handleAddToCart = () => {
    // Add to cart logic here
    console.log('Adding to cart:', product.id, quantity)
  }

  const estimatedDelivery = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  })

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <nav className="flex items-center space-x-2 text-sm text-store-text-light">
              <Link href="/" className="hover:text-store-primary">
                <Home className="h-4 w-4" />
              </Link>
              <ArrowRight className="h-3 w-3" />
              <Link href="/catalog" className="hover:text-store-primary">
                Catalog
              </Link>
              <ArrowRight className="h-3 w-3" />
              <Link href={`/catalog/${product.category}`} className="hover:text-store-primary capitalize">
                {product.category.replace('-', ' ')}
              </Link>
              <ArrowRight className="h-3 w-3" />
              <span className="text-store-text font-medium truncate">{product.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Left: Image Gallery */}
            <div className="space-y-4">
              {/* Main Image */}
              <div className="aspect-square bg-white rounded-xl overflow-hidden shadow-sm border border-gray-200">
                <img 
                  src={product.images[selectedImage]} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-store-primary' : 'border-gray-200'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} view ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* 3D Viewer Placeholder - Only if helpful */}
              {product.category === '3d-printers' && (
                <div className="bg-white rounded-xl p-6 border border-gray-200">
                  <h3 className="font-semibold text-store-text mb-3 flex items-center">
                    <Eye className="h-4 w-4 mr-2" />
                    3D Model Viewer
                  </h3>
                  <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                    <p className="text-store-text-muted">Interactive 3D model loading...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right: Product Info & CTA */}
            <div className="space-y-6">
              {/* Product Title & Key Claim */}
              <div>
                <div className="flex items-start justify-between mb-2">
                  <h1 className="text-3xl font-bold text-store-text">{product.name}</h1>
                  <div className="flex gap-2">
                    <button className="p-2 text-gray-600 hover:text-red-500 transition-colors" data-wishlist>
                      <Heart className="h-5 w-5" />
                    </button>
                    <button className="p-2 text-gray-600 hover:text-store-primary transition-colors">
                      <Share className="h-5 w-5" />
                    </button>
                  </div>
                </div>
                <p className="text-xl text-store-text-light mb-4">{product.shortDescription}</p>
                
                {/* Rating */}
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                      />
                    ))}
                    <span className="ml-2 text-sm text-store-text-light">
                      {product.rating} ({product.reviewCount} reviews)
                    </span>
                  </div>
                  <span className="text-sm text-store-text-muted">SKU: {product.sku}</span>
                </div>

                {/* Badges */}
                <div className="flex gap-2 mb-6">
                  {product.featured && (
                    <span className="bg-store-primary text-white px-3 py-1 rounded-full text-sm font-medium">
                      Staff Pick
                    </span>
                  )}
                  {product.onSale && (
                    <span className="bg-store-error text-white px-3 py-1 rounded-full text-sm font-medium">
                      On Sale
                    </span>
                  )}
                  {product.newArrival && (
                    <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                      New Arrival
                    </span>
                  )}
                </div>
              </div>

              {/* 3 Key Bullets */}
              <div className="bg-blue-50 rounded-xl p-6">
                <h3 className="font-semibold text-store-text mb-4">Why Choose This Product?</h3>
                <ul className="space-y-3">
                  {product.tags.slice(0, 3).map((tag, index) => (
                    <li key={index} className="flex items-center text-store-text-light">
                      <Check className="h-4 w-4 text-green-600 mr-3 flex-shrink-0" />
                      <span className="capitalize">{tag.replace('-', ' ')}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Price & Stock */}
              <div className="bg-white rounded-xl p-6 border border-gray-200">
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl font-bold text-store-text">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-xl text-gray-400 line-through">${product.originalPrice}</span>
                    )}
                  </div>
                  {product.originalPrice && (
                    <span className="bg-store-error text-white px-3 py-1 rounded-full text-sm font-medium">
                      Save ${product.originalPrice - product.price}
                    </span>
                  )}
                </div>

                {/* Stock Status */}
                <div className="flex items-center gap-2 mb-6">
                  {product.inStock ? (
                    <>
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-green-600 font-medium">In Stock ({product.stockCount} available)</span>
                    </>
                  ) : (
                    <>
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-red-600 font-medium">Out of Stock</span>
                    </>
                  )}
                </div>

                {/* Quantity Selector */}
                <div className="flex items-center gap-4 mb-6">
                  <label className="text-sm font-medium text-store-text">Quantity:</label>
                  <div className="flex items-center border border-gray-300 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="p-2 text-gray-600 hover:text-store-primary"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-4 py-2 min-w-[3rem] text-center">{quantity}</span>
                    <button
                      onClick={() => setQuantity(quantity + 1)}
                      className="p-2 text-gray-600 hover:text-store-primary"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="space-y-3 mb-6">
                  <Button
                    onClick={handleAddToCart}
                    className="w-full font-semibold text-lg py-4"
                    disabled={!product.inStock}
                    size="lg"
                    data-add-to-cart
                  >
                    <ShoppingCart className="h-5 w-5 mr-2" />
                    Add to Cart - ${(product.price * quantity).toFixed(2)}
                  </Button>
                  <div className="grid grid-cols-2 gap-3">
                    <Button variant="outline" className="font-semibold">
                      <Compare className="h-4 w-4 mr-2" />
                      Compare
                    </Button>
                    <Button variant="outline" className="font-semibold">
                      <Heart className="h-4 w-4 mr-2" />
                      Save for Later
                    </Button>
                  </div>
                </div>

                {/* Delivery Estimate */}
                <div className="flex items-center justify-between text-sm text-store-text-light">
                  <div className="flex items-center">
                    <Truck className="h-4 w-4 mr-2" />
                    <span>Delivery by {estimatedDelivery}</span>
                  </div>
                  <span className="text-green-600 font-medium">Free shipping</span>
                </div>
              </div>

              {/* Trust Indicators */}
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <Shield className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-xs text-store-text-muted">{product.warranty} Warranty</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <RotateCcw className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-xs text-store-text-muted">30-Day Returns</p>
                </div>
                <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                  <Truck className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-xs text-store-text-muted">Fast Shipping</p>
                </div>
              </div>
            </div>
          </div>

          {/* Below: Details Accordion */}
          <div className="max-w-4xl mx-auto space-y-4">
            {/* Description */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6">
                <h2 className="text-xl font-semibold text-store-text mb-4">Product Description</h2>
                <p className="text-store-text-light leading-relaxed">{product.description}</p>
              </div>
            </div>

            {/* Use Cases */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-store-text mb-4">Perfect For</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {product.tags.map((tag, index) => (
                    <div key={index} className="flex items-center p-3 bg-gray-50 rounded-lg">
                      <Check className="h-4 w-4 text-green-600 mr-2" />
                      <span className="text-store-text capitalize">{tag.replace('-', ' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* What's Included */}
            <div className="bg-white rounded-xl border border-gray-200">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-store-text mb-4">What's in the Box</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-store-primary mr-2" />
                    <span className="text-store-text-light">1x {product.name}</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-store-primary mr-2" />
                    <span className="text-store-text-light">User Manual</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-store-primary mr-2" />
                    <span className="text-store-text-light">Quick Start Guide</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-store-primary mr-2" />
                    <span className="text-store-text-light">Warranty Card</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Compatibility Accordion */}
            <div className="bg-white rounded-xl border border-gray-200">
              <button
                onClick={() => setShowCompatibility(!showCompatibility)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-store-text">Compatibility</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showCompatibility ? 'rotate-180' : ''}`} />
              </button>
              {showCompatibility && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="font-medium text-store-text mb-3">Works with:</h4>
                    <div className="flex flex-wrap gap-2">
                      {product.compatibility.map((item, index) => (
                        <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                          {item}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Specifications Accordion */}
            <div className="bg-white rounded-xl border border-gray-200">
              <button
                onClick={() => setShowSpecs(!showSpecs)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-store-text">Technical Specifications</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showSpecs ? 'rotate-180' : ''}`} />
              </button>
              {showSpecs && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4">
                    <dl className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                      {Object.entries(product.specifications).map(([key, value]) => (
                        <div key={key} className="flex justify-between">
                          <dt className="text-store-text-muted font-medium">{key}:</dt>
                          <dd className="text-store-text">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                </div>
              )}
            </div>

            {/* Shipping & Returns Accordion */}
            <div className="bg-white rounded-xl border border-gray-200">
              <button
                onClick={() => setShowDelivery(!showDelivery)}
                className="w-full p-6 flex items-center justify-between text-left"
              >
                <h3 className="text-lg font-semibold text-store-text">Shipping & Returns</h3>
                <ChevronDown className={`h-5 w-5 text-gray-400 transition-transform ${showDelivery ? 'rotate-180' : ''}`} />
              </button>
              {showDelivery && (
                <div className="px-6 pb-6">
                  <div className="border-t border-gray-200 pt-4 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <h4 className="font-medium text-store-text mb-2">Shipping</h4>
                        <ul className="space-y-1 text-sm text-store-text-light">
                          <li>• Free standard shipping (3-5 business days)</li>
                          <li>• Express shipping available ($9.99)</li>
                          <li>• Ships from {product.origin}</li>
                          <li>• Tracking included</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-medium text-store-text mb-2">Returns</h4>
                        <ul className="space-y-1 text-sm text-store-text-light">
                          <li>• 30-day return window</li>
                          <li>• Free return shipping</li>
                          <li>• Original packaging required</li>
                          <li>• Refund processed in 3-5 days</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div className="mt-16">
              <h2 className="text-2xl font-bold text-store-text mb-8 text-center">You Might Also Like</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {relatedProducts.map(relatedProduct => (
                  <Link key={relatedProduct.id} href={`/product/${relatedProduct.id}`}>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 overflow-hidden">
                      <img 
                        src={relatedProduct.images[0]} 
                        alt={relatedProduct.name}
                        className="w-full h-48 object-cover"
                      />
                      <div className="p-4">
                        <h3 className="font-semibold text-store-text text-sm mb-2 line-clamp-2">
                          {relatedProduct.name}
                        </h3>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-store-text">${relatedProduct.price}</span>
                          <div className="flex items-center">
                            <Star className="h-3 w-3 text-yellow-400 fill-current" />
                            <span className="text-xs text-store-text-muted ml-1">{relatedProduct.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sticky Mobile CTA */}
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg font-bold text-store-text">${product.price}</span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                )}
              </div>
              <p className="text-xs text-store-text-muted">Free shipping • {estimatedDelivery}</p>
            </div>
            <Button 
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="font-semibold"
            >
              <ShoppingCart className="h-4 w-4 mr-2" />
              Add to Cart
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  )
}
