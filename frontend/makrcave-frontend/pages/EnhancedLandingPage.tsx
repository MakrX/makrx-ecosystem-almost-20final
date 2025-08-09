import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  ArrowRight, MapPin, Users, Zap, Shield, Star, ChevronRight, Play, ExternalLink, 
  Menu, X, Globe, Cpu, Layers, Target, TrendingUp, Monitor, Smartphone, Cloud,
  Code, Lock, Database, Workflow, Heart, Award, BookOpen, Lightbulb
} from 'lucide-react';
import { Link } from 'react-router-dom';
import InteractiveMap from '../components/InteractiveMap';

const EnhancedLandingPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [activeFeature, setActiveFeature] = useState(0);
  const heroRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveFeature((prev) => (prev + 1) % 6);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    { value: '10K+', label: 'Active Makers', icon: Users },
    { value: '500+', label: 'MakrCaves', icon: MapPin },
    { value: '1M+', label: 'Projects Built', icon: Zap },
    { value: '98%', label: 'Satisfaction', icon: Star }
  ];

  const features = [
    {
      icon: Shield,
      title: 'Skill-Gated Access',
      description: 'AI-powered safety protocols ensure only qualified makers use equipment',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Workflow,
      title: 'Smart Inventory',
      description: 'Automated tracking and predictive restocking with IoT integration',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time project management with shared BOMs and resources',
      color: 'from-green-500 to-emerald-500'
    },
    {
      icon: Target,
      title: 'Job Management',
      description: 'Streamlined fabrication workflow from design to delivery',
      color: 'from-orange-500 to-red-500'
    },
    {
      icon: Monitor,
      title: 'Equipment Booking',
      description: 'Dynamic pricing with membership tiers and usage analytics',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Data-driven insights for optimal space utilization and growth',
      color: 'from-teal-500 to-blue-500'
    }
  ];

  const technologies = [
    { name: 'React + TypeScript', icon: Code, desc: 'Modern frontend with type safety' },
    { name: 'FastAPI + SQLAlchemy', icon: Database, desc: 'High-performance backend' },
    { name: 'Real-time WebSockets', icon: Globe, desc: 'Live collaboration features' },
    { name: 'Enterprise Security', icon: Lock, desc: 'SOC2 compliant infrastructure' },
    { name: 'Cloud Native', icon: Cloud, desc: 'Scalable microservices architecture' },
    { name: 'IoT Integration', icon: Cpu, desc: 'Hardware edge nodes and sensors' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 overflow-hidden">
      {/* Enhanced Header with Glass Effect */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/10 backdrop-blur-xl border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/25">
                  <span className="text-white font-bold text-lg">M</span>
                </div>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse shadow-lg shadow-green-400/50"></div>
              </div>
              <span className="text-2xl font-bold text-white">MakrCave</span>
              <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LIVE</Badge>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/find-makerspace" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">Find Makerspace</Link>
              <Link to="/makrverse" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">MakrVerse</Link>
              <a href="#features" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">Features</a>
              <a href="#technology" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">Technology</a>
              <Link to="/contact" className="text-white/80 hover:text-white transition-all duration-300 hover:scale-105">Contact</Link>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              <Link to="/register" className="text-white/80 hover:text-white transition-all duration-300 px-4 py-2 rounded-lg hover:bg-white/10">
                Join Movement
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-none shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                  Enter Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <button
              className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Enhanced Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-black/90 backdrop-blur-xl border-t border-white/10 z-40">
            <div className="container mx-auto px-6 py-6">
              <nav className="flex flex-col space-y-4">
                <Link to="/find-makerspace" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Find Makerspace</Link>
                <Link to="/makrverse" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>MakrVerse</Link>
                <a href="#features" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
                <a href="#technology" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Technology</a>
                <Link to="/contact" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Contact</Link>
                <hr className="border-white/20" />
                <Link to="/register" className="text-white/80 hover:text-white transition-colors py-2" onClick={() => setIsMobileMenuOpen(false)}>Join Movement</Link>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none w-full">
                    Enter Portal
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section with Parallax */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20"
          style={{ transform: `translateY(${scrollY * 0.5}px)` }}
        ></div>
        
        {/* Animated Background Grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px',
            animation: 'grid-move 20s linear infinite'
          }}></div>
        </div>

        {/* Floating Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-blue-400 to-purple-400 opacity-30"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                width: `${Math.random() * 8 + 4}px`,
                height: `${Math.random() * 8 + 4}px`,
                animation: `float ${Math.random() * 10 + 10}s linear infinite`,
                animationDelay: `${Math.random() * 10}s`
              }}
            ></div>
          ))}
        </div>

        <div className={`relative container mx-auto px-6 py-32 text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <div className="max-w-5xl mx-auto">
            <div className="mb-8">
              <Badge className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-400 border-blue-500/30 mb-6">
                🚀 Next-Gen Makerspace Management
              </Badge>
            </div>
            
            <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-white mb-8 leading-tight">
              Digital Infrastructure for{' '}
              <span className="relative">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
                  Makerspaces
                </span>
                <div className="absolute -bottom-2 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-full"></div>
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl lg:text-3xl text-white/80 mb-12 leading-relaxed max-w-4xl mx-auto">
              AI-powered platform connecting tools, people, and projects in a unified digital ecosystem. 
              <span className="text-blue-400 font-semibold"> The future of collaborative making is here.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center max-w-lg sm:max-w-none mx-auto mb-16">
              <Link to="/find-makerspace">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-none text-lg px-8 py-4 shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                  <MapPin className="mr-3 h-5 w-5" />
                  Explore MakrCaves
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4 backdrop-blur-md transition-all duration-300 hover:scale-105">
                <Play className="mr-3 h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Live Stats Counter */}
            <div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, idx) => (
                <div key={idx} className="text-center">
                  <div className="mb-3">
                    <stat.icon className="h-8 w-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl md:text-4xl font-bold text-white mb-1 animate-pulse">{stat.value}</div>
                    <div className="text-white/60 text-sm">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced What is MakrCave Section */}
      <section className="py-32 bg-black/20 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/10 to-transparent"></div>
        <div className="container mx-auto px-6 relative">
          <div className="text-center max-w-5xl mx-auto mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              The Operating System for{' '}
              <span className="bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
                Physical Creation
              </span>
            </h2>
            <p className="text-2xl text-white/80 leading-relaxed mb-6">
              MakrCave bridges the gap between digital innovation and physical manufacturing.
            </p>
            <p className="text-lg text-white/70 leading-relaxed max-w-3xl mx-auto">
              A comprehensive platform that transforms traditional makerspaces into smart, connected ecosystems 
              where creativity meets efficiency through AI-powered automation and real-time collaboration.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {[
              { icon: '🎯', label: 'Smart Inventory', desc: 'AI-powered tracking with predictive restocking', color: 'from-blue-500 to-cyan-500' },
              { icon: '🤝', label: 'Team Projects', desc: 'Real-time collaboration with shared resources', color: 'from-purple-500 to-pink-500' },
              { icon: '⚡', label: 'Dynamic Booking', desc: 'Skill-gated equipment with smart scheduling', color: 'from-green-500 to-emerald-500' },
              { icon: '🔄', label: 'Workflow Engine', desc: 'Automated job routing and quality tracking', color: 'from-orange-500 to-red-500' }
            ].map((item, idx) => (
              <Card key={idx} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-500 hover:scale-105 group">
                <CardContent className="p-8 text-center">
                  <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-4">{item.label}</h3>
                  <p className="text-white/70 mb-4">{item.desc}</p>
                  <div className={`h-1 bg-gradient-to-r ${item.color} rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300`}></div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Features Showcase */}
      <section id="features" className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Features That{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Revolutionize
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Cutting-edge technology meets intuitive design to create the ultimate makerspace experience
            </p>
          </div>
          
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Feature List */}
              <div className="space-y-6">
                {features.map((feature, idx) => (
                  <div 
                    key={idx} 
                    className={`p-6 rounded-2xl border transition-all duration-500 cursor-pointer ${
                      activeFeature === idx 
                        ? 'bg-white/10 border-white/30 scale-105' 
                        : 'bg-white/5 border-white/10 hover:bg-white/8'
                    }`}
                    onClick={() => setActiveFeature(idx)}
                  >
                    <div className="flex items-start space-x-4">
                      <div className={`p-3 rounded-xl bg-gradient-to-r ${feature.color} shadow-lg`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-white/70">{feature.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Interactive Preview */}
              <div className="relative">
                <div className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                  <div className="aspect-square bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-2xl p-8 relative overflow-hidden">
                    {/* Dynamic Feature Visualization */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className={`w-20 h-20 rounded-2xl bg-gradient-to-r ${features[activeFeature].color} mb-6 mx-auto flex items-center justify-center transform animate-pulse`}>
                          {React.createElement(features[activeFeature].icon, { className: "h-10 w-10 text-white" })}
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-3">{features[activeFeature].title}</h3>
                        <p className="text-white/80">{features[activeFeature].description}</p>
                      </div>
                    </div>

                    {/* Animated Elements */}
                    <div className="absolute top-4 left-4 w-3 h-3 bg-green-400 rounded-full animate-ping"></div>
                    <div className="absolute top-4 right-4 w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                    <div className="absolute bottom-4 left-4 w-2 h-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="absolute bottom-4 right-4 w-3 h-3 bg-pink-400 rounded-full animate-ping"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack Section */}
      <section id="technology" className="py-32 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Built on{' '}
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Modern Tech
              </span>
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Enterprise-grade architecture designed for scale, security, and seamless user experience
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {technologies.map((tech, idx) => (
              <Card key={idx} className="bg-white/5 backdrop-blur-md border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105 group">
                <CardContent className="p-6 text-center">
                  <div className="mb-4">
                    <tech.icon className="h-12 w-12 text-blue-400 mx-auto group-hover:text-blue-300 transition-colors" />
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{tech.name}</h3>
                  <p className="text-white/70 text-sm">{tech.desc}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced MakrVerse Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Enter the{' '}
              <span className="bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                MakrVerse
              </span>
            </h2>
            <p className="text-2xl text-white/80">Google Earth for the maker world - explore, discover, connect</p>
          </div>

          <div className="max-w-6xl mx-auto mb-12">
            <Card className="bg-white/10 backdrop-blur-md border-white/20 overflow-hidden">
              <CardContent className="p-0">
                <div className="relative h-[500px] bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 overflow-hidden">
                  {/* Enhanced 3D Globe Visualization */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-full h-full">
                      {/* Rotating Globe Effect */}
                      <div className="absolute inset-0 rounded-full border-2 border-blue-400/30 animate-spin" style={{ animationDuration: '20s' }}></div>
                      <div className="absolute inset-4 rounded-full border border-purple-400/20 animate-spin" style={{ animationDuration: '15s', animationDirection: 'reverse' }}></div>
                      
                      {/* Continents with glow effect */}
                      <div className="absolute top-1/4 left-1/3 w-32 h-24 bg-green-700/30 rounded-full blur-sm shadow-lg shadow-green-500/20"></div>
                      <div className="absolute top-1/3 right-1/4 w-28 h-20 bg-green-600/30 rounded-lg blur-sm shadow-lg shadow-green-500/20"></div>
                      <div className="absolute bottom-1/3 left-1/4 w-24 h-16 bg-green-700/30 rounded-full blur-sm shadow-lg shadow-green-500/20"></div>

                      {/* Enhanced Active MakrCaves with ripple effects */}
                      {[
                        { top: '33%', left: '33%', color: 'green', delay: '0s' },
                        { top: '50%', right: '33%', color: 'yellow', delay: '0.5s' },
                        { bottom: '50%', left: '50%', color: 'blue', delay: '1s' },
                        { top: '66%', left: '66%', color: 'purple', delay: '1.5s' },
                        { top: '25%', right: '25%', color: 'pink', delay: '2s' },
                        { bottom: '30%', right: '40%', color: 'cyan', delay: '2.5s' }
                      ].map((cave, idx) => (
                        <div key={idx} className="absolute" style={{ ...cave, color: undefined }}>
                          <div className={`relative w-6 h-6 bg-${cave.color}-400 rounded-full animate-pulse shadow-lg shadow-${cave.color}-400/50`}>
                            <div className={`absolute inset-0 w-6 h-6 bg-${cave.color}-400 rounded-full animate-ping`} style={{ animationDelay: cave.delay }}></div>
                            <div className={`absolute -inset-2 w-10 h-10 border-2 border-${cave.color}-400/30 rounded-full animate-pulse`}></div>
                          </div>
                        </div>
                      ))}

                      {/* Dynamic connection lines */}
                      <svg className="absolute inset-0 w-full h-full opacity-40">
                        <defs>
                          <linearGradient id="connectionGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
                            <stop offset="50%" stopColor="rgb(147, 51, 234)" stopOpacity="0.6" />
                            <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.4" />
                          </linearGradient>
                        </defs>
                        {[
                          { x1: '33%', y1: '33%', x2: '66%', y2: '50%' },
                          { x1: '66%', y1: '50%', x2: '50%', y2: '50%' },
                          { x1: '50%', y1: '50%', x2: '66%', y2: '66%' },
                          { x1: '33%', y1: '33%', x2: '75%', y2: '25%' },
                          { x1: '75%', y1: '25%', x2: '60%', y2: '70%' }
                        ].map((line, idx) => (
                          <line
                            key={idx}
                            {...line}
                            stroke="url(#connectionGradient)"
                            strokeWidth="2"
                            className="animate-pulse"
                            style={{ animationDelay: `${idx * 0.3}s` }}
                          />
                        ))}
                      </svg>

                      {/* Enhanced live activity indicators */}
                      <div className="absolute top-6 left-6 bg-black/80 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                        <div className="flex items-center text-green-400 text-sm mb-2">
                          <div className="w-3 h-3 bg-green-400 rounded-full mr-3 animate-pulse"></div>
                          <span className="font-semibold">1,247 Makers Online</span>
                        </div>
                        <div className="flex items-center text-blue-400 text-sm">
                          <div className="w-3 h-3 bg-blue-400 rounded-full mr-3 animate-pulse"></div>
                          <span className="font-semibold">89 Projects Active</span>
                        </div>
                      </div>
                      
                      <div className="absolute top-6 right-6 bg-black/80 backdrop-blur-md rounded-xl px-4 py-3 border border-white/10">
                        <div className="flex items-center text-yellow-400 text-sm mb-2">
                          <div className="w-3 h-3 bg-yellow-400 rounded-full mr-3 animate-pulse"></div>
                          <span className="font-semibold">156 Machines Running</span>
                        </div>
                        <div className="flex items-center text-purple-400 text-sm">
                          <div className="w-3 h-3 bg-purple-400 rounded-full mr-3 animate-pulse"></div>
                          <span className="font-semibold">12 Jobs Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced overlay content */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end justify-center p-8">
                    <div className="text-center">
                      <h3 className="text-4xl font-bold text-white mb-4">Real-Time Global Network</h3>
                      <p className="text-lg text-white/80 mb-8 max-w-md">
                        Watch live projects, discover makers, and explore the future of distributed manufacturing
                      </p>
                      <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/makrverse">
                          <Button className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white px-8 py-3 text-lg shadow-xl shadow-purple-500/25 hover:scale-105 transition-all duration-300">
                            <Globe className="mr-2 h-5 w-5" />
                            Launch MakrVerse
                          </Button>
                        </Link>
                        <Button variant="outline" className="border-white/30 text-white hover:bg-white/10 px-8 py-3 text-lg backdrop-blur-md">
                          <Heart className="mr-2 h-5 w-5" />
                          Add to Wishlist
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Original Map Section */}
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-6">
              Find Physical MakrCaves Near You
            </h3>
            <p className="text-white/70">Discover real makerspaces in your area</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/95 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <div className="mb-6">
                  <InteractiveMap />
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link to="/portal/map">
                    <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                      Explore Full Map
                    </Button>
                  </Link>
                  <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
                    Start Your Own MakrCave
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Continue with remaining sections... */}
      {/* For brevity, I'll continue with a few more key sections */}

      {/* Enhanced CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20"></div>
        <div className="container mx-auto px-6 relative">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-5xl md:text-6xl font-bold text-white mb-8">
              Ready to{' '}
              <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
                Transform
              </span>{' '}
              Your Space?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Join thousands of makers already using MakrCave to revolutionize their creative process. 
              The future of making starts today.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link to="/register">
                <Button size="lg" className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 hover:from-blue-600 hover:via-purple-600 hover:to-pink-600 text-white border-none text-xl px-12 py-6 shadow-2xl shadow-blue-500/25 hover:shadow-3xl hover:shadow-blue-500/40 transition-all duration-300 hover:scale-105">
                  <Lightbulb className="mr-3 h-6 w-6" />
                  Start Your Journey
                </Button>
              </Link>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-xl px-12 py-6 backdrop-blur-md transition-all duration-300 hover:scale-105">
                <BookOpen className="mr-3 h-6 w-6" />
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="py-20 bg-black/60 border-t border-white/10 backdrop-blur-xl">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-xl">M</span>
                </div>
                <span className="text-2xl font-bold text-white">MakrCave</span>
                <Badge className="bg-green-500/20 text-green-400 border-green-500/30">LIVE</Badge>
              </div>
              <p className="text-white/70 text-lg leading-relaxed max-w-md">
                Empowering the next generation of makers with intelligent tools, 
                connected spaces, and a global community of creators.
              </p>
              <div className="flex space-x-4 mt-6">
                {['GitHub', 'Discord', 'Twitter', 'YouTube'].map((platform) => (
                  <a key={platform} href="#" className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors">
                    <span className="text-white/60 text-sm">{platform[0]}</span>
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Platform</h4>
              <ul className="space-y-3 text-white/70">
                <li><Link to="/find-makerspace" className="hover:text-white transition-colors">Find MakrCave</Link></li>
                <li><Link to="/makrverse" className="hover:text-white transition-colors">MakrVerse Explorer</Link></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><Link to="/pricing" className="hover:text-white transition-colors">Pricing</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-6 text-lg">Company</h4>
              <ul className="space-y-3 text-white/70">
                <li><Link to="/about" className="hover:text-white transition-colors">About Us</Link></li>
                <li><Link to="/careers" className="hover:text-white transition-colors">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                <li><Link to="/blog" className="hover:text-white transition-colors">Blog</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60">
              © 2024 MakrCave. Shaping the future of making.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/privacy" className="text-white/60 hover:text-white text-sm transition-colors">Privacy</Link>
              <Link to="/terms" className="text-white/60 hover:text-white text-sm transition-colors">Terms</Link>
              <Link to="/security" className="text-white/60 hover:text-white text-sm transition-colors">Security</Link>
            </div>
          </div>
        </div>
      </footer>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        @keyframes grid-move {
          0% { transform: translate(0, 0); }
          100% { transform: translate(50px, 50px); }
        }
      `}</style>
    </div>
  );
};

export default EnhancedLandingPage;
