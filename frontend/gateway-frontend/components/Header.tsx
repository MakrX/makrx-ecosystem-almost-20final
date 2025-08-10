import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ExternalLink, Grid3X3 } from 'lucide-react';
import { ThemeToggle } from '../lib/ui';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLauncher, setShowLauncher] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navigation = [
    { name: 'Ecosystem', href: '/ecosystem' },
    { name: 'Makerspaces', href: '/makerspaces' },
    { name: 'Store', href: '/store' },
    { name: 'Events', href: '/events' },
    { name: 'Blog', href: '/blog' },
    { name: 'Docs', href: '/docs' }
  ];

  const launcherApps = [
    {
      name: 'MakrCave',
      description: 'Makerspace Management',
      url: 'https://makrcave.com',
      bgColor: 'bg-blue-100 dark:bg-blue-900',
      iconColor: 'bg-blue-500 dark:bg-blue-400'
    },
    {
      name: 'MakrX.Store',
      description: 'Tools & Components',
      url: 'https://makrx.store',
      bgColor: 'bg-green-100 dark:bg-green-900',
      iconColor: 'bg-green-500 dark:bg-green-400'
    },
    {
      name: '3D.MakrX.Store',
      description: 'Custom Fabrication',
      url: 'https://3d.makrx.store',
      bgColor: 'bg-purple-100 dark:bg-purple-900',
      iconColor: 'bg-purple-500 dark:bg-purple-400'
    },
    {
      name: 'Provider Panel',
      description: 'Service Providers',
      url: 'https://providers.makrx.org',
      bgColor: 'bg-orange-100 dark:bg-orange-900',
      iconColor: 'bg-orange-500 dark:bg-orange-400'
    }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <div className="w-8 h-8 bg-makrx-blue rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white transition-colors">MakrX</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors ${
                  isActive(item.href)
                    ? 'text-makrx-blue dark:text-makrx-blue'
                    : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Universal Launcher */}
            <div className="relative">
              <button
                onClick={() => setShowLauncher(!showLauncher)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Launch Apps"
              >
                <Grid3X3 className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </button>

              {/* Launcher Dropdown */}
              {showLauncher && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 p-4 z-50">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-3">MakrX Apps</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {launcherApps.map((app) => (
                      <a
                        key={app.name}
                        href={app.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 rounded-lg border border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-sm dark:hover:bg-gray-700 transition-all group"
                      >
                        <div className={`w-8 h-8 ${app.bgColor} rounded-lg flex items-center justify-center mb-2 transition-colors`}>
                          <div className={`w-4 h-4 ${app.iconColor} rounded transition-colors`}></div>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white group-hover:text-makrx-blue dark:group-hover:text-makrx-blue transition-colors">
                          {app.name}
                        </div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{app.description}</div>
                      </a>
                    ))}
                  </div>
                  <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-600">
                    <Link
                      to="/docs"
                      className="text-sm text-makrx-blue hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                      onClick={() => setShowLauncher(false)}
                    >
                      View Documentation →
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* Theme Toggle */}
            <ThemeToggle variant="compact" />

            {/* Sign In Button */}
            <a
              href="https://auth.makrx.org/login"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 bg-makrx-blue text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Sign In
            </a>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? (
              <X className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Menu className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <nav className="space-y-4">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block text-sm font-medium transition-colors ${
                    isActive(item.href)
                      ? 'text-makrx-blue dark:text-makrx-blue'
                      : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {/* Mobile Launcher */}
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="text-sm font-medium text-gray-900 dark:text-white mb-3">MakrX Apps</div>
                <div className="space-y-2">
                  {launcherApps.map((app) => (
                    <a
                      key={app.name}
                      href={app.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                    >
                      <div className={`w-6 h-6 bg-${app.color}-100 rounded flex items-center justify-center`}>
                        <div className={`w-3 h-3 bg-${app.color}-500 rounded`}></div>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900 dark:text-white">{app.name}</div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">{app.description}</div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 dark:text-gray-500 ml-auto" />
                    </a>
                  ))}
                </div>
              </div>
              
              {/* Mobile Theme Toggle & Sign In */}
              <div className="pt-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">Theme</span>
                  <ThemeToggle showLabel />
                </div>
                <a
                  href="https://auth.makrx.org/login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full px-4 py-2 bg-makrx-blue text-white rounded-lg text-sm font-medium text-center hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </a>
              </div>
            </nav>
          </div>
        )}
      </div>

      {/* Backdrop for launcher */}
      {showLauncher && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowLauncher(false)}
        />
      )}
    </header>
  );
}
