import { createContext, useContext, useState, ReactNode } from 'react';

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

interface InventoryItem {
  id: string;
  name: string;
  category: 'filament' | 'resin' | 'tools' | 'electronics' | 'materials' | 'consumables';
  quantity: number;
  unit: string;
  lowStockThreshold: number;
  price?: number;
  supplier?: string;
  lastRestocked?: string;
  makerspaceId: string;
  sku?: string;
  location?: string;
  description?: string;
  isScanned?: boolean;
}

interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerName: string;
  status: 'draft' | 'active' | 'completed' | 'archived';
  createdAt: string;
  updatedAt: string;
  collaborators: string[];
  bomItems?: BOMItem[];
}

interface BOMItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCost?: number;
  supplier?: string;
  inventoryItemId?: string;
  makrxStoreProductId?: string;
}

interface Reservation {
  id: string;
  equipmentId: string;
  equipmentName: string;
  userId: string;
  userName: string;
  startTime: string;
  endTime: string;
  status: 'pending' | 'approved' | 'active' | 'completed' | 'cancelled';
  purpose?: string;
}

interface MakerspaceStats {
  totalMembers: number;
  activeProjects: number;
  equipmentUtilization: number;
  lowStockItems: number;
  pendingReservations: number;
  completedProjectsThisMonth: number;
}

interface MakerspaceContextType {
  stats: MakerspaceStats;
  equipment: Equipment[];
  inventory: InventoryItem[];
  projects: Project[];
  reservations: Reservation[];
  updateStats: () => void;
  addInventoryItem: (item: Omit<InventoryItem, 'id'>) => void;
  updateInventoryItem: (id: string, item: Partial<InventoryItem>) => void;
  updateInventoryQuantity: (id: string, quantity: number) => void;
  createReservation: (reservation: Omit<Reservation, 'id'>) => void;
  updateEquipmentStatus: (id: string, status: Equipment['status']) => void;
}

const MakerspaceContext = createContext<MakerspaceContextType | undefined>(undefined);

export function MakerspaceProvider({ children }: { children: ReactNode }) {
  // Mock data - would come from API in real app
  const [stats] = useState<MakerspaceStats>({
    totalMembers: 45,
    activeProjects: 12,
    equipmentUtilization: 68,
    lowStockItems: 3,
    pendingReservations: 5,
    completedProjectsThisMonth: 8
  });

  const [equipment] = useState<Equipment[]>([
    {
      id: 'eq-1',
      name: 'Prusa i3 MK3S+',
      type: 'printer_3d',
      status: 'available',
      location: 'Station A1',
      lastMaintenance: '2024-01-15'
    },
    {
      id: 'eq-2',
      name: 'Ultimaker S3',
      type: 'printer_3d',
      status: 'in_use',
      location: 'Station A2',
      lastMaintenance: '2024-01-10'
    },
    {
      id: 'eq-3',
      name: 'Glowforge Pro',
      type: 'laser_cutter',
      status: 'available',
      location: 'Station B1',
      lastMaintenance: '2024-01-20'
    },
    {
      id: 'eq-4',
      name: 'Shapeoko 4',
      type: 'cnc_machine',
      status: 'maintenance',
      location: 'Station C1',
      lastMaintenance: '2023-12-15'
    }
  ]);

  const [inventory] = useState<InventoryItem[]>([
    {
      id: 'inv-1',
      name: 'PLA Filament - White',
      category: 'filament',
      quantity: 2,
      unit: 'kg',
      lowStockThreshold: 3,
      price: 25.99,
      supplier: 'Hatchbox',
      lastRestocked: '2024-01-10'
    },
    {
      id: 'inv-2',
      name: 'PETG Filament - Clear',
      category: 'filament',
      quantity: 5,
      unit: 'kg',
      lowStockThreshold: 2,
      price: 32.99,
      supplier: 'Overture',
      lastRestocked: '2024-01-15'
    },
    {
      id: 'inv-3',
      name: 'Arduino Uno R3',
      category: 'electronics',
      quantity: 8,
      unit: 'pcs',
      lowStockThreshold: 5,
      price: 28.50,
      supplier: 'Arduino',
      lastRestocked: '2024-01-05'
    },
    {
      id: 'inv-4',
      name: 'Acrylic Sheet 3mm',
      category: 'materials',
      quantity: 1,
      unit: 'sheets',
      lowStockThreshold: 3,
      price: 15.99,
      supplier: 'Local Plastics',
      lastRestocked: '2023-12-20'
    }
  ]);

  const [projects] = useState<Project[]>([
    {
      id: 'proj-1',
      name: 'IoT Weather Station',
      description: 'Building a connected weather monitoring system',
      ownerId: 'user-1',
      ownerName: 'John Maker',
      status: 'active',
      createdAt: '2024-01-10',
      updatedAt: '2024-01-25',
      collaborators: ['user-2', 'user-3']
    },
    {
      id: 'proj-2',
      name: 'Custom Phone Stand',
      description: '3D printed adjustable phone stand',
      ownerId: 'user-4',
      ownerName: 'Sarah Designer',
      status: 'completed',
      createdAt: '2024-01-05',
      updatedAt: '2024-01-20',
      collaborators: []
    }
  ]);

  const [reservations] = useState<Reservation[]>([
    {
      id: 'res-1',
      equipmentId: 'eq-1',
      equipmentName: 'Prusa i3 MK3S+',
      userId: 'user-1',
      userName: 'John Maker',
      startTime: '2024-01-27T10:00:00Z',
      endTime: '2024-01-27T14:00:00Z',
      status: 'approved',
      purpose: 'Weather station enclosure'
    },
    {
      id: 'res-2',
      equipmentId: 'eq-3',
      equipmentName: 'Glowforge Pro',
      userId: 'user-2',
      userName: 'Mike Creator',
      startTime: '2024-01-27T15:00:00Z',
      endTime: '2024-01-27T16:30:00Z',
      status: 'pending',
      purpose: 'Acrylic case panels'
    }
  ]);

  const updateStats = () => {
    // Would refresh stats from API
    console.log('Updating stats...');
  };

  const addInventoryItem = (item: Omit<InventoryItem, 'id'>) => {
    // Would call API to add item
    console.log('Adding inventory item:', item);
  };

  const updateInventoryItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory(prev => prev.map(item =>
      item.id === id ? { ...item, ...updates } : item
    ));
    console.log('Updated inventory item:', id, updates);
  };

  const updateInventoryQuantity = (id: string, quantity: number) => {
    updateInventoryItem(id, { quantity });
  };

  const createReservation = (reservation: Omit<Reservation, 'id'>) => {
    // Would call API to create reservation
    console.log('Creating reservation:', reservation);
  };

  const updateEquipmentStatus = (id: string, status: Equipment['status']) => {
    // Would call API to update equipment status
    console.log('Updating equipment status:', id, status);
  };

  return (
    <MakerspaceContext.Provider value={{
      stats,
      equipment,
      inventory,
      projects,
      reservations,
      updateStats,
      addInventoryItem,
      updateInventoryItem,
      updateInventoryQuantity,
      createReservation,
      updateEquipmentStatus
    }}>
      {children}
    </MakerspaceContext.Provider>
  );
}

export function useMakerspace() {
  const context = useContext(MakerspaceContext);
  if (context === undefined) {
    throw new Error('useMakerspace must be used within a MakerspaceProvider');
  }
  return context;
}
