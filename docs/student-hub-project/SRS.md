# Software Requirements Specification (SRS)

## StudentHub — MVP (Web Platform)

| Field | Value |
|---|---|
| **Project** | StudentHub |
| **Document ID** | SH-SRS-001 |
| **Version** | 2.2 |
| **Status** | Approved implementation baseline (web); revision reflects completed Release 2.1 scope alignment |
| **Date** | June 2, 2026 |
| **Stage** | 2 — Defining Requirements |
| **Prepared in accordance with** | IEEE Std 830-1998 (structure and content); ISO/IEC/IEEE 29148:2018 (requirements attributes) |

---

## 1. Introduction

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements for the StudentHub Minimum Viable Product (MVP) delivered as a web application backed by a REST API. The document serves as the authoritative requirements baseline for design, implementation, verification, and acceptance testing.

### 1.2 Scope

#### 1.2.1 In scope (MVP web)

| Area | Description |
|---|---|
| Authentication & authorization | Registration, login, logout, password recovery; JWT; role-based access |
| Profile management | Student and agent profile completion, activation workflows, profile view |
| Student activities | Browse, detail view, one-click apply, application status on profile |
| Agent operations | Activity CRUD, publish/close lifecycle, application review (table and kanban UI) |
| Administration | Dashboard metrics, agent approval, user management, university lookup maintenance |
| Administration extensions | Moderation report review, moderation actions, finance summary, finance transactions, faculty lookup maintenance |
| Public web content | Anonymous home statistics, growth trends, top agents, top students, public student and agent portfolio pages |
| Engagement | In-app notifications, points, badges, university-scoped leaderboard |
| Community | Public community browsing, thread browsing, authenticated thread/post creation, post upvotes |
| Store & marketplace | Product catalog, housing listings, stationery lists, cafeteria menus, cart, wishlist, checkout, order history, vendor product submission |
| Agent analytics | Agent dashboard analytics for activity/application performance |
| Cross-cutting | Arabic/English UI, dark/light theme, standard API response envelope |
| Mobile (demo) | Flutter client for login and activity browse (subset of API) |

#### 1.2.2 Out of scope

| Item | Rationale |
|---|---|
| Academic projects, research, entrepreneurship modules | Post-MVP product lines |
| Student voice / polls, Valid Gate, Student Link | Not in current release |
| E-tickets and external payment gateway integration | Store checkout is in scope; third-party payment authorization/capture is deferred |
| Real-time chat / messaging | Not in current release |
| **Push notifications** (FCM/APNs) | In-app notifications are in scope; device push is deferred |
| Events calendar and QR scanner pages | UI placeholders; not fully wired to production API workflows |
| Profile photo upload (Cloudinary) | Placeholder avatar only |

### 1.3 Definitions, acronyms, and abbreviations

| Term | Definition |
|---|---|
| **Student** | A registered user with a completed university profile and role `Student` |
| **Agent** | An activity representative (e.g., club lead) with role `Agent`, approved by an administrator when required |
| **Admin** | System administrator with role `Admin`; seeded in the database |
| **Profile completion** | Submission of all mandatory profile fields for the user’s role |
| **One-click apply** | Creating an activity application using existing profile data without an additional form |
| **Application status** | `Pending`, `Approved`, or `Rejected` (stored as enumeration; exposed as lowercase strings in portfolio views) |
| **Activity status** | `Draft`, `Open`, `Closed`, or `Completed` |
| **Portfolio slug** | Unique, URL-safe identifier assigned to an active student profile for public portfolio URLs |
| **Student code** | System-generated identifier (e.g., `STU-YYYY-NNNN`) assigned on student activation |
| **In-app notification** | A persisted message (title, body, type, optional link, read flag) delivered to an authenticated user within the web application |
| **Gamification** | Points accumulation and badge awards tied to defined student actions |
| **Kanban board** | Agent UI presenting applications in columns by review status |
| **Community** | Public discussion area organized into communities, threads, posts, and post upvotes |
| **Marketplace / Store** | Student service area for product discovery, housing, stationery, food ordering, cart, wishlist, checkout, and order tracking |
| **Vendor** | Agent or admin user who can submit products for marketplace display |
| **Moderation report** | Administrative record requiring review and action against reported content or behavior |
| **Finance summary** | Administrative view of marketplace-related totals and transaction records; does not imply external payment gateway settlement |
| **Standard response envelope** | JSON structure `{ success, message, data, errors? }` returned by all API endpoints |
| **JWT** | JSON Web Token used for authenticated API access |
| **SRS** | Software Requirements Specification |

### 1.4 References

| ID | Document |
|---|---|
| [REF-1] | IEEE Std 830-1998, *IEEE Recommended Practice for Software Requirements Specifications* |
| [REF-2] | ISO/IEC/IEEE 29148:2018, *Systems and software engineering — Life cycle processes — Requirements engineering* |
| [REF-3] | `docs/DDS.md` — Design Description Specification |
| [REF-4] | `docs/ProjectPlan.md` — Project Plan |
| [REF-5] | `docs/integrate-wire-p0-p1-p2.md` — Integration delivery record (implementation traceability) |

### 1.5 Document conventions

- Functional requirements use the prefix **FR-** and non-functional requirements **NFR-**.
- The keyword **shall** denotes a mandatory requirement; **should** denotes a recommendation.
- Each functional requirement includes **Priority** (`High`, `Medium`, `Low`) and **Acceptance Criteria** verifiable by test.
- API paths are relative to the API base URL (e.g., `https://{host}/api/...`).

---

## 2. System Overview

### 2.1 Architecture

```
React Web App ──→ REST API ←── Flutter Mobile App (demo)
                     │
              .NET 10 Web API
            (Clean Architecture)
                     │
               SQL Server DB
```

### 2.2 User roles and registration

| Role | Registration | Activation | Primary dashboard / entry |
|---|---|---|---|
| **Student** | Self-registers as Student | Auto-activated on profile completion | `/student/dashboard` |
| **Agent** | Self-registers as Agent | Admin approval after profile submission | `/agent/dashboard` |
| **Admin** | Seeded; no public registration | Always active | `/admin/dashboard` |

### 2.3 Account status flow

```
Guest → Register → Inactive → Complete Profile → Active (Student)
Guest → Register → Inactive → Complete Profile → Pending → Admin Approves → Active (Agent)
                                                              → Admin Rejects  → Rejected
```

### 2.4 Web routes introduced or fully wired (Release 2.0–2.1)

| Route | Role / access | Purpose |
|---|---|---|
| `/agent/activities/:id/kanban` | Agent (active) | Kanban application review |
| `/agent/analytics` | Agent (active) | Activity and application analytics |
| `/agent/vendor` | Agent / Admin | Vendor product submission and product list management |
| `/admin/users` | Admin | User directory and role/status management |
| `/admin/lookups` | Admin | University lookup CRUD (live API) |
| `/admin/moderation` | Admin | Moderation report review and action handling |
| `/admin/finance` | Admin | Finance summary and transaction review |
| `/leaderboard` | Authenticated (student context) | Points leaderboard |
| `/u/:username` | Public (anonymous) | Public student portfolio |
| `/agent/:agentId` | Public (anonymous) | Public agent profile |
| `/community`, `/community/:id`, `/community/threads/:threadId` | Public read; authenticated write | Community browse, threads, posts, and upvotes |
| `/store`, `/store/housing`, `/store/stationery`, `/store/food`, `/store/products`, `/store/products/:id` | Public browse; authenticated actions | Marketplace browsing and category flows |
| `/store/cart`, `/store/checkout`, `/store/orders`, `/store/orders/:id` | Authenticated | Cart, checkout, order history, and order details |

---

## 3. Functional Requirements

### 3.1 Authentication

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-01** | **Register** | High | The system shall allow a user to register with email, password, and account type (Student or Agent). The system shall create the account with status `Inactive`. Duplicate email addresses shall be rejected with an appropriate error. |
| **FR-02** | **Login** | High | The system shall authenticate users with email and password and return a JWT containing role and status claims. The client shall redirect users according to role and status (see §2.3). |
| **FR-03** | **Logout** | High | The system shall invalidate the client session by clearing the JWT. The user shall be redirected to the login page. |
| **FR-04** | **Password recovery** | Medium | The user shall request a password reset via email. The system shall send a time-limited reset link (30 minutes). The user shall set a new password and be redirected to login. |

### 3.2 Profile management

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-05** | **Student profile completion** | High | An inactive student may persist partial profile data. When all required fields are valid (Full Name, National ID, Phone, University, Faculty, Department, Batch), the system shall set status to `Active`, generate a **student code**, and assign a unique **portfolio slug** derived from the student’s name. |
| **FR-06** | **Agent profile completion** | High | An inactive agent shall submit Full Name, Organization Name, University, and Role Description. On submission, status shall become `Pending`. The account shall become `Active` only after administrator approval. Agents shall not create or publish activities until `Active`. |
| **FR-07** | **View profile** | Medium | Active users shall view profile information, student code (students), and activity history. Profile photo upload remains out of scope (placeholder avatar). Students shall access a link to their **public portfolio** (`/u/{studentCode}` or slug). |
| **FR-08** | **Profile completeness indicator** | Low | The profile page shall display completion percentage. Dependent features shall remain locked below 100% completion. |

### 3.3 Student activities

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-09** | **Browse activities** | High | Active students shall see activities filtered by university. Each card shall show title, description, organization, status, deadline, and participant count. Only `Open` activities shall be listed for application. |
| **FR-10** | **One-click apply** | High | The student shall apply with one action using profile data. The system shall prevent duplicate applications to the same activity. The apply control shall be disabled when the profile is incomplete. Upon successful apply, the system should award **25 points** and the **First Application** badge (if not already held), and should create an in-app notification (see §3.7 and §3.8). |
| **FR-11** | **View application status** | Medium | The student shall view all applications and statuses (`Pending`, `Approved`, `Rejected`) on the profile or dashboard. |
| **FR-12** | **Activity details page** | Medium | The activity detail view shall show description, dates, capacity, current enrollment, and the apply action when eligible. |

### 3.4 Agent dashboard and activity management

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-13** | **Create activity** | High | An active agent shall create an activity with title, description, start date, deadline, and maximum participants. The initial status shall be `Draft`. |
| **FR-14** | **Publish activity** | High | From the agent dashboard, the agent shall change status from `Draft` to `Open` via `PATCH /api/activities/{id}/status`. The activity shall become visible to students. The UI shall confirm success or display errors. |
| **FR-15** | **View applications** | High | The agent shall view applications per activity. Each record shall include student name, faculty, phone (when available), applied date, and status. Data shall be loaded from `GET /api/activities/{id}/applications`. |
| **FR-16** | **Approve or reject application** | High | The agent shall set application status to `Approved` or `Rejected` via `PATCH /api/applications/{id}/review`. On approval, the system should award **100 points** and an **Application Approved** badge (if applicable) and notify the student. On rejection, the system should notify the student. Gamification and notification side effects shall not cause the review transaction to fail. |
| **FR-17** | **Edit or close activity** | Medium | The agent shall update activity fields via `PUT /api/activities/{id}` and close an activity via status change to `Closed` from the dashboard. Changes shall persist and reflect on refresh. |
| **FR-27** | **Kanban application review** | High | The agent shall open `/agent/activities/{id}/kanban` and see three columns: **Pending**, **Accepted** (maps to `Approved`), and **Rejected**. Moving an application between columns shall invoke FR-16. The board shall refresh from the API after updates. |
| **FR-41** | **Agent analytics** | Medium | An active agent shall open `/agent/analytics` and view analytics loaded from `GET /api/activities/analytics`, including activity/application performance indicators suitable for dashboard charts and export. The view shall display empty-state messaging when no data exists. |

### 3.5 Administration

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-18** | **Dashboard overview** | Medium | The administrator shall view aggregate metrics: total students, total agents, pending agent requests, and active activities via `GET /api/admin/dashboard`. |
| **FR-19** | **Approve or reject agent requests** | High | The administrator shall list pending agents and approve or reject registrations. Approved agents receive status `Active`. |
| **FR-20** | **Manage users** | Medium | The administrator shall open `/admin/users` and view a paginated user list (`GET /api/admin/users?page=&pageSize=`). The administrator shall change user role (`PATCH /api/admin/users/{id}/role`) and account status (`PATCH /api/admin/users/{id}/status`). |
| **FR-21** | **View all activities** | Low | The administrator shall view and manage activities across universities (existing or planned admin tooling). |
| **FR-28** | **Maintain university lookups** | Medium | The administrator shall list, create, update, and delete universities via `/api/universities` from the lookups UI. Updates shall use `PUT /api/universities/{id}`. |
| **FR-42** | **Moderation reports** | Medium | The administrator shall open `/admin/moderation`, retrieve reports via `GET /api/admin/moderation/reports`, and submit an action for a report via `POST /api/admin/moderation/reports/{reportId}/action`. The system shall preserve the moderation result and show success/error feedback. |
| **FR-43** | **Finance overview** | Medium | The administrator shall open `/admin/finance`, retrieve aggregate financial data via `GET /api/admin/finance/summary`, and retrieve transaction rows via `GET /api/admin/finance/transactions`. The UI shall distinguish internal marketplace/order tracking from external payment settlement. |
| **FR-44** | **Maintain faculty lookups** | Medium | The administrator shall list, create, update, and delete faculty lookup records via `GET/POST /api/admin/lookups/faculties`, `PATCH /api/admin/lookups/faculties/{id}`, and `DELETE /api/admin/lookups/faculties/{id}`. The UI shall confirm destructive delete actions. |

### 3.6 Public website content

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-29** | **Public aggregate statistics** | Medium | Unauthenticated visitors shall view platform statistics on the home page via `GET /api/public/stats`, including counts of students, active agents, and registered universities (displayed as “communities”). |
| **FR-30** | **Public top agents listing** | Low | Unauthenticated visitors shall view a list of active agents on the home page via `GET /api/public/top-agents?limit={n}` (default 4, maximum 12). Each entry shall include display name, organization title, and avatar URL. |
| **FR-45** | **Public growth trends** | Low | Unauthenticated visitors shall view growth trend data via `GET /api/public/growth-trends` for use in landing-page analytics sections. |
| **FR-46** | **Public top students listing** | Low | Unauthenticated visitors shall view top-performing students via `GET /api/public/top-students?limit={n}` for leaderboard-style public promotion. |
| **FR-47** | **Public agent profile** | Medium | Any visitor shall open `/agent/{agentId}` and view a public agent profile loaded from `GET /api/public/agents/{agentId}`. The system shall return a controlled not-found response when the agent is unavailable. |

### 3.7 In-app notifications

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-31** | **List notifications** | High | Authenticated users shall retrieve their notifications via `GET /api/notifications`, ordered by recency. |
| **FR-32** | **Mark notification read** | Medium | The user shall mark one notification read via `PATCH /api/notifications/{id}/read`. |
| **FR-33** | **Mark all notifications read** | Low | The user shall mark all notifications read via `PATCH /api/notifications/read-all`. |
| **FR-34** | **Delete notifications** | Medium | The user shall delete one notification (`DELETE /api/notifications/{id}`) or clear all (`DELETE /api/notifications`). |
| **FR-35** | **Application event notifications** | High | The system shall create notifications when a student submits an application and when an agent (or admin) approves or rejects that application. Notification records shall include type, title, body, optional link, and `isRead` flag. |

> **Note:** FR-35 describes in-app notifications only. Mobile push is excluded per §1.2.2.

### 3.8 Gamification and public portfolio

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-36** | **Student points** | Medium | The system shall maintain a non-negative **Points** value on each student profile. Points shall increase per rules in FR-10 and FR-16. |
| **FR-37** | **Student badges** | Medium | The system shall award named badges with description and icon. Duplicate badge names per user shall be prevented. Badges shall be listed on the public portfolio and student gamification views. |
| **FR-38** | **Leaderboard** | Medium | Authenticated students shall view a university-scoped leaderboard via `GET /api/gamification/leaderboard` (optional `universityId`). The student shall view personal points and rank via `GET /api/gamification/me/points`. |
| **FR-39** | **Public student portfolio** | High | Any visitor shall open `/u/{username}` where `{username}` is a portfolio slug or student code. The system shall return portfolio data via `GET /api/students/{username}/portfolio` (anonymous). Only **active** students shall be exposed. The page shall show academic info, points, rank, badges, and application history (title, organization, status, applied date). |
| **FR-40** | **Portfolio discovery from profile** | Low | Active students shall navigate to their public portfolio from the profile page using student code or slug. |

### 3.9 Community

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-48** | **Browse communities** | Medium | Any visitor shall retrieve community cards via `GET /api/communities` and open community pages at `/community`. The UI shall show an empty state if no communities are available. |
| **FR-49** | **Browse community threads** | Medium | Any visitor shall retrieve threads for a community via `GET /api/communities/{communityId}/threads` and open a thread summary via `GET /api/communities/threads/{threadId}`. Threads shall be displayed with title, author, counts, and recency metadata when available. |
| **FR-50** | **Create community threads** | Medium | An authenticated user shall create a thread in a community via `POST /api/communities/{communityId}/threads`. Unauthenticated users shall be required to log in before creating content. |
| **FR-51** | **Browse and create posts** | Medium | Any visitor shall retrieve posts for a thread via `GET /api/communities/threads/{threadId}/posts`. Authenticated users shall create posts via `POST /api/communities/threads/{threadId}/posts`. |
| **FR-52** | **Upvote posts** | Low | An authenticated user shall toggle a post upvote via `POST /api/communities/posts/{postId}/upvote`. The response shall reflect the resulting upvote state/count used by the UI. |

### 3.10 Store, orders, and vendors

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-53** | **Browse store catalog** | Medium | Any visitor shall browse categories via `GET /api/store/categories`, products via `GET /api/store/products`, and product details via `GET /api/store/products/{id}`. Product lists may be filtered by category and university. |
| **FR-54** | **Browse housing listings** | Medium | Any visitor shall browse housing listings via `GET /api/store/housing`, optionally filtered by university and maximum price. Authenticated users may request roommate matching via `POST /api/store/housing/{listingId}/match`. |
| **FR-55** | **Browse stationery lists** | Low | Any visitor shall retrieve supported school years via `GET /api/store/school-years` and stationery lists via `GET /api/store/stationery` using university, faculty, and year filters. |
| **FR-56** | **Browse cafeteria menus and place food orders** | Medium | Any visitor shall browse cafeterias via `GET /api/store/food/cafeterias` and menus via `GET /api/store/food/cafeterias/{cafeteriaId}/menu`. Authenticated users shall place food orders via `POST /api/store/food/order`. |
| **FR-57** | **Manage cart and wishlist** | Medium | Authenticated users shall list, add, update, and remove cart items via `/api/store/cart` endpoints. Authenticated users shall list, add, and remove wishlist products via `/api/store/wishlist` endpoints. |
| **FR-58** | **Checkout and order history** | High | Authenticated users shall create a store order via `POST /api/orders`, list their orders via `GET /api/orders/my`, and view order details via `GET /api/orders/{orderId}`. Users with permitted access shall update order status via `PATCH /api/orders/{orderId}/status`. External payment gateway processing is out of scope. |
| **FR-59** | **Vendor product management** | Medium | Agents and administrators shall list vendor-owned products via `GET /api/vendors/me/products` and submit new vendor products via `POST /api/vendors/me/products`. Access shall be restricted to roles `Agent` and `Admin`. |

### 3.11 User interface settings

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-22** | **Dark/light mode** | Low | The user shall toggle themes; preference shall persist in client storage. |
| **FR-23** | **Language toggle** | Low | The user shall switch between Arabic and English; visible strings shall update accordingly (including portfolio and admin users screens). |

### 3.12 Flutter mobile application (demo)

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-24** | **Mobile login** | Medium | The student shall log in via the same API; JWT shall be stored on device. |
| **FR-25** | **Mobile browse activities** | Medium | The student shall list open activities for their university. |
| **FR-26** | **Mobile profile view** | Low | The student shall view profile summary and application history. |

> **Note:** FR-31 through FR-59 are not required on mobile for this release unless explicitly planned in a mobile sprint.

---

## 4. Non-Functional Requirements

| ID | Category | Requirement |
|---|---|---|
| **NFR-01** | Performance | The system shall return API responses within 2 seconds under normal load for standard CRUD and read operations. |
| **NFR-02** | Security | Passwords shall be stored using ASP.NET Identity hashing (PBKDF2). |
| **NFR-03** | Security | All endpoints shall require JWT authentication **except** explicitly public endpoints: `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/forgot-password`, `POST /api/auth/reset-password`, `GET /api/public/*`, `GET /api/students/{username}/portfolio`, public community read endpoints, and public store browsing endpoints. Authenticated mutations remain protected. |
| **NFR-04** | Security | Admin and agent mutation endpoints shall enforce role-based access control. Agents shall only review applications for activities they own unless admin override applies. |
| **NFR-05** | Usability | The web application shall be responsive on mobile, tablet, and desktop form factors. |
| **NFR-06** | Usability | The web application shall support Arabic and English (i18n). |
| **NFR-07** | Usability | The web application shall support dark and light themes. |
| **NFR-08** | Compatibility | The web application shall support current versions of Chrome, Firefox, and Edge. |
| **NFR-09** | Architecture | The backend shall follow Clean Architecture (Domain → Application → Infrastructure → API) with the repository pattern. |
| **NFR-10** | API | All endpoints shall return the standard response envelope (see §1.3). |
| **NFR-11** | Reliability | Post-commit gamification and notification side effects shall not roll back or fail the primary business transaction (apply, review, profile activation). |
| **NFR-12** | Data integrity | `PortfolioSlug` shall be unique when not null. Student badge names shall be unique per user. |

---

## 5. Logical data model (conceptual)

```
┌──────────────┐     ┌───────────────────┐     ┌──────────────┐
│ Universities │     │      Users        │     │  Activities  │
├──────────────┤     ├───────────────────┤     ├──────────────┤
│ Id (PK)      │◄──┐ │ Id (PK)           │  ┌─►│ Id (PK)      │
│ Name         │   │ │ Email             │  │  │ Title        │
│ Location     │   │ │ PasswordHash      │  │  │ Description  │
└──────────────┘   │ │ Role (enum)       │  │  │ UniversityId │
                   │ │ Status (enum)     │  │  │ CreatedBy    │
                   ├─│ UniversityId (FK) │  │  │ Status (enum)│
                   │ │ StudentCode       │  │  │ StartDate    │
                   │ └───────┬───────────┘  │  │ Deadline     │
                   │         │              │  │ MaxPeople    │
                   │    ┌────▼────────┐     │  └──────┬───────┘
                   │    │StudentProfile│     │         │
                   │    ├─────────────┤     │  ┌──────┴───────┐
                   │    │ Points      │     │  │ Applications │
                   │    │ PortfolioSlug│    │  ├──────────────┤
                   │    │ (unique)    │     │  │ Id (PK)      │
                   │    └─────────────┘     │  │ StudentId(FK)│
                   │    ┌─────────────┐     └──│ ActivityId   │
                   │    │ AgentProfile│        │ Status (enum)│
                   │    └─────────────┘        │ AppliedAt    │
                   │                           │ ReviewedAt   │
                   │    ┌─────────────┐        │ ReviewedBy   │
                   │    │Notifications│        └──────────────┘
                   │    ├─────────────┤
                   │    │ Id, UserId  │        ┌──────────────┐
                   │    │ Type, Title │        │StudentBadges │
                   │    │ Body, Link  │        ├──────────────┤
                   │    │ IsRead      │        │ UserId, Name │
                   │    └─────────────┘        │ (unique pair)│
                   │                           └──────────────┘
                   └── FK: Users.UniversityId → Universities.Id
```

**Migration (Release 2.0):** `20260601185458_AddGamificationNotificationsPortfolio` adds `Notifications`, `StudentBadges`, `StudentProfiles.Points`, and `StudentProfiles.PortfolioSlug`.

**Release 2.1 data domains:** Community, marketplace/store, moderation, finance, and vendor features are implemented as additional bounded contexts exposed through their API controllers. Their detailed physical schema is maintained in the database migrations and application entities; this SRS records the conceptual requirement baseline and public API contracts.

---

## 6. External interface requirements — REST API summary

All authenticated requests shall include `Authorization: Bearer {JWT}` unless noted.

### 6.1 Authentication

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | No | Register student or agent |
| POST | `/api/auth/login` | No | Login; returns JWT |
| POST | `/api/auth/logout` | Yes | Logout |
| POST | `/api/auth/forgot-password` | No | Request password reset |
| POST | `/api/auth/reset-password` | No | Complete password reset |

### 6.2 Profile

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| POST | `/api/profile/complete/student` | Yes | Complete student profile |
| POST | `/api/profile/complete/agent` | Yes | Complete agent profile |
| GET | `/api/profile/me` | Yes | Current user profile |
| PUT | `/api/profile/me` | Yes | Update profile |

### 6.3 Activities and applications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/activities` | Yes | List activities (university-filtered for students) |
| GET | `/api/activities/mine` | Agent | Agent’s activities |
| GET | `/api/activities/analytics` | Agent | Agent activity/application analytics |
| GET | `/api/activities/{id}` | Yes | Activity details |
| POST | `/api/activities` | Agent | Create activity |
| PUT | `/api/activities/{id}` | Agent | Update activity |
| PATCH | `/api/activities/{id}/status` | Agent | Change activity status |
| POST | `/api/activities/{id}/apply` | Student | One-click apply |
| GET | `/api/activities/{id}/applications` | Agent | Applications for activity |
| GET | `/api/applications/mine` | Student | Student’s applications |
| PATCH | `/api/applications/{id}/review` | Agent | Approve or reject |

### 6.4 Administration

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/admin/dashboard` | Admin | Dashboard statistics |
| GET | `/api/admin/agents/pending` | Admin | Pending agent registrations |
| PATCH | `/api/admin/agents/{id}/review` | Admin | Approve or reject agent |
| GET | `/api/admin/users` | Admin | Paginated user list |
| PATCH | `/api/admin/users/{id}/role` | Admin | Change user role |
| PATCH | `/api/admin/users/{id}/status` | Admin | Change account status |
| GET | `/api/admin/moderation/reports` | Admin | List moderation reports |
| POST | `/api/admin/moderation/reports/{reportId}/action` | Admin | Apply a moderation action |
| GET | `/api/admin/finance/summary` | Admin | Finance summary |
| GET | `/api/admin/finance/transactions` | Admin | Finance transactions |
| GET | `/api/admin/lookups/faculties` | Admin | List faculty lookups |
| POST | `/api/admin/lookups/faculties` | Admin | Create faculty lookup |
| PATCH | `/api/admin/lookups/faculties/{id}` | Admin | Update faculty lookup |
| DELETE | `/api/admin/lookups/faculties/{id}` | Admin | Delete faculty lookup |

### 6.5 Universities (lookups)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/universities` | Yes | List universities |
| GET | `/api/universities/{id}` | Yes | Get university |
| POST | `/api/universities` | Admin | Create university |
| PUT | `/api/universities/{id}` | Admin | Update university |
| DELETE | `/api/universities/{id}` | Admin | Delete university (constraints apply) |

### 6.6 Public content

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/public/stats` | No | Platform aggregate statistics |
| GET | `/api/public/top-agents` | No | Active agents for home page |
| GET | `/api/public/growth-trends` | No | Public growth trend data |
| GET | `/api/public/agents/{agentId}` | No | Public agent profile |
| GET | `/api/public/top-students` | No | Top performing students |

### 6.7 Notifications

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/notifications` | Yes | List current user’s notifications |
| PATCH | `/api/notifications/{id}/read` | Yes | Mark one as read |
| PATCH | `/api/notifications/read-all` | Yes | Mark all as read |
| DELETE | `/api/notifications/{id}` | Yes | Delete one |
| DELETE | `/api/notifications` | Yes | Delete all |

### 6.8 Gamification

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/gamification/leaderboard` | Yes | Ranked students (optional `universityId`) |
| GET | `/api/gamification/me/points` | Student | Current student points, rank, badges |

### 6.9 Public portfolio

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/students/{username}/portfolio` | No | Public portfolio by slug or student code |

### 6.10 Communities

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/communities` | No | List communities |
| GET | `/api/communities/{communityId}/threads` | No | List threads in a community |
| GET | `/api/communities/threads/{threadId}` | No | Get thread summary/details |
| POST | `/api/communities/{communityId}/threads` | Yes | Create thread |
| GET | `/api/communities/threads/{threadId}/posts` | No | List posts in a thread |
| POST | `/api/communities/threads/{threadId}/posts` | Yes | Create post |
| POST | `/api/communities/posts/{postId}/upvote` | Yes | Toggle post upvote |

### 6.11 Store, orders, and vendors

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| GET | `/api/store/categories` | No | List store categories |
| GET | `/api/store/products` | No | List products with optional filters |
| GET | `/api/store/products/{id}` | No | Product details |
| GET | `/api/store/housing` | No | List housing options |
| POST | `/api/store/housing/{listingId}/match` | Yes | Request roommate match |
| GET | `/api/store/stationery` | No | List stationery by filters |
| GET | `/api/store/school-years` | No | List school years |
| GET | `/api/store/food/cafeterias` | No | List cafeterias |
| GET | `/api/store/food/cafeterias/{cafeteriaId}/menu` | No | Cafeteria menu |
| POST | `/api/store/food/order` | Yes | Place food order |
| GET | `/api/store/cart` | Yes | Current user cart |
| POST | `/api/store/cart` | Yes | Add cart item |
| PATCH | `/api/store/cart/{itemId}` | Yes | Update cart item |
| DELETE | `/api/store/cart/{itemId}` | Yes | Remove cart item |
| GET | `/api/store/wishlist` | Yes | Current user wishlist |
| POST | `/api/store/wishlist/{productId}` | Yes | Add product to wishlist |
| DELETE | `/api/store/wishlist/{productId}` | Yes | Remove product from wishlist |
| POST | `/api/orders` | Yes | Checkout / place order |
| GET | `/api/orders/my` | Yes | Current user orders |
| GET | `/api/orders/{orderId}` | Yes | Order details |
| PATCH | `/api/orders/{orderId}/status` | Yes | Update order status |
| GET | `/api/vendors/me/products` | Agent/Admin | Vendor product list |
| POST | `/api/vendors/me/products` | Agent/Admin | Add vendor product |

---

## 7. Requirements traceability (Release 2.0–2.1)

| Delivery phase | Requirements addressed | Implementation reference |
|---|---|---|
| P0 — Agent wiring | FR-14, FR-15, FR-16, FR-17, FR-27 | `integrate/wire-p0-p1-p2` (PR #127) |
| P1 — Admin & public home | FR-20, FR-28, FR-29, FR-30 | `integrate/wire-p0-p1-p2` (PR #128) |
| P2 — Engagement | FR-10, FR-16, FR-31–FR-40, NFR-11, NFR-12 | `integrate/wire-p0-p1-p2` (PR #129) |
| Release 2.1 — Agent analytics | FR-41 | `ActivitiesController`, `AgentAnalytics.jsx` |
| Release 2.1 — Admin extensions | FR-42, FR-43, FR-44 | `AdminController`, `AdminModeration.jsx`, `AdminFinance.jsx`, `AdminLookups.jsx` |
| Release 2.1 — Public expansion | FR-45, FR-46, FR-47 | `PublicController`, `AgentPortfolio.jsx`, landing page public services |
| Release 2.1 — Community | FR-48–FR-52 | `CommunitiesController`, `CommunityBrowse.jsx`, `CommunityThreads.jsx`, `CommunityPosts.jsx` |
| Release 2.1 — Store and vendors | FR-53–FR-59 | `StoreController`, `OrdersController`, `VendorsController`, store pages, `StoreVendor.jsx` |

---

## 8. Revision history

| Version | Date | Author / source | Description |
|---|---|---|---|
| 1.0 | 2026-03-01 | Project team | Initial MVP SRS (Stage 2) |
| 2.0 | 2026-03-01 | Project team | Expanded API summary and schema alignment |
| 2.1 | 2026-06-01 | Project team | Release 2.0: agent kanban, admin users, public home, notifications, gamification, public portfolio; updated NFRs, data model, API catalog, traceability |
| 2.2 | 2026-06-02 | Project team | Release 2.1 scope alignment: agent analytics, admin moderation/finance/faculty lookups, public growth/top-students/agent profile, community APIs, store/orders/vendors; updated scope, NFR public endpoint exceptions, API catalog, and traceability |

---

## 9. Approval

| Role | Name | Signature | Date |
|---|---|---|---|
| Project lead | | | |
| Technical lead | | | |
| QA / Verification | | | |

> This SRS shall be reviewed when scope changes affect authentication, public data exposure, or student privacy (public portfolio).

---

**Document control:** SH-SRS-001 v2.2 — June 2, 2026 — Stage 2 (Requirements baseline, web MVP Release 2.1)
