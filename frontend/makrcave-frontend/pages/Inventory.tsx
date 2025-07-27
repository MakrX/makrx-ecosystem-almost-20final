import { useState } from 'react';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Package, 
  Plus, 
  Search, 
  Filter, 
  AlertTriangle, 
  TrendingDown, 
  TrendingUp,
  Edit,
  ExternalLink,
  ShoppingCart,
  BarChart3
} from 'lucide-react';

export default function Inventory() {
  const { inventory, addInventoryItem, updateInventoryQuantity } = useMakerspace();
  const { isMakerspaceAdmin } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'filament', label: 'Filament' },
    { value: 'resin', label: 'Resin' },
    { value: 'tools', label: 'Tools' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'materials', label: 'Materials' },
    { value: 'consumables', label: 'Consumables' }
  ];

  const lowStockItems = filteredInventory.filter(item => item.quantity <= item.lowStockThreshold);
  const totalValue = filteredInventory.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  const InventoryCard = ({ item }: { item: any }) => {
    const isLowStock = item.quantity <= item.lowStockThreshold;
    
    return (
      <div className={`makrcave-card ${isLowStock ? 'border-red-200 bg-red-50' : ''}`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold">{item.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
          </div>
          {isLowStock && (
            <AlertTriangle className="w-5 h-5 text-red-500" />
          )}
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Current Stock:</span>
            <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-green-600'}`}>
              {item.quantity} {item.unit}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Low Stock Alert:</span>
            <span>{item.lowStockThreshold} {item.unit}</span>
          </div>
          {item.price && (
            <div className="flex justify-between text-sm">
              <span>Unit Price:</span>
              <span>${item.price}</span>
            </div>
          )}
          {item.supplier && (
            <div className="flex justify-between text-sm">
              <span>Supplier:</span>
              <span>{item.supplier}</span>
            </div>
          )}
        </div>

        {/* Stock Level Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Stock Level</span>
            <span>{Math.round((item.quantity / (item.lowStockThreshold * 3)) * 100)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full ${
                isLowStock ? 'bg-red-500' : 'bg-green-500'
              }`}
              style={{ 
                width: `${Math.min(100, (item.quantity / (item.lowStockThreshold * 3)) * 100)}%` 
              }}
            ></div>
          </div>
        </div>

        {isMakerspaceAdmin && (
          <div className="flex gap-2">
            <button className="flex-1 makrcave-btn-primary text-sm">
              <Edit className="w-4 h-4 mr-1" />
              Update Stock
            </button>
            <button className="makrcave-btn-secondary text-sm">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Reorder
            </button>
          </div>
        )}
      </div>
    );
  };

  const AddInventoryModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-card p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Add Inventory Item</h3>
          <form className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Item Name</label>
              <input 
                type="text" 
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
                placeholder="e.g., PLA Filament - Blue"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <select className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue">
                <option value="filament">Filament</option>
                <option value="resin">Resin</option>
                <option value="tools">Tools</option>
                <option value="electronics">Electronics</option>
                <option value="materials">Materials</option>
                <option value="consumables">Consumables</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity</label>
                <input 
                  type="number" 
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Unit</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
                  placeholder="kg, pcs, rolls"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Low Stock Threshold</label>
              <input 
                type="number" 
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
                placeholder="3"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Price</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
                  placeholder="25.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Supplier</label>
                <input 
                  type="text" 
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
                  placeholder="Hatchbox"
                />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button 
                type="button"
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 makrcave-btn-primary"
              >
                Add Item
              </button>
            </div>
          </form>
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
            Track and manage makerspace materials and supplies
          </p>
        </div>
        {isMakerspaceAdmin && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="makrcave-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Item
          </button>
        )}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Items</p>
              <p className="text-2xl font-bold">{inventory.length}</p>
            </div>
            <Package className="w-8 h-8 text-makrx-blue" />
          </div>
        </div>

        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Low Stock</p>
              <p className="text-2xl font-bold text-red-600">{lowStockItems.length}</p>
            </div>
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
        </div>

        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Value</p>
              <p className="text-2xl font-bold">${totalValue.toFixed(2)}</p>
            </div>
            <BarChart3 className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <Filter className="w-8 h-8 text-makrx-yellow" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="makrcave-card">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search inventory..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-blue"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <button className="makrcave-btn-secondary flex items-center gap-2">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <div className="makrcave-card border-red-200 bg-red-50">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-red-700">Low Stock Alert</h3>
          </div>
          <p className="text-sm text-red-600 mb-3">
            {lowStockItems.length} items are running low and need reordering:
          </p>
          <div className="flex flex-wrap gap-2">
            {lowStockItems.map(item => (
              <span key={item.id} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                {item.name} ({item.quantity} {item.unit})
              </span>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <button className="makrcave-btn-primary text-sm">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Order via MakrX Store
            </button>
            <button className="makrcave-btn-secondary text-sm">
              Generate Report
            </button>
          </div>
        </div>
      )}

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredInventory.map((item) => (
          <InventoryCard key={item.id} item={item} />
        ))}
      </div>

      {/* Empty State */}
      {filteredInventory.length === 0 && (
        <div className="makrcave-card text-center py-12">
          <Package className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No items found</h3>
          <p className="text-muted-foreground mb-4">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'Start by adding your first inventory item'
            }
          </p>
          {isMakerspaceAdmin && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="makrcave-btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Item
            </button>
          )}
        </div>
      )}

      <AddInventoryModal />
    </div>
  );
}
