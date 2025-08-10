# uPrayers Fix Pack

## What this adds
- Generate Prayer shows the prayer under the button with three choices: Generate New, Copy, Post.
- Prayer Wall shows newest first with a Load more button (pages of 20).
- Religion appears alongside name/location.
- Spam/abuse filter and duplicate prevention.

## Setup

1. Copy `.env.example` to `.env` and fill in your real values.
2. Install packages:
   ```bash
   npm i openai zod @prisma/client prisma
   npm i -D vitest ts-node @types/node @types/jest
   ```
3. Prisma:
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```
   If updating an existing DB, you may run:
   ```bash
   npx prisma migrate dev --name add_prayer_uniques
   ```
4. Run locally:
   ```bash
   npm run dev
   ```
5. Deploy: make sure your host runs `npx prisma migrate deploy` before build.
