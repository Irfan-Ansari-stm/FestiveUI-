# FestiveUI — System Architecture Document
**Version:** 1.0.0  
**Status:** Approved for Implementation  
**Architect:** Senior Software & Systems Architect  

---

## 1. Executive Summary & Vision
**FestiveUI** is an enterprise-grade, multi-tenant festival and event animation platform and visual studio. It bridges high-performance creative animation engines with modern frontend workflows, enabling developers and marketing teams to visually compose, customize, and seamlessly mount festive decorations (Diwali, Holi, Christmas, New Year, Eid, Valentine's, Halloween, Independence Day, and custom events) across any modern web stack (React, Next.js, Vue, Angular, Vanilla JS, and Web Components).

---

## 2. Monorepo & Package Architecture
The repository uses a high-performance **pnpm workspace** orchestrated with **Turborepo**:

```
festiveui/
├── apps/
│   ├── api/                    # NestJS REST API, Swagger, JWT Auth, RBAC, Redis, Stripe/Razorpay
│   └── web/                    # Next.js App Router (Public Site, Marketplace, Dashboard, Studio, Docs, Admin)
├── packages/
│   ├── core/                   # Framework-independent Animation Runtime Engine (Canvas, SVG, CSS, Lottie)
│   ├── react/                  # React component wrappers & hooks for @festiveui/core
│   ├── next/                   # Next.js SSR-safe adapters & client boundaries
│   ├── vue/                    # Vue 3 composables & components
│   ├── angular/                # Angular standalone components & directives
│   ├── web-component/          # W3C Custom Elements (<festive-animation>)
│   └── types/                  # Shared domain types, DTO contracts, animation schemas
├── prisma/
│   ├── schema.prisma           # 35+ normalized relational tables in PostgreSQL
│   └── seed.ts                 # Full seed data (Festivals, 15+ Animations, Plans, Roles, Admin)
├── docker/
│   ├── Dockerfile.api
│   ├── Dockerfile.web
│   └── docker-compose.yml
└── tests/                      # Global E2E & integration test suites
```

---

## 3. Database Architecture (PostgreSQL + Prisma)
The data layer is modeled in PostgreSQL with UUID primary keys, strict foreign key constraints, indexes on high-cardinality fields, soft deletion, and JSONB schemas:

### Core Entity Relationships:
1. **Identity & RBAC:** `users`, `user_profiles`, `roles`, `permissions`, `user_roles`, `audit_logs`
2. **Catalog & Assets:** `festivals`, `festival_collections`, `categories`, `tags`, `animations`, `animation_versions`, `animation_assets`, `animation_schemas`, `animation_tags`
3. **Developer Projects:** `projects`, `project_domains`, `project_api_keys`, `project_installations`, `api_logs`, `usage_logs`
4. **Visual Studio & State:** `editor_documents`, `editor_document_versions`
5. **Commerce & Monetization:** `subscription_plans`, `subscriptions`, `orders`, `order_items`, `payments`, `invoices`, `coupons`, `licenses`, `favorites`, `reviews`
6. **Communication:** `notifications`

---

## 4. Backend System Architecture (NestJS)
- **Modular Design:** `AuthModule`, `UsersModule`, `FestivalsModule`, `AnimationsModule`, `MarketplaceModule`, `ProjectsModule`, `ApiKeysModule`, `EditorModule`, `PaymentsModule`, `SubscriptionsModule`, `AdminModule`, `AnalyticsModule`, `AuditLogsModule`.
- **Security & Validation:**
  - Password hashing with Argon2id.
  - JWT Access (15m) + Rotating Refresh Tokens (7d) stored securely.
  - Role-Based Access Control (`SUPER_ADMIN`, `ADMIN`, `DEVELOPER`, `USER`) via NestJS Guards.
  - Domain-restricted API key validation middleware for developer SDK requests.
  - Global `ValidationPipe` with strict `class-validator` and `class-transformer`.
  - Rate limiting with `@nestjs/throttler` backed by Redis.
  - Content Security Policy and sanitized SVG validation.
- **REST APIs:** Versioned under `/api/v1/`, documented via OpenAPI / Swagger at `/api/docs`.

---

## 5. Animation Engine Architecture (`@festiveui/core`)
The animation engine is strictly framework-independent:
- **Modular Renderer Pipeline:**
  - `CanvasParticleRenderer`: High-performance particle physics (confetti, fireworks, color powder, snow).
  - `SvgGlowRenderer`: Scalable vector graphics with animated filter gradients and flickering glows (diyas, lanterns, crescent moons).
  - `CssMotionRenderer`: Lightweight hardware-accelerated CSS keyframe decorations (floating elements, festive borders).
- **Targeting Modes:**
  - `Mode A (Standalone Canvas)`: Full viewport or isolated container overlay with pointer-events passthrough.
  - `Mode B (Element/Selector Targeting)`: Binds animations to specific DOM nodes (e.g. `#main-nav`, `.hero-title`, `.product-card`) using `ResizeObserver` and `MutationObserver` with automatic unmount on DOM removal.
- **Performance & Accessibility:**
  - Automatic pause when out of viewport (`IntersectionObserver`).
  - Automatic `prefers-reduced-motion` compliance.
  - High-frequency RAF loops decoupled from the main thread where applicable.
  - Zero memory leaks: comprehensive `destroy()` lifecycle teardown.

---

## 6. Visual Animation Studio Architecture
A modern desktop-grade web application built in Next.js + Zustand + Tailwind CSS:
- **State Engine:** Time-traveling state machine (undo/redo stack) managing elements, positions, transformations, layers, z-indexes, and custom properties.
- **Schema-Driven Inspector:** Automatically renders controls (color pickers, sliders, toggles, selectors) based on the animation's declarative JSON schema.
- **Live Interactive Canvas:** Drag, drop, resize, rotate, multi-select, zoom (25% - 200%), and responsive preview toggles (Desktop 1440px, Tablet 768px, Mobile 375px).
- **Code Export Engine:** Generates idiomatic, executable integration code for React, Next.js, Vue, Angular, Vanilla JS, and Web Components with live syntax highlighting and copy-to-clipboard.

---

## 7. Monetization & Payment Architecture
- Payment provider abstraction layer: `PaymentProvider` interface implemented by `StripeService`, `RazorpayService`, and `MockPaymentService` (for local development and CI testing).
- Webhook idempotency with signature validation.
- Commercial license generation with cryptographically verifiable keys and domain binding.
