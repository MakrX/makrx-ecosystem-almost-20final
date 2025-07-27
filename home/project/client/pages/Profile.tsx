import { User, Award, Settings, Bell } from "lucide-react";

export default function Profile() {
  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="container mx-auto px-6 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-makrx-blue/20 rounded-2xl flex items-center justify-center">
              <User className="w-12 h-12 text-makrx-blue" />
            </div>
          </div>
          <h1 className="text-4xl lg:text-5xl font-display font-bold mb-4">
            <span className="text-makrx-blue">Maker Profile</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Your unified identity across the entire MakrX ecosystem - 
            powered by secure single sign-on and maker-specific features.
          </p>
        </div>

        {/* Profile Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Unified Identity</h3>
            <p className="text-muted-foreground">
              One profile across MakrCave, Store, and Learning Hub with seamless authentication.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Skill Tracking</h3>
            <p className="text-muted-foreground">
              Track your maker journey with badges, certifications, and project accomplishments.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <Settings className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Privacy Controls</h3>
            <p className="text-muted-foreground">
              Granular privacy settings and data control across all MakrX services.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-blue/20 rounded-lg flex items-center justify-center mb-4">
              <Bell className="w-6 h-6 text-makrx-blue" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Smart Notifications</h3>
            <p className="text-muted-foreground">
              Intelligent alerts for orders, bookings, learning progress, and community updates.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-yellow/20 rounded-lg flex items-center justify-center mb-4">
              <User className="w-6 h-6 text-makrx-yellow" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Community Profile</h3>
            <p className="text-muted-foreground">
              Showcase your projects, connect with other makers, and build your reputation.
            </p>
          </div>

          <div className="makrx-glass-card">
            <div className="w-12 h-12 bg-makrx-brown/20 rounded-lg flex items-center justify-center mb-4">
              <Award className="w-6 h-6 text-makrx-brown" />
            </div>
            <h3 className="text-xl font-semibold mb-2">MakrXP System</h3>
            <p className="text-muted-foreground">
              Earn experience points for learning, creating, and contributing to the community.
            </p>
          </div>
        </div>

        {/* SSO Integration Info */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="makrx-glass-card">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold mb-4">Powered by Enterprise-Grade Security</h2>
              <p className="text-muted-foreground">
                Your MakrX profile is secured by Keycloak, the industry-leading identity management platform
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4 text-makrx-blue">Security Features</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Multi-factor authentication support</li>
                  <li>• OAuth 2.0 and OpenID Connect</li>
                  <li>• Session management and security</li>
                  <li>• GDPR and privacy compliance</li>
                  <li>• Advanced threat protection</li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4 text-makrx-yellow">Role Management</h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Maker: Full ecosystem access</li>
                  <li>• Admin: Makerspace management</li>
                  <li>• Service Provider: Store fulfillment</li>
                  <li>• Instructor: Learning content creation</li>
                  <li>• Super Admin: System administration</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Authentication Notice */}
        <div className="max-w-2xl mx-auto text-center">
          <div className="makrx-glass-card">
            <h2 className="text-2xl font-bold mb-4">🔐 Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              The MakrX Profile system will integrate with Keycloak for secure authentication 
              and unified identity management across all ecosystem services.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground mb-8">
              <p>• Single sign-on across all MakrX services</p>
              <p>• Custom MakrX themed login experience</p>
              <p>• Social login integration (GitHub, Google, etc.)</p>
              <p>• Enterprise LDAP/SAML integration support</p>
              <p>• Comprehensive audit logging and compliance</p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="makrx-btn-primary">
                Sign In / Register
              </button>
              <button className="makrx-btn-secondary">
                Enterprise Setup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
