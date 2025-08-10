import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, MapPin, Star, Clock, Users, Wifi, Coffee, 
  Zap, Shield, Search, Filter, ChevronRight, ArrowRight,
  Calendar, CheckCircle, Award, Wrench, Lightbulb, Heart
} from 'lucide-react';

interface MakerspaceCardProps {
  id: string;
  name: string;
  location: string;
  rating: number;
  reviews: number;
  hourlyRate: number;
  image: string;
  features: string[];
  equipment: string[];
  isOpen: boolean;
  nextAvailable?: string;
  distance?: string;
}

const MakerspaceCard: React.FC<MakerspaceCardProps> = ({
  id, name, location, rating, reviews, hourlyRate, image, 
  features, equipment, isOpen, nextAvailable, distance
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 group">
    <div className="relative h-48 bg-gray-200 overflow-hidden">
      <img 
        src={image} 
        alt={name}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
      <div className="absolute top-4 left-4">
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${
          isOpen ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {isOpen ? 'Open' : 'Closed'}
        </div>
      </div>
      {distance && (
        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur text-white px-3 py-1 rounded-full text-sm">
          {distance}
        </div>
      )}
    </div>
    
    <div className="p-6">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">{name}</h3>
          <div className="flex items-center text-gray-600 text-sm">
            <MapPin className="w-4 h-4 mr-1" />
            {location}
          </div>
        </div>
        
        <div className="text-right">
          <div className="flex items-center mb-1">
            <Star className="w-4 h-4 text-yellow-400 fill-current mr-1" />
            <span className="font-semibold">{rating}</span>
            <span className="text-gray-500 text-sm ml-1">({reviews})</span>
          </div>
          <div className="text-lg font-bold text-makrx-blue">₹{hourlyRate}/hr</div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {features.slice(0, 3).map((feature) => (
          <span key={feature} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-lg">
            {feature}
          </span>
        ))}
        {features.length > 3 && (
          <span className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-lg">
            +{features.length - 3} more
          </span>
        )}
      </div>

      <div className="mb-4">
        <p className="text-sm text-gray-600 mb-2">Popular Equipment:</p>
        <div className="text-sm text-gray-800">
          {equipment.slice(0, 3).join(', ')}
          {equipment.length > 3 && '...'}
        </div>
      </div>

      {!isOpen && nextAvailable && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-3 mb-4">
          <div className="flex items-center text-orange-700 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            Opens {nextAvailable}
          </div>
        </div>
      )}

      <div className="flex space-x-3">
        <Link 
          to={`/makrcave/${id}`}
          className="flex-1 bg-makrx-blue text-white text-center py-2 px-4 rounded-xl font-medium hover:bg-makrx-blue/90 transition-colors"
        >
          View Details
        </Link>
        <button className="px-4 py-2 border border-makrx-blue text-makrx-blue rounded-xl font-medium hover:bg-makrx-blue hover:text-white transition-colors">
          Book Now
        </button>
      </div>
    </div>
  </div>
);

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ icon, title, description }) => (
  <div className="text-center group">
    <div className="w-16 h-16 bg-makrx-blue/10 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-makrx-blue/20 transition-colors">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 mb-3">{title}</h3>
    <p className="text-gray-600 leading-relaxed">{description}</p>
  </div>
);

export default function MakrCave() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [priceRange, setPriceRange] = useState('');

  const makerspaces = [
    {
      id: 'techub-bangalore',
      name: 'TechHub Bangalore',
      location: 'HSR Layout, Bangalore',
      rating: 4.8,
      reviews: 156,
      hourlyRate: 150,
      image: '/placeholder.svg',
      features: ['24/7 Access', 'WiFi', 'Coffee', 'Parking', 'Security'],
      equipment: ['3D Printers', 'Laser Cutters', 'CNC Machines', 'Electronics Lab'],
      isOpen: true,
      distance: '2.3 km'
    },
    {
      id: 'maker-mumbai',
      name: 'MakerSpace Mumbai',
      location: 'Bandra West, Mumbai',
      rating: 4.6,
      reviews: 89,
      hourlyRate: 200,
      image: '/placeholder.svg',
      features: ['Mentorship', 'WiFi', 'Storage', 'Community'],
      equipment: ['3D Printers', 'Laser Cutters', 'Wood Workshop', 'Metal Workshop'],
      isOpen: false,
      nextAvailable: 'Tomorrow at 9 AM',
      distance: '5.1 km'
    },
    {
      id: 'innovation-delhi',
      name: 'Innovation Lab Delhi',
      location: 'Connaught Place, Delhi',
      rating: 4.7,
      reviews: 203,
      hourlyRate: 180,
      image: '/placeholder.svg',
      features: ['Certified Trainers', 'WiFi', 'Cafe', 'Event Space'],
      equipment: ['3D Printers', 'Soldering Stations', 'PCB Mill', 'Testing Equipment'],
      isOpen: true,
      distance: '1.8 km'
    }
  ];

  const cities = ['Bangalore', 'Mumbai', 'Delhi', 'Pune', 'Hyderabad', 'Chennai'];
  const equipmentTypes = ['3D Printers', 'Laser Cutters', 'CNC Machines', 'Electronics Lab', 'Wood Workshop'];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative py-24 bg-gradient-to-br from-makrx-blue via-makrx-blue/90 to-purple-900 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-hero-pattern" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-makrx-yellow/20 text-makrx-yellow text-sm font-medium mb-6">
              <Building2 className="w-4 h-4 mr-2" />
              50+ Premium Makerspaces
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Access World-Class
            <span className="block bg-gradient-to-r from-makrx-yellow to-yellow-300 bg-clip-text text-transparent">
              Makerspaces
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-12 max-w-4xl mx-auto leading-relaxed">
            Professional equipment, expert mentorship, and collaborative communities 
            in premium makerspaces across India's major cities.
          </p>

          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-2xl p-6 shadow-2xl">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search makerspaces..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-makrx-blue/20 focus:border-makrx-blue transition-colors"
                />
              </div>
              
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-makrx-blue/20 focus:border-makrx-blue transition-colors"
              >
                <option value="">All Cities</option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
              
              <select
                value={selectedEquipment}
                onChange={(e) => setSelectedEquipment(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-makrx-blue/20 focus:border-makrx-blue transition-colors"
              >
                <option value="">All Equipment</option>
                {equipmentTypes.map(equipment => (
                  <option key={equipment} value={equipment}>{equipment}</option>
                ))}
              </select>
              
              <button className="w-full bg-makrx-blue text-white py-3 px-6 rounded-xl font-semibold hover:bg-makrx-blue/90 transition-colors flex items-center justify-center">
                <Search className="w-5 h-5 mr-2" />
                Search
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
            <div className="text-center">
              <div className="text-4xl font-bold text-makrx-blue mb-2">50+</div>
              <div className="text-gray-600">Makerspaces</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-makrx-blue mb-2">25+</div>
              <div className="text-gray-600">Cities</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-makrx-blue mb-2">5000+</div>
              <div className="text-gray-600">Active Makers</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-makrx-blue mb-2">95%</div>
              <div className="text-gray-600">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Makerspaces */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Featured Makerspaces
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Discover premium makerspaces with professional equipment and expert communities
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {makerspaces.map((makerspace) => (
              <MakerspaceCard key={makerspace.id} {...makerspace} />
            ))}
          </div>

          <div className="text-center mt-12">
            <button className="makrx-btn-primary text-lg px-8 py-4">
              View All Makerspaces
              <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why Choose MakrCave?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to bring your ideas to life
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            <FeatureCard
              icon={<Tool className="w-8 h-8 text-makrx-blue" />}
              title="Professional Equipment"
              description="Access high-end 3D printers, laser cutters, CNC machines, and specialized tools maintained to industry standards."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-makrx-blue" />}
              title="Expert Community"
              description="Learn from experienced makers, mentors, and industry professionals who are passionate about sharing knowledge."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-makrx-blue" />}
              title="Safety First"
              description="Comprehensive safety training, protective equipment, and certified operator supervision for all high-risk equipment."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-makrx-blue" />}
              title="Fast & Flexible"
              description="Book equipment by the hour, day, or month. Real-time availability and instant booking confirmation."
            />
          </div>
        </div>
      </section>

      {/* Equipment Showcase */}
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              State-of-the-Art Equipment
            </h2>
            <p className="text-xl text-white/80 max-w-3xl mx-auto">
              Professional-grade tools and machines available across our makerspace network
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "3D Printing",
                description: "FDM, SLA, and professional 3D printers with various materials",
                features: ["Multiple Materials", "High Precision", "Large Build Volume"]
              },
              {
                title: "Laser Cutting",
                description: "CO2 and fiber laser cutters for various materials and thicknesses",
                features: ["Precise Cuts", "Multiple Materials", "Fast Processing"]
              },
              {
                title: "CNC Machining",
                description: "Computer-controlled milling and turning for metal and wood",
                features: ["High Precision", "Metal & Wood", "Production Quality"]
              },
              {
                title: "Electronics Lab",
                description: "Soldering stations, oscilloscopes, and PCB prototyping tools",
                features: ["Circuit Design", "PCB Prototyping", "Testing Equipment"]
              },
              {
                title: "Wood Workshop",
                description: "Traditional and modern woodworking tools and machinery",
                features: ["Hand Tools", "Power Tools", "Finishing Equipment"]
              },
              {
                title: "Metal Workshop",
                description: "Welding, grinding, and metal fabrication equipment",
                features: ["TIG/MIG Welding", "Metal Cutting", "Forming Tools"]
              }
            ].map((equipment, index) => (
              <div key={index} className="bg-white/10 backdrop-blur rounded-2xl p-8 hover:bg-white/20 transition-colors">
                <h3 className="text-xl font-bold mb-4">{equipment.title}</h3>
                <p className="text-white/80 mb-6 leading-relaxed">{equipment.description}</p>
                <ul className="space-y-2">
                  {equipment.features.map((feature, i) => (
                    <li key={i} className="flex items-center text-white/90">
                      <CheckCircle className="w-4 h-4 text-makrx-yellow mr-3 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              How It Works
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Getting started is simple and straightforward
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center group">
              <div className="w-20 h-20 bg-makrx-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-makrx-yellow group-hover:scale-110 transition-all">
                <span className="text-2xl font-bold text-white group-hover:text-makrx-blue">1</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Browse & Book</h3>
              <p className="text-gray-600 leading-relaxed">
                Search makerspaces by location, equipment, and availability. Book your preferred time slot instantly.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-makrx-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-makrx-yellow group-hover:scale-110 transition-all">
                <span className="text-2xl font-bold text-white group-hover:text-makrx-blue">2</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Learn & Create</h3>
              <p className="text-gray-600 leading-relaxed">
                Get equipment training, access expert mentorship, and start building your projects with professional tools.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-makrx-blue rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:bg-makrx-yellow group-hover:scale-110 transition-all">
                <span className="text-2xl font-bold text-white group-hover:text-makrx-blue">3</span>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Share & Connect</h3>
              <p className="text-gray-600 leading-relaxed">
                Showcase your projects, get feedback from the community, and collaborate with fellow makers.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-makrx-blue to-purple-700">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Start Making?
          </h2>
          <p className="text-xl text-white/90 mb-12 leading-relaxed">
            Join thousands of makers who are already bringing their ideas to life in our premium makerspaces.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <button className="makrx-btn-primary text-lg px-8 py-4">
              Find Makerspaces Near You
              <Building2 className="ml-2 w-5 h-5" />
            </button>
            
            <Link 
              to="/learn" 
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold rounded-2xl bg-white/10 text-white border-2 border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              Learn More
              <Lightbulb className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
