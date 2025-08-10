import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  X, Building2, ShoppingCart, GraduationCap, Settings,
  FileText, Calendar, BarChart3, HelpCircle, ExternalLink,
  Users, Wrench, Globe, BookOpen, Star
} from 'lucide-react';

interface LauncherAppProps {
  name: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  isExternal?: boolean;
  isNew?: boolean;
  color: string;
}

const LauncherApp: React.FC<LauncherAppProps> = ({ 
  name, description, icon, href, isExternal, isNew, color 
}) => (
  <Link
    to={href}
    className={`group p-6 rounded-2xl border border-gray-200 hover:border-${color} hover:shadow-lg transition-all duration-200 bg-white`}
  >
    <div className="flex items-start gap-4">
      <div className={`w-12 h-12 bg-${color}/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-900 group-hover:text-gray-700">{name}</h3>
          {isNew && (
            <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">New</span>
          )}
          {isExternal && <ExternalLink className="w-3 h-3 text-gray-400" />}
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">{description}</p>
      </div>
    </div>
  </Link>
);

interface AppLauncherProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AppLauncher({ isOpen, onClose }: AppLauncherProps) {
  if (!isOpen) return null;

  const coreApps: LauncherAppProps[] = [
    {
      name: "MakrCave",
      description: "Manage makerspaces, equipment, and projects",
      icon: <Building2 className="w-6 h-6 text-makrx-blue" />,
      href: "/makrcave",
      color: "makrx-blue"
    },
    {
      name: "MakrX Store", 
      description: "Shop tools and order custom manufacturing",
      icon: <ShoppingCart className="w-6 h-6 text-makrx-yellow" />,
      href: "/store",
      color: "makrx-yellow"
    },
    {
      name: "Learn Platform",
      description: "Take courses and earn certifications",
      icon: <GraduationCap className="w-6 h-6 text-makrx-brown" />,
      href: "/learn",
      color: "makrx-brown"
    },
    {
      name: "Provider Panel",
      description: "Fulfill orders and manage your services",
      icon: <Settings className="w-6 h-6 text-green-600" />,
      href: "#",
      isExternal: true,
      isNew: true,
      color: "green-600"
    }
  ];

  const resourceApps: LauncherAppProps[] = [
    {
      name: "Documentation",
      description: "API guides and user documentation",
      icon: <FileText className="w-6 h-6 text-blue-600" />,
      href: "/docs",
      color: "blue-600"
    },
    {
      name: "Events",
      description: "Workshops, meetups, and competitions",
      icon: <Calendar className="w-6 h-6 text-purple-600" />,
      href: "/events", 
      color: "purple-600"
    },
    {
      name: "Status",
      description: "System status and uptime monitoring",
      icon: <BarChart3 className="w-6 h-6 text-indigo-600" />,
      href: "/status",
      color: "indigo-600"
    },
    {
      name: "Support",
      description: "Get help and contact our team",
      icon: <HelpCircle className="w-6 h-6 text-orange-600" />,
      href: "/support",
      color: "orange-600"
    }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-8 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Launch Apps</h2>
            <p className="text-gray-600">Access all MakrX ecosystem platforms</p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Core Apps */}
        <div className="p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-yellow-500" />
            Core Platforms
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {coreApps.map((app, index) => (
              <LauncherApp key={index} {...app} />
            ))}
          </div>

          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-500" />
            Resources
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourceApps.map((app, index) => (
              <LauncherApp key={index} {...app} />
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="border-t border-gray-200 p-8 bg-gray-50 rounded-b-3xl">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="flex flex-wrap gap-3">
            <Link
              to="/ecosystem"
              className="bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-makrx-blue hover:shadow-sm transition-all text-sm"
              onClick={onClose}
            >
              View Ecosystem
            </Link>
            <Link
              to="/contact"
              className="bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-makrx-blue hover:shadow-sm transition-all text-sm"
              onClick={onClose}
            >
              Contact Sales
            </Link>
            <Link
              to="/about"
              className="bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-makrx-blue hover:shadow-sm transition-all text-sm"
              onClick={onClose}
            >
              About MakrX
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
