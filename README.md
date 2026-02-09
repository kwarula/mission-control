# 🎯 Mission Control — VibeGen

A real-time dashboard for managing VibeGen operations. Built with Next.js 14, Convex, TypeScript, and Tailwind CSS.

![Mission Control](https://img.shields.io/badge/Next.js-14-black?style=flat-square&logo=next.js)
![Convex](https://img.shields.io/badge/Convex-Real--time-orange?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Tailwind](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=flat-square&logo=tailwind-css)

## ✨ Features

### 📊 Activity Feed
- Real-time logging of all VibeGen actions
- Action type icons (deploy, social, content, email, analytics, etc.)
- Status indicators with color coding (success, error, pending, info)
- Timestamp tracking with relative time display
- Filter by status
- Add new activity entries
- Seed sample data for demo

### 📅 Calendar View
- Weekly grid view of scheduled tasks
- Navigate between weeks
- Color-coded task blocks with duration
- Add new tasks with priority, duration, and color
- Click tasks to view details
- Complete or delete tasks inline
- Today highlight

### 🔍 Global Search
- Instant search across all data types
- Filter by type: Memories, Documents, Tasks, Activities
- Debounced search input for performance
- Result counts per category
- Metadata display for each result
- Real-time results powered by Convex search indexes

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Convex account (free tier available)

### Setup

```bash
# Clone the repository
git clone https://github.com/kwarula/mission-control.git
cd mission-control

# Install dependencies
npm install

# Set up Convex
npx convex dev

# Start development server
npm run dev
```

### Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_CONVEX_URL=your_convex_deployment_url
```

## 🏗️ Architecture

```
mission-control/
├── convex/                 # Convex backend
│   ├── schema.ts          # Database schema
│   ├── activities.ts      # Activity CRUD + search
│   ├── tasks.ts           # Task CRUD + search
│   ├── documents.ts       # Document CRUD + search
│   ├── memories.ts        # Memory CRUD + search
│   └── seed.ts            # Sample data seeding
├── src/
│   ├── app/               # Next.js App Router
│   │   ├── layout.tsx     # Root layout with sidebar
│   │   ├── page.tsx       # Activity Feed (home)
│   │   ├── calendar/      # Calendar view
│   │   └── search/        # Global search
│   ├── components/        # React components
│   │   ├── ActivityFeed.tsx
│   │   ├── CalendarView.tsx
│   │   ├── GlobalSearch.tsx
│   │   ├── Sidebar.tsx
│   │   └── ConvexClientProvider.tsx
│   └── lib/
│       └── utils.ts       # Utility functions
└── tailwind.config.ts     # Tailwind configuration
```

## 🎨 Design System

- **Dark theme** with glass-morphism cards
- **Brand colors**: Electric Blue palette (#4c6ef5)
- **Status colors**: Emerald (success), Red (error), Amber (pending), Blue (info)
- **Animations**: Fade-in, slide-up, pulse effects
- **Responsive**: Mobile-first with sidebar drawer

## 📦 Tech Stack

| Technology | Purpose |
|-----------|---------|
| Next.js 14 | React framework with App Router |
| Convex | Real-time database & backend |
| TypeScript | Type safety |
| Tailwind CSS | Utility-first styling |
| date-fns | Date manipulation |
| Lucide React | Icon library |

## 🚀 Deployment

### Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

Set the `NEXT_PUBLIC_CONVEX_URL` environment variable in your Vercel project settings.

### Convex

```bash
# Deploy Convex functions to production
npx convex deploy
```

## 📄 License

MIT — Built with ❤️ for VibeGen
