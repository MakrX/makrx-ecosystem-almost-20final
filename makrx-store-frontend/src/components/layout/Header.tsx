'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import SmartSearch from '@/components/SmartSearch'
import { categories } from '@/data/products'
import {
  ShoppingCart,
  User,
  Search,
  Menu,
  X,
  Package,
  Printer,
  Settings,
  LogOut,
  Heart,
  Bell,
  ChevronDown,
  Cpu,
  Wrench,
  Box
} from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const router = useRouter()

  // Organize categories for dropdown
  const featuredCategories = categories.filter(cat => cat.featured)
  const otherCategories = categories.filter(cat => !cat.featured)

  const servicesMenu = [
    { name: '3D Printing', href: '/3d-printing', icon: Printer, description: 'Upload STL files for instant quotes' },
    { name: 'CNC Machining', href: '/services/cnc', icon: Wrench, description: 'Precision metal and wood machining' },
    { name: 'PCB Assembly', href: '/services/pcb', icon: Cpu, description: 'Professional circuit board assembly' },
    { name: 'Laser Cutting', href: '/services/laser', icon: Package, description: 'Precise laser cutting services' }
  ]

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-200 shadow-sm">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 bg-gradient-to-br from-store-primary to-store-secondary rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">🛒</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-xl font-bold text-gray-900">MakrX</span>
                <span className="text-xl font-bold text-store-primary">.Store</span>
              </div>
            </Link>

            {/* Navigation - Desktop */}
            <nav className="hidden lg:flex items-center space-x-8 ml-8">
              {/* Catalog Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('catalog')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-store-text hover:text-store-primary transition-colors font-semibold flex items-center">
                  Catalog
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {activeDropdown === 'catalog' && (
                  <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-6">
                      <div className="mb-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          Featured Categories
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                          {featuredCategories.map(category => (
                            <Link
                              key={category.id}
                              href={`/catalog/${category.slug}`}
                              className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-store-primary to-store-secondary rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                                <Package className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-store-text group-hover:text-store-primary">
                                  {category.name}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {category.productCount} products
                                </div>
                              </div>
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4">
                        <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                          More Categories
                        </h3>
                        <div className="space-y-1">
                          {otherCategories.map(category => (
                            <Link
                              key={category.id}
                              href={`/catalog/${category.slug}`}
                              className="block px-3 py-2 text-sm text-store-text hover:text-store-primary hover:bg-gray-50 rounded-lg transition-colors"
                            >
                              {category.name} ({category.productCount})
                            </Link>
                          ))}
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <Link
                          href="/catalog"
                          className="block w-full text-center bg-store-primary text-white py-2 rounded-lg font-medium hover:bg-store-primary-dark transition-colors"
                        >
                          Browse All Products
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Services Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setActiveDropdown('services')}
                onMouseLeave={() => setActiveDropdown(null)}
              >
                <button className="text-store-text hover:text-store-primary transition-colors font-semibold flex items-center">
                  Services
                  <ChevronDown className="h-4 w-4 ml-1" />
                </button>

                {activeDropdown === 'services' && (
                  <div className="absolute top-full left-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    <div className="p-4">
                      <div className="space-y-2">
                        {servicesMenu.map(service => {
                          const Icon = service.icon
                          return (
                            <Link
                              key={service.name}
                              href={service.href}
                              className="flex items-start p-3 rounded-lg hover:bg-gray-50 transition-colors group"
                            >
                              <div className="w-10 h-10 bg-gradient-to-br from-store-primary to-store-secondary rounded-lg flex items-center justify-center mr-3 group-hover:scale-105 transition-transform">
                                <Icon className="h-5 w-5 text-white" />
                              </div>
                              <div>
                                <div className="font-medium text-store-text group-hover:text-store-primary">
                                  {service.name}
                                </div>
                                <div className="text-xs text-gray-500 mt-1">
                                  {service.description}
                                </div>
                              </div>
                            </Link>
                          )
                        })}
                      </div>

                      <div className="border-t border-gray-200 pt-4 mt-4">
                        <Link
                          href="/services"
                          className="block w-full text-center bg-store-primary text-white py-2 rounded-lg font-medium hover:bg-store-primary-dark transition-colors"
                        >
                          View All Services
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Direct Links */}
              <Link href="/makers" className="text-store-text hover:text-store-primary transition-colors font-semibold">
                Makers
              </Link>
              <Link href="/enterprise" className="text-store-text hover:text-store-primary transition-colors font-semibold">
                Enterprise
              </Link>
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SmartSearch
              placeholder="Search products, services, or makers... (⌘K)"
              className="w-full"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-4">
            {/* Search Icon - Mobile */}
            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Notifications */}
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-store-error rounded-full text-xs text-white flex items-center justify-center">
                3
              </span>
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button variant="ghost" size="icon" className="relative">
              <ShoppingCart className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-store-primary rounded-full text-xs text-white flex items-center justify-center">
                2
              </span>
            </Button>

            {/* User Menu */}
            <div className="relative">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="hidden sm:flex"
              >
                <User className="h-5 w-5" />
              </Button>

              {/* User Dropdown */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                  <Link href="/profile" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Link>
                  <Link href="/orders" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Package className="h-4 w-4 mr-2" />
                    Orders
                  </Link>
                  <Link href="/provider-dashboard" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Printer className="h-4 w-4 mr-2" />
                    Provider Dashboard
                  </Link>
                  <Link href="/settings" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="h-4 w-4 mr-2" />
                    Settings
                  </Link>
                  <hr className="my-1" />
                  <button className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>

            {/* Sign In Button */}
            <Button variant="outline" size="sm" className="hidden sm:flex">
              Sign In
            </Button>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden"
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4">
            {/* Mobile Search */}
            <div className="mb-4 md:hidden">
              <SmartSearch
                placeholder="Search products..."
                className="w-full"
              />
            </div>

            {/* Mobile Navigation */}
            <div className="space-y-4">
              {/* Categories Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Shop Categories
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {featuredCategories.map(category => (
                    <Link
                      key={category.id}
                      href={`/catalog/${category.slug}`}
                      className="flex items-center p-2 text-sm text-store-text hover:text-store-primary hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      {category.name}
                    </Link>
                  ))}
                </div>
                <Link
                  href="/catalog"
                  className="block w-full text-center bg-gray-100 text-store-text py-2 rounded-lg font-medium hover:bg-gray-200 transition-colors mt-3"
                >
                  Browse All Products
                </Link>
              </div>

              {/* Services Section */}
              <div className="pb-4 border-b border-gray-200">
                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">
                  Services
                </h3>
                <div className="space-y-2">
                  {servicesMenu.slice(0, 3).map(service => {
                    const Icon = service.icon
                    return (
                      <Link
                        key={service.name}
                        href={service.href}
                        className="flex items-center p-2 text-sm text-store-text hover:text-store-primary hover:bg-gray-50 rounded-lg transition-colors"
                      >
                        <Icon className="h-4 w-4 mr-2" />
                        {service.name}
                      </Link>
                    )
                  })}
                </div>
              </div>

              {/* Main Navigation */}
              <div className="space-y-2">
                <Link href="/makers" className="block text-store-text hover:text-store-primary transition-colors font-semibold">
                  Makers
                </Link>
                <Link href="/enterprise" className="block text-store-text hover:text-store-primary transition-colors font-semibold">
                  Enterprise
                </Link>
              </div>

              <hr className="my-4" />

              {/* User Section */}
              <div className="space-y-2">
                <Link href="/profile" className="block text-store-text hover:text-store-primary transition-colors font-semibold">
                  Profile
                </Link>
                <Link href="/orders" className="block text-store-text hover:text-store-primary transition-colors font-semibold">
                  My Orders
                </Link>
                <Button variant="gradient" size="sm" className="w-full mt-4 font-semibold">
                  Sign In
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
