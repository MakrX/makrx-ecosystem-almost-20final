import { Wrench, Calendar, Settings, Play, Pause, AlertTriangle } from 'lucide-react';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { FeatureGate, withFeatureFlag, FeatureFlagBadge, useFeatureAccess } from '../components/FeatureGate';

export default function Equipment() {
  const { equipment } = useMakerspace();
  const maintenanceAccess = useFeatureAccess('equipment.maintenance_mode');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Wrench className="w-8 h-8" />
          Equipment Management
          <FeatureFlagBadge featureKey="equipment.reservation_system" />
        </h1>
        <p className="text-muted-foreground mt-1">
          Monitor and reserve makerspace equipment
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {equipment.map((item) => (
          <div key={item.id} className="makrcave-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{item.name}</h3>
                <p className="text-sm text-muted-foreground">{item.location}</p>
              </div>
              <span className={`makrcave-status-${item.status}`}>
                {item.status.replace('_', ' ')}
              </span>
            </div>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Type:</span>
                <span className="capitalize">{item.type.replace('_', ' ')}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Last Maintenance:</span>
                <span>{item.lastMaintenance}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 makrcave-btn-primary text-sm">
                <Calendar className="w-4 h-4 mr-1" />
                Reserve
              </button>
              <button className="makrcave-btn-secondary text-sm">
                <Settings className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
