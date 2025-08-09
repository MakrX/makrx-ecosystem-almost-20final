import { ShoppingCart, Upload, Zap, Globe, Palette, Shield, Star, Truck, Clock, CheckCircle, ExternalLink } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviews: number;
  image: string;
  category: string;
  inStock: boolean;
  featured: boolean;
  description: string;
}

const featuredProducts: Product[] = [
  {
    id: '1',
    name: 'Custom 3D Printed Phone Case',
    price: 24.99,
    originalPrice: 34.99,
    rating: 4.8,
    reviews: 156,
    image: '/api/placeholder/300/300',
    category: '3D Printing',
    inStock: true,
    featured: true,
    description: 'Personalized phone case with custom design and premium materials'
  },
  {
    id: '2',
    name: 'Laser-Cut Wooden Desk Organizer',
    price: 45.00,
    rating: 4.9,
    reviews: 89,
    image: '/api/placeholder/300/300',
    category: 'Laser Cutting',
    inStock: true,
    featured: true,
    description: 'Elegant bamboo desk organizer with precision laser-cut compartments'
  },
  {
    id: '3',
    name: 'CNC Machined Aluminum Fidget Spinner',
    price: 89.99,
    originalPrice: 120.00,
    rating: 4.7,
    reviews: 234,
    image: '/api/placeholder/300/300',
    category: 'CNC',
    inStock: true,
    featured: true,
    description: 'Premium aluminum fidget spinner with precision bearings'
  },
  {
    id: '4',
    name: 'Arduino Starter Kit Plus',
    price: 79.99,
    rating: 4.6,
    reviews: 445,
    image: '/api/placeholder/300/300',
    category: 'Electronics',
    inStock: true,
    featured: true,
    description: 'Complete electronics kit with Arduino Uno and 50+ components'
  }
];

interface Service {
  title: string;
  description: string;
  icon: any;
  price: string;
  turnaround: string;
  features: string[];
  color: string;
}

const services: Service[] = [
  {
    title: '3D Printing Service',
    description: 'Upload your STL files and get professional 3D prints delivered',
    icon: Upload,
    price: 'From ₹415',
    turnaround: '2-5 days',
    features: ['PLA, ABS, PETG materials', 'Layer heights from 0.1mm', 'Multi-color printing', 'Post-processing available'],
    color: 'makrx-blue'
  },
  {
    title: 'CNC Machining',
    description: 'Precision CNC machining for metals, plastics, and composites',
    icon: Zap,
    price: 'From ₹2,075',
    turnaround: '3-7 days',
    features: ['Aluminum, steel, brass', 'Tolerances to ±0.005"', 'Surface finishing', 'Assembly services'],
    color: 'makrx-yellow'
  },
  {
    title: 'Laser Cutting',
    description: 'High-precision laser cutting and engraving services',
    icon: Palette,
    price: 'From ₹830',
    turnaround: '1-3 days',
    features: ['Wood, acrylic, metal', 'Thickness up to 20mm', 'Custom engraving', 'Batch discounts'],
    color: 'makrx-brown'
  },
  {
    title: 'PCB Assembly',
    description: 'Professional PCB manufacturing and component assembly',
    icon: Shield,
    price: 'From ₹1,245',
    turnaround: '5-10 days',
    features: ['SMT and THT assembly', 'Testing included', 'BOM sourcing', 'Quality certification'],
    color: 'makrx-blue'
  }
];

export default function Store() {
  const { isAuthenticated, user } = useAuth();
  const [uploadingFile, setUploadingFile] = useState(false);

  const handleFileUpload = () => {
    if (!isAuthenticated) {
      return;
    }
    setUploadingFile(true);
    // Simulate file upload
    setTimeout(() => {
      setUploadingFile(false);
      console.log('File uploaded, redirecting to quote page');
    }, 2000);
  };

  const handleQuickOrder = (serviceType: string) => {
    if (!isAuthenticated) {
      return;
    }
    console.log(`Starting quick order for ${serviceType}`);
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-makrx-yellow/20 rounded-2xl flex items-center justify-center">
              <ShoppingCart className="w-12 h-12 text-makrx-yellow" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-makrx-yellow">MakrX Store</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            The ultimate marketplace for custom manufacturing, 3D printing services, 
            and maker-created products with global delivery.
          </p>
        </div>

        {/* Quick Upload Section */}
        <div className="mb-12">
          <div className="makrx-glass-card max-w-2xl mx-auto text-center">
            <h2 className="text-2xl font-bold mb-4">Upload & Print in Minutes</h2>
            <p className="text-muted-foreground mb-6">
              Upload your 3D model and get instant pricing with material options and delivery estimates
            </p>
            
            <div className="border-2 border-dashed border-makrx-yellow/30 rounded-lg p-8 mb-6">
              <Upload className="w-16 h-16 text-makrx-yellow mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">Drop your STL, OBJ, or 3MF file here</p>
              <p className="text-sm text-muted-foreground mb-4">
                Or click to browse (Max file size: 100MB)
              </p>
              <button
                onClick={handleFileUpload}
                disabled={!isAuthenticated || uploadingFile}
                className={`px-6 py-3 rounded-lg transition-colors ${
                  !isAuthenticated || uploadingFile
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-makrx-yellow text-makrx-blue hover:bg-makrx-yellow/90'
                }`}
              >
                {uploadingFile ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-makrx-blue/30 border-t-makrx-blue rounded-full animate-spin" />
                    Processing...
                  </div>
                ) : !isAuthenticated ? (
                  'Login to Upload'
                ) : (
                  'Choose File'
                )}
              </button>
            </div>

            {!isAuthenticated && (
              <p className="text-sm text-muted-foreground">
                <Link to="/login" className="text-makrx-yellow hover:underline">Sign in</Link> to upload files and get instant quotes
              </p>
            )}
          </div>
        </div>

        {/* Manufacturing Services */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-center mb-8">Manufacturing Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <div key={index} className="makrx-glass-card hover:scale-105 transition-transform">
                  <div className={`w-16 h-16 bg-${service.color}/20 rounded-xl flex items-center justify-center mb-4 mx-auto`}>
                    <Icon className={`w-8 h-8 text-${service.color}`} />
                  </div>
                  
                  <div className="text-center mb-4">
                    <h3 className="text-lg font-semibold mb-2">{service.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{service.description}</p>
                    
                    <div className="flex justify-between text-sm mb-3">
                      <span className="font-medium">{service.price}</span>
                      <span className="text-muted-foreground">{service.turnaround}</span>
                    </div>
                  </div>

                  <div className="space-y-1 mb-4">
                    {service.features.slice(0, 2).map((feature, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <CheckCircle className="w-3 h-3 text-green-500" />
                        <span>{feature}</span>
                      </div>
                    ))}
                    <div className="text-xs text-muted-foreground">
                      +{service.features.length - 2} more features
                    </div>
                  </div>

                  <button
                    onClick={() => handleQuickOrder(service.title)}
                    disabled={!isAuthenticated}
                    className={`w-full py-2 rounded-lg transition-colors ${
                      !isAuthenticated
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : `bg-${service.color} text-white hover:bg-${service.color}/90`
                    }`}
                  >
                    {!isAuthenticated ? 'Login to Order' : 'Get Quote'}
                  </button>
                </div>
              );
            })}
          </div>
        </div>

        {/* Featured Products */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="#" className="text-makrx-yellow hover:text-makrx-yellow/80 flex items-center gap-2">
              View All Products
              <ExternalLink className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <div key={product.id} className="makrx-glass-card group hover:scale-105 transition-transform">
                <div className="relative mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  {product.originalPrice && (
                    <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs">
                      Sale
                    </div>
                  )}
                  {!product.inStock && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <span className="text-white font-semibold">Out of Stock</span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span className="text-muted-foreground">({product.reviews})</span>
                  </div>

                  <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                  <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>

                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold">${product.price}</span>
                    {product.originalPrice && (
                      <span className="text-sm text-muted-foreground line-through">
                        ${product.originalPrice}
                      </span>
                    )}
                  </div>

                  <button
                    disabled={!product.inStock || !isAuthenticated}
                    className={`w-full py-2 rounded-lg transition-colors ${
                      !product.inStock || !isAuthenticated
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-makrx-yellow text-makrx-blue hover:bg-makrx-yellow/90'
                    }`}
                  >
                    {!isAuthenticated ? 'Login to Buy' : !product.inStock ? 'Out of Stock' : 'Add to Cart'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Store Features */}
        <div className="max-w-4xl mx-auto">
          <div className="makrx-glass-card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Why Choose MakrX Store?</h2>
              <p className="text-muted-foreground">
                Global manufacturing network with intelligent automation and quality guarantee
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <Globe className="w-12 h-12 text-makrx-blue mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Global Network</h3>
                <p className="text-sm text-muted-foreground">
                  Connected to 500+ manufacturers worldwide for fastest delivery and best pricing
                </p>
              </div>
              <div className="text-center p-4">
                <Zap className="w-12 h-12 text-makrx-yellow mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Smart Pricing</h3>
                <p className="text-sm text-muted-foreground">
                  AI-powered pricing engine considers material, complexity, and local availability
                </p>
              </div>
              <div className="text-center p-4">
                <Shield className="w-12 h-12 text-makrx-brown mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Quality Guaranteed</h3>
                <p className="text-sm text-muted-foreground">
                  Every order backed by our quality guarantee and expert quality control
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center text-sm">
              <div className="flex items-center justify-center gap-2">
                <Truck className="w-4 h-4 text-makrx-blue" />
                <span>Free shipping over ₹4,150</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Clock className="w-4 h-4 text-makrx-yellow" />
                <span>Rush orders available</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <CheckCircle className="w-4 h-4 text-makrx-brown" />
                <span>30-day return policy</span>
              </div>
            </div>

            <div className="text-center mt-8">
              {isAuthenticated ? (
                <div className="space-x-4">
                  <button className="makrx-btn-primary">
                    Browse All Products
                  </button>
                  <button className="makrx-btn-secondary">
                    Start Custom Order
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground">
                    Join thousands of makers who trust MakrX for their manufacturing needs
                  </p>
                  <div className="space-x-4">
                    <Link to="/register" className="makrx-btn-primary">
                      Create Account
                    </Link>
                    <Link to="/login" className="makrx-btn-secondary">
                      Sign In
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
