# 🚀 Mission Control — Deployment Guide

## Step 1: Set up Convex Backend

1. Go to [dashboard.convex.dev](https://dashboard.convex.dev)
2. Sign up / sign in (GitHub login works great)
3. Click **"New Project"** → name it `mission-control`
4. Copy the **Deployment URL** (looks like `https://your-project-123.convex.cloud`)

### Push schema to Convex:
```bash
cd mission-control
npx convex dev --once
```

### Seed sample data:
```bash
npx convex run seed:seedData
```

## Step 2: Deploy to Vercel

### Option A: Import from GitHub (Recommended)
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import `kwarula/mission-control` repository
3. Add environment variable:
   - `NEXT_PUBLIC_CONVEX_URL` = your Convex deployment URL
4. Click Deploy

### Option B: CLI Deploy
```bash
# Login
vercel login

# Deploy (follow prompts)
vercel --prod

# Set env var
vercel env add NEXT_PUBLIC_CONVEX_URL
```

## Step 3: Deploy Convex to Production

```bash
npx convex deploy
```

This pushes your Convex functions to the production deployment.

## Environment Variables

| Variable | Where | Value |
|----------|-------|-------|
| `NEXT_PUBLIC_CONVEX_URL` | Vercel | Your Convex deployment URL |

## Local Development

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Next.js
npm run dev
```

Visit `http://localhost:3000`
