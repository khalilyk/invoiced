# Project: [PROJECT_NAME]

Brief one-line description of what this app does and who it's for.

Built by Not Normal (thisisnn.com). Internal project or client build: [specify].

---

## Tech Stack

- **Framework**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS
- **UI components**: shadcn/ui (Radix primitives under the hood)
- **Icons**: lucide-react
- **Routing**: React Router v6
- **Backend**: Supabase (Postgres + Auth + Storage + Edge Functions)
- **Forms**: react-hook-form + zod for validation
- **State**: React state first, TanStack Query for server state, Zustand only if global client state is genuinely needed
- **Deployment**: [Framer / Vercel / Netlify / Cloudflare Pages]

Do not introduce new dependencies without a clear reason. Justify additions in the commit message.

---

## Commands

```bash
npm run dev         # Start dev server on :5173
npm run build       # Production build to /dist
npm run preview     # Preview the production build locally
npm run lint        # ESLint
npm run typecheck   # tsc --noEmit
```

Always run `npm run typecheck` and `npm run lint` before committing.

---

## Folder Structure

```
src/
  components/        # Reusable components
    ui/              # shadcn/ui components (do not edit generated files manually)
    [feature]/       # Feature-specific components grouped by domain
  pages/             # Route-level components
  hooks/             # Custom React hooks, prefixed with use-
  lib/               # Utilities, Supabase client, helpers
    supabase.ts      # Supabase client instance
    utils.ts         # cn() helper and general utilities
  types/             # Shared TypeScript types
  styles/            # Global CSS, tokens
public/              # Static assets
```

Path alias `@/` points to `src/`. Use it everywhere instead of relative `../../` imports.

---

## Coding Conventions

### TypeScript

- Strict mode is on. No `any` unless there's a comment explaining why.
- Prefer `type` over `interface` for component props and data shapes.
- Use `as const` for literal unions.
- Co-locate component-specific types inside the component file. Shared types go in `src/types/`.

### React

- Functional components only.
- Named exports for components, default exports only for route/page components.
- Keep components under 200 lines. If they grow beyond that, split them.
- Custom hooks live in `src/hooks/` and always start with `use-`.
- Use `React.memo` sparingly, only after measuring a real problem.

### Styling

- Tailwind only. No inline `style` attributes except for dynamic values that can't be expressed as utilities.
- Use the `cn()` helper from `lib/utils.ts` for conditional classes.
- Follow shadcn/ui conventions for variants (use `class-variance-authority`).
- Design tokens live in `tailwind.config.ts` and `src/index.css` under `:root`. Never hardcode brand colours in components.

### Forms

- All forms use `react-hook-form` with `zod` resolvers.
- Schema lives next to the form component or in a nearby `schema.ts` file.
- Never submit without client-side validation.

---

## Supabase Patterns

### Client

The Supabase client is initialised once in `src/lib/supabase.ts` using `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`. Never import `createClient` directly anywhere else.

### Queries

- Use TanStack Query for all Supabase reads. Query keys are arrays, structured as `['resource', id, filters]`.
- Mutations use `useMutation` and invalidate relevant queries on success.
- Row Level Security (RLS) is enabled on every table. Never disable it.
- Never expose the service role key to the client. Use Edge Functions for any privileged operations.

### Types

Generate Supabase types into `src/types/database.ts` using the Supabase CLI. Import typed clients from there, not hand-written types.

```bash
npx supabase gen types typescript --project-id [ID] > src/types/database.ts
```

### Auth

- Use Supabase Auth helpers. Wrap protected routes in an `<AuthGuard>` component.
- Session state lives in a single `useSession` hook. Do not duplicate auth logic.

---

## Brand Voice (for any UI copy, error messages, empty states, emails)

Not Normal's voice is:

- **Punchy**: Short sentences. Strong verbs. Cut filler.
- **Direct**: Say what you mean. No hedging, no corporate softening.
- **Opinionated**: We have a point of view. We back it.
- **Editorial**: Think magazine, not agency deck.

**Avoid**: "Leverage", "unlock", "seamless", "cutting-edge", "best-in-class", "innovative solution", "revolutionise", "game-changer", "synergy", and any generic SaaS or agency filler.

**Tone examples**:

- Empty state, generic: "No results found. Try adjusting your filters." ❌
- Empty state, Not Normal: "Nothing here yet. Start somewhere." ✅

- Error, generic: "Oops! Something went wrong. Please try again." ❌
- Error, Not Normal: "That didn't work. Refresh and try again." ✅

- CTA, generic: "Get Started Today!" ❌
- CTA, Not Normal: "Start now." ✅

When generating copy, always ask: would this fit in an editorial, or does it sound like a landing page template? Aim for editorial.

---

## Git Conventions

### Branches

- `main` is always deployable.
- Feature branches: `feat/short-description`
- Fixes: `fix/short-description`
- Chores: `chore/short-description`

### Commits

Conventional commits. Lowercase. Present tense.

```
feat: add pricing page with three tiers
fix: correct Supabase session refresh bug
chore: bump tailwind to 3.4
refactor: extract booking form into its own component
docs: update readme with env vars
```

One logical change per commit. If you can't describe it in one line, split it.

### PRs (if working on client projects with review)

- PR title follows the same format as commits.
- Body: what, why, how to test. Screenshots for any UI change.

---

## Environment Variables

All env vars are prefixed with `VITE_` for client exposure. Server-only secrets (service role keys, third-party API keys) live in Supabase Edge Function secrets, never in the frontend.

Required:
```
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

Always keep `.env.example` up to date. Never commit `.env` or `.env.local`.

---

## What Not to Do

- Don't edit files in `src/components/ui/` manually (they're shadcn generated). If you need changes, wrap or extend the component.
- Don't add CSS frameworks alongside Tailwind (no Bootstrap, no Material, no Chakra).
- Don't use `useEffect` for derived state. Compute it during render or use `useMemo`.
- Don't fetch data in components without TanStack Query.
- Don't hardcode Supabase URLs, keys, or any credential.
- Don't ship `console.log`. Use a logger utility or strip them before build.
- Don't write copy in a generic SaaS voice. See Brand Voice section.

---

## When Asked to Build a Feature

1. Confirm the scope in one or two sentences before writing code.
2. List the files you'll create or modify.
3. Check if there's an existing pattern in the codebase to follow.
4. Write the code.
5. Run typecheck and lint.
6. Summarise what changed and what the next logical step would be.
