# Cleaver App

Social media web app. Next.js 14 App Router + Supabase + Tailwind CSS.

## Stack
- Next.js 14 (App Router, src/ directory)
- Supabase (Auth, Postgres + RLS, Storage)
- Tailwind CSS (dark theme, mobile-first)
- TypeScript

## Key Patterns
- Server components for data fetching, client components for interactivity
- Supabase RLS enforces all authorization at DB level
- Two admin accounts (Cleaver, Dagger) are the only content creators
- All users auto-follow both admins on signup

## Commands
- `npm run dev` — local dev server
- `npm test` — run tests
- `npm run build` — production build

## Spec
See `docs/superpowers/specs/2026-03-20-cleaver-app-design.md` in parent directory
