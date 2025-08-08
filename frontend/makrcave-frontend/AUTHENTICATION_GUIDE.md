# 🔐 MakrCave Authentication System - Complete Guide

## 📋 Overview

MakrCave uses a comprehensive JWT-based authentication system with the following features:
- ✅ **Login/Logout** with email and password
- ✅ **User Registration** (new users get "maker" role by default)
- ✅ **Forgot Password** functionality with email reset
- ✅ **Role-based Access Control** (5 different user roles)
- ✅ **Automatic Token Refresh** to maintain sessions
- ✅ **Secure Token Storage** with automatic cleanup

## 🏗️ Architecture

### Backend (FastAPI + JWT)
```
POST /api/auth/login          # User login
POST /api/auth/register       # New user registration  
POST /api/auth/logout         # User logout
POST /api/auth/refresh        # Token refresh
POST /api/auth/password-reset/request  # Request password reset
POST /api/auth/password-reset/confirm  # Confirm password reset
POST /api/auth/change-password         # Change password (logged in)
GET  /api/users/me            # Get current user info
```

### Frontend (React + Context)
```
services/authService.ts       # Core authentication logic
contexts/AuthContext.tsx      # React context for auth state
pages/Login.tsx              # Login page UI
pages/Register.tsx           # Registration page UI  
pages/ForgotPassword.tsx     # Password reset UI
```

## 👥 User Roles

1. **super_admin** - Full system access
2. **admin** - Administrative access to multiple makerspaces
3. **makerspace_admin** - Manages a specific makerspace
4. **service_provider** - Provides services to makerspaces
5. **maker** - Regular makerspace member (default for new registrations)

## 🔑 Test Accounts

| Role | Email | Password | Description |
|------|-------|----------|-------------|
| super_admin | superadmin@makrcave.com | SuperAdmin2024! | Full system access |
| admin | admin@makrcave.com | Admin2024! | Multi-makerspace admin |
| makerspace_admin | manager@makrcave.com | Manager2024! | Makerspace manager |
| service_provider | provider@makrcave.com | Provider2024! | Service provider |
| maker | maker@makrcave.com | Maker2024! | Regular member |

## 🚀 Quick Start

### 1. Backend Setup

```bash
# Navigate to backend directory
cd makrcave-backend

# Install dependencies
pip install -r requirements.txt

# Set environment variables
export JWT_SECRET_KEY="your-super-secure-secret-key-here"
export JWT_ALGORITHM="HS256"
export ACCESS_TOKEN_EXPIRE_MINUTES=30

# Run the server
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend/makrcave-frontend

# Install dependencies
npm install

# Set environment variables
echo "VITE_API_BASE_URL=http://localhost:8000/api" > .env

# Run the development server
npm run dev
```

## 💻 Implementation Details

### Authentication Service (authService.ts)

The core authentication logic is handled by the `AuthService` class:

```typescript
// Initialize the service
import { authService } from './services/authService';

// Login
await authService.login({ username: email, password });

// Register
await authService.register({ 
  email, 
  username, 
  password, 
  firstName, 
  lastName 
});

// Logout
await authService.logout();

// Check authentication status
const isLoggedIn = authService.isAuthenticated();

// Get current user
const user = authService.getUser();
```

### React Context Integration

```typescript
// Use in React components
import { useAuth } from '../contexts/AuthContext';

function MyComponent() {
  const { user, login, logout, loading, isAuthenticated } = useAuth();
  
  // Component logic here
}
```

### Protected Routes

```typescript
// Check user permissions
const { user } = useAuth();

// Role-based access
if (user?.role === 'super_admin') {
  // Super admin only features
}

// Admin check (any admin level)
if (['super_admin', 'admin', 'makerspace_admin'].includes(user?.role)) {
  // Admin features
}
```

## 🔧 Configuration

### Environment Variables

**Backend (.env)**
```env
# JWT Configuration
JWT_SECRET_KEY=your-super-secure-secret-key-here
JWT_ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# Database
DATABASE_URL=postgresql://user:password@localhost/makrcave

# Email (for password reset)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Frontend (.env)**
```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api
```

### Security Settings

1. **JWT Secret**: Use a strong, randomly generated secret key
2. **Token Expiry**: Access tokens expire in 30 minutes
3. **Refresh Tokens**: Valid for 7 days
4. **HTTPS**: Always use HTTPS in production
5. **CORS**: Configure proper CORS settings

## 📱 Frontend Usage

### Login Form
```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await login({ username: email, password });
    navigate('/portal/dashboard');
  } catch (error) {
    setError(error.message);
  }
};
```

### Registration Form
```typescript
const handleRegister = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    await authService.register({
      email,
      username,
      password,
      firstName,
      lastName
    });
    navigate('/portal/dashboard');
  } catch (error) {
    setError(error.message);
  }
};
```

### Password Reset
```typescript
// Request reset
await authService.requestPasswordReset({ email });

// Confirm reset (with token from email)
await authService.resetPassword(token, newPassword);
```

## 🛡️ Security Features

### Token Management
- **Automatic Refresh**: Tokens refresh 5 minutes before expiry
- **Secure Storage**: Tokens stored in localStorage with cleanup on logout
- **Expiry Validation**: Client-side token expiry checking

### Password Security
- **Hashing**: Passwords hashed with bcrypt on backend
- **Strength Requirements**: Enforced on frontend and backend
- **Reset Flow**: Secure email-based password reset

### Role-Based Access
- **Permission Checks**: Every API endpoint validates user roles
- **Frontend Guards**: UI elements hidden based on permissions
- **Backend Validation**: Double-checked on server side

## 🐛 Troubleshooting

### Common Issues

**1. Login Failed**
- Check email/password combination
- Verify backend server is running
- Check network connection

**2. Token Expired**
- Should auto-refresh automatically
- If not working, logout and login again
- Check browser console for errors

**3. Registration Issues**
- Email must be unique
- Password must meet requirements
- Check backend logs for validation errors

**4. Password Reset Not Working**
- Check email spam folder
- Verify SMTP configuration
- Check backend email service logs

### Debug Mode

Enable debug mode by setting in browser console:
```javascript
localStorage.setItem('makrcave_debug', 'true');
```

This will show additional logging in browser console.

## 🔄 API Endpoints

### Authentication Endpoints

```http
POST /api/auth/login
Content-Type: application/x-www-form-urlencoded

username=user@example.com&password=secret123
```

```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "user123",
  "password": "secret123",
  "firstName": "John",
  "lastName": "Doe"
}
```

```http
POST /api/auth/refresh
Content-Type: application/json

{
  "refresh_token": "your-refresh-token"
}
```

### User Management

```http
GET /api/users/me
Authorization: Bearer your-access-token
```

```http
POST /api/auth/change-password
Authorization: Bearer your-access-token
Content-Type: application/json

{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword"
}
```

## 📊 Monitoring

### Authentication Metrics
- Login success/failure rates
- Token refresh frequency
- Password reset requests
- User registration trends

### Security Monitoring
- Failed login attempts
- Suspicious activity patterns
- Token usage analytics
- Role permission audits

## 🔮 Future Enhancements

### Planned Features
- [ ] Two-Factor Authentication (2FA)
- [ ] OAuth integration (Google, GitHub)
- [ ] Session management dashboard
- [ ] Advanced role permissions
- [ ] API rate limiting
- [ ] Account lockout policies

### Security Improvements
- [ ] Passwordless authentication
- [ ] Biometric authentication
- [ ] Hardware security keys
- [ ] Advanced threat detection

## 📞 Support

For authentication-related issues:
1. Check this documentation first
2. Review error messages in browser console
3. Check backend logs for detailed errors
4. Contact system administrator if issues persist

---

**Last Updated**: December 2024  
**Version**: 1.0  
**Maintainer**: MakrCave Development Team
