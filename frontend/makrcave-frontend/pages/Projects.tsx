import { FolderOpen, Plus, Users, Calendar } from 'lucide-react';
import { useMakerspace } from '../contexts/MakerspaceContext';
import { FeatureGate, FeatureFlagBadge, FeatureInDevelopment } from '../components/FeatureGate';

export default function Projects() {
  const { projects } = useMakerspace();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <FolderOpen className="w-8 h-8" />
            Project Management
            <FeatureFlagBadge featureKey="projects.personal" />
            <FeatureFlagBadge featureKey="projects.collaboration" />
          </h1>
          <p className="text-muted-foreground mt-1">
            Collaborate on projects and manage BOMs
          </p>
        </div>
        <FeatureGate
          featureKey="projects.personal"
          fallback={
            <button disabled className="makrcave-btn-primary flex items-center gap-2 opacity-50 cursor-not-allowed">
              <Plus className="w-4 h-4" />
              New Project (Restricted)
            </button>
          }
        >
          <button className="makrcave-btn-primary flex items-center gap-2">
            <Plus className="w-4 h-4" />
            New Project
          </button>
        </FeatureGate>
      </div>

      {/* Version Control Feature - Under Development */}
      <FeatureGate
        featureKey="projects.version_control"
        showReasonWhenBlocked={true}
        fallback={<FeatureInDevelopment featureName="Project Version Control" />}
      >
        <div className="makrcave-card">
          <h3 className="text-lg font-semibold mb-4">Version Control</h3>
          <p className="text-sm text-muted-foreground">
            Track changes and manage versions of your project files.
          </p>
          <button className="makrcave-btn-primary text-sm mt-4">
            View History
          </button>
        </div>
      </FeatureGate>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="makrcave-card">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-semibold">{project.name}</h3>
                <p className="text-sm text-muted-foreground">by {project.ownerName}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                project.status === 'active' ? 'bg-green-100 text-green-800' :
                project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground mb-4">{project.description}</p>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Created:</span>
                <span>{new Date(project.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Collaborators:</span>
                <span>{project.collaborators.length}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 makrcave-btn-primary text-sm">
                View Project
              </button>
              <FeatureGate
                featureKey="projects.collaboration"
                fallback={
                  <button disabled className="makrcave-btn-secondary text-sm opacity-50 cursor-not-allowed" title="Collaboration features not available">
                    <Users className="w-4 h-4" />
                  </button>
                }
              >
                <button className="makrcave-btn-secondary text-sm">
                  <Users className="w-4 h-4" />
                </button>
              </FeatureGate>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
