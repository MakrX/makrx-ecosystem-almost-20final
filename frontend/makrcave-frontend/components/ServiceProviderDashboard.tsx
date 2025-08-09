'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Package, Clock, DollarSign, CheckCircle, X, Eye, Download, 
  Filter, Search, Calendar, TrendingUp, AlertCircle, Wrench, 
  Box, Printer, CpuIcon as Cpu, Palette, Star, MessageSquare
} from 'lucide-react';

interface Job {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  service_type: '3d_printing' | 'cnc' | 'laser_cutting' | 'custom';
  customer_name: string;
  customer_email: string;
  created_date: string;
  due_date: string;
  price_quoted: number;
  price_final?: number;
  materials: string[];
  specifications: Record<string, any>;
  files: string[];
  rating?: number;
  feedback?: string;
}

interface Inventory {
  id: string;
  material: string;
  type: string;
  quantity: number;
  unit: string;
  cost_per_unit: number;
  supplier: string;
  reorder_level: number;
  last_restocked: string;
}

const mockJobs: Job[] = [
  {
    id: 'job-001',
    title: 'Custom Phone Case - iPhone 15 Pro',
    description: 'High-quality 3D printed phone case with custom logo engraving',
    status: 'pending',
    priority: 'medium',
    service_type: '3d_printing',
    customer_name: 'Sarah Johnson',
    customer_email: 'sarah@example.com',
    created_date: '2024-01-20',
    due_date: '2024-01-25',
    price_quoted: 35.00,
    materials: ['PLA Black', 'PLA Clear'],
    specifications: {
      layer_height: '0.2mm',
      infill: '20%',
      supports: 'Yes'
    },
    files: ['phone_case_v3.stl', 'logo.svg']
  },
  {
    id: 'job-002',
    title: 'Precision Aluminum Bracket',
    description: 'CNC machined mounting bracket for industrial equipment',
    status: 'in_progress',
    priority: 'high',
    service_type: 'cnc',
    customer_name: 'TechCorp Inc.',
    customer_email: 'procurement@techcorp.com',
    created_date: '2024-01-18',
    due_date: '2024-01-22',
    price_quoted: 125.00,
    materials: ['Aluminum 6061'],
    specifications: {
      tolerance: '±0.05mm',
      surface_finish: 'Anodized',
      quantity: 5
    },
    files: ['bracket_drawing.pdf', 'bracket_model.step']
  },
  {
    id: 'job-003',
    title: 'Acrylic Display Sign',
    description: 'Laser cut and engraved acrylic sign for retail display',
    status: 'completed',
    priority: 'low',
    service_type: 'laser_cutting',
    customer_name: 'Local Cafe',
    customer_email: 'orders@localcafe.com',
    created_date: '2024-01-15',
    due_date: '2024-01-20',
    price_quoted: 45.00,
    price_final: 45.00,
    materials: ['Acrylic 3mm Clear'],
    specifications: {
      size: '300x200mm',
      engraving_depth: '0.1mm'
    },
    files: ['sign_design.ai'],
    rating: 5,
    feedback: 'Excellent quality and fast turnaround!'
  }
];

const mockInventory: Inventory[] = [
  {
    id: 'inv-001',
    material: 'PLA Filament',
    type: 'Black',
    quantity: 12,
    unit: 'kg',
    cost_per_unit: 25.00,
    supplier: 'FilamentCorp',
    reorder_level: 5,
    last_restocked: '2024-01-15'
  },
  {
    id: 'inv-002',
    material: 'Aluminum 6061',
    type: 'Sheet 3mm',
    quantity: 8,
    unit: 'sheets',
    cost_per_unit: 45.00,
    supplier: 'MetalSupply Co',
    reorder_level: 3,
    last_restocked: '2024-01-10'
  },
  {
    id: 'inv-003',
    material: 'Acrylic',
    type: 'Clear 3mm',
    quantity: 2,
    unit: 'sheets',
    cost_per_unit: 35.00,
    supplier: 'PlasticWorld',
    reorder_level: 5,
    last_restocked: '2024-01-05'
  }
];

export default function ServiceProviderDashboard() {
  const [jobs, setJobs] = useState<Job[]>(mockJobs);
  const [inventory, setInventory] = useState<Inventory[]>(mockInventory);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobFilter, setJobFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = {
    totalJobs: jobs.length,
    pendingJobs: jobs.filter(j => j.status === 'pending').length,
    completedJobs: jobs.filter(j => j.status === 'completed').length,
    totalRevenue: jobs.filter(j => j.price_final).reduce((sum, j) => sum + (j.price_final || 0), 0),
    averageRating: jobs.filter(j => j.rating).reduce((sum, j, _, arr) => sum + (j.rating || 0) / arr.length, 0),
    lowStockItems: inventory.filter(item => item.quantity <= item.reorder_level).length
  };

  const filteredJobs = jobs.filter(job => {
    const matchesFilter = jobFilter === 'all' || job.status === jobFilter;
    const matchesSearch = searchTerm === '' || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.customer_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const handleAcceptJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'accepted' as const } : job
    ));
  };

  const handleStartJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'in_progress' as const } : job
    ));
  };

  const handleCompleteJob = (jobId: string) => {
    setJobs(prev => prev.map(job => 
      job.id === jobId ? { ...job, status: 'completed' as const } : job
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'accepted': return 'bg-blue-100 text-blue-800';
      case 'in_progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getServiceIcon = (type: string) => {
    switch (type) {
      case '3d_printing': return <Printer className="w-4 h-4" />;
      case 'cnc': return <Cpu className="w-4 h-4" />;
      case 'laser_cutting': return <Palette className="w-4 h-4" />;
      case 'custom': return <Wrench className="w-4 h-4" />;
      default: return <Package className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Service Provider Dashboard</h1>
        <p className="text-gray-600">Manage your jobs, inventory, and customer relationships</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingJobs}</div>
            <p className="text-xs text-muted-foreground">of {stats.totalJobs} total</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedJobs}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.totalRevenue.toFixed(2)}</div>
            <p className="text-xs text-muted-foreground">this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.averageRating.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">customer rating</p>
          </CardContent>
        </Card>
      </div>

      {/* Low Stock Alert */}
      {stats.lowStockItems > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <span className="font-medium text-orange-800">
                {stats.lowStockItems} item(s) are running low on stock
              </span>
              <Button variant="outline" size="sm" className="ml-auto">
                View Inventory
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="jobs" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="jobs">Job Management</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        {/* Jobs Tab */}
        <TabsContent value="jobs" className="space-y-4">
          {/* Filters */}
          <div className="flex gap-4 items-center">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search jobs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <select
              value={jobFilter}
              onChange={(e) => setJobFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md"
            >
              <option value="all">All Jobs</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          {/* Jobs List */}
          <div className="grid gap-4">
            {filteredJobs.map((job) => (
              <Card key={job.id} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {getServiceIcon(job.service_type)}
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge className={getStatusColor(job.status)}>
                          {job.status.replace('_', ' ')}
                        </Badge>
                        <Badge className={getPriorityColor(job.priority)}>
                          {job.priority}
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-2">{job.description}</p>
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>Customer: {job.customer_name}</span>
                        <span>Due: {new Date(job.due_date).toLocaleDateString()}</span>
                        <span>Quote: ${job.price_quoted}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedJob(job)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {job.status === 'pending' && (
                        <Button
                          size="sm"
                          onClick={() => handleAcceptJob(job.id)}
                        >
                          Accept
                        </Button>
                      )}
                      {job.status === 'accepted' && (
                        <Button
                          size="sm"
                          onClick={() => handleStartJob(job.id)}
                        >
                          Start
                        </Button>
                      )}
                      {job.status === 'in_progress' && (
                        <Button
                          size="sm"
                          onClick={() => handleCompleteJob(job.id)}
                        >
                          Complete
                        </Button>
                      )}
                    </div>
                  </div>
                  
                  {job.rating && (
                    <div className="bg-green-50 border border-green-200 rounded p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star
                              key={star}
                              className={`w-4 h-4 ${
                                star <= job.rating! ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium">Customer Feedback</span>
                      </div>
                      <p className="text-sm text-gray-700">{job.feedback}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-4">
          <div className="grid gap-4">
            {inventory.map((item) => (
              <Card key={item.id}>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Box className="w-4 h-4" />
                        <h3 className="font-semibold">{item.material} - {item.type}</h3>
                        {item.quantity <= item.reorder_level && (
                          <Badge className="bg-red-100 text-red-800">Low Stock</Badge>
                        )}
                      </div>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Quantity:</span>
                          <span className="ml-1 font-medium">{item.quantity} {item.unit}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Cost/Unit:</span>
                          <span className="ml-1 font-medium">${item.cost_per_unit}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Supplier:</span>
                          <span className="ml-1 font-medium">{item.supplier}</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Restocked:</span>
                          <span className="ml-1 font-medium">{new Date(item.last_restocked).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm">
                        Update Stock
                      </Button>
                      {item.quantity <= item.reorder_level && (
                        <Button size="sm">
                          Reorder
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Monthly Revenue</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>January 2024</span>
                    <span className="font-medium">${stats.totalRevenue.toFixed(2)}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '75%' }}></div>
                  </div>
                  <p className="text-sm text-gray-500">75% of monthly goal</p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Service Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Printer className="w-4 h-4" />
                      <span>3D Printing</span>
                    </div>
                    <span className="font-medium">45%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Cpu className="w-4 h-4" />
                      <span>CNC Machining</span>
                    </div>
                    <span className="font-medium">30%</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4" />
                      <span>Laser Cutting</span>
                    </div>
                    <span className="font-medium">25%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle>{selectedJob.title}</CardTitle>
                  <CardDescription>Job ID: {selectedJob.id}</CardDescription>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedJob(null)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Customer</label>
                  <p>{selectedJob.customer_name}</p>
                  <p className="text-sm text-gray-500">{selectedJob.customer_email}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <div className="flex gap-2 mt-1">
                    <Badge className={getStatusColor(selectedJob.status)}>
                      {selectedJob.status.replace('_', ' ')}
                    </Badge>
                    <Badge className={getPriorityColor(selectedJob.priority)}>
                      {selectedJob.priority}
                    </Badge>
                  </div>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <p>{selectedJob.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Materials</label>
                  <ul className="list-disc list-inside">
                    {selectedJob.materials.map((material, index) => (
                      <li key={index}>{material}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <label className="text-sm font-medium">Files</label>
                  <ul className="space-y-1">
                    {selectedJob.files.map((file, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        <span className="text-sm">{file}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium">Specifications</label>
                <div className="grid grid-cols-2 gap-2 mt-1">
                  {Object.entries(selectedJob.specifications).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="text-gray-500">{key.replace('_', ' ')}:</span>
                      <span className="ml-1">{String(value)}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
