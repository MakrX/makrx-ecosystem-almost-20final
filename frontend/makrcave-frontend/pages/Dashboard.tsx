import { useAuth } from '../contexts/AuthContext';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { 
  Users, 
  FolderOpen, 
  TrendingUp, 
  AlertTriangle, 
  Calendar, 
  CheckCircle, 
  Wrench,
  Package,
  Activity,
  BarChart3
} from 'lucide-react';

export default function Dashboard() {
  const { user } = useAuth();
  const { stats, equipment, inventory, projects, reservations } = useMakerspace();

  const lowStockItems = inventory.filter(item => item.quantity <= item.lowStockThreshold);
  const availableEquipment = equipment.filter(eq => eq.status === 'available');
  const todayReservations = reservations.filter(res => 
    new Date(res.startTime).toDateString() === new Date().toDateString()
  );
  const recentProjects = projects.slice(0, 3);

  const StatCard = ({ 
    title, 
    value, 
    icon: Icon, 
    trend, 
    color = 'blue' 
  }: { 
    title: string; 
    value: string | number; 
    icon: any; 
    trend?: string; 
    color?: 'blue' | 'yellow' | 'green' | 'red' 
  }) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      yellow: 'bg-makrx-yellow',
      green: 'bg-green-500',
      red: 'bg-red-500'
    };

    return (
      <div className="makrcave-card">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold">{value}</p>
            {trend && (
              <p className="text-xs text-muted-foreground mt-1">{trend}</p>
            )}
          </div>
          <div className={`w-12 h-12 ${colorClasses[color]} rounded-lg flex items-center justify-center`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-3xl font-bold">
          Welcome back, {user?.firstName || user?.username}!
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening in your makerspace today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Members"
          value={stats.totalMembers}
          icon={Users}
          trend="+3 this month"
          color="blue"
        />
        <StatCard
          title="Active Projects"
          value={stats.activeProjects}
          icon={FolderOpen}
          trend="2 completed this week"
          color="yellow"
        />
        <StatCard
          title="Equipment Usage"
          value={`${stats.equipmentUtilization}%`}
          icon={TrendingUp}
          trend="↑ 12% from last month"
          color="green"
        />
        <StatCard
          title="Low Stock Items"
          value={stats.lowStockItems}
          icon={AlertTriangle}
          trend="Need restock"
          color="red"
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Today's Schedule */}
        <div className="makrcave-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Today's Schedule
            </h3>
            <span className="text-sm text-muted-foreground">
              {todayReservations.length} reservations
            </span>
          </div>
          <div className="space-y-3">
            {todayReservations.length > 0 ? (
              todayReservations.map((reservation) => (
                <div key={reservation.id} className="flex items-center gap-3 p-3 bg-accent/50 rounded-lg">
                  <div className="w-2 h-2 bg-makrx-yellow rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">{reservation.equipmentName}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(reservation.startTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - 
                      {new Date(reservation.endTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                    <p className="text-xs text-muted-foreground">{reservation.userName}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    reservation.status === 'approved' ? 'bg-green-100 text-green-800' :
                    reservation.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {reservation.status}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No reservations today</p>
              </div>
            )}
          </div>
        </div>

        {/* Equipment Status */}
        <div className="makrcave-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Wrench className="w-5 h-5" />
              Equipment Status
            </h3>
            <span className="text-sm text-muted-foreground">
              {availableEquipment.length}/{equipment.length} available
            </span>
          </div>
          <div className="space-y-3">
            {equipment.slice(0, 4).map((item) => (
              <div key={item.id} className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
                <span className={`makrcave-status-${item.status}`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Inventory Alerts */}
        <div className="makrcave-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <Package className="w-5 h-5" />
              Inventory Alerts
            </h3>
            <span className="text-sm text-muted-foreground">
              {lowStockItems.length} items low
            </span>
          </div>
          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{item.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {item.quantity} {item.unit} remaining
                    </p>
                  </div>
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                <CheckCircle className="w-8 h-8 mx-auto mb-2 text-green-500" />
                <p className="text-sm">All items well-stocked</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <div className="makrcave-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FolderOpen className="w-5 h-5" />
              Recent Projects
            </h3>
            <button className="text-sm text-makrx-blue hover:underline">View all</button>
          </div>
          <div className="space-y-3">
            {recentProjects.map((project) => (
              <div key={project.id} className="flex items-center gap-3 p-3 hover:bg-accent/50 rounded-lg transition-colors">
                <div className={`w-3 h-3 rounded-full ${
                  project.status === 'active' ? 'bg-green-500' :
                  project.status === 'completed' ? 'bg-blue-500' :
                  'bg-gray-400'
                }`}></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">{project.name}</p>
                  <p className="text-xs text-muted-foreground">
                    by {project.ownerName} • {new Date(project.updatedAt).toLocaleDateString()}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {project.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="makrcave-card">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="w-5 h-5" />
            Quick Actions
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <button className="makrcave-btn-primary text-sm py-3">
              Reserve Equipment
            </button>
            <button className="makrcave-btn-secondary text-sm py-3">
              New Project
            </button>
            <button className="makrcave-btn-primary text-sm py-3">
              Add Inventory
            </button>
            <button className="makrcave-btn-secondary text-sm py-3">
              View Reports
            </button>
          </div>
          
          {/* Usage Chart */}
          <div className="mt-6 pt-6 border-t border-border">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-medium">This Week's Activity</h4>
              <BarChart3 className="w-4 h-4 text-muted-foreground" />
            </div>
            <div className="flex items-end gap-2 h-16">
              {[40, 65, 45, 80, 70, 55, 60].map((height, index) => (
                <div key={index} className="flex-1 bg-makrx-blue/20 rounded-t" style={{ height: `${height}%` }}>
                  <div className="w-full bg-makrx-blue rounded-t" style={{ height: '20%' }}></div>
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
              <span>Sun</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
