/**
 * Feature Flag Admin Interface
 * Allows superadmins to manage feature flags across the MakrX ecosystem
 */

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import {
  ToggleLeft,
  ToggleRight,
  Settings,
  Eye,
  EyeOff,
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Globe,
  MapPin,
  Building,
  User,
  Percent,
  Sliders,
  Database,
  Search,
  Filter,
  Save,
  RefreshCw
} from 'lucide-react';

interface FlagDefinition {
  key: string;
  namespace: string;
  area: string;
  feature: string;
  type: 'boolean' | 'percentage' | 'multivariate' | 'config';
  scope: 'global' | 'role' | 'audience' | 'space' | 'user';
  defaultValue: any;
  rolloutState: 'off' | 'internal' | 'beta' | 'on' | 'remove';
  description: string;
  owner: string;
  enabled?: boolean;
  percentageRollout?: number;
  configValue?: any;
  enabledForRoles?: string[];
  lastUpdated?: string;
}

const ROLLOUT_STATES = [
  { value: 'off', label: 'Off', color: 'bg-gray-500', description: 'Feature is disabled' },
  { value: 'internal', label: 'Internal', color: 'bg-yellow-500', description: 'Only for internal users' },
  { value: 'beta', label: 'Beta', color: 'bg-blue-500', description: 'Limited rollout' },
  { value: 'on', label: 'On', color: 'bg-green-500', description: 'Fully enabled' },
  { value: 'remove', label: 'Remove', color: 'bg-red-500', description: 'Marked for removal' }
];

const SCOPES = [
  { value: 'global', label: 'Global', icon: Globe, description: 'All users' },
  { value: 'role', label: 'Role', icon: Users, description: 'Specific roles' },
  { value: 'audience', label: 'Audience', icon: MapPin, description: 'Geographic/cohort' },
  { value: 'space', label: 'Space', icon: Building, description: 'Makerspace-specific' },
  { value: 'user', label: 'User', icon: User, description: 'Individual users' }
];

const FLAG_TYPES = [
  { value: 'boolean', label: 'Boolean', icon: ToggleLeft, description: 'On/Off switch' },
  { value: 'percentage', label: 'Percentage', icon: Percent, description: 'Gradual rollout' },
  { value: 'multivariate', label: 'Multivariate', icon: Sliders, description: 'A/B testing' },
  { value: 'config', label: 'Config', icon: Database, description: 'Configuration value' }
];

// Mock data - in real app, this would come from API
const mockFlags: FlagDefinition[] = [
  {
    key: 'store.upload.enabled',
    namespace: 'store',
    area: 'upload',
    feature: 'enabled',
    type: 'boolean',
    scope: 'global',
    defaultValue: true,
    rolloutState: 'on',
    description: 'STL upload feature (kill switch)',
    owner: 'store',
    enabled: true,
    lastUpdated: '2024-01-15T10:30:00Z'
  },
  {
    key: 'store.catalog.compare_drawer',
    namespace: 'store',
    area: 'catalog',
    feature: 'compare_drawer',
    type: 'percentage',
    scope: 'global',
    defaultValue: false,
    rolloutState: 'beta',
    description: 'In-page product comparison',
    owner: 'store',
    percentageRollout: 25,
    lastUpdated: '2024-01-14T15:45:00Z'
  },
  {
    key: 'cave.analytics.enabled',
    namespace: 'cave',
    area: 'analytics',
    feature: 'enabled',
    type: 'boolean',
    scope: 'space',
    defaultValue: false,
    rolloutState: 'internal',
    description: 'Utilization & SLA dashboards',
    owner: 'cave',
    enabled: false,
    lastUpdated: '2024-01-13T09:15:00Z'
  },
  {
    key: 'global.announcements.banner',
    namespace: 'global',
    area: 'announcements',
    feature: 'banner',
    type: 'config',
    scope: 'global',
    defaultValue: null,
    rolloutState: 'on',
    description: 'Sitewide banner text/level',
    owner: 'platform',
    configValue: 'New features available!',
    lastUpdated: '2024-01-12T14:20:00Z'
  }
];

export default function FeatureFlagsAdmin() {
  const { user } = useAuth();
  const [flags, setFlags] = useState<FlagDefinition[]>(mockFlags);
  const [filteredFlags, setFilteredFlags] = useState<FlagDefinition[]>(mockFlags);
  const [searchTerm, setSearchTerm] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState('all');
  const [stateFilter, setStateFilter] = useState('all');
  const [selectedFlag, setSelectedFlag] = useState<FlagDefinition | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Check if user is superadmin
  if (user?.role !== 'super_admin') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
          <p className="text-gray-600">Only super administrators can access feature flags.</p>
        </div>
      </div>
    );
  }

  // Filter flags based on search and filters
  useEffect(() => {
    let filtered = flags;

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(flag =>
        flag.key.toLowerCase().includes(searchTerm.toLowerCase()) ||
        flag.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Namespace filter
    if (namespaceFilter !== 'all') {
      filtered = filtered.filter(flag => flag.namespace === namespaceFilter);
    }

    // State filter
    if (stateFilter !== 'all') {
      filtered = filtered.filter(flag => flag.rolloutState === stateFilter);
    }

    setFilteredFlags(filtered);
  }, [flags, searchTerm, namespaceFilter, stateFilter]);

  const updateFlag = (flagKey: string, updates: Partial<FlagDefinition>) => {
    setFlags(prev => prev.map(flag =>
      flag.key === flagKey
        ? { ...flag, ...updates, lastUpdated: new Date().toISOString() }
        : flag
    ));
  };

  const toggleFlag = (flagKey: string) => {
    const flag = flags.find(f => f.key === flagKey);
    if (!flag) return;

    const newState = flag.rolloutState === 'on' ? 'off' : 'on';
    updateFlag(flagKey, { rolloutState: newState });
  };

  const namespaces = Array.from(new Set(flags.map(f => f.namespace)));

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Feature Flags</h1>
              <p className="text-gray-600 mt-2">
                Manage feature rollouts across the MakrX ecosystem
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </button>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-makrx-teal hover:bg-makrx-teal-dark">
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </button>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow mb-6 p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search flags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full rounded-md border-gray-300 shadow-sm focus:border-makrx-teal focus:ring-makrx-teal"
              />
            </div>

            {/* Namespace filter */}
            <select
              value={namespaceFilter}
              onChange={(e) => setNamespaceFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-makrx-teal focus:ring-makrx-teal"
            >
              <option value="all">All Namespaces</option>
              {namespaces.map(ns => (
                <option key={ns} value={ns}>{ns}</option>
              ))}
            </select>

            {/* State filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="rounded-md border-gray-300 shadow-sm focus:border-makrx-teal focus:ring-makrx-teal"
            >
              <option value="all">All States</option>
              {ROLLOUT_STATES.map(state => (
                <option key={state.value} value={state.value}>{state.label}</option>
              ))}
            </select>

            {/* Stats */}
            <div className="text-sm text-gray-500">
              Showing {filteredFlags.length} of {flags.length} flags
            </div>
          </div>
        </div>

        {/* Flags List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Feature Flags</h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredFlags.map((flag) => (
              <FlagRow
                key={flag.key}
                flag={flag}
                onToggle={() => toggleFlag(flag.key)}
                onEdit={() => {
                  setSelectedFlag(flag);
                  setIsEditModalOpen(true);
                }}
                onUpdate={(updates) => updateFlag(flag.key, updates)}
              />
            ))}
          </div>
        </div>

        {/* Edit Modal */}
        {isEditModalOpen && selectedFlag && (
          <FlagEditModal
            flag={selectedFlag}
            onSave={(updates) => {
              updateFlag(selectedFlag.key, updates);
              setIsEditModalOpen(false);
              setSelectedFlag(null);
            }}
            onClose={() => {
              setIsEditModalOpen(false);
              setSelectedFlag(null);
            }}
          />
        )}
      </div>
    </div>
  );
}

// Individual flag row component
function FlagRow({ 
  flag, 
  onToggle, 
  onEdit, 
  onUpdate 
}: { 
  flag: FlagDefinition; 
  onToggle: () => void; 
  onEdit: () => void;
  onUpdate: (updates: Partial<FlagDefinition>) => void;
}) {
  const stateConfig = ROLLOUT_STATES.find(s => s.value === flag.rolloutState);
  const scopeConfig = SCOPES.find(s => s.value === flag.scope);
  const typeConfig = FLAG_TYPES.find(t => t.value === flag.type);

  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            {/* Toggle */}
            <button
              onClick={onToggle}
              className={`p-1 rounded-md ${
                flag.rolloutState === 'on' ? 'text-green-600' : 'text-gray-400'
              }`}
            >
              {flag.rolloutState === 'on' ? (
                <ToggleRight className="w-6 h-6" />
              ) : (
                <ToggleLeft className="w-6 h-6" />
              )}
            </button>

            {/* Flag info */}
            <div className="flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-sm font-medium text-gray-900 font-mono">
                  {flag.key}
                </h3>
                <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${stateConfig?.color} text-white`}>
                  {stateConfig?.label}
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                  {typeConfig?.label}
                </span>
              </div>
              <p className="text-sm text-gray-600 mt-1">{flag.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>Owner: {flag.owner}</span>
                <span>Scope: {scopeConfig?.label}</span>
                {flag.lastUpdated && (
                  <span>Updated: {new Date(flag.lastUpdated).toLocaleDateString()}</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2">
          {/* Percentage rollout for percentage flags */}
          {flag.type === 'percentage' && (
            <div className="flex items-center space-x-2">
              <input
                type="range"
                min="0"
                max="100"
                value={flag.percentageRollout || 0}
                onChange={(e) => onUpdate({ percentageRollout: parseInt(e.target.value) })}
                className="w-20"
              />
              <span className="text-sm text-gray-600 w-8">
                {flag.percentageRollout || 0}%
              </span>
            </div>
          )}

          {/* Config value for config flags */}
          {flag.type === 'config' && (
            <div className="max-w-32">
              <input
                type="text"
                value={flag.configValue || ''}
                onChange={(e) => onUpdate({ configValue: e.target.value })}
                className="text-sm rounded-md border-gray-300 shadow-sm focus:border-makrx-teal focus:ring-makrx-teal"
                placeholder="Config value"
              />
            </div>
          )}

          {/* Edit button */}
          <button
            onClick={onEdit}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Edit modal component
function FlagEditModal({ 
  flag, 
  onSave, 
  onClose 
}: { 
  flag: FlagDefinition; 
  onSave: (updates: Partial<FlagDefinition>) => void;
  onClose: () => void;
}) {
  const [editedFlag, setEditedFlag] = useState(flag);

  const handleSave = () => {
    onSave(editedFlag);
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Edit Feature Flag</h2>
          <p className="text-sm text-gray-600 font-mono">{flag.key}</p>
        </div>

        <div className="px-6 py-4 space-y-6">
          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Description</label>
            <textarea
              value={editedFlag.description}
              onChange={(e) => setEditedFlag(prev => ({ ...prev, description: e.target.value }))}
              rows={2}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-makrx-teal focus:ring-makrx-teal"
            />
          </div>

          {/* Rollout State */}
          <div>
            <label className="block text-sm font-medium text-gray-700">Rollout State</label>
            <select
              value={editedFlag.rolloutState}
              onChange={(e) => setEditedFlag(prev => ({ ...prev, rolloutState: e.target.value as any }))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-makrx-teal focus:ring-makrx-teal"
            >
              {ROLLOUT_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label} - {state.description}
                </option>
              ))}
            </select>
          </div>

          {/* Percentage Rollout */}
          {editedFlag.type === 'percentage' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Percentage Rollout: {editedFlag.percentageRollout || 0}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={editedFlag.percentageRollout || 0}
                onChange={(e) => setEditedFlag(prev => ({ ...prev, percentageRollout: parseInt(e.target.value) }))}
                className="mt-1 block w-full"
              />
            </div>
          )}

          {/* Config Value */}
          {editedFlag.type === 'config' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Config Value</label>
              <input
                type="text"
                value={editedFlag.configValue || ''}
                onChange={(e) => setEditedFlag(prev => ({ ...prev, configValue: e.target.value }))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-makrx-teal focus:ring-makrx-teal"
                placeholder="Enter configuration value"
              />
            </div>
          )}

          {/* Role Targeting */}
          {editedFlag.scope === 'role' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Enabled for Roles</label>
              <div className="mt-2 space-y-2">
                {['user', 'provider', 'makerspace_admin', 'store_admin', 'superadmin'].map(role => (
                  <label key={role} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={editedFlag.enabledForRoles?.includes(role) || false}
                      onChange={(e) => {
                        const roles = editedFlag.enabledForRoles || [];
                        if (e.target.checked) {
                          setEditedFlag(prev => ({ 
                            ...prev, 
                            enabledForRoles: [...roles, role] 
                          }));
                        } else {
                          setEditedFlag(prev => ({ 
                            ...prev, 
                            enabledForRoles: roles.filter(r => r !== role) 
                          }));
                        }
                      }}
                      className="rounded border-gray-300 text-makrx-teal focus:ring-makrx-teal"
                    />
                    <span className="ml-2 text-sm text-gray-700">{role}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-makrx-teal hover:bg-makrx-teal-dark"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
