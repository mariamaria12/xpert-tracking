# TrackingXpert

Internal operations dashboard for manufacturing and production teams. Track projects through the full lifecycle, manage clients and people, log time, and review pipeline analytics from a single workspace.

**Live demo:** [https://xpert-tracking.vercel.app/](https://xpert-tracking.vercel.app/)

## Demo login

Use these credentials on the deployed Vercel app:

| Field | Value |
| --- | --- |
| Email | `test@test.com` |
| Password | `test123` |

## Features

- **Home** — KPIs, active projects and clients, project analytics (status, hours, overdue, client workload)
- **Projects** — Lifecycle statuses, estimated vs actual hours, worker counts
- **Clients** — Company records and project counts
- **People** — Team roster with weekly hours and last activity
- **Timesheet** — Time logs linked to employees and projects
- **Tools** — Placeholder for future integrations

## Tech stack

| Layer | Technology |
| --- | --- |
| Framework | [Next.js](https://nextjs.org/) 16, [React](https://react.dev/) 19 |
| Styling | [Tailwind CSS](https://tailwindcss.com/) |
| Charts | [Recharts](https://recharts.org/) |
| Database & auth | [Supabase](https://supabase.com/) |
| Hosting | [Vercel](https://vercel.com/) |

## Local development

### Prerequisites

- Node.js 20+
- A Supabase project with migrations applied

### Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables and fill in your Supabase values:

```bash
cp .env.example .env
```

Required variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`

3. Apply database migrations (if using a linked Supabase project):

```bash
npm run db:push
```

4. Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run start` | Run production server locally |
| `npm run lint` | Run ESLint |
| `npm run db:push` | Push Supabase migrations |
| `npm run db:reset` | Reset local Supabase database |
| `npm run db:types` | Generate TypeScript types from schema |

## Project structure

```
app/           # Next.js App Router (pages, UI, dashboard)
lib/           # Services, auth, Supabase clients, shared utilities
supabase/      # Migrations and seed data
```

Business logic lives in `lib/services/*` to keep UI components thin and testable.
