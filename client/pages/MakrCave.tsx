import { Building2, Calendar, Package, Users, Wrench, Plus } from "lucide-react";

export default function MakrCave() {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-makrx-blue/20 rounded-2xl flex items-center justify-center">
              <Building2 className="w-12 h-12 text-makrx-blue" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-makrx-blue">MakrCave</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your complete makerspace management portal - coming soon with powerful tools 
            for inventory, projects, and community collaboration.
          </p>
        </div>

        {/* Preview Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <Package className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Inventory Management</h3>
            <p className="text-muted-foreground">
              Track materials, tools, and components with real-time updates and automated reordering.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <Calendar className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Workstation Booking</h3>
            <p className="text-muted-foreground">
              Reserve 3D printers, laser cutters, and other equipment with smart scheduling.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <Users className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Member Management</h3>
            <p className="text-muted-foreground">
              Manage memberships, access levels, and skill certifications seamlessly.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <Wrench className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Project Collaboration</h3>
            <p className="text-muted-foreground">
              Share projects, track progress, and collaborate with the maker community.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <Plus className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Service Requests</h3>
            <p className="text-muted-foreground">
              Submit and track service requests, maintenance schedules, and custom jobs.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <Building2 className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Multi-Space Support</h3>
            <p className="text-muted-foreground">
              Manage multiple makerspaces and locations from a single unified dashboard.
            </p>
          </div>
        </div>

        {/* Coming Soon Notice */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="makrx-glass-card">
            <h2 className="text-2xl font-bold mb-4">🚧 Under Development</h2>
            <p className="text-muted-foreground mb-6">
              MakrCave is currently being built with love by the MakrX community. 
              This will be the most comprehensive makerspace management solution ever created.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Real-time inventory tracking with barcode scanning</p>
              <p>• Advanced project management with BOM integration</p>
              <p>• Member portal with skill tracking and certifications</p>
              <p>• Equipment monitoring and predictive maintenance</p>
              <p>• Community marketplace and knowledge sharing</p>
            </div>
            <div className="mt-8">
              <button className="makrx-btn-primary">
                Join Beta Waitlist
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
