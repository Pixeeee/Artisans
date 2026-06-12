# Vercel Supabase Expo Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Prepare ArtisanS for website and mobile deployment with one shared Supabase backend and one product flow.

**Architecture:** The Next.js app deploys to Vercel and owns server-only payment/certificate APIs. The Expo app deploys through EAS, uses Supabase anon/RLS for shared user data, and calls the deployed web API for Stellar-sensitive actions.

**Tech Stack:** Next.js, Expo Router, Supabase, Stellar Testnet, Vercel, EAS Build, GitHub Actions.

---

### Task 1: Mobile Runtime Configuration

**Files:**
- Create: `apps/mobile/src/env.ts`
- Create: `apps/mobile/src/supabase.ts`
- Create: `apps/mobile/src/api.ts`
- Modify: `apps/mobile/package.json`

- [x] **Step 1: Add mobile env parsing**

Create `apps/mobile/src/env.ts` with public Expo variables for Supabase, API base URL, and Stellar Testnet.

- [x] **Step 2: Add Supabase mobile client**

Create `apps/mobile/src/supabase.ts` using `@supabase/supabase-js`, React Native URL polyfill, and AsyncStorage-backed auth persistence.

- [x] **Step 3: Add deployed API fetch helper**

Create `apps/mobile/src/api.ts` so mobile can call `/api/orders`, `/api/payments/stellar/build`, `/api/payments/stellar/confirm`, and certificate verification on the deployed web API.

- [x] **Step 4: Install runtime dependencies**

Run:

```powershell
npm.cmd install @supabase/supabase-js react-native-url-polyfill @react-native-async-storage/async-storage -w @artisans/mobile
```

Expected: package and lock files include the new mobile dependencies.

### Task 2: Deployment Profiles

**Files:**
- Create: `apps/mobile/eas.json`
- Create: `apps/web/vercel.json`
- Create: `apps/mobile/.env.example`
- Create: `apps/web/.env.example`
- Modify: `.env.example`
- Modify: `package.json`

- [x] **Step 1: Add EAS profiles**

Add development, preview, and production profiles. Preview Android builds use APK for easy internal testing.

- [x] **Step 2: Add Vercel monorepo settings**

Add `apps/web/vercel.json` so Vercel installs from the workspace root and builds shared + web packages.

- [x] **Step 3: Add env examples**

Document the web env vars and mobile `EXPO_PUBLIC_*` env vars without committing secrets.

- [x] **Step 4: Add root deploy scripts**

Expose root commands for web build and Expo preview/production builds.

### Task 3: Deployment Documentation

**Files:**
- Create: `docs/deployment-vercel-supabase-expo.md`
- Modify: `docs/deployment-runbook.md`
- Modify: `README.md`

- [x] **Step 1: Document one-database architecture**

Add the Vercel + Expo + Supabase flow and define the security boundary between public clients and server-only API routes.

- [x] **Step 2: Document Supabase setup**

List migration order, RLS checks, storage requirements, and auth redirect configuration.

- [x] **Step 3: Document Vercel setup**

List Vercel project settings and required environment variables.

- [x] **Step 4: Document Expo EAS setup**

List EAS initialization, environment variables, preview builds, production builds, and store requirements.

### Task 4: CI Support

**Files:**
- Create: `.github/workflows/eas-preview.yml`

- [x] **Step 1: Add manual mobile preview workflow**

Create a `workflow_dispatch` action that runs EAS preview builds using `EXPO_TOKEN` and GitHub repository variables.

### Task 5: Verification

**Files:**
- Verify: `package-lock.json`
- Verify: TypeScript project files

- [x] **Step 1: Run typecheck**

Run:

```powershell
npm.cmd run typecheck
```

Expected: all workspaces typecheck.

- [x] **Step 2: Run tests**

Run:

```powershell
npm.cmd test
```

Expected: shared and web TypeScript tests pass.

- [x] **Step 3: Run production build**

Run:

```powershell
npm.cmd run build
```

Expected: shared and web production builds pass.
