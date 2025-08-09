'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import Layout from '@/components/layout/Layout'
import {
  Printer,
  Cpu,
  Wrench,
  Package,
  Zap,
  Shield,
  Clock,
  Star,
  ArrowRight,
  Upload,
  Search,
  Users,
  Globe,
  TrendingUp,
  Award
} from 'lucide-react'

export default function HomePage() {
  const featuredProducts = [
    {
      id: 1,
      name: "Prusa MK4 3D Printer",
      price: 1099,
      originalPrice: 1299,
      image: "/api/placeholder/300/200",
      rating: 4.9,
      reviews: 847,
      badge: "Best Seller"
    },
    {
      id: 2,
      name: "Arduino Mega 2560 Kit",
      price: 89,
      image: "/api/placeholder/300/200",
      rating: 4.8,
      reviews: 1203,
      badge: "New"
    },
    {
      id: 3,
      name: "CNC Router 3018 Pro",
      price: 299,
      originalPrice: 349,
      image: "/api/placeholder/300/200",
      rating: 4.7,
      reviews: 425,
      badge: "Sale"
    },
    {
      id: 4,
      name: "Elegoo Mars 3 Pro",
      price: 249,
      image: "/api/placeholder/300/200",
      rating: 4.6,
      reviews: 332,
      badge: ""
    }
  ]

  const categories = [
    { name: "3D Printers", icon: Printer, count: "150+" },
    { name: "Electronics", icon: Cpu, count: "500+" },
    { name: "Tools", icon: Wrench, count: "200+" },
    { name: "Components", icon: Package, count: "1000+" },
  ]

  const services = [
    {
      title: "3D Printing",
      description: "Upload your STL, get instant quotes, and have it printed by verified providers",
      icon: Printer,
      features: ["Instant quotes", "Multiple materials", "Local providers"]
    },
    {
      title: "CNC Machining",
      description: "Precision manufacturing for metal and wood components",
      icon: Wrench,
      features: ["High precision", "Various materials", "Fast turnaround"]
    },
    {
      title: "PCB Assembly",
      description: "Professional PCB manufacturing and assembly services",
      icon: Cpu,
      features: ["SMT assembly", "Through-hole", "Testing included"]
    }
  ]

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Making
              </span>{' '}
              is Here
            </h1>
            <p className="text-xl sm:text-2xl text-white/90 mb-8 leading-relaxed">
              Your one-stop shop for tools, components, and manufacturing services. 
              Built for makers, by makers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-lg mx-auto sm:max-w-none">
              <Button size="xl" variant="gradient" className="text-lg">
                <Search className="mr-2 h-5 w-5" />
                Browse Catalog
              </Button>
              <Button size="xl" variant="outline" className="text-lg border-white/30 text-white hover:bg-white/10">
                <Upload className="mr-2 h-5 w-5" />
                Upload & Quote
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-blue-400 rounded-full animate-pulse opacity-40 delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse opacity-50 delay-500"></div>
        </div>
      </section>

      {/* Quick Upload Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-store-primary to-store-secondary rounded-2xl p-8 sm:p-12 text-white text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Get Instant 3D Printing Quotes
            </h2>
            <p className="text-xl mb-8 text-white/90">
              Upload your STL file and get real-time pricing from verified local providers
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                <Upload className="mr-2 h-5 w-5" />
                Upload STL File
              </Button>
              <Button size="lg" className="bg-white text-store-primary hover:bg-gray-100">
                View Sample Projects
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Shop by Category
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to bring your ideas to life
            </p>
          </div>
          
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, index) => {
              const Icon = category.icon
              return (
                <Link 
                  key={index}
                  href={`/catalog/${category.name.toLowerCase().replace(' ', '-')}`}
                  className="group bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-store-primary to-store-secondary rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-store-primary font-medium">{category.count} items</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
                Featured Products
              </h2>
              <p className="text-xl text-gray-600">
                Handpicked tools and components for makers
              </p>
            </div>
            <Button variant="outline">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="group bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border">
                <div className="relative">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className={`absolute top-3 left-3 px-2 py-1 text-xs font-semibold rounded-full ${
                      product.badge === 'Best Seller' ? 'bg-store-success text-white' :
                      product.badge === 'New' ? 'bg-store-primary text-white' :
                      product.badge === 'Sale' ? 'bg-store-error text-white' : ''
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-store-primary transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`h-4 w-4 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                        />
                      ))}
                    </div>
                    <span className="text-sm text-gray-600 ml-2">({product.reviews})</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                      {product.originalPrice && (
                        <span className="text-lg text-gray-500 line-through">${product.originalPrice}</span>
                      )}
                    </div>
                  </div>
                  <Button className="w-full mt-3" size="sm">
                    Add to Cart
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Manufacturing Services
            </h2>
            <p className="text-xl text-gray-600">
              Professional manufacturing services from verified providers
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const Icon = service.icon
              return (
                <div key={index} className="bg-white rounded-xl p-8 shadow-md hover:shadow-xl transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-store-primary to-store-secondary rounded-xl flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 mb-6">{service.description}</p>
                  <ul className="space-y-2 mb-6">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-gray-700">
                        <div className="w-2 h-2 bg-store-primary rounded-full mr-3"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="outline" className="w-full">
                    Get Quote
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-store-primary to-store-secondary">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center text-white">
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">10K+</div>
              <div className="text-white/90">Products</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">500+</div>
              <div className="text-white/90">Service Providers</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">50K+</div>
              <div className="text-white/90">Orders Completed</div>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold mb-2">99.9%</div>
              <div className="text-white/90">Customer Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to Start Making?
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of makers who trust MakrX.Store for their projects and manufacturing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="xl" variant="gradient">
              <Package className="mr-2 h-5 w-5" />
              Browse Catalog
            </Button>
            <Button size="xl" variant="outline">
              <Users className="mr-2 h-5 w-5" />
              Become a Provider
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  )
}
