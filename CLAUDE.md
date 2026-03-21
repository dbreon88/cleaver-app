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

## Supabase Setup Required
1. Create Supabase project at supabase.com
2. Enable Google and Apple auth providers in Auth settings
3. Create storage buckets: `avatars` (public), `posts` (public)
4. Run migrations in order: 001_schema.sql, 002_rls_policies.sql, 003_seed_admins.sql, 004_auto_follow_function.sql
5. Create admin auth users and update 003_seed_admins.sql with their UUIDs
6. Copy .env.local.example to .env.local and fill in Supabase credentials

## Spec
See `docs/superpowers/specs/2026-03-20-cleaver-app-design.md` in parent directory
