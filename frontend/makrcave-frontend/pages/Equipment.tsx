import { useState } from 'react';
import { 
  Wrench, Calendar, Settings, Play, Pause, AlertTriangle, Plus, Edit, 
  Trash2, Eye, Clock, MapPin, Star, Zap, X, Save, Monitor, Calendar as CalendarIcon,
  Shield, CheckCircle, XCircle, User, Clipboard
} from 'lucide-react';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { useAuth } from '../contexts/AuthContext';
import { FeatureGate, withFeatureFlag, FeatureFlagBadge, useFeatureAccess } from '../components/FeatureGate';
import ReservationModal from '../components/ReservationModal';

interface Equipment {
  id: string;
  name: string;
  type: 'printer_3d' | 'laser_cutter' | 'cnc_machine' | 'workstation' | 'tool';
  status: 'available' | 'in_use' | 'maintenance' | 'offline';
  location?: string;
  lastMaintenance?: string;
  makerspaceId: string;
  description?: string;
  specifications?: Record<string, any>;
  requiredCertifications?: string[];
  hourlyRate?: number;
  totalHours?: number;
  successRate?: number;
  monthlyHours?: number;
  maintenanceInterval?: number;
  nextMaintenance?: string;
  accessMethod?: 'nfc' | 'manual' | 'badge';
  operatorRequired?: boolean;
}

export default function Equipment() {
  const { equipment } = useMakerspace();
  const { user } = useAuth();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showReservationModal, setShowReservationModal] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<Equipment | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'specifications' | 'monitoring' | 'maintenance'>('overview');

  const maintenanceAccess = useFeatureAccess('equipment.maintenance_mode');
  const addEditAccess = useFeatureAccess('equipment.add_edit');
  const viewAllAccess = useFeatureAccess('equipment.view_all');
  const viewAssignedAccess = useFeatureAccess('equipment.view_assigned');

  // Filter equipment by makerspace for makerspace admins
  const filteredEquipment = user?.role === 'makerspace_admin' 
    ? equipment.filter(item => user.assignedMakerspaces?.includes(item.makerspaceId))
    : equipment;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_use': return <User className="w-4 h-4 text-blue-500" />;
      case 'maintenance': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'offline': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'printer_3d': return <Zap className="w-5 h-5 text-purple-500" />;
      case 'laser_cutter': return <Zap className="w-5 h-5 text-red-500" />;
      case 'cnc_machine': return <Settings className="w-5 h-5 text-blue-500" />;
      case 'workstation': return <Monitor className="w-5 h-5 text-green-500" />;
      default: return <Wrench className="w-5 h-5 text-gray-500" />;
    }
  };

  const EquipmentDetailModal = () => {
    if (!showDetailModal || !selectedEquipment) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-border">
            <div className="flex items-center gap-3">
              {getTypeIcon(selectedEquipment.type)}
              <div>
                <h2 className="text-xl font-semibold">{selectedEquipment.name}</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm text-muted-foreground capitalize">
                    {selectedEquipment.type.replace('_', ' ')}
                  </span>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm text-muted-foreground">{selectedEquipment.location}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                {getStatusIcon(selectedEquipment.status)}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedEquipment.status === 'available' ? 'bg-green-100 text-green-700' :
                  selectedEquipment.status === 'in_use' ? 'bg-blue-100 text-blue-700' :
                  selectedEquipment.status === 'maintenance' ? 'bg-amber-100 text-amber-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {selectedEquipment.status === 'available' ? 'Available' :
                   selectedEquipment.status === 'in_use' ? 'In Use' :
                   selectedEquipment.status === 'maintenance' ? 'Maintenance' : 'Offline'}
                </span>
              </div>
              <button
                onClick={() => setShowDetailModal(false)}
                className="p-2 hover:bg-accent rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-border">
            {['overview', 'specifications', 'monitoring', 'maintenance'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`px-6 py-3 text-sm font-medium capitalize transition-colors ${
                  activeTab === tab
                    ? 'border-b-2 border-makrx-teal text-makrx-teal'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Location & Status */}
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      Location & Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Location:</span>
                        <span>{selectedEquipment.location}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Status:</span>
                        <div className="flex items-center gap-2">
                          {getStatusIcon(selectedEquipment.status)}
                          <span className="capitalize">{selectedEquipment.status.replace('_', ' ')}</span>
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span>Access Method:</span>
                        <span className="uppercase">{selectedEquipment.accessMethod || 'NFC'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Requires Skills:</span>
                        <span>{selectedEquipment.operatorRequired ? 'Yes' : 'No'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Usage Stats */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Usage Statistics</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">{selectedEquipment.totalHours || 1247}</div>
                        <div className="text-xs text-muted-foreground">Total Hours</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{selectedEquipment.successRate || 94}%</div>
                        <div className="text-xs text-muted-foreground">Success Rate</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{selectedEquipment.monthlyHours || 89}</div>
                        <div className="text-xs text-muted-foreground">This Month</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-makrx-teal">${selectedEquipment.hourlyRate || 12}/hr</div>
                        <div className="text-xs text-muted-foreground">Rate</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Maintenance Schedule */}
                <div className="space-y-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      Maintenance Schedule
                    </h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Last Maintenance:</span>
                        <span>{selectedEquipment.lastMaintenance || '1/10/2024'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Next Maintenance:</span>
                        <span className="text-amber-600">{selectedEquipment.nextMaintenance || '2/10/2024'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Maintenance Interval:</span>
                        <span>{selectedEquipment.maintenanceInterval || 30} days</span>
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h3 className="font-semibold mb-3">Description</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedEquipment.description || 
                        "High-precision FDM 3D printer perfect for prototyping and small-scale production. Features automatic bed leveling and filament detection."}
                    </p>
                  </div>

                  {/* Required Certifications */}
                  {selectedEquipment.requiredCertifications && (
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <h3 className="font-semibold mb-3 flex items-center gap-2 text-amber-800">
                        <Shield className="w-4 h-4" />
                        Required Skills & Certifications
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {(selectedEquipment.requiredCertifications || ['3D Printing', 'Safety Certified']).map((cert) => (
                          <span key={cert} className="px-2 py-1 bg-amber-100 text-amber-700 rounded text-xs">
                            {cert}
                          </span>
                        ))}
                      </div>
                      <p className="text-xs text-amber-700 mt-2">
                        Users must have these certifications before operating this equipment.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'specifications' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Technical Specifications</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Build Volume</h4>
                    <p className="text-sm text-muted-foreground">250 x 210 x 200 mm</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Layer Resolution</h4>
                    <p className="text-sm text-muted-foreground">0.1 - 0.3 mm</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Nozzle Diameter</h4>
                    <p className="text-sm text-muted-foreground">0.4 mm (standard)</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <h4 className="font-medium mb-2">Supported Materials</h4>
                    <p className="text-sm text-muted-foreground">PLA, PETG, ABS, ASA</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'monitoring' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Real-time Monitoring</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800">Current Status</h4>
                    <p className="text-2xl font-bold text-green-600">Operational</p>
                    <p className="text-xs text-green-600">All systems normal</p>
                  </div>
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800">Current Job</h4>
                    <p className="text-sm text-blue-600">Project Housing v2.stl</p>
                    <p className="text-xs text-blue-600">2h 15m remaining</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800">Temperature</h4>
                    <p className="text-sm text-purple-600">Hotend: 210°C</p>
                    <p className="text-xs text-purple-600">Bed: 60°C</p>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'maintenance' && (
              <div className="space-y-4">
                <h3 className="font-semibold">Maintenance History</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Routine Maintenance</p>
                      <p className="text-xs text-muted-foreground">Bed leveling, nozzle cleaning</p>
                    </div>
                    <span className="text-xs text-muted-foreground">1/10/2024</span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <p className="font-medium">Hotend Replacement</p>
                      <p className="text-xs text-muted-foreground">Replaced worn hotend assembly</p>
                    </div>
                    <span className="text-xs text-muted-foreground">12/15/2023</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer Actions */}
          <div className="p-6 border-t border-border flex gap-3 justify-end">
            <FeatureGate featureKey="equipment.reservation_system" fallback={null}>
              <button 
                onClick={() => {
                  setShowDetailModal(false);
                  setShowReservationModal(true);
                }}
                className="makrcave-btn-primary"
              >
                Reserve Equipment
              </button>
            </FeatureGate>
            
            {addEditAccess.hasAccess && (
              <>
                <button className="makrcave-btn-secondary">
                  Schedule Maintenance
                </button>
                <button 
                  onClick={() => {
                    setShowDetailModal(false);
                    setShowEditModal(true);
                  }}
                  className="makrcave-btn-secondary"
                >
                  Equipment Settings
                </button>
              </>
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

  const AddEquipmentModal = () => {
    if (!showAddModal) return null;

    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <div className="bg-card p-6 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold">Add New Equipment</h3>
            <button onClick={() => setShowAddModal(false)} className="p-1 hover:bg-accent rounded">
              <X className="w-5 h-5" />
            </button>
          </div>

          <form className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Equipment Name *</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="e.g., Ultimaker S5 Pro"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Type *</label>
                <select 
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                >
                  <option value="">Select type...</option>
                  <option value="printer_3d">3D Printer</option>
                  <option value="laser_cutter">Laser Cutter</option>
                  <option value="cnc_machine">CNC Machine</option>
                  <option value="workstation">Workstation</option>
                  <option value="tool">Tool</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Location *</label>
                <input 
                  type="text" 
                  required
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="e.g., Station A-1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hourly Rate</label>
                <input 
                  type="number" 
                  step="0.01"
                  className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                  placeholder="12.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <textarea 
                rows={3}
                className="w-full px-3 py-2 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-makrx-teal"
                placeholder="Equipment description and capabilities..."
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">Requires operator certification</span>
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span className="text-sm">NFC access control</span>
              </label>
            </div>

            <div className="flex gap-3 pt-4">
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
                <Save className="w-4 h-4 mr-2" />
                Add Equipment
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Wrench className="w-8 h-8" />
            Equipment Management
            <FeatureFlagBadge featureKey="equipment.reservation_system" />
            {viewAllAccess.hasAccess && <FeatureFlagBadge featureKey="equipment.view_all" />}
            {addEditAccess.hasAccess && <FeatureFlagBadge featureKey="equipment.add_edit" />}
          </h1>
          <p className="text-muted-foreground mt-1">
            {viewAllAccess.hasAccess ? 'Monitor and reserve equipment across all makerspaces' :
             viewAssignedAccess.hasAccess ? 'Monitor and reserve equipment in your assigned makerspaces' :
             'View and reserve equipment you are certified to use'}
          </p>
        </div>

        {addEditAccess.hasAccess && (
          <button 
            onClick={() => setShowAddModal(true)}
            className="makrcave-btn-primary flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Equipment
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEquipment.map((item) => (
          <div key={item.id} className="makrcave-card group hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3">
                {getTypeIcon(item.type)}
                <div>
                  <h3 className="font-semibold group-hover:text-makrx-teal transition-colors cursor-pointer" 
                      onClick={() => {
                        setSelectedEquipment(item as Equipment);
                        setShowDetailModal(true);
                      }}>
                    {item.name}
                  </h3>
                  <p className="text-sm text-muted-foreground capitalize">{item.type.replace('_', ' ')}</p>
                  <p className="text-xs text-muted-foreground">{item.location}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(item.status)}
                <span className={`makrcave-status-${item.status} text-xs`}>
                  {item.status.replace('_', ' ')}
                </span>
              </div>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Last Maintenance:</span>
                <span>{item.lastMaintenance}</span>
              </div>
              {(item as Equipment).hourlyRate && (
                <div className="flex justify-between text-sm">
                  <span>Hourly Rate:</span>
                  <span>${(item as Equipment).hourlyRate}/hr</span>
                </div>
              )}
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setSelectedEquipment(item as Equipment);
                  setShowDetailModal(true);
                }}
                className="flex-1 makrcave-btn-secondary text-sm"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Details
              </button>

              <FeatureGate featureKey="equipment.reservation_system" fallback={null}>
                <button 
                  onClick={() => {
                    setSelectedEquipment(item as Equipment);
                    setShowReservationModal(true);
                  }}
                  className="makrcave-btn-primary text-sm"
                  disabled={item.status !== 'available'}
                >
                  <Calendar className="w-4 h-4" />
                </button>
              </FeatureGate>

              {addEditAccess.hasAccess && (
                <button 
                  onClick={() => {
                    setSelectedEquipment(item as Equipment);
                    setShowEditModal(true);
                  }}
                  className="makrcave-btn-secondary text-sm"
                >
                  <Settings className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {filteredEquipment.length === 0 && (
        <div className="makrcave-card text-center py-12">
          <Wrench className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <h3 className="text-lg font-medium mb-2">No equipment found</h3>
          <p className="text-muted-foreground mb-4">
            {user?.role === 'makerspace_admin' 
              ? 'Add your first piece of equipment to get started'
              : 'No equipment available in your assigned makerspaces'
            }
          </p>
          {addEditAccess.hasAccess && (
            <button 
              onClick={() => setShowAddModal(true)}
              className="makrcave-btn-primary"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Equipment
            </button>
          )}
        </div>
      )}

      {/* Modals */}
      <EquipmentDetailModal />
      <AddEquipmentModal />
      <ReservationModal
        isOpen={showReservationModal}
        onClose={() => setShowReservationModal(false)}
        equipment={selectedEquipment}
      />
    </div>
  );
}
