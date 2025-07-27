import { useAuth } from '../contexts/AuthContext';
import SuperAdminSidebar from './SuperAdminSidebar';
import ManagerSidebar from './ManagerSidebar';
import MakerSidebar from './MakerSidebar';

export default function Sidebar() {
  const { user, isSuperAdmin, isMakrcaveManager, isMaker } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);

  const navigation = [
    {
      name: 'Dashboard',
      href: '/portal/dashboard',
      icon: LayoutDashboard,
      active: isActive('/portal/dashboard')
    },
    {
      name: 'Inventory',
      href: '/portal/inventory',
      icon: Package,
      active: isActive('/portal/inventory')
    },
    {
      name: 'Equipment',
      href: '/portal/equipment',
      icon: Wrench,
      active: isActive('/portal/equipment')
    },
    {
      name: 'Projects',
      href: '/portal/projects',
      icon: FolderOpen,
      active: isActive('/portal/projects')
    },
    {
      name: 'Reservations',
      href: '/portal/reservations',
      icon: Calendar,
      active: isActive('/portal/reservations')
    }
  ];

  const adminNavigation = [
    {
      name: 'Manage Users',
      href: '/portal/admin/users',
      icon: Users,
      active: isActive('/portal/admin/users')
    },
    {
      name: 'Makerspace Settings',
      href: '/portal/admin/makerspace',
      icon: Settings,
      active: isActive('/portal/admin/makerspace')
    }
  ];

  return (
    <div className="makrcave-sidebar">
      {/* Logo & Title */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-makrx-blue rounded-lg flex items-center justify-center">
            <Building2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="font-bold text-lg">MakrCave</h2>
            <p className="text-xs text-muted-foreground">Makerspace Portal</p>
          </div>
        </div>
      </div>

      {/* User Info */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-makrx-yellow rounded-full flex items-center justify-center">
            <span className="text-sm font-semibold text-makrx-blue">
              {user?.firstName?.[0] || user?.username?.[0] || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">
              {user?.firstName ? `${user.firstName} ${user.lastName}` : user?.username}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              {user?.roles.includes('makerspace_admin') ? 'Admin' : 'Maker'}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <div className="space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                to={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  item.active
                    ? 'bg-makrx-blue text-white'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Icon className="w-4 h-4" />
                {item.name}
              </Link>
            );
          })}
        </div>

        {/* Admin Section */}
        {isMakerspaceAdmin && (
          <div className="mt-8">
            <h3 className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Administration
            </h3>
            <div className="space-y-1">
              {adminNavigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      item.active
                        ? 'bg-makrx-brown text-white'
                        : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Logout */}
      <div className="p-4 border-t border-border">
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-3 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Sign Out
        </button>
      </div>
    </div>
  );
}
