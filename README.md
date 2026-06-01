<p align="center">
  <h1 align="center">🏴‍☠️ Stikkle</h1>
  <p align="center"><strong>AI-Powered Developer Work Copilot</strong></p>
  <p align="center">
    A unified engineering intelligence layer that aggregates your GitHub activity,<br/>
    detects blockers, and tells you exactly what to work on next.
  </p>
</p>

<p align="center">
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#architecture">Architecture</a> •
  <a href="#pages">Pages</a> •
  <a href="#contributing">Contributing</a>
</p>

---

## 🚨 Problem

Modern development workflows are fragmented across multiple tools:

- **GitHub** → code, PRs, issues, gists
- **Slack** → discussions and incident communication
- **CI/CD tools** → build status and failures

Developers constantly context-switch between these tools, losing focus and time. Critical issues are often missed or discovered too late.

## 💡 Solution

**Stikkle** solves this by acting as a **unified engineering intelligence layer**.

- 📊 **Aggregates** data from GitHub (repos, issues, PRs, gists)
- 🔗 **Correlates** PRs, issues, and activity signals
- 🚧 **Detects** blockers, stale work, and failures
- 🎯 **Recommends** what you should work on next — prioritized by urgency

> Instead of checking multiple tools, developers get **one intelligent dashboard**.

---

## Features

### 🧠 AI Recommendation Engine

An intelligent engine that analyzes your GitHub data and generates prioritized task suggestions:

| Signal | Detection |
|--------|-----------|
| Stale PRs | Open PRs idle >7 days (high) or >30 days (critical) |
| Bug Issues | Issues labeled `bug` or `critical` |
| Untriaged Repos | Popular repos with 10+ open issues |
| Idle Repos | Repos with no push in 90+ days |
| Draft PRs | Work-in-progress PRs that need finishing |
| Assigned Issues | Issues assigned to you that are aging |
| Feature Requests | Enhancement-labeled issues from the community |

Each recommendation includes a **priority level**, **category**, **AI-generated reason**, and a direct link to GitHub.

### 📊 Dashboard

A comprehensive overview of your engineering world:

- **Profile card** with GitHub stats
- **Stats cards** — total repos, open issues, open PRs
- **Recent PRs** and **open issues** in a side-by-side view
- **Interactive area chart** of repository activity over time
- **Activity feed** with real-time event stream
- **Repos data table** with sorting, filtering, and drag-and-drop column reordering

### 📡 Activity Feed

A unified timeline that merges:

- 🐛 Issues opened across your repos
- 🔀 Pull requests created and updated
- 📤 Recent pushes to repositories
- ⭐ Trending repos (starred repos gaining traction)

### 🏠 Landing Page

A scroll-animated marketing page with four phases:

1. **Hero** — Animated tagline with CTA
2. **Features** — Three feature cards with hover effects
3. **Showcase** — Dashboard preview mockup
4. **CTA** — Final call-to-action with gradient effects

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Runtime** | [React 19](https://react.dev/) |
| **Auth** | [NextAuth v4](https://next-auth.js.org/) — GitHub OAuth |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **UI Components** | [shadcn/ui](https://ui.shadcn.com/) + [Radix UI](https://www.radix-ui.com/) |
| **Animations** | [Framer Motion v12](https://www.framer.com/motion/) + [Lenis](https://lenis.darkroom.engineering/) |
| **Charts** | [Recharts](https://recharts.org/) |
| **Tables** | [TanStack Table](https://tanstack.com/table) + [dnd-kit](https://dndkit.com/) |
| **Database** | PostgreSQL + [Drizzle ORM](https://orm.drizzle.team/) |
| **Validation** | [Zod v4](https://zod.dev/) |
| **Icons** | [Lucide](https://lucide.dev/) + [Iconify](https://iconify.design/) |

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **PostgreSQL** database
- **GitHub OAuth App** (for authentication)

### 1. Clone the repository

```bash
git clone https://github.com/your-username/stikkle.git
cd stikkle
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Create a `.env.local` file in the project root:

```env
# GitHub OAuth (create at https://github.com/settings/developers)
GITHUB_ID=your_github_client_id
GITHUB_SECRET=your_github_client_secret

# GitHub Personal Access Token (for API calls)
GITHUB_TOKEN=your_github_pat

# NextAuth
NEXTAUTH_SECRET=your_random_secret_string
NEXTAUTH_URL=http://localhost:3000

# PostgreSQL Database
DATABASE_URL=postgresql://user:password@localhost:5432/stikkle
```

#### Setting up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **New OAuth App**
3. Set the homepage URL to `http://localhost:3000`
4. Set the callback URL to `http://localhost:3000/api/auth/callback/github`
5. Copy the **Client ID** and **Client Secret** to your `.env.local`

### 4. Set up the database

```bash
npx drizzle-kit push
```

### 5. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Architecture

```
┌─────────────────────────────────────────────────┐
│                   Browser                        │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐ │
│  │  Landing   │  │ Dashboard  │  │   Recs     │ │
│  │   Page     │  │   Page     │  │   Page     │ │
│  └────────────┘  └────────────┘  └────────────┘ │
└──────────────────────┬──────────────────────────┘
                       │
              ┌────────▼────────┐
              │  Next.js Server  │
              │  (App Router)    │
              └────────┬────────┘
                       │
         ┌─────────────┼─────────────┐
         ▼             ▼             ▼
   ┌──────────┐  ┌──────────┐  ┌──────────┐
   │ NextAuth │  │ GitHub   │  │ Drizzle  │
   │ (OAuth)  │  │ REST API │  │ (Postgres)│
   └──────────┘  └──────────┘  └──────────┘
```

### Key Files

```
stikkle/
├── app/
│   ├── page.tsx                    # Landing page (scroll-animated)
│   ├── layout.tsx                  # Root layout with auth & header
│   ├── providers.tsx               # Client providers (session, Lenis, noise bg)
│   ├── globals.css                 # Global styles & Tailwind config
│   ├── api/auth/[...nextauth]/     # NextAuth API route
│   ├── dashboard/page.tsx          # Main dashboard
│   ├── recommendation/page.tsx     # AI recommendations + engine
│   ├── activity/page.tsx           # Activity feed
│   ├── gist/page.tsx               # GitHub gists
│   └── publicrepo/page.tsx         # Public repos browser
├── components/
│   ├── ui/                         # shadcn/ui primitives
│   ├── app-sidebar.tsx             # Navigation sidebar
│   ├── dashboard-sections.tsx      # Dashboard card components
│   ├── recommendations-content.tsx # Recommendations UI
│   ├── activity-content.tsx        # Activity feed UI
│   ├── scroll-homepage.tsx         # Animated landing page
│   └── shadcn-space/blocks/        # Hero & header blocks
├── lib/
│   ├── github.ts                   # Typed GitHub API wrapper
│   ├── activity.ts                 # Activity event builder
│   └── utils.ts                    # Utilities (cn helper)
├── config/
│   └── drizzle.ts                  # Database connection
└── drizzle/                        # Database migrations
```

---

## Pages

| Route | Auth | Description |
|-------|------|-------------|
| `/` | ❌ | Scroll-animated landing page |
| `/about` | ❌ | About the product |
| `/docs` | ❌ | Documentation |
| `/dashboard` | ✅ | Main dashboard with stats, PRs, issues, charts |
| `/recommendation` | ✅ | AI-powered task recommendations |
| `/activity` | ✅ | Unified activity timeline |
| `/gist` | ✅ | GitHub gists viewer |
| `/publicrepo` | ✅ | Public repositories browser |
| `/capture` | ✅ | Capture workflows |
| `/proposal` | ✅ | Proposals management |
| `/prompts` | ✅ | Prompts management |
| `/analytics` | ✅ | Analytics dashboard |
| `/reports` | ✅ | Reports |
| `/projects` | ✅ | Projects overview |
| `/search` | ✅ | Search functionality |
| `/settings` | ✅ | User settings |
| `/team` | ✅ | Team management |
| `/data-library` | ✅ | Data library |
| `/lifecycle` | ✅ | Project lifecycle |
| `/word-assistant` | ✅ | Writing assistant |
| `/help` | ✅ | Help & support |

---

## Scripts

```bash
npm run dev       # Start development server
npm run build     # Build for production
npm run start     # Start production server
npm run lint      # Run ESLint
```

---

## Contributing

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

---

## License

This project is open source. See the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Built with ❤️ by the Stikkle team
</p>
