'use client'

import React, { useState, useEffect, useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Layout from '@/components/layout/Layout'
import { Button } from '@/components/ui/Button'
import { 
  Search,
  Filter,
  X,
  ChevronDown,
  Grid3X3,
  List,
  Star,
  ShoppingCart,
  Heart,
  Compare,
  Eye,
  Package,
  Truck,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight
} from 'lucide-react'
import { products, categories, filters, filterProducts, sortProducts, type Product } from '@/data/products'

export default function CatalogPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  
  // State management
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '')
  const [selectedFilters, setSelectedFilters] = useState<{ [key: string]: any }>({})
  const [sortBy, setSortBy] = useState(searchParams.get('sort') || 'relevance')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [showFilters, setShowFilters] = useState(false)
  const [compareList, setCompareList] = useState<string[]>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage] = useState(24)

  // Filter and search products
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [displayProducts, setDisplayProducts] = useState<Product[]>([])

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement) return
      
      switch (e.key) {
        case '/':
          e.preventDefault()
          document.getElementById('search-input')?.focus()
          break
        case 'f':
          e.preventDefault()
          setShowFilters(prev => !prev)
          break
        case '?':
          e.preventDefault()
          // Show shortcuts modal (implement later)
          break
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [])

  // Update products when filters or search change
  useEffect(() => {
    let filtered = products

    // Apply search
    if (searchQuery.trim()) {
      const searchTerm = searchQuery.toLowerCase()
      filtered = filtered.filter(product =>
        product.name.toLowerCase().includes(searchTerm) ||
        product.description.toLowerCase().includes(searchTerm) ||
        product.brand.toLowerCase().includes(searchTerm) ||
        product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      )
    }

    // Apply filters
    filtered = filterProducts(filtered, selectedFilters)

    // Apply sorting
    filtered = sortProducts(filtered, sortBy)

    setFilteredProducts(filtered)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchQuery, selectedFilters, sortBy])

  // Update displayed products for pagination
  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    setDisplayProducts(filteredProducts.slice(startIndex, endIndex))
  }, [filteredProducts, currentPage, itemsPerPage])

  // Update URL with search params
  const updateURL = useCallback(() => {
    const params = new URLSearchParams()
    if (searchQuery) params.set('q', searchQuery)
    if (sortBy !== 'relevance') params.set('sort', sortBy)
    if (Object.keys(selectedFilters).length > 0) {
      params.set('filters', JSON.stringify(selectedFilters))
    }
    router.replace(`/catalog?${params.toString()}`, { scroll: false })
  }, [searchQuery, sortBy, selectedFilters, router])

  useEffect(() => {
    const timer = setTimeout(updateURL, 300)
    return () => clearTimeout(timer)
  }, [updateURL])

  const handleFilterChange = (filterId: string, value: any, checked?: boolean) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev }
      
      if (filterId === 'priceMin' || filterId === 'priceMax') {
        newFilters[filterId] = value
      } else {
        if (!newFilters[filterId]) newFilters[filterId] = []
        
        if (checked) {
          newFilters[filterId] = [...newFilters[filterId], value]
        } else {
          newFilters[filterId] = newFilters[filterId].filter((v: any) => v !== value)
        }
        
        if (newFilters[filterId].length === 0) {
          delete newFilters[filterId]
        }
      }
      
      return newFilters
    })
  }

  const clearFilter = (filterId: string) => {
    setSelectedFilters(prev => {
      const newFilters = { ...prev }
      delete newFilters[filterId]
      return newFilters
    })
  }

  const clearAllFilters = () => {
    setSelectedFilters({})
    setSearchQuery('')
  }

  const toggleCompare = (productId: string) => {
    setCompareList(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : prev.length < 3 ? [...prev, productId] : prev
    )
  }

  const getActiveFilterCount = () => {
    return Object.keys(selectedFilters).length + (searchQuery ? 1 : 0)
  }

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-white border-b border-gray-200 sticky top-16 z-40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
            {/* Search Bar */}
            <div className="flex items-center gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  id="search-input"
                  type="text"
                  placeholder="Search products, brands, or parts... (Press / to focus)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-store-primary focus:border-store-primary bg-white text-store-text font-medium text-lg"
                />
              </div>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={`${showFilters ? 'bg-store-primary text-white' : ''} relative`}
                data-filters-toggle
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
                {getActiveFilterCount() > 0 && (
                  <span className="absolute -top-2 -right-2 h-5 w-5 bg-store-error text-white text-xs rounded-full flex items-center justify-center">
                    {getActiveFilterCount()}
                  </span>
                )}
              </Button>
            </div>

            {/* Results and Sort */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <p className="text-store-text-light">
                  <span className="font-semibold text-store-text">{filteredProducts.length}</span> products found
                  {searchQuery && <span> for "{searchQuery}"</span>}
                </p>
                
                {/* Active Filters */}
                {(Object.keys(selectedFilters).length > 0 || searchQuery) && (
                  <div className="flex items-center gap-2">
                    {searchQuery && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-store-primary text-white">
                        Search: "{searchQuery}"
                        <button onClick={() => setSearchQuery('')} className="ml-2">
                          <X className="h-3 w-3" />
                        </button>
                      </span>
                    )}
                    {Object.entries(selectedFilters).map(([key, values]) => {
                      if (key === 'priceMin' || key === 'priceMax') return null
                      return (Array.isArray(values) ? values : [values]).map((value, idx) => (
                        <span key={`${key}-${idx}`} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-200 text-gray-800">
                          {value}
                          <button onClick={() => handleFilterChange(key, value, false)} className="ml-2">
                            <X className="h-3 w-3" />
                          </button>
                        </span>
                      ))
                    })}
                    <Button variant="ghost" size="sm" onClick={clearAllFilters}>
                      Clear all
                    </Button>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-4">
                {/* View Mode Toggle */}
                <div className="flex items-center border border-gray-300 rounded-lg">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 ${viewMode === 'grid' ? 'bg-store-primary text-white' : 'text-gray-600'}`}
                    data-view="grid"
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 ${viewMode === 'list' ? 'bg-store-primary text-white' : 'text-gray-600'}`}
                    data-view="list"
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>

                {/* Sort Dropdown */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-store-primary focus:border-store-primary bg-white text-store-text"
                >
                  <option value="relevance">Sort by Relevance</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex gap-8">
            {/* Filters Sidebar */}
            {showFilters && (
              <div className="w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-32">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-store-text">Filters</h3>
                  <button onClick={() => setShowFilters(false)}>
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>

                <div className="space-y-6">
                  {filters.map(filter => (
                    <div key={filter.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                      <h4 className="font-medium text-store-text mb-3">{filter.name}</h4>
                      
                      {filter.type === 'checkbox' && filter.options && (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                          {filter.options.map(option => (
                            <label key={option.value} className="flex items-center">
                              <input
                                type="checkbox"
                                checked={selectedFilters[filter.id]?.includes(option.value) || false}
                                onChange={(e) => handleFilterChange(filter.id, option.value, e.target.checked)}
                                className="rounded border-gray-300 text-store-primary focus:ring-store-primary"
                              />
                              <span className="ml-2 text-sm text-store-text-light">
                                {option.label}
                                {option.count && <span className="text-gray-400 ml-1">({option.count})</span>}
                              </span>
                            </label>
                          ))}
                        </div>
                      )}

                      {filter.type === 'range' && (
                        <div className="space-y-3">
                          <div className="flex gap-2">
                            <input
                              type="number"
                              placeholder="Min"
                              value={selectedFilters.priceMin || ''}
                              onChange={(e) => handleFilterChange('priceMin', e.target.value ? Number(e.target.value) : undefined)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                            <input
                              type="number"
                              placeholder="Max"
                              value={selectedFilters.priceMax || ''}
                              onChange={(e) => handleFilterChange('priceMax', e.target.value ? Number(e.target.value) : undefined)}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded text-sm"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Products Grid/List */}
            <div className="flex-1">
              {displayProducts.length === 0 ? (
                <div className="text-center py-16">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-store-text mb-2">No products found</h3>
                  <p className="text-store-text-muted mb-6">Try adjusting your search or filters</p>
                  <Button onClick={clearAllFilters} variant="outline">
                    Clear all filters
                  </Button>
                </div>
              ) : (
                <>
                  {/* Products */}
                  <div className={viewMode === 'grid' 
                    ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                    : 'space-y-4'
                  }>
                    {displayProducts.map(product => (
                      <div 
                        key={product.id} 
                        className={`bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg transition-all duration-200 ${
                          viewMode === 'list' ? 'flex items-center p-4' : 'overflow-hidden'
                        }`}
                      >
                        {viewMode === 'grid' ? (
                          <>
                            {/* Grid View */}
                            <div className="relative">
                              <img 
                                src={product.images[0]} 
                                alt={product.name}
                                className="w-full h-48 object-cover"
                              />
                              {product.onSale && (
                                <span className="absolute top-2 left-2 bg-store-error text-white px-2 py-1 rounded text-xs font-semibold">
                                  Sale
                                </span>
                              )}
                              {product.newArrival && (
                                <span className="absolute top-2 right-2 bg-store-primary text-white px-2 py-1 rounded text-xs font-semibold">
                                  New
                                </span>
                              )}
                              <div className="absolute bottom-2 right-2 flex gap-1">
                                <button 
                                  onClick={() => toggleCompare(product.id)}
                                  className={`p-2 rounded-full ${compareList.includes(product.id) ? 'bg-store-primary text-white' : 'bg-white/90 text-gray-600'} hover:bg-store-primary hover:text-white transition-colors`}
                                >
                                  <Compare className="h-4 w-4" />
                                </button>
                                <button className="p-2 bg-white/90 rounded-full text-gray-600 hover:bg-white hover:text-red-500 transition-colors">
                                  <Heart className="h-4 w-4" />
                                </button>
                              </div>
                            </div>
                            <div className="p-4">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className="font-semibold text-store-text text-sm leading-tight line-clamp-2">
                                  {product.name}
                                </h3>
                                {!product.inStock && (
                                  <span className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">
                                    Out of Stock
                                  </span>
                                )}
                              </div>
                              <p className="text-store-text-muted text-xs mb-2 line-clamp-2">
                                {product.shortDescription}
                              </p>
                              <div className="flex items-center mb-2">
                                <div className="flex items-center">
                                  {[...Array(5)].map((_, i) => (
                                    <Star 
                                      key={i} 
                                      className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                    />
                                  ))}
                                </div>
                                <span className="text-xs text-store-text-muted ml-1">
                                  ({product.reviewCount})
                                </span>
                              </div>
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2">
                                  <span className="font-bold text-store-text">
                                    ${product.price}
                                  </span>
                                  {product.originalPrice && (
                                    <span className="text-sm text-gray-400 line-through">
                                      ${product.originalPrice}
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center text-xs text-green-600">
                                  <Truck className="h-3 w-3 mr-1" />
                                  Free shipping
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Link href={`/product/${product.id}`} className="flex-1">
                                  <Button variant="outline" size="sm" className="w-full text-xs">
                                    <Eye className="h-3 w-3 mr-1" />
                                    View
                                  </Button>
                                </Link>
                                <Button 
                                  size="sm" 
                                  className="flex-1 text-xs font-semibold"
                                  disabled={!product.inStock}
                                >
                                  <ShoppingCart className="h-3 w-3 mr-1" />
                                  Add
                                </Button>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            {/* List View */}
                            <img 
                              src={product.images[0]} 
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                            />
                            <div className="flex-1 ml-4">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h3 className="font-semibold text-store-text mb-1">{product.name}</h3>
                                  <p className="text-store-text-muted text-sm mb-2">{product.shortDescription}</p>
                                  <div className="flex items-center gap-4 text-xs text-store-text-light">
                                    <div className="flex items-center">
                                      {[...Array(5)].map((_, i) => (
                                        <Star 
                                          key={i} 
                                          className={`h-3 w-3 ${i < Math.floor(product.rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                                        />
                                      ))}
                                      <span className="ml-1">({product.reviewCount})</span>
                                    </div>
                                    <span>SKU: {product.sku}</span>
                                    {product.inStock ? (
                                      <span className="text-green-600">In Stock ({product.stockCount})</span>
                                    ) : (
                                      <span className="text-red-600">Out of Stock</span>
                                    )}
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-2 mb-2">
                                    <span className="font-bold text-lg text-store-text">${product.price}</span>
                                    {product.originalPrice && (
                                      <span className="text-sm text-gray-400 line-through">${product.originalPrice}</span>
                                    )}
                                  </div>
                                  <div className="flex gap-2">
                                    <button 
                                      onClick={() => toggleCompare(product.id)}
                                      className={`p-2 rounded ${compareList.includes(product.id) ? 'bg-store-primary text-white' : 'bg-gray-100 text-gray-600'}`}
                                    >
                                      <Compare className="h-4 w-4" />
                                    </button>
                                    <button className="p-2 bg-gray-100 rounded text-gray-600 hover:text-red-500">
                                      <Heart className="h-4 w-4" />
                                    </button>
                                    <Link href={`/product/${product.id}`}>
                                      <Button variant="outline" size="sm">
                                        View Details
                                      </Button>
                                    </Link>
                                    <Button size="sm" disabled={!product.inStock} className="font-semibold">
                                      <ShoppingCart className="h-4 w-4 mr-1" />
                                      Add to Cart
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? 'default' : 'outline'}
                            onClick={() => setCurrentPage(page)}
                            size="sm"
                          >
                            {page}
                          </Button>
                        )
                      })}
                      
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Compare Drawer */}
        {compareList.length > 0 && (
          <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-store-text">
                    Compare ({compareList.length}/3)
                  </span>
                  <div className="flex gap-2">
                    {compareList.map(productId => {
                      const product = products.find(p => p.id === productId)
                      return product ? (
                        <div key={productId} className="flex items-center gap-2 bg-gray-100 rounded px-3 py-1">
                          <span className="text-sm">{product.name}</span>
                          <button onClick={() => toggleCompare(productId)}>
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ) : null
                    })}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setCompareList([])}>
                    Clear All
                  </Button>
                  <Button disabled={compareList.length < 2}>
                    Compare Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Keyboard Shortcuts Hint */}
        <div className="fixed bottom-4 right-4 z-40">
          <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-xs">
            Press <kbd className="bg-white text-gray-900 px-1 rounded">?</kbd> for shortcuts
          </div>
        </div>
      </div>
    </Layout>
  )
}
