'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
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
  Bell
} from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

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
              <Link href="/catalog" className="text-gray-700 hover:text-store-primary transition-colors font-medium">
                Catalog
              </Link>
              <Link href="/3d-printing" className="text-gray-700 hover:text-store-primary transition-colors font-medium flex items-center">
                <Printer className="h-4 w-4 mr-1" />
                3D Printing
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-store-primary transition-colors font-medium">
                Services
              </Link>
              <Link href="/makers" className="text-gray-700 hover:text-store-primary transition-colors font-medium">
                Makers
              </Link>
              <Link href="/enterprise" className="text-gray-700 hover:text-store-primary transition-colors font-medium">
                Enterprise
              </Link>
            </nav>
          </div>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products, services, or makers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-store-primary focus:border-transparent bg-white"
                />
              </div>
            </form>
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
            <form onSubmit={handleSearch} className="mb-4 md:hidden">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-store-primary focus:border-transparent bg-white"
                />
              </div>
            </form>

            {/* Mobile Navigation */}
            <div className="space-y-3">
              <Link href="/catalog" className="block text-gray-700 hover:text-store-primary transition-colors font-medium">
                Catalog
              </Link>
              <Link href="/3d-printing" className="block text-gray-700 hover:text-store-primary transition-colors font-medium">
                3D Printing Hub
              </Link>
              <Link href="/services" className="block text-gray-700 hover:text-store-primary transition-colors font-medium">
                Services
              </Link>
              <Link href="/makers" className="block text-gray-700 hover:text-store-primary transition-colors font-medium">
                Makers
              </Link>
              <Link href="/enterprise" className="block text-gray-700 hover:text-store-primary transition-colors font-medium">
                Enterprise
              </Link>
              <hr className="my-4" />
              <Link href="/profile" className="block text-gray-700 hover:text-store-primary transition-colors font-medium">
                Profile
              </Link>
              <Link href="/orders" className="block text-gray-700 hover:text-store-primary transition-colors font-medium">
                My Orders
              </Link>
              <Button variant="gradient" size="sm" className="w-full mt-4">
                Sign In
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
