# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CETé (Conseil Expertise Technique Électricité) — a French-language showcase website for an independent electrical risk rating agency. Phase 1 is a static site with mock data; Phase 2 will integrate Supabase for real auth and database.

## Commands

```bash
npm run dev          # Start Next.js dev server
npm run build        # Production build (runs lint first via prebuild)
npm run lint         # ESLint check
npm run lint:lines   # Custom script: enforces max 250 lines per page/section file (warns at 150)
```

No test framework is configured yet.

## Architecture

### Tech Stack
- **Next.js 16** (App Router, React 19, Server Components by default)
- **TypeScript** (strict mode, path alias `@/*` → `./src/*`)
- **Tailwind CSS v4** (PostCSS-first, no tailwind.config — uses CSS variables in globals.css)
- **shadcn/ui** (new-york style, RSC-enabled) + Radix UI + Lucide icons
- **React Hook Form + Zod** for form validation

### Route Structure
- `src/app/(public)/` — 5 public pages: `/`, `/a-propos`, `/expertise`, `/services`, `/contact`
- `src/app/client/` — Protected client area (mock auth, localStorage)
- `src/app/admin/` — Protected admin area (mock auth, localStorage)

Each route group has its own layout. Public layout wraps Header + Footer. Client/admin layouts check auth and redirect to login if unauthorized.

### Data Layer
All content comes from typed JSON files in `src/data/mocks/`. The `src/lib/data-loader.ts` module imports these and exposes typed getter functions (e.g., `getFounders()`, `getServices()`, `getExpertiseServices()`). Services are filtered by `category: "Expertise" | "Conseil"`.

### Component Organization
- `src/components/ui/` — shadcn/ui primitives (button, card, dialog, form, sheet, etc.)
- `src/components/common/` — Header, Footer
- `src/components/sections/` — Reusable section components, organized by page:
  - `sections/home/` — HomeHero, HomeStats, HomePillars, HomeADN, HomeServices, etc.
  - `sections/about/` — AboutHero, AboutOriginStory, AboutStats, etc.
  - `sections/expertise/` — ExpertiseHero, ExpertiseADN, ExpertiseServices, etc.
  - `sections/services/` — ServiceHero, ServicesGrid, ProcessSection, etc.
  - Plus shared components: ContactForm, ContactInfo, HeroSection, FoundersGrid, etc.

### Auth (Mock)
`src/lib/auth.ts` provides `login()`, `logout()`, `getUser()`, `isAdmin()`, `isClient()` — all backed by localStorage. `src/lib/auth-context.tsx` exposes `AuthProvider` and `useAuth()` hook.

Demo credentials: `demo@cete.fr` / `Cete2026` (client), `admin@cete.fr` / `Admin2026` (admin).

### Types
All interfaces live in `src/types/` with a barrel export in `index.ts`. Key types: `Founder`, `Service`, `Pillar`, `Value`, `AuthUser`, `ClientDocument`, `ContactInfo`.

## Conventions

- **Language**: All UI copy, data, and content is in French.
- **File size limits**: Page files and section components must stay under 250 lines (warning at 150). Extract sections into `src/components/sections/<page>/` subdirectories.
- **Client components**: Only mark `"use client"` when required (hooks, event handlers, browser APIs). Default to server components.
- **Styling**: Tailwind utilities only — no CSS modules or styled-components. Custom animations and brand CSS variables are defined in `src/app/globals.css`.
- **Fonts**: Inter (body) and Merriweather (display) via next/font Google.
- **Brand colors (CSS vars)**:
  - Primary: `#4DA6D9` (sky blue), `#1A7AB5` (deep), `#0D5A8A` (ultra)
  - Accent: `#E8630A` (orange TST), `#F59542` (light), `#B84D08` (dark)
  - Text: `#1A2940` (primary), `#4A6580` (secondary), `#8AA5BE` (muted)
  - Backgrounds: `#FFFFFF` (main), `#F4F9FD` (soft), `#DAEEF8` (gradient start)
  - Footer: `#1A2940` (dark blue night)
- **Design motif**: Translucent blue bubbles (`rgba(77,166,217,0.08–0.15)`) as decorative background elements on heroes and key sections. No orange bubbles, no text inside bubbles.
- **Icons**: Lucide React exclusively. Icon names in JSON data match Lucide icon identifiers.
- **Imports**: Use `@/` path alias for all src imports.
- **No `any` types**: Strict TypeScript — all data is typed through interfaces.
