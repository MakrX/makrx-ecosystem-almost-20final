# 🧪 MakrCave Test Accounts Guide

## 📋 Overview

This document provides test accounts for different user roles in MakrCave. These accounts are pre-configured with appropriate permissions for testing various features. All users now display with @username format for better identification.

## 🔑 Test Account Credentials

### Super Admin Account
- **Email**: `superadmin@makrcave.com`
- **Username**: `@superadmin`
- **Password**: `SuperAdmin2024!`
- **Role**: `super_admin`
- **Display Name**: `Super Admin @superadmin`
- **Permissions**: Full system access
- **Use Case**: Testing administrative features, user management, system settings

### Admin Account
- **Email**: `admin@makrcave.com`
- **Username**: `@sysadmin`
- **Password**: `Admin2024!`
- **Role**: `admin`
- **Display Name**: `System Administrator @sysadmin`
- **Permissions**: Multi-makerspace administrative access
- **Use Case**: Testing admin dashboards, user management, analytics

### Makerspace Manager Account
- **Email**: `manager@makrcave.com`
- **Username**: `@spacemanager`
- **Password**: `Manager2024!`
- **Role**: `makerspace_admin`
- **Display Name**: `Makerspace Manager @spacemanager`
- **Permissions**: Single makerspace management
- **Use Case**: Testing equipment management, member oversight, local settings

### Service Provider Account
- **Email**: `provider@makrcave.com`
- **Username**: `@servicepro`
- **Password**: `Provider2024!`
- **Role**: `service_provider`
- **Display Name**: `Service Provider @servicepro`
- **Permissions**: Service-related access
- **Use Case**: Testing service provider features, maintenance workflows

### Regular Maker Account
- **Email**: `maker@makrcave.com`
- **Username**: `@creativemakr`
- **Password**: `Maker2024!`
- **Role**: `maker`
- **Display Name**: `Regular Maker @creativemakr`
- **Permissions**: Basic member access
- **Use Case**: Testing member features, reservations, projects

## 🎯 Testing Scenarios

### Authentication Testing
```
1. Login with each account type
2. Test password reset functionality
3. Test registration process (creates new maker accounts)
4. Verify role-based navigation and permissions
5. Check @username display in navigation and user interfaces
```

### Username Display Testing
```
✓ Check sidebar user display shows "Name @username"
✓ Verify header shows full "FirstName LastName @username"
✓ Test compact displays show "FirstName @username"
✓ Confirm equipment reservations show full user display
✓ Validate member lists include @username format
```

### Role Permission Testing
```
Super Admin (@superadmin):
✓ Can access all admin panels
✓ Can manage users across all makerspaces
✓ Can modify system settings
✓ Can view all analytics and reports
✓ Can access health monitoring and error logs

Admin (@sysadmin):
✓ Can manage multiple makerspaces
✓ Can access user management
✓ Can view analytics and reports
✓ Can access health monitoring
✓ Limited system configuration access

Makerspace Admin (@spacemanager):
✓ Can manage assigned makerspace inventory
✓ Can oversee member activities
✓ Can schedule equipment maintenance
✓ Can access makerspace-specific analytics

Service Provider (@servicepro):
✓ Can manage service-related tasks
✓ Can access maintenance workflows
✓ Can view assigned equipment status
✓ Limited to service provider functions

Maker (@creativemakr):
✓ Can create and manage personal projects
✓ Can make equipment reservations
✓ Can view inventory availability
✓ Can access personal analytics and billing
```

## 🔧 Development Notes

### Username Implementation
- All user displays now include @username format
- Compact displays show "FirstName @username"
- Full displays show "FirstName LastName @username"
- Fallback to just "@username" if no first/last name
- Username extracted from email if not explicitly set

### Testing Username Display
- Login with any test account
- Check sidebar shows "@username" format
- Navigate to different pages to verify consistent display
- Test equipment reservations and member lists
- Verify proper fallback behavior for users without names

## 🚨 Security Notes

- These are test accounts for development/demo purposes only
- All passwords follow strong security patterns
- Do not use these credentials in production environments
- Usernames are visible in UI for better user identification
- @username format helps distinguish users with similar names
