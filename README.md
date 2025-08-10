# uPrayers — Complete Starter

## What you have
- Next.js app with API routes
- Prisma schema + client
- Generate Prayer UX (Generate / Copy / Post)
- Prayer Wall with paging (Load more), newest first
- Duplicate prevention and basic moderation

## Setup (local)
1) Copy `.env.example` to `.env` and fill in your values.
2) Install packages:
   npm i
3) Prisma:
   npx prisma migrate dev --name init
   npx prisma generate
4) Run:
   npm run dev
5) Open http://localhost:3000

## Deploy
- Set environment variables on your host (DATABASE_URL, OPENAI_API_KEY, OPENAI_MODEL).
- Ensure your host runs: npx prisma migrate deploy before build/start.
