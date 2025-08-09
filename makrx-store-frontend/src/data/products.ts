export interface Product {
  id: string
  name: string
  description: string
  shortDescription: string
  category: string
  subcategory: string
  price: number
  originalPrice?: number
  inStock: boolean
  stockCount: number
  brand: string
  model: string
  sku: string
  images: string[]
  rating: number
  reviewCount: number
  tags: string[]
  specifications: { [key: string]: string | number }
  compatibility: string[]
  featured: boolean
  popular: boolean
  newArrival: boolean
  onSale: boolean
  bundles?: string[]
  weight: number
  dimensions: {
    length: number
    width: number
    height: number
  }
  shippingClass: 'standard' | 'express' | 'oversized'
  warranty: string
  origin: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  icon: string
  subcategories: string[]
  featured: boolean
  productCount: number
}

export interface Filter {
  id: string
  name: string
  type: 'checkbox' | 'range' | 'select' | 'toggle'
  options?: { value: string; label: string; count?: number }[]
  min?: number
  max?: number
  unit?: string
  category?: string[]
}

export const categories: Category[] = [
  {
    id: '3d-printers',
    name: '3D Printers',
    slug: '3d-printers',
    description: 'Professional and consumer 3D printers for all skill levels',
    image: '/api/placeholder/400/300',
    icon: 'printer',
    subcategories: ['fdm-printers', 'resin-printers', 'industrial-printers'],
    featured: true,
    productCount: 156
  },
  {
    id: 'filament',
    name: 'Filament & Materials',
    slug: 'filament',
    description: 'High-quality 3D printing filaments and materials',
    image: '/api/placeholder/400/300',
    icon: 'package',
    subcategories: ['pla-filament', 'abs-filament', 'petg-filament', 'specialty-filament'],
    featured: true,
    productCount: 432
  },
  {
    id: 'electronics',
    name: 'Electronics',
    slug: 'electronics',
    description: 'Arduino, Raspberry Pi, sensors, and electronic components',
    image: '/api/placeholder/400/300',
    icon: 'cpu',
    subcategories: ['microcontrollers', 'sensors', 'displays', 'modules'],
    featured: true,
    productCount: 894
  },
  {
    id: 'tools',
    name: 'Tools & Hardware',
    slug: 'tools',
    description: 'Essential tools for makers and professionals',
    image: '/api/placeholder/400/300',
    icon: 'wrench',
    subcategories: ['hand-tools', 'power-tools', 'measurement', 'hardware'],
    featured: true,
    productCount: 267
  },
  {
    id: 'components',
    name: 'Components',
    slug: 'components',
    description: 'Mechanical parts, fasteners, and building components',
    image: '/api/placeholder/400/300',
    icon: 'package',
    subcategories: ['bearings', 'fasteners', 'motors', 'belts'],
    featured: false,
    productCount: 1234
  },
  {
    id: 'kits',
    name: 'Kits & Bundles',
    slug: 'kits',
    description: 'Complete starter kits and project bundles',
    image: '/api/placeholder/400/300',
    icon: 'box',
    subcategories: ['starter-kits', 'project-kits', 'upgrade-kits'],
    featured: true,
    productCount: 89
  }
]

export const filters: Filter[] = [
  {
    id: 'category',
    name: 'Category',
    type: 'checkbox',
    options: categories.map(cat => ({
      value: cat.id,
      label: cat.name,
      count: cat.productCount
    }))
  },
  {
    id: 'price',
    name: 'Price',
    type: 'range',
    min: 0,
    max: 5000,
    unit: '$'
  },
  {
    id: 'brand',
    name: 'Brand',
    type: 'checkbox',
    options: [
      { value: 'prusa', label: 'Prusa Research', count: 45 },
      { value: 'bambu', label: 'Bambu Lab', count: 38 },
      { value: 'arduino', label: 'Arduino', count: 156 },
      { value: 'raspberry-pi', label: 'Raspberry Pi', count: 67 },
      { value: 'elegoo', label: 'Elegoo', count: 89 },
      { value: 'creality', label: 'Creality', count: 124 },
      { value: 'ultimaker', label: 'Ultimaker', count: 23 }
    ]
  },
  {
    id: 'availability',
    name: 'Availability',
    type: 'checkbox',
    options: [
      { value: 'in-stock', label: 'In Stock', count: 2456 },
      { value: 'pre-order', label: 'Pre-order', count: 234 },
      { value: 'backorder', label: 'Backorder', count: 156 }
    ]
  },
  {
    id: 'compatibility',
    name: 'Compatibility',
    type: 'checkbox',
    category: ['3d-printers', 'filament'],
    options: [
      { value: 'bambu-x1', label: 'Bambu X1 Series', count: 234 },
      { value: 'prusa-mk4', label: 'Prusa MK4', count: 189 },
      { value: 'ender-3', label: 'Ender 3 Series', count: 445 },
      { value: 'ultimaker-s3', label: 'Ultimaker S3/S5', count: 67 }
    ]
  },
  {
    id: 'print-volume',
    name: 'Print Volume',
    type: 'select',
    category: ['3d-printers'],
    options: [
      { value: 'small', label: 'Small (< 200mm)', count: 45 },
      { value: 'medium', label: 'Medium (200-300mm)', count: 78 },
      { value: 'large', label: 'Large (> 300mm)', count: 33 }
    ]
  },
  {
    id: 'material-type',
    name: 'Material Type',
    type: 'checkbox',
    category: ['filament'],
    options: [
      { value: 'pla', label: 'PLA', count: 156 },
      { value: 'abs', label: 'ABS', count: 89 },
      { value: 'petg', label: 'PETG', count: 67 },
      { value: 'tpu', label: 'TPU (Flexible)', count: 34 },
      { value: 'wood', label: 'Wood Fill', count: 23 },
      { value: 'metal', label: 'Metal Fill', count: 12 }
    ]
  }
]

export const products: Product[] = [
  // 3D Printers
  {
    id: 'prusa-mk4',
    name: 'Prusa MK4 3D Printer',
    description: 'The latest flagship printer from Prusa Research featuring automatic bed leveling, advanced sensors, and exceptional print quality. Perfect for professionals and enthusiasts alike.',
    shortDescription: 'Professional-grade FDM printer with auto-leveling and advanced sensors',
    category: '3d-printers',
    subcategory: 'fdm-printers',
    price: 91217,
    originalPrice: 107817,
    inStock: true,
    stockCount: 15,
    brand: 'Prusa Research',
    model: 'MK4',
    sku: 'PRUSA-MK4-001',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    rating: 4.9,
    reviewCount: 847,
    tags: ['fdm', 'auto-leveling', 'professional', 'prusa', 'kit'],
    specifications: {
      'Print Volume': '250 × 210 × 220 mm',
      'Layer Height': '0.1 - 0.6 mm',
      'Print Speed': '200 mm/s',
      'Heated Bed': 'Yes (120°C)',
      'Auto Leveling': 'Yes',
      'Filament Diameter': '1.75 mm',
      'Connectivity': 'USB, Ethernet, WiFi',
      'Assembly': 'Kit (8-10 hours)'
    },
    compatibility: ['PLA', 'ABS', 'PETG', 'TPU', 'ASA'],
    featured: true,
    popular: true,
    newArrival: false,
    onSale: true,
    weight: 16.5,
    dimensions: { length: 550, width: 470, height: 470 },
    shippingClass: 'oversized',
    warranty: '2 years',
    origin: 'Czech Republic'
  },
  {
    id: 'bambu-x1-carbon',
    name: 'Bambu Lab X1 Carbon',
    description: 'Revolutionary 3D printer with automatic material system, AI-powered failure detection, and ultra-fast printing speeds. The future of 3D printing.',
    shortDescription: 'AI-powered printer with automatic material system and ultra-fast printing',
    category: '3d-printers',
    subcategory: 'fdm-printers',
    price: 116117,
    inStock: true,
    stockCount: 8,
    brand: 'Bambu Lab',
    model: 'X1 Carbon',
    sku: 'BAMBU-X1C-001',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400', '/api/placeholder/600/400'],
    rating: 4.8,
    reviewCount: 623,
    tags: ['fdm', 'ams', 'ai-detection', 'fast-printing', 'enclosed'],
    specifications: {
      'Print Volume': '256 × 256 × 256 mm',
      'Layer Height': '0.08 - 0.35 mm',
      'Print Speed': '500 mm/s',
      'Heated Bed': 'Yes (120°C)',
      'Enclosure': 'Yes',
      'AMS': 'Compatible',
      'AI Detection': 'Yes',
      'Connectivity': 'WiFi, Bambu Cloud'
    },
    compatibility: ['PLA', 'ABS', 'PETG', 'TPU', 'PC', 'PA', 'ASA'],
    featured: true,
    popular: true,
    newArrival: true,
    onSale: false,
    weight: 18.2,
    dimensions: { length: 389, width: 389, height: 457 },
    shippingClass: 'oversized',
    warranty: '1 year',
    origin: 'China'
  },
  {
    id: 'elegoo-mars-4-ultra',
    name: 'Elegoo Mars 4 Ultra',
    description: 'High-resolution resin 3D printer with 6K monochrome LCD and AI failure detection. Perfect for miniatures, jewelry, and detailed models.',
    shortDescription: '6K resin printer with AI detection for ultra-detailed prints',
    category: '3d-printers',
    subcategory: 'resin-printers',
    price: 24817,
    inStock: true,
    stockCount: 23,
    brand: 'Elegoo',
    model: 'Mars 4 Ultra',
    sku: 'ELEGOO-M4U-001',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    rating: 4.6,
    reviewCount: 432,
    tags: ['resin', '6k', 'ai-detection', 'miniatures', 'high-detail'],
    specifications: {
      'Print Volume': '153.36 × 77.76 × 175 mm',
      'Layer Height': '0.01 - 0.2 mm',
      'LCD Resolution': '6480 × 3600',
      'Light Source': 'COB + Fresnel Lens',
      'Connectivity': 'USB',
      'AI Detection': 'Yes'
    },
    compatibility: ['Standard Resin', 'Tough Resin', 'Flexible Resin'],
    featured: false,
    popular: true,
    newArrival: true,
    onSale: false,
    weight: 6.8,
    dimensions: { length: 227, width: 227, height: 438 },
    shippingClass: 'standard',
    warranty: '1 year',
    origin: 'China'
  },

  // Filaments
  {
    id: 'prusament-pla-galaxy-silver',
    name: 'Prusament PLA Galaxy Silver',
    description: 'Premium PLA filament with unique galaxy sparkle effect. Excellent printability, vibrant colors, and consistent diameter tolerance.',
    shortDescription: 'Premium PLA with galaxy sparkle effect and excellent printability',
    category: 'filament',
    subcategory: 'pla-filament',
    price: 2738,
    inStock: true,
    stockCount: 156,
    brand: 'Prusa Research',
    model: 'Prusament PLA',
    sku: 'PRUSA-PLA-GAL-SIL',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    rating: 4.8,
    reviewCount: 234,
    tags: ['pla', 'galaxy', 'sparkle', 'premium', '1.75mm'],
    specifications: {
      'Diameter': '1.75 mm ± 0.02 mm',
      'Weight': '1 kg',
      'Print Temperature': '215°C ± 10°C',
      'Bed Temperature': '60°C',
      'Color': 'Galaxy Silver',
      'Special Effect': 'Sparkle particles'
    },
    compatibility: ['Prusa MK4', 'Bambu X1', 'Ender 3', 'Most FDM printers'],
    featured: false,
    popular: true,
    newArrival: false,
    onSale: false,
    weight: 1.0,
    dimensions: { length: 200, width: 200, height: 70 },
    shippingClass: 'standard',
    warranty: 'N/A',
    origin: 'Czech Republic'
  },
  {
    id: 'bambu-abs-matte-black',
    name: 'Bambu ABS Matte Black',
    description: 'High-quality ABS filament with matte finish. Excellent layer adhesion, chemical resistance, and perfect for functional parts.',
    shortDescription: 'Premium ABS with matte finish for functional parts',
    category: 'filament',
    subcategory: 'abs-filament',
    price: 2406,
    inStock: true,
    stockCount: 89,
    brand: 'Bambu Lab',
    model: 'ABS Matte',
    sku: 'BAMBU-ABS-MAT-BLK',
    images: ['/api/placeholder/600/400'],
    rating: 4.7,
    reviewCount: 156,
    tags: ['abs', 'matte', 'functional', 'chemical-resistant', '1.75mm'],
    specifications: {
      'Diameter': '1.75 mm ± 0.03 mm',
      'Weight': '1 kg',
      'Print Temperature': '260°C ± 10°C',
      'Bed Temperature': '90°C',
      'Finish': 'Matte',
      'Shore Hardness': 'D80'
    },
    compatibility: ['Bambu X1', 'Prusa MK4', 'Enclosed printers'],
    featured: false,
    popular: false,
    newArrival: true,
    onSale: false,
    weight: 1.0,
    dimensions: { length: 200, width: 200, height: 70 },
    shippingClass: 'standard',
    warranty: 'N/A',
    origin: 'China'
  },

  // Electronics
  {
    id: 'arduino-uno-r4-wifi',
    name: 'Arduino UNO R4 WiFi',
    description: 'The latest Arduino UNO with built-in WiFi, improved performance, and enhanced connectivity. Perfect for IoT projects and learning.',
    shortDescription: 'Latest Arduino UNO with built-in WiFi and enhanced performance',
    category: 'electronics',
    subcategory: 'microcontrollers',
    price: 2283,
    inStock: true,
    stockCount: 234,
    brand: 'Arduino',
    model: 'UNO R4 WiFi',
    sku: 'ARDUINO-UNO-R4-WIFI',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    rating: 4.9,
    reviewCount: 1203,
    tags: ['arduino', 'microcontroller', 'wifi', 'iot', 'beginner-friendly'],
    specifications: {
      'Microcontroller': 'RA4M1 (Arm Cortex-M4)',
      'Operating Voltage': '5V',
      'Digital I/O Pins': '14',
      'Analog Input Pins': '6',
      'WiFi': 'ESP32-S3',
      'USB': 'USB-C',
      'Flash Memory': '256 KB'
    },
    compatibility: ['Arduino IDE', 'PlatformIO', 'Most Arduino shields'],
    featured: true,
    popular: true,
    newArrival: true,
    onSale: false,
    weight: 0.025,
    dimensions: { length: 68.6, width: 53.4, height: 15 },
    shippingClass: 'standard',
    warranty: '1 year',
    origin: 'Italy'
  },
  {
    id: 'raspberry-pi-5-8gb',
    name: 'Raspberry Pi 5 8GB',
    description: 'The most powerful Raspberry Pi yet with 8GB RAM, improved performance, and enhanced connectivity options. Perfect for demanding projects.',
    shortDescription: 'Most powerful Raspberry Pi with 8GB RAM and enhanced performance',
    category: 'electronics',
    subcategory: 'microcontrollers',
    price: 7469,
    inStock: false,
    stockCount: 0,
    brand: 'Raspberry Pi Foundation',
    model: 'Pi 5',
    sku: 'RPI-5-8GB',
    images: ['/api/placeholder/600/400'],
    rating: 4.8,
    reviewCount: 567,
    tags: ['raspberry-pi', 'sbc', '8gb', 'powerful', 'linux'],
    specifications: {
      'CPU': 'Quad-core 64-bit Arm Cortex-A76 @ 2.4GHz',
      'RAM': '8GB LPDDR4X-4267 SDRAM',
      'Storage': 'MicroSD card slot',
      'USB': '2 × USB 3.0, 2 × USB 2.0',
      'Display': '2 × 4Kp60 HDMI',
      'Ethernet': 'Gigabit Ethernet',
      'WiFi': '802.11ac dual-band'
    },
    compatibility: ['Raspberry Pi OS', 'Ubuntu', 'Most Pi accessories'],
    featured: true,
    popular: true,
    newArrival: true,
    onSale: false,
    weight: 0.045,
    dimensions: { length: 85, width: 56, height: 17 },
    shippingClass: 'standard',
    warranty: '1 year',
    origin: 'UK'
  },

  // Tools
  {
    id: 'prusa-nozzle-kit',
    name: 'Prusa Nozzle Variety Kit',
    description: 'Complete set of hardened steel nozzles for Prusa printers. Includes 0.2mm to 1.0mm sizes for different applications.',
    shortDescription: 'Complete hardened steel nozzle set for Prusa printers',
    category: 'tools',
    subcategory: 'printer-parts',
    price: 3817,
    inStock: true,
    stockCount: 67,
    brand: 'Prusa Research',
    model: 'Nozzle Kit',
    sku: 'PRUSA-NOZZLE-KIT',
    images: ['/api/placeholder/600/400'],
    rating: 4.7,
    reviewCount: 189,
    tags: ['nozzles', 'hardened-steel', 'variety-pack', 'prusa'],
    specifications: {
      'Material': 'Hardened Steel',
      'Thread': 'M6',
      'Sizes Included': '0.2, 0.3, 0.4, 0.6, 0.8, 1.0 mm',
      'Compatible With': 'Prusa MK3S+, MK4, MINI',
      'Quantity': '6 nozzles'
    },
    compatibility: ['Prusa MK4', 'Prusa MK3S+', 'Prusa MINI'],
    featured: false,
    popular: true,
    newArrival: false,
    onSale: false,
    weight: 0.05,
    dimensions: { length: 100, width: 80, height: 20 },
    shippingClass: 'standard',
    warranty: '6 months',
    origin: 'Czech Republic'
  },

  // Starter Kits
  {
    id: '3d-printing-starter-kit',
    name: '3D Printing Starter Kit',
    description: 'Everything you need to start 3D printing: tools, filament samples, bed adhesion aids, and beginner guide.',
    shortDescription: 'Complete starter kit for 3D printing beginners',
    category: 'kits',
    subcategory: 'starter-kits',
    price: 6639,
    originalPrice: 8299,
    inStock: true,
    stockCount: 45,
    brand: 'MakrX',
    model: 'Starter Kit Pro',
    sku: 'MAKRX-STARTER-KIT',
    images: ['/api/placeholder/600/400', '/api/placeholder/600/400'],
    rating: 4.6,
    reviewCount: 298,
    tags: ['starter-kit', 'beginner', 'tools', 'filament-samples'],
    specifications: {
      'Included Tools': 'Nozzle cleaning kit, spatula, hex keys',
      'Filament Samples': '5 × 50g PLA samples',
      'Bed Adhesion': 'PEI sheets, glue stick',
      'Documentation': 'Beginner guide, troubleshooting cards',
      'Storage': 'Organized tool case'
    },
    compatibility: ['Most FDM printers'],
    featured: false,
    popular: true,
    newArrival: false,
    onSale: true,
    bundles: ['prusa-mk4', 'bambu-x1-carbon'],
    weight: 1.2,
    dimensions: { length: 300, width: 200, height: 100 },
    shippingClass: 'standard',
    warranty: '1 year',
    origin: 'Global'
  }
]

// Utility functions
export function getProductsByCategory(categoryId: string): Product[] {
  return products.filter(product => product.category === categoryId)
}

export function getProductById(id: string): Product | undefined {
  return products.find(product => product.id === id)
}

export function getFeaturedProducts(): Product[] {
  return products.filter(product => product.featured)
}

export function getPopularProducts(): Product[] {
  return products.filter(product => product.popular)
}

export function searchProducts(query: string): Product[] {
  const searchTerm = query.toLowerCase()
  return products.filter(product =>
    product.name.toLowerCase().includes(searchTerm) ||
    product.description.toLowerCase().includes(searchTerm) ||
    product.brand.toLowerCase().includes(searchTerm) ||
    product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
  )
}

export function filterProducts(products: Product[], filters: { [key: string]: any }): Product[] {
  return products.filter(product => {
    // Category filter
    if (filters.category && filters.category.length > 0) {
      if (!filters.category.includes(product.category)) return false
    }

    // Price range filter
    if (filters.priceMin !== undefined && product.price < filters.priceMin) return false
    if (filters.priceMax !== undefined && product.price > filters.priceMax) return false

    // Brand filter
    if (filters.brand && filters.brand.length > 0) {
      const brandSlug = product.brand.toLowerCase().replace(/\s+/g, '-')
      if (!filters.brand.includes(brandSlug)) return false
    }

    // Availability filter
    if (filters.availability && filters.availability.length > 0) {
      if (filters.availability.includes('in-stock') && !product.inStock) return false
      if (filters.availability.includes('on-sale') && !product.onSale) return false
    }

    // Compatibility filter
    if (filters.compatibility && filters.compatibility.length > 0) {
      const hasCompatibility = filters.compatibility.some((comp: string) =>
        product.compatibility.some(pc => pc.toLowerCase().includes(comp))
      )
      if (!hasCompatibility) return false
    }

    return true
  })
}

export function sortProducts(products: Product[], sortBy: string): Product[] {
  switch (sortBy) {
    case 'price-low':
      return [...products].sort((a, b) => a.price - b.price)
    case 'price-high':
      return [...products].sort((a, b) => b.price - a.price)
    case 'rating':
      return [...products].sort((a, b) => b.rating - a.rating)
    case 'popular':
      return [...products].sort((a, b) => b.reviewCount - a.reviewCount)
    case 'newest':
      return [...products].sort((a, b) => (b.newArrival ? 1 : 0) - (a.newArrival ? 1 : 0))
    case 'name':
      return [...products].sort((a, b) => a.name.localeCompare(b.name))
    default: // relevance
      return products
  }
}
