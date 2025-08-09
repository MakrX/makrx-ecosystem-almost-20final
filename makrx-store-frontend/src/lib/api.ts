/**
 * MakrX Store API Client
 * Comprehensive integration with FastAPI backend
 */

import { getToken } from './auth'
import { products as mockProducts, categories as mockCategories } from '@/data/products'

// API Configuration
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const API_VERSION = 'v1'

// Types
export interface ApiResponse<T> {
  data: T
  success: boolean
  message?: string
  request_id?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  per_page: number
  pages: number
  has_next: boolean
  has_prev: boolean
}

export interface Product {
  id: number
  slug: string
  name: string
  description: string
  short_description?: string
  brand?: string
  category_id: number
  price: number
  sale_price?: number
  currency: string
  stock_qty: number
  track_inventory: boolean
  allow_backorder: boolean
  attributes: Record<string, any>
  specifications: Record<string, any>
  compatibility: string[]
  images: string[]
  videos: string[]
  meta_title?: string
  meta_description?: string
  tags: string[]
  is_active: boolean
  is_featured: boolean
  is_digital: boolean
  weight?: number
  dimensions: Record<string, number>
  created_at: string
  updated_at?: string
  category?: Category
  effective_price: number
  in_stock: boolean
}

export interface Category {
  id: number
  name: string
  slug: string
  description?: string
  parent_id?: number
  image_url?: string
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at?: string
  children: Category[]
  parent?: Category
}

export interface Cart {
  id: string
  user_id?: string
  session_id?: string
  currency: string
  items: CartItem[]
  subtotal: number
  item_count: number
  created_at: string
  updated_at?: string
}

export interface CartItem {
  id: number
  cart_id: string
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  meta: Record<string, any>
  product?: Product
  created_at: string
  updated_at?: string
}

export interface Order {
  id: number
  order_number: string
  user_id?: string
  email: string
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded'
  currency: string
  subtotal: number
  tax_amount: number
  shipping_amount: number
  discount_amount: number
  total: number
  payment_id?: string
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  payment_method?: string
  addresses: {
    billing: Address
    shipping: Address
  }
  shipping_method?: string
  tracking_number?: string
  notes?: string
  items: OrderItem[]
  created_at: string
  updated_at?: string
  shipped_at?: string
  delivered_at?: string
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  unit_price: number
  total_price: number
  product_name: string
  product_sku?: string
  meta: Record<string, any>
  product?: Product
  created_at: string
}

export interface Address {
  name: string
  line1: string
  line2?: string
  city: string
  state: string
  postal_code: string
  country: string
  phone?: string
}

export interface Upload {
  id: string
  user_id?: string
  session_id?: string
  file_key: string
  file_name: string
  file_hash?: string
  file_size: number
  mime_type: string
  dimensions: Record<string, number>
  volume_mm3?: number
  surface_area_mm2?: number
  mesh_info: Record<string, any>
  status: 'uploaded' | 'processing' | 'processed' | 'failed' | 'expired'
  error_message?: string
  created_at: string
  processed_at?: string
  expires_at?: string
}

export interface Quote {
  id: string
  upload_id: string
  user_id?: string
  material: string
  quality: string
  color: string
  infill_percentage: number
  layer_height: number
  supports: boolean
  settings: Record<string, any>
  estimated_weight_g?: number
  estimated_time_minutes?: number
  estimated_material_cost?: number
  estimated_labor_cost?: number
  estimated_machine_cost?: number
  price: number
  currency: string
  expires_at: string
  status: 'active' | 'expired' | 'accepted' | 'cancelled'
  pickup_location?: string
  delivery_address?: Record<string, any>
  shipping_cost: number
  created_at: string
  accepted_at?: string
  upload?: Upload
}

export interface ServiceOrder {
  id: string
  order_id?: number
  quote_id: string
  provider_id?: number
  service_order_number: string
  priority: 'low' | 'normal' | 'high' | 'urgent'
  status: 'pending' | 'routed' | 'accepted' | 'rejected' | 'printing' | 'post_processing' | 'quality_check' | 'ready' | 'shipped' | 'delivered' | 'cancelled'
  milestones: Record<string, any>
  estimated_completion?: string
  actual_completion?: string
  tracking: Record<string, any>
  production_notes?: string
  quality_notes?: string
  shipping_method?: string
  tracking_number?: string
  delivery_instructions?: string
  customer_notes?: string
  provider_notes?: string
  created_at: string
  updated_at?: string
  quote?: Quote
}

// API Client Class
class ApiClient {
  private baseURL: string
  private sessionId: string | null = null

  constructor() {
    this.baseURL = API_BASE_URL
    this.sessionId = this.getSessionId()
  }

  private getSessionId(): string {
    if (typeof window !== 'undefined') {
      let sessionId = localStorage.getItem('makrx_session_id')
      if (!sessionId) {
        sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        localStorage.setItem('makrx_session_id', sessionId)
      }
      return sessionId
    }
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`
    const token = await getToken()

    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Session-ID': this.sessionId,
      ...options.headers
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`
    }

    const config: RequestInit = {
      ...options,
      headers
    }

    try {
      const response = await fetch(url, config)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`)
      }

      return await response.json()
    } catch (error) {
      console.error(`API request failed: ${endpoint}`, error)

      // Fallback to mock data for development when backend is not available
      if (error instanceof TypeError && error.message === 'Failed to fetch') {
        console.warn(`Backend not available, using mock data for: ${endpoint}`)
        return this.getMockData<T>(endpoint)
      }

      throw error
    }
  }

  private getMockData<T>(endpoint: string): T {
    // Mock data responses for when backend is not available
    const path = endpoint.split('?')[0] // Remove query params for matching

    switch (path) {
      case '/catalog/products':
        return this.getMockProducts() as T
      case '/catalog/categories':
        return this.getMockCategories() as T
      default:
        throw new Error(`No mock data available for endpoint: ${endpoint}`)
    }
  }

  // Health Check
  async healthCheck() {
    return this.request<{ status: string; timestamp: string }>('/health')
  }

  // Authentication
  async getCurrentUser() {
    return this.request<{
      user_id: string
      email: string
      name: string
      roles: string[]
      email_verified: boolean
    }>('/auth/me')
  }

  // Products
  async getProducts(params: {
    q?: string
    category_id?: number
    brand?: string
    price_min?: number
    price_max?: number
    in_stock?: boolean
    is_featured?: boolean
    tags?: string[]
    sort?: string
    page?: number
    per_page?: number
  } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          value.forEach(v => searchParams.append(key, v))
        } else {
          searchParams.append(key, value.toString())
        }
      }
    })

    return this.request<{
      products: Product[]
      total: number
      page: number
      per_page: number
      pages: number
    }>(`/catalog/products?${searchParams}`)
  }

  async getProduct(id: number) {
    return this.request<Product>(`/catalog/products/${id}`)
  }

  async getProductBySlug(slug: string) {
    return this.request<Product>(`/catalog/products/slug/${slug}`)
  }

  async getFeaturedProducts(limit = 10) {
    return this.request<Product[]>(`/catalog/products/featured?limit=${limit}`)
  }

  async getPopularProducts(params: { category_id?: number; limit?: number; days?: number } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<{ products: any[] }>(`/catalog/analytics/popular-products?${searchParams}`)
  }

  async getSearchSuggestions(query: string, limit = 10) {
    return this.request<{ suggestions: string[] }>(`/catalog/search/suggestions?q=${encodeURIComponent(query)}&limit=${limit}`)
  }

  async getBrands() {
    return this.request<{ brands: string[] }>('/catalog/brands')
  }

  // Categories
  async getCategories(params: { parent_id?: number; include_inactive?: boolean } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<Category[]>(`/catalog/categories?${searchParams}`)
  }

  async getCategory(id: number) {
    return this.request<Category>(`/catalog/categories/${id}`)
  }

  async getCategoryBySlug(slug: string) {
    return this.request<Category>(`/catalog/categories/slug/${slug}`)
  }

  async getProductsByCategory(categoryId: number, params: { page?: number; per_page?: number; sort?: string } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<{
      products: Product[]
      total: number
      page: number
      per_page: number
      pages: number
    }>(`/catalog/products/category/${categoryId}?${searchParams}`)
  }

  // Cart
  async getCart() {
    return this.request<Cart>('/cart')
  }

  async addToCart(productId: number, quantity: number, meta: Record<string, any> = {}) {
    return this.request<{ message: string }>('/cart/items', {
      method: 'POST',
      body: JSON.stringify({
        product_id: productId,
        quantity,
        meta
      })
    })
  }

  async updateCartItem(itemId: number, quantity: number, meta?: Record<string, any>) {
    const body: any = { quantity }
    if (meta) body.meta = meta

    return this.request<{ message: string }>(`/cart/items/${itemId}`, {
      method: 'PATCH',
      body: JSON.stringify(body)
    })
  }

  async removeFromCart(itemId: number) {
    return this.request<{ message: string }>(`/cart/items/${itemId}`, {
      method: 'DELETE'
    })
  }

  // Orders
  async getOrders(params: { page?: number; per_page?: number } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<{
      orders: Order[]
      total: number
      page: number
      per_page: number
      pages: number
    }>(`/orders?${searchParams}`)
  }

  async getOrder(id: number) {
    return this.request<Order>(`/orders/${id}`)
  }

  async checkout(data: {
    cart_id?: string
    items?: Array<{ product_id: number; quantity: number; meta?: Record<string, any> }>
    shipping_address: Address
    billing_address?: Address
    shipping_method: string
    payment_method: string
    coupon_code?: string
    notes?: string
  }) {
    return this.request<{
      order_id: number
      order_number: string
      total: number
      currency: string
      payment_intent: Record<string, any>
    }>('/orders/checkout', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  // File Uploads
  async createUploadUrl(filename: string, contentType: string, fileSize: number) {
    return this.request<{
      upload_id: string
      upload_url: string
      fields: Record<string, string>
      file_key: string
      expires_in: number
    }>('/uploads/sign', {
      method: 'POST',
      body: JSON.stringify({
        filename,
        content_type: contentType,
        file_size: fileSize
      })
    })
  }

  async completeUpload(uploadId: string, fileKey: string) {
    return this.request<{ message: string }>('/uploads/complete', {
      method: 'POST',
      body: JSON.stringify({
        upload_id: uploadId,
        file_key: fileKey
      })
    })
  }

  async getUpload(id: string) {
    return this.request<Upload>(`/uploads/${id}`)
  }

  // Quotes
  async createQuote(data: {
    upload_id: string
    material: string
    quality: string
    color?: string
    infill_percentage?: number
    layer_height?: number
    supports?: boolean
    quantity?: number
    rush_order?: boolean
    delivery_address?: Record<string, any>
    pickup_location?: string
  }) {
    return this.request<{
      quote_id: string
      price: number
      currency: string
      estimated_weight_g: number
      estimated_time_minutes: number
      breakdown: Record<string, any>
      material_usage: Record<string, any>
      print_parameters: Record<string, any>
      expires_at: string
    }>('/quotes', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getQuote(id: string) {
    return this.request<Quote>(`/quotes/${id}`)
  }

  async acceptQuote(id: string) {
    return this.request<{ message: string }>(`/quotes/${id}/accept`, {
      method: 'POST'
    })
  }

  // Service Orders
  async createServiceOrder(data: {
    quote_id: string
    order_id?: number
    priority?: string
    customer_notes?: string
    delivery_instructions?: string
  }) {
    return this.request<{
      service_order_id: string
      service_order_number: string
      status: string
    }>('/service-orders', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getServiceOrders(params: { page?: number; per_page?: number } = {}) {
    const searchParams = new URLSearchParams()
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        searchParams.append(key, value.toString())
      }
    })

    return this.request<{
      service_orders: ServiceOrder[]
      total: number
      page: number
      per_page: number
      pages: number
    }>(`/service-orders?${searchParams}`)
  }

  async getServiceOrder(id: string) {
    return this.request<ServiceOrder>(`/service-orders/${id}`)
  }

  // Material and Service Information
  async getMaterials() {
    return this.request<{
      materials: Array<{
        name: string
        display_name: string
        description: string
        properties: Record<string, any>
        colors_available: string[]
        price_per_cm3: number
        density_g_cm3: number
        recommended_layer_heights: number[]
        supports_required: boolean
        post_processing: string[]
      }>
    }>('/materials')
  }

  async getServiceCapabilities() {
    return this.request<{
      materials: any[]
      qualities: any[]
      max_dimensions: Record<string, number>
      max_volume_mm3: number
      file_formats: string[]
      max_file_size_mb: number
      turnaround_times: Record<string, string>
    }>('/capabilities')
  }

  // Mock data methods for fallback when backend is unavailable
  private getMockProducts() {
    // Transform mock data to match API response format
    const transformedProducts = mockProducts.map(product => ({
      id: parseInt(product.id),
      slug: product.id,
      name: product.name,
      description: product.description,
      short_description: product.shortDescription,
      brand: product.brand,
      category_id: 1,
      category: { id: 1, name: product.category, slug: product.category },
      price: product.originalPrice || product.price,
      sale_price: product.originalPrice ? product.price : null,
      effective_price: product.price,
      currency: 'USD',
      stock_qty: product.stockCount,
      track_inventory: true,
      in_stock: product.inStock,
      allow_backorder: false,
      attributes: {},
      specifications: product.specifications,
      compatibility: product.compatibility,
      images: product.images,
      videos: [],
      meta_title: product.name,
      meta_description: product.shortDescription,
      tags: product.tags,
      sku: product.sku,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    return {
      products: transformedProducts,
      total: transformedProducts.length,
      page: 1,
      per_page: 20,
      pages: Math.ceil(transformedProducts.length / 20),
      has_next: false,
      has_prev: false
    }
  }

  private getMockCategories() {
    // Transform mock categories to match API response format
    const transformedCategories = mockCategories.map((category, index) => ({
      id: index + 1,
      name: category.name,
      slug: category.slug,
      description: category.description,
      image_url: category.image || '',
      parent_id: null,
      sort_order: index,
      is_active: true,
      meta_title: category.name,
      meta_description: category.description,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }))

    return transformedCategories
  }
}

// Export singleton instance
export const api = new ApiClient()

// Utility functions
export const formatPrice = (price: number, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency
  }).format(price)
}

export const formatDate = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(new Date(date))
}

export const formatDateTime = (date: string) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

export default api
