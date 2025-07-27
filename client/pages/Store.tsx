import { ShoppingCart, Upload, Zap, Globe, Palette, Shield } from "lucide-react";

export default function Store() {
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
            The ultimate marketplace for 3D printing, custom manufacturing, 
            and maker-created products - powered by intelligent automation.
          </p>
        </div>

        {/* Key Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <Upload className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Instant STL Upload</h3>
            <p className="text-muted-foreground">
              Upload your 3D designs and get real-time pricing with material options and delivery estimates.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Quoting Engine</h3>
            <p className="text-muted-foreground">
              AI-powered pricing that considers material, complexity, machine time, and local availability.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <Globe className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Global Service Network</h3>
            <p className="text-muted-foreground">
              Connect with verified service providers worldwide for printing, machining, and assembly.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <Palette className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Material Library</h3>
            <p className="text-muted-foreground">
              Extensive catalog of materials from basic PLA to exotic metals and composites.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Quality Guarantee</h3>
            <p className="text-muted-foreground">
              Every order backed by quality standards, delivery tracking, and satisfaction guarantee.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <ShoppingCart className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Maker Marketplace</h3>
            <p className="text-muted-foreground">
              Browse and sell unique maker creations, tools, kits, and finished products.
            </p>
          </div>
        </div>

        {/* Upload Demo Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="makrx-glass-card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">How It Works</h2>
              <p className="text-muted-foreground">
                From design to delivery in just a few clicks
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-makrx-yellow/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-makrx-yellow">1</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Upload Design</h3>
                <p className="text-sm text-muted-foreground">
                  Drag & drop your STL, OBJ, or STEP files for instant analysis
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-makrx-blue/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-makrx-blue">2</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Get Quote</h3>
                <p className="text-sm text-muted-foreground">
                  Receive instant pricing with material and service provider options
                </p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-makrx-brown/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-makrx-brown">3</span>
                </div>
                <h3 className="text-lg font-semibold mb-2">Track & Receive</h3>
                <p className="text-sm text-muted-foreground">
                  Monitor production in real-time and receive your perfect part
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="makrx-glass-card">
            <h2 className="text-2xl font-bold mb-4">🚀 Launching Soon</h2>
            <p className="text-muted-foreground mb-6">
              MakrX Store is being engineered to revolutionize how makers access manufacturing services. 
              Join our early access program to be among the first to experience the future of making.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-8">
              <p>• Integration with 500+ verified service providers globally</p>
              <p>• AI-powered design optimization and printability analysis</p>
              <p>• Blockchain-based IP protection and licensing</p>
              <p>• Carbon footprint tracking and local sourcing priority</p>
              <p>• Integration with MakrCave inventory and project management</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="makrx-btn-primary">
                Join Early Access
              </button>
              <button className="makrx-btn-secondary">
                Become a Service Provider
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
