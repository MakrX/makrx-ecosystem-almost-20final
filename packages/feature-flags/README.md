# MakrX Feature Flags System

A comprehensive feature flag system for the MakrX ecosystem implementing the complete specification with namespace-based organization, multiple rollout strategies, and full React/backend integration.

## 🚀 Features

- **Consistent Naming**: `<namespace>.<area>.<feature>[.<variant>]` format
- **Multiple Scopes**: global, role, audience, space, user targeting
- **Multiple Types**: boolean, percentage, multivariate, config flags
- **Rollout States**: off → internal → beta → on → remove lifecycle
- **React Integration**: Hooks and components for UI control
- **Backend Protection**: API guards and decorators
- **Admin Interface**: Full-featured management UI
- **Fail-Safe Defaults**: Always degrade gracefully

## 📋 Quick Start

### 1. Install the Package

```bash
npm install @makrx/feature-flags
```

### 2. Setup React Provider

```tsx
import { FeatureFlagProvider } from '@makrx/feature-flags';

function App() {
  const flagContext = {
    userId: user?.id,
    roles: user?.roles || [],
    makerspaceId: currentSpace?.id,
    environment: 'production'
  };

  return (
    <FeatureFlagProvider initialContext={flagContext}>
      <YourApp />
    </FeatureFlagProvider>
  );
}
```

### 3. Use Flags in Components

```tsx
import { useBooleanFlag, FlagGuard, ModuleGuard } from '@makrx/feature-flags';

function MyComponent() {
  // Simple boolean flag
  const uploadsEnabled = useBooleanFlag('store.upload.enabled');
  
  return (
    <div>
      {/* Hide/show based on flag */}
      <FlagGuard flagKey="store.catalog.kits">
        <ProductKitsSection />
      </FlagGuard>
      
      {/* Module with coming soon for internal users */}
      <ModuleGuard 
        flagKey="cave.analytics.enabled" 
        moduleName="Analytics Dashboard"
      >
        <AnalyticsDashboard />
      </ModuleGuard>
      
      {/* Navigation link */}
      <NavLinkGuard flagKey="org.links.store" href="/store">
        Visit Store
      </NavLinkGuard>
    </div>
  );
}
```

### 4. Protect Backend Routes

```python
from app.core.feature_flags import require_flag, store_feature_required

@router.get("/catalog")
@store_feature_required("store.catalog.enabled")
async def get_catalog():
    return {"products": [...]}

@router.post("/upload")
@require_flag("store.upload.enabled")
async def upload_file():
    # Returns 404 if disabled, 503 if maintenance mode
    return {"success": True}
```

## 🏗️ Architecture

### Naming Convention

All flags follow the pattern: `<namespace>.<area>.<feature>[.<variant>]`

**Namespaces:**
- `global` - Cross-cutting features
- `org` - MakrX.org (gateway & profiles)
- `cave` - MakrCave (makerspace portal)
- `store` - MakrX.Store (e-commerce)

**Examples:**
```
store.upload.enabled
cave.inventory.low_stock_alerts
org.forum.enabled
global.announcements.banner
```

### Flag Types

1. **Boolean** - Simple on/off switches
2. **Percentage** - Gradual rollouts (0-100%)
3. **Multivariate** - A/B testing with weighted variants
4. **Config** - Typed configuration values

### Scopes

1. **Global** - All users
2. **Role** - Specific user roles (admin, provider, etc.)
3. **Audience** - Geographic or cohort targeting
4. **Space** - Makerspace-specific features
5. **User** - Individual user targeting

### Rollout States

1. **Off** - Feature disabled
2. **Internal** - Only internal team (admins)
3. **Beta** - Limited rollout (percentage/targeting)
4. **On** - Fully enabled
5. **Remove** - Marked for code cleanup

## 📝 Flag Definitions

### Org (MakrX.org) Flags

```typescript
org.links.makrcave          // Show MakrCave link
org.links.store            // Show Store link  
org.profile.edit           // Profile edit access
org.docs.public            // Public documentation
org.status.enabled         // Status page
org.forum.enabled          // Community forum
org.billing.unified        // Central billing view
```

### Cave (MakrCave) Flags

```typescript
// Spaces & Membership
cave.spaces.public_pages         // Public space profiles
cave.memberships.invite_only     // Admin-only member additions
cave.notifications.enabled      // Email/SMS notifications

// Equipment & Reservations  
cave.equipment.enabled           // Equipment module
cave.reservations.enabled        // Booking system
cave.reservations.paid_usage     // Paid reservations
cave.reservations.approval_flow  // Manual approval
cave.maintenance.enabled         // Maintenance tickets

// Inventory & Projects
cave.inventory.enabled           // Inventory tracking
cave.projects.enabled           // Project management
cave.bom.enabled                // BOM editor
cave.skills.enabled             // Skills & badges

// Providers & Jobs
cave.providers.enabled          // Provider profiles
cave.jobs.enabled              // Job board
cave.analytics.enabled         // Analytics dashboard
```

### Store (MakrX.Store) Flags

```typescript
// Catalog & Discovery
store.catalog.enabled           // Product catalog
store.catalog.compare_drawer    // Product comparison
store.catalog.kits             // Curated kits
store.reviews.enabled          // Product reviews

// Cart & Checkout
store.cart.enabled             // Shopping cart
store.checkout.one_page        // One-page checkout
store.checkout.cod             // Cash on delivery
store.coupons.enabled          // Discount codes

// Services (3D Printing)
store.upload.enabled           // STL uploads (kill switch)
store.upload.preview_3d        // 3D preview viewer
store.quote.heuristic          // Quote engine
store.service_orders.enabled   // Order creation

// Account Features
store.account.wishlist         // Wishlist feature
store.account.subscriptions    // Subscription management
store.admin.products           // Admin product management
```

### Global Flags

```typescript
global.announcements.banner    // Sitewide announcements
global.search.unified         // Cross-site search
global.chatbot.enabled        // Help widget
global.auth.invite_only       // Registration control
```

## 🎯 Usage Patterns

### Kill Switches (Ops Safety)

```tsx
// React Component
function UploadForm() {
  const { enabled, maintenance } = useKillSwitch('store.upload.enabled');
  
  if (maintenance) {
    return <MaintenanceNotice message="Uploads temporarily disabled" />;
  }
  
  return <FileUploadComponent />;
}
```

```python
# Backend Route
@router.post("/upload")
async def upload_file(request: Request):
    context = build_flag_context(request)
    
    if not KillSwitch.check_upload_enabled(context):
        return feature_disabled_response("Upload", maintenance=True)
    
    # Process upload...
```

### Gradual Rollouts

```tsx
// 25% rollout
const compareEnabled = usePercentageFlag('store.catalog.compare_drawer');

// Config-driven rollout
const rolloutPercentage = useConfigFlag('store.checkout.rollout_percent', 50);
```

### A/B Testing

```tsx
function SearchResults() {
  const { variant, trackExposure } = useExperiment('store.search.results_layout');
  
  useEffect(() => {
    trackExposure(); // Analytics event
  }, [trackExposure]);
  
  return (
    <Experiment 
      flagKey="store.search.results_layout"
      variants={{
        grid: <GridLayout />,
        list: <ListLayout />
      }}
    />
  );
}
```

### Space-Specific Features

```tsx
function MakerspaceFeatures() {
  const { enabled } = useSpaceFlag('cave.equipment.enabled', makerspaceId);
  
  return (
    <ModuleGuard 
      flagKey="cave.equipment.enabled"
      moduleName="Equipment Management"
    >
      <EquipmentDashboard />
    </ModuleGuard>
  );
}
```

### Geographic Targeting

```tsx
function PaymentOptions() {
  const { enabled } = useGeoFlag('store.checkout.cod', 'IN', '110001');
  
  return (
    <div>
      <PaymentMethod type="card" />
      <PaymentMethod type="upi" />
      {enabled && <PaymentMethod type="cod" />}
    </div>
  );
}
```

## 🛡️ Security & Best Practices

### UI Rules

1. **Hide when disabled** - Links/buttons disappear completely
2. **Coming soon for internal** - Show placeholder for admin users
3. **Graceful degradation** - Always provide fallbacks

### API Rules

1. **404 for public** - Pretend endpoints don't exist
2. **403 for authenticated** - Clear permission denial
3. **503 for maintenance** - Service temporarily unavailable
4. **Never partial success** - All-or-nothing responses

### Implementation Guidelines

```tsx
// ✅ Good - Hide completely when disabled
<FlagGuard flagKey="store.wishlist.enabled">
  <WishlistButton />
</FlagGuard>

// ❌ Bad - Showing disabled state
<WishlistButton disabled={!wishlistEnabled} />

// ✅ Good - Show coming soon for internal users
<ModuleGuard 
  flagKey="cave.analytics.enabled" 
  moduleName="Analytics"
>
  <AnalyticsDashboard />
</ModuleGuard>

// ✅ Good - Fail-safe defaults
const uploadsEnabled = useBooleanFlag('store.upload.enabled', true);
```

## 🔧 Backend Integration

### Route Protection

```python
# Simple feature guard
@require_flag("store.catalog.enabled")
async def get_catalog():
    pass

# Admin-only feature  
@admin_feature_required("store.admin.reports")
async def get_reports():
    pass

# Space-specific feature
@require_space_flag("cave.equipment.enabled", makerspace_id)
async def get_equipment():
    pass
```

### Context Building

```python
def build_flag_context(request: Request, user_info: dict = None) -> FlagContext:
    return FlagContext(
        user_id=user_info.get("user_id") if user_info else None,
        roles=user_info.get("roles", []) if user_info else [],
        makerspace_id=user_info.get("makerspace_id"),
        country=request.headers.get("X-Country"),
        pincode=request.headers.get("X-Pincode"),
        environment="production"
    )
```

### Response Patterns

```python
# Feature disabled (public users)
return JSONResponse(
    status_code=404,
    content={"error": "Not Found"}
)

# Feature not available (authenticated users)  
return JSONResponse(
    status_code=403,
    content={
        "error": "Feature Not Available",
        "message": "This feature is not available for your account"
    }
)

# Maintenance mode
return JSONResponse(
    status_code=503,
    content={
        "error": "Service Temporarily Unavailable",
        "retry_after": 3600
    }
)
```

## 📊 Admin Interface

Access the admin interface at `/admin/feature-flags` (superadmin only):

- **Real-time flag management** - Toggle flags instantly
- **Percentage rollouts** - Drag slider to adjust rollout
- **Targeting controls** - Configure role/geo targeting  
- **Audit trail** - See who changed what when
- **Bulk operations** - Update multiple flags
- **Search & filtering** - Find flags quickly

## 🔄 Rollout Playbook

### New Feature Launch

1. **Off** - Develop and test with flag disabled
2. **Internal** - Enable for team testing (1-2 days)  
3. **Beta** - Gradual rollout (10% → 50% → 100%)
4. **On** - Fully enabled for all users
5. **Remove** - Clean up flag code after 2-4 weeks

### Kill Switch Pattern

```typescript
// Always keep kill switches for critical features
store.upload.enabled        // File uploads
store.payments.enabled      // Payment processing  
cave.jobs.publish_enabled   // Job publishing
```

### Experiments

```typescript
// Time-boxed experiments with clear success metrics
store.search.results_layout     // Grid vs List (2 weeks)
store.product.above_the_fold    // Brief vs Detailed (1 week)
```

## 🧪 Testing

```tsx
import { render } from '@testing-library/react';
import { FeatureFlagProvider } from '@makrx/feature-flags';

function renderWithFlags(component, flagOverrides = {}) {
  const context = {
    userId: 'test-user',
    roles: ['user'],
    environment: 'test',
    ...flagOverrides
  };

  return render(
    <FeatureFlagProvider initialContext={context}>
      {component}
    </FeatureFlagProvider>
  );
}

test('shows wishlist when enabled', () => {
  const { getByText } = renderWithFlags(
    <MyComponent />,
    { customFlags: [{ key: 'store.wishlist.enabled', enabled: true }] }
  );
  
  expect(getByText('Add to Wishlist')).toBeInTheDocument();
});
```

## 📈 Analytics Integration

The system automatically tracks flag exposures for analytics:

```typescript
// Experiment exposure tracking
const { variant, trackExposure } = useExperiment('my.experiment');

useEffect(() => {
  trackExposure(); // Sends analytics event
}, [trackExposure]);
```

Events emitted:
- `Feature Flag Evaluated` - Every flag check
- `Experiment Exposed` - A/B test assignments
- `Flag Configuration Changed` - Admin updates

## 🚀 Production Deployment

1. **Environment Variables**
   ```bash
   FEATURE_FLAGS_REDIS_URL=redis://localhost:6379
   FEATURE_FLAGS_CACHE_TTL=300
   ```

2. **Database Setup**
   ```sql
   CREATE TABLE feature_flags (
     key VARCHAR(255) PRIMARY KEY,
     definition JSONB NOT NULL,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );
   ```

3. **Monitoring**
   - Flag evaluation performance
   - Cache hit rates  
   - Error rates by flag
   - Rollout progression metrics

## 📚 Additional Resources

- [Feature Flag Best Practices](./docs/best-practices.md)
- [Rollout Strategies Guide](./docs/rollout-strategies.md)
- [Troubleshooting Guide](./docs/troubleshooting.md)
- [API Reference](./docs/api-reference.md)

## 🤝 Contributing

1. Follow the naming convention: `namespace.area.feature[.variant]`
2. Always provide fail-safe defaults
3. Document rollout strategy and success criteria
4. Include tests for both enabled/disabled states
5. Update this README with new flags

## 📄 License

MIT © MakrX Team
