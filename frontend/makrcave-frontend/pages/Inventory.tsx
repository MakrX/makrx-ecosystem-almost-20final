import { useState, useRef } from 'react';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { useAuth } from '../contexts/AuthContext';
import { FeatureGate } from '../components/FeatureGate';
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
  BarChart3,
  QrCode,
  Camera,
  X,
  Save,
  Upload,
  Download,
  History,
  Eye,
  MoreHorizontal,
  CheckCircle,
  XCircle
} from 'lucide-react';

// QR Code scanning mock component (in real app, you'd use a proper QR library)
const QRScanner = ({ onScan, onClose }: { onScan: (code: string) => void; onClose: () => void }) => {
  const [scanning, setScanning] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Mock QR codes for demonstration
  const mockQRCodes = [
    'MKX-FIL-HAT-PLA001-1.75-BLU', // MakrX-Filament-Hatchbox-PLA-1.75mm-Blue
    'MKX-RES-FOR-STD001-GRY', // MakrX-Resin-Formlabs-Standard-Grey
    'MKX-TOL-PRI-CAL001-STL', // MakrX-Tool-Prusa-Calipers-Steel
    'MKX-ELE-ARD-UNO001-R3', // MakrX-Electronics-Arduino-Uno-R3
    'MKX-MAT-ACR-PLX001-3MM' // MakrX-Material-Acrylic-Plexiglass-3mm
  ];

  const simulateScan = () => {
    const randomCode = mockQRCodes[Math.floor(Math.random() * mockQRCodes.length)];
    onScan(randomCode);
    setScanning(false);
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Scan QR Code</h3>
          <button onClick={onClose} className="p-1 hover:bg-accent rounded">
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="aspect-square bg-black rounded-lg mb-4 relative overflow-hidden">
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            autoPlay
            muted
            style={{ filter: 'blur(2px)' }}
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-48 border-2 border-makrx-teal rounded-lg">
              <div className="w-full h-full border border-makrx-teal/50 rounded-lg m-2"></div>
            </div>
          </div>
          {scanning && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-1 bg-makrx-teal animate-pulse"></div>
            </div>
          )}
        </div>
        
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-4">
            Position the QR code within the frame to scan
          </p>
          <button 
            onClick={simulateScan}
            className="makrcave-btn-primary w-full"
            disabled={!scanning}
          >
            {scanning ? 'Simulate Scan' : 'Scanned!'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Inventory() {
  const { inventory, addInventoryItem, updateInventoryQuantity } = useMakerspace();
  const { hasPermission } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [showHistoryModal, setShowHistoryModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isScannedItem, setIsScannedItem] = useState(false);
  
  // Form states
  const [newItem, setNewItem] = useState({
    name: '',
    category: 'filament',
    quantity: '',
    unit: '',
    lowStockThreshold: '',
    price: '',
    supplier: '',
    description: '',
    sku: '',
    location: '',
    isScanned: false
  });

  const [editItem, setEditItem] = useState({
    name: '',
    category: 'filament',
    quantity: '',
    unit: '',
    lowStockThreshold: '',
    price: '',
    supplier: '',
    description: '',
    sku: '',
    location: '',
    isScanned: false
  });

  const resetForm = () => {
    setNewItem({
      name: '',
      category: 'filament',
      quantity: '',
      unit: '',
      lowStockThreshold: '',
      price: '',
      supplier: '',
      description: '',
      sku: '',
      location: '',
      isScanned: false
    });
    setIsScannedItem(false);
  };

  const loadItemForEdit = (item: any) => {
    setEditItem({
      name: item.name || '',
      category: item.category || 'filament',
      quantity: item.quantity?.toString() || '',
      unit: item.unit || '',
      lowStockThreshold: item.lowStockThreshold?.toString() || '',
      price: item.price?.toString() || '',
      supplier: item.supplier || '',
      description: item.description || '',
      sku: item.sku || '',
      location: item.location || '',
      isScanned: item.isScanned || false
    });
  };

  // Filter inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: 'all', label: 'All Categories', color: 'bg-gray-100' },
    { value: 'filament', label: 'Filament', color: 'bg-blue-100' },
    { value: 'resin', label: 'Resin', color: 'bg-purple-100' },
    { value: 'tools', label: 'Tools', color: 'bg-orange-100' },
    { value: 'electronics', label: 'Electronics', color: 'bg-yellow-100' },
    { value: 'materials', label: 'Materials', color: 'bg-green-100' },
    { value: 'consumables', label: 'Consumables', color: 'bg-red-100' }
  ];

  const lowStockItems = filteredInventory.filter(item => item.quantity <= item.lowStockThreshold);
  const totalValue = filteredInventory.reduce((sum, item) => sum + ((item.price || 0) * item.quantity), 0);

  // Parse QR code and extract item information
  const parseQRCode = (qrCode: string) => {
    // Expected format: MKX-CAT-BRD-ITM001-VAR1-VAR2
    const parts = qrCode.split('-');
    if (parts.length >= 4 && parts[0] === 'MKX') {
      const categoryMap: { [key: string]: string } = {
        'FIL': 'filament',
        'RES': 'resin',
        'TOL': 'tools',
        'ELE': 'electronics',
        'MAT': 'materials',
        'CON': 'consumables'
      };
      
      return {
        category: categoryMap[parts[1]] || 'materials',
        brand: parts[2],
        item: parts[3],
        variant1: parts[4] || '',
        variant2: parts[5] || '',
        sku: qrCode
      };
    }
    return null;
  };

  const handleQRScan = (qrCode: string) => {
    const parsedData = parseQRCode(qrCode);
    if (parsedData) {
      setNewItem({
        ...newItem,
        category: parsedData.category,
        sku: parsedData.sku,
        name: `${parsedData.brand} ${parsedData.item} ${parsedData.variant1} ${parsedData.variant2}`.trim(),
        isScanned: true
      });
      setIsScannedItem(true);
      setShowQRScanner(false);
      setShowAddModal(true);
    } else {
      alert('Invalid QR code format. Please scan a valid MakrX item code.');
    }
  };

  const InventoryCard = ({ item }: { item: any }) => {
    const isLowStock = item.quantity <= item.lowStockThreshold;
    const stockPercentage = Math.min(100, (item.quantity / (item.lowStockThreshold * 3)) * 100);
    
    return (
      <div className={`makrcave-card ${isLowStock ? 'border-red-200 bg-red-50' : ''} group`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h3 className="font-semibold group-hover:text-makrx-teal transition-colors">{item.name}</h3>
            <p className="text-sm text-muted-foreground capitalize">{item.category}</p>
            {item.isScanned && item.sku && (
              <p className="text-xs text-muted-foreground font-mono">{item.sku}</p>
            )}
            {!item.isScanned && (
              <div className="mt-1 px-2 py-1 bg-amber-50 border border-amber-200 rounded text-xs text-amber-700">
                <span className="font-medium">User-added product.</span> MakrX has not reviewed or certified this item.
              </div>
            )}
          </div>
          <div className="flex items-center gap-2">
            {isLowStock && <AlertTriangle className="w-5 h-5 text-red-500" />}
            <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-accent rounded">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex justify-between text-sm">
            <span>Current Stock:</span>
            <span className={`font-medium ${isLowStock ? 'text-red-600' : 'text-makrx-teal'}`}>
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
          {item.location && (
            <div className="flex justify-between text-sm">
              <span>Location:</span>
              <span>{item.location}</span>
            </div>
          )}
        </div>

        {/* Stock Level Bar */}
        <div className="mb-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Stock Level</span>
            <span>{Math.round(stockPercentage)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className={`h-2 rounded-full transition-all ${
                isLowStock ? 'bg-red-500' : stockPercentage > 70 ? 'bg-makrx-teal' : 'bg-yellow-500'
              }`}
              style={{ width: `${stockPercentage}%` }}
            ></div>
          </div>
        </div>

        <FeatureGate featureKey="inventory.makerspace_management">
          <div className="flex gap-2">
            <button
              onClick={() => {
                setSelectedItem(item);
                loadItemForEdit(item);
                setShowEditModal(true);
              }}
              className="flex-1 makrcave-btn-primary text-sm"
            >
              <Edit className="w-4 h-4 mr-1" />
              Update
            </button>
            <FeatureGate featureKey="inventory.qr_generation">
              <button className="makrcave-btn-secondary text-sm">
                <QrCode className="w-4 h-4" />
              </button>
            </FeatureGate>
          </div>
        </FeatureGate>
      </div>
    );
  };

  const AddInventoryModal = () => {
    if (!showAddModal) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Add item logic here
      console.log('Adding item:', newItem);
      resetForm();
      setShowAddModal(false);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Add Inventory Item</h3>
            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-accent rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Quick QR Scan */}
            <div className="bg-makrx-teal/10 border border-makrx-teal/20 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <QrCode className="w-5 h-5 text-makrx-teal" />
                <span className="font-medium text-makrx-teal">Quick Add via QR Code</span>
              </div>
              <p className="text-sm text-muted-foreground mb-3">
                Scan authorized MakrX item QR codes for instant inventory addition
              </p>
              <button 
                type="button"
                onClick={() => {
                  setShowAddModal(false);
                  setShowQRScanner(true);
                }}
                className="makrcave-btn-primary"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR Code
              </button>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Item Name *</label>
                <input 
                  type="text" 
                  required
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="e.g., PLA Filament - Blue"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select 
                  required
                  value={newItem.category}
                  onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                >
                  {categories.slice(1).map(cat => (
                    <option key={cat.value} value={cat.value}>{cat.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Warning for Manual Items */}
            {!isScannedItem && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">User-added Product</h4>
                    <p className="text-sm text-amber-700">
                      MakrX has not reviewed or certified this item. This product will not have an official SKU and may not be available for BOM integration until reviewed.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SKU and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isScannedItem && (
                <div>
                  <label className="block text-sm font-medium mb-2">SKU/Item Code</label>
                  <input
                    type="text"
                    value={newItem.sku}
                    onChange={(e) => setNewItem({...newItem, sku: e.target.value})}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal bg-gray-50"
                    placeholder="MKX-FIL-HAT-PLA001"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated from QR scan</p>
                </div>
              )}
              <div className={isScannedItem ? '' : 'md:col-span-2'}>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={newItem.location}
                  onChange={(e) => setNewItem({...newItem, location: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="Shelf A3, Bin 12"
                />
              </div>
            </div>

            {/* Quantity and Units */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quantity *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={newItem.quantity}
                  onChange={(e) => setNewItem({...newItem, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="10"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit *</label>
                <input 
                  type="text" 
                  required
                  value={newItem.unit}
                  onChange={(e) => setNewItem({...newItem, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="kg, pcs, rolls"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Low Stock Alert *</label>
                <input 
                  type="number" 
                  required
                  min="0"
                  value={newItem.lowStockThreshold}
                  onChange={(e) => setNewItem({...newItem, lowStockThreshold: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="3"
                />
              </div>
            </div>

            {/* Price and Supplier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Unit Price</label>
                <input 
                  type="number" 
                  step="0.01"
                  min="0"
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="25.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Supplier</label>
                <input 
                  type="text" 
                  value={newItem.supplier}
                  onChange={(e) => setNewItem({...newItem, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="Hatchbox, Prusa, etc."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                value={newItem.description}
                onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                placeholder="Additional details about the item..."
              />
            </div>

            <div className="flex gap-3 pt-4">
              <button 
                type="button"
                onClick={() => {
                  resetForm();
                  setShowAddModal(false);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 makrcave-btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Add Item
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const EditInventoryModal = () => {
    if (!showEditModal || !selectedItem) return null;

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      // Update item logic here
      console.log('Updating item:', selectedItem.id, editItem);
      // In a real app, you'd call updateInventoryItem or similar
      setShowEditModal(false);
      setSelectedItem(null);
    };

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Edit Inventory Item</h2>
            <button
              onClick={() => {
                setShowEditModal(false);
                setSelectedItem(null);
              }}
              className="p-2 hover:bg-accent rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Item Name and Category */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Item Name *</label>
                <input
                  type="text"
                  required
                  value={editItem.name}
                  onChange={(e) => setEditItem({...editItem, name: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="PLA Filament - White"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category *</label>
                <select
                  required
                  value={editItem.category}
                  onChange={(e) => setEditItem({...editItem, category: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                >
                  <option value="filament">Filament</option>
                  <option value="resin">Resin</option>
                  <option value="tools">Tools</option>
                  <option value="electronics">Electronics</option>
                  <option value="materials">Materials</option>
                </select>
              </div>
            </div>

            {/* Warning for Manual Items */}
            {!editItem.isScanned && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-amber-800 mb-1">User-added Product</h4>
                    <p className="text-sm text-amber-700">
                      MakrX has not reviewed or certified this item. This product does not have an official SKU.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* SKU and Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {editItem.isScanned && (
                <div>
                  <label className="block text-sm font-medium mb-2">SKU/Item Code</label>
                  <input
                    type="text"
                    value={editItem.sku}
                    className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal bg-gray-50"
                    placeholder="MKX-FIL-HAT-PLA001"
                    readOnly
                  />
                  <p className="text-xs text-muted-foreground mt-1">Auto-generated from QR scan</p>
                </div>
              )}
              <div className={editItem.isScanned ? '' : 'md:col-span-2'}>
                <label className="block text-sm font-medium mb-2">Location</label>
                <input
                  type="text"
                  value={editItem.location}
                  onChange={(e) => setEditItem({...editItem, location: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="Shelf A-1"
                />
              </div>
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Current Quantity *</label>
                <input
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  value={editItem.quantity}
                  onChange={(e) => setEditItem({...editItem, quantity: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Unit *</label>
                <input
                  type="text"
                  required
                  value={editItem.unit}
                  onChange={(e) => setEditItem({...editItem, unit: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="kg, pcs, rolls"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Low Stock Alert *</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editItem.lowStockThreshold}
                  onChange={(e) => setEditItem({...editItem, lowStockThreshold: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="3"
                />
              </div>
            </div>

            {/* Price and Supplier */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Unit Price</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={editItem.price}
                  onChange={(e) => setEditItem({...editItem, price: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="25.99"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Supplier</label>
                <input
                  type="text"
                  value={editItem.supplier}
                  onChange={(e) => setEditItem({...editItem, supplier: e.target.value})}
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="Hatchbox, Prusa, etc."
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea
                value={editItem.description}
                onChange={(e) => setEditItem({...editItem, description: e.target.value})}
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                placeholder="Additional details about the item..."
              />
            </div>

            {/* Quick Quantity Adjustments */}
            <div className="bg-muted/50 p-4 rounded-lg">
              <h3 className="text-sm font-medium mb-3">Quick Quantity Adjustments</h3>
              <div className="flex gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => setEditItem({...editItem, quantity: Math.max(0, parseFloat(editItem.quantity || '0') - 1).toString()})}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  -1
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem({...editItem, quantity: Math.max(0, parseFloat(editItem.quantity || '0') - 5).toString()})}
                  className="px-3 py-1 bg-red-100 text-red-700 rounded text-sm hover:bg-red-200 transition-colors"
                >
                  -5
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem({...editItem, quantity: (parseFloat(editItem.quantity || '0') + 1).toString()})}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  +1
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem({...editItem, quantity: (parseFloat(editItem.quantity || '0') + 5).toString()})}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  +5
                </button>
                <button
                  type="button"
                  onClick={() => setEditItem({...editItem, quantity: (parseFloat(editItem.quantity || '0') + 10).toString()})}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded text-sm hover:bg-green-200 transition-colors"
                >
                  +10
                </button>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedItem(null);
                }}
                className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 makrcave-btn-primary"
              >
                <Save className="w-4 h-4 mr-2" />
                Update Item
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  const BulkOperationsModal = () => {
    if (!showBulkModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card p-6 rounded-lg w-full max-w-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Bulk Operations</h3>
            <button onClick={() => setShowBulkModal(false)} className="p-1 hover:bg-accent rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-4">
            <button className="w-full makrcave-btn-primary text-left flex items-center gap-3 p-4">
              <Upload className="w-5 h-5" />
              <div>
                <div className="font-medium">Import from CSV</div>
                <div className="text-sm opacity-75">Bulk add items from spreadsheet</div>
              </div>
            </button>

            <button className="w-full makrcave-btn-secondary text-left flex items-center gap-3 p-4">
              <Download className="w-5 h-5" />
              <div>
                <div className="font-medium">Export to CSV</div>
                <div className="text-sm opacity-75">Download current inventory</div>
              </div>
            </button>

            <button className="w-full border border-border hover:bg-accent text-left flex items-center gap-3 p-4 rounded-lg transition-colors">
              <QrCode className="w-5 h-5" />
              <div>
                <div className="font-medium">Generate QR Codes</div>
                <div className="text-sm text-muted-foreground">Print labels for existing items</div>
              </div>
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
            Track and manage makerspace materials with QR code integration
          </p>
        </div>
        
        <div className="flex gap-3">
          <FeatureGate featureKey="inventory.qr_scanning">
            <button
              onClick={() => setShowQRScanner(true)}
              className="makrcave-btn-secondary flex items-center gap-2"
            >
              <QrCode className="w-4 h-4" />
              Scan QR
            </button>
          </FeatureGate>

          <FeatureGate featureKey="inventory.qr_generation">
            <button
              onClick={() => setShowBulkModal(true)}
              className="makrcave-btn-secondary flex items-center gap-2"
            >
              <MoreHorizontal className="w-4 h-4" />
              Bulk Actions
            </button>
          </FeatureGate>

          <FeatureGate featureKey="inventory.makerspace_management">
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
            <BarChart3 className="w-8 h-8 text-makrx-teal" />
          </div>
        </div>

        <div className="makrcave-card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Categories</p>
              <p className="text-2xl font-bold">{categories.length - 1}</p>
            </div>
            <Filter className="w-8 h-8 text-makrx-teal" />
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
              placeholder="Search inventory by name or SKU..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
          >
            {categories.map(category => (
              <option key={category.value} value={category.value}>
                {category.label}
              </option>
            ))}
          </select>
          <div className="flex gap-2">
            <button 
              onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
              className="px-4 py-2 border border-border rounded-lg hover:bg-accent transition-colors"
            >
              {viewMode === 'grid' ? 'List View' : 'Grid View'}
            </button>
          </div>
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
          <div className="flex flex-wrap gap-2 mb-4">
            {lowStockItems.slice(0, 5).map(item => (
              <span key={item.id} className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                {item.name} ({item.quantity} {item.unit})
              </span>
            ))}
            {lowStockItems.length > 5 && (
              <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-sm">
                +{lowStockItems.length - 5} more
              </span>
            )}
          </div>
          <div className="flex gap-2">
            <button className="makrcave-btn-primary text-sm">
              <ShoppingCart className="w-4 h-4 mr-1" />
              Reorder via MakrX Store
            </button>
            <button className="makrcave-btn-secondary text-sm">
              Generate Report
            </button>
          </div>
        </div>
      )}

      {/* Inventory Grid/List */}
      <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
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
          <div className="flex gap-3 justify-center">
            <FeatureGate featureKey="inventory.qr_scanning">
              <button
                onClick={() => setShowQRScanner(true)}
                className="makrcave-btn-secondary"
              >
                <QrCode className="w-4 h-4 mr-2" />
                Scan QR Code
              </button>
            </FeatureGate>
            <FeatureGate featureKey="inventory.makerspace_management">
              <button
                onClick={() => setShowAddModal(true)}
                className="makrcave-btn-primary"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add First Item
              </button>
            </FeatureGate>
          </div>
        </div>
      )}

      {/* Modals */}
      <AddInventoryModal />
      <EditInventoryModal />
      <BulkOperationsModal />
      {showQRScanner && (
        <QRScanner 
          onScan={handleQRScan} 
          onClose={() => setShowQRScanner(false)} 
        />
      )}
    </div>
  );
}
