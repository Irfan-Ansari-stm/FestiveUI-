# FestiveUI
> **Enterprise Festival & Event UI Animation Library, Visual Drag-and-Drop Studio & Marketplace**

[![CI/CD](https://github.com/festiveui/festiveui/actions/workflows/ci.yml/badge.svg)](https://github.com/festiveui/festiveui/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-blue.svg)](https://www.typescriptlang.org/)
[![NestJS](https://img.shields.io/badge/NestJS-10.3-E0234E.svg)](https://nestjs.com/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2-black.svg)](https://nextjs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC.svg)](https://tailwindcss.com/)

---

## 1. Overview
**FestiveUI** allows developers and marketing teams to visually compose, customize, and seamlessly mount ready-made festival decorations, particle bursts, and interactive greetings into websites across any frontend framework:
- **Diwali:** Diyas with flame flicker physics, radiant fireworks, revolving geometric rangolis, floating water diyas, golden dust.
- **Holi:** Dynamic paint powder splashes, billowing Gulal particles, and color turbulence.
- **Christmas:** Multi-layer realistic snowfall, fairy light garlands, and decorated Christmas trees.
- **New Year:** High-velocity confetti ribbons, countdown badge counters, and willow fireworks bursts.
- **Eid:** Swaying Moroccan Fanous brass lanterns and luminous crescent moons.
- **Valentine's Day, Halloween, and Independence Day.**

---

## 2. Monorepo Ecosystem
```
festiveui/
├── apps/
│   ├── api/                    # NestJS REST Engine, Swagger UI, JWT, RBAC, Redis, Stripe/Razorpay
│   └── web/                    # Next.js 14 App Router (Marketplace, Studio, Dashboard, Admin, Docs)
├── packages/
│   ├── core/                   # Framework-independent runtime engine (Canvas, SVG, CSS)
│   ├── react/                  # React 18/19 components (<FestiveAnimation>, <DiyaEffect>)
│   ├── next/                   # Next.js SSR-safe adapters & client boundaries
│   ├── vue/                    # Vue 3 directives & composables
│   ├── angular/                # Angular standalone components & services
│   ├── web-component/          # W3C Custom Elements (<festive-animation>)
│   └── types/                  # Shared TypeScript domain contracts & schemas
├── prisma/
│   ├── schema.prisma           # 35 relational PostgreSQL tables
│   └── seed.ts                 # Full seed data (8 Festivals, 15+ Animations, Plans, Admin)
└── docker/
    ├── Dockerfile.api
    ├── Dockerfile.web
    └── docker-compose.yml
```

---

## 3. Quick Start (Local Development)

### Prerequisites
- Node.js >= 20
- pnpm >= 9
- PostgreSQL (running on port 5432)
- Redis (running on port 6379)

### 1. Install Dependencies
```bash
pnpm install
```

### 2. Build Shared Framework Packages
```bash
pnpm --filter @festiveui/types build
pnpm --filter @festiveui/core build
pnpm --filter @festiveui/react build
pnpm --filter @festiveui/next build
pnpm --filter @festiveui/vue build
pnpm --filter @festiveui/angular build
pnpm --filter @festiveui/web-component build
```

### 3. Setup Database Schema & Seed Data
```bash
# Push schema to PostgreSQL
pnpm prisma db push --schema=prisma/schema.prisma

# Seed 8 festivals, 15+ working animations, plans, admin and developer users
npx ts-node --transpile-only prisma/seed.ts
```

### 4. Start Development Servers
```bash
# Start NestJS API (Port 4000)
pnpm --filter @festiveui/api run dev

# Start Next.js Web & Studio App (Port 3000)
pnpm --filter @festiveui/web run dev
```

- **Frontend & Visual Studio:** `http://localhost:3000`
- **REST API Endpoints:** `http://localhost:4000/api/v1`
- **Interactive Swagger Docs:** `http://localhost:4000/api/docs`

---

## 4. Default Seed Credentials
- **Super Administrator:** `admin@festiveui.com` / `Festive@2026!`
- **Developer User:** `developer@festiveui.com` / `Festive@2026!`

---

## 5. Automated Tests
```bash
# Run NestJS Unit & Integration Test Suites
pnpm --filter @festiveui/api test
```
All 14 test suites cover authentication, role-based guards, API key rotation, editor snapshot versions, and payment license generation.

---

## 6. Docker Production Deployment
```bash
docker-compose up --build -d
```
Runs PostgreSQL 16, Redis 7, FestiveUI API, and FestiveUI Web under a shared container network.
