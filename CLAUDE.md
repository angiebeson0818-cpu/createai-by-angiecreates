# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

CREATEai by angieCREATEs is a premium AI-powered fashion platform with 7 modular AI studios. It is a monorepo combining a **Motoko backend** running on the **Internet Computer (ICP) blockchain** with a **TypeScript/React frontend**. The two layers communicate via auto-generated TypeScript bindings.

## Commands

### Frontend (run from `src/frontend/`)

```bash
pnpm install --prefer-offline   # install dependencies
pnpm dev                        # start Vite dev server
pnpm typecheck                  # tsc --noEmit
pnpm check                      # Biome lint check
pnpm fix                        # Biome lint + auto-fix
pnpm build                      # production build
```

### Backend (run from `src/backend/`)

```bash
mops install        # install Motoko packages
mops check --fix    # typecheck and fix
mops build          # compile Motoko → .did interface
```

### Integration (run from repo root)

```bash
pnpm bindgen   # regenerate TypeScript bindings from src/backend/dist/backend.did into src/frontend/src/
```

**Always run `pnpm bindgen` from the root after any backend interface changes** before working on the frontend — it regenerates `backend.ts` and `backend.d.ts` in `src/frontend/src/`.

## Architecture

```
/
├── src/backend/          # Motoko canister (ICP blockchain)
│   ├── main.mo           # entry point
│   ├── dist/backend.did  # compiled Candid interface (source for bindgen)
│   └── mops.toml         # Motoko package manager config
├── src/frontend/         # React/TypeScript SPA
│   └── src/
│       ├── App.tsx
│       ├── main.tsx
│       ├── backend.ts / backend.d.ts   # auto-generated — do not edit manually
│       ├── pages/        # route-level components
│       │   └── studio/   # individual AI studio pages
│       ├── components/
│       │   ├── layout/   # Navbar, Footer
│       │   ├── ui/       # shadcn/Radix-based primitives
│       │   ├── AuthModal.tsx
│       │   ├── FeatureCard.tsx
│       │   └── StudioCard.tsx
│       ├── hooks/
│       ├── lib/
│       ├── utils/
│       ├── data/
│       ├── types/
│       └── constants/
├── DESIGN.md             # authoritative design system spec
├── AGENTS.md             # verified commands and learnings (update when discovering new facts)
└── project.json          # feature list and platform metadata
```

### Frontend Stack

- **Routing**: TanStack Router (`@tanstack/react-router`)
- **Data fetching**: TanStack Query (`@tanstack/react-query`)
- **State**: Zustand
- **UI primitives**: Radix UI (full suite) + shadcn conventions + `class-variance-authority`/`clsx`/`tailwind-merge`
- **Styling**: Tailwind CSS v3 with custom design tokens (see below)
- **Animation**: `motion` (Motion for React), custom CSS keyframes
- **3D**: Three.js via `@react-three/fiber` + `@react-three/drei` + `@react-three/cannon`
- **ICP auth**: `@dfinity/auth-client`, `@dfinity/identity`, `@icp-sdk/core`
- **Linter/formatter**: Biome (not ESLint/Prettier)

## Design System Conventions

All visual rules are authoritative in `DESIGN.md`. Key constraints:

- **Colors**: oklch color space via CSS variables only — never hex/rgb literals, never Tailwind arbitrary values
- **Shadows**: only `gold-glow` or explicit `box-shadow` — no default Tailwind shadows
- **Dark mode only**: no light mode variant exists
- **Fonts**: Playfair Display (headings), Plus Jakarta Sans (body) — no system font fallbacks
- **Shimmer**: the `onyx-shimmer` (3s) gold gradient animation belongs on headings and brand elements only — use sparingly

### Animation Classes

| Class | Use |
|---|---|
| `onyx-shimmer` | Continuous gold shimmer on heading text |
| `onyx-shimmer-border` | Overlay shimmer via `::after` pseudo-element |
| `card-hover` | Hover lift + gold glow on cards |
| `fade-up` | Entrance fade-in + slide up |

### Structural Zones

- **Navbar**: `bg-card` + `border-b border-gold/20`
- **Hero**: `hero-overlay` gradient, `gradient-text` on title
- **Studio cards**: `bg-card`, `onyx-shimmer` on title, `card-hover` on hover
- **Footer**: `bg-sidebar` + `border-t border-gold/10`

## TypeScript Configuration

Root `tsconfig.json` applies to the whole monorepo: strict mode on, `strictPropertyInitialization` off (intentional for framework patterns), `experimentalDecorators` enabled, `allowJs` enabled. The `outDir: "HACK_BECAUSE_OF_ALLOW_JS"` is a known workaround — do not remove it.

## Backend / ICP Notes

- The backend is a **Motoko actor** deployed as an ICP canister — it is not a Node.js or REST server.
- `icp.yaml` and `canister.yaml` control canister deployment configuration.
- Frontend calls backend methods via the generated actor in `src/frontend/src/backend.ts` — treat this file as read-only; it is always overwritten by `pnpm bindgen`.
