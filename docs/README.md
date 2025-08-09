# MakrX Documentation

Welcome to the comprehensive documentation for the MakrX ecosystem. This documentation covers everything you need to know about developing, deploying, and contributing to the MakrX platform.

## 📚 Documentation Overview

### Core Documentation
- **[Main README](../README.md)** - Project overview and quick start guide
- **[System Architecture](ARCHITECTURE.md)** - Technical architecture and design principles
- **[API Documentation](API.md)** - Complete API reference for all services
- **[Frontend Guide](FRONTEND.md)** - Frontend development guide and best practices
- **[Backend Guide](BACKEND.md)** - Backend development guide and API patterns
- **[Deployment Guide](DEPLOYMENT.md)** - Local development to production deployment
- **[Security Guide](SECURITY.md)** - Security implementation and best practices
- **[Contributing Guidelines](CONTRIBUTING.md)** - How to contribute to the project

## 🎯 Getting Started

### For New Developers
1. Start with the [Main README](../README.md) for project overview
2. Follow the [Quick Start Guide](../README.md#-quick-start) for local setup
3. Read the [Architecture Documentation](ARCHITECTURE.md) to understand the system
4. Explore the [Frontend](FRONTEND.md) or [Backend](BACKEND.md) guides based on your focus
5. Check [Contributing Guidelines](CONTRIBUTING.md) before making changes

### For DevOps/Deployment
1. Review [System Architecture](ARCHITECTURE.md) for infrastructure understanding
2. Follow [Deployment Guide](DEPLOYMENT.md) for environment setup
3. Implement [Security Guidelines](SECURITY.md) for production safety
4. Set up monitoring and logging as described in deployment docs

### For API Consumers
1. Start with [API Documentation](API.md) for endpoint references
2. Review [Authentication section](SECURITY.md#-authentication-system) for auth setup
3. Check [Rate Limiting guidelines](SECURITY.md#rate-limiting) for usage limits
4. Explore interactive API docs at `/docs` endpoint on each service

## 🏗️ Architecture Quick Reference

### System Components
```
MakrX Ecosystem:
├── Frontend Applications
│   ├── Gateway (makrx.org) - React + Vite
│   ├── MakrCave (makrcave.com) - React + Vite  
│   └── Store (makrx.store) - Next.js
├── Backend Services
│   ├── Auth Service - FastAPI + JWT
│   ├── MakrCave API - FastAPI + PostgreSQL
│   ├── Store API - FastAPI + PostgreSQL
│   └── Event Service - FastAPI + Redis
├── Infrastructure
│   ├── PostgreSQL - Primary database
│   ├── Redis - Cache and queues
│   ├── Keycloak - SSO provider
│   ├── MinIO - File storage
│   └── Nginx - Reverse proxy
└── Shared Packages
    ├── UI Components - Shared React components
    ├── Types - TypeScript definitions
    └── Utils - Shared utilities
```

### Key Technologies
- **Frontend**: React 18, Next.js 14, TypeScript, Tailwind CSS
- **Backend**: FastAPI, SQLAlchemy, Pydantic, PostgreSQL
- **Authentication**: Keycloak, JWT tokens
- **Infrastructure**: Docker, Nginx, Redis, MinIO
- **Development**: Vite, Poetry, npm workspaces

## 🔗 Quick Links

### Development
- [Local Setup Guide](../README.md#-quick-start)
- [Frontend Development](FRONTEND.md#-development-setup)
- [Backend Development](BACKEND.md#-quick-start)
- [API Testing](API.md#-api-testing)

### Deployment
- [Docker Deployment](DEPLOYMENT.md#-docker-deployment)
- [Kubernetes Setup](DEPLOYMENT.md#️-kubernetes-deployment)
- [Cloud Deployment](DEPLOYMENT.md#-cloud-provider-deployment)
- [Environment Configuration](DEPLOYMENT.md#-environment-configuration)

### Security
- [Authentication Flow](SECURITY.md#-authentication-system)
- [Authorization Model](SECURITY.md#️-authorization--access-control)
- [Data Protection](SECURITY.md#-data-protection)
- [Security Monitoring](SECURITY.md#-security-monitoring--auditing)

### Contributing
- [Development Workflow](CONTRIBUTING.md#-contribution-process)
- [Coding Standards](CONTRIBUTING.md#-coding-standards)
- [Testing Requirements](CONTRIBUTING.md#-testing-requirements)
- [Code Review Process](CONTRIBUTING.md#-code-review-process)

## 📊 API Quick Reference

### Authentication
```bash
# Login
POST /api/auth/login
# Refresh token
POST /api/auth/refresh
# User profile
GET /api/users/me
```

### MakrCave API (makrcave.com/api/v1)
```bash
# Makerspaces
GET /makerspaces
GET /makerspaces/{id}

# Equipment
GET /makerspaces/{id}/equipment
POST /makerspaces/{id}/equipment
POST /equipment/{id}/reserve

# Inventory
GET /makerspaces/{id}/inventory
POST /inventory/{id}/deduct

# Projects
GET /projects
POST /projects
GET /projects/{id}/bom
```

### Store API (makrx.store/api/v1)
```bash
# Products
GET /products
GET /products/{id}

# Shopping Cart
GET /cart
POST /cart/items
DELETE /cart/items/{id}

# Orders
GET /orders
POST /orders

# Fabrication
POST /fabrication/quote
POST /fabrication/order
```

## 🏷️ Environment Setup

### Development Environment Variables
```bash
# Database
DATABASE_URL=postgresql://makrx:password@localhost:5432/makrx
REDIS_URL=redis://localhost:6379

# Authentication  
JWT_SECRET=your-secret-key
KEYCLOAK_URL=http://localhost:8080

# External Services
STRIPE_SECRET_KEY=sk_test_...
SMTP_HOST=smtp.gmail.com
MINIO_ENDPOINT=localhost:9000

# Feature Flags
FEATURE_FLAGS_URL=http://localhost:8000/flags
```

### Service Ports (Development)
- **Gateway Frontend**: http://localhost:3000
- **MakrCave Frontend**: http://localhost:3001  
- **Store Frontend**: http://localhost:3002
- **Auth Service**: http://localhost:8000
- **MakrCave API**: http://localhost:8001
- **Store API**: http://localhost:8002
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379
- **Keycloak**: http://localhost:8080
- **MinIO**: http://localhost:9000

## 🔍 Troubleshooting

### Common Issues

#### Development Setup
- **Docker issues**: Check Docker is running and has sufficient resources
- **Port conflicts**: Ensure ports 3000-3002, 8000-8002, 5432, 6379, 8080, 9000 are available
- **Database connection**: Verify PostgreSQL is running and credentials are correct
- **Node.js version**: Ensure Node.js v18+ is installed

#### API Issues
- **CORS errors**: Check frontend URLs are in CORS_ORIGINS config
- **Auth failures**: Verify JWT tokens are valid and not expired
- **Permission denied**: Check user roles and makerspace memberships
- **Rate limiting**: Reduce request frequency or check rate limit headers

#### Deployment Issues
- **Docker build failures**: Check Dockerfile syntax and dependencies
- **Database migrations**: Ensure all migrations have been applied
- **SSL certificate**: Verify TLS certificates are valid and properly configured
- **Environment variables**: Check all required environment variables are set

### Getting Help
1. **Check the docs**: Search this documentation for solutions
2. **GitHub Issues**: Search existing issues or create a new one
3. **Community Discord**: Join our Discord for real-time help
4. **Security Issues**: Email security@makrx.org for security concerns

## 📈 Performance Guidelines

### Frontend Performance
- **Code Splitting**: Lazy load components and routes
- **Bundle Size**: Keep bundles under 250KB compressed
- **Image Optimization**: Use Next.js Image component or optimize manually
- **Caching**: Implement service workers for offline functionality

### Backend Performance
- **Database Queries**: Use proper indexing and avoid N+1 queries
- **Caching**: Cache frequently accessed data in Redis
- **Async Operations**: Use background jobs for heavy processing
- **Connection Pooling**: Configure appropriate database connection pools

### Infrastructure Performance
- **CDN**: Use CDN for static assets in production
- **Load Balancing**: Distribute traffic across multiple service instances
- **Monitoring**: Set up performance monitoring and alerting
- **Scaling**: Plan horizontal scaling strategies

## 🔐 Security Checklist

### Development Security
- [ ] All dependencies regularly updated
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (ORM usage)
- [ ] XSS prevention (output encoding)
- [ ] CSRF protection implemented
- [ ] Rate limiting configured
- [ ] Error messages don't leak sensitive data

### Production Security
- [ ] HTTPS/TLS properly configured
- [ ] Database connections encrypted
- [ ] Secrets managed securely
- [ ] Security headers implemented
- [ ] Access logs enabled
- [ ] Regular security assessments
- [ ] Incident response plan ready

## 📝 Documentation Maintenance

### Keeping Docs Updated
- **API Changes**: Update API docs when endpoints change
- **Architecture Changes**: Update architecture docs for system changes
- **New Features**: Document new features and configuration options
- **Security Updates**: Keep security docs current with latest practices

### Documentation Standards
- **Clear Examples**: Include working code examples
- **Up-to-date**: Ensure examples work with current versions
- **Comprehensive**: Cover common use cases and edge cases
- **Searchable**: Use clear headings and structure

---

## 🤝 Community

- **GitHub**: [github.com/makrx/ecosystem](https://github.com/makrx/ecosystem)
- **Discord**: [discord.gg/makrx](https://discord.gg/makrx)
- **Website**: [makrx.org](https://makrx.org)
- **Email**: [hello@makrx.org](mailto:hello@makrx.org)

---

**Happy Making!** 🛠️ 

The MakrX team and community are here to help you build amazing things. Whether you're developing new features, deploying to production, or just getting started, this documentation should guide you through every step of the journey.
