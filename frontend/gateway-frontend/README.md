# MakrX Gateway Frontend

The **MakrX Gateway Frontend** is the primary landing page and entry point for the entire MakrX ecosystem. Built with React 18.3.1, TypeScript, and Vite, it serves as the unified portal connecting users to MakrCave (makerspaces), MakrX Store (marketplace), and Learn (educational platform).

## 🎯 Overview

The Gateway Frontend is designed to be the first touchpoint for visitors discovering the MakrX ecosystem. It provides:

- **Unified Authentication**: Single sign-on integration with Keycloak
- **App Launcher**: Central hub to access all MakrX applications
- **Ecosystem Overview**: Comprehensive introduction to MakrX services
- **Legal Compliance**: Full DPDP Act 2023 and Indian regulatory compliance
- **SEO Optimization**: Structured data and comprehensive meta tags
- **Performance**: Optimized for Core Web Vitals and accessibility

## 🏗️ Architecture

### Tech Stack
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 6.3.5 for fast development and optimized builds
- **Styling**: Tailwind CSS with custom MakrX design system
- **Routing**: React Router DOM v6 for client-side navigation
- **State Management**: React Context API with custom hooks
- **Authentication**: Keycloak SSO integration
- **Feature Flags**: Custom context-driven feature flag system

### Project Structure
```
frontend/gateway-frontend/
├── components/           # Reusable UI components
│   ├── ui/              # shadcn/ui components
│   ├── AppLauncher.tsx  # Central app launcher modal
│   ├── EnhancedHeader.tsx # Main navigation header
│   └── Footer.tsx       # Site footer with newsletter
├── contexts/            # React contexts for state management
│   ├── AuthContext.tsx  # Authentication state
│   └── CrossPortalAuth.tsx # Cross-app authentication
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
│   ├── feature-flags.tsx # Feature flag system
│   └── utils.ts         # Helper functions
├── pages/               # Route components
│   ├── admin/           # Admin-only pages
│   ├── HomePage.tsx     # Main landing page
│   ├── About.tsx        # Company information
│   ├── Ecosystem.tsx    # Ecosystem overview
│   ├── PrivacyPolicy.tsx # DPDP Act 2023 compliant
│   ├── TermsOfService.tsx # Legal terms
│   ├── CookiePolicy.tsx # Cookie management
│   ├── AccessibilityStatement.tsx # WCAG 2.1 AA
│   └── ReturnsPolicy.tsx # Consumer Protection Act 2019
├── public/              # Static assets
│   ├── sitemap.xml      # SEO sitemap
│   └── robots.txt       # Search engine directives
└── src/
    └── main.tsx         # Application entry point
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn/pnpm
- Git for version control

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd frontend/gateway-frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Setup
Create a `.env.local` file with the following variables:

```env
# Authentication (Keycloak)
VITE_KEYCLOAK_URL=https://auth.makrx.org
VITE_KEYCLOAK_REALM=makrx
VITE_KEYCLOAK_CLIENT_ID=makrx-gateway

# API Endpoints
VITE_API_BASE_URL=https://api.makrx.org
VITE_MAKRCAVE_URL=https://makrcave.makrx.org
VITE_STORE_URL=https://store.makrx.org
VITE_LEARN_URL=https://learn.makrx.org

# Feature Flags
VITE_ENABLE_FEATURE_FLAGS=true
VITE_FEATURE_FLAG_SERVICE_URL=https://flags.makrx.org

# Analytics & Monitoring
VITE_GA_TRACKING_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
VITE_HOTJAR_ID=XXXXXXX

# Company Information
VITE_COMPANY_NAME="Botness Technologies Pvt Ltd"
VITE_COMPANY_CIN="U72900KA2024PTC123456"
VITE_SUPPORT_EMAIL="hello@makrx.org"
VITE_SUPPORT_PHONE="+91 80472 58000"
```

## 🎨 Customization

### Branding & Design
The Gateway uses a custom MakrX design system built on Tailwind CSS:

```css
/* Custom Colors in tailwind.config.ts */
colors: {
  'makrx-blue': '#1e40af',    // Primary brand blue
  'makrx-yellow': '#f59e0b',  // Accent yellow
  'makrx-dark': '#0f172a',    // Dark backgrounds
}
```

### Feature Flags
The Gateway includes a comprehensive feature flag system:

```typescript
// Usage in components
const showStats = useBooleanFlag('org.homepage.stats', true);
const showTestimonials = useBooleanFlag('org.homepage.testimonials', true);
```

Available feature flags:
- `org.homepage.stats` - Display statistics section
- `org.homepage.testimonials` - Show user testimonials
- `org.homepage.video` - Display promotional video
- `org.header.app-launcher` - Enable app launcher button
- `org.footer.newsletter` - Newsletter subscription form

### Content Management
Key content areas that can be customized:

1. **Hero Section** (`pages/HomePage.tsx` lines 185-220)
2. **Statistics** (`pages/HomePage.tsx` lines 310-320)
3. **Company Information** (`components/Footer.tsx` lines 100-130)
4. **Legal Policies** (individual policy pages)

## 🔧 Configuration

### Authentication Setup
1. Configure Keycloak realm at `auth.makrx.org`
2. Create client configuration for `makrx-gateway`
3. Set up redirect URIs for your domain
4. Update environment variables with Keycloak details

### Cross-Portal Integration
The Gateway integrates with other MakrX applications:

```typescript
// Cross-portal navigation configuration
const portalApps = [
  {
    name: 'MakrCave',
    url: process.env.VITE_MAKRCAVE_URL,
    description: 'Access premium makerspaces'
  },
  {
    name: 'Store',
    url: process.env.VITE_STORE_URL,
    description: 'Shop maker tools and components'
  },
  {
    name: 'Learn',
    url: process.env.VITE_LEARN_URL,
    description: 'Educational resources and courses'
  }
];
```

### SEO Configuration
Update SEO metadata in `App.tsx`:

```typescript
<Helmet>
  <title>MakrX - Your Creative Ecosystem</title>
  <meta name="description" content="Access world-class makerspaces..." />
  <meta property="og:title" content="MakrX - Your Creative Ecosystem" />
  <link rel="canonical" href="https://makrx.org" />
</Helmet>
```

## 📋 Production Deployment

### Build Process
```bash
# Create production build
npm run build

# Preview build locally
npm run preview

# Build size analysis
npm run analyze
```

### Required Changes for Production

#### 1. Environment Variables
Replace all development environment variables with production values:

```env
# Update these for production
VITE_KEYCLOAK_URL=https://auth.makrx.org  # Your production Keycloak
VITE_API_BASE_URL=https://api.makrx.org   # Your production API
VITE_GA_TRACKING_ID=G-XXXXXXXXXX         # Your Google Analytics ID
```

#### 2. Company Information
Update company details in `components/Footer.tsx`:

```typescript
// Update with your actual company information
const companyInfo = {
  name: "Your Company Name",
  cin: "YOUR_ACTUAL_CIN_NUMBER",
  address: "Your actual registered address",
  phone: "Your actual phone number",
  email: "Your actual support email"
};
```

#### 3. Legal Policies
Review and customize legal policy pages:
- `pages/PrivacyPolicy.tsx` - Update contact information and data handling practices
- `pages/TermsOfService.tsx` - Update jurisdiction and company details
- `pages/CookiePolicy.tsx` - Configure cookie preferences
- `pages/AccessibilityStatement.tsx` - Update contact information
- `pages/ReturnsPolicy.tsx` - Update return policies for your business

#### 4. Analytics & Monitoring
Configure production monitoring:

```typescript
// Update analytics configuration
const analyticsConfig = {
  googleAnalytics: 'G-XXXXXXXXXX',  // Your GA4 property
  hotjar: 'XXXXXXX',                // Your Hotjar site ID
  sentry: 'https://xxx@sentry.io/xxx' // Your Sentry DSN
};
```

### Deployment Options

#### Option 1: Static Hosting (Recommended)
Deploy to Netlify, Vercel, or AWS S3:

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting provider
```

#### Option 2: Docker Deployment
```dockerfile
FROM nginx:alpine
COPY dist/ /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Option 3: CDN Integration
Configure your CDN to serve the built assets with proper caching headers.

### Performance Optimization

Current build metrics:
- **Main Bundle**: 722KB (107KB gzipped)
- **CSS Bundle**: 122KB (19KB gzipped)
- **Lighthouse Score**: 90+ across all metrics

For further optimization:
1. Enable code splitting for large components
2. Implement service worker for caching
3. Configure CDN for static assets
4. Enable compression at server level

## 🔐 Security

### Content Security Policy
Implement CSP headers:

```
Content-Security-Policy: default-src 'self'; 
  script-src 'self' 'unsafe-inline' https://www.googletagmanager.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' https://fonts.gstatic.com;
  img-src 'self' data: https:;
  connect-src 'self' https://api.makrx.org https://auth.makrx.org;
```

### Environment Security
- Never commit `.env` files to version control
- Use secure environment variable management in production
- Rotate API keys and secrets regularly
- Enable HTTPS enforcement

## 📊 Monitoring & Analytics

### Performance Monitoring
- **Core Web Vitals**: LCP, FID, CLS tracking
- **Error Tracking**: Sentry integration for error reporting
- **User Analytics**: Google Analytics 4 for user behavior
- **Heatmaps**: Hotjar for user interaction insights

### Health Checks
The application includes built-in health monitoring:
- API connectivity checks
- Authentication service status
- Feature flag service availability

## 🧪 Testing

### Test Suites
```bash
# Unit tests
npm run test

# E2E tests  
npm run test:e2e

# Accessibility tests
npm run test:a11y

# Performance tests
npm run test:lighthouse
```

### Testing Checklist
- [ ] All routes load correctly
- [ ] Authentication flow works
- [ ] App launcher functions properly
- [ ] Legal pages are accessible
- [ ] SEO metadata is correct
- [ ] Performance meets targets
- [ ] Accessibility compliance (WCAG 2.1 AA)

## 🐛 Troubleshooting

### Common Issues

**Build Errors**:
- Ensure Node.js version 18+
- Clear `node_modules` and reinstall dependencies
- Check TypeScript compilation errors

**Authentication Issues**:
- Verify Keycloak configuration
- Check redirect URI configuration
- Ensure CORS settings allow your domain

**Performance Issues**:
- Analyze bundle size with `npm run analyze`
- Check for memory leaks in React components
- Optimize images and assets

### Support Channels
- **Technical Issues**: Create issue in repository
- **Production Support**: Contact DevOps team
- **Security Issues**: security@makrx.org

## 📈 Roadmap

### Planned Features
- [ ] Progressive Web App (PWA) support
- [ ] Multi-language support (i18n)
- [ ] Advanced analytics dashboard
- [ ] Real-time notifications
- [ ] Enhanced accessibility features

### Contributing
See [CONTRIBUTING.md](../../docs/CONTRIBUTING.md) for development guidelines and contribution process.

## 📄 License

Copyright © 2024 Botness Technologies Pvt Ltd. All rights reserved.
