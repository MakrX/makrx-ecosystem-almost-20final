import { Bell, Search, Menu, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="makrcave-header">
      <div className="flex items-center gap-4 flex-1">
        {/* Mobile menu button */}
        <button className="lg:hidden p-2 hover:bg-accent rounded-lg">
          <Menu className="w-5 h-5" />
        </button>

        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search inventory, equipment, projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-makrx-blue focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        {/* Quick Actions */}
        <div className="hidden md:flex items-center gap-2">
          <button className="makrcave-btn-secondary text-xs">
            Quick Reserve
          </button>
          <a
            href="https://e986654b5a5843d7b3f8adf13b61022c-556d114307be4dee892ae999b.projects.builder.codes"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-3 py-1 text-xs text-muted-foreground hover:text-foreground border border-border rounded hover:bg-accent transition-colors"
          >
            MakrX Gateway
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>

        {/* Notifications */}
        <button className="relative p-2 hover:bg-accent rounded-lg">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* Current Date/Time */}
        <div className="hidden md:block text-sm text-muted-foreground">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
          })}
        </div>
      </div>
    </header>
  );
}
