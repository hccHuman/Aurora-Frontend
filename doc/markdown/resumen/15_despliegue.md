# 🚀 Despliegue y Build

## Build Local

### Desarrollo

```bash
# Iniciar servidor de desarrollo (con hot reload)
npm run dev

# Acceder a http://localhost:3000
# Cambios automáticos sin recargar el navegador
```

### Producción Local

```bash
# Compilar para producción
npm run build

# Salida en: dist/

# Previsualizar build
npm run preview

# Acceder a http://localhost:4321
```

## Process de Build

```
┌─────────────────┐
│  npm run build  │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 1. Astro SSR Processing          │
│   - Procesar .astro files        │
│   - Renderizar HTML estático     │
│   - Incrustar React components   │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 2. TypeScript Compilation        │
│   - Transpilar TS → JS           │
│   - Verificar tipos (strict)     │
│   - Generar source maps          │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 3. Asset Processing              │
│   - Minificar CSS/JS             │
│   - Optimizar imágenes           │
│   - Bundlear módulos             │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│ 4. Output Generation             │
│   - Generar HTML final           │
│   - Copiar assets públicos       │
│   - Crear manifests              │
└────────┬─────────────────────────┘
         │
         ▼
┌──────────────────────────────────┐
│  dist/ (listo para deploy)       │
└──────────────────────────────────┘
```

## Configuración de Environments

```env
# .env.development
PUBLIC_API_URL=http://localhost:5000
PUBLIC_API_TIMEOUT=10000
DEBUG=true

# .env.staging
PUBLIC_API_URL=https://api-staging.aurora.dev
PUBLIC_API_TIMEOUT=10000
DEBUG=false

# .env.production
PUBLIC_API_URL=https://api.aurora.prod
PUBLIC_API_TIMEOUT=10000
DEBUG=false
```

## Deploy a Vercel

### Setup Inicial

```bash
# Instalar CLI de Vercel
npm install -g vercel

# Conectar proyecto
vercel link

# Deploy
vercel deploy
```

### Configuración vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "devCommand": "npm run dev",
  "framework": "astro",
  "env": {
    "PUBLIC_API_URL": "@public_api_url",
    "PUBLIC_PAYPAL_CLIENT_ID": "@paypal_client_id"
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "https://api.aurora.prod/api/$1" }
  ],
  "redirects": [
    { "source": "/products/:id", "destination": "/shop/:id" }
  ],
  "headers": [
    {
      "source": "/api/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=3600" }
      ]
    }
  ]
}
```

## Deploy a Netlify

### Configuración netlify.toml

```toml
[build]
command = "npm run build"
publish = "dist"
functions = "netlify/functions"

[build.environment]
NODE_VERSION = "18.17.0"
NPM_VERSION = "9.6.7"

[[redirects]]
from = "/api/*"
to = "https://api.aurora.prod/api/:splat"
status = 200

[[redirects]]
from = "/*"
to = "/index.html"
status = 200

[[headers]]
for = "/api/*"
[headers.values]
Cache-Control = "public, max-age=3600"
```

### Deploy

```bash
# Conectar a Netlify
npm install netlify-cli -g
netlify init

# Deploy
netlify deploy

# Deploy en producción
netlify deploy --prod
```

## Docker Deployment

### Dockerfile

```dockerfile
# Stage 1: Build
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar
RUN npm run build

# Stage 2: Runtime
FROM node:18-alpine

WORKDIR /app

# Instalar servidor estático (para servir dist/)
RUN npm install -g http-server

# Copiar build desde stage anterior
COPY --from=builder /app/dist ./dist

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD wget --quiet --tries=1 --spider http://localhost:3000/ || exit 1

# Exponer puerto
EXPOSE 3000

# Servir archivos estáticos
CMD ["http-server", "dist", "-p", "3000", "--gzip", "-c-1"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  aurora-frontend:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      - PUBLIC_API_URL=http://aurora-backend:5000
      - PUBLIC_PAYPAL_CLIENT_ID=${PAYPAL_CLIENT_ID}
    depends_on:
      - aurora-backend
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:3000"]
      interval: 30s
      timeout: 3s
      retries: 3

  aurora-backend:
    image: aurora-backend:latest
    ports:
      - "5000:5000"
    environment:
      - DATABASE_URL=postgresql://user:pass@db:5432/aurora
      - JWT_SECRET=${JWT_SECRET}
    depends_on:
      - db
    restart: unless-stopped

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_DB=aurora
      - POSTGRES_USER=aurora_user
      - POSTGRES_PASSWORD=${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

### Deploy con Docker

```bash
# Build imagen
docker build -t aurora-frontend:latest .

# Ejecutar contenedor
docker run -p 3000:3000 \
  -e PUBLIC_API_URL=http://api.aurora.dev \
  -e PUBLIC_PAYPAL_CLIENT_ID=XXX \
  aurora-frontend:latest

# Usar Docker Compose
docker-compose up -d

# Ver logs
docker-compose logs -f aurora-frontend
```

## CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml

name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  build-and-test:
    runs-on: ubuntu-latest
    
    strategy:
      matrix:
        node-version: [18.x]
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Use Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run linter
        run: npm run lint
      
      - name: Type check
        run: npm run tsc:check
      
      - name: Run tests
        run: npm test -- --coverage
      
      - name: Build
        run: npm run build
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/lcov.info
  
  deploy:
    needs: build-and-test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main' && github.event_name == 'push'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy to Vercel
        run: |
          npm install -g vercel
          vercel deploy --prod
        env:
          VERCEL_TOKEN: ${{ secrets.VERCEL_TOKEN }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
```

## Optimización de Performance

### Estrategias

```typescript
// 1. Code Splitting automático con Astro
import { lazy, Suspense } from 'react';

const ProductList = lazy(() => import('./ProductList'));

// 2. Image Optimization
<Image
  src={import('./product.jpg')}
  alt="Product"
  width={400}
  height={300}
  quality={80}
/>

// 3. CSS-in-JS minimal
<style is:global>
  :root {
    --color-primary: #7c3aed;
  }
</style>

// 4. Async component loading
<ProductList client:visible />  {/* Load when visible */}
```

### Métricas Objetivo (Core Web Vitals)

```
┌─────────────────────────────────┐
│   Lighthouse Targets            │
├─────────────────────────────────┤
│ Performance:      90+            │
│ Accessibility:    95+            │
│ Best Practices:   95+            │
│ SEO:              100            │
└─────────────────────────────────┘

┌─────────────────────────────────┐
│   Core Web Vitals Targets       │
├──────────────────┬──────────────┤
│ LCP (Largest)    │ < 2.5s       │
│ FID (First Input)│ < 100ms      │
│ CLS (Shift)      │ < 0.1        │
└──────────────────┴──────────────┘
```

## Monitoring y Logging

### Sentry Setup

```typescript
// src/main.ts

import * as Sentry from "@sentry/astro";

Sentry.init({
  dsn: import.meta.env.PUBLIC_SENTRY_DSN,
  environment: import.meta.env.MODE,
  tracesSampleRate: 0.1,
  integrations: [
    new Sentry.Replay({
      maskAllText: false,
      blockAllMedia: false,
    }),
  ],
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1.0,
});
```

### Analytics Setup

```typescript
// src/config.ts

export function initAnalytics() {
  if (typeof window === 'undefined') return;
  
  const gaId = import.meta.env.PUBLIC_GA_ID;
  if (!gaId) return;
  
  // Google Analytics
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(script);
  
  window.dataLayer = window.dataLayer || [];
  function gtag(...args: any[]) {
    window.dataLayer?.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', gaId);
}
```

## Rollback

```bash
# Vercel
vercel rollback

# Netlify
netlify deploy --prod  # Redeploy anterior

# Docker
docker run -p 3000:3000 aurora-frontend:v1.0.0

# GitHub Releases
git revert <commit-hash>
git push origin main
```

## Checklist Pre-Deploy

- [ ] Todos los tests pasando (`npm test`)
- [ ] Linting sin errores (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] No hay console.error en logs
- [ ] Coverage >= 80%
- [ ] Variables de ambiente configuradas
- [ ] Secrets no commiteados
- [ ] Performance metrics OK
- [ ] SSL/HTTPS activo
- [ ] CORS configurado correctamente
- [ ] API backend disponible
- [ ] Base de datos migrada
- [ ] CDN configurado (opcional)
- [ ] Backups realizados
- [ ] Notificaciones configuradas

---

**Última actualización**: Enero 2026  
**Hosting**: Vercel / Netlify / Docker  
**CI/CD**: GitHub Actions  
**Monitoring**: Sentry + Google Analytics
