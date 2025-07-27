import { Wrench, Calendar, Settings, Play, Pause, AlertTriangle } from 'lucide-react';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { FeatureGate, withFeatureFlag, FeatureFlagBadge, useFeatureAccess } from '../components/FeatureGate';

export default function Equipment() {
  const { equipment } = useMakerspace();
  const maintenanceAccess = useFeatureAccess('equipment.maintenance_mode');
  const addEditAccess = useFeatureAccess('equipment.add_edit');
  const viewAllAccess = useFeatureAccess('equipment.view_all');
  const viewAssignedAccess = useFeatureAccess('equipment.view_assigned');
  const viewCertifiedAccess = useFeatureAccess('equipment.view_certified');

  return (
    <div className="space-y-6">
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
              <FeatureGate
                featureKey="equipment.reservation_system"
                fallback={
                  <button disabled className="flex-1 makrcave-btn-primary text-sm opacity-50 cursor-not-allowed">
                    <Calendar className="w-4 h-4 mr-1" />
                    Reserve (Disabled)
                  </button>
                }
              >
                <button className="flex-1 makrcave-btn-primary text-sm">
                  <Calendar className="w-4 h-4 mr-1" />
                  Reserve
                </button>
              </FeatureGate>

              {addEditAccess.hasAccess && (
                <button className="makrcave-btn-secondary text-sm mr-2">
                  <Settings className="w-4 h-4" />
                </button>
              )}

              {maintenanceAccess.hasAccess ? (
                <button className="makrcave-btn-secondary text-sm" title="Equipment Maintenance">
                  <Play className="w-4 h-4" />
                </button>
              ) : (
                <button disabled className="makrcave-btn-secondary text-sm opacity-50 cursor-not-allowed" title="Maintenance mode requires makerspace admin role">
                  <Pause className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
