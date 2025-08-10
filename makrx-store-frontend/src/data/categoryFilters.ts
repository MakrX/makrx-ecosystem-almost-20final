export interface CategoryFilter {
  id: string;
  name: string;
  type: 'checkbox' | 'range' | 'select' | 'toggle' | 'multiselect';
  options?: { value: string; label: string; count?: number }[];
  min?: number;
  max?: number;
  unit?: string;
  required?: boolean;
  helpText?: string;
}

export interface CategoryFilterSet {
  category: string;
  filters: CategoryFilter[];
}

// 3D Printers Specific Filters
const printerFilters: CategoryFilter[] = [
  {
    id: 'printer-type',
    name: 'Printer Type',
    type: 'checkbox',
    options: [
      { value: 'fdm', label: 'FDM/FFF', count: 89 },
      { value: 'resin', label: 'Resin (SLA/DLP)', count: 34 },
      { value: 'industrial', label: 'Industrial', count: 12 },
      { value: 'multi-material', label: 'Multi-Material', count: 21 }
    ]
  },
  {
    id: 'build-volume',
    name: 'Build Volume',
    type: 'checkbox',
    options: [
      { value: 'compact', label: 'Compact (<200mm³)', count: 23 },
      { value: 'standard', label: 'Standard (200-250mm³)', count: 45 },
      { value: 'large', label: 'Large (250-350mm³)', count: 34 },
      { value: 'xl', label: 'XL (>350mm³)', count: 12 }
    ]
  },
  {
    id: 'layer-height',
    name: 'Min Layer Height',
    type: 'select',
    options: [
      { value: '0.05', label: '0.05mm (Ultra High)', count: 8 },
      { value: '0.1', label: '0.1mm (High)', count: 34 },
      { value: '0.2', label: '0.2mm (Standard)', count: 67 },
      { value: '0.3', label: '0.3mm+ (Fast)', count: 25 }
    ]
  },
  {
    id: 'features',
    name: 'Features',
    type: 'checkbox',
    options: [
      { value: 'auto-leveling', label: 'Auto Bed Leveling', count: 67 },
      { value: 'heated-bed', label: 'Heated Bed', count: 89 },
      { value: 'enclosed', label: 'Enclosed Chamber', count: 23 },
      { value: 'dual-extruder', label: 'Dual Extruder', count: 21 },
      { value: 'wifi', label: 'WiFi Connectivity', count: 45 },
      { value: 'touchscreen', label: 'Touchscreen', count: 56 },
      { value: 'power-recovery', label: 'Power Recovery', count: 34 },
      { value: 'filament-sensor', label: 'Filament Run-out Sensor', count: 43 }
    ]
  },
  {
    id: 'assembly',
    name: 'Assembly Level',
    type: 'select',
    options: [
      { value: 'assembled', label: 'Fully Assembled', count: 45 },
      { value: 'semi-kit', label: 'Semi-Kit (2-4 hours)', count: 34 },
      { value: 'diy-kit', label: 'DIY Kit (6+ hours)', count: 23 }
    ]
  },
  {
    id: 'compatibility',
    name: 'Filament Compatibility',
    type: 'checkbox',
    options: [
      { value: 'pla', label: 'PLA', count: 114 },
      { value: 'abs', label: 'ABS', count: 89 },
      { value: 'petg', label: 'PETG', count: 78 },
      { value: 'tpu', label: 'TPU/Flexible', count: 45 },
      { value: 'high-temp', label: 'High-Temp Materials', count: 23 }
    ]
  }
];

// Electronics Specific Filters
const electronicsFilters: CategoryFilter[] = [
  {
    id: 'component-type',
    name: 'Component Type',
    type: 'checkbox',
    options: [
      { value: 'microcontroller', label: 'Microcontrollers', count: 67 },
      { value: 'sensor', label: 'Sensors', count: 234 },
      { value: 'actuator', label: 'Actuators', count: 89 },
      { value: 'display', label: 'Displays', count: 56 },
      { value: 'module', label: 'Modules', count: 123 },
      { value: 'power', label: 'Power Supplies', count: 45 },
      { value: 'communication', label: 'Communication', count: 78 }
    ]
  },
  {
    id: 'platform',
    name: 'Platform',
    type: 'checkbox',
    options: [
      { value: 'arduino', label: 'Arduino Compatible', count: 156 },
      { value: 'raspberry-pi', label: 'Raspberry Pi', count: 89 },
      { value: 'esp32', label: 'ESP32', count: 67 },
      { value: 'micro-bit', label: 'Micro:bit', count: 34 },
      { value: 'jetson', label: 'NVIDIA Jetson', count: 12 }
    ]
  },
  {
    id: 'voltage',
    name: 'Operating Voltage',
    type: 'checkbox',
    options: [
      { value: '3.3v', label: '3.3V', count: 123 },
      { value: '5v', label: '5V', count: 156 },
      { value: '12v', label: '12V', count: 78 },
      { value: '24v', label: '24V', count: 34 },
      { value: 'variable', label: 'Variable', count: 45 }
    ]
  },
  {
    id: 'interface',
    name: 'Interface',
    type: 'checkbox',
    options: [
      { value: 'i2c', label: 'I2C', count: 89 },
      { value: 'spi', label: 'SPI', count: 67 },
      { value: 'uart', label: 'UART/Serial', count: 78 },
      { value: 'gpio', label: 'GPIO', count: 134 },
      { value: 'analog', label: 'Analog', count: 98 },
      { value: 'pwm', label: 'PWM', count: 56 }
    ]
  },
  {
    id: 'skill-level',
    name: 'Skill Level',
    type: 'select',
    options: [
      { value: 'beginner', label: 'Beginner', count: 145 },
      { value: 'intermediate', label: 'Intermediate', count: 198 },
      { value: 'advanced', label: 'Advanced', count: 89 },
      { value: 'expert', label: 'Expert', count: 34 }
    ]
  }
];

// Tools & Hardware Specific Filters
const toolsFilters: CategoryFilter[] = [
  {
    id: 'tool-type',
    name: 'Tool Type',
    type: 'checkbox',
    options: [
      { value: 'cutting', label: 'Cutting Tools', count: 89 },
      { value: 'measuring', label: 'Measuring Tools', count: 67 },
      { value: 'assembly', label: 'Assembly Tools', count: 134 },
      { value: 'soldering', label: 'Soldering Equipment', count: 45 },
      { value: 'drilling', label: 'Drilling Tools', count: 56 },
      { value: 'finishing', label: 'Finishing Tools', count: 34 }
    ]
  },
  {
    id: 'power-type',
    name: 'Power Type',
    type: 'checkbox',
    options: [
      { value: 'manual', label: 'Manual', count: 123 },
      { value: 'electric', label: 'Electric', count: 89 },
      { value: 'battery', label: 'Battery Powered', count: 67 },
      { value: 'pneumatic', label: 'Pneumatic', count: 23 }
    ]
  },
  {
    id: 'material-compatibility',
    name: 'Material Compatibility',
    type: 'checkbox',
    options: [
      { value: 'metal', label: 'Metal', count: 89 },
      { value: 'wood', label: 'Wood', count: 67 },
      { value: 'plastic', label: 'Plastic', count: 134 },
      { value: 'composite', label: 'Composite', count: 45 },
      { value: 'ceramic', label: 'Ceramic', count: 23 }
    ]
  },
  {
    id: 'precision',
    name: 'Precision Level',
    type: 'select',
    options: [
      { value: 'standard', label: 'Standard (±1mm)', count: 89 },
      { value: 'precision', label: 'Precision (±0.1mm)', count: 67 },
      { value: 'high-precision', label: 'High Precision (±0.01mm)', count: 23 }
    ]
  }
];

// Materials & Filament Specific Filters
const materialsFilters: CategoryFilter[] = [
  {
    id: 'material-type',
    name: 'Material Type',
    type: 'checkbox',
    options: [
      { value: 'pla', label: 'PLA', count: 156 },
      { value: 'abs', label: 'ABS', count: 89 },
      { value: 'petg', label: 'PETG', count: 67 },
      { value: 'tpu', label: 'TPU (Flexible)', count: 34 },
      { value: 'pva', label: 'PVA (Soluble)', count: 23 },
      { value: 'hips', label: 'HIPS', count: 45 },
      { value: 'wood-fill', label: 'Wood Fill', count: 28 },
      { value: 'metal-fill', label: 'Metal Fill', count: 19 },
      { value: 'carbon-fiber', label: 'Carbon Fiber', count: 15 }
    ]
  },
  {
    id: 'diameter',
    name: 'Filament Diameter',
    type: 'checkbox',
    options: [
      { value: '1.75mm', label: '1.75mm', count: 289 },
      { value: '2.85mm', label: '2.85mm', count: 67 },
      { value: '3mm', label: '3.0mm', count: 23 }
    ]
  },
  {
    id: 'temperature',
    name: 'Print Temperature',
    type: 'range',
    min: 180,
    max: 350,
    unit: '°C',
    helpText: 'Recommended printing temperature range'
  },
  {
    id: 'properties',
    name: 'Material Properties',
    type: 'checkbox',
    options: [
      { value: 'biodegradable', label: 'Biodegradable', count: 123 },
      { value: 'flexible', label: 'Flexible', count: 45 },
      { value: 'high-strength', label: 'High Strength', count: 67 },
      { value: 'transparent', label: 'Transparent', count: 34 },
      { value: 'conductive', label: 'Conductive', count: 12 },
      { value: 'food-safe', label: 'Food Safe', count: 56 },
      { value: 'chemical-resistant', label: 'Chemical Resistant', count: 23 }
    ]
  },
  {
    id: 'color-type',
    name: 'Color Type',
    type: 'checkbox',
    options: [
      { value: 'solid', label: 'Solid Colors', count: 234 },
      { value: 'transparent', label: 'Transparent', count: 45 },
      { value: 'metallic', label: 'Metallic', count: 67 },
      { value: 'glow', label: 'Glow in Dark', count: 23 },
      { value: 'wood-tone', label: 'Wood Tones', count: 34 },
      { value: 'multicolor', label: 'Multi-Color', count: 12 }
    ]
  }
];

// Kits & Components Specific Filters
const kitsFilters: CategoryFilter[] = [
  {
    id: 'kit-type',
    name: 'Kit Type',
    type: 'checkbox',
    options: [
      { value: 'starter', label: 'Starter Kits', count: 45 },
      { value: 'project', label: 'Project Kits', count: 89 },
      { value: 'educational', label: 'Educational Kits', count: 67 },
      { value: 'robotics', label: 'Robotics Kits', count: 34 },
      { value: 'iot', label: 'IoT Kits', count: 23 },
      { value: 'upgrade', label: 'Upgrade Kits', count: 56 }
    ]
  },
  {
    id: 'age-group',
    name: 'Age Group',
    type: 'checkbox',
    options: [
      { value: 'kids-8-12', label: 'Kids (8-12)', count: 34 },
      { value: 'teens-13-17', label: 'Teens (13-17)', count: 56 },
      { value: 'adults-18+', label: 'Adults (18+)', count: 123 },
      { value: 'all-ages', label: 'All Ages', count: 67 }
    ]
  },
  {
    id: 'complexity',
    name: 'Complexity Level',
    type: 'select',
    options: [
      { value: 'basic', label: 'Basic (1-2 hours)', count: 67 },
      { value: 'intermediate', label: 'Intermediate (2-6 hours)', count: 89 },
      { value: 'advanced', label: 'Advanced (6+ hours)', count: 45 },
      { value: 'expert', label: 'Expert (Multi-day)', count: 23 }
    ]
  },
  {
    id: 'includes',
    name: 'Kit Includes',
    type: 'checkbox',
    options: [
      { value: 'components', label: 'Electronic Components', count: 167 },
      { value: 'tools', label: 'Tools Included', count: 89 },
      { value: 'manual', label: 'Detailed Manual', count: 234 },
      { value: 'online-course', label: 'Online Course', count: 45 },
      { value: 'software', label: 'Software/Code', count: 123 },
      { value: 'video-tutorials', label: 'Video Tutorials', count: 67 }
    ]
  }
];

// Components Specific Filters
const componentsFilters: CategoryFilter[] = [
  {
    id: 'component-category',
    name: 'Component Category',
    type: 'checkbox',
    options: [
      { value: 'passive', label: 'Passive Components', count: 234 },
      { value: 'active', label: 'Active Components', count: 189 },
      { value: 'mechanical', label: 'Mechanical Parts', count: 156 },
      { value: 'connectors', label: 'Connectors', count: 123 },
      { value: 'cables', label: 'Cables & Wires', count: 89 },
      { value: 'enclosures', label: 'Enclosures', count: 67 }
    ]
  },
  {
    id: 'package-type',
    name: 'Package Type',
    type: 'checkbox',
    options: [
      { value: 'through-hole', label: 'Through-Hole', count: 234 },
      { value: 'smd', label: 'Surface Mount (SMD)', count: 189 },
      { value: 'breadboard', label: 'Breadboard Friendly', count: 156 },
      { value: 'module', label: 'Module/Breakout', count: 89 }
    ]
  },
  {
    id: 'quantity',
    name: 'Package Quantity',
    type: 'select',
    options: [
      { value: 'single', label: 'Single Unit', count: 123 },
      { value: 'pack-10', label: '10-Pack', count: 89 },
      { value: 'pack-25', label: '25-Pack', count: 67 },
      { value: 'pack-100', label: '100-Pack', count: 45 },
      { value: 'bulk', label: 'Bulk (500+)', count: 23 }
    ]
  }
];

// Export category filter sets
export const categoryFilterSets: CategoryFilterSet[] = [
  { category: '3d-printers', filters: printerFilters },
  { category: 'electronics', filters: electronicsFilters },
  { category: 'tools', filters: toolsFilters },
  { category: 'materials', filters: materialsFilters },
  { category: 'kits', filters: kitsFilters },
  { category: 'components', filters: componentsFilters }
];

// Helper function to get filters for a specific category
export function getFiltersForCategory(categorySlug: string): CategoryFilter[] {
  const filterSet = categoryFilterSets.find(set => set.category === categorySlug);
  return filterSet ? filterSet.filters : [];
}

// Common filters that appear in all categories
export const commonFilters: CategoryFilter[] = [
  {
    id: 'price',
    name: 'Price Range',
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
      { value: 'ultimaker', label: 'Ultimaker', count: 23 },
      { value: 'anycubic', label: 'Anycubic', count: 67 },
      { value: 'flashforge', label: 'FlashForge', count: 34 },
      { value: 'adafruit', label: 'Adafruit', count: 89 }
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
    id: 'rating',
    name: 'Customer Rating',
    type: 'checkbox',
    options: [
      { value: '4-stars', label: '4+ Stars', count: 1234 },
      { value: '3-stars', label: '3+ Stars', count: 1789 },
      { value: '2-stars', label: '2+ Stars', count: 1923 },
      { value: '1-star', label: '1+ Stars', count: 2156 }
    ]
  }
];

// Get all filters for a category (category-specific + common)
export function getAllFiltersForCategory(categorySlug: string): CategoryFilter[] {
  const categorySpecific = getFiltersForCategory(categorySlug);
  return [...categorySpecific, ...commonFilters];
}
