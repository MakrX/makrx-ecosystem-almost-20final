import React, { useState, useEffect, useRef } from 'react';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { 
  MapPin, 
  Zap, 
  Users, 
  Settings, 
  Play, 
  Pause, 
  Volume2, 
  Search, 
  Filter,
  Globe,
  Layers,
  Star,
  Trophy,
  Navigation,
  Eye,
  Wifi,
  Wrench,
  Calendar,
  Clock,
  Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

// Mock data for MakrCaves and activities
const makrCaves = [
  {
    id: 1,
    name: "San Francisco MakrLab",
    location: { lat: 37.7749, lng: -122.4194 },
    country: "USA",
    activeProjects: 12,
    onlineMembers: 23,
    machinesRunning: 8,
    status: "active",
    specialization: ["3D Printing", "Electronics", "Woodworking"],
    currentProject: "Robotic Arm Assembly",
    featured: true
  },
  {
    id: 2,
    name: "Berlin MakerSpace",
    location: { lat: 52.5200, lng: 13.4050 },
    country: "Germany",
    activeProjects: 18,
    onlineMembers: 31,
    machinesRunning: 12,
    status: "active",
    specialization: ["Metalworking", "CNC", "Laser Cutting"],
    currentProject: "Precision Engine Parts",
    featured: false
  },
  {
    id: 3,
    name: "Tokyo TechForge",
    location: { lat: 35.6762, lng: 139.6503 },
    country: "Japan",
    activeProjects: 25,
    onlineMembers: 45,
    machinesRunning: 15,
    status: "active",
    specialization: ["Robotics", "AI", "Biotech"],
    currentProject: "Neural Interface Prototype",
    featured: true
  },
  {
    id: 4,
    name: "Mumbai Innovation Hub",
    location: { lat: 19.0760, lng: 72.8777 },
    country: "India",
    activeProjects: 22,
    onlineMembers: 67,
    machinesRunning: 18,
    status: "active",
    specialization: ["IoT", "Textiles", "Sustainability"],
    currentProject: "Smart Farming Sensors",
    featured: false
  },
  {
    id: 5,
    name: "São Paulo MakrCentral",
    location: { lat: -23.5558, lng: -46.6396 },
    country: "Brazil",
    activeProjects: 14,
    onlineMembers: 29,
    machinesRunning: 9,
    status: "active",
    specialization: ["Automotive", "Design", "Art"],
    currentProject: "Electric Vehicle Components",
    featured: false
  },
  {
    id: 6,
    name: "London Innovation Labs",
    location: { lat: 51.5074, lng: -0.1278 },
    country: "UK",
    activeProjects: 20,
    onlineMembers: 38,
    machinesRunning: 14,
    status: "active",
    specialization: ["Fintech", "Healthcare", "Aerospace"],
    currentProject: "Medical Device Testing",
    featured: true
  }
];

const liveActivities = [
  { id: 1, cave: "Tokyo TechForge", activity: "Neural interface calibration started", time: "2 min ago", type: "project" },
  { id: 2, cave: "Berlin MakerSpace", activity: "CNC mill activated for precision cuts", time: "5 min ago", type: "machine" },
  { id: 3, cave: "Mumbai Innovation Hub", activity: "New member @agritech_innovator joined", time: "8 min ago", type: "member" },
  { id: 4, cave: "San Francisco MakrLab", activity: "3D printer #3 completed robotic hand", time: "12 min ago", type: "completion" },
  { id: 5, cave: "London Innovation Labs", activity: "Collaborative project with Oxford started", time: "15 min ago", type: "collaboration" }
];

const badges = [
  { id: 1, name: "Global Explorer", description: "Visited 5+ MakrCaves", icon: "🌍", unlocked: true },
  { id: 2, name: "Innovation Pioneer", description: "First to visit new MakrCave", icon: "🚀", unlocked: true },
  { id: 3, name: "Cross-Continental", description: "Visited caves on 3+ continents", icon: "✈️", unlocked: false },
  { id: 4, name: "Tech Voyager", description: "Used 10+ different machine types", icon: "🔧", unlocked: true },
  { id: 5, name: "Community Builder", description: "Connected 50+ makers", icon: "🤝", unlocked: false },
  { id: 6, name: "AR Explorer", description: "Discovered 25+ AR points", icon: "👀", unlocked: false }
];

// Map Component
const MakrVerseMap = ({ selectedCave, onCaveSelect }: { selectedCave: any, onCaveSelect: (cave: any) => void }) => {
  const [mapStyle, setMapStyle] = useState('satellite');
  const [isLive, setIsLive] = useState(true);
  const [connections, setConnections] = useState(true);

  return (
    <div className="relative h-full bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 rounded-lg overflow-hidden">
      {/* Map Controls */}
      <div className="absolute top-4 right-4 z-20 space-y-2">
        <div className="flex flex-col bg-black/80 backdrop-blur-md rounded-lg p-2 space-y-2">
          <Button 
            size="sm" 
            variant={mapStyle === 'satellite' ? 'default' : 'outline'} 
            className="text-xs"
            onClick={() => setMapStyle('satellite')}
          >
            <Globe className="h-3 w-3 mr-1" />
            Satellite
          </Button>
          <Button 
            size="sm" 
            variant={mapStyle === 'network' ? 'default' : 'outline'} 
            className="text-xs"
            onClick={() => setMapStyle('network')}
          >
            <Wifi className="h-3 w-3 mr-1" />
            Network
          </Button>
          <Button 
            size="sm" 
            variant={connections ? 'default' : 'outline'} 
            className="text-xs"
            onClick={() => setConnections(!connections)}
          >
            <Layers className="h-3 w-3 mr-1" />
            Links
          </Button>
        </div>
      </div>

      {/* Live Indicator */}
      <div className="absolute top-4 left-4 z-20">
        <div className="flex items-center bg-black/80 backdrop-blur-md rounded-full px-3 py-2">
          <div className={`w-2 h-2 rounded-full mr-2 ${isLive ? 'bg-red-500 animate-pulse' : 'bg-gray-500'}`}></div>
          <span className="text-white text-xs font-medium">
            {isLive ? 'LIVE' : 'OFFLINE'}
          </span>
          <Button 
            size="sm" 
            variant="ghost" 
            className="ml-2 h-6 w-6 p-0"
            onClick={() => setIsLive(!isLive)}
          >
            {isLive ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
          </Button>
        </div>
      </div>

      {/* Map Background */}
      <div className="absolute inset-0">
        {mapStyle === 'satellite' ? (
          <div className="w-full h-full bg-gradient-to-br from-blue-900 via-green-900 to-brown-900 relative">
            {/* Simulated continents */}
            <div className="absolute top-1/4 left-1/3 w-32 h-24 bg-green-700/30 rounded-full blur-sm"></div>
            <div className="absolute top-1/3 right-1/4 w-28 h-20 bg-green-600/30 rounded-lg blur-sm"></div>
            <div className="absolute bottom-1/3 left-1/4 w-24 h-16 bg-green-700/30 rounded-full blur-sm"></div>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 relative">
            {/* Network visualization */}
            <div className="absolute inset-0 opacity-30">
              <svg className="w-full h-full">
                {connections && makrCaves.map((cave, idx) => (
                  makrCaves.slice(idx + 1).map((otherCave, otherIdx) => (
                    <line
                      key={`${cave.id}-${otherCave.id}`}
                      x1={`${((cave.location.lng + 180) / 360) * 100}%`}
                      y1={`${((90 - cave.location.lat) / 180) * 100}%`}
                      x2={`${((otherCave.location.lng + 180) / 360) * 100}%`}
                      y2={`${((90 - otherCave.location.lat) / 180) * 100}%`}
                      stroke="rgba(59, 130, 246, 0.3)"
                      strokeWidth="1"
                      className="animate-pulse"
                    />
                  ))
                ))
                }
              </svg>
            </div>
          </div>
        )}
      </div>

      {/* MakrCave Markers */}
      {makrCaves.map((cave) => {
        const x = ((cave.location.lng + 180) / 360) * 100;
        const y = ((90 - cave.location.lat) / 180) * 100;
        
        return (
          <div
            key={cave.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group"
            style={{ left: `${x}%`, top: `${y}%` }}
            onClick={() => onCaveSelect(cave)}
          >
            {/* Cave Marker */}
            <div className={`relative transition-all duration-300 ${selectedCave?.id === cave.id ? 'scale-125' : 'group-hover:scale-110'}`}>
              <div className={`w-6 h-6 rounded-full border-2 ${
                cave.featured 
                  ? 'bg-yellow-400 border-yellow-300 shadow-lg shadow-yellow-400/50' 
                  : cave.status === 'active' 
                    ? 'bg-green-400 border-green-300 shadow-lg shadow-green-400/50' 
                    : 'bg-gray-400 border-gray-300'
              } relative`}>
                {cave.status === 'active' && (
                  <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-20"></div>
                )}
                {cave.featured && (
                  <Star className="h-3 w-3 text-yellow-900 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" />
                )}
              </div>
              
              {/* Activity Rings */}
              {isLive && cave.status === 'active' && (
                <>
                  <div className="absolute inset-0 rounded-full border border-green-400 animate-ping opacity-40"></div>
                  <div className="absolute inset-0 rounded-full border border-blue-400 animate-ping opacity-30 animation-delay-500"></div>
                </>
              )}
              
              {/* Quick Info Tooltip */}
              <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                <div className="bg-black/90 backdrop-blur-md text-white text-xs rounded-lg px-3 py-2 whitespace-nowrap">
                  <div className="font-semibold">{cave.name}</div>
                  <div className="text-gray-300">{cave.onlineMembers} makers online</div>
                  <div className="text-green-400">{cave.machinesRunning} machines running</div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* AR Exploration Points */}
      <div className="absolute top-1/2 left-1/4 w-3 h-3 bg-purple-400 rounded-full animate-pulse cursor-pointer" title="AR Point: Historic Workshop"></div>
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-purple-400 rounded-full animate-pulse cursor-pointer" title="AR Point: Innovation Timeline"></div>
      <div className="absolute bottom-1/4 left-1/2 w-3 h-3 bg-purple-400 rounded-full animate-pulse cursor-pointer" title="AR Point: Future Vision"></div>
    </div>
  );
};

const MakrVerse = () => {
  const [selectedCave, setSelectedCave] = useState(makrCaves[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showBadges, setShowBadges] = useState(false);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);
  const [currentActivity, setCurrentActivity] = useState(0);

  // Simulate real-time updates
  useEffect(() => {
    if (!realTimeUpdates) return;
    
    const interval = setInterval(() => {
      setCurrentActivity((prev) => (prev + 1) % liveActivities.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  const filteredCaves = makrCaves.filter(cave => 
    cave.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cave.country.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cave.specialization.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-md border-b border-white/10 sticky top-0 z-30">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link to="/" className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="text-xl font-bold text-white">MakrVerse</span>
              </Link>
              <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                Live Map
              </Badge>
            </div>

            <div className="flex items-center space-x-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search MakrCaves..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-black/50 border border-white/20 rounded-lg pl-10 pr-4 py-2 text-white placeholder-gray-400 focus:border-blue-400 focus:outline-none"
                />
              </div>

              <Button
                variant="outline"
                size="sm"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
                onClick={() => setShowBadges(!showBadges)}
              >
                <Trophy className="h-4 w-4 mr-2" />
                Badges
              </Button>

              <Link to="/portal">
                <Button className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white">
                  Portal
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-screen pt-0">
        {/* Sidebar */}
        <div className="w-96 bg-black/30 backdrop-blur-md border-r border-white/10 overflow-y-auto">
          <div className="p-6 space-y-6">
            {/* Global Stats */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Globe className="h-5 w-5 mr-2 text-blue-400" />
                  Global MakrVerse
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-400">{makrCaves.length}</div>
                    <div className="text-xs text-gray-400">Active Caves</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-400">{makrCaves.reduce((sum, cave) => sum + cave.onlineMembers, 0)}</div>
                    <div className="text-xs text-gray-400">Makers Online</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-400">{makrCaves.reduce((sum, cave) => sum + cave.activeProjects, 0)}</div>
                    <div className="text-xs text-gray-400">Active Projects</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-yellow-400">{makrCaves.reduce((sum, cave) => sum + cave.machinesRunning, 0)}</div>
                    <div className="text-xs text-gray-400">Machines Running</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Selected Cave Details */}
            {selectedCave && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-white text-lg">{selectedCave.name}</CardTitle>
                    {selectedCave.featured && (
                      <Badge className="bg-yellow-500 text-black">
                        <Star className="h-3 w-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                  </div>
                  <CardDescription className="text-gray-300">{selectedCave.country}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Online Members</span>
                      <span className="text-green-400">{selectedCave.onlineMembers}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Active Projects</span>
                      <span className="text-blue-400">{selectedCave.activeProjects}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Machines Running</span>
                      <span className="text-yellow-400">{selectedCave.machinesRunning}</span>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Current Project</div>
                    <div className="text-white font-medium">{selectedCave.currentProject}</div>
                  </div>

                  <div>
                    <div className="text-sm text-gray-400 mb-2">Specializations</div>
                    <div className="flex flex-wrap gap-1">
                      {selectedCave.specialization.map((spec, idx) => (
                        <Badge key={idx} variant="outline" className="text-xs border-white/30 text-white">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white flex-1">
                      <Eye className="h-4 w-4 mr-1" />
                      Visit
                    </Button>
                    <Button size="sm" variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      <Navigation className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Live Activity Feed */}
            <Card className="bg-white/10 backdrop-blur-md border-white/20">
              <CardHeader className="pb-3">
                <CardTitle className="text-white text-lg flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-green-400" />
                  Live Activity
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-auto h-6 w-6 p-0"
                    onClick={() => setRealTimeUpdates(!realTimeUpdates)}
                  >
                    {realTimeUpdates ? (
                      <Pause className="h-3 w-3 text-green-400" />
                    ) : (
                      <Play className="h-3 w-3 text-gray-400" />
                    )}
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {liveActivities.slice(0, 5).map((activity, idx) => (
                  <div 
                    key={activity.id} 
                    className={`p-3 rounded-lg border transition-all duration-300 ${
                      idx === currentActivity && realTimeUpdates
                        ? 'bg-blue-500/20 border-blue-400/50 shadow-lg' 
                        : 'bg-black/30 border-white/10'
                    }`}
                  >
                    <div className="text-sm text-white">{activity.activity}</div>
                    <div className="flex items-center justify-between mt-1">
                      <div className="text-xs text-gray-400">{activity.cave}</div>
                      <div className="text-xs text-gray-500">{activity.time}</div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Travel Badges */}
            {showBadges && (
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader className="pb-3">
                  <CardTitle className="text-white text-lg flex items-center">
                    <Trophy className="h-5 w-5 mr-2 text-yellow-400" />
                    Travel Badges
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {badges.map((badge) => (
                    <div 
                      key={badge.id} 
                      className={`p-3 rounded-lg border ${
                        badge.unlocked 
                          ? 'bg-yellow-500/20 border-yellow-400/50' 
                          : 'bg-gray-500/20 border-gray-400/30'
                      }`}
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{badge.icon}</span>
                        <div>
                          <div className={`font-medium ${badge.unlocked ? 'text-yellow-400' : 'text-gray-400'}`}>
                            {badge.name}
                          </div>
                          <div className="text-xs text-gray-500">{badge.description}</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Main Map Area */}
        <div className="flex-1 relative">
          <MakrVerseMap selectedCave={selectedCave} onCaveSelect={setSelectedCave} />

          {/* Map Legend */}
          <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-md rounded-lg p-4 text-white">
            <div className="text-sm font-semibold mb-2">Legend</div>
            <div className="space-y-1 text-xs">
              <div className="flex items-center">
                <div className="w-3 h-3 bg-yellow-400 rounded-full mr-2"></div>
                <span>Featured MakrCave</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
                <span>Active MakrCave</span>
              </div>
              <div className="flex items-center">
                <div className="w-3 h-3 bg-purple-400 rounded-full mr-2"></div>
                <span>AR Exploration Point</span>
              </div>
            </div>
          </div>

          {/* Real-time Stats Overlay */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-md rounded-lg px-4 py-2">
            <div className="flex items-center space-x-6 text-white text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
                <span>{makrCaves.filter(c => c.status === 'active').length} Caves Online</span>
              </div>
              <div className="flex items-center">
                <Users className="h-4 w-4 mr-1 text-blue-400" />
                <span>{makrCaves.reduce((sum, cave) => sum + cave.onlineMembers, 0)} Makers</span>
              </div>
              <div className="flex items-center">
                <Wrench className="h-4 w-4 mr-1 text-yellow-400" />
                <span>{makrCaves.reduce((sum, cave) => sum + cave.machinesRunning, 0)} Machines</span>
              </div>
            </div>
          </div>

          {/* Quick Jump Panel */}
          <div className="absolute bottom-4 right-4 bg-black/80 backdrop-blur-md rounded-lg p-3 max-w-xs">
            <div className="text-white text-sm font-semibold mb-2">Quick Jump</div>
            <div className="space-y-1">
              {makrCaves.filter(cave => cave.featured).map((cave) => (
                <button
                  key={cave.id}
                  onClick={() => setSelectedCave(cave)}
                  className={`w-full text-left px-2 py-1 rounded text-xs transition-colors ${
                    selectedCave?.id === cave.id
                      ? 'bg-yellow-500/30 text-yellow-300'
                      : 'text-gray-300 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate">{cave.name}</span>
                    <div className="flex items-center ml-2">
                      <Star className="h-3 w-3 text-yellow-400" />
                      <span className="text-green-400 ml-1">{cave.onlineMembers}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MakrVerse;
