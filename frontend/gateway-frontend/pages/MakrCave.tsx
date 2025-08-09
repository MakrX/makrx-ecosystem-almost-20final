import { Building2, Calendar, Package, Users, Wrench, Plus, ArrowRight, ExternalLink, Shield, BarChart3, Zap } from "lucide-react";
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { useState } from 'react';

interface Makerspace {
  id: string;
  name: string;
  location: string;
  capacity: number;
  currentUsers: number;
  equipment: string[];
  status: 'Open' | 'Busy' | 'Closed';
  image: string;
  price: string;
}

const makerspaces: Makerspace[] = [
  {
    id: '1',
    name: 'TechHub Downtown',
    location: 'San Francisco, CA',
    capacity: 50,
    currentUsers: 23,
    equipment: ['3D Printers', 'Laser Cutters', 'CNC Mills', 'Electronics Lab'],
    status: 'Open',
    image: '/api/placeholder/400/250',
    price: '$25/day'
  },
  {
    id: '2',
    name: 'MakerSpace Austin',
    location: 'Austin, TX',
    capacity: 75,
    currentUsers: 67,
    equipment: ['3D Printers', 'Woodworking', 'Textiles', 'Ceramics'],
    status: 'Busy',
    image: '/api/placeholder/400/250',
    price: '$20/day'
  },
  {
    id: '3',
    name: 'Innovation Lab NYC',
    location: 'New York, NY',
    capacity: 100,
    currentUsers: 0,
    equipment: ['Advanced CNC', 'Metal Working', 'Electronics', 'Testing Lab'],
    status: 'Closed',
    image: '/api/placeholder/400/250',
    price: '$35/day'
  }
];

interface QuickAction {
  title: string;
  description: string;
  icon: any;
  action: string;
  color: string;
  available: boolean;
}

const quickActions: QuickAction[] = [
  {
    title: 'Book Equipment',
    description: 'Reserve 3D printers, laser cutters, and other tools',
    icon: Calendar,
    action: 'book',
    color: 'makrx-blue',
    available: true
  },
  {
    title: 'Manage Inventory',
    description: 'Track materials, components, and supplies',
    icon: Package,
    action: 'inventory',
    color: 'makrx-yellow',
    available: true
  },
  {
    title: 'View Analytics',
    description: 'Monitor usage, costs, and productivity metrics',
    icon: BarChart3,
    action: 'analytics',
    color: 'makrx-brown',
    available: true
  },
  {
    title: 'Manage Members',
    description: 'Add users, assign roles, and track access',
    icon: Users,
    action: 'members',
    color: 'makrx-blue',
    available: true
  },
  {
    title: 'Maintenance',
    description: 'Schedule upkeep and track equipment health',
    icon: Wrench,
    action: 'maintenance',
    color: 'makrx-yellow',
    available: true
  },
  {
    title: 'Add Equipment',
    description: 'Register new tools and set availability',
    icon: Plus,
    action: 'add-equipment',
    color: 'makrx-brown',
    available: true
  }
];

export default function MakrCave() {
  const { isAuthenticated, user } = useAuth();
  const [selectedSpace, setSelectedSpace] = useState<string | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Open': return 'text-green-600 bg-green-100';
      case 'Busy': return 'text-yellow-600 bg-yellow-100';
      case 'Closed': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const handleQuickAction = (action: string) => {
    if (!isAuthenticated) {
      return;
    }
    // Simulate navigation to MakrCave app
    console.log(`Navigating to ${action} in MakrCave`);
  };

  const handleEnterSpace = (spaceId: string) => {
    if (!isAuthenticated) {
      return;
    }
    setSelectedSpace(spaceId);
    // Simulate entering the makerspace
    setTimeout(() => {
      console.log(`Entering makerspace ${spaceId}`);
      setSelectedSpace(null);
    }, 1500);
  };

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-makrx-blue/20 rounded-2xl flex items-center justify-center">
              <Building2 className="w-12 h-12 text-makrx-blue" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-makrx-blue">MakrCave</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your complete makerspace management portal. Access tools, manage projects, 
            and collaborate with your maker community.
          </p>
        </div>

        {/* User Status */}
        {isAuthenticated && (
          <div className="mb-8">
            <div className="makrx-glass-card">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Welcome back, {user?.firstName}!</h3>
                  <p className="text-muted-foreground">Ready to continue making?</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-makrx-blue">3</div>
                    <div className="text-xs text-muted-foreground">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-makrx-yellow">12</div>
                    <div className="text-xs text-muted-foreground">Hours This Week</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-makrx-brown">$45</div>
                    <div className="text-xs text-muted-foreground">Credit Balance</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <button
                  key={index}
                  onClick={() => handleQuickAction(action.action)}
                  disabled={!isAuthenticated || !action.available}
                  className={`makrx-glass-card text-left hover:scale-105 transition-transform ${
                    !isAuthenticated || !action.available ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 bg-${action.color}/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                      <Icon className={`w-6 h-6 text-${action.color}`} />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{action.title}</h3>
                      <p className="text-sm text-muted-foreground">{action.description}</p>
                      {!isAuthenticated && (
                        <p className="text-xs text-red-400 mt-1">Login required</p>
                      )}
                    </div>
                    <ArrowRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Available Makerspaces */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Available Makerspaces</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {makerspaces.map((space) => (
              <div key={space.id} className="makrx-glass-card">
                <div className="relative mb-4 rounded-lg overflow-hidden">
                  <img 
                    src={space.image} 
                    alt={space.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(space.status)}`}>
                      {space.status}
                    </span>
                  </div>
                  <div className="absolute bottom-2 left-2 bg-black/60 text-white px-2 py-1 rounded text-sm">
                    {space.price}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <h3 className="text-lg font-semibold">{space.name}</h3>
                    <p className="text-sm text-muted-foreground">{space.location}</p>
                  </div>

                  <div className="flex items-center justify-between text-sm">
                    <span>Capacity</span>
                    <span>{space.currentUsers}/{space.capacity} users</span>
                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${
                        space.currentUsers / space.capacity > 0.8 ? 'bg-red-500' :
                        space.currentUsers / space.capacity > 0.6 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(space.currentUsers / space.capacity) * 100}%` }}
                    ></div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-1">Available Equipment:</p>
                    <div className="flex flex-wrap gap-1">
                      {space.equipment.slice(0, 3).map((item, index) => (
                        <span key={index} className="text-xs bg-white/10 px-2 py-1 rounded">
                          {item}
                        </span>
                      ))}
                      {space.equipment.length > 3 && (
                        <span className="text-xs text-muted-foreground">+{space.equipment.length - 3} more</span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => handleEnterSpace(space.id)}
                    disabled={!isAuthenticated || space.status === 'Closed' || selectedSpace === space.id}
                    className={`w-full py-2 rounded-lg transition-colors flex items-center justify-center gap-2 ${
                      space.status === 'Closed' || !isAuthenticated
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-makrx-blue text-white hover:bg-makrx-blue/90'
                    }`}
                  >
                    {selectedSpace === space.id ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Connecting...
                      </>
                    ) : space.status === 'Closed' ? (
                      'Closed'
                    ) : !isAuthenticated ? (
                      'Login to Access'
                    ) : (
                      <>
                        <ExternalLink className="w-4 h-4" />
                        Enter Space
                      </>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Features Overview */}
        <div className="max-w-4xl mx-auto">
          <div className="makrx-glass-card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Complete Makerspace Management</h2>
              <p className="text-muted-foreground">
                Everything you need to run an efficient, productive, and safe makerspace environment.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="text-center p-4">
                <Shield className="w-12 h-12 text-makrx-blue mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Safety & Access Control</h3>
                <p className="text-sm text-muted-foreground">
                  Skill-gated equipment access, safety training tracking, and emergency protocols
                </p>
              </div>
              <div className="text-center p-4">
                <BarChart3 className="w-12 h-12 text-makrx-yellow mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Analytics & Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Usage analytics, cost tracking, member activity, and equipment performance
                </p>
              </div>
              <div className="text-center p-4">
                <Zap className="w-12 h-12 text-makrx-brown mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Automation</h3>
                <p className="text-sm text-muted-foreground">
                  Automated billing, inventory reordering, maintenance scheduling, and notifications
                </p>
              </div>
            </div>

            <div className="text-center">
              {isAuthenticated ? (
                <div className="space-y-4">
                  <button className="makrx-btn-primary mr-4">
                    Access Full Dashboard
                  </button>
                  <button className="makrx-btn-secondary">
                    Create New Makerspace
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <p className="text-muted-foreground mb-4">
                    Sign in to access your makerspaces or create a new one
                  </p>
                  <Link to="/login" className="makrx-btn-primary mr-4">
                    Sign In
                  </Link>
                  <Link to="/register" className="makrx-btn-secondary">
                    Create Account
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
