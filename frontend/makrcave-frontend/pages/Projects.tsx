import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { 
  Plus,
  Search,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Users,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Star,
  MoreHorizontal,
  Download
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../components/ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';
import AddProjectModal from '../components/AddProjectModal';
import ProjectCard from '../components/ProjectCard';
import AnalyticsWidget from '../components/AnalyticsWidget';

interface Project {
  project_id: string;
  name: string;
  description?: string;
  owner_id: string;
  visibility: 'public' | 'private' | 'team-only';
  status: 'draft' | 'in-progress' | 'complete' | 'on-hold' | 'cancelled';
  start_date?: string;
  end_date?: string;
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
  collaborator_count: number;
  bom_items_count: number;
  files_count: number;
  milestones_count: number;
  completed_milestones_count: number;
}

interface ProjectFilter {
  status?: string[];
  visibility?: string[];
  search?: string;
  tags?: string[];
  is_featured?: boolean;
}

const Projects: React.FC = () => {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'updated_at' | 'created_at' | 'name'>('updated_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch projects from API
  const fetchProjects = async () => {
    try {
      setLoading(true);
      setError(null);

      const token = localStorage.getItem('auth_token') || 'mock-token';
      const params = new URLSearchParams({
        skip: '0',
        limit: '100',
        sort_field: sortBy,
        sort_direction: sortDirection
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }
      if (statusFilter !== 'all') {
        params.append('status_filter', statusFilter);
      }
      if (visibilityFilter !== 'all') {
        params.append('visibility_filter', visibilityFilter);
      }

      const response = await fetch(`/api/v1/projects?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setProjects(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch projects');
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [searchTerm, statusFilter, visibilityFilter, sortBy, sortDirection]);

  const handleCreateProject = () => {
    setShowAddModal(false);
    fetchProjects(); // Refresh projects list
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'complete': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getVisibilityIcon = (visibility: string) => {
    switch (visibility) {
      case 'public': return '🌐';
      case 'private': return '🔒';
      case 'team-only': return '👥';
      default: return '❓';
    }
  };

  const getProgressPercentage = (project: Project) => {
    if (project.milestones_count === 0) return 0;
    return Math.round((project.completed_milestones_count / project.milestones_count) * 100);
  };

  const exportToCSV = () => {
    const csvHeaders = [
      'Project ID', 'Name', 'Description', 'Owner ID', 'Status', 'Visibility',
      'Start Date', 'End Date', 'Tags', 'Featured', 'Collaborators', 'BOM Items',
      'Files Count', 'Milestones', 'Completed Milestones', 'Progress %', 'Created At'
    ];

    const csvData = filteredProjects.map(project => [
      project.project_id,
      project.name,
      project.description || '',
      project.owner_id,
      project.status,
      project.visibility,
      project.start_date || '',
      project.end_date || '',
      project.tags.join('; '),
      project.is_featured ? 'Yes' : 'No',
      project.collaborator_count,
      project.bom_items_count,
      project.files_count,
      project.milestones_count,
      project.completed_milestones_count,
      `${getProgressPercentage(project)}%`,
      project.created_at
    ]);

    const csvContent = [
      csvHeaders.join(','),
      ...csvData.map(row => row.map(field =>
        typeof field === 'string' && field.includes(',') ? `"${field}"` : field
      ).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `projects_export_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Projects</h1>
          <p className="text-gray-600 mt-1">
            Manage your collaborative and personal projects
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={exportToCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
          <Button onClick={() => setShowAddModal(true)} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </div>
      </div>

      {/* Quick Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Package className="h-5 w-5" />
              Project Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
                <p className="text-sm text-gray-600">Total Projects</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {projects.filter(p => p.status === 'in-progress').length}
                </p>
                <p className="text-sm text-gray-600">Active</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-purple-600">
                  {projects.filter(p => p.status === 'complete').length}
                </p>
                <p className="text-sm text-gray-600">Completed</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaboration Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-orange-600">
                  {Math.round(projects.reduce((sum, p) => sum + p.collaborator_count, 0) / projects.length) || 0}
                </p>
                <p className="text-sm text-gray-600">Avg Collaborators</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-teal-600">
                  {Math.round(projects.reduce((sum, p) => sum + p.bom_items_count, 0) / projects.length) || 0}
                </p>
                <p className="text-sm text-gray-600">Avg BOM Items</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {projects.filter(p => p.visibility === 'public').length}
                </p>
                <p className="text-sm text-gray-600">Public Projects</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-wrap gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="complete">Complete</SelectItem>
                  <SelectItem value="on-hold">On Hold</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>

              <Select value={visibilityFilter} onValueChange={setVisibilityFilter}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Visibility" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Visibility</SelectItem>
                  <SelectItem value="public">Public</SelectItem>
                  <SelectItem value="private">Private</SelectItem>
                  <SelectItem value="team-only">Team Only</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Sort By" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="updated_at">Last Updated</SelectItem>
                  <SelectItem value="created_at">Created Date</SelectItem>
                  <SelectItem value="name">Name</SelectItem>
                </SelectContent>
              </Select>

              <Button
                variant="outline"
                size="sm"
                onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                {sortDirection === 'asc' ? '↑' : '↓'}
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error State */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span>Error loading projects: {error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Projects Grid/List */}
      {projects.length === 0 && !loading && !error ? (
        <Card>
          <CardContent className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="mb-4">
                <Package className="h-12 w-12 text-gray-400 mx-auto" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
              <p className="text-gray-600 mb-4">
                Get started by creating your first project to collaborate with your team.
              </p>
              <Button onClick={() => setShowAddModal(true)}>
                Create Your First Project
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className={
          viewMode === 'grid' 
            ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            : "space-y-4"
        }>
          {projects.map((project) => (
            <ProjectCard
              key={project.project_id}
              project={project}
              viewMode={viewMode}
              onUpdate={fetchProjects}
            />
          ))}
        </div>
      )}

      {/* Add Project Modal */}
      <AddProjectModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProjectCreated={handleCreateProject}
      />
    </div>
  );
};

export default Projects;
