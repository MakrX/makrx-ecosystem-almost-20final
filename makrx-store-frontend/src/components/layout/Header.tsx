'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingCart, Menu, X, User, LogOut, Package, Settings } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { api, type Category, type Product } from '@/lib/api';
import SmartSearch from '@/components/SmartSearch';
import NotificationDropdown from '@/components/NotificationDropdown';
import { ThemeToggle, ThemeToggleCompact } from '@/components/ThemeToggle';

export function Header() {
  const { user, isAuthenticated, login, logout } = useAuth();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<number | null>(null);

  // Load categories and cart count
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const categoriesData = await api.getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to load categories:', error);
      }
    };

    const loadCartCount = async () => {
      if (isAuthenticated) {
        try {
          const cart = await api.getCart();
          setCartItemCount(cart.item_count);
        } catch (error) {
          console.error('Failed to load cart:', error);
        }
      }
    };

    loadCategories();
    loadCartCount();
  }, [isAuthenticated]);

  const handleSearch = async (query: string) => {
    if (query.trim()) {
      router.push(`/catalog?q=${encodeURIComponent(query.trim())}`);
    }
  };

  const handleCategoryClick = (category: Category) => {
    router.push(`/catalog/category/${category.slug}`);
    setIsMenuOpen(false);
  };

  const handleUserMenuClick = (action: string) => {
    switch (action) {
      case 'account':
        router.push('/account');
        break;
      case 'orders':
        router.push('/account/orders');
        break;
      case 'settings':
        router.push('/account/settings');
        break;
      case 'logout':
        logout();
        break;
    }
  };

  // Group categories by parent
  const rootCategories = categories.filter(cat => !cat.parent_id);
  const getSubcategories = (parentId: number) => 
    categories.filter(cat => cat.parent_id === parentId);

  return (
    <header className="bg-background border-b border-border sticky top-0 z-50 backdrop-blur-sm bg-background/90">
      {/* Main header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">MakrX</div>
              <span className="text-muted-foreground">Store</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/catalog" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Catalog
            </Link>

            {/* Categories Dropdown */}
            <div className="relative group">
              <button className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                Categories
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute left-0 mt-2 w-96 bg-popover border border-border shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="grid grid-cols-2 gap-2 p-4">
                  {rootCategories.map((category) => (
                    <div
                      key={category.id}
                      className="p-2 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
                      onMouseEnter={() => setHoveredCategory(category.id)}
                      onMouseLeave={() => setHoveredCategory(null)}
                      onClick={() => handleCategoryClick(category)}
                    >
                      <div className="font-medium text-popover-foreground">{category.name}</div>
                      <div className="text-sm text-muted-foreground mt-1">{category.description}</div>

                      {/* Subcategories */}
                      {hoveredCategory === category.id && (
                        <div className="mt-2 space-y-1">
                          {getSubcategories(category.id).map((subcat) => (
                            <div
                              key={subcat.id}
                              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer pl-2"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCategoryClick(subcat);
                              }}
                            >
                              {subcat.name}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Services Dropdown */}
            <div className="relative group">
              <button className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center">
                Services
                <svg className="ml-1 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className="absolute left-0 mt-2 w-64 bg-popover border border-border shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <div className="p-4 space-y-2">
                  <Link href="/3d-printing" className="block p-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                    <div className="font-medium text-popover-foreground">3D Printing</div>
                    <div className="text-sm text-muted-foreground">Professional printing services</div>
                  </Link>
                  <Link href="/upload" className="block p-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                    <div className="font-medium text-popover-foreground">Upload & Quote</div>
                    <div className="text-sm text-muted-foreground">Get instant pricing</div>
                  </Link>
                  <Link href="/sample-projects" className="block p-2 hover:bg-accent hover:text-accent-foreground rounded-md">
                    <div className="font-medium text-popover-foreground">Sample Projects</div>
                    <div className="text-sm text-muted-foreground">Explore our gallery</div>
                  </Link>
                </div>
              </div>
            </div>

            <Link href="/about" className="text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              About
            </Link>
          </nav>

          {/* Search, Cart, User Actions */}
          <div className="flex items-center space-x-4">
            {/* Smart Search */}
            <div className="hidden md:block">
              <SmartSearch onSearch={handleSearch} />
            </div>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart" className="relative p-2 text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount > 9 ? '9+' : cartItemCount}
                </span>
              )}
            </Link>

            {/* Notifications */}
            {isAuthenticated && <NotificationDropdown />}

            {/* User Menu */}
            {isAuthenticated ? (
              <div className="relative group">
                <button className="flex items-center space-x-2 p-2 text-foreground hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  <User className="h-6 w-6" />
                  <span className="hidden md:block text-sm">{user?.name || user?.email}</span>
                </button>

                <div className="absolute right-0 mt-2 w-48 bg-popover border border-border shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                  <div className="py-2">
                    <button
                      onClick={() => handleUserMenuClick('account')}
                      className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Account
                    </button>
                    <button
                      onClick={() => handleUserMenuClick('orders')}
                      className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center"
                    >
                      <Package className="h-4 w-4 mr-2" />
                      My Orders
                    </button>
                    <button
                      onClick={() => handleUserMenuClick('settings')}
                      className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Settings
                    </button>
                    {user?.roles.includes('admin') && (
                      <button
                        onClick={() => router.push('/admin')}
                        className="w-full text-left px-4 py-2 text-sm text-popover-foreground hover:bg-accent hover:text-accent-foreground flex items-center"
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Admin Panel
                      </button>
                    )}
                    <hr className="my-1 border-border" />
                    <ThemeToggleCompact />
                    <hr className="my-1 border-border" />
                    <button
                      onClick={() => handleUserMenuClick('logout')}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <button
                onClick={login}
                className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sign In
              </button>
            )}

            {/* Mobile menu toggle */}
            <button
              className="md:hidden p-2 text-gray-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1 bg-white">
            {/* Mobile Search */}
            <div className="py-2">
              <SmartSearch onSearch={handleSearch} />
            </div>

            <Link
              href="/catalog"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Catalog
            </Link>

            {/* Mobile Categories */}
            <div className="py-2">
              <div className="font-medium text-gray-900 mb-2">Categories</div>
              {rootCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryClick(category)}
                  className="block w-full text-left py-1 pl-4 text-gray-600 hover:text-blue-600"
                >
                  {category.name}
                </button>
              ))}
            </div>

            {/* Mobile Services */}
            <div className="py-2">
              <div className="font-medium text-gray-900 mb-2">Services</div>
              <Link
                href="/3d-printing"
                className="block py-1 pl-4 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                3D Printing
              </Link>
              <Link
                href="/upload"
                className="block py-1 pl-4 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Upload & Quote
              </Link>
              <Link
                href="/sample-projects"
                className="block py-1 pl-4 text-gray-600 hover:text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                Sample Projects
              </Link>
            </div>

            <Link
              href="/about"
              className="block py-2 text-gray-700 hover:text-blue-600"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>

            {/* Mobile user menu */}
            {isAuthenticated && (
              <div className="py-2 border-t border-gray-200">
                <div className="font-medium text-gray-900 mb-2">Account</div>
                <button
                  onClick={() => {
                    handleUserMenuClick('account');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-1 pl-4 text-gray-600 hover:text-blue-600"
                >
                  My Account
                </button>
                <button
                  onClick={() => {
                    handleUserMenuClick('orders');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-1 pl-4 text-gray-600 hover:text-blue-600"
                >
                  My Orders
                </button>
                <button
                  onClick={() => {
                    handleUserMenuClick('logout');
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-1 pl-4 text-red-600 hover:text-red-700"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
