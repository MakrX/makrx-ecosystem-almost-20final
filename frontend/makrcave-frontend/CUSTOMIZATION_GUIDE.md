# 🔧 MakrCave Customization Guide

## 📋 Overview

This guide explains how to customize MakrCave functionality by editing specific lines of code. Each section includes file paths, line numbers, and exact modifications you can make.

## 🎨 Visual Customization

### Theme Colors

**File**: `frontend/makrcave-frontend/tailwind.config.ts`
**Lines**: 12-20

```typescript
// Edit these values to change the color scheme
colors: {
  'makrx-blue': '#1E40AF',      // Line 13 - Main blue color
  'makrx-teal': '#0D9488',      // Line 14 - Accent teal color
  'makrx-teal-light': '#14B8A6', // Line 15 - Light teal variant
  'makrx-gray': '#6B7280',      // Line 16 - Gray color
  'makrx-dark': '#1F2937',      // Line 17 - Dark color
}
```

### Logo and Branding

**File**: `frontend/makrcave-frontend/pages/Login.tsx`
**Lines**: 52-54, 57

```typescript
// Line 52-54 - Change the login page icon
<div className="w-16 h-16 bg-makrx-teal rounded-2xl flex items-center justify-center">
  <Building2 className="w-8 h-8 text-white" /> {/* Change Building2 to any Lucide icon */}
</div>

// Line 57 - Change the main heading text
<span className="text-makrx-teal">MakrCave</span> {/* Change "MakrCave" to your brand name */}
```

**File**: `frontend/makrcave-frontend/components/Header.tsx`
**Lines**: Look for logo references

### Navigation Menu

**File**: `frontend/makrcave-frontend/App.tsx`
**Lines**: Look for route definitions

```typescript
// Add new routes by inserting between existing routes
<Route path="/portal/your-new-page" element={<YourNewComponent />} />
```

## 🔐 Authentication Customization

### User Registration Fields

**File**: `frontend/makrcave-frontend/services/authService.ts`
**Lines**: 37-44

```typescript
// Add or remove registration fields
export interface RegisterData {
  email: string;               // Line 38 - Required field
  username: string;            // Line 39 - Required field  
  password: string;            // Line 40 - Required field
  firstName?: string;          // Line 41 - Optional field
  lastName?: string;           // Line 42 - Optional field
  makerspaceId?: string;       // Line 43 - Optional field
  // Add new fields here, mark as optional with ?
}
```

### Password Requirements

**File**: `frontend/makrcave-frontend/components/Register.tsx` (when created)
**Look for password validation logic**

```typescript
// Example password validation (add to registration form)
const validatePassword = (password: string) => {
  return password.length >= 8 &&        // Change minimum length
         /[A-Z]/.test(password) &&      // Require uppercase
         /[a-z]/.test(password) &&      // Require lowercase  
         /[0-9]/.test(password);        // Require number
};
```

### Default User Role

**File**: `makrcave-backend/routes/auth.py`
**Look for registration endpoint**

```python
# Change the default role for new users
new_user.role = "maker"  # Change "maker" to any valid role
```

### Session Timeout

**File**: `frontend/makrcave-frontend/services/authService.ts`
**Lines**: 420-421

```typescript
// Line 420-421 - Change token refresh timing
// Refresh token 5 minutes before expiry
const refreshTime = (expiresIn - 300) * 1000; // Change 300 (5 minutes) to your preferred seconds
```

## 🏗️ Feature Toggles

### Dashboard Modules

**File**: `frontend/makrcave-frontend/pages/Dashboard.tsx`
**Look for feature rendering sections**

```typescript
// Example: Hide/show dashboard widgets
{user?.role === 'admin' && <AdminWidget />}           // Line X - Admin-only widget
{showInventory && <InventoryWidget />}                // Line Y - Conditional widget
<EquipmentWidget />                                   // Line Z - Always visible widget
```

### Equipment Features

**File**: `frontend/makrcave-frontend/components/EquipmentCard.tsx`
**Look for feature flags**

```typescript
// Toggle equipment features
const enableReservations = true;        // Line X - Enable/disable reservations
const enableSkillRequirements = true;   // Line Y - Enable/disable skill gates
const enableBilling = true;             // Line Z - Enable/disable billing
```

### Billing Module

**File**: `frontend/makrcave-frontend/contexts/FeatureFlagContext.tsx`

```typescript
// Edit feature flags to enable/disable modules
const defaultFlags = {
  enableBilling: true,          // Line X - Billing module
  enableAnalytics: true,        // Line Y - Analytics module  
  enableMaintenance: true,      // Line Z - Maintenance module
  enableProjects: true,         // Line W - Projects module
};
```

## 📊 Data Display Customization

### Table Pagination

**File**: Any component with tables (look for pagination props)

```typescript
// Change default page sizes and limits
const defaultPageSize = 10;     // Line X - Change default items per page
const pageSizeOptions = [5, 10, 20, 50]; // Line Y - Available page size options
```

### Date Formats

**File**: `frontend/makrcave-frontend/lib/utils.ts`

```typescript
// Add date formatting function
export const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {  // Change 'en-US' to your locale
    year: 'numeric',
    month: 'short',     // Change to 'long', 'numeric', '2-digit'
    day: 'numeric'      // Change to '2-digit'
  });
};
```

### Currency Display

**File**: Look for price/billing components

```typescript
// Change currency formatting
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-US', {  // Change locale
    style: 'currency',
    currency: 'USD'    // Change currency code (EUR, GBP, etc.)
  }).format(amount);
};
```

## 🚨 Access Control Customization

### Role-Based Permissions

**File**: `frontend/makrcave-frontend/config/rolePermissions.ts`

```typescript
// Edit role permissions matrix
export const rolePermissions = {
  super_admin: {
    canManageUsers: true,        // Line X
    canManageSettings: true,     // Line Y
    canViewAnalytics: true,      // Line Z
    // Add new permissions here
  },
  admin: {
    canManageUsers: true,        // Line A
    canManageSettings: false,    // Line B - Change to true/false
    canViewAnalytics: true,      // Line C
  },
  // Add custom roles here
};
```

### API Endpoints

**File**: `frontend/makrcave-frontend/services/apiService.ts`
**Lines**: 4

```typescript
// Change API base URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api'; // Line 4
```

### Component Access Guards

**File**: Any component file

```typescript
// Add role-based component rendering
{user?.role === 'super_admin' && (
  <AdminOnlyComponent />         // Only shows for super admins
)}

{['admin', 'super_admin'].includes(user?.role) && (
  <AdminComponent />             // Shows for any admin level
)}
```

## 🎛️ Makerspace Customization

### Equipment Categories

**File**: Look for equipment management components

```typescript
// Add or modify equipment categories
const equipmentCategories = [
  'Electronics',          // Line X
  'Woodworking',         // Line Y  
  '3D Printing',         // Line Z
  'Textiles',            // Line W - Add new categories here
  'Metalworking',        // Line V
];
```

### Skill Requirements

**File**: `frontend/makrcave-frontend/types/equipment-access.ts`

```typescript
// Modify skill levels and requirements
export type SkillLevel = 'beginner' | 'intermediate' | 'advanced' | 'expert'; // Add/remove levels

export interface SkillRequirement {
  skillName: string;
  requiredLevel: SkillLevel;
  isMandatory: boolean;     // Change default requirement strictness
}
```

### Reservation Time Slots

**File**: Look for reservation/calendar components

```typescript
// Customize available time slots
const timeSlots = [
  '09:00', '10:00', '11:00',    // Morning slots
  '13:00', '14:00', '15:00',    // Afternoon slots  
  '16:00', '17:00', '18:00',    // Evening slots
  // Add or modify time slots
];

const slotDuration = 60; // Minutes per slot - change duration
```

## 📱 UI/UX Customization

### Button Styles

**File**: `frontend/makrcave-frontend/components/ui/button.tsx`

```typescript
// Modify button variants and styles
const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium", {
    variants: {
      variant: {
        default: "bg-makrx-blue text-white hover:bg-makrx-blue/90",  // Change default colors
        secondary: "bg-makrx-gray text-white hover:bg-makrx-gray/90", // Change secondary colors
        // Add custom variants here
      }
    }
  }
);
```

### Loading States

**File**: Any component with loading states

```typescript
// Customize loading indicators
{isLoading ? (
  <div className="animate-pulse">Loading...</div>  // Change loading style/text
) : (
  <YourContent />
)}
```

### Error Messages

**File**: Look for error handling in components

```typescript
// Customize error message display
const errorMessages = {
  networkError: "Unable to connect to server",     // Line X - Customize message
  unauthorized: "Access denied",                   // Line Y - Customize message
  validation: "Please check your input",           // Line Z - Customize message
};
```

## 🔧 Advanced Customizations

### WebSocket Configuration

**File**: Look for real-time features

```typescript
// Change WebSocket connection settings
const wsUrl = 'ws://localhost:8000/ws';  // Change WebSocket URL
const reconnectInterval = 5000;          // Change reconnection time (ms)
const maxReconnectAttempts = 10;         // Change max reconnection attempts
```

### Cache Configuration

**File**: Look for caching logic

```typescript
// Modify data caching behavior
const cacheTimeout = 5 * 60 * 1000;     // Cache timeout in milliseconds
const enableCache = true;                // Enable/disable caching
```

### Analytics Tracking

**File**: Look for analytics components

```typescript
// Configure analytics data collection
const trackUserActions = true;           // Enable/disable user action tracking
const analyticsRetention = 90;           // Days to retain analytics data
```

## ⚠️ Important Notes

### Before Making Changes:
1. **Backup**: Always backup files before editing
2. **Test**: Test changes in development environment first
3. **Dependencies**: Some changes may require updating dependencies
4. **TypeScript**: Ensure TypeScript types match your modifications

### Common Pitfalls:
- **Case Sensitivity**: Component names and imports are case-sensitive
- **Trailing Commas**: Some configurations require trailing commas
- **Environment Variables**: Restart development server after .env changes
- **Type Safety**: TypeScript will show errors if types don't match

### Getting Help:
- **Console Errors**: Check browser developer console for errors
- **TypeScript Errors**: VS Code will show type errors inline
- **Build Errors**: Check terminal output for build failures
- **Runtime Errors**: Use React Developer Tools for debugging

---

**Last Updated**: December 2024  
**Maintainer**: MakrCave Development Team  
**Need Help?** Check the main documentation or contact the development team.
