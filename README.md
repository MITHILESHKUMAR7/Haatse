# HaatSe - Disciplined B2B Agri Trade Network

HaatSe is built as a serious B2B trade platform for **Bihar-first bulk agriculture trading**.
It is not an open bargaining marketplace. It is a commitment-driven system where locked deals are final.

---

## 1) Architecture Overview (Simple Language)

HaatSe has two main parts:

1. **Backend (`/backend`)**
   - Handles business rules and data
   - Built with **Node.js + Express + PostgreSQL + Prisma**
   - Controls role access (Farmer, Buyer, Admin)
   - Enforces rules like minimum order (100 kg), default actions, commission

2. **Frontend (`/frontend`)**
   - Web app used by farmers, buyers, and admins
   - Built with **Next.js (React)**
   - Focused on trust, clear actions, and operational clarity

Flow at high level:
- Farmer creates verified bulk listing
- Buyer locks deal (quantity and price become fixed)
- Admin monitors payment, defaults, and district-level discipline

---

## 2) Backend Folder Structure

```txt
/backend
  package.json
  .env.example
  /prisma
    schema.prisma
  /src
    app.js
    server.js
    prismaClient.js
    /routes
      authRoutes.js
      listingRoutes.js
      orderRoutes.js
      adminRoutes.js
    /controllers
      authController.js
      listingController.js
      orderController.js
      adminController.js
    /services
      authService.js
      listingService.js
      orderService.js
      adminService.js
    /middlewares
      authMiddleware.js
      errorMiddleware.js
    /utils
      businessRules.js
```

### What each backend file does

- `package.json`: backend dependencies and scripts.
- `.env.example`: sample environment variables.
- `prisma/schema.prisma`: all database models and enums.
- `src/app.js`: express app setup (middleware + routes).
- `src/server.js`: starts server.
- `src/prismaClient.js`: single Prisma client instance.
- `routes/*.js`: endpoint map per domain.
- `controllers/*.js`: HTTP request/response handlers.
- `services/*.js`: business logic and database operations.
- `middlewares/authMiddleware.js`: mock auth with role checks (replace later with OTP/JWT).
- `middlewares/errorMiddleware.js`: consistent API error responses.
- `utils/businessRules.js`: important constants/rule logic.

---

## 3) Prisma Schema Design

Main models included:
- `User`
- `FarmerProfile`
- `BuyerProfile`
- `Cluster`
- `ProductListing`
- `Order`
- `Transaction`
- `PaymentStatus`
- `District`
- `Blacklist`
- `Rating`
- `AppConfig` (for configurable settings like commission)

### Model purpose summary
- **User**: single identity table for all roles with phone login base.
- **FarmerProfile**: farmer-specific discipline state (defaults, suspension, ban).
- **BuyerProfile**: buyer-specific payment discipline state.
- **Cluster**: farmer grouping by district for controlled network growth.
- **District**: Bihar-first rollout units.
- **ProductListing**: bulk crop listings with minimum order and verification.
- **Order**: locked commitment contract with fixed quantity and price.
- **PaymentStatus**: escrow-style logical state (pending, paid, delayed, defaulted).
- **Transaction**: accounting-like entries (escrow, commission, payout).
- **Blacklist**: discipline and trust actions.
- **Rating**: post-trade trust signals.
- **AppConfig**: admin editable platform settings.

---

## 4) Express APIs (Core)

### Auth
- `POST /api/auth/register`
  - Create Farmer/Buyer user with profile.
- `POST /api/auth/verify-otp`
  - OTP placeholder for now.

### Listings
- `GET /api/listings`
  - Browse verified listings (supports filters).
- `POST /api/listings`
  - Farmer creates bulk listing (role protected).

### Orders / Commitment rules
- `POST /api/orders/lock`
  - Buyer locks deal.
  - Enforces minimum 100 kg.
  - Sets payment status + commission + transaction entries.
- `POST /api/orders/farmer-default`
  - Admin marks farmer default (warning/suspension/ban path).
- `POST /api/orders/buyer-delay`
  - Admin marks buyer payment delay (temporary suspension path).

### Admin
- `PATCH /api/admin/verify-user`
  - Verify or reject users.
- `PATCH /api/admin/commission`
  - Change commission to 2% or 3%.
- `POST /api/admin/clusters`
  - Create cluster.
- `GET /api/admin/analytics`
  - District-level aggregate view.

---

## 5) Frontend Folder Structure

```txt
/frontend
  package.json
  next.config.js
  /pages
    _app.js
    index.js
    login.js
    farmer-onboarding.js
    buyer-onboarding.js
    farmer-dashboard.js
    buyer-dashboard.js
    admin-dashboard.js
  /components
    Layout.js
  /services
    api.js
  /styles
    globals.css
```

### What each frontend file does

- `package.json`: frontend scripts and dependencies.
- `next.config.js`: Next.js runtime config.
- `pages/_app.js`: global app wrapper and styles.
- `pages/index.js`: trust-first landing page sections.
- `pages/login.js`: phone + OTP placeholder login screen.
- `pages/farmer-onboarding.js`: farmer registration form.
- `pages/buyer-onboarding.js`: buyer registration form.
- `pages/farmer-dashboard.js`: listing creation + status placeholders.
- `pages/buyer-dashboard.js`: listing browser + lock deal action.
- `pages/admin-dashboard.js`: commission and trust controls.
- `components/Layout.js`: shared simple header layout.
- `services/api.js`: basic fetch helper for API calls.
- `styles/globals.css`: plain, readable, trust-focused styling.

---

## 6) Data Flow: Farmer -> Buyer -> Admin

1. **Farmer onboarding**
   - Registers with phone number.
   - Admin verifies farmer.
   - Farmer joins cluster and creates listing.

2. **Buyer onboarding**
   - Registers with phone number.
   - Admin verifies buyer.
   - Buyer browses verified listings.

3. **Deal lock**
   - Buyer locks quantity + price (>= 100 kg).
   - System creates `Order`, `PaymentStatus`, `Transaction` entries.
   - Listing quantity is reduced or closed.

4. **Settlement discipline**
   - If farmer defaults: warning -> temporary suspension -> permanent ban.
   - If buyer delays payment: suspension + blacklist event.

5. **Admin governance**
   - Verifies users.
   - Manages clusters.
   - Changes commission.
   - Monitors analytics and blacklisting.

---

## 7) How you can edit business behavior later

### A) Change commission
- API way: call `PATCH /api/admin/commission` with `2` or `3`.
- Logic file: `backend/src/services/adminService.js`.
- Storage: `AppConfig` table (`commission_percent` key).

### B) Add districts
- Insert new rows in `District` table.
- Then use district IDs in onboarding, listings, and clusters.

### C) Modify rules
- Update constants and helper logic in:
  - `backend/src/utils/businessRules.js`
  - `backend/src/services/orderService.js`

Examples:
- To change minimum order from 100 kg to 200 kg, update `MINIMUM_ORDER_KG`.
- To change suspension duration, edit day values in `orderService.js`.

---

## 8) How to run locally (step by step)

### Prerequisites
- Node.js 18+
- PostgreSQL 14+

### Backend setup
1. `cd backend`
2. `cp .env.example .env`
3. Update `.env` with your PostgreSQL credentials.
4. `npm install`
5. `npx prisma migrate dev --name init`
6. `npx prisma generate`
7. `npm run dev`

Backend URL: `http://localhost:4000`

### Frontend setup
1. Open new terminal: `cd frontend`
2. `npm install`
3. (Optional) set API URL:
   - Linux/macOS: `export NEXT_PUBLIC_API_BASE=http://localhost:4000/api`
4. `npm run dev`

Frontend URL: `http://localhost:3000`

---

## Production Notes (important)

Before production launch, implement:
1. Real OTP provider + JWT auth.
2. Proper validation (Zod/Joi), rate limiting, and audit logs.
3. Real payment gateway + escrow account integration.
4. Background jobs for payment reminders/default checks.
5. CI/CD, monitoring, and backups.

This repository is intentionally clean and editable for a non-technical founder while still structured for a real engineering team.
