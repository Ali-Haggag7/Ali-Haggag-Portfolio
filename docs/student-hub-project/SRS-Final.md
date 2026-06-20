# Software Requirements Specification

## StudentHub

### A Unified Web Platform for University Student Activities, Engagement, and Services

```
Version 1.0
Final Presentation Edition
```

```
Prepared by:

  Abdelrahman Yahia        Team Lead & Backend
  Yousef Alaa              Backend
  Mohamed Ezz              Backend
  Marwan Mohamed           Backend
  Omar Mohamed             Frontend
  Ali Haggag               Frontend
  Mahmoud Abdelhady        Mobile
  Omar Abdeen              Mobile

Qena National University
Faculty of Computers and Information — Computer Science Department
```

```
Date: June 2, 2026
Prepared in accordance with IEEE Std 830-1998 and ISO/IEC/IEEE 29148:2018
```

---

## Table of Contents

- **1. Introduction**
  - 1.1 Purpose
  - 1.2 Document Conventions
  - 1.3 Intended Audience
  - 1.4 Project Scope
- **2. Overall Description**
  - 2.1 Product Perspective
  - 2.2 Product Features
  - 2.3 User Classes and Characteristics
  - 2.4 Operating Environment
  - 2.5 Account Status Flow
  - 2.6 Use Case Summary
  - 2.7 Design and Implementation Constraints
  - 2.8 Assumptions and Dependencies
- **3. System Features**
  - 3.1 Authentication & Account Management
  - 3.2 Profile Management
  - 3.3 Student Activities & Applications
  - 3.4 Agent Operations & Analytics
  - 3.5 Administration
  - 3.6 Public Website Content
  - 3.7 In-App Notifications
  - 3.8 Gamification & Public Portfolio
  - 3.9 Community
  - 3.10 Store, Orders & Vendors
  - 3.11 Student Services
  - 3.12 User Interface Settings
  - 3.13 Mobile Application (Demo)
- **4. External Interface Requirements**
  - 4.1 User Interfaces
  - 4.2 Hardware Interfaces
  - 4.3 Software Interfaces
  - 4.4 Communications Interfaces
- **5. Non-Functional Requirements**
  - 5.1 Performance
  - 5.2 Security
  - 5.3 Software Quality Attributes
- **6. System Data Model**

---

## 1. Introduction

StudentHub is a web-based platform that connects university students with campus activities, student-led organizations, engagement features, and essential student services within a single integrated system. The platform is built around three roles — **Student**, **Agent**, and **Admin** — secured through a Role-Based Access Control (RBAC) mechanism so that each role accesses only the features assigned to it. The system is delivered as a responsive web application backed by a REST API, with a demonstration mobile client for core student actions.

### 1.1 Purpose

This Software Requirements Specification (SRS) defines the functional and non-functional requirements of the StudentHub platform. It serves as the authoritative reference describing what the system does, who uses it, and the constraints under which it operates, supporting design, implementation, verification, and final evaluation.

### 1.2 Document Conventions

The following conventions are used throughout this document:

- Functional requirements are prefixed with **FR-** and non-functional requirements with **NFR-**.
- The keyword **shall** denotes a mandatory requirement; **should** denotes a recommended behavior.
- Each functional requirement is assigned a **priority**: High, Medium, or Low.
- Defined terms used across the document:

| Term | Definition |
|---|---|
| **Student** | A registered user with a completed university profile and the Student role. |
| **Agent** | An activity representative (e.g., club or organization lead) approved by an administrator. |
| **Admin** | A system administrator with full platform oversight. |
| **Activity** | An event or opportunity published by an agent for students to apply to. |
| **Application** | A student's request to join an activity, with status Pending, Approved, or Rejected. |
| **Profile completion** | Submission of all mandatory profile fields required for a user's role. |
| **Portfolio** | A public page showcasing a student's academic info, points, badges, and activity history. |
| **Gamification** | Points and badges awarded to students for defined actions. |
| **Community** | A public discussion space organized into threads, posts, and upvotes. |
| **Store / Marketplace** | A student services area for products, housing, stationery, and food ordering. |
| **Student Services** | A suite of campus-life features: charity events, onboarding and mentorship, event ticketing, opportunities, certificate verification, and polls. |
| **Opportunity** | A scholarship, internship, or similar listing students can browse and apply to. |
| **Poll** | A question published for the student community to vote on. |
| **RBAC** | Role-Based Access Control restricting features by user role. |
| **JWT** | JSON Web Token used for authenticated API access. |

### 1.3 Intended Audience

This document is intended for:

- **Evaluators and reviewers** — to assess the completeness and quality of system requirements.
- **Developers** — to understand the features and behaviors to implement and maintain.
- **Testers** — to derive test cases from functional requirements and acceptance criteria.
- **Project stakeholders** — to review and confirm the delivered scope.

### 1.4 Project Scope

StudentHub provides a unified environment for discovering and participating in university activities, building a public student profile, engaging with peers, and accessing campus services. The platform's core capabilities include:

- Secure registration, login, and account recovery with role-based access.
- Student and agent profile management with activation workflows.
- Activity publishing by agents and one-click application by students.
- Application review through table and kanban interfaces, with agent analytics.
- Administrative oversight: dashboards, approvals, user management, moderation, finance overview, and reference-data maintenance.
- Public content: platform statistics, growth trends, featured agents and students, and public portfolios.
- Engagement: in-app notifications, points, badges, and a university-scoped leaderboard.
- Community discussions: browsing, threads, posts, and upvotes.
- Student services store: product catalog, housing, stationery, food ordering, cart, wishlist, checkout, orders, and vendor product submission.
- Campus-life services: charity events and volunteering, onboarding and mentorship, event ticketing, opportunities, certificate verification, and student polls.
- Image upload for profiles and platform content.
- Bilingual (Arabic / English) and theme-aware (dark / light) user interface.

**Roles at a glance:**

- **Student** — Registers, completes a profile, browses and applies to activities, earns points and badges, builds a public portfolio, participates in communities, and uses store services.
- **Agent** — Creates and manages activities, reviews applications, views analytics, and submits vendor products.
- **Admin** — Manages users and agents, moderates content, oversees finance summaries, and maintains reference data.

---

## 2. Overall Description

### 2.1 Product Perspective

StudentHub is a new, self-contained product rather than a replacement for an existing system. It follows a layered client–server architecture: a React web application and a demonstration Flutter mobile client communicate with a central REST API built on a Clean Architecture backend, which persists data in a relational database.

```
   React Web App  ──────►  REST API  ◄──────  Flutter Mobile App (demo)
                              │
                       .NET Web API
                    (Clean Architecture:
              Domain → Application → Infrastructure → API)
                              │
                      Relational Database
```

### 2.2 Product Features

The platform is organized into the following feature areas:

- **Authentication & Account Management** — registration, login, logout, and password recovery.
- **Profile Management** — student and agent profile completion and activation.
- **Activities & Applications** — activity publishing, browsing, and one-click application.
- **Agent Operations & Analytics** — activity lifecycle management, application review, and performance analytics.
- **Administration** — dashboards, approvals, user management, moderation, finance overview, and lookup maintenance.
- **Public Website Content** — statistics, growth trends, featured agents/students, and public profiles.
- **Notifications** — in-app notifications for relevant platform events.
- **Gamification & Portfolio** — points, badges, leaderboard, and public student portfolios.
- **Community** — discussion communities, threads, posts, and upvotes.
- **Store & Marketplace** — product catalog, housing, stationery, food ordering, cart, wishlist, checkout, orders, and vendor products.
- **Student Services** — charity events, onboarding and mentorship, event ticketing, opportunities, certificate verification, and student polls.
- **Cross-Cutting** — image upload, bilingual UI, theming, and a consistent API response structure.

### 2.3 User Classes and Characteristics

| User Class | Characteristics |
|---|---|
| **Student** | University students from varied academic backgrounds who discover activities, build a portfolio, engage with peers, and use services. |
| **Agent** | Representatives of clubs or organizations responsible for creating activities and reviewing applicants. |
| **Admin** | Platform operators responsible for governance, moderation, user management, and reference data. |

### 2.4 Operating Environment

**Web Platform**
- Compatible with current versions of major browsers (Chrome, Firefox, and Edge).
- Responsive across desktop, tablet, and mobile form factors.
- JavaScript must be enabled for full functionality.

**Mobile Application (Demonstration)**
- A Flutter client providing a subset of student features (login, activity browsing, and profile view).

**Server-Side**
- A REST API built on a Clean Architecture .NET backend.
- A relational database management system.
- Cloud-friendly hosting suitable for horizontal scaling.

### 2.5 Account Status Flow

Every account follows a defined lifecycle from registration to active use. Students activate automatically once their profile is complete, while agents require administrator approval before being granted operational privileges.

```
   Guest
     │
     ▼
  Register ───────────► Inactive
                           │
                Complete Profile
                           │
              ┌────────────┴────────────┐
              │                         │
           Student                    Agent
              │                         │
              ▼                         ▼
           Active                    Pending
                                        │
                          ┌─────────────┴─────────────┐
                          │                           │
                   Admin Approves              Admin Rejects
                          │                           │
                          ▼                           ▼
                       Active                     Rejected
```

**State definitions:**

| State | Meaning |
|---|---|
| **Inactive** | Account exists but the profile is incomplete; the user cannot use core features. |
| **Pending** | Agent profile submitted; awaiting administrator review. |
| **Active** | Account is fully operational with role-appropriate access. |
| **Rejected** | Agent registration was declined and cannot proceed. |

### 2.6 Use Case Summary

The following actor-feature matrix summarizes which user classes interact with each feature area. A check mark indicates the actor has at least one supported action within that feature; specific actions and constraints are detailed in Section 3.

| Feature Area | Visitor | Student | Agent | Admin |
|---|:---:|:---:|:---:|:---:|
| Authentication & Account Recovery | ✓ | ✓ | ✓ | ✓ |
| Profile Management | — | ✓ | ✓ | — |
| Browse Activities | — | ✓ | ✓ | ✓ |
| Apply to Activities | — | ✓ | — | — |
| Manage Activities (CRUD, Publish) | — | — | ✓ | ✓ |
| Review Applications (Table & Kanban) | — | — | ✓ | ✓ |
| Agent Analytics | — | — | ✓ | — |
| User & Agent Approval Management | — | — | — | ✓ |
| Moderation & Finance Oversight | — | — | — | ✓ |
| Reference-Data Maintenance (Lookups) | — | — | — | ✓ |
| Public Statistics & Featured Profiles | ✓ | ✓ | ✓ | ✓ |
| Public Student Portfolio | ✓ | ✓ | ✓ | ✓ |
| In-App Notifications | — | ✓ | ✓ | ✓ |
| Points, Badges, Leaderboard | — | ✓ | — | — |
| Community: Browse | ✓ | ✓ | ✓ | ✓ |
| Community: Post & Upvote | — | ✓ | ✓ | ✓ |
| Store: Browse Catalog & Services | ✓ | ✓ | ✓ | ✓ |
| Store: Cart, Wishlist, Checkout, Orders | — | ✓ | ✓ | ✓ |
| Vendor Product Submission | — | — | ✓ | ✓ |
| Student Services: Browse (charity, events, opportunities, polls, verify) | ✓ | ✓ | ✓ | ✓ |
| Student Services: Participate (register, book, apply, vote, mentorship) | — | ✓ | ✓ | ✓ |
| Manage Services Content (charity, events, opportunities, polls) | — | — | ✓ | ✓ |
| Event Check-in (QR Verification) | — | — | ✓ | — |
| Image Upload | — | ✓ | ✓ | ✓ |
| Theme & Language Preferences | ✓ | ✓ | ✓ | ✓ |

### 2.7 Design and Implementation Constraints

- The system shall implement RBAC to restrict access based on user role.
- All passwords shall be stored using a secure hashing scheme and never in plain text.
- All client–server communication shall use HTTPS.
- The backend shall follow Clean Architecture (Domain → Application → Infrastructure → API) with the repository pattern.
- All API endpoints shall return a consistent response structure of the form `{ success, message, data, errors? }`.

### 2.8 Assumptions and Dependencies

- Users have a stable internet connection.
- Email delivery is functional for account recovery flows.
- The application is accessed through a supported, JavaScript-enabled browser.
- Administrator accounts are provisioned by the operator (no public admin registration).

---

## 3. System Features

> Requirements use **shall/should** language. Each carries a priority and verifiable acceptance criteria.

### 3.1 Authentication & Account Management

The system handles registration, login, logout, and password recovery, issuing a JWT that encodes the user's role and status to enforce RBAC.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-01** | Register | High | The system shall allow a user to register with email, password, and account type (Student or Agent). New accounts are created with status `Inactive`. Duplicate emails shall be rejected with a clear error. |
| **FR-02** | Login | High | The system shall authenticate users by email and password and return a JWT containing role and status claims. The client shall redirect users according to role and status. |
| **FR-03** | Logout | High | The system shall end the client session by invalidating the stored token and redirecting the user to the login page. |
| **FR-04** | Password recovery | Medium | The user shall request a password reset by email and receive a time-limited reset link (30 minutes). After resetting, the user is redirected to login. |

### 3.2 Profile Management

Profiles capture the academic and organizational data needed to participate, and gate access to dependent features until complete.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-05** | Student profile completion | High | When all required fields are valid (Full Name, National ID, Phone, University, Faculty, Department, Batch), the system shall set status to `Active`, generate a unique student code, and assign a unique portfolio slug. |
| **FR-06** | Agent profile completion | High | An agent shall submit Full Name, Organization Name, University, and Role Description. Status becomes `Pending` on submission and `Active` only after admin approval. Agents cannot publish activities until active. |
| **FR-07** | View profile | Medium | Active users shall view their profile information, student code (students), and activity history, with a link to their public portfolio. |
| **FR-08** | Profile completeness indicator | Low | The profile page shall display a completion percentage, and dependent features shall remain locked until the profile is complete. |
| **FR-66** | Image upload | Medium | Authenticated users shall upload images (JPEG, PNG, WebP, or GIF, up to 10 MB) for use as profile photos and other platform content (e.g., community and vendor products). Administrators may delete uploaded images. Invalid types or oversized files shall be rejected with a clear error. |

### 3.3 Student Activities & Applications

Students discover activities scoped to their university and apply using their existing profile data.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-09** | Browse activities | High | Active students shall see activities filtered by university, each showing title, description, organization, status, deadline, and participant count. Only `Open` activities are listed for application. |
| **FR-10** | One-click apply | High | The student shall apply with a single action using profile data. Duplicate applications shall be prevented, and the control shall be disabled for incomplete profiles. A successful application should award points and a first-application badge and create a notification. |
| **FR-11** | View application status | Medium | The student shall view all applications and their statuses (`Pending`, `Approved`, `Rejected`). |
| **FR-12** | Activity details | Medium | The activity detail view shall show description, dates, capacity, current enrollment, and the apply action when eligible. |

### 3.4 Agent Operations & Analytics

Agents manage the full activity lifecycle and review applicants through both table and kanban views, supported by analytics.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-13** | Create activity | High | An active agent shall create an activity with title, description, start date, deadline, and maximum participants. The initial status is `Draft`. |
| **FR-14** | Publish activity | High | The agent shall change an activity from `Draft` to `Open`, making it visible to students, with success or error feedback. |
| **FR-15** | View applications | High | The agent shall view applications per activity, including student name, faculty, phone (when available), applied date, and status. |
| **FR-16** | Approve or reject application | High | The agent shall set an application to `Approved` or `Rejected`. Approval should award points and a badge and notify the student; rejection should notify the student. Engagement side effects shall not fail the review. |
| **FR-17** | Edit or close activity | Medium | The agent shall update activity fields and close an activity via a status change; changes persist and reflect on refresh. |
| **FR-27** | Kanban application review | High | The agent shall review applications across Pending, Accepted (Approved), and Rejected columns; moving a card updates the application status and refreshes from the server. |
| **FR-41** | Agent analytics | Medium | An active agent shall view activity and application performance indicators suitable for dashboard charts and export, with an empty-state message when no data exists. |
| **FR-67** | Event check-in verification | Medium | An agent shall verify an attendee's QR code to confirm check-in or eligibility and receive a verification result indicating validity. |

### 3.5 Administration

Administrators govern the platform: approvals, user management, content moderation, finance overview, and reference data.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-18** | Dashboard overview | Medium | The administrator shall view aggregate metrics: total students, total agents, pending agent requests, and active activities. |
| **FR-19** | Approve or reject agents | High | The administrator shall list pending agents and approve or reject them; approved agents become `Active`. |
| **FR-20** | Manage users | Medium | The administrator shall view a paginated user list and change a user's role and account status. |
| **FR-21** | View all activities | Low | The administrator shall view and manage activities across universities. |
| **FR-28** | Maintain university lookups | Medium | The administrator shall list, create, update, and delete universities. |
| **FR-42** | Moderation reports | Medium | The administrator shall retrieve moderation reports and apply an action to a report, with the result preserved and feedback shown. |
| **FR-43** | Finance overview | Medium | The administrator shall view aggregate financial data and transaction records, with internal order tracking clearly distinguished from external payment settlement. |
| **FR-44** | Maintain faculty lookups | Medium | The administrator shall list, create, update, and delete faculty reference records, confirming destructive deletions. |

### 3.6 Public Website Content

Unauthenticated visitors can explore the platform's reach and highlights from the landing experience.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-29** | Public statistics | Medium | Visitors shall view platform statistics, including counts of students, active agents, and registered universities. |
| **FR-30** | Top agents listing | Low | Visitors shall view a list of featured active agents, each with display name, organization title, and avatar. |
| **FR-45** | Growth trends | Low | Visitors shall view growth trend data for landing-page analytics sections. |
| **FR-46** | Top students listing | Low | Visitors shall view top-performing students for public promotion. |
| **FR-47** | Public agent profile | Medium | Visitors shall view a public agent profile, with a controlled not-found response when the agent is unavailable. |

### 3.7 In-App Notifications

The system keeps users informed of relevant events within the application.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-31** | List notifications | High | Authenticated users shall retrieve their notifications, ordered by recency. |
| **FR-32** | Mark one read | Medium | The user shall mark a single notification as read. |
| **FR-33** | Mark all read | Low | The user shall mark all notifications as read in one action. |
| **FR-34** | Delete notifications | Medium | The user shall delete one notification or clear all notifications. |
| **FR-35** | Application event notifications | High | The system shall create notifications when a student applies and when an agent or admin approves or rejects an application. Records include type, title, body, optional link, and read flag. |

### 3.8 Gamification & Public Portfolio

Engagement is reinforced through points and badges, surfaced on a leaderboard and a public portfolio.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-36** | Student points | Medium | The system shall maintain a non-negative points value per student, increasing per the rules in FR-10 and FR-16. |
| **FR-37** | Student badges | Medium | The system shall award named badges with description and icon, preventing duplicate badge names per user. |
| **FR-38** | Leaderboard | Medium | Authenticated students shall view a university-scoped leaderboard and their personal points and rank. |
| **FR-39** | Public student portfolio | High | Any visitor shall open a public portfolio by slug or student code. Only active students are exposed, showing academic info, points, rank, badges, and application history. |
| **FR-40** | Portfolio discovery | Low | Active students shall navigate to their public portfolio from the profile page. |

### 3.9 Community

A public discussion space lets users browse content openly and contribute once authenticated.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-48** | Browse communities | Medium | Any visitor shall view available communities, with an empty state when none exist. |
| **FR-49** | Browse threads | Medium | Any visitor shall view threads within a community and open a thread summary, displaying title, author, and counts where available. |
| **FR-50** | Create threads | Medium | An authenticated user shall create a thread in a community; unauthenticated users are prompted to log in first. |
| **FR-51** | Browse and create posts | Medium | Any visitor shall read posts in a thread; authenticated users shall create posts. |
| **FR-52** | Upvote posts | Low | An authenticated user shall toggle an upvote on a post, with the resulting state reflected in the UI. |

### 3.10 Store, Orders & Vendors

A student services area offers products and campus services with cart, checkout, and order tracking.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-53** | Browse catalog | Medium | Any visitor shall browse categories, products, and product details, with optional filtering by category and university. |
| **FR-54** | Browse housing | Medium | Any visitor shall browse housing listings filtered by university and price; authenticated users may request roommate matching. |
| **FR-55** | Browse stationery | Low | Any visitor shall retrieve supported school years and stationery lists by university, faculty, and year. |
| **FR-56** | Cafeteria menus & food orders | Medium | Any visitor shall browse cafeterias and menus; authenticated users shall place food orders. |
| **FR-57** | Cart and wishlist | Medium | Authenticated users shall manage cart items (add, update, remove) and wishlist products (add, remove, list). |
| **FR-58** | Checkout and orders | High | Authenticated users shall place an order, list their orders, and view order details; permitted users may update order status. External payment-gateway processing is out of scope. |
| **FR-59** | Vendor products | Medium | Agents and administrators shall list and submit vendor products, restricted to the Agent and Admin roles. |

### 3.11 Student Services

A suite of campus-life services extends the platform beyond activities. Browsing is open to visitors; participation requires authentication; and content creation is restricted to agents and administrators.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-60** | Charity events & volunteering | Medium | Any visitor shall browse charity events (optionally filtered by university) and view event details. Agents and administrators shall create charity events. Authenticated users shall register as volunteers, with an option to register anonymously. |
| **FR-61** | Onboarding & mentorship | Medium | Any visitor shall browse orientation sessions and onboarding resources (optionally filtered by university or type). Authenticated users shall view eligible mentors, send mentor requests, and view their own requests; the recipient shall accept or reject an incoming request. |
| **FR-62** | Event ticketing & booking | Medium | Any visitor shall browse bookable events and details. Agents and administrators shall create events. Authenticated users shall book an event, view their bookings, and cancel a booking. |
| **FR-63** | Opportunities | Medium | Any visitor shall browse opportunities (optionally filtered by university or type) and view details. Agents and administrators shall create opportunities. Authenticated users shall apply to an opportunity and view their applications. |
| **FR-64** | Certificate verification | Low | Any visitor shall verify a certificate's authenticity by submitting its identifier, receiving a controlled not-found response when no match exists. |
| **FR-65** | Student voice polls | Medium | Any visitor shall browse polls and poll details. Agents and administrators shall create polls. Authenticated users shall cast a vote and view results. |

### 3.12 User Interface Settings

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-22** | Dark/light mode | Low | The user shall toggle the theme; the preference persists in client storage. |
| **FR-23** | Language toggle | Low | The user shall switch between Arabic and English; visible strings update accordingly. |

### 3.13 Mobile Application (Demo)

A demonstration Flutter client exercises core student flows against the same API.

| ID | Requirement | Priority | Acceptance Criteria |
|---|---|---|---|
| **FR-24** | Mobile login | Medium | The student shall log in via the same API; the JWT is stored on device. |
| **FR-25** | Mobile browse activities | Medium | The student shall list open activities for their university. |
| **FR-26** | Mobile profile view | Low | The student shall view a profile summary and application history. |

---

## 4. External Interface Requirements

### 4.1 User Interfaces

- **Web interface** — a responsive browser-based interface for all roles, supporting Arabic/English and dark/light themes.
- **Mobile interface** — a demonstration Flutter client for core student actions.
- Both interfaces enforce the same RBAC rules to ensure role-appropriate access.

### 4.2 Hardware Interfaces

The system requires no specialized hardware. Any standard device with internet connectivity and a supported browser can access the platform.

### 4.3 Software Interfaces

- **REST API** — a Clean Architecture .NET backend serving all client requests.
- **Relational database** — primary persistent store for platform data.
- **JWT** — bearer-token authentication and session management.
- **Email service** — used for account recovery flows.

### 4.4 Communications Interfaces

- All client–server communication shall use HTTPS.
- The system shall follow RESTful conventions for data exchange.
- All responses shall use the standard response structure `{ success, message, data, errors? }`.

---

## 5. Non-Functional Requirements

### 5.1 Performance

| ID | Requirement |
|---|---|
| **NFR-01** | The system shall return API responses within 2 seconds under normal load for standard read and CRUD operations. |

### 5.2 Security

| ID | Requirement |
|---|---|
| **NFR-02** | Passwords shall be stored using a secure hashing scheme (PBKDF2 via the identity framework). |
| **NFR-03** | All endpoints shall require JWT authentication except explicitly public endpoints (registration, login, password recovery, public landing data, public portfolios, public community reads, public store browsing, public service browsing, and certificate verification). Authenticated mutations remain protected. |
| **NFR-04** | Admin and agent mutation endpoints shall enforce RBAC. Agents may only review applications for activities they own unless an admin override applies. |

### 5.3 Software Quality Attributes

| ID | Attribute | Requirement |
|---|---|---|
| **NFR-05** | Usability | The web application shall be responsive across mobile, tablet, and desktop form factors. |
| **NFR-06** | Usability | The application shall support Arabic and English. |
| **NFR-07** | Usability | The application shall support dark and light themes. |
| **NFR-08** | Compatibility | The application shall support current versions of Chrome, Firefox, and Edge. |
| **NFR-09** | Maintainability | The backend shall follow Clean Architecture with the repository pattern. |
| **NFR-10** | Consistency | All endpoints shall return the standard response structure. |
| **NFR-11** | Reliability | Engagement side effects (points, badges, notifications) shall not roll back or fail the primary business transaction. |
| **NFR-12** | Data integrity | Portfolio slugs shall be unique when present, and badge names shall be unique per user. |

---

## 6. System Data Model

The conceptual data model centers on users (with role and status), their student or agent profiles, the universities they belong to, the activities agents publish, and the applications students submit. Engagement data (points, badges, notifications) and service data (community, store, orders) extend this core.

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
                   │    ┌────▼─────────┐    │  └──────┬───────┘
                   │    │StudentProfile│    │         │
                   │    ├──────────────┤    │  ┌──────┴───────┐
                   │    │ Points       │    │  │ Applications │
                   │    │ PortfolioSlug│    │  ├──────────────┤
                   │    │ (unique)     │    │  │ Id (PK)      │
                   │    └──────────────┘    │  │ StudentId(FK)│
                   │    ┌──────────────┐    └──│ ActivityId   │
                   │    │ AgentProfile │       │ Status (enum)│
                   │    └──────────────┘       │ AppliedAt    │
                   │                           │ ReviewedAt   │
                   │    ┌──────────────┐       │ ReviewedBy   │
                   │    │Notifications │       └──────────────┘
                   │    ├──────────────┤
                   │    │ Id, UserId   │       ┌──────────────┐
                   │    │ Type, Title  │       │ StudentBadges│
                   │    │ Body, Link   │       ├──────────────┤
                   │    │ IsRead       │       │ UserId, Name │
                   │    └──────────────┘       │ (unique pair)│
                   │                           └──────────────┘
                   └── FK: Users.UniversityId → Universities.Id
```

Additional bounded contexts — community, store/marketplace, orders, student services (charity, mentorship, ticketing, opportunities, certificates, and polls), moderation, and finance — extend the model with their own entities while maintaining referential integrity through the user and university tables.

---

*End of document.*
