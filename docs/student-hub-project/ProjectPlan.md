# 📋 StudentHub — Project Plan

## Stage 1 Deliverable: Planning & Feasibility

---

## 1. Project Overview

### 1.1 What Are We Building?
**StudentHub** is a platform designed to serve university students by providing a centralized hub for student services. The full vision is a large ecosystem (detailed in `StudentHub.md`), but for this phase we are building a **Minimum Viable Product (MVP)** that demonstrates the core value of the platform.

### 1.2 Why Are We Building It?
- Students currently discover activities through scattered WhatsApp groups, Facebook pages, and word-of-mouth
- There is no centralized system for student activity registration and management
- University agents (student affairs, activity coordinators) lack a digital tool to manage volunteers
- This is a Field Training project — we're building real software while learning professional development practices

### 1.3 MVP Objective
Build a working web application where:
1. Students can **register, verify, and activate** their accounts
2. Students can **browse and apply** to student activities and volunteering
3. Admins/Agents can **manage** activities and **approve** student requests

---

## 2. Feasibility Study

### 2.1 Technical Feasibility

**Verdict: Technically Feasible ✅**

### 2.2 Operational Feasibility

| Question | Assessment |
|---|---|
| Will users actually use it? | ✅ Students need a centralized platform — real demand exists |
| Can the team operate it? | ✅ For demo purposes, yes. Production maintenance is out of scope |
| Is the workflow realistic? | ✅ Register → Activate → Browse → Apply is a simple, proven UX pattern |
| Will the admins adopt it? | ✅ Admin dashboard simplifies their current manual work |

**Verdict: Operationally Feasible ✅**

### 2.3 Economic Feasibility

| Item | Cost |
|---|---|
| Development tools | $0 (all free/open-source) |
| Domain (studenthubeg.com) | Already purchased via Namecheap |
| Backend hosting (dev) | $0 (localhost during development) |
| Backend hosting (demo) | $0 (Azure/Railway/Render free tier) |
| Frontend hosting (demo) | $0 (Vercel/Netlify free tier or Namecheap hosting) |
| Database | $0 (SQL Server LocalDB / free tier) |
| Email service | $0 (Gmail SMTP or Mailtrap free tier for testing) |
| **Total** | **~$0** |

**Verdict: Economically Feasible ✅**

---

## 3. Resource Allocation

### 3.1 Team Resources

| Member | Role | Tech | Responsibility |
|---|---|---|---|
| Dev 1 | **Backend Lead** | .NET 10 | Architecture, DB schema, Auth system, code review |
| Dev 2 | Backend Dev | .NET 10 | Auth endpoints (register, login, JWT, password recovery) |
| Dev 3 | Backend Dev | .NET 10 | Activities module (CRUD, join, approval endpoints) |
| Dev 4 | Backend Dev | .NET 10 | Admin endpoints, Swagger docs, seed data, testing |
| Dev 5 | **Frontend Lead** | React | Project setup, routing, auth pages, admin dashboard UI |
| Dev 6 | Frontend Dev | React | Activities pages, profile page, responsive design |
| Dev 7 | Mobile Dev | Flutter | Login screen, activities list, API integration |
| Dev 8 | Mobile Dev | Flutter | Navigation, profile screen, basic UI |

### 3.2 Tools & Infrastructure

| Category | Tool | Purpose |
|---|---|---|
| Version Control | GitHub | Code hosting, PRs, code review |
| Project Management | Jira (Kanban) | Task tracking, sprint management |
| Communication | WhatsApp | Daily async standup, quick questions |
| IDE | Visual Studio / VS Code | Development |
| API Testing | Swagger (auto-generated) | API documentation + manual testing |
| Design | Figma (optional) | Wireframes if time permits |

---

## 4. Project Schedule

### 4.1 Sprint Plan

| Sprint | Weeks | Focus | Key Deliverables |
|---|---|---|---|
| **Sprint 1** | Week 1–3 | Foundation + Core | Auth system, Activities API + UI, Flutter setup |
| **Sprint 2** | Week 4–5 | Integration + Polish | Admin dashboard, bug fixes, deployment, demo prep |

### 4.2 Week-by-Week Breakdown

| Week | Backend Team | Frontend Team | Mobile Team |
|---|---|---|---|
| **1** | Project scaffold, DB schema, EF Core setup, Auth/Identity | Vite project cleanup, routing, UI library setup, auth pages | Flutter setup, learn basics |
| **2** | Auth endpoints done, Activities CRUD started | Dashboard layout, activation form, profile page | Login screen connecting to API |
| **3** | Activities complete, admin endpoints started | Activities page, apply flow, connected to API | Activities list screen |
| **4** | Admin endpoints done, bug fixes, seed data | Admin dashboard UI, full integration, polish | Profile screen, navigation |
| **5** | Final testing, deployment | Responsive fixes, landing page, demo prep | Demo APK build |

### 4.3 Milestones

| Milestone | Target Date | Criteria |
|---|---|---|
| M1: Environment Ready | End of Week 1 | All devs have projects running locally |
| M2: Auth Working E2E | End of Week 2 | Register + Login works from frontend → backend |
| M3: Core Feature Complete | End of Week 3 | Activities browse + apply works end-to-end |
| M4: MVP Complete | End of Week 4 | Admin dashboard + all features integrated |
| M5: Demo Ready | End of Week 5 | Deployed, seeded, demo script + backup video |

---

## 5. Cost Estimation

| Phase | Estimated Effort (person-days) |
|---|---|
| Planning & Requirements | 3–4 days (team leader + leads) |
| System Design | 2–3 days (leads collaborate) |
| Implementation — Backend | 50–60 person-days (4 devs × 12-15 days) |
| Implementation — Frontend | 25–30 person-days (2 devs × 12-15 days) |
| Implementation — Mobile | 20–25 person-days (2 devs × 10-12 days) |
| Testing | 5–8 person-days (spread across team) |
| Deployment | 2–3 person-days |
| **Total Estimated Effort** | **~107–133 person-days** |

> This is within the capacity of 8 people × ~20 productive days = 160 available person-days.
> Buffer for learning, meetings, and blockers is accounted for.

---

## 6. The "Agent" Role — Explained

### What is an Agent?

An **Agent** is an **activity representative** — think of them as the middleman between the StudentHub platform and a specific university.

### Real-World Examples of Agents
- A **Student Affairs coordinator** at Cairo University
- The **head of a student activity** (e.g., GDG, ICPC Community lead)
- A **faculty representative** who manages volunteering at their department

### What Can an Agent Do?

| Action | Example |
|---|---|
| Approve/reject student activations | "Yes, Ahmed is really a student at Cairo University" |
| Create and manage activities | "We're organizing a workshop on AI — let me post it" |
| Approve/reject activity applications | "Fatma applied to volunteer, let me review her profile" |

### Agent vs Admin

| | Agent | Admin |
|---|---|---|
| Scope | Their university only | All universities |
| Can manage users? | Only approve activations for their university | Full user management |
| Can manage activities? | Only activities they created or for their university | All activities |
| Who assigns them? | Admin promotes a user to Agent | Built-in / system owner |

---

## 7. 💡 Improvements & Decisions Log

> Reference document for all design decisions and improvements made during Stage 1 Planning.

---

## Design Decisions

### A. Role & Registration System

*Decision:* Agent self-registration with admin approval (Option 3).

| Role | How They Register | Activation |
|---|---|---|
| Student | Self-registers → completes profile | Auto-activated on profile completion |
| Agent | Self-registers as agent → fills org info | Admin approval required |
| Admin | Seeded in database | No public registration |

*Student flow:*
```
Register → "I'm a Student" → email + password → Profile form
(name, national ID, phone, university, faculty, department, batch)
→ Auto-active → Browse & apply to activities
```

*Agent flow:*
```
Register → "I'm an Agent" → email + password → Agent form
(name, organization, university, role description)
→ Pending → Admin approves → Create & manage activities
```

*Technical:* Single `/api/auth/register` endpoint with `accountType` field. Separate profile tables: `StudentProfiles` and `AgentProfiles`.

---

**B. Skip OTP for Sprint 1**

Accept registration without email verification. Add real SMTP email in Sprint 2.

---

**E. Naming Conventions**

| Context | Convention | Example |
|---|---|---|
| C# classes/methods | PascalCase | `UserService`, `GetActivities()` |
| React variables/functions | camelCase | `userId`, `handleSubmit()` |
| React components | PascalCase | `LoginPage`, `ActivityCard` |
| API routes | lowercase | `/api/auth/login`, `/api/activities` |
| Database tables | PascalCase singular | `User`, `Activity`, `Application` |

---

**F. Seed Data Strategy**

Seeder must create: 3 universities, 5 activities per university, 20 students, 2 agents, 1 admin. All with realistic Egyptian names and data.

---

**I. Standard API Response Format**

```json
{ "success": true,  "message": "...", "data": { ... } }
{ "success": false, "message": "...", "errors": { "field": ["message"] } }
```

All endpoints use this format. Frontend builds ONE error handler.

---

**J. Jira Task Template**

```
Title:    [BACKEND/FRONTEND/MOBILE] Short description
Assignee: Dev name
Done when: Clear acceptance criteria
```

---

**K. CORS Configuration**

Enable CORS in .NET `Program.cs` on day 1. Without it, React (port 5173) → API (port 5000) calls fail silently.

---

## Core Idea Improvements

### L. One-Click Activity Application

No application forms. Students apply with their **profile data only**. One click.

- **Guard:** Profile must be 100% complete to apply
- **Database:** `Applications` table links `StudentId` ↔ `ActivityId` with status
- **Agent view:** Sees student's full profile when reviewing applications

---

### M. Activity Lifecycle

| Status | Meaning |
|---|---|
| `Draft` | Created but not published |
| `Open` | Accepting applications |
| `Closed` | Deadline passed or manually closed |
| `Completed` | Activity finished |

Students only see `Open` activities.

**Fields:** `Status`, `ApplicationDeadline`, `StartDate`, `MaxParticipants`

---

### N. Student Activity History

Student profile shows "My Activities" with status for each:
- ✅ Approved / ⏳ Pending / ❌ Rejected

No extra DB work — just a query on `Applications` grouped by student.

---

### O. Profile Completeness Indicator

Show completion percentage. 100% required to apply. Gamification + gatekeeping.

---

### P. University-Scoped Data

- Students see **their university's activities** by default
- Agents manage their university's activities (default permissions)
- Agents can request broader publishing scope from admin
- Admins see everything

---

### Q. Pitch for Judges

> StudentHub is a **university-specific operations platform** connecting students, activity agents, and admins. The differentiator: **verified student identity** — every student is tied to a real university, faculty, and batch. One-click applications with full profile data, not anonymous forms.

Demo flow: Register → Complete profile → Browse activities → One-click apply → Agent reviews full student data → Approves → Student history updates.


---

## 8. Approval

> This Project Plan must be reviewed and approved before proceeding to **Stage 2: Defining Requirements (SRS)**.

---

> **Document Version:** 1.0 — March 1, 2026
> **Status:** Stage 1 Complete — Approved for Stage 2