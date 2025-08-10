import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Mail, Phone, MapPin, Github, Twitter, Instagram, Linkedin,
  Building2, ShoppingCart, GraduationCap, Star, Heart,
  ArrowUp, ExternalLink
} from 'lucide-react';

const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-white">
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-6">
              <img 
                src="https://cdn.builder.io/api/v1/assets/f367f5e46f75423a83d3f29fae529dbb/botlogofinal-c921e6?format=webp&width=800" 
                alt="MakrX" 
                className="w-8 h-8 mr-3"
              />
              <span className="text-2xl font-bold">
                Makr<span className="text-makrx-yellow">X</span>
              </span>
            </div>
            
            <p className="text-gray-300 mb-6 leading-relaxed">
              Empowering makers, innovators, and creators with access to world-class makerspaces, 
              tools, and learning opportunities across India.
            </p>
            
            <div className="flex space-x-4">
              <a 
                href="https://twitter.com/makrx" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-makrx-blue transition-colors"
                aria-label="Follow us on Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/makrx" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-makrx-blue transition-colors"
                aria-label="Follow us on Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/makrx" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-makrx-blue transition-colors"
                aria-label="Follow us on LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/makrx" 
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-makrx-blue transition-colors"
                aria-label="Check out our GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Platform</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/makrcave" 
                  className="flex items-center text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  <Building2 className="w-4 h-4 mr-2" />
                  MakrCave
                </Link>
              </li>
              <li>
                <Link 
                  to="/store" 
                  className="flex items-center text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  MakrX Store
                </Link>
              </li>
              <li>
                <Link 
                  to="/learn" 
                  className="flex items-center text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  <GraduationCap className="w-4 h-4 mr-2" />
                  Learning Hub
                </Link>
              </li>
              <li>
                <Link 
                  to="/community" 
                  className="flex items-center text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  <Star className="w-4 h-4 mr-2" />
                  Community
                </Link>
              </li>
            </ul>
          </div>

          {/* Support & Resources */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Support</h3>
            <ul className="space-y-4">
              <li>
                <Link 
                  to="/help" 
                  className="text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  Help Center
                </Link>
              </li>
              <li>
                <Link 
                  to="/contact" 
                  className="text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link 
                  to="/faq" 
                  className="text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link 
                  to="/safety" 
                  className="text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  Safety Guidelines
                </Link>
              </li>
              <li>
                <a 
                  href="/api/docs" 
                  className="flex items-center text-gray-300 hover:text-makrx-yellow transition-colors"
                >
                  API Documentation
                  <ExternalLink className="w-3 h-3 ml-1" />
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Get in Touch</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <Mail className="w-5 h-5 text-makrx-yellow mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Email</p>
                  <a 
                    href="mailto:hello@makrx.org" 
                    className="text-white hover:text-makrx-yellow transition-colors"
                  >
                    hello@makrx.org
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <Phone className="w-5 h-5 text-makrx-yellow mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Phone</p>
                  <a 
                    href="tel:+911234567890" 
                    className="text-white hover:text-makrx-yellow transition-colors"
                  >
                    +91 12345 67890
                  </a>
                </div>
              </li>
              <li className="flex items-start">
                <MapPin className="w-5 h-5 text-makrx-yellow mr-3 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Headquarters</p>
                  <address className="text-white not-italic">
                    Bangalore, Karnataka<br />
                    India 560001
                  </address>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Newsletter Signup */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold mb-4">Stay Updated</h3>
            <p className="text-gray-300 max-w-2xl mx-auto">
              Get the latest news about new makerspaces, workshops, and exciting projects from the MakrX community.
            </p>
          </div>
          
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-l-lg text-white placeholder-gray-400 focus:outline-none focus:border-makrx-blue"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-makrx-yellow text-makrx-blue font-semibold rounded-r-lg hover:bg-yellow-300 transition-colors"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6">
              <p className="text-gray-400 text-sm">
                © 2024 MakrX Technologies Pvt Ltd. All rights reserved.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <Link 
                  to="/privacy" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Privacy Policy
                </Link>
                <span className="text-gray-600">•</span>
                <Link 
                  to="/terms" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Terms of Service
                </Link>
                <span className="text-gray-600">•</span>
                <Link 
                  to="/cookies" 
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  Cookie Policy
                </Link>
              </div>
            </div>

            <div className="flex items-center space-x-4 mt-4 md:mt-0">
              <div className="flex items-center text-gray-400 text-sm">
                Made with <Heart className="w-4 h-4 text-red-500 mx-1" /> in India
              </div>
              
              <button
                onClick={scrollToTop}
                className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-makrx-blue transition-colors"
                aria-label="Scroll to top"
              >
                <ArrowUp className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
