<div align="center">

<img src="./public/cs-arena-logo-192.png" alt="CS Arena Logo" width="80" height="80" />

# CS Arena

### Showcase Your Code. Dominate The Arena.

**The platform built for CS developers to submit graduation projects, find open-source contributors, and get discovered by top tech recruiters.**

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-csarena.tech-0066FF?style=for-the-badge)](https://csarena.tech)
[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Sanity](https://img.shields.io/badge/Sanity_CMS-F03E2F?style=for-the-badge&logo=sanity&logoColor=white)](https://sanity.io)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com)

</div>

---

## ✨ Features

### 🚀 Project Showcase
- Submit graduation projects, Hackathon entries, and personal builds
- Rich **Markdown editor** for detailed project descriptions
- 3-level cascading classification by **Domain → Specialization → Tech Stack**
- Full **Light / Dark Mode** support
- View tracking with **cookie-based spam prevention**
- Share your profile with a single click via **ShareProfileButton**

### 🔍 Project Discovery
- Advanced search with **Cascading Filters** (University → Domain → Tech)
- Sort by latest, most upvoted, or most viewed
- Dedicated `/projects` listing page with full filter support

### 🤝 Collaboration System
- Apply to join any open-source project directly from the platform
- Full **Join Request** system with automatic email notifications via Resend
- Accept / Reject requests with optional rejection reason sent to the applicant
- **Contributors list** displayed on project detail pages

### 🏆 Leaderboard
- Global ranking with a stunning **3D Podium UI**
- Filter by global or by university
- Ranked by total Upvotes

### 👥 Developers Page
- Browse developer profiles with **real-time GitHub stats**
- Dynamic filters to find the right collaborator
- Recruitment cards with a Radar UI design

### 🖥️ User Dashboard
- Overview stats for your projects (views, upvotes, requests)
- Manage your projects with **optimistic deletion**
- Handle incoming join requests with accept / reject actions
- Full **profile settings** with instant session sync

### 🌐 Internationalization (i18n)
- Full support for **Arabic** and **English**
- Automatic **RTL layout** switching for Arabic
- Complete translation coverage across all pages and components

### 🔐 Security & Authentication
- Sign in with **GitHub OAuth** or **Google OAuth**
- Secure **Onboarding flow** with middleware protection
- **Rate Limiting** on all API routes
- Comprehensive **HTTP Security Headers**
- Route protection via Middleware

### 📊 Monitoring & Performance
- Full **Sentry** integration for Error Tracking and Session Replay
- Built-in **Feedback Widget** for user bug reports
- **PWA Support** — installable on mobile devices
- Auto-generated **Sitemap** for Google Search Console
- **Suspense Streaming** for instant page loads
- Prefetching on all static and dynamic navigation links

### 📚 Documentation System
- Full **MDX-powered Docs** with search
- Bilingual docs **(Arabic & English)** with automatic locale detection
- Interactive sidebar with GitHub edit links
- Last updated timestamps and frontmatter support

### 🏛️ Open Source Hall of Fame
- Dedicated page showcasing open-source projects
- Real-time **GitHub stats** per project
- Contributors section per project

### 📋 Changelog
- Cosmic timeline UI for platform update history
- Full multilingual support

---

## 🛠️ Tech Stack

| Technology | Version | Usage |
|---|---|---|
| **Next.js** | 16.x | App Router, Server Components, Streaming |
| **React** | 19.x | UI Framework |
| **TypeScript** | 5.x | Type Safety |
| **Tailwind CSS** | 3.x | Styling |
| **Sanity CMS** | 3.x | Database & Content Management |
| **NextAuth.js** | 5.x Beta | Authentication |
| **Framer Motion** | 12.x | Animations |
| **next-intl** | 4.x | Internationalization (i18n) |
| **Sentry** | 10.x | Error Tracking & Session Replay |
| **Resend** | 6.x | Transactional Emails |
| **Zod** | — | Schema Validation |
| **shadcn/ui** | — | UI Components |
| **Vercel** | — | Deployment |

---

## 📁 Project Structure

```
CS-Arena/
├── app/
│   ├── (root)/
│   │   ├── about/
│   │   ├── blog/
│   │   ├── coming-soon/
│   │   ├── cookies/
│   │   ├── dashboard/
│   │   ├── developers/
│   │   ├── docs/
│   │   │   └── [...slug]/
│   │   ├── leaderboard/
│   │   ├── onboarding/
│   │   ├── open-source/
│   │   ├── privacy/
│   │   ├── project/
│   │   │   ├── [id]/
│   │   │   │   └── edit/
│   │   │   └── create/
│   │   ├── projects/
│   │   ├── terms/
│   │   ├── user/[id]/
│   │   ├── layout.tsx
│   │   └── page.tsx
│   ├── api/
│   │   └── docs-search/
│   ├── studio/[[...tool]]/
│   ├── global-error.tsx
│   ├── layout.tsx
│   ├── not-found.tsx
│   └── sitemap.ts
├── components/
│   ├── dashboard/
│   │   ├── ManageProjects.tsx
│   │   ├── ProfileSettings.tsx
│   │   └── ProjectRequests.tsx
│   ├── docs/
│   │   ├── DocsFeedback.tsx
│   │   └── DocsSidebar.tsx
│   ├── layout/
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   ├── project/
│   │   ├── ContributorsSection.tsx
│   │   ├── EditProjectForm.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectFilters.tsx
│   │   ├── ProjectForm.tsx
│   │   ├── TeamFilters.tsx
│   │   ├── UpvoteButton.tsx
│   │   └── UserProjects.tsx
│   ├── shadcn/
│   │   ├── avatar.tsx
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── skeleton.tsx
│   │   ├── textarea.tsx
│   │   ├── toast.tsx
│   │   └── toaster.tsx
│   └── shared/
│       ├── CustomFilterSelect.tsx
│       ├── FeedbackButton.tsx
│       ├── GithubStats.tsx
│       ├── HeroSection.tsx
│       ├── JoinTeamButton.tsx
│       ├── LanguageToggle.tsx
│       ├── MobileMenu.tsx
│       ├── OnboardingForm.tsx
│       ├── Ping.tsx
│       ├── PolicySections.tsx
│       ├── ProjectsGrid.tsx
│       ├── Providers.tsx
│       ├── SearchForm.tsx
│       ├── SearchFormReset.tsx
│       ├── ShareProfileButton.tsx
│       ├── TechFilters.tsx
│       ├── ThemeToggle.tsx
│       ├── View.tsx
│       └── ViewTracker.tsx
├── config/
│   └── docs.ts
├── constants/
│   └── ecosystem.ts
├── content/
│   └── docs/
│       ├── contributing/
│       │   ├── guidelines.ar.mdx
│       │   ├── guidelines.en.mdx
│       │   ├── setup.ar.mdx
│       │   └── setup.en.mdx
│       ├── getting-started/
│       │   ├── introduction.ar.mdx
│       │   ├── introduction.en.mdx
│       │   ├── quick-start.ar.mdx
│       │   └── quick-start.en.mdx
│       └── user-guide/
│           ├── find-developers.ar.mdx
│           ├── find-developers.en.mdx
│           ├── projects.ar.mdx
│           └── projects.en.mdx
├── hooks/
│   └── use-toast.ts
├── i18n/
│   └── request.ts
├── lib/
│   ├── actions.ts
│   ├── docs.ts
│   └── utils.ts
├── messages/
│   ├── ar.json
│   └── en.json
├── public/
│   ├── cs-arena-logo.png
│   ├── cs-arena-logo-192.png
│   ├── cs-arena-logo-512.png
│   └── manifest.json
├── sanity/
│   ├── lib/
│   │   ├── client.ts
│   │   ├── live.ts
│   │   ├── queries.ts
│   │   └── write-client.ts
│   └── schemaTypes/
│       ├── author.ts
│       ├── changelog.ts
│       ├── domain.ts
│       ├── index.ts
│       ├── joinRequest.ts
│       ├── project.ts
│       └── university.ts
├── auth.ts
├── middleware.ts
├── instrumentation.ts
├── sentry.client.config.ts
├── sentry.edge.config.ts
├── sentry.server.config.ts
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

---

## 🗺️ Pages

| Route | Description |
|---|---|
| `/` | Home — search and discover projects |
| `/project/create` | Submit a new project |
| `/project/[id]` | Project details |
| `/project/[id]/edit` | Edit your project |
| `/projects` | All projects listing |
| `/leaderboard` | Top projects with 3D Podium UI |
| `/open-source` | Hall of Fame for open-source projects |
| `/developers` | Browse developer profiles |
| `/user/[id]` | Developer public profile |
| `/dashboard` | User dashboard & settings |
| `/onboarding` | New user setup flow |
| `/docs` | Full documentation system (MDX) |
| `/docs/[...slug]` | Individual documentation pages |
| `/changelog` | Platform update history |
| `/about` | About CS Arena |
| `/privacy` | Privacy policy |
| `/terms` | Terms of service |
| `/cookies` | Cookie policy |
| `/blog` | Blog (coming soon) |
| `/studio` | Sanity CMS dashboard |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 10+
- Sanity account
- GitHub OAuth App
- Google OAuth App

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/Ali-Haggag7/CS-Arena.git
cd CS-Arena

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env.local
```

### Environment Variables

```env
# Auth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret

# GitHub OAuth
AUTH_GITHUB_ID=your_github_client_id
AUTH_GITHUB_SECRET=your_github_client_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Sanity CMS
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_WRITE_TOKEN=your_write_token

# Sentry
SENTRY_AUTH_TOKEN=your_sentry_token

# Resend (Email)
RESEND_API_KEY=your_resend_key

# App
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

```bash
# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Sanity Studio

Access the CMS dashboard locally at:

```
http://localhost:3000/studio
```

---

## 🤝 Contributing

Contributions are welcome! Please read the [Contributing Guidelines](https://csarena.tech/docs/contributing/guidelines) before getting started.

```bash
# Create a new branch
git checkout -b feat/your-feature-name

# After making your changes
git commit -m "feat: add your feature"
git push origin feat/your-feature-name
```

Look for issues tagged `good first issue` — that's the best place to start!

---

## 📄 License

MIT License — feel free to use and modify.

---

<div align="center">

Built with ❤️ by **[Ali Haggag](https://www.linkedin.com/in/ali-haggag7)**

[![GitHub](https://img.shields.io/badge/GitHub-Ali--Haggag7-181717?style=flat-square&logo=github)](https://github.com/Ali-Haggag7)
[![Website](https://img.shields.io/badge/Website-csarena.tech-0066FF?style=flat-square&logo=globe)](https://alihaggag.me)

⭐ If you find this project useful, please consider giving it a star!

</div>