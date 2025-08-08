# 🛒 MakrX.Store - E-commerce & Service Hub

The official e-commerce and service gateway of the MakrX ecosystem - a futuristic online platform where makers, educators, institutions, and hobbyists can purchase tools, components, machines, and order manufacturing services.

## 🌟 Features

### 📦 Product Catalog
- **3D Printers & CNCs** - Premium manufacturing equipment
- **Electronics** - Arduino, ESP32, sensors, and components  
- **Tools & Hardware** - Professional maker tools and accessories
- **Materials** - Filaments, resins, adhesives, and consumables
- **DIY Kits** - Curated maker projects and learning kits

### 🔁 Service Marketplace
- **Upload STL files** → Get instant price estimates → Place orders
- **Automatic routing** to verified local service providers
- **Real-time G-code generation** and material cost calculation
- **Quality assurance** and tracking throughout production

### 📐 Design Upload + Quote System
- Support for **STL, SVG, DXF** file formats
- **Real-time pricing** based on material, quality, and complexity
- **Multiple provider quotes** for competitive pricing
- **Local pickup** or shipping options

### 🛠️ Service Provider Integration
- **First-to-accept** job routing system
- **Automated inventory** adjustment on completion
- **Rating and review** system for quality control
- **Earnings dashboard** for service providers

### 🧪 MakrCave Integration
- **BOM linking** from MakrCave projects to store
- **Instant reordering** of consumables for makerspaces
- **Project-based recommendations** for materials and tools
- **Inventory awareness** with usage tracking

## 🚀 Tech Stack

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS + Radix UI components
- **Animations**: Framer Motion + custom CSS animations
- **3D Viewer**: Three.js for STL file visualization
- **File Upload**: React Dropzone for drag & drop
- **State Management**: Zustand for client state
- **Forms**: React Hook Form + Zod validation

## 🏗️ Project Structure

```
makrx-store-frontend/
├── src/
│   ├── app/                    # Next.js 13+ app directory
│   │   ├── 3d-printing/       # 3D printing hub pages
│   │   ├── catalog/           # Product catalog pages
│   │   ├── services/          # Service marketplace pages
│   │   ├── page.tsx           # Homepage
│   │   └── layout.tsx         # Root layout
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   ├── layout/            # Layout components (Header, Footer)
│   │   ├── product/           # Product-related components
│   │   └── upload/            # File upload components
│   ├── lib/                   # Utility functions
│   ├── store/                 # Zustand state management
│   ├── types/                 # TypeScript type definitions
│   └── styles/                # Global CSS styles
├── public/                    # Static assets
└── docs/                      # Documentation
```

## 🛡️ Access Control & Roles

### 🌐 General User
- Browse catalog and upload designs
- Place orders and track shipments
- Rate and review providers

### 🛠️ Service Provider  
- Accept jobs and slice files
- Track material usage and earnings
- Manage provider dashboard

### 🏭 Makerspace Admin
- Reorder inventory consumables
- Manage bulk job requests
- Access usage analytics

### 👑 Super Admin (MakrX)
- Manage product listings and pricing
- Configure service routing algorithms
- Access platform analytics and payouts

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   cd makrx-store-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration.

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3003](http://localhost:3003)

### Build for Production

```bash
npm run build
npm start
```

## 🌍 Environment Configuration

The application supports multiple environments:

- **Development**: `http://localhost:3003`
- **Staging**: `https://staging.makrx.store`  
- **Production**: `https://makrx.store`

## 🔗 Integration Points

### MakrCave Portal Integration
- **SSO Authentication** via Keycloak
- **Project BOM** linking to store products
- **Inventory management** synchronization

### Payment Processing
- **Stripe** for credit card payments
- **PayPal** for alternative payments
- **Crypto payments** for advanced users

### Shipping & Fulfillment
- **Local provider** pickup options
- **Integrated shipping** calculation
- **Real-time tracking** updates

## 📊 Analytics & Monitoring

- **Product analytics** - Views, conversions, popular items
- **Service metrics** - Quote-to-order conversion, provider performance
- **User behavior** - Shopping patterns, search queries
- **Performance monitoring** - Page load times, API responses

## 🔒 Security Features

- **Input validation** on all file uploads
- **Rate limiting** on API endpoints
- **CSRF protection** for forms
- **Secure file storage** with virus scanning
- **PCI compliance** for payment processing

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](./LICENSE) file for details.

## 🆘 Support

- **Documentation**: [docs.makrx.store](https://docs.makrx.store)
- **Email**: support@makrx.store
- **Discord**: [MakrX Community](https://discord.gg/makrx)

---

Built with ❤️ by the MakrX team for the maker community worldwide.
