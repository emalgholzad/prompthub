# PromptHub MVP

PromptHub is a minimal production-ready MVP built with Next.js 15, TypeScript, Tailwind, shadcn-style UI components, Prisma, PostgreSQL, and NextAuth Google login.

## Features

- Google authentication (sign in / sign out)
- Public prompt feed with pagination
- Prompt detail page with shareable slug links
- Prompt creation for authenticated users
- Unlisted prompt support (direct-link access only)
- Like/unlike with transaction-safe denormalized `likeCount`
- Personal dashboard for your prompts
- Client + server validation with Zod
- Server Actions for all mutations

## Environment Variables

Create `.env` with:

```bash
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/prompthub"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="replace-with-random-secret"
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

## Setup

```bash
npm install
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

Open http://localhost:3000.

## Routes

- `/` public feed
- `/p/[slug]` prompt detail
- `/dashboard` authenticated user prompts
- `/dashboard/new` create prompt form
- `/api/auth/[...nextauth]` auth route
