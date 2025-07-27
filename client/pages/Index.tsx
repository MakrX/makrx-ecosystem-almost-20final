import { Link } from "react-router-dom";
import { 
  Bot, 
  Zap, 
  Users, 
  Cog, 
  ShoppingCart, 
  GraduationCap,
  ArrowRight,
  Sparkles,
  Cpu,
  Wrench,
  Building2,
  Package
} from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-makrx-blue via-makrx-blue/95 to-makrx-blue/90">
        <div className="absolute inset-0 makrx-circuit-bg opacity-20" />
        
        {/* Floating Elements */}
        <div className="absolute top-20 left-10 makrx-float opacity-20">
          <Cog className="w-16 h-16 text-makrx-blue" />
        </div>
        <div className="absolute top-40 right-20 makrx-float-delay opacity-20">
          <Cpu className="w-12 h-12 text-makrx-yellow" />
        </div>
        <div className="absolute bottom-40 left-20 makrx-float opacity-20">
          <Wrench className="w-14 h-14 text-makrx-brown" />
        </div>
        
        <div className="relative container mx-auto px-6 py-24 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            {/* MakrBot Mascot */}
            <div className="flex justify-center mb-8">
              <div className="relative">
                <img 
                  src="https://cdn.builder.io/api/v1/assets/f367f5e46f75423a83d3f29fae529dbb/botlogofinal-c921e6?format=webp&width=800" 
                  alt="MakrBot Mascot" 
                  className="w-32 h-32 makrx-float"
                />
                <div className="absolute inset-0 bg-makrx-yellow/20 rounded-full blur-xl" />
              </div>
            </div>

            {/* Hero Title */}
            <h1 className="text-5xl lg:text-7xl font-display font-black mb-6 text-balance">
              <span className="text-white">Makr</span>
              <span className="text-makrx-yellow makrx-glow-text">X</span>
              <br />
              <span className="text-2xl lg:text-4xl font-light text-white/90">
                The Modular OS of Making
              </span>
            </h1>

            {/* Hero Description */}
            <p className="text-xl lg:text-2xl text-white/80 mb-12 max-w-3xl mx-auto text-balance">
              Unify everything a maker needs — from makerspace management to 3D printing, 
              education, and community — in one open-source, customizable ecosystem.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
              <Link 
                to="/makrcave" 
                className="makrx-btn-primary text-lg flex items-center gap-2 justify-center"
              >
                <Building2 className="w-5 h-5" />
                Enter MakrCave
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link 
                to="/store" 
                className="makrx-btn-secondary text-lg flex items-center gap-2 justify-center"
              >
                <ShoppingCart className="w-5 h-5" />
                Explore Store
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>

            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="makrx-glass-card text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-makrx-yellow/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Zap className="w-8 h-8 text-makrx-yellow" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Built for speed with modern tech stack</p>
              </div>
              
              <div className="makrx-glass-card text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-makrx-blue/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Users className="w-8 h-8 text-makrx-blue" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Community Driven</h3>
                <p className="text-muted-foreground">Built by makers, for makers worldwide</p>
              </div>
              
              <div className="makrx-glass-card text-center group">
                <div className="w-16 h-16 mx-auto mb-4 bg-makrx-brown/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Sparkles className="w-8 h-8 text-makrx-brown" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Modular Design</h3>
                <p className="text-muted-foreground">Enable only what you need</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Overview */}
      <section className="py-24 lg:py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl lg:text-5xl font-display font-bold mb-6">
                The Complete <span className="text-makrx-yellow">Maker Ecosystem</span>
              </h2>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                Everything you need to bring ideas to life, manage your makerspace, 
                and connect with the global maker community.
              </p>
            </div>

            {/* Ecosystem Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
              {/* MakrCave */}
              <Link to="/makrcave" className="group">
                <div className="makrx-glass-card h-full group-hover:border-makrx-blue/50 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-makrx-blue/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Building2 className="w-8 h-8 text-makrx-blue" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">MakrCave</h3>
                      <p className="text-makrx-blue font-semibold">Makerspace Management Portal</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Complete makerspace management: inventory tracking, workstation booking, 
                    project collaboration, and member management all in one place.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-makrx-blue/10 text-makrx-blue px-3 py-1 rounded-full text-sm">Inventory</span>
                    <span className="bg-makrx-blue/10 text-makrx-blue px-3 py-1 rounded-full text-sm">Projects</span>
                    <span className="bg-makrx-blue/10 text-makrx-blue px-3 py-1 rounded-full text-sm">Booking</span>
                  </div>
                </div>
              </Link>

              {/* MakrX Store */}
              <Link to="/store" className="group">
                <div className="makrx-glass-card h-full group-hover:border-makrx-yellow/50 transition-all duration-300">
                  <div className="flex items-start gap-4 mb-6">
                    <div className="w-16 h-16 bg-makrx-yellow/20 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Package className="w-8 h-8 text-makrx-yellow" />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold mb-2">MakrX Store</h3>
                      <p className="text-makrx-yellow font-semibold">3D Printing & Commerce Hub</p>
                    </div>
                  </div>
                  <p className="text-muted-foreground mb-6">
                    Upload designs, get instant quotes, order custom 3D prints, and browse 
                    a marketplace of maker-created products and services.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">3D Printing</span>
                    <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Marketplace</span>
                    <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Design Upload</span>
                  </div>
                </div>
              </Link>

              {/* Auth & Identity */}
              <div className="makrx-glass-card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-makrx-brown/20 rounded-xl flex items-center justify-center">
                    <Bot className="w-8 h-8 text-makrx-brown" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Unified Identity</h3>
                    <p className="text-makrx-brown font-semibold">Single Sign-On Across Everything</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  One account, universal access. Powered by Keycloak for enterprise-grade 
                  security with custom MakrX theming and maker-specific role management.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-makrx-brown/10 text-makrx-brown px-3 py-1 rounded-full text-sm">SSO</span>
                  <span className="bg-makrx-brown/10 text-makrx-brown px-3 py-1 rounded-full text-sm">Security</span>
                  <span className="bg-makrx-brown/10 text-makrx-brown px-3 py-1 rounded-full text-sm">Roles</span>
                </div>
              </div>

              {/* Learning Hub */}
              <div className="makrx-glass-card">
                <div className="flex items-start gap-4 mb-6">
                  <div className="w-16 h-16 bg-makrx-yellow/20 rounded-xl flex items-center justify-center">
                    <GraduationCap className="w-8 h-8 text-makrx-yellow" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Learning Hub</h3>
                    <p className="text-makrx-yellow font-semibold">Skills & Certification Platform</p>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Interactive courses, skill badges, and certification paths for everything 
                  from basic electronics to advanced manufacturing techniques.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Courses</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Badges</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-3 py-1 rounded-full text-sm">Certification</span>
                </div>
              </div>
            </div>

            {/* Architecture Highlight */}
            <div className="text-center">
              <div className="makrx-glass-card max-w-4xl mx-auto">
                <h3 className="text-2xl font-bold mb-4">
                  <span className="text-makrx-blue">Open Source</span> · 
                  <span className="text-makrx-yellow"> Self-Hostable</span> · 
                  <span className="text-makrx-brown"> Modular</span>
                </h3>
                <p className="text-lg text-muted-foreground mb-6">
                  Built with modern microservices architecture. Docker-ready, Kubernetes-native, 
                  and designed to scale from single maker to global makerspace networks.
                </p>
                <div className="flex flex-wrap justify-center gap-3">
                  <span className="bg-makrx-blue/10 text-makrx-blue px-4 py-2 rounded-full">React + TypeScript</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-4 py-2 rounded-full">FastAPI</span>
                  <span className="bg-makrx-brown/10 text-makrx-brown px-4 py-2 rounded-full">Keycloak</span>
                  <span className="bg-makrx-blue/10 text-makrx-blue px-4 py-2 rounded-full">PostgreSQL</span>
                  <span className="bg-makrx-yellow/10 text-makrx-yellow px-4 py-2 rounded-full">Docker</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-24 bg-gradient-to-r from-makrx-blue to-makrx-yellow relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 makrx-float">
            <Cog className="w-24 h-24 text-white" />
          </div>
          <div className="absolute bottom-10 right-10 makrx-float-delay">
            <Bot className="w-32 h-32 text-white" />
          </div>
        </div>
        
        <div className="container mx-auto px-6 text-center relative">
          <h2 className="text-4xl lg:text-5xl font-display font-bold text-white mb-6">
            Ready to Start Making?
          </h2>
          <p className="text-xl text-white/90 mb-12 max-w-2xl mx-auto">
            Join thousands of makers worldwide who are building the future with MakrX.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/makrcave" 
              className="bg-white text-makrx-blue font-semibold px-8 py-4 rounded-lg text-lg hover:bg-white/90 transition-all duration-300 flex items-center gap-2 justify-center hover:shadow-2xl hover:scale-105"
            >
              <Building2 className="w-5 h-5" />
              Start with MakrCave
            </Link>
            <Link 
              to="/store" 
              className="bg-makrx-blue/20 backdrop-blur-sm text-white font-semibold px-8 py-4 rounded-lg text-lg hover:bg-makrx-blue/30 transition-all duration-300 flex items-center gap-2 justify-center border border-white/20 hover:shadow-2xl hover:scale-105"
            >
              <Package className="w-5 h-5" />
              Explore Store
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
