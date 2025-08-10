import React from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Play, Star, Users, Building2, ShoppingCart, 
  GraduationCap, Zap, Shield, Globe, CheckCircle, 
  ChevronRight, Award, TrendingUp, Heart
} from 'lucide-react';
import { useBooleanFlag } from '../lib/feature-flags';

interface StatCardProps {
  number: string;
  label: string;
  icon: React.ReactNode;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon }) => (
  <div className="text-center group">
    <div className="flex justify-center mb-4">
      <div className="w-16 h-16 bg-makrx-yellow/20 rounded-2xl flex items-center justify-center group-hover:bg-makrx-yellow/30 transition-colors">
        {icon}
      </div>
    </div>
    <div className="text-3xl font-bold text-white mb-2">{number}</div>
    <div className="text-white/80">{label}</div>
  </div>
);

interface FeatureCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  gradient: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, href, gradient }) => (
  <Link to={href} className="group block">
    <div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-8 h-full transition-all duration-500 group-hover:scale-105 group-hover:shadow-2xl group-hover:-rotate-1 border border-white/10`}>
      <div className="relative z-10">
        <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white/30 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
          {icon}
        </div>
        <h3 className="text-xl font-bold text-white mb-3 group-hover:text-makrx-yellow transition-colors duration-300">{title}</h3>
        <p className="text-white/90 mb-4 leading-relaxed group-hover:text-white transition-colors duration-300">{description}</p>
        <div className="flex items-center text-white font-medium group-hover:text-makrx-yellow transition-all duration-300">
          Explore <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300" />
        </div>
      </div>
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16 group-hover:scale-150 group-hover:bg-white/20 transition-all duration-700"></div>
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12 group-hover:scale-125 group-hover:bg-white/10 transition-all duration-700"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  </Link>
);

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
  company: string;
}

const Testimonial: React.FC<TestimonialProps> = ({ quote, author, role, company }) => (
  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
    <div className="flex items-center mb-4">
      {[...Array(5)].map((_, i) => (
        <Star key={i} className="w-5 h-5 text-makrx-yellow fill-current" />
      ))}
    </div>
    <p className="text-gray-700 mb-6 italic">"{quote}"</p>
    <div className="flex items-center">
      <div className="w-12 h-12 bg-makrx-blue rounded-full flex items-center justify-center text-white font-bold mr-4">
        {author.charAt(0)}
      </div>
      <div>
        <div className="font-semibold text-gray-900">{author}</div>
        <div className="text-gray-600 text-sm">{role}, {company}</div>
      </div>
    </div>
  </div>
);

export default function HomePage() {
  const showStats = useBooleanFlag('org.homepage.stats', true);
  const showTestimonials = useBooleanFlag('org.homepage.testimonials', true);
  const showVideo = useBooleanFlag('org.homepage.video', true);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-makrx-blue via-makrx-blue/90 to-purple-900">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            {/* Animated Logo/Brand */}
            <div className="mb-8">
              <div className="relative group">
                <h1 className="text-5xl lg:text-7xl font-display font-bold mb-4 leading-tight relative z-10">
                  <span className="text-white hover:text-makrx-yellow transition-colors duration-500 cursor-default">MakrX</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-makrx-yellow/20 to-transparent rounded-2xl blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 -z-10"></div>
                </h1>
              </div>
              <div className="text-2xl lg:text-4xl font-light text-white/80 mb-6">
                <span className="inline-block animate-slide-in-left hover:text-makrx-yellow transition-colors duration-300 cursor-default">Dream.</span>{' '}
                <span className="inline-block animate-slide-in-right hover:text-makrx-yellow transition-colors duration-300 cursor-default" style={{animationDelay: '0.5s'}}>Make.</span>{' '}
                <span className="inline-block animate-slide-in-left hover:text-makrx-yellow transition-colors duration-300 cursor-default" style={{animationDelay: '1s'}}>Share.</span>
              </div>
            </div>

            <div className="inline-flex items-center px-4 py-2 rounded-full bg-makrx-yellow/20 text-makrx-yellow text-sm font-medium mb-6">
              <Zap className="w-4 h-4 mr-2" />
              Welcome to the Future of Making
            </div>
          </div>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Access world-class makerspaces, shop cutting-edge tools, learn new skills, and bring your ideas to life.
            Join thousands of makers, innovators, and creators in the MakrX ecosystem.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-16">
            <Link
              to="/register"
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-makrx-yellow text-makrx-blue hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Get Started Free</span>
              <Zap className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:rotate-12 transition-all duration-300 relative z-10" />
            </Link>

            <button
              className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300 hover:scale-105 backdrop-blur-sm overflow-hidden"
              onClick={() => {/* Open app launcher */}}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              <span className="relative z-10">Launch Apps</span>
              <Play className="ml-3 w-5 h-5 group-hover:translate-x-1 group-hover:scale-110 transition-all duration-300 relative z-10" />
            </button>
          </div>

          {showVideo && (
            <div className="relative max-w-4xl mx-auto">
              <div className="aspect-video bg-black/20 rounded-2xl overflow-hidden backdrop-blur border border-white/20">
                <div className="w-full h-full flex items-center justify-center">
                  <button className="w-20 h-20 bg-makrx-yellow rounded-full flex items-center justify-center hover:bg-yellow-300 transition-colors group">
                    <Play className="w-8 h-8 text-makrx-blue ml-1 group-hover:scale-110 transition-transform" />
                  </button>
                </div>
              </div>
              <p className="text-white/70 mt-4">Watch how MakrX is transforming the maker ecosystem</p>
            </div>
          )}
        </div>

        {/* Enhanced Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 bg-makrx-yellow/20 rounded-full animate-float" style={{ animationDelay: '0s' }} />
        <div className="absolute bottom-20 right-10 w-16 h-16 bg-purple-400/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/3 right-20 w-12 h-12 bg-white/10 rounded-full animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/4 w-8 h-8 bg-makrx-blue/20 rounded-full animate-pulse-slow" style={{ animationDelay: '3s' }} />
        <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-white/15 rounded-full animate-bounce-gentle" style={{ animationDelay: '4s' }} />
      </section>

      {/* Stats Section */}
      {showStats && (
        <section className="py-20 bg-makrx-blue">
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
              <StatCard 
                number="50+" 
                label="Makerspaces" 
                icon={<Building2 className="w-8 h-8 text-makrx-yellow" />} 
              />
              <StatCard 
                number="10K+" 
                label="Active Makers" 
                icon={<Users className="w-8 h-8 text-makrx-yellow" />} 
              />
              <StatCard 
                number="1M+" 
                label="Projects Created" 
                icon={<Award className="w-8 h-8 text-makrx-yellow" />} 
              />
              <StatCard 
                number="25+" 
                label="Cities" 
                icon={<Globe className="w-8 h-8 text-makrx-yellow" />} 
              />
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything You Need to 
              <span className="text-makrx-blue"> Create</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From idea to reality, MakrX provides the tools, space, knowledge, and community to bring your vision to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              title="MakrCave"
              description="Access premium makerspaces with professional-grade equipment, from 3D printers to laser cutters, all in collaborative environments."
              icon={<Building2 className="w-6 h-6 text-white" />}
              href="/makrcave"
              gradient="from-blue-600 to-purple-700"
            />
            
            <FeatureCard
              title="MakrX Store"
              description="Shop curated tools, materials, and components. Get custom 3D printing services and expert recommendations for your projects."
              icon={<ShoppingCart className="w-6 h-6 text-white" />}
              href="/store"
              gradient="from-green-500 to-teal-600"
            />
            
            <FeatureCard
              title="Learn & Grow"
              description="Master new skills with hands-on workshops, online courses, and mentorship from experienced makers and industry experts."
              icon={<GraduationCap className="w-6 h-6 text-white" />}
              href="/learn"
              gradient="from-orange-500 to-red-600"
            />
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How MakrX Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Simple steps to transform your ideas into reality
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-makrx-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-makrx-yellow group-hover:scale-110 transition-all">
                <span className="text-2xl font-bold text-white group-hover:text-makrx-blue">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Discover & Plan</h3>
              <p className="text-gray-600 leading-relaxed">
                Explore makerspaces near you, browse tools and materials, and plan your project with our expert community guidance.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-makrx-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-makrx-yellow group-hover:scale-110 transition-all">
                <span className="text-2xl font-bold text-white group-hover:text-makrx-blue">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Create & Build</h3>
              <p className="text-gray-600 leading-relaxed">
                Access professional equipment, get materials delivered, and build with support from experienced makers and mentors.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-makrx-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-makrx-yellow group-hover:scale-110 transition-all">
                <span className="text-2xl font-bold text-white group-hover:text-makrx-blue">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share & Inspire</h3>
              <p className="text-gray-600 leading-relaxed">
                Showcase your creations, inspire others, and become part of a thriving community of makers and innovators.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-gray-900 to-makrx-blue">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Why Choose MakrX?
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Join the largest maker ecosystem in India with unmatched benefits
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Shield className="w-8 h-8 text-makrx-yellow" />,
                title: "Premium Quality",
                description: "Professional-grade equipment and materials with quality assurance"
              },
              {
                icon: <Users className="w-8 h-8 text-makrx-yellow" />,
                title: "Expert Community",
                description: "Learn from and collaborate with experienced makers and professionals"
              },
              {
                icon: <Zap className="w-8 h-8 text-makrx-yellow" />,
                title: "Fast & Reliable",
                description: "Quick access to spaces, fast delivery, and reliable service"
              },
              {
                icon: <Heart className="w-8 h-8 text-makrx-yellow" />,
                title: "Passionate Support",
                description: "Dedicated support team that understands and shares your passion"
              }
            ].map((benefit, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-white/20 transition-colors">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{benefit.title}</h3>
                <p className="text-white/80 leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      {showTestimonials && (
        <section className="py-24 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Loved by Makers
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Hear from the amazing creators who are already part of the MakrX family
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <Testimonial
                quote="MakrX transformed my startup journey. Access to professional 3D printers and laser cutters helped us prototype faster than ever."
                author="Priya Sharma"
                role="Founder"
                company="TechFlow Solutions"
              />
              <Testimonial
                quote="The community at MakrCave is incredible. I've learned more in 3 months than I did in years trying to figure things out alone."
                author="Rahul Mehta"
                role="Product Designer"
                company="Innovation Labs"
              />
              <Testimonial
                quote="From ordering materials to getting expert advice, everything is seamless. MakrX Store is now my go-to for all project needs."
                author="Anjali Gupta"
                role="Architect"
                company="Design Studio"
              />
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-makrx-blue to-purple-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Creating?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Join thousands of makers who are already bringing their ideas to life with MakrX. 
            Your creative journey starts here.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/register" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-makrx-yellow text-makrx-blue hover:bg-yellow-300 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
            >
              Get Started Free
              <ChevronRight className="ml-2 w-5 h-5" />
            </Link>
            
            <Link 
              to="/learn" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 hover:border-white/40 transition-all duration-300"
            >
              Explore Learning
              <GraduationCap className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
