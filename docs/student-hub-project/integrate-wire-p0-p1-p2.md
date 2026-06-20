# Integration branch: `integrate/wire-p0-p1-p2`

**Status:** Completed and smoke-tested on this branch (integration test before merging feature PRs #127, #128, #129 to `main`).

**Branch base:** `main`  
**Merge order:** `feat/wire-priority-0` → `feat/wire-priority-1` → `feat/wire-priority-2` (+ portfolio fixes)

**Scope:** Wire previously UI-only or mock-backed pages to the live .NET API. Does not add new product areas beyond what is listed below.

---

## Summary

| Priority | Theme | Result |
|----------|--------|--------|
| **P0** | Agent activity lifecycle & kanban | Frontend calls existing activity/application endpoints |
| **P1** | Admin users, lookups, public home | New public/admin API + frontend wiring |
| **P2** | Notifications, gamification, portfolio | New domain tables, services, controllers + frontend wiring |

**Diff vs `main`:** ~62 files, +2,800 / −260 lines (frontend services/pages + backend stack).

---

## P0 — Agent dashboard & kanban

### User-facing

- **Agent dashboard** (`/agent/dashboard`): publish draft activities, close open activities, edit activity details; success/error toasts.
- **Agent kanban** (`/agent/activities/:id/kanban`): three columns — **pending**, **accepted**, **rejected** (maps to API `Pending`, `Approved`, `Rejected`). Drag/move updates via review API. Applicant phone shown when available.

### Frontend

| File | Role |
|------|------|
| `frontend/src/services/kanban.js` | `GET /api/activities/{id}/applications`, `PATCH /api/applications/{id}/review` |
| `frontend/src/services/activities.js` | `PATCH /api/activities/{id}/status`, `PUT /api/activities/{id}` |
| `frontend/src/Pages/AgentDashboard.jsx` | Lifecycle actions UI |
| `frontend/src/Pages/AgentKanbanBoard.jsx` | 3-column board wired to API |

### Backend

No new controllers — uses existing `ActivitiesController` and `ApplicationsController`.

---

## P1 — Admin users, university lookups, public home

### User-facing

- **Admin users** (`/admin/users`): paginated user list; change role and account status.
- **Admin lookups** (`/admin/lookups`): universities CRUD via `/api/universities` (no longer mock admin routes).
- **Home** (`/`): `MembersSection` shows live stats and top agents.

### Frontend

| File | Role |
|------|------|
| `frontend/src/Pages/admin/AdminUsers.jsx` | New page |
| `frontend/src/services/adminUsers.js` | Admin user list + role/status patches |
| `frontend/src/services/admin.js` | Universities → `/api/universities` |
| `frontend/src/services/public.js` | Public stats & top agents |
| `frontend/src/components/MembersSection.jsx` | Home section wired to API |
| `frontend/src/App.jsx` | Route `/admin/users` |
| `frontend/src/context/I18nContext.jsx` | Admin users strings |

### Backend (new)

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/public/stats` | Anonymous | Aggregate counts for home |
| `GET /api/public/top-agents` | Anonymous | Top agents for home carousel |
| `PUT /api/universities/{id}` | Admin | Update university |
| `GET /api/admin/users` | Admin | Paginated users |
| `PATCH /api/admin/users/{id}/role` | Admin | Change role |
| `PATCH /api/admin/users/{id}/status` | Admin | Change status |

**New types/services:** `PublicController`, `PublicService`, `UpdateUniversityDto`, `UniversityRepository.CountAsync()`.

---

## P2 — Notifications, gamification, public portfolio

### User-facing

- **Notifications** (bell / `NotificationContext`): list, mark read, mark all read, delete one, clear all — live API (mock timer removed).
- **Leaderboard** (`/leaderboard`): university-scoped leaderboard and student points when logged in.
- **Public portfolio** (`/u/:username`): public profile by **portfolio slug** or **student code**; shows academic info, applications, badges, points, rank.
- **Gamification side effects:** applying and application review can award points, badges, and notifications (failures in post-commit awards are non-fatal).

### Frontend

| File | Role |
|------|------|
| `frontend/src/services/notifications.js` | `/api/notifications` |
| `frontend/src/services/gamification.js` | `/api/gamification/*` |
| `frontend/src/services/portfolio.js` | `GET /api/students/{username}/portfolio` + response normalization |
| `frontend/src/Pages/StudentPortfolio.jsx` | Public portfolio page |
| `frontend/src/context/NotificationContext.jsx` | Live fetch (no mock polling) |

**Mock default:** `VITE_USE_MOCK === 'true'` enables mocks; otherwise all above services use the live API.

### Backend (new)

| Endpoint | Auth | Description |
|----------|------|-------------|
| `GET /api/notifications` | Student (etc.) | List for current user |
| `PATCH /api/notifications/{id}/read` | Owner | Mark one read |
| `PATCH /api/notifications/read-all` | Owner | Mark all read |
| `DELETE /api/notifications/{id}` | Owner | Delete one |
| `DELETE /api/notifications` | Owner | Clear all |
| `GET /api/gamification/leaderboard` | Authenticated | Leaderboard (optional `universityId`) |
| `GET /api/gamification/me/points` | Student | Points, rank, badges |
| `GET /api/students/{username}/portfolio` | Anonymous | Public portfolio |

**New domain**

- Entities: `Notification`, `StudentBadge`
- `StudentProfile`: `Points`, `PortfolioSlug` (unique index, nullable filter)
- Unique index on `(UserId, Name)` for badges

**New application layer**

- `NotificationService`, `GamificationService`, `PortfolioService`, `StudentGamificationAwarder`
- Hooks in `ApplicationService` / `ProfileService` (apply, review, activation → slug/points/notifications)

**Migration**

- `20260601185458_AddGamificationNotificationsPortfolio` (replaces hand-written migration; snapshot updated)

---

## Integration-only fixes (on this branch)

These are required for the **combined** stack to build and run; consider porting to feature branches or `main` at merge time.

1. **`backend/StudentHub.Infrastructure/DependencyInjection.cs`** — merge conflict resolved: registers `IPublicService` (P1) and `INotificationService` / `IGamificationService` / `IPortfolioService` (P2).
2. **`backend/StudentHub.API/Global/global.cs`** — global usings for DTO namespaces: `Public`, `Gamification`, `Notifications`, `Portfolio`.
3. **`frontend/src/Pages/StudentPortfolio.jsx`** — fix crash: `localizeStatus(..., t)` (was incorrectly passing `lang`); safe defaults for badges/activities/points; no blank `return null`.
4. **`frontend/src/services/portfolio.js`** — normalize API envelope and PascalCase/camelCase fields.
5. **`PortfolioService`** — activity `Organization` from `OrgName`; lowercase status strings for UI badges.

---

## Setup & verification

### Database

```bash
cd backend/StudentHub.API
dotnet ef database update
```

### Build

```bash
cd backend && dotnet build
cd frontend && npm run build
```

### Smoke test checklist

- [ ] **P0** — Agent: publish/close/edit activity; kanban move pending ↔ accepted/rejected
- [ ] **P1** — Admin: `/admin/users`; lookups universities; home stats/agents without mock
- [ ] **P2** — Notifications; leaderboard; `/u/{slug-or-studentCode}` portfolio renders
- [ ] Apply + review flow creates notifications / points where configured

---

## Explicitly out of scope on this branch

The following remain **unchanged** (mock, placeholder, or not wired by this work):

- Community forums (`/community/*`)
- Agent analytics, events, QR scanner pages
- Admin moderation & finance pages (routes exist; not part of P0–P2 wiring)
- Mobile app
- Formal requirements are captured in `docs/SRS.md` v2.1; this file remains the **implementation delivery record** for the integration branch

---

## Related branches & PRs

| Branch | PR (reference) | Merged into integration |
|--------|----------------|-------------------------|
| `feat/wire-priority-0` | #127 | Yes |
| `feat/wire-priority-1` | #128 | Yes |
| `feat/wire-priority-2` | #129 | Yes |

**Recommended merge to `main`:** either merge this integration branch once approved, or merge P0 → P1 → P2 in order and apply the integration-only fixes from the section above.

---

## Commit history (non-merge, vs `main`)

```
0cdf3d4 feat: enhance student portfolio functionality
40e917c feat: enhance gamification and notifications systems
068dbe4 fix: enhance university repository and public service functionality
61c1d52 refactor: update UI elements in AgentDashboard and AgentKanbanBoard
f51df4b wire: admin users, university lookups, and public home stats
1b387d6 feat: enhance AgentDashboard and KanbanBoard with activity management
5193a73 feat: implement gamification, public portfolio and notification systems
```

*Last updated: integration branch `integrate/wire-p0-p1-p2` after end-to-end testing.*
