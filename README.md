# MakrX Ecosystem

![MakrX Logo](https://cdn.builder.io/api/v1/assets/f367f5e46f75423a83d3f29fae529dbb/92683663a93a4914bdaf2ee285888bd3?format=webp&width=400)

**The Modular OS of Making** - An open-source, cloud-native ecosystem that unifies everything a maker needs: makerspace management, 3D printing, education, and community.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm 9+
- Docker and Docker Compose
- Git

### Development Setup

1. **Clone and setup:**
   ```bash
   git clone https://github.com/makrx/ecosystem
   cd makrx-ecosystem
   npm run setup
   ```

2. **Start development servers:**
   ```bash
   npm run dev
   ```

3. **Access applications:**
   - Gateway (Landing): http://localhost:3000
   - MakrCave (Makerspace): http://localhost:3001  
   - MakrX Store (Commerce): http://localhost:3002
   - Keycloak SSO: http://localhost:8080

### Production Deployment

```bash
# Build and start all services
npm run docker:build
npm run docker:up

# View logs
npm run docker:logs
```

## 🏗️ Architecture

```
makrx-ecosystem/
├── frontend/                    # React applications
│   ├── gateway-frontend/        # Landing & SSO navigation
│   ├── makrcave-frontend/       # Makerspace portal
│   └── makrx-store-frontend/    # Commerce & 3D printing
├── backends/                    # FastAPI microservices
│   ├── auth-service/            # Authentication & user management
│   ├── makrcave-backend/        # Makerspace & inventory APIs
│   └── makrx-store-backend/     # Product & order APIs
├── packages/                    # Shared libraries
│   ├── ui/                      # Component library
│   ├── types/                   # TypeScript definitions
│   └── utils/                   # Common utilities
└── services/                    # Infrastructure
    ├── keycloak/                # SSO & identity management
    └── reverse-proxy/           # Nginx routing
```

## 🧩 Ecosystem Components

### Frontend Applications

| Application | Purpose | Port | URL |
|-------------|---------|------|-----|
| **Gateway** | Landing page, profile, SSO navigation | 3000 | makrx.org |
| **MakrCave** | Makerspace management portal | 3001 | cave.makrx.org |
| **Store** | Ecommerce & 3D print ordering | 3002 | store.makrx.org |

### Backend Services

| Service | Purpose | Port | Technology |
|---------|---------|------|------------|
| **Auth Service** | User management, Keycloak sync | 8001 | FastAPI + PostgreSQL |
| **MakrCave API** | Inventory, projects, bookings | 8002 | FastAPI + PostgreSQL |
| **Store API** | Products, orders, 3D printing | 8003 | FastAPI + PostgreSQL |

### Infrastructure

| Service | Purpose | Port | Technology |
|---------|---------|------|------------|
| **Keycloak** | SSO, identity & access management | 8080 | Keycloak + PostgreSQL |
| **PostgreSQL** | Primary database | 5432 | PostgreSQL 15 |
| **Nginx** | Reverse proxy & load balancer | 80/443 | Nginx |

## 🔐 Authentication

The ecosystem uses **Keycloak** for enterprise-grade SSO:

- **Single Sign-On** across all applications
- **Role-based access control** (RBAC)
- **Custom MakrX theme** with brand styling
- **Social login** integration ready
- **Enterprise LDAP/SAML** support

### Default Users

| Username | Password | Role | Access |
|----------|----------|------|--------|
| `admin` | `makrx-admin-2024` | Super Admin | Full system access |
| `demo` | `makrx2024` | Maker | Standard user access |

## 🛠️ Development

### Shared Packages

- **@makrx/ui** - Design system components
- **@makrx/types** - TypeScript definitions  
- **@makrx/utils** - Common utilities

### Environment Configuration

Each service supports environment-specific configuration:

```bash
# Development
NODE_ENV=development

# Keycloak
KEYCLOAK_URL=http://localhost:8080
KEYCLOAK_REALM=makrx

# Database
DATABASE_URL=postgresql://makrx:makrx-db-2024@localhost:5432/makrx
```

### Available Scripts

```bash
# Development
npm run dev                  # Start all frontends
npm run dev:gateway         # Gateway only
npm run dev:makrcave        # MakrCave only  
npm run dev:store           # Store only

# Building
npm run build               # Build all packages & apps
npm run build:packages      # Build shared packages only
npm run build:frontends     # Build frontend apps only

# Docker
npm run docker:up           # Start all services
npm run docker:down         # Stop all services
npm run docker:build        # Build Docker images
npm run docker:logs         # View logs

# Quality
npm run typecheck           # TypeScript validation
```

## 🎯 Roadmap

### Phase 1: Core Platform ✅
- [x] Microservices architecture
- [x] Keycloak SSO integration
- [x] Gateway landing page
- [x] Basic auth flow
- [x] Shared component library

### Phase 2: MakrCave (Q1 2024)
- [ ] Makerspace management
- [ ] Inventory tracking
- [ ] Equipment booking
- [ ] Project collaboration
- [ ] Member management

### Phase 3: MakrX Store (Q2 2024)
- [ ] Product marketplace
- [ ] 3D print ordering
- [ ] Design upload & quoting
- [ ] Service provider network
- [ ] Order fulfillment

### Phase 4: Learning Hub (Q3 2024)
- [ ] Interactive courses
- [ ] Skill badges & certification
- [ ] Community learning
- [ ] Mentor network
- [ ] Achievement system

### Phase 5: Advanced Features (Q4 2024)
- [ ] Mobile applications
- [ ] IoT device integration
- [ ] AI-powered recommendations
- [ ] Global marketplace
- [ ] Analytics dashboard

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Guidelines

1. **Code Style**: Follow TypeScript + ESLint rules
2. **Components**: Use shared @makrx/ui components
3. **Types**: Define interfaces in @makrx/types
4. **Testing**: Write tests for new features
5. **Documentation**: Update docs for API changes

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🎉 Community

- **Discord**: [Join our maker community](https://discord.gg/makrx)
- **GitHub**: [Report issues & contribute](https://github.com/makrx/ecosystem)
- **Website**: [makrx.org](https://makrx.org)
- **Blog**: [blog.makrx.org](https://blog.makrx.org)

---

**Built with ❤️ by makers, for makers worldwide.** 🤖⚡

*MakrX is open-source software that empowers the global maker community to build, learn, and share together.*
