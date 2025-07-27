import { useState, useMemo } from 'react';
import { 
  Package, Plus, Search, Filter, Download, Upload, ShoppingCart, 
  AlertTriangle, BarChart3, Grid, List, Calendar, Eye, Edit,
  X, Save, FileText, MapPin, Shield, ExternalLink
} from 'lucide-react';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { useAuth } from '../contexts/AuthContext';
import { FeatureGate } from '../components/FeatureGate';
import InventoryCard from '../components/InventoryCard';
import LowStockBanner from '../components/LowStockBanner';
import UsageTimeline from '../components/UsageTimeline';

interface InventoryUsageLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: 'add' | 'issue' | 'restock' | 'adjust' | 'damage' | 'transfer';
  quantityBefore: number;
  quantityAfter: number;
  reason?: string;
  linkedProjectId?: string;
  linkedJobId?: string;
}

interface InventoryItem {
  id: string;
  name: string;
  category: 'filament' | 'resin' | 'tools' | 'electronics' | 'materials' | 'consumables' | 'machines' | 'sensors' | 'components';
  subcategory?: string;
  quantity: number;
  unit: string;
  minThreshold: number;
  location: string;
  status: 'active' | 'in_use' | 'damaged' | 'reserved' | 'discontinued';
  supplierType: 'makrx' | 'external';
  productCode?: string;
  makerspaceId: string;
  history: InventoryUsageLog[];
  imageUrl?: string;
  notes?: string;
  ownerUserId?: string;
  restrictedAccessLevel?: 'basic' | 'certified' | 'admin_only';
  price?: number;
  supplier?: string;
  description?: string;
  isScanned?: boolean;
}

export default function InventoryManagement() {
  const { inventory, addInventoryItem, updateInventoryItem } = useMakerspace();
  const { user, hasPermission } = useAuth();
  
  // State management
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedSupplierType, setSelectedSupplierType] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReorderModal, setShowReorderModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);

  // Role-based permissions
  const canAddEdit = hasPermission('inventory', 'edit') || user?.role === 'super_admin' || user?.role === 'makerspace_admin';
  const canIssue = hasPermission('inventory', 'edit') || user?.role === 'super_admin' || user?.role === 'makerspace_admin' || user?.role === 'service_provider';
  const canDelete = hasPermission('inventory', 'delete') || user?.role === 'super_admin' || user?.role === 'makerspace_admin';
  const canReorder = hasPermission('inventory', 'edit') || user?.role === 'super_admin' || user?.role === 'makerspace_admin';
  const canViewUsage = hasPermission('inventory', 'view') || user?.role === 'super_admin' || user?.role === 'admin' || user?.role === 'makerspace_admin';

  // Filter inventory based on user role and makerspace
  const filteredInventory = useMemo(() => {
    let items = inventory as InventoryItem[];

    // Makerspace filtering
    if (user?.role === 'makerspace_admin' && user.assignedMakerspaces) {
      items = items.filter(item => user.assignedMakerspaces?.includes(item.makerspaceId));
    }

    // Search filtering
    if (searchTerm) {
      items = items.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.productCode?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Category filtering
    if (selectedCategory !== 'all') {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Status filtering
    if (selectedStatus !== 'all') {
      items = items.filter(item => item.status === selectedStatus);
    }

    // Supplier type filtering
    if (selectedSupplierType !== 'all') {
      items = items.filter(item => item.supplierType === selectedSupplierType);
    }

    return items;
  }, [inventory, searchTerm, selectedCategory, selectedStatus, selectedSupplierType, user]);

  // Low stock items
  const lowStockItems = filteredInventory.filter(item => 
    item.quantity <= item.minThreshold && item.status === 'active'
  );

  // Categories for filtering
  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'filament', label: 'Filament' },
    { value: 'resin', label: 'Resin' },
    { value: 'tools', label: 'Tools' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'materials', label: 'Materials' },
    { value: 'machines', label: 'Machines' },
    { value: 'sensors', label: 'Sensors' },
    { value: 'components', label: 'Components' },
    { value: 'consumables', label: 'Consumables' },
  ];

  const handleIssueItem = (id: string, quantity: number, reason: string) => {
    const item = filteredInventory.find(i => i.id === id);
    if (!item) return;

    const newQuantity = Math.max(0, item.quantity - quantity);
    const usageLog: InventoryUsageLog = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: user?.id || '',
      userName: `${user?.firstName} ${user?.lastName}` || 'Unknown User',
      action: 'issue',
      quantityBefore: item.quantity,
      quantityAfter: newQuantity,
      reason
    };

    updateInventoryItem(id, {
      quantity: newQuantity,
      history: [...(item.history || []), usageLog]
    });
  };

  const handleReorderItem = (item: InventoryItem) => {
    setSelectedItem(item);
    setShowReorderModal(true);
  };

  const ItemDetailModal = () => {
    if (!showDetailModal || !selectedItem) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6" />
              <div>
                <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground capitalize">
                    {selectedItem.category}
                  </span>
                  {selectedItem.subcategory && (
                    <>
                      <span className="text-sm text-muted-foreground">•</span>
                      <span className="text-sm text-muted-foreground">{selectedItem.subcategory}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setShowDetailModal(false)}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Item Details */}
              <div className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-3">Item Information</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Current Stock:</span>
                      <span className="font-medium">{selectedItem.quantity} {selectedItem.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Min Threshold:</span>
                      <span>{selectedItem.minThreshold} {selectedItem.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Location:</span>
                      <span>{selectedItem.location}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Status:</span>
                      <span className="capitalize">{selectedItem.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Supplier:</span>
                      <span className="capitalize">{selectedItem.supplierType}</span>
                    </div>
                    {selectedItem.productCode && (
                      <div className="flex justify-between">
                        <span>Product Code:</span>
                        <span className="font-mono text-sm">{selectedItem.productCode}</span>
                      </div>
                    )}
                    {selectedItem.price && (
                      <div className="flex justify-between">
                        <span>Unit Price:</span>
                        <span>${selectedItem.price}</span>
                      </div>
                    )}
                  </div>
                </div>

                {selectedItem.description && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Description</h3>
                    <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                  </div>
                )}

                {selectedItem.notes && (
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-2">Notes</h3>
                    <p className="text-sm text-muted-foreground">{selectedItem.notes}</p>
                  </div>
                )}
              </div>

              {/* Usage Timeline */}
              <div>
                {canViewUsage && selectedItem.history && selectedItem.history.length > 0 ? (
                  <UsageTimeline 
                    logs={selectedItem.history} 
                    itemName={selectedItem.name}
                    unit={selectedItem.unit}
                    maxItems={5}
                  />
                ) : (
                  <div className="bg-muted/50 p-4 rounded-lg text-center">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">No usage history available</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border flex gap-3 justify-end">
            {canIssue && selectedItem.quantity > 0 && (
              <button className="makrcave-btn-secondary">
                Issue Items
              </button>
            )}
            
            {canReorder && selectedItem.supplierType === 'makrx' && selectedItem.productCode && (
              <button 
                onClick={() => handleReorderItem(selectedItem)}
                className="makrcave-btn-primary"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Reorder from MakrX Store
              </button>
            )}
            
            {canAddEdit && (
              <button className="makrcave-btn-secondary">
                <Edit className="w-4 h-4 mr-2" />
                Edit Item
              </button>
            )}

            <button 
              onClick={() => setShowDetailModal(false)}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Package className="w-8 h-8" />
            Inventory Management
          </h1>
          <p className="text-muted-foreground mt-1">
            Track materials, components, and equipment across your makerspace
          </p>
        </div>

        <div className="flex gap-3">
          <FeatureGate featureKey="inventory.makerspace_management" fallback={null}>
            <button className="makrcave-btn-secondary flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Import CSV
            </button>
            <button 
              onClick={() => setShowAddModal(true)}
              className="makrcave-btn-primary flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Item
            </button>
          </FeatureGate>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{filteredInventory.length}</p>
            </div>
            <Package className="w-8 h-8 text-makrx-blue" />
          </div>
        </div>

        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock Alerts</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">MakrX Items</p>
              <p className="text-2xl font-bold text-makrx-teal">
                {filteredInventory.filter(item => item.supplierType === 'makrx').length}
              </p>
            </div>
            <ShoppingCart className="w-8 h-8 text-makrx-teal" />
          </div>
        </div>

        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Items</p>
              <p className="text-2xl font-bold text-green-600">
                {filteredInventory.filter(item => item.status === 'active').length}
              </p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>
      </div>

      {/* Low Stock Banner */}
      {lowStockItems.length > 0 && (
        <LowStockBanner 
          lowStockItems={lowStockItems}
          onReorderItem={handleReorderItem}
          onViewItem={(item) => {
            setSelectedItem(item);
            setShowDetailModal(true);
          }}
        />
      )}

      {/* Filters and Search */}
      <div className="makrcave-card">
        <div className="flex items-center gap-4 mb-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search items, locations, codes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-makrx-teal focus:border-transparent"
            />
          </div>

          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-4 py-2 border border-border rounded-lg transition-colors flex items-center gap-2 ${
              showFilters ? 'bg-makrx-teal text-white' : 'hover:bg-accent'
            }`}
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>

          <div className="flex items-center gap-2 border-l border-border pl-4">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-makrx-teal text-white' : 'hover:bg-accent'}`}
            >
              <Grid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-makrx-teal text-white' : 'hover:bg-accent'}`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <button className="makrcave-btn-secondary">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>

        {/* Advanced Filters */}
        {showFilters && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-border">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
              >
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="in_use">In Use</option>
                <option value="damaged">Damaged</option>
                <option value="reserved">Reserved</option>
                <option value="discontinued">Discontinued</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Supplier Type</label>
              <select
                value={selectedSupplierType}
                onChange={(e) => setSelectedSupplierType(e.target.value)}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
              >
                <option value="all">All Suppliers</option>
                <option value="makrx">MakrX Store</option>
                <option value="external">External</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Inventory Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
        {filteredInventory.map((item) => (
          <InventoryCard
            key={item.id}
            item={item}
            onEdit={canAddEdit ? () => {
              setSelectedItem(item);
              setShowAddModal(true);
            } : undefined}
            onDelete={canDelete ? (id) => console.log('Delete item:', id) : undefined}
            onIssue={canIssue ? handleIssueItem : undefined}
            onReorder={canReorder ? handleReorderItem : undefined}
            onViewDetails={(item) => {
              setSelectedItem(item);
              setShowDetailModal(true);
            }}
            userRole={user?.role || 'maker'}
            canEdit={canAddEdit}
            canDelete={canDelete}
            canIssue={canIssue}
            canReorder={canReorder}
          />
        ))}
      </div>

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="makrcave-card text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' || selectedStatus !== 'all' || selectedSupplierType !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'Start by adding your first inventory item'
            }
          </p>
          <FeatureGate featureKey="inventory.makerspace_management" fallback={null}>
            <button 
              onClick={() => setShowAddModal(true)}
              className="makrcave-btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </button>
          </FeatureGate>
        </div>
      )}

      {/* Modals */}
      <ItemDetailModal />
    </div>
  );
}
