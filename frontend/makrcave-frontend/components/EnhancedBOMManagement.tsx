import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';
import {
  Plus,
  Search,
  Package,
  ShoppingCart,
  ExternalLink,
  Edit,
  Trash,
  AlertTriangle,
  CheckCircle,
  Clock,
  Star,
  MoreHorizontal,
  Download,
  Upload,
  Filter,
  ArrowUpDown,
  Eye,
  Zap,
  Settings,
  Truck,
  DollarSign,
  BarChart3
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from './ui/dropdown-menu';
import { useAuth } from '../contexts/AuthContext';

interface BOMItem {
  id: number;
  project_id: string;
  item_type: 'inventory' | 'makrx_store';
  item_id: string;
  item_name: string;
  part_code?: string;
  quantity: number;
  unit_cost?: number;
  total_cost?: number;
  
  // Enhanced MakrX Store integration
  makrx_product_code?: string;
  makrx_store_url?: string;
  auto_reorder_enabled: boolean;
  auto_reorder_quantity?: number;
  preferred_supplier?: string;
  
  // Usage details
  usage_notes?: string;
  alternatives: BOMAlternative[];
  is_critical: boolean;
  procurement_status: 'needed' | 'ordered' | 'received' | 'reserved';
  availability_status: 'in-stock' | 'low-stock' | 'out-of-stock' | 'unknown';
  stock_level?: number;
  reorder_point?: number;
  
  // Enhanced tracking
  category?: string;
  specifications?: Record<string, any>;
  compatibility_notes?: string;
  
  added_by: string;
  added_at: string;
}

interface BOMAlternative {
  item_id: string;
  item_name: string;
  part_code?: string;
  unit_cost?: number;
  availability_status: string;
  compatibility_notes?: string;
}

interface BOMOrder {
  id: number;
  project_id: string;
  bom_item_id: number;
  makrx_order_id?: string;
  quantity_ordered: number;
  unit_price?: number;
  total_price?: number;
  order_status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  tracking_number?: string;
  estimated_delivery?: string;
  actual_delivery?: string;
  ordered_by: string;
  ordered_at: string;
}

interface EnhancedBOMManagementProps {
  projectId: string;
  canEdit: boolean;
}

const EnhancedBOMManagement: React.FC<EnhancedBOMManagementProps> = ({ projectId, canEdit }) => {
  const { user } = useAuth();
  const [bomItems, setBomItems] = useState<BOMItem[]>([]);
  const [bomOrders, setBomOrders] = useState<BOMOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [showOnlyCritical, setShowOnlyCritical] = useState(false);
  const [sortBy, setSortBy] = useState<'name' | 'cost' | 'status' | 'added_at'>('added_at');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('items');

  // Add new item state
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState({
    item_type: 'inventory' as 'inventory' | 'makrx_store',
    item_name: '',
    part_code: '',
    quantity: 1,
    unit_cost: 0,
    category: '',
    is_critical: false,
    usage_notes: '',
    makrx_product_code: '',
    auto_reorder_enabled: false,
    auto_reorder_quantity: 5
  });

  // Categories for filtering and organization
  const categories = [
    'Electronics', 'Hardware', 'Materials', 'Tools', 'Fasteners',
    'Enclosures', 'Cables', 'Components', 'Consumables', 'Safety'
  ];

  // Mock data for development
  const getMockBOMItems = (): BOMItem[] => [
    {
      id: 1,
      project_id: projectId,
      item_type: 'makrx_store',
      item_id: 'arduino-uno-r3',
      item_name: 'Arduino Uno R3',
      part_code: 'ARD-UNO-R3',
      quantity: 1,
      unit_cost: 25.99,
      total_cost: 25.99,
      makrx_product_code: 'MKX-ARD-UNO-001',
      makrx_store_url: 'https://store.makrx.com/arduino-uno-r3',
      auto_reorder_enabled: true,
      auto_reorder_quantity: 2,
      preferred_supplier: 'MakrX Store',
      usage_notes: 'Main microcontroller for the project',
      alternatives: [],
      is_critical: true,
      procurement_status: 'received',
      availability_status: 'in-stock',
      stock_level: 15,
      reorder_point: 5,
      category: 'Electronics',
      specifications: {
        voltage: '5V',
        pins: 14,
        flash_memory: '32KB'
      },
      compatibility_notes: 'Compatible with Arduino IDE and most shields',
      added_by: 'user-1',
      added_at: '2024-02-01T10:00:00Z'
    },
    {
      id: 2,
      project_id: projectId,
      item_type: 'makrx_store',
      item_id: 'breadboard-half',
      item_name: 'Half-Size Breadboard',
      part_code: 'BB-HALF-001',
      quantity: 2,
      unit_cost: 8.50,
      total_cost: 17.00,
      makrx_product_code: 'MKX-BB-HALF-001',
      makrx_store_url: 'https://store.makrx.com/breadboard-half',
      auto_reorder_enabled: false,
      preferred_supplier: 'MakrX Store',
      usage_notes: 'For prototyping circuits',
      alternatives: [
        {
          item_id: 'breadboard-full',
          item_name: 'Full-Size Breadboard',
          part_code: 'BB-FULL-001',
          unit_cost: 12.99,
          availability_status: 'in-stock',
          compatibility_notes: 'Larger option if more space needed'
        }
      ],
      is_critical: false,
      procurement_status: 'needed',
      availability_status: 'in-stock',
      stock_level: 25,
      reorder_point: 10,
      category: 'Electronics',
      specifications: {
        tie_points: 400,
        dimensions: '8.5cm x 5.5cm'
      },
      added_by: 'user-1',
      added_at: '2024-02-01T10:15:00Z'
    },
    {
      id: 3,
      project_id: projectId,
      item_type: 'inventory',
      item_id: 'resistor-220ohm',
      item_name: '220Ω Resistors (Pack of 10)',
      part_code: 'RES-220-10',
      quantity: 1,
      unit_cost: 2.99,
      total_cost: 2.99,
      auto_reorder_enabled: true,
      auto_reorder_quantity: 3,
      usage_notes: 'Current limiting for LEDs',
      alternatives: [],
      is_critical: false,
      procurement_status: 'received',
      availability_status: 'in-stock',
      stock_level: 150,
      reorder_point: 20,
      category: 'Electronics',
      specifications: {
        resistance: '220Ω',
        tolerance: '5%',
        power: '1/4W'
      },
      added_by: 'user-1',
      added_at: '2024-02-01T10:30:00Z'
    },
    {
      id: 4,
      project_id: projectId,
      item_type: 'makrx_store',
      item_id: 'led-pack-assorted',
      item_name: 'Assorted LED Pack (50pcs)',
      part_code: 'LED-ASSORT-50',
      quantity: 1,
      unit_cost: 12.99,
      total_cost: 12.99,
      makrx_product_code: 'MKX-LED-ASSORT-001',
      makrx_store_url: 'https://store.makrx.com/led-pack-assorted',
      auto_reorder_enabled: false,
      usage_notes: 'Status indicators and general lighting',
      alternatives: [],
      is_critical: false,
      procurement_status: 'ordered',
      availability_status: 'low-stock',
      stock_level: 3,
      reorder_point: 5,
      category: 'Electronics',
      specifications: {
        colors: 'Red, Green, Blue, Yellow, White',
        voltage: '2-3.3V',
        current: '20mA'
      },
      added_by: 'user-1',
      added_at: '2024-02-01T11:00:00Z'
    }
  ];

  const getMockOrders = (): BOMOrder[] => [
    {
      id: 1,
      project_id: projectId,
      bom_item_id: 4,
      makrx_order_id: 'MAKRX-2024-001',
      quantity_ordered: 2,
      unit_price: 12.99,
      total_price: 25.98,
      order_status: 'shipped',
      tracking_number: 'TRK123456789',
      estimated_delivery: '2024-02-15T17:00:00Z',
      ordered_by: 'user-1',
      ordered_at: '2024-02-10T14:30:00Z'
    }
  ];

  const fetchBOMItems = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('auth_token') || 'mock-token';
      
      const response = await fetch(`/api/v1/projects/${projectId}/bom`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn('API error, using mock data');
        setBomItems(getMockBOMItems());
        setBomOrders(getMockOrders());
        return;
      }

      const data = await response.json();
      setBomItems(data);
    } catch (error) {
      console.warn('API fetch failed, using mock data:', error);
      setBomItems(getMockBOMItems());
      setBomOrders(getMockOrders());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBOMItems();
  }, [projectId]);

  const handleAddItem = async () => {
    if (!newItem.item_name.trim()) return;

    try {
      const token = localStorage.getItem('auth_token') || 'mock-token';
      const response = await fetch(`/api/v1/projects/${projectId}/bom`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newItem),
      });

      if (response.ok) {
        fetchBOMItems();
        setShowAddModal(false);
        setNewItem({
          item_type: 'inventory',
          item_name: '',
          part_code: '',
          quantity: 1,
          unit_cost: 0,
          category: '',
          is_critical: false,
          usage_notes: '',
          makrx_product_code: '',
          auto_reorder_enabled: false,
          auto_reorder_quantity: 5
        });
      }
    } catch (error) {
      console.error('Error adding BOM item:', error);
    }
  };

  const handleOrderFromStore = async (bomItem: BOMItem) => {
    if (!bomItem.makrx_product_code) {
      alert('This item is not available in MakrX Store');
      return;
    }

    const quantity = prompt(`How many ${bomItem.item_name} would you like to order?`, '1');
    if (!quantity || isNaN(Number(quantity))) return;

    try {
      const token = localStorage.getItem('auth_token') || 'mock-token';
      const response = await fetch(`/api/v1/enhanced-projects/${projectId}/bom/order`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bom_item_id: bomItem.id,
          quantity_ordered: Number(quantity)
        }),
      });

      if (response.ok) {
        alert('Order created successfully! Check your orders tab for tracking information.');
        fetchBOMItems();
      }
    } catch (error) {
      console.error('Error creating order:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'needed': return 'bg-red-100 text-red-800 border-red-200';
      case 'ordered': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'received': return 'bg-green-100 text-green-800 border-green-200';
      case 'reserved': return 'bg-blue-100 text-blue-800 border-blue-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getAvailabilityColor = (status: string) => {
    switch (status) {
      case 'in-stock': return 'bg-green-100 text-green-800';
      case 'low-stock': return 'bg-yellow-100 text-yellow-800';
      case 'out-of-stock': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredItems = bomItems.filter(item => {
    const matchesSearch = item.item_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.part_code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || item.procurement_status === statusFilter;
    const matchesCritical = !showOnlyCritical || item.is_critical;

    return matchesSearch && matchesCategory && matchesStatus && matchesCritical;
  }).sort((a, b) => {
    let aValue: any, bValue: any;

    switch (sortBy) {
      case 'name':
        aValue = a.item_name.toLowerCase();
        bValue = b.item_name.toLowerCase();
        break;
      case 'cost':
        aValue = a.total_cost || 0;
        bValue = b.total_cost || 0;
        break;
      case 'status':
        aValue = a.procurement_status;
        bValue = b.procurement_status;
        break;
      case 'added_at':
      default:
        aValue = new Date(a.added_at);
        bValue = new Date(b.added_at);
        break;
    }

    if (sortDirection === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });

  const totalCost = filteredItems.reduce((sum, item) => sum + (item.total_cost || 0), 0);
  const criticalItems = filteredItems.filter(item => item.is_critical);
  const outOfStockItems = filteredItems.filter(item => item.availability_status === 'out-of-stock');

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Package className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold text-blue-600">{filteredItems.length}</p>
                <p className="text-sm text-gray-600">Total Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold text-green-600">${totalCost.toFixed(2)}</p>
                <p className="text-sm text-gray-600">Total Cost</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              <div>
                <p className="text-2xl font-bold text-red-600">{criticalItems.length}</p>
                <p className="text-sm text-gray-600">Critical Items</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Truck className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-2xl font-bold text-orange-600">{bomOrders.length}</p>
                <p className="text-sm text-gray-600">Active Orders</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="items">BOM Items</TabsTrigger>
          <TabsTrigger value="orders">Orders</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="items" className="space-y-4">
          {/* Controls */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search items..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="needed">Needed</SelectItem>
                      <SelectItem value="ordered">Ordered</SelectItem>
                      <SelectItem value="received">Received</SelectItem>
                      <SelectItem value="reserved">Reserved</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-[120px]">
                      <SelectValue placeholder="Sort" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="added_at">Date Added</SelectItem>
                      <SelectItem value="name">Name</SelectItem>
                      <SelectItem value="cost">Cost</SelectItem>
                      <SelectItem value="status">Status</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')}
                  >
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>

                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="critical-only"
                      checked={showOnlyCritical}
                      onCheckedChange={(checked) => setShowOnlyCritical(checked as boolean)}
                    />
                    <label htmlFor="critical-only" className="text-sm font-medium">
                      Critical Only
                    </label>
                  </div>

                  {canEdit && (
                    <Button onClick={() => setShowAddModal(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BOM Items List */}
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <Card key={item.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 truncate">
                          {item.item_name}
                        </h3>
                        {item.is_critical && (
                          <Badge className="bg-red-100 text-red-800">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Critical
                          </Badge>
                        )}
                        {item.auto_reorder_enabled && (
                          <Badge className="bg-blue-100 text-blue-800">
                            <Zap className="h-3 w-3 mr-1" />
                            Auto-Reorder
                          </Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div>
                          <p className="text-sm text-gray-600">Part Code: {item.part_code || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Category: {item.category || 'Uncategorized'}</p>
                          <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Unit Cost: ${item.unit_cost?.toFixed(2) || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Total Cost: ${item.total_cost?.toFixed(2) || 'N/A'}</p>
                          <p className="text-sm text-gray-600">Stock Level: {item.stock_level || 'Unknown'}</p>
                        </div>
                        <div>
                          <Badge className={getStatusColor(item.procurement_status)}>
                            {item.procurement_status}
                          </Badge>
                          <Badge className={`${getAvailabilityColor(item.availability_status)} ml-2`}>
                            {item.availability_status}
                          </Badge>
                        </div>
                      </div>

                      {item.usage_notes && (
                        <p className="text-sm text-gray-700 mb-2">
                          <strong>Usage:</strong> {item.usage_notes}
                        </p>
                      )}

                      {item.specifications && Object.keys(item.specifications).length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700">Specifications:</p>
                          <div className="flex flex-wrap gap-1">
                            {Object.entries(item.specifications).map(([key, value]) => (
                              <Badge key={key} variant="outline" className="text-xs">
                                {key}: {String(value)}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {item.alternatives.length > 0 && (
                        <div className="mb-2">
                          <p className="text-sm font-medium text-gray-700">Alternatives:</p>
                          <div className="space-y-1">
                            {item.alternatives.map((alt, index) => (
                              <div key={index} className="text-xs text-gray-600 bg-gray-50 p-2 rounded">
                                {alt.item_name} ({alt.part_code}) - ${alt.unit_cost?.toFixed(2)}
                                {alt.compatibility_notes && <span className="ml-2 italic">{alt.compatibility_notes}</span>}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center space-x-2 ml-4">
                      {item.makrx_store_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => window.open(item.makrx_store_url, '_blank')}
                        >
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      )}

                      {item.makrx_product_code && canEdit && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleOrderFromStore(item)}
                        >
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                      )}

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </DropdownMenuItem>
                          {canEdit && (
                            <>
                              <DropdownMenuItem>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Item
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="text-red-600">
                                <Trash className="h-4 w-4 mr-2" />
                                Remove Item
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Order History</CardTitle>
            </CardHeader>
            <CardContent>
              {bomOrders.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No orders found</p>
              ) : (
                <div className="space-y-4">
                  {bomOrders.map((order) => (
                    <div key={order.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium">Order #{order.makrx_order_id}</p>
                          <p className="text-sm text-gray-600">
                            {order.quantity_ordered}x items - ${order.total_price?.toFixed(2)}
                          </p>
                          <Badge className={getStatusColor(order.order_status)}>
                            {order.order_status}
                          </Badge>
                          {order.tracking_number && (
                            <p className="text-sm text-gray-600 mt-1">
                              Tracking: {order.tracking_number}
                            </p>
                          )}
                        </div>
                        <div className="text-right text-sm text-gray-600">
                          <p>Ordered: {new Date(order.ordered_at).toLocaleDateString()}</p>
                          {order.estimated_delivery && (
                            <p>Est. Delivery: {new Date(order.estimated_delivery).toLocaleDateString()}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Cost Breakdown by Category
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categories.map(category => {
                    const categoryItems = bomItems.filter(item => item.category === category);
                    const categoryCost = categoryItems.reduce((sum, item) => sum + (item.total_cost || 0), 0);
                    const percentage = totalCost > 0 ? (categoryCost / totalCost) * 100 : 0;
                    
                    if (categoryItems.length === 0) return null;
                    
                    return (
                      <div key={category}>
                        <div className="flex justify-between text-sm">
                          <span>{category} ({categoryItems.length} items)</span>
                          <span>${categoryCost.toFixed(2)} ({percentage.toFixed(1)}%)</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full" 
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Procurement Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['needed', 'ordered', 'received', 'reserved'].map(status => {
                    const statusItems = bomItems.filter(item => item.procurement_status === status);
                    const statusCost = statusItems.reduce((sum, item) => sum + (item.total_cost || 0), 0);
                    
                    return (
                      <div key={status} className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(status)}>
                            {status}
                          </Badge>
                          <span className="text-sm">{statusItems.length} items</span>
                        </div>
                        <span className="text-sm font-medium">${statusCost.toFixed(2)}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Add Item Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Add BOM Item</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Item Type</label>
                <Select value={newItem.item_type} onValueChange={(value: any) => setNewItem({...newItem, item_type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inventory">Inventory Item</SelectItem>
                    <SelectItem value="makrx_store">MakrX Store Item</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Item Name</label>
                <Input
                  value={newItem.item_name}
                  onChange={(e) => setNewItem({...newItem, item_name: e.target.value})}
                  placeholder="Enter item name"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Part Code</label>
                  <Input
                    value={newItem.part_code}
                    onChange={(e) => setNewItem({...newItem, part_code: e.target.value})}
                    placeholder="Part code"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Quantity</label>
                  <Input
                    type="number"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({...newItem, quantity: Number(e.target.value)})}
                    min="1"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-sm font-medium mb-1">Unit Cost</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={newItem.unit_cost}
                    onChange={(e) => setNewItem({...newItem, unit_cost: Number(e.target.value)})}
                    placeholder="0.00"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Category</label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {newItem.item_type === 'makrx_store' && (
                <div>
                  <label className="block text-sm font-medium mb-1">MakrX Product Code</label>
                  <Input
                    value={newItem.makrx_product_code}
                    onChange={(e) => setNewItem({...newItem, makrx_product_code: e.target.value})}
                    placeholder="MKX-PROD-001"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-1">Usage Notes</label>
                <Textarea
                  value={newItem.usage_notes}
                  onChange={(e) => setNewItem({...newItem, usage_notes: e.target.value})}
                  placeholder="How this item will be used"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="is-critical"
                  checked={newItem.is_critical}
                  onCheckedChange={(checked) => setNewItem({...newItem, is_critical: checked as boolean})}
                />
                <label htmlFor="is-critical" className="text-sm font-medium">
                  Critical item
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="auto-reorder"
                  checked={newItem.auto_reorder_enabled}
                  onCheckedChange={(checked) => setNewItem({...newItem, auto_reorder_enabled: checked as boolean})}
                />
                <label htmlFor="auto-reorder" className="text-sm font-medium">
                  Enable auto-reorder
                </label>
              </div>

              {newItem.auto_reorder_enabled && (
                <div>
                  <label className="block text-sm font-medium mb-1">Auto-reorder Quantity</label>
                  <Input
                    type="number"
                    value={newItem.auto_reorder_quantity}
                    onChange={(e) => setNewItem({...newItem, auto_reorder_quantity: Number(e.target.value)})}
                    min="1"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-2 mt-6">
              <Button variant="outline" onClick={() => setShowAddModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddItem}>
                Add Item
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedBOMManagement;
