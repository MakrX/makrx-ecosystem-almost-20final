import React from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { ArrowRight, MapPin, Users, Zap, Shield, Star, ChevronRight, Play, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Public Header */}
      <header className="relative z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="text-2xl font-bold text-white">MakrCave</span>
            </div>
            
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#explore" className="text-white/80 hover:text-white transition-colors">Explore</a>
              <a href="#features" className="text-white/80 hover:text-white transition-colors">Features</a>
              <a href="#institutions" className="text-white/80 hover:text-white transition-colors">Institutions</a>
              <a href="#community" className="text-white/80 hover:text-white transition-colors">Community</a>
            </nav>

            <div className="flex items-center space-x-4">
              <Link to="/register" className="text-white/80 hover:text-white transition-colors">
                Join the Movement
              </Link>
              <Link to="/login">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none">
                  Go to Portal
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-3xl"></div>
        <div className="relative container mx-auto px-6 py-32 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              A Universe for{' '}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Makers
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-white/80 mb-12 leading-relaxed">
              Tools. Spaces. Community. Power at your fingertips.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none text-lg px-8 py-4">
                <MapPin className="mr-2 h-5 w-5" />
                Find a MakrCave
              </Button>
              <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10 text-lg px-8 py-4">
                <Play className="mr-2 h-5 w-5" />
                Watch Demo
              </Button>
            </div>
          </div>
        </div>
        
        {/* Floating elements animation */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-blue-400 rounded-full animate-pulse opacity-60"></div>
          <div className="absolute top-1/3 right-1/4 w-2 h-2 bg-purple-400 rounded-full animate-pulse opacity-40 delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-3 h-3 bg-cyan-400 rounded-full animate-pulse opacity-50 delay-500"></div>
        </div>
      </section>

      {/* What is MakrCave */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              What is MakrCave?
            </h2>
            <p className="text-xl text-white/80 leading-relaxed">
              MakrCave is a network of makerspaces, tools, and service providers — powered by a futuristic platform that lets you make anything, anywhere.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              { icon: '🔧', label: 'Tools', desc: 'Access professional equipment' },
              { icon: '🏭', label: 'Spaces', desc: 'Physical makerspaces worldwide' },
              { icon: '💻', label: 'Portal', desc: 'Smart management platform' },
              { icon: '🛒', label: 'Store', desc: 'Instant manufacturing services' }
            ].map((item, idx) => (
              <div key={idx} className="text-center">
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-semibold text-white mb-2">{item.label}</h3>
                <p className="text-white/60">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Explore MakrCaves */}
      <section id="explore" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Explore MakrCaves
            </h2>
            <p className="text-xl text-white/80">Find makerspaces near you</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardContent className="p-8">
                <div className="bg-gray-800 rounded-lg h-64 flex items-center justify-center mb-6">
                  <div className="text-center text-white/60">
                    <MapPin className="h-12 w-12 mx-auto mb-4" />
                    <p>Interactive Map Coming Soon</p>
                    <p className="text-sm">Explore locations, tools, and availability</p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                    See Full Map
                  </Button>
                  <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                    Start Your Own MakrCave
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Who Is It For */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Who Is It For?
            </h2>
            <p className="text-xl text-white/80">MakrCave serves every type of maker</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                emoji: '🧑‍🎓',
                title: 'Students',
                message: 'Learn by doing. Get certified. Build anything.',
                features: ['Skill-based access', 'Learning paths', 'Certification tracking']
              },
              {
                emoji: '👨‍🔧',
                title: 'Tinkerers & Creators',
                message: 'Book tools. Start projects. Make magic.',
                features: ['Equipment booking', 'Project management', 'Community collaboration']
              },
              {
                emoji: '🏫',
                title: 'Institutions',
                message: 'Set up smart, automated, monitored spaces.',
                features: ['Usage tracking', 'Automated access', 'Safety monitoring']
              },
              {
                emoji: '🛠️',
                title: 'Makerspace Owners',
                message: 'Monetize. Manage. Scale.',
                features: ['Revenue optimization', 'Smart management', 'Network benefits']
              },
              {
                emoji: '🧑‍🏫',
                title: 'Mentors',
                message: 'Share your wisdom. Earn by teaching.',
                features: ['Skill verification', 'Teaching tools', 'Community impact']
              },
              {
                emoji: '🔧',
                title: 'Service Providers',
                message: 'Connect with makers. Grow your business.',
                features: ['Job marketplace', 'Skill matching', 'Quality assurance']
              }
            ].map((audience, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader className="text-center">
                  <div className="text-5xl mb-4">{audience.emoji}</div>
                  <CardTitle className="text-white text-xl">{audience.title}</CardTitle>
                  <CardDescription className="text-white/80">{audience.message}</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {audience.features.map((feature, featureIdx) => (
                      <li key={featureIdx} className="flex items-center text-white/70">
                        <ChevronRight className="h-4 w-4 mr-2 text-blue-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Inside the System */}
      <section id="features" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Inside the System
            </h2>
            <p className="text-xl text-white/80">Powered by cutting-edge technology</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: <Shield className="h-8 w-8" />,
                title: 'Skill-Gated Access',
                description: 'Equipment access based on verified skills and certifications'
              },
              {
                icon: <Zap className="h-8 w-8" />,
                title: 'Smart Inventory',
                description: 'Real-time tracking of tools, materials, and availability'
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: 'Community Learning',
                description: 'Connect with mentors and learn from experienced makers'
              },
              {
                icon: <Star className="h-8 w-8" />,
                title: 'Quality Assurance',
                description: 'Verified service providers and quality control systems'
              },
              {
                icon: <ArrowRight className="h-8 w-8" />,
                title: 'Instant Quoting',
                description: 'From STL to print quotes in seconds with MakrX.Store'
              },
              {
                icon: <MapPin className="h-8 w-8" />,
                title: 'Global Network',
                description: 'Access makerspaces and services worldwide'
              }
            ].map((feature, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
                <CardHeader>
                  <div className="text-blue-400 mb-4">{feature.icon}</div>
                  <CardTitle className="text-white">{feature.title}</CardTitle>
                  <CardDescription className="text-white/80">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-12">
            <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
              Explore Features
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* The Movement */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">
              The Movement
            </h2>
            <blockquote className="text-2xl md:text-3xl text-white/90 italic mb-8 leading-relaxed">
              "Open making. Real skills. Shared knowledge. Join the mission to make making accessible to everyone, everywhere."
            </blockquote>
            <p className="text-xl text-white/80 mb-8">
              We're not just building a platform — we're creating a revolution in how people learn, create, and collaborate.
            </p>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-lg px-6 py-2">
              Join the Mission
            </Badge>
          </div>
        </div>
      </section>

      {/* MakrCave x Institutions */}
      <section id="institutions" className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              MakrCave × Institutions
            </h2>
            <p className="text-xl text-white/80">For colleges, libraries, schools, R&D labs</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 max-w-6xl mx-auto items-center">
            <div>
              <h3 className="text-3xl font-bold text-white mb-6">Transform Your Institution</h3>
              <div className="space-y-6">
                {[
                  { title: 'Trackable Usage', desc: 'Monitor equipment usage and student engagement' },
                  { title: 'Automated Access', desc: 'Skill-based permissions and safety protocols' },
                  { title: 'Safe Learning', desc: 'Built-in safety measures and guided learning paths' },
                  { title: 'Modern Infrastructure', desc: 'Future-ready platform that scales with your needs' }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start space-x-4">
                    <div className="bg-blue-500 rounded-full p-2 mt-1">
                      <ChevronRight className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-white">{benefit.title}</h4>
                      <p className="text-white/70">{benefit.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Button className="mt-8 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                Get a Demo for Your Institution
                <ExternalLink className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-lg p-8 border border-white/20">
              <div className="space-y-4">
                <div className="h-4 bg-blue-400 rounded w-3/4"></div>
                <div className="h-4 bg-purple-400 rounded w-1/2"></div>
                <div className="h-4 bg-cyan-400 rounded w-2/3"></div>
                <div className="text-center text-white/60 py-8">
                  <Users className="h-12 w-12 mx-auto mb-4" />
                  <p>Interactive Dashboard Preview</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Become a MakrCave */}
      <section className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Become a MakrCave
            </h2>
            <p className="text-xl text-white/80">Join the global network of connected makerspaces</p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {[
                { step: '01', title: 'Apply', desc: 'Submit your makerspace for review' },
                { step: '02', title: 'Setup', desc: 'We evaluate & support your integration' },
                { step: '03', title: 'Launch', desc: 'Become part of the global network' }
              ].map((step, idx) => (
                <div key={idx} className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white text-2xl font-bold rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-white/70">{step.desc}</p>
                </div>
              ))}
            </div>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white text-2xl">Network Benefits</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {[
                    'Access to bulk inventory',
                    'Job forwarding from MakrX.Store',
                    'Monetize via membership plans'
                  ].map((benefit, idx) => (
                    <div key={idx} className="text-center">
                      <div className="bg-blue-500/20 rounded-lg p-4 mb-3">
                        <Star className="h-6 w-6 text-blue-400 mx-auto" />
                      </div>
                      <p className="text-white/80">{benefit}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Success Stories
            </h2>
            <p className="text-xl text-white/80">Real humans, real builds</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                quote: "MakrCave transformed how our engineering students learn. The skill-gated access ensures safety while encouraging exploration.",
                author: "Dr. Sarah Chen",
                role: "Engineering Dean, Tech University",
                project: "Built robotic arm prototype"
              },
              {
                quote: "As a makerspace owner, the analytics and automated systems have doubled our efficiency and member satisfaction.",
                author: "Marcus Johnson",
                role: "MakrSpace Austin Owner",
                project: "Scaled from 50 to 200 members"
              },
              {
                quote: "The community aspect is incredible. I've learned more in 6 months than I did in years of solo tinkering.",
                author: "Alex Rivera",
                role: "Hobbyist Maker",
                project: "3D printed prosthetic hand"
              }
            ].map((testimonial, idx) => (
              <Card key={idx} className="bg-white/10 backdrop-blur-md border-white/20">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <blockquote className="text-white/90 mb-4 italic">
                    "{testimonial.quote}"
                  </blockquote>
                  <div className="text-white">
                    <div className="font-semibold">{testimonial.author}</div>
                    <div className="text-sm text-white/70">{testimonial.role}</div>
                    <div className="text-sm text-blue-400 mt-1">{testimonial.project}</div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Community */}
      <section id="community" className="py-24 bg-black/20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Join the Community
            </h2>
            <p className="text-xl text-white/80">Connect, learn, and build together</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Discord & Forums</CardTitle>
                <CardDescription className="text-white/80">
                  Join thousands of makers sharing knowledge and projects
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button className="bg-[#5865F2] hover:bg-[#4752C4] text-white">
                  Join Discord
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Events & Hackathons</CardTitle>
                <CardDescription className="text-white/80">
                  Participate in global making events and competitions
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  View Events
                </Button>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="text-center">
                <CardTitle className="text-white">Project Showcase</CardTitle>
                <CardDescription className="text-white/80">
                  Share your builds and get inspired by others
                </CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <Button variant="outline" className="border-white/30 text-white hover:bg-white/10">
                  Explore Projects
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 bg-black/40 border-t border-white/10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-white">MakrCave</span>
              </div>
              <p className="text-white/70">
                Empowering makers worldwide with tools, spaces, and community.
              </p>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Discover</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#explore" className="hover:text-white transition-colors">Find MakrCave</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Start a MakrCave</a></li>
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#community" className="hover:text-white transition-colors">Community</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">For Organizations</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#institutions" className="hover:text-white transition-colors">Institutions</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Enterprise</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Access</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-white font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-white/70">
                <li><a href="#" className="hover:text-white transition-colors">Instagram</a></li>
                <li><a href="#" className="hover:text-white transition-colors">YouTube</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
                <li><a href="mailto:support@makrx.org" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/60 text-sm">
              © 2024 MakrCave. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 mt-4 md:mt-0">
              <Link to="/login" className="text-white/60 hover:text-white text-sm transition-colors">
                Portal Login
              </Link>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/60 hover:text-white text-sm transition-colors">
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
