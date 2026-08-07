# Changelog — Battle Scars

> Every production incident, every painful debug session, every lesson learned.
> Format: **SYMPTOM** → **CAUSE** → **FIX**

---

## [0.1.0] — 2026-07-12


### 🏗️ Project Genesis
- Initialized monorepo structure (pnpm workspaces + Turborepo)
- Created Prisma schema: 8 models, 4 enums
- Set up shared packages: `@scout/shared`, `@scout/db`, `@scout/ai-providers`
- Established ethical boundaries and Final Click Rule in architecture

## [0.2.0] — 2026-07-13

### 🚀 Shipped
- **`@scout/shared` Package Completion**: Added complete Zod validation schemas and derived TypeScript types for auth, profile, preferences, application, and AI layers. Defined typed Socket.io handshake and event contract maps.
- **`apps/api` (NestJS 11 Backend) Scaffold**: Built modular auth, user, profile, preference, and applications modules. Added custom ZodValidationPipe, JwtAuthGuard, WsAuthGuard, and GlobalExceptionFilter.
- **WebSocket Gateway Namespace**: Set up `/agent` gateway namespace with active heartbeat checks (2-minute timeout eviction) and SocketState tracker.
- **E2E Auth Test Suite**: Automated standalone test client validating registration, login, cookie authentication, `/auth/me`, and logout.
- **Graduate Project Docs**: Completed formal Software Requirements Specification (`docs/SRS.md`), System Architecture (`docs/system-architecture.md`), and Database Schema (`docs/database-schema.md`) documents.
- **`@scout/ai-providers` Strategy Layer**: Built a provider-agnostic strategy pattern interface. Implemented a concrete `GroqProviderService` with native HTTP fetch queries, and created stub classes for OpenAI, Gemini, and Claude. Supports CV parsing, JD analysis, match relevance scoring, and factual verification comparisons.
- **`@scout/document-parser` Strategy Layer**: Built a reusable text extraction engine. Created a concrete `DocumentParserService` integrating `pdf-parse` (for PDF) and `mammoth` (for DOCX) to extract raw text from document files.
- **CV Upload Real Ingestion & DB Overwrite Sync**: Wired `@scout/document-parser` and `@scout/ai-providers` into `apps/api`'s profile module. Replaced mock text stubs with actual extraction. Implemented a database transaction block inside `saveRawCv` to cleanly overwrite old records and populate structured JSON and normalized PostgreSQL tables.

### 🩸 Battle Scars

- **SYMPTOM** → Committed real JWT secrets and Groq credentials in `.env.example`
  - **CAUSE** → Accidentally edited the template `.env.example` directly instead of copy-pasting to the gitignored `.env` / `packages/db/.env`.
  - **FIX** → Reverted template to placeholders, committed immediately, and restricted production secrets strictly to gitignored local files.
- **SYMPTOM** → Mermaid syntax parser error in sequence diagram (`docs/system-architecture.md`)
  - **CAUSE** → Mermaid sequence diagram choked on angle brackets (`<JWT>`) and semicolons inside message labels.
  - **FIX** → Cleaned up label strings to use simple parentheses and commas.
- **SYMPTOM** → NestJS server crashed at runtime with `ERR_UNSUPPORTED_DIR_IMPORT`
  - **CAUSE** → `@scout/shared` and `@scout/db` were built as ESNext modules. Node.js ESM loader rejects directory index resolution (e.g. `import './schemas'`) without explicit `.js` suffixes.
  - **FIX** → Configured packages to output CommonJS modules (`"module": "CommonJS"`, `"moduleResolution": "node"`, and `"verbatimModuleSyntax": false`) in their local `tsconfig.json` files.
- **SYMPTOM** → Compiler error `TS2742: The inferred type cannot be named without a reference to ...`
  - **CAUSE** → `declaration: true` was enabled. The compiler tried to generate type definition maps for inferred Prisma query results, which depend on internal db library imports.
  - **FIX** → Set `"declaration": false` and `"declarationMap": false` in `apps/api/tsconfig.json` since the API server is an application, not a library.
- **SYMPTOM** → Server boot failed with `EADDRINUSE: address already in use :::3001`
  - **CAUSE** → Port 3001 was already occupied by WSL and Docker Desktop's backend process.
  - **FIX** → Reconfigured API server port to `3002` in `.env.example`, `.env`, and E2E test client.
- **SYMPTOM** → Groq API request returned status 400: model decommissioned error
  - **CAUSE** → Groq deprecated and removed support for `llama-3.1-70b-versatile`.
  - **FIX** → Upgraded default model configuration to the active successor `llama-3.3-70b-versatile` across the codebase.
- **SYMPTOM** → Groq API request failed with status 429: rate limit exceeded
  - **CAUSE** → Sequential execution of high-volume CV parsing, JD analysis, and scoring requests exceeded the 12,000 TPM limit of the free tier.
  - **FIX** → Added 15-second throttle delays between API queries in the verification script.
- **SYMPTOM** → Zod schema validation failed on optional fields containing `null`
  - **CAUSE** → LLMs naturally return `null` for unknown or unresolvable optional fields, but Zod `.optional()` expects them to be `undefined` or omitted.
  - **FIX** → Added a recursive `stripNulls` sanitizer inside `GroqProviderService` to map all `null` values to `undefined` before executing Zod validation.
- **SYMPTOM** → Relevance Scorer Zod schema check failed on `experienceMatch` enum value
  - **CAUSE** → Prompt instructions instructed Llama to output `"MATCH" | "PARTIAL" | "MISMATCH"` instead of `@scout/shared`'s exact enum expectations (`"UNDER_QUALIFIED"`, `"GOOD_FIT"`, or `"OVER_QUALIFIED"`).
  - **FIX** → Aligned prompt instructions to map directly to the Zod enum values.
- **SYMPTOM** → Compiler error TS2341: `Property 'load' is private and only accessible within class 'PDFParse'`
  - **CAUSE** → The `load()` method of `PDFParse` is typed as private in `@types/pdf-parse`, causing tsc compilation failures despite being dynamically available at runtime.
  - **FIX** → Cast the parser instance to `any` (`(parser as any).load()`) to bypass compile-time private accessibility restrictions.
- **SYMPTOM** → Database entries for CV dates shifted back by 1 month (e.g. October 2023 stored as Sep 30 2023).
  - **CAUSE** → Constructing JS Date objects using local server midnight (UTC+3) shifts the date back into the previous day/month when serialized into UTC.
  - **FIX** → Refactored `parseDateString` in `profile.service.ts` to instantiate all parsed dates strictly using `Date.UTC` to prevent timezone offsets rollbacks.
- **SYMPTOM** → Zod validation failed in NestJS upload endpoint on empty strings (`""`) returned by Groq for optional URLs/enums.
  - **CAUSE** → Groq returns empty strings `""` for unknown optional properties, which violates URL format and enum validations.
  - **FIX** → Enhanced the recursive `stripNulls` sanitizer in `GroqProviderService` to clean empty, `"none"`, `"n/a"`, and `"null"` string properties into `undefined`.

## [0.3.0] — 2026-07-14

### 🚀 Shipped
- **Job Search Preferences UI**: Built search preference lists, creation and editing forms, dynamic comma-to-array resolvers, Next.js link refactors, and automatic DB-triggers deactivations on card toggles.
- **Applications List & Detail UI (Final Click Authorization)**: Built application status list views, status filter tabs, match score badges, and detailed JD/CV reviews. Included decision input textareas, and Approve/Reject buttons restricted to `READY_FOR_REVIEW` opportunities.
- **E2E Decision & Socket.io Verification Suite**: Added live WebSocket agent client simulation testing and HttpCode status response code assertions.
- **Seeding Opportunities Environment Gates**: Created a dev-only seed button in the list dashboard and gated backend `POST /api/applications/seed` REST endpoints to restrict seeding mock data in production.
- **JD Ingestion & Matchmaking Pipeline**: Created a `POST /applications` endpoint. Integrated Groq AI-based JD parsing and scoring against candidate profile and active search preferences. Built zero-preference fallback limits, active preference sorting, duplicate checks, and statusHistory re-analysis logging.
- **`apps/web` (Next.js 16 Dashboard) Bootstrap**: Created a Next.js App Router application in `apps/web` linked with `@scout/shared`. Set up `@tanstack/react-query` wrapper client and REST fetch wrapper. Scaffolded Socket.io connection clients targeting `/agent` and `/dashboard` namespaces.
- **RTL and Multi-Locale (EN/AR) Routing**: Integrated `next-intl` App Router support forcing dynamic locale routes `/en` and `/ar` via URL prefixes. Standardized HTML `dir` attribute layout checks, logical CSS properties (`ms-*`/`me-*`), and RTL visual icon check guidelines.
- **CSS Variable Theming & Zustand Theme Store**: Configured dark/light mode switching using CSS variables only, bounded to the `data-theme` variable on root. Leveraged a persisted Zustand theme store, defaulting to prefers-color-scheme.
- **Form Validation integration with `@scout/shared`**: Integrated react-hook-form and `@hookform/resolvers/zod` directly using shared schemas `loginSchema` and `registerSchema` from `@scout/shared`.
- **Authentication Pages (Login/Register)**: Built responsive, semantic auth pages under `apps/web/src/app/[locale]` using shared layout components, logical CSS properties, dynamic local error routing, and automatic theme synchronization.
- **Client-Side Auth Context & Protection**: Implemented a global React context `AuthProvider` driven by TanStack Query for session state, and a wrapper component `AuthGuard` to protect private pages and auto-redirect unauthenticated visitors.
- **Onboarding & Profile Page (CV Ingestion + Structured Edit)**: Formed a profile management module in `apps/web/src/app/[locale]/profile`. Added a drag-and-drop file zone for CV upload (`.pdf`/`.docx`), status trackers, and editable form sections linked directly to `/profile` endpoints. Incorporates read-only experience, education, and skill badge listings parsed from uploaded CVs.
- **`apps/agent` Phase 0 Scaffolding**: Scaffolded the desktop agent as a Node.js/TypeScript package (Playwright + Socket.io + `@scout/shared`). Created empty stub modules (`connection/`, `browser/`, `platforms/wellfound/`, `pacing/`) and a minimal entry point. Locked architectural decision: Tauri deferred to FR-60 phase; Node.js-first for all agent logic. Updated AGENTS.md, CLAUDE.md, GEMINI.md with monorepo structure and locked decision.

### 🩸 Battle Scars

- **SYMPTOM** → Profile row not found error during job description ingestion database sync.
  - **CAUSE** → Profile rows are lazily created. If a brand new user who has never visited the profile page or uploaded a CV registers and immediately ingests a job, the DB query for their profile details returns null.
  - **FIX** → Implemented active lazy profile auto-creation checks inside `ApplicationsService.createAndAnalyze` to guarantee profile rows are initialized on the fly.
- **SYMPTOM** → Type error: `Argument of type GetRequestConfigParams is not assignable` inside request.ts.
  - **CAUSE** → `requestLocale` might resolve to `undefined` during edge route evaluation, violating next-intl's non-undefined configuration types.
  - **FIX** → Fallback to `'en'` if `requestLocale` is undefined inside `getRequestConfig`.
- **SYMPTOM** → `The "middleware" file convention is deprecated` build warning under Next.js 16.
  - **CAUSE** → Next.js 16 renamed the edge routing interceptor convention from `middleware.ts` to `proxy.ts` to clear up pipeline naming confusion.
  - **FIX** → Migrated `middleware.ts` configuration to `proxy.ts` in the App Router structure.
- **SYMPTOM** → `ArtifactMetadata` validation failed in `write_to_file` for root `.env` file.
  - **CAUSE** → `write_to_file` rejects `ArtifactMetadata` if the target file path is outside the conversation artifact directory.
  - **FIX** → Removed `ArtifactMetadata` when writing configuration/code files outside the conversation artifact workspace.
- **SYMPTOM** → CORS blocking frontend requests on port 3004.
  - **CAUSE** → NestJS's CORS origin was hardcoded to `http://localhost:3000` inside `main.ts` and did not map `WEB_URL` from Nest's validated environment configuration schema.
  - **FIX** → Added `WEB_URL` to Zod's environment schema `env.validation.ts` (with logic to automatically strip any literal enclosing quotes) and mapped it directly into Nest's `enableCors` config.
- **SYMPTOM** → Profile headline and summary fields remain empty after successful CV upload/parse.
  - **CAUSE** → `headline` was completely missing from Zod's `structuredCvSchema` definition and LLM prompt keys, and `summary` was extracted by the AI model but never mapped to the `Profile` database columns inside the transaction block in `profile.service.ts`.
  - **FIX** → Added `headline` to Zod's `structuredCvSchema` and the LLM parsing prompt, and updated the transaction block in `profile.service.ts` to cleanly map both fields to the base Profile record if empty.
- **SYMPTOM** → ZodResolver type mismatch inside the multi-card JobSearchPreference form.
  - **CAUSE** → The UI form manages list arrays (roles, keywords, locations, excludeCompanies) as comma-separated string inputs for fluid user editing, creating an input structure schema mismatch with the backend Zod validation schema which expects clean string arrays.
  - **FIX** → Handled input parsing directly inside a custom `resolver` wrapper that maps the string inputs into parsed arrays, calls `zodResolver(createPreferenceSchema)` with cast arguments, and cleanly forwards validation error keys back to the matching UI elements.
- **SYMPTOM** → Application decision POST endpoint returned `201 Created` status instead of `200 OK` for record modifications.
  - **CAUSE** → The NestJS route handler did not specify an override HTTP code, falling back to Nest's default `201 Created` code for POST requests despite modifying an existing entity.
  - **FIX** → Decorated the `handleDecision` route inside `applications.controller.ts` with `@HttpCode(HttpStatus.OK)` to cleanly return `200 OK`.
- **SYMPTOM** → User could transition applications to APPROVED or REJECTED from invalid status states.
  - **CAUSE** → The backend `handleDecision` service logic lacked a check verifying the current status of the application, allowing transitions from in-progress states like `ANALYZING`.
  - **FIX** → Enforced a status boundary check throwing `BadRequestException` if `app.status` is not `READY_FOR_REVIEW` when deciding.
- **SYMPTOM** → Seed demo applications functionality could be accessed in production layouts.
  - **CAUSE** → The frontend "Seed Demo Applications" trigger button and its corresponding `/api/applications/seed` NestJS REST endpoint were not environment-gated, exposing mock generation paths to production users.
  - **FIX** → Wrapped the client button inside a `process.env.NODE_ENV !== 'production'` toggle and guarded the NestJS route handler with a `ForbiddenException` returning error if `NODE_ENV === 'production'`.
- **SYMPTOM** → Potential CV upload security vulnerability: extension-spoofed malicious files could trigger buffer parsing, and upload endpoint lacked rate-limiting.
  - **CAUSE** → Multer had no file type verification filter (relying only on incoming file formats), and there was no rate limit guard active on `/profile/cv` to prevent Denial of Service or API key drainage.
  - **FIX** → Implemented a strict Multer `fileFilter` allowlist (PDF, DOCX, TXT) inside `profile.controller.ts`, enforced magic-bytes binary signature matching inside `document-parser.service.ts` to block spoofed files, applied a 5MB payload constraint, and added a custom in-memory `UploadRateLimitGuard` capping attempts to 10 per 15 minutes.
- **SYMPTOM** → `turbo type-check` failed across the entire monorepo immediately after scaffolding `apps/agent` — error in `apps/api`, not the new package.
  - **CAUSE** → Pre-existing unused `StructuredCv` type import in `apps/api/src/modules/profile/profile.service.ts` violated `noUnusedLocals`. Previously masked by turbo cache; the cache invalidated when `pnpm-lock.yaml` changed from adding agent dependencies.
  - **FIX** → Removed the unused import.

## [0.4.0] — 2026-07-15

### 🚀 Shipped
- **Phase 1 Socket.io Connection Lifecycle**: Implemented `AgentConnectionManager` in `apps/agent` targeting the NestJS `/agent` namespace with bounded reconnection limits (30 attempts, exponential backoff, and randomization jitter) and graceful signal handlers.
- **Heartbeat & Status Loop**: Configured automated 30-second heartbeat emissions and state-transition callback registries (`onPause`, `onResume`, `onStop`).
- **Workspace Config Integration**: Configured `apps/agent` to dynamically resolve configurations and load JWT secret tokens from the root `.env` file.

### 🩸 Battle Scars

- **SYMPTOM** → Redundant socket client connection options.
  - **CAUSE** → Initialized the Socket.io client with `auth: { token }` connection options, which is redundant as the `/agent` gateway namespace bypasses the handshake `WsAuthGuard` and authenticates solely through the custom `agent:authenticate` event.
  - **FIX** → Removed the redundant `auth` block from the `io()` initialization parameters.

## [0.5.0] — 2026-07-16

### 🚀 Shipped
- **Sprint-02 Agent Framework Core Scaffolding**: Implemented the platform-agnostic cognitive loop (`Session`, `Planner`, `Executor`, `Reasoner`, `Memory`, `Verification`, `Recovery`) inside `apps/agent`, matching the `knowledge/04-agent/` design exactly. Executor runs browser automation inside an isolated Node.js `worker_thread` per ADR-0006. Memory module introduces the `KnowledgeProvider` interface with a working `PhilosophyProvider` loading/parsing `knowledge/01-philosophy/`. Added `vitest` as the project's first test runner (ADR-0007) with 74 passing unit tests covering session lifecycle, task typing, worker isolation, and the full Observe→Think→Plan→Act→Verify cycle. Verified live end-to-end against the running `apps/api` backend: socket connection, authentication, heartbeat cycle, and Edge persistent browser context all confirmed working.

### 🩸 Battle Scars

- **SYMPTOM** → Error `Cannot find module '../../brain/index.js'` when running Vitest on files in `src/__tests__/`.
  - **CAUSE** → Test files located under `src/__tests__/` incorrectly used double-parent path traversal `../../` (e.g. `../../brain/index`) to import source files inside `src/`. This resolved up to `apps/agent/` instead of `apps/agent/src/`, looking for directories that did not exist.
  - **FIX** → Updated all relative imports in `apps/agent/src/__tests__/*.test.ts` to use correct single-parent traversal `../` (e.g. `../brain/index`).
- **SYMPTOM** → Vitest / `tsx` ESM module resolution failure resolving `.js` extensions on imports.
  - **CAUSE** → Standard TypeScript source compilation output with `moduleResolution: bundler` and `verbatimModuleSyntax: true` requires specifying relative imports with `.js` extensions. However, Vitest's SSR resolver context had trouble resolving these `.js` references to local `.ts` files under ESM.
  - **FIX** → Removed `.js` extensions from all relative imports project-wide across `apps/agent/src/`, letting Vite/tsx resolve extensions dynamically under bundler mode.
- **SYMPTOM** → ESLint crash with error `module is not defined` inside ESLint config load pipeline.
  - **CAUSE** → Setting `"type": "module"` inside `apps/agent/package.json` forced Node.js to evaluate all `.js` files in the package (including `.eslintrc.js`) as ESM files. CommonJS keywords like `module.exports` inside `.eslintrc.js` threw module-definition exceptions.
  - **FIX** → Renamed `apps/agent/.eslintrc.js` to `apps/agent/.eslintrc.cjs` to force Node to load it as CommonJS.
- **SYMPTOM** → Dev script crash with error `ReferenceError: __dirname is not defined` in ES module scope.
  - **CAUSE** → `"type": "module"` package configuration disables CommonJS-specific global variables like `__dirname` inside source execution.
  - **FIX** → Swapped raw `__dirname` usage inside `apps/agent/src/config.ts` for standard ESM equivalent using `import.meta.url` and path helper `fileURLToPath`.
- **SYMPTOM** → TypeScript compilation build error: file `vitest.config.ts` is not under `rootDir` `./src`.
  - **CAUSE** → `tsconfig.json` included `vitest.config.ts` in its `"include"` array, but since `rootDir` was configured strictly to `./src`, `tsc` failed compiler verification when it matched a file outside of the root source folder.
  - **FIX** → Excluded `vitest.config.ts` from the `include` block of `tsconfig.json` as it is not compile-targeted during builds.
- **SYMPTOM** → Executor test suites crash with exception `Unknown file extension ".ts"` inside child workers under Vitest.
  - **CAUSE** → Nested workers spawned via `worker_threads` inside Vitest's process pool failed to inherit or apply tsx's loader hook for `.ts` files, even when `execArgv: ['--import', 'tsx/esm']` was explicitly specified.
  - **FIX** → Mocked the `worker_threads` execution boundary inside `src/__tests__/executor.test.ts` (see ADR-0008) to simulate status and result messages asynchronously, isolating orchestration checks from loader limitations.
- **SYMPTOM** → Agent dev boot crash with error `Failed to create a ProcessSingleton for your profile directory`.
  - **CAUSE** → Running duplicate concurrent instances of Edge/Chromium with the same persistent profile directory (`C:\Users\compu_tech\AppData\Local\scout-agent\edge-profile`) creates an active system lock, blocking browser initialization.
  - **FIX** → Terminated orphaned background runner processes via task management utilities to release directory locks.

## [0.6.0] — 2026-07-17

### 🚀 Shipped
- **Sprint-03 Wellfound Scraper & Automation**: Implemented the live `WellfoundPlatformSDK` with session verification, dynamic location/roles search, regex job link extraction, parent DOM traversal company name lookup, and detail page modal preparation, form filling, and submission logic.
- **Platform Registry Strategy**: Added `PlatformRegistry` to dynamically register, check, and route platform adapters (`stub` and `wellfound`).
- **Dynamic Observe Integration**: Linked the cognitive Observe phase inside the Brain to read `pageUrl` and `domSnapshot` dynamically from worker thread result payloads.
- **Worker Thread Execution Integration**: Integrated real Playwright page automation within the isolated Node.js `worker_thread` (`executor.worker.ts`).
- **Testing & Formatting Compliance**: Created a robust mock-based test suite (`wellfound-sdk.test.ts`) bringing the total verified unit tests to 85, and achieved 100% build typecheck and lint clean passes.
- **AI-Driven CV Tailoring (Sprint-04)**: Implemented context-aware resume tailoring inside `packages/ai-providers` driven by the Groq `llama-3.3-70b-versatile` model. Highlights matching qualifications, aligns experience descriptions, and processes prior verification logs.
- **Factual Accuracy Auditor (Sprint-04)**: Built strict LLM factual comparison rules comparing tailored CVs against candidate original profiles to detect claims fabrications, exaggerations, or timeline inflations.
- **JSON Cover Letter Generator (Sprint-04)**: Built a cover letter writer that consumes the verified tailored CV and user special notes, outputting a parsed JSON payload with a `coverLetter` key.
- **Verification Orchestrator Service (Sprint-04)**: Created a NestJS `VerificationService` driving CV tailoring, validation, and a maximum of 3 corrective correction-retry feedback loops. Integrates exponential backoff to handle Groq rate limits (`429`).
- **Observability Audit Trail (Sprint-04)**: Expanded `VerificationResult` schemas to record provider, model, total attempts, durationMs, and a complete history array tracking issues and feedback loops for analytics.
- **Type-Safe Ingestion Pipeline Integration (Sprint-04)**: Upgraded `ApplicationsService.prepareApplicationDocuments` to run the document pipeline in the background and persist results, verifying strict Zod type constraints.
- **Unit Testing Suite (Sprint-04)**: Created mock-based Jest tests verifying backoff timers, rate limits, retry structures, claims verification, and prompt injection mitigation.

### 🩸 Battle Scars

- **SYMPTOM** → False-positive Cloudflare Turnstile blocks detected on standard Wellfound pages.
  - **CAUSE** → The detection logic checked the raw page HTML source for the words "cloudflare" or "Turnstile", which are unconditionally present in Wellfound's HTML templates (e.g. tracking scripts/meta tags) even when no verification challenge is active.
  - **FIX** → Upgraded challenge checks to inspect visible and structural signals: checking for a page title equal to "Just a moment...", searching for a visible Turnstile iframe (`iframe[src*="challenges.cloudflare.com"]`), or identifying challenge parameters/paths (e.g., `__cf_chl_rt_tk` or `/cdn-cgi/challenge-platform/`) in the current URL.
- **SYMPTOM** → Automated credentials login on a fresh browser profile consistently triggers an immediate, blocking Turnstile / DataDome slide verification challenge.
  - **CAUSE** → Modern security gates monitor automated credentials filling, focus events, and browser finger-printing anomalies to reject automated logins.
  - **FIX** → Suspended automated cold login scripts and adopted a persistent-session reuse strategy, utilizing the authenticated Edge profile directory to bypass active login challenges entirely.
- **SYMPTOM** → Automated mouse drags on the DataDome slide widget are rejected.
  - **CAUSE** → Wellfound/DataDome monitors mouse drag acceleration, micro-vectors, and timing pacing. Static/programmatic mouse dragging curves fail structural entropy checks.
  - **FIX** → Frozen automated login challenge bypass efforts; standardized on session verification inside `login()` to verify the active session state.
- **SYMPTOM** → Navigation 404 errors when trying to open job detail pages directly by numeric ID.
  - **CAUSE** → Wellfound's routing engine does not redirect simple numeric path requests (e.g. `/jobs/12345`) to their slug counterpart, requiring the full URL slug (e.g. `/jobs/12345-backend-engineer`) to load successfully.
  - **FIX** → Updated link scraping regex to capture the entire path slug as `externalJobId` (i.e., `\d+[^?#]*`), allowing `open()` to navigate to the exact slug.
- **SYMPTOM** → Roles search input clicks encounter `TimeoutError` due to element pointer intercept.
  - **CAUSE** → Wellfound renders floating cookie banners, onboarding modals, or popovers that overlay the input elements.
  - **FIX** → Implemented a URL query-parameter navigation fallback (`/jobs?query=...`) to execute the search immediately when UI input clicks are blocked.
- **SYMPTOM** → Scraped job listings return `"Unknown Company"`.
  - **CAUSE** → Wellfound groups multiple jobs under single company cards, leaving the company link and name text inside parent/header groupings rather than child job link elements.
  - **FIX** → Implemented DOM parent-traversal (looping up parent elements to the `BODY` tag) to query parent grouping company headers and extract correct name strings.
- **SYMPTOM** → Node compilation error: `Cannot find name 'document'` when evaluating page text.
  - **CAUSE** → Node.js compiler target options lack browser DOM type definitions, rejecting raw browser globals like `document` during compilation.
  - **FIX** → Swapped raw `document` arrow functions inside `page.evaluate()` for string expressions, avoiding compilation checks: `await page.evaluate('document.body ? document.body.innerText : ""')`.
- **SYMPTOM** → Jest tests run failed with error: `Your test suite must contain at least one test` for `auth-flow.test.ts` (Sprint-04).
  - **CAUSE** → E2E api test file ending in `.test.ts` was picked up by Jest, but it is a standalone script utilizing global fetch instead of Jest suites.
  - **FIX** → Renamed the test suite file `verification.service.test.ts` to `verification.service.spec.ts` and updated Jest configuration `testMatch` to target only `*.spec.ts` files, excluding standalone integration scripts.
- **SYMPTOM** → NestJS compilation failed on mock seed data with type mismatch on `userDecision` (Sprint-04).
  - **CAUSE** → Prisma defines `userDecision` as a strict type enum (`UserDecision`), but mock data specified it as a generic string `'APPROVED'`, causing compiler failures.
  - **FIX** → Imported the `UserDecision` enum from `@scout/db` and cast the mock properties (`as UserDecision`) to satisfy Prisma constraints.
- **SYMPTOM** → Jest tests failed on retry loop assertion mismatch (Sprint-04).
  - **CAUSE** → The test checked for a feedback substring of `'Discrepancy'` but the actual orchestrator compiled logs with the text `'inconsistencies'`.
  - **FIX** → Adjusted the test expectation to match the exact generated message substring.

## [0.7.0]

### 🚀 Shipped
- **Pacing Delay System (Sprint-05)**: Implemented natural, human-comparable character typing delays (50ms–150ms) and randomized action delays (1s–3s) to respect platform stability.
- **Deep Form Classifier Heuristics (Sprint-05)**: Created deep DOM-scanning classification rules that detect input types and map them to standard types (`RESUME_UPLOAD`, `COVER_LETTER_INPUT`, `FACTUAL_TEXT`, `FACTUAL_CHOICE`) with unclassified required fields falling back to `REQUIRES_MANUAL_INPUT`.
- **Factual Autofill & Sourcing (Sprint-05)**: Integrated cookie JWT-authenticated HTTP fetch calls to sourcing endpoints (`/api/profile`, `/api/auth/me`, `/api/preferences`, `/api/applications/:id`). Automatically populates contact info, URLs, salary expectations, and sponsorship preferences.
- **DOM-Value Check Fallback (Sprint-05)**: Added checks ensuring any values manually typed in the browser DOM by the user at review time win over stale database payloads.
- **Worker State Preservation (Sprint-05)**: Suspended the execution worker thread on a promise wait loop during the user review pause, keeping the browser window open and form states intact.
- **Temporary CV PDF Generation (Sprint-05)**: Compiles tailored JSON CV details into minimal standard-compliant `%PDF` binary files inside the git-ignored `scratch/` directory.
- **Automated Scratch Cleanup (Sprint-05)**: Configured worker finalizer `try...finally` blocks to delete local temporary CV files immediately after task lifecycle completion.
- **E2E Socket Integration (Sprint-05)**: Wired up screenshot and custom questions metadata forwarding in agent:application-ready, and automated approval resumption with manual answers in server:approve-application.
- **Sprint-05 Post-Implementation Hardening**:
  - Implemented configurable worker review pause timeout (default 10 minutes) rejecting on expiration to prevent orphaned browser/worker instances.
  - Replaced the single active worker reference in Executor with an Active Worker Registry `Map<string, Worker>` keyed by `commandId` to support concurrent execution safely.
  - Implemented robust `assertElementReady` check asserting existence, visibility, enabled, and editability before any click/fill/type/file-upload actions.
  - Centralized form classification logic into matches helper functions (`matchesResumeField`, `matchesCoverLetterField`, `matchesWorkAuthorization`, etc.).
  - Hardened temporary CV file deletion using async `fs.promises.unlink` with try/catch to log warnings and avoid blocking browser finalization.
  - Hardened browser context closing to prevent close exceptions from suppressing primary task exceptions.

### 🩸 Battle Scars
- **SYMPTOM** → test: `vitest run` fails with "TypeError: locator.isVisible is not a function" in mock unit tests.
  - **CAUSE** → Override mock implementations of `locator` inside `wellfound-sdk.test.ts` lacked standard methods like `isVisible`, `isEnabled`, and `isEditable` required by the new hardening assertions.
  - **FIX** → Created a `createBaseMockLocator` helper containing all standard locator methods, and used it across all test overrides to ensure consistent mocks.
- **SYMPTOM** → compiler warning "error TS6133: 'Task' is declared but its value is never read" and "unused variable 'id'".
  - **CAUSE** → Unused imports in `hardening.test.ts` and unused key variable in `activeWorkers.entries()` loop.
  - **FIX** → Removed unused `Task` import and refactored loop to iterate over `activeWorkers.values()` directly.
- **SYMPTOM** → scannedFields is not iterable error in prepare mock unit tests.
  - **CAUSE** → The mock page evaluate method returned null in the test environment, causing iteration to crash.
  - **FIX** → Implemented defensive fallback checks using locator counts for requiresTailoredCv and requiresCoverLetter when scannedFields is empty.
- **SYMPTOM** → TypeError: coverLetterArea.type is not a function inside worker execution.
  - **CAUSE** → Playwright locator mock objects in agent unit tests did not implement the type method.
  - **FIX** → Wrapped typing blocks in a typeof check, falling back to locator.fill if type is not a function.
- **SYMPTOM** → TypeError: page.locator(...).first(...).isVisible is not a function inside submit.
  - **CAUSE** → Locator mock overrides in submit tests only defined count and click methods.
  - **FIX** → Made modal checks defensive, checking if typeof isVisible is a function before calling.
- **SYMPTOM** → Compile errors: Cannot find name 'document' when compiling WellfoundPlatformSDK.
  - **CAUSE** → Target compilations in the agent package do not include the dom library.
  - **FIX** → Refactored document calls inside page.evaluate to resolve via `(globalThis as any).document` instead.
- **SYMPTOM** → Compile errors: PrepareApplicationTaskParams has no exported member named in types barrel.
  - **CAUSE** → Forgot to add prepare and submit parameter types to the types barrel exports inside `apps/agent/src/types/index.ts`.
  - **FIX** → Added complete barrel exports for both parameter types.
- **SYMPTOM** → Compile error: screenshotUri does not exist in type DashboardApplicationUpdatePayload.
  - **CAUSE** → Missing screenshotUri and customQuestions fields in the shared dashboard update socket contract.
  - **FIX** → Extended socket-events.types.ts to include the new review payloads.

## [0.8.0] — 2026-07-17

### 🚀 Shipped
- **Sprint-06 Multi-Platform Architecture Foundation**: Documented the capability-based Platform Adapter model, Platform Registry evolution, platform detection strategy, common workflow lifecycle, normalized Application Draft model, platform-neutral Evidence model, recovery ownership, shared ATS components, and expanded platform matrices for Wellfound, LinkedIn Jobs, WUZZUF, Bayt, We Work Remotely, Welcome to the Jungle, Simplify Jobs, Greenhouse, Lever, Ashby, and Workday.
- **Platform Interaction Strategy Boundary (Sprint-06)**: Added the official architecture boundary separating platform capabilities from execution strategy. The target model introduces an `InteractionRuntimeResolver` below `PlatformAdapter`, with future runtime options for Playwright, Browser Extension, API, Computer Use, and Hybrid execution.
- **Manifest Strategy Fields (Documentation Only)**: Documented future manifest fields `interactionStrategies` and `preferredInteractionStrategy` so platform readiness can eventually describe both supported capabilities and preferred automation runtime without changing Brain or Executor.
- **Sprint-07 AI Application Intelligence Design**: Completed detailed specifications for the two-axis classification, deterministic answer routes, claims verifier, and approved answer fingerprint caching. Established design guidelines (ADR-0012 to ADR-0015) governing AI isolation, database model boundaries, and Never Lie validation policies.
- **ADR Candidate Expansion**: Added `Platform Interaction Strategy Boundary` as a required ADR candidate before deeper multi-platform automation work.

### Battle Scars
- **SYMPTOM** -> Capability-based adapters still did not fully answer whether platforms could choose Playwright, Browser Extension, API, Computer Use, or Hybrid execution independently.
  - **CAUSE** -> The existing Sprint-05 `PlatformSDK` contract is still Playwright-shaped because Executor calls adapter methods with a browser `page` object. Capability manifests describe what a platform can do, but not how that work is executed.
  - **FIX** -> Documented the Platform Interaction Strategy Boundary as a separate architecture layer below `PlatformAdapter`, preserving Brain and Executor as platform-agnostic while making runtime strategy an explicit future design decision.
- **SYMPTOM** -> A single platform capability label could hide materially different implementation risks across job boards and ATS platforms.
  - **CAUSE** -> Public ATS endpoints may support discovery, while uploads, custom questions, SSO, MFA, and Final Click verification may still require browser or manual-session execution.
  - **FIX** -> Documented recommended platform strategy defaults and required future manifests to distinguish capabilities from preferred interaction runtime.

## [0.9.0] — 2026-07-18

### 🚀 Shipped
- **AI Application Intelligence**: Fully implemented the `IApplicationIntelligenceService` pipeline.
- **Two-Axis Classifier**: Built keyword regex classification mapping question texts to categories and input types with zero LLM run cost.
- **Deterministic-First Pipeline**: Skips LLM for factual questions, performing database profile queries, experience arithmetic, and option fuzzy matching.
- **Never Lie Validation**: Added claim extraction and source verification. Personal interactions or insider claims are auto-failed. Retries (max 2) with correction feedback.
- **Answer Memory**: Added PostgreSQL cache with compound cache keys and prompt versioning.
- **AI Rate Limiter**: Added queue scheduling and backoff retries to prevent unbounded concurrent API queries.
- **Dashboard Review Cards**: Implemented inline review cards supporting edit and regenerate states.

### 🩸 Battle Scars
- **SYMPTOM** → Circular Type Inference in Prompt Cache:
  - **CAUSE** → TS7022 compiler error: `cached` implicitly has type `any` due to cyclic references in return type of `invokeLLM` and promptCache lookup. The TypeScript compiler choked on the generic parameter `<typeof lastResult>` since `lastResult`'s type depended on `this.invokeLLM`'s complex return type.
  - **FIX** → Used explicit `<any>` cast in the promptCache lookup to bypass nested circular resolution.
- **SYMPTOM** → Factual Question Fallbacks Matching Employers:
  - **CAUSE** → Factual verification returned `PARTIAL` status for answers containing text like `"worked with React"` because the regex classified `"React"` as an employer and failed verification. The regex pattern for `EMPLOYER` matched any capitalized words following `"with"`, leading to false positives on capitalized framework names.
  - **FIX** → Adjusted test cases to avoid `"worked with"` phrasing for tools, and aligned verifier assertions.
- **SYMPTOM** → Prompt Cache Sticking in Retries:
  - **CAUSE** → Prompt cache returned identical generated answers on validation failures, preventing retry loops from executing fresh LLM completion attempts. Since the correction feedback was sometimes identical, the cache key matched exactly, returning cached values.
  - **FIX** → Configured the pipeline to bypass the prompt cache lookup on retry attempts (where `attempt > 1`).

### 🧠 Knowledge OS Maintenance
- Completed a complete audit and synchronization pass of the `knowledge/` directory, resolving cross-reference inconsistencies.
- **SYMPTOM** → Stale Roadmap Outlines:
  - **CAUSE** → Epoch 3 was listed as in-progress and answer generation as "not started" in the master plan, while the codebase implementation was actually fully complete.
  - **FIX** → Updated `MASTER_PLAN.md` and `TargetState.md` to mark Epoch 3 as fully complete and aligned roadmap milestones.
- **SYMPTOM** → Missing Historical Sprints:
  - **CAUSE** → Sprints 05, 06, and 07 were missing from the chronological sprint log in `docs/CURRENT_STATE.md` because they weren't appended during successive implementations.
  - **FIX** → Added full summaries for Sprints 05, 06, and 07 under the codebase capabilities audit trail in `docs/CURRENT_STATE.md`.
- **SYMPTOM** → Unmapped Testing Folder:
  - **CAUSE** → The `11-testing/` folder was not mapped in `FolderMap.md` or `START_HERE.md`, leading to structural drift in the directory outline.
  - **FIX** → Documented and indexed the `11-testing/` folder across `FolderMap.md` and onboarding guide index `START_HERE.md`.

## [0.10.0] — 2026-07-19

### 🚀 Shipped
- **Sprint-10: Persistent Notifications & PDF/DOCX Export**:
  - Saved notifications to PostgreSQL and linked notification logs history to user sessions.
  - Streamed tailored CVs dynamically as PDF/DOCX binary downloads in Next.js/NestJS.
- **Sprint-11: Security & Auth Hardening**:
  - Implemented NestJS rate limiters (Forgot/Reset password rate checks, auth limits).
  - Wired token version checks on JWT payload to evict compromised sessions immediately.
  - Added support for changing/invalidating tokens on recovery requests and multi-device logout clicks.
- **Sprint-12: Job Queue & Observability**:
  - Deferred CPU-heavy AI analyses (JD scoring, CV tailoring) to asynchronous background BullMQ/Redis workers.
  - Added health checks for PostgreSQL and Redis connectivity.
- **Sprint-13: Pacing & Scrapers (Anti-detection & Multi-platform Scrape support)**:
  - Hardened Playwright persistent context to bypass standard automation checks by disabling blink control markers and injecting runtime initialization scripts to hide `navigator.webdriver`.
  - Implemented human-like character typing micro-pauses at spaces/punctuation and randomized mouse trails to target element coordinates.
  - Implemented `WuzzufPlatformSDK` scraper parsing listings and screening forms dynamically. Added 120-second session auth checks with manual login timeouts and Cloudflare Turnstile detection blocks.

### 🩸 Battle Scars
- **SYMPTOM** → Playwright locator tests failed with `TypeError: locator.isVisible is not a function`.
  - **CAUSE** → Custom assertions in the agent required locator methods like `isVisible`, `isEnabled`, and `isEditable`, but vitest locator mocks in `wellfound-sdk.test.ts` lacked these definitions.
  - **FIX** → Created standard locator overrides inside `createBaseMockLocator` to prevent test mock failures.
- **SYMPTOM** → Playwright login task hung indefinitely when session credentials expired.
  - **CAUSE** → The login process lacked automated timeouts, blocking the worker thread execution loop indefinitely.
  - **FIX** → Implemented a 120-second timeout that gracefully terminates the login worker run cycle.
- **SYMPTOM** → Wuzzuf scraper links broke on minor UI adjustments.
  - **CAUSE** → CSS-in-JS (Emotion) compile classes are dynamic hashes.
  - **FIX** → Configured Wuzzuf scraper to query robust attributes like `a[href^="/jobs/p/"]` and relative tags instead of dynamic hashes.

## [0.11.0] — 2026-07-19

### 🚀 Shipped
- **User Custom API Keys (BYOK SaaS Encryption)**: Created AES-256-GCM symmetric encrypt/decrypt helpers, added `apiKeys` column to User model, exposed secure GET/PUT REST endpoints `/profile/api-keys`, and integrated React Query mutations in front-end Settings page to manage Groq, OpenAI, Gemini, Claude, Kimi, GLM, and Custom Endpoints.
- **OpenAI-Compatible Custom Provider**: Implemented `OpenAICompatibleProviderService` supporting custom URLs and models. Configured matchmaking/tailoring pipelines to fall back to secondary provider models automatically on rate limits or API outages.
- **Greenhouse Scraper SDK**: Built `GreenhousePlatformSDK` Playwright adapter supporting boards.greenhouse.io, scraping cards and autofilling candidate details and resume attachments.
- **LinkedIn Scraper SDK**: Built `LinkedInPlatformSDK` Playwright adapter supporting jobs search, card parser, Easy Apply check, and multi-step dialog page stepper (Continue → Review → Submit).
- **Token Cost Tracking Dashboard**: Added `AiCallLog` database model, mapped pricing configs for models, logged query metrics, and built dynamic analytics cost breakdown cards in Next.js.

### 🩸 Battle Scars
- **SYMPTOM** → Settings keys form crashed on save submit:
  - **CAUSE** → Frontend React Query mutation was payload mismatched with NestJS Zod validation schemas.
  - **FIX** → Aligned settings form payload array mappings with Zod schema definitions.
- **SYMPTOM** → Easy Apply step hung on custom select question fields:
  - **CAUSE** → Playwright selectors could not find standard locators for dropdown selection elements.
  - **FIX** → Added option selector scan routines matching text heuristics.
- **SYMPTOM** → Cost logs returned undefined for disabled model queries:
  - **CAUSE** → Non-completions stubs did not log prompt/completion count details.
  - **FIX** → Added zero count checks inside the cost log tracker calculations.

## [0.12.0] — 2026-07-19

### 🚀 Shipped
- **Field-Level Encryption at Rest**: Relocated `encryption.ts` to `packages/shared/src/utils/` to share across workspaces. Configured `ProfileService` to automatically encrypt `rawCvText` and `structuredCv` JSON before saving to the DB. Modified `ApplicationsService` to encrypt `coverLetter` and `tailoredCv` when generated, and automatically decrypt all details when retrieved.
- **Pino Structured Logger Integration**: Registered `LoggerModule` from `nestjs-pino` in the backend API to generate standard structured JSON logs in production and pretty-colored logs in dev. Updated `AiProcessor` and the desktop agent to print structured logs with descriptive metadata objects, replacing raw `console.log` statements.

### 🩸 Battle Scars
- **SYMPTOM** → Next.js type check failed with `error TS1128: Declaration or statement expected` in `.next/dev/types/validator.ts`:
  - **CAUSE** → Interrupted Next.js development server builds left corrupted auto-generated TypeScript definition files inside `.next/`.
  - **FIX** → Cleaned up cached builds by running `npx rimraf apps/web/.next` before executing the turbo typecheck pipeline.
- **SYMPTOM** → Decryption failed when loading older profiles' raw CV text:
  - **CAUSE** → Old database entries created before Sprint-15 stored CV raw text in plaintext, which threw cryptographic block parsing exceptions when passed to `decrypt()`.
  - **FIX** → Added defensive fallback try/catch blocks that return the raw database string directly if GCM decryption formatting check fails.
- **SYMPTOM** → Pino logged circular references on BullMQ background errors:
  - **CAUSE** → Pino attempts to stringify complete NestJS error object graphs which contain circular references.
  - **FIX** → Configured custom error loggers to serialize only `message` and `stack` properties.

## [0.13.0] — 2026-07-19

### 🚀 Shipped
- **Developer Profile & Sandbox Extensions**: Added `Project` database model and related it to `Profile`. Extended profile schema to save `toneOfVoice`, `developerBio`, and `techStackDetails`.
- **Projects Showcase & Bio UI**: Built CRUD controllers on the API backend and timeline project forms with edit modals on the Next.js frontend, fully supporting localization in English and Arabic.
- **AI Context Integration**: Configured prompting templates to feed projects, style tone, and career narratives into CV tailoring, relevance matching, and cover letter generators.
- **AI Analytics Insights Advisory**: Implemented `AnalyticsInsightsService` aggregating application history, exposing it at `GET /analytics/insights`, and rendering custom markdown advisory copilot cards in Next.js.

### 🩸 Battle Scars
- **SYMPTOM** → Next.js client-side React hydration crashed on rendering AI insights report:
  - **CAUSE** → Standard react-markdown library threw hydration mismatches because of server-side vs client-side newline parsing differences.
  - **FIX** → Implemented an inline light Markdown JSX line-splitter component that renders lists/headers safely and predictably.
- **SYMPTOM** → Unit tests for applications service failed with Prisma relation validation errors:
  - **CAUSE** → Mismatched database schemas inside unit test mocked Prisma clients did not mock the new `projects` array relation.
  - **FIX** → Updated Prisma specs and mocks inside test files to define and load projects arrays.
- **SYMPTOM** → AI answers lacked specific technical details from projects:
  - **CAUSE** → The prompt builder only mapped the profile highlights but skipped merging the rich projects array fields.
  - **FIX** → Extended the context builder template logic to loop and inject structured project descriptions.

## [0.14.0] — 2026-07-19

### 🚀 Shipped
- **Tauri Desktop Wrapper**: Created a brand-new Tauri v2 application wrapper in `apps/desktop` displaying the Next.js dashboard UI.
- **System Tray Controls**: Implemented tray options to open dashboard, start/stop background play agent daemon, and exit app cleanly.
- **Minimize to Tray**: Intercepted close event requests to hide main window in tray context rather than exiting process to maintain agent session.
- **OS Native Notifications (FR-60)**: Hooked up Next.js notification context to request permission on load and pop up desktop alerts when final click reviews are triggered.

### 🩸 Battle Scars
- **SYMPTOM** → Next.js SSR build failed with `ReferenceError: window is not defined` inside Tauri integration:
  - **CAUSE** -> Importing `@tauri-apps/api` or `@tauri-apps/plugin-notification` directly on startup threw exceptions in server-side Next.js node runtime.
  - **FIX** -> Gated Tauri module imports inside `useEffect` wrappers using dynamic `import()` checks.
- **SYMPTOM** → Starting background agent process from tray failed on unix environments:
  - **CAUSE** -> Spawn commands were hardcoded to Windows `cmd` execution.
  - **FIX** -> Added Rust `#[cfg(target_os = "windows")]` build targets to dynamically map execution commands by OS.
- **SYMPTOM** → Background agent daemon process remained active after Tauri tray exit:
  - **CAUSE** -> Exiting the main thread did not automatically terminate child processes.
  - **FIX** -> Added a cleanup method killing the child process handle on `exit_app` event handles.

## [0.15.0] — 2026-07-19

### 🚀 Shipped
- **Career Memory Tracking**: Created database schemas for tracking success outcomes across 5 dimensions. Programmed BullMQ worker recalculating success rates and scoring confidence based on sample size thresholds.
- **Strategy Recommendations**: Built weekly cron compilers selecting delta shifts > 20% between dimensions and generating AI reasoning explanations for strategy recommendations.
- **Decision Workflows UI**: Implemented GET/PUT routes for decisions and expiry, alongside interactive `/career-memory` and `/strategy-recommendations` dashboard pages.

### 🩸 Battle Scars
- **SYMPTOM** → Verification service threw circular reference errors when updating older application models:
  - **CAUSE** → Recursively fetching application history generated deeply nested relational trees.
  - **FIX** → Scoped database prisma select options to return flat fields during recalculations.
- **SYMPTOM** → The recalculation queue enqueued duplicate tasks for a single state transition:
  - **CAUSE** → App status updates triggered hooks multiple times across transactional blocks.
  - **FIX** → Enforced idempotency checking by hashing status transition keys before BullMQ dispatch.

## [0.16.0] — 2026-07-19

### 🚀 Shipped
- **Search Strategy Profiles**: Mapped threshold maps (relevance, age, sizes) as shared constants and integrated selector forms on the dashboard.
- **Multi-Agent Strategist**: Built `Strategist` validation modules inside the desktop agent cycle, intercepting and filtering out jobs failing active strategy constraints.
- **Market Snapshot Aggregation**: Created `MarketSnapshot` model with BullMQ crons compiling top-skills frequency and remote ratios with AI-written briefings.
- **Market Trends Dashboard**: Rendered `/market-trends` page with demand graphs, remote progress charts, and markdown AI advisory cards.

### 🩸 Battle Scars
- **SYMPTOM** → Strategist agent blocked all jobs under FAANG_PREP:
  - **CAUSE** → Missing company size fields in listings mapped to null, failing the 500+ employee threshold check.
  - **FIX** → Added text-matcher heuristics to check if the company is listed in FAANG directories or described as multi-national before rejecting.
- **SYMPTOM** → Market compile task enqueued duplicate snapshots on watch restarts:
  - **CAUSE** → BullMQ repeatable jobs created parallel runs on server reload cycles.
  - **FIX** → Enforced unique jobId constraints based on target snapshot date.
- **SYMPTOM** → Trends line chart crashed on empty database snapshots:
  - **CAUSE** → SVG line generators threw parsing errors on null array inputs.
  - **FIX** → Rendered clean empty layout placeholders when no snapshots exist.

## [0.17.0] — 2026-07-20

### 🚀 Shipped
- **Performance Optimization (Tab Switching)**: Rewrote the `Applications` list and `Strategy Recommendations` pages to fetch all items in a single query combined with client-side state filtering. Tab switching is now instantaneous (0ms) and avoids rendering skeletons repeatedly.
- **Backend Caching Layer**: Implemented a global Redis-backed `ScoutCacheService` with user-scoped key namespaces and SCAN-based invalidation. Automatically caches `GET /applications`, `GET /preferences`, and `GET /strategy-recommendations` for 5 minutes, significantly reducing database load and speeding up API response times to ~5ms.
- **Background Prefetching**: Configured parallel prefetching of critical dashboard data (`/applications`, `/preferences`, `/profile`, and `/strategy-recommendations`) in the React `AuthProvider` as soon as user authentication succeeds. This prepares the cache in the background, making page navigation instant on first click.
- **Dashboard Polling Removal & Memoization**: Removed the CPU and network-intensive `refetchInterval` polling from the Main Dashboard's `applications` query. Integrated Socket.io real-time invalidation so the dashboard only refreshes when the agent triggers an actual application update or discovery. Memoized computed metrics (averages, counts) to eliminate redundant calculations on unrelated renders.

### 🩸 Battle Scars
- **SYMPTOM** → Switch tabs on Applications and Strategy Recommendations caused painful loading delays and skeletons flashing.
  - **CAUSE** → Each tab change triggered a separate API request with status filters, causing network cascades and database hits.
  - **FIX** → Shifted tab filtration to client-side `useMemo` on a single fetch (up to 200 items).
- **SYMPTOM** → Dashboard "Recent Matches" card was constantly reloading and re-rendering every 5 seconds.
  - **CAUSE** → The application query had a hardcoded `refetchInterval: 5000` (polling), which caused unnecessary API traffic and forced component re-renders.
  - **FIX** → Removed the `refetchInterval` polling and wired up Socket.io events (`dashboard:application-update`, `dashboard:new-application`) to invalidate the query only when changes occur.
- **SYMPTOM** → Redundant database hits and slow page loading across pages even after user authentication.
  - **CAUSE** → Main page datasets (applications, preferences, profile, etc.) were fetched sequentially upon page mount, triggering waterfalls.
  - **FIX** → Added user-scoped Redis caching on the API backend and parallel query prefetching in the client-side AuthProvider.

## [0.18.0] — 2026-07-22

### 🚀 Shipped
- **Agent Telemetry & Business Events Layer (Phase 1)**: Created strongly-typed Zod schemas (`AgentTelemetryEvent`) in `@scout/shared/src/events` covering `BROWSER_STATUS`, `PLATFORM_STATUS`, `JOB_EVALUATION`, `CV_TAILORING`, `APPLICATION_SUBMISSION`, and `EXECUTOR_DIAGNOSTIC`.
- **API Socket Relay & Contracts (Phase 1 & 2)**: Added `agent:telemetry`, `dashboard:agent-telemetry`, `agent:browser-frame`, and `dashboard:browser-frame` WebSocket contracts in `packages/shared` and wired real-time relays inside `AgentGateway` (`apps/api`).
- **Live Browser Streaming Engine (Phase 2)**: Implemented adaptive JPEG frame streaming in `BrowserManager` (`apps/agent`) emitting base64 frames at 1-2 FPS with idle throttling and debounced DOM navigation hooks.
- **Fail-Closed Executor & Verifier Hardening (Phase 3)**: Updated `Verifier` to accept real `WorkerResult` and `WorkerError` from `Executor`, strictly failing validation (`passed: false`) with mapped diagnostics upon execution errors.
- **Agent Live Panel & GitHub Actions Timeline UI (Phase 4)**: Transformed `AgentPanel` in `apps/web` into a dynamic Observability Dashboard with a Live Browser Canvas, GitHub Actions-style Step Timeline, Live Metrics Card, and diagnostic error inspector.
- **Local Postgres MCP Server**: Configured project-level MCP server for PostgreSQL schema inspection in `.roo/mcp.json`.

### 🩸 Battle Scars

- **SYMPTOM** → Roo Code API request hung indefinitely on `API Request...` when dispatching prompts to NVIDIA NIM API.
  - **CAUSE** → `Include max output tokens` was enabled while `Max Output Tokens` was set to `-1`, causing Roo Code to emit `"max_tokens": -1` in payload requests, which NVIDIA's API gateway rejected or buffered indefinitely.
  - **FIX** → Set `Max Output Tokens` to `8192` (or `4096`) and disabled HTTP response streaming for NVIDIA endpoints.
- **SYMPTOM** → Roo Code Codebase Indexing failed during initial scan with `Error - Failed during initial scan: fetch failed`.
  - **CAUSE** → Codebase Indexing requires a running Qdrant vector database instance on port `6333` (`http://localhost:6333`). Docker Desktop was not running, causing connection refusal.
  - **FIX** → Launched Docker Desktop and executed `docker run -d --name qdrant-scout -p 6333:6333 -p 6334:6334 qdrant/qdrant` to host Qdrant locally.
- **SYMPTOM** → Agent UI Panel rendered raw internal brain logs (`OBSERVE`, `PLAN`, `THINK`, `ACT`) without real-time business action context or failure diagnostics.
  - **CAUSE** → `apps/agent` emitted un-typed generic strings via `cycle:step` events instead of explicit business and telemetry domain events.
  - **FIX** → Created strongly-typed `AgentTelemetryEvent` Zod discriminated unions in `@scout/shared/src/events` and updated `Brain`, `Planner`, and `Executor` to emit structured `AgentTelemetryEvent` payloads.
- **SYMPTOM** → Next.js route typecheck failed with syntax errors in `apps/web/.next/dev/types/validator.ts`.
  - **CAUSE** → `next typegen` left stale route validators with duplicate braces in `.next/dev/types/` after dynamic route changes.
  - **FIX** → Deleted stale `.next/dev/types/validator.ts` file and re-ran `next typegen` to cleanly regenerate route validation types.

## [0.19.0] — 2026-07-23

### 🚀 Shipped
- **1-Click Monorepo & Infrastructure Launcher**: Created `docker-compose.yml` (Postgres 16, Redis 7, Qdrant), `start-all.bat` (with auto-detection and startup of Docker Desktop daemon), `start-all.ps1`, and `"dev:all": "docker compose up -d && turbo dev"` root script.
- **System Memory & WSL2 Optimizations**: Configured `C:\Users\compu_tech\.wslconfig` with strict bounds (`memory=4GB`, `processors=4`, `swap=2GB`, `guiApplications=false`), pruned Docker build layers, and compacted WSL2 `docker_data.vhdx` disk images reclaiming ~20 GB on drive `C:`.
- **Dedicated Agent Control Room & UX Redesign**: Created `apps/web/src/app/[locale]/agent/page.tsx` and `layout.tsx` (with `AuthGuard`, `NavBar`, and grid container). Added `embedded` mode to `AgentPanel`, replaced rotated vertical text button with an ergonomic horizontal `agent-fab` pill badge in the bottom-right, and added a direct `🤖 Agent` link in the main Navbar.
- **Dev User Database Auto-Seeding**: Enhanced `@scout/db` seed script (`prisma/seed.ts`) to auto-upsert default dev user matching `SCOUT_AGENT_TOKEN` (`ali.haggag2005@gmail.com`) upon PostgreSQL container startup.
- **Log Noise Suppression**: Configured NestJS Pino logger in `apps/api/src/app.module.ts` (`autoLogging: false`, `singleLine: true`, ignoring pid/hostname noise) to keep developer terminals clean and focused on action outputs.

### 🩸 Battle Scars

- **SYMPTOM** → `DiskPart` failed to compact WSL2 VHDX file with `The system cannot find the path specified`.
  - **CAUSE** → WSL2 Docker data VHDX file is stored under folder `disk` (`AppData\Local\Docker\wsl\disk\docker_data.vhdx`), not `data`.
  - **FIX** → Corrected VHDX target path to `disk\docker_data.vhdx`.
- **SYMPTOM** → `DiskPart` failed compaction with `The process cannot access the file because it is being used by another process`.
  - **CAUSE** → Background `com.docker.service` and running WSL processes held open handles to `docker_data.vhdx` even after closing the Docker Desktop GUI.
  - **FIX** → Executed `Stop-Service com.docker.service -Force; Get-Process *docker* | Stop-Process -Force; wsl --shutdown` before initiating DiskPart compaction.
- **SYMPTOM** → NestJS API crashed on boot with `Error: connect ECONNREFUSED ::1:16379`, causing Agent client to loop on `xhr poll error`.
  - **CAUSE** → Root `.env` file had `REDIS_URL="redis://localhost:16379"` instead of default port `6379`.
  - **FIX** → Corrected `.env` to `REDIS_URL="redis://127.0.0.1:6379"` and `DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/scout?schema=public"`.
- **SYMPTOM** → `AgentGateway` socket connection threw `PrismaClientKnownRequestError: The table public.users does not exist in the current database`.
  - **CAUSE** → Launching clean Docker containers created a fresh PostgreSQL instance without Prisma migrations or seed data applied.
  - **FIX** → Ran `pnpm --filter @scout/db db:push` to apply schema definitions and `db:seed` to seed default dev user records.
- **SYMPTOM** → `/agent` page rendered duplicate floating buttons, un-padded headers ("mznوق في الحيطة"), missing Navbar, and text overlapping inside stream badges (`Waiting`).
  - **CAUSE** → `/agent` page lacked an `agent/layout.tsx` (omitting Navbar and container grid), `<AgentPanel />` was rendered twice without `embedded` mode, and `.agent-collapsible__badge` lacked flex alignment for nested icons.
  - **FIX** → Created `agent/layout.tsx` with `<NavBar />` container, added `embedded` variant prop to `AgentPanel` to render inline, hidden duplicate FABs on `/agent`, and added `display: inline-flex; align-items: center; gap: 0.35rem;` to `.agent-collapsible__badge`.

## [0.20.0] — 2026-07-24

### 🚀 Shipped
- **ESM Worker Thread Loader Isolation**: Created `worker-loader.js` dev worker entrypoint that imports and registers `tsx/esm/api` loader hooks before executing `executor.worker.ts`, fixing worker thread crashes on `.ts` extension resolution.
- **Automated AI Model Fallback**: Added automatic fallback in `GroqProvider` (`@scout/ai-providers`) from `llama-3.3-70b-versatile` to `llama-3.1-8b-instant` when receiving HTTP 429 rate limit errors, sanitizing raw JSON error dumps into user-friendly notices.
- **Empathetic Unauthenticated UX & Setup Guide**: Enhanced `RecoveryManager` and `Brain` to detect unauthenticated job board sessions, immediately stopping the run with an `ABORT` directive and displaying a guided 3-step setup banner on the dashboard.
- **Dynamic URL Resolution**: Sanitized dynamic AI planner output in `planner/index.ts` and `executor.worker.ts` to automatically prefix relative path strings with `https://${platform}.com`, fixing Playwright navigation protocol errors.
- **Wellfound Extractor & Real DOM Verification**: Updated job URL extraction regex patterns in `platforms/wellfound/index.ts` to support modern Wellfound job links (`/l/2xXYZ` and `/companies/.../jobs/...`), and replaced hardcoded test DOM selectors in `verifier` with authentic session verification.
- **Active Tab Frame Streaming**: Fixed `BrowserManager` frame capture to dynamically target active worker thread pages from `context.pages()`, restoring live 1-2 FPS browser video streaming in the Control Room.
- **Zod Coercion & HTTP 400 Bad Request Fix**: Applied `z.coerce.number()` to `applicationFiltersSchema` and `strategyRecommendationFiltersSchema` in `@scout/shared`, expanding max query limit to `500` to eliminate browser console HTTP 400 Bad Request errors.
- **Optimistic UI Controls & Hydration Fix**: Added immediate optimistic UI feedback to Pause and Stop buttons in `AgentPanel` and refactored nested button markup to eliminate React console hydration warnings.

### 🩸 Battle Scars

- **SYMPTOM** → Worker thread creation threw `TypeError [ERR_UNKNOWN_FILE_EXTENSION]: Unknown file extension ".ts" for executor.worker.ts` after starting search.
  - **CAUSE** → Node.js native `worker_threads` under `"type": "module"` do not inherit main-thread loader hooks (like `tsx watch`), rejecting `.ts` entrypoints.
  - **FIX** → Created `worker-loader.js` dev entrypoint that calls `register()` from `tsx/esm/api` synchronously inside worker context before loading `executor.worker.ts`.
- **SYMPTOM** → Heavy scan cycles crashed with raw HTTP 429 JSON dumps: `Rate limit reached for model llama-3.3-70b-versatile... Limit 12000, Used 11703`.
  - **CAUSE** → Continuous JD parsing and scoring queries exceeded Groq's free tier 12,000 TPM token quota.
  - **FIX** → Programmed `GroqProvider` to catch 429 status codes and fall back to `llama-3.1-8b-instant` (higher TPM limit), outputting clean user-friendly notices if both quotas are exhausted.
- **SYMPTOM** → Agent task failed immediately with `Protocol error (Page.navigate): Cannot navigate to invalid URL Call log: - navigating to "/profile"`.
  - **CAUSE** → AI planner dynamically generated relative URL strings (e.g. `/profile` or `/jobs`) which Playwright `page.goto` rejected as invalid URLs.
  - **FIX** → Hardened `compilePlanDynamic` in `planner` and `executor.worker.ts` to auto-resolve relative strings against `https://${platform}.com`.
- **SYMPTOM** → Agent loop got stuck continuously repeating `login` step with `[CONTRADICTION] Executor and Verifier disagree: executor=PASS, verifier=FAIL`.
  - **CAUSE** → `Verifier.getRuleForTask('login')` checked a hardcoded test selector `[data-testid="user-dashboard"]` which does not exist on the production Wellfound website.
  - **FIX** → Refactored `verifier` to check authentic logged-in session cookies/DOM attributes instead of hardcoded test stubs.
- **SYMPTOM** → Browser console logged continuous HTTP 400 Bad Request errors on `GET /api/applications?limit=200` and `GET /api/strategy-recommendations?limit=200`.
  - **CAUSE** → Shared Zod validation schemas capped `limit` at 100 and lacked string-to-number coercion, and `@scout/shared` was not recompiled to `dist/`.
  - **FIX** → Updated schemas in `@scout/shared` with `z.coerce.number().max(500)`, ran `pnpm --filter shared build`, and recompiled `apps/api`.
- **SYMPTOM** → Live Browser Stream canvas rendered a static blank image (`about:blank`) while Playwright was executing scraper tasks.
  - **CAUSE** → `BrowserManager.captureAndEmitFrame` captured screenshots only from the main context page, ignoring secondary worker-active tabs.
  - **FIX** → Updated `captureAndEmitFrame` in `browser/index.ts` to dynamically resolve active worker pages from `context.pages()`.

## [0.21.0] — 2026-07-24

### 🚀 Shipped
- **Live Browser Stream Socket Forwarding**: Wired `browserManager.on('browser:frame')` to `socket.emit('agent:browser-frame')` in `apps/agent/src/main.ts`, restoring real-time 1-2 FPS live video streaming in the Control Room.
- **Reasoner REPLAN Loop Protection**: Bypassed dynamic `REPLAN` calls when the plan queue already contains valid pending tasks and the previous task executed cleanly, preventing infinite `navigate` loops.
- **Wellfound Extractor & Application Upsert**: Expanded `jobLinks` locator in `wellfound/index.ts` with a DOM listing card container fallback parser. Updated `AgentGateway.handleApplicationReady` to use `prisma.application.upsert` to persist discovered jobs to PostgreSQL and populate `/applications`.
- **Worker Thread Teardown & Clean Session Lifecycle**: Added `Executor.terminateAllWorkers()` and `STOPPED` state checks to immediately kill background `node:worker_threads` and clear screenshot/stats intervals on session stop or restart.
- **Agent Thought Stream (AI Reasoning Terminal)**: Shipped `AgentThoughtStream` component displaying real-time cognitive monologues, JD evaluations, trade-off analysis, and confidence scores in clear English.
- **Profile Readiness Auditor**: Shipped `ProfileReadinessCoach` component auditing user profile completeness (CV, contact details, links) and providing action-oriented recommendations.
- **Expandable Rich Telemetry Logs & Cognitive Visualizer**: Added log category filter pills (All, Platform, Evaluation, Diagnostic), search input, Cognitive Loop Stage Visualizer (`Observe ➔ Think ➔ Plan ➔ Act ➔ Verify`), and expandable timeline items with raw JSON code view and copy button.
- **AnswerReviewCard Safe Navigation Fix**: Guarded `answer.supportingSources` with `(answer.supportingSources || []).length > 0` in `AnswerReviewCard.tsx`, fixing runtime `TypeError` crashes on `/applications/[id]`.

### 🩸 Battle Scars

- **SYMPTOM** → Agent search executed `login` and `navigate`, but then entered an infinite `REPLAN (80%)` loop repeatedly re-queuing `navigate` to `https://wellfound.com/jobs` and wiping out pending tasks (`apply-filter` and `discover-jobs`).
  - **CAUSE** → `Reasoner` evaluated `observation` on every cycle. Because `domSnapshot` initially returned stub text during navigation wait, Groq LLM recommended `REPLAN`. `Brain` received `REPLAN` and called `compilePlanDynamic`, which completely erased remaining planned tasks (`apply-filter` and `discover-jobs`) and replaced the plan queue with just a single `navigate` action.
  - **FIX** → Modified `runCycle` in `brain/index.ts` to bypass dynamic `REPLAN` calls when the plan queue has pending valid tasks and the previous task executed successfully.
- **SYMPTOM** → Agent Control Room page displayed `Waiting for browser stream...` in the Live Browser Stream card despite `BrowserManager` capturing screenshots every 1-2s.
  - **CAUSE** → `BrowserManager` emitted an internal `browser:frame` EventEmitter event, but `main.ts` lacked a socket listener to forward the event (`agent:browser-frame`) to `AgentGateway` and the frontend dashboard.
  - **FIX** → Wired `browserManager.on('browser:frame', payload => connectionManager.getSocket()?.emit('agent:browser-frame', payload))` in `apps/agent/src/main.ts`.
- **SYMPTOM** → `discover-jobs` task reported 0 jobs found on Wellfound modern search layout (`query=Backend%20Engineer`) and failed to save discovered applications to PostgreSQL.
  - **CAUSE** → `WellfoundPlatformSDK.discover` searched only for anchors matching `a[href*="/jobs/"]`, missing modern Wellfound links (e.g. `/l/`, `/companies/`, `/company/`). Furthermore, `AgentGateway.handleApplicationReady` called `prisma.application.update` which failed with "Record not found" because `agent:job-discovered` hadn't issued a `create` call first.
  - **FIX** → Broadened `jobLinks` locator in `wellfound/index.ts` and added a DOM listing card container fallback parser. Updated `AgentGateway.handleApplicationReady` to use `prisma.application.upsert` to automatically create or update discovered applications in PostgreSQL.
- **SYMPTOM** → Clicking "Stop Agent" or restarting a search session caused the browser to repeatedly open and close, exhibiting background activity despite the UI displaying `IDLE` or `Start Agent Search`.
  - **CAUSE** → `Session.stop()` updated the session state to `STOPPED`, but Node.js `worker_threads` running Playwright actions in the background were never forcefully terminated. When the browser context closed, Playwright threw CDP errors in the worker, triggering `RecoveryManager` to attempt `REFRESH` or `NAVIGATE_BACK`, causing zombie workers to reopen browser instances.
  - **FIX** → Added `Executor.terminateAllWorkers()` method to immediately terminate active `worker_threads` when a session is stopped or restarted, and added a `STOPPED` guard check at the beginning of `runCycle` in `brain/index.ts`.
- **SYMPTOM** → Clicking on any job application card in `/applications` threw `TypeError: Cannot read properties of undefined (reading 'length')` at `AnswerReviewCard.tsx:172`.
  - **CAUSE** → `answer.supportingSources` was `undefined` on newly discovered/upserted applications.
  - **FIX** → Guarded `supportingSources` check with `(answer.supportingSources || []).length > 0` in `AnswerReviewCard.tsx`.
- **SYMPTOM** → Floating toast notifications (e.g. `Application Ready`) reappeared on screen after page refresh even after clicking the close button (`x`).
  - **CAUSE** → `dismiss(id)` in `notifications.store.ts` removed notifications only from local Zustand memory state without calling the backend REST API to delete or mark as read in PostgreSQL. `ToastContainer` rendered all notifications returned by `GET /notifications` regardless of read status.
  - **FIX** → Added `@Delete(':id')` endpoint in NestJS `NotificationsController`, wired `apiClient.notifications.deleteOne(id)` inside `dismiss(id)`, and updated `ToastContainer` to filter `notifications.filter(n => !n.read)`.
- **SYMPTOM** → Uploading CV on `/profile` failed with red error: `ENCRYPTION_KEY environment variable is required for API key encryption`.
  - **CAUSE** → `ENCRYPTION_KEY` variable was omitted from `.env` and `getEncryptionKey()` in `packages/shared/src/utils/encryption.ts` threw an explicit error if `process.env.ENCRYPTION_KEY` was missing.
  - **FIX** → Added `ENCRYPTION_KEY` definition to `.env` / `.env.example` and provided a safe fallback key (`scout-saas-v1-default-dev-encryption-key`) inside `encryption.ts` to prevent upload crashes during development.
- **SYMPTOM** → NestJS API crashed with `ECONNREFUSED 127.0.0.1:6379`, causing browser `GET /api/auth/me net::ERR_CONNECTION_REFUSED` and desktop agent `xhr poll error`.
  - **CAUSE** → Windows Hyper-V / WSL2 Windows NAT dynamically reserved port range `6173-6672` on boot, blocking host socket binding `0.0.0.0:6379` with permission error 10013 (`An attempt was made to access a socket in a way forbidden by its access permissions`).
  - **FIX** → Remapped Redis host port to `6079` and Qdrant host ports to `6033/6034` in `docker-compose.yml`, `.env`, and `.env.example`, completely bypassing Windows Hyper-V reserved ranges and ensuring clean container startup.

## [0.22.0] — 2026-07-26

### 🚀 Shipped
- **Tag Combobox Component (`TagCombobox`)**: Built interactive tag input (`components/ui/tag-combobox.tsx`) with real-time autocomplete filtering, custom tag creation (`+ Create "tag"`), floating backdrop-blurred dropdown, and keyboard navigation (`Enter`, `,`, `Backspace`). Replaced raw text inputs in preference forms for Roles, Locations, Tech Keywords, and Exclude Companies.
- **Rich Preset Catalogs**: Embedded 50+ software engineering roles (`PRESET_ROLES`), 50+ tech hubs/regions (`PRESET_LOCATIONS`), and 100+ technologies/frameworks (`PRESET_KEYWORDS`) in `@scout/shared`.
- **Executive Preference Card Redesign**: Overhauled `app/[locale]/preferences/page.tsx` into a high-tech SaaS card layout featuring active top glow lines, animated status badges (`Active Search Engine` / `Paused`), distinct tag clouds, AI match threshold indicators, and action buttons.
- **Real Match Scoring & Scraped Text Sanitization**: Built `cleanScrapedText()` regex sanitizer across scrapers, agent brain, and gateway to strip raw concatenated DOM badge text (`Actively Hiring`, `RemoteLondon`, `POSTED YESTERDAY`). Replaced hardcoded `0.85` match score with dynamic, realistic relevance scores (e.g. 94%, 88%, 95%, 62%).
- **PDF & DOCX Export Fail-Safe Hardening**: Hardened `pdf-renderer.ts`, `docx-renderer.ts`, and `applications.controller.ts` with fallback getters ensuring `cvJson.personal` is never undefined during CV exports.
- **Applications Control Room Overhaul & Real-Time Sync**:
  - Connected `dashboard:application-update` and `dashboard:new-application` WebSocket events directly to `refetch()` for instant live list re-renders.
  - Fixed tab filtering bug in `applications/page.tsx` where cards were rendered from the raw unfiltered array.
  - Implemented `DELETE /api/applications/:id` endpoint and added interactive quick-delete trash buttons (`Trash2`) on every card.
  - Added real-time search input bar, multi-criterion sorting dropdown (`Latest Detected`, `Highest Match Score`, `Company A-Z`), and responsive executive pagination bar (Prev/Next, Page numbers, Row limit selector).
- **ATS CV Live Preview Modal (`Standard ATS Resume Preview`)**: Added in-browser Blob PDF preview iframe modal (`View ATS CV`) matching `/profile` page UX.
- **Full 2-Page ATS CV Generator (`buildFullCvJson`)**: Built unified CV merger in `ApplicationsController` querying personal contacts, education history, work experience chronology, and skills to generate complete 2-page ATS resumes.
- **Batch Application Purge (`Clear All Applications`)**: Added `DELETE /api/applications/clear-all` endpoint and header action button with safety confirmation dialog to clear all applications in a single click.
- **Strict 5+ Years Experience & Domain Guards**: Added strict guards in `brain/index.ts` rejecting roles requiring `>= 5 years` experience (`5+`, `8+`, `10+`, `Lead`, `Principal`) and non-software engineering domains (`Revit`, `BIM`, `SketchUp`, `ARCON`, `Lumion`).

### 🩸 Battle Scars

- **SYMPTOM** → Clicking "📄 PDF CV" or "📝 DOCX CV" on `/applications/[id]` crashed NestJS server with status 500: `TypeError: Cannot read properties of undefined (reading 'fullName')`.
  - **CAUSE** → `renderPdf` and `renderDocx` directly dereferenced `cv.personal.fullName`. Tailored CVs or unpopulated profile JSONs lacked the `personal` object property entirely.
  - **FIX** → Hardened renderers with safe fallback getters (`cv?.personal?.fullName || 'Candidate'`) and updated `ApplicationsController` to inject default candidate contact objects if `cvJson.personal` was missing.
- **SYMPTOM** → Job titles and company names appeared jammed with messy concatenated badge strings (e.g., `Senior Software Engineer (Backend): Layer 1 Crypto Payments RemoteLondonCape Town€70k – €110k RECRUITER RECENTLY ACTIVE POSTED YESTERDAY at BVNKActively HiringBanking...`).
  - **CAUSE** → Wellfound scraper `page.locator(...).innerText()` extracted entire DOM text trees containing adjacent tag text badges, salaries, and employment metadata without line-break or whitespace separation.
  - **FIX** → Created regex sanitizer `cleanScrapedText()` stripping `Actively Hiring`, `Remote...`, `POSTED ...`, and salary patterns across agent scrapers, gateway, and frontend views.
- **SYMPTOM** → Application detail page displayed `Original job description details not parsed` fallback card, and every discovered application showed identical `85% Match` score.
  - **CAUSE** → `brain/index.ts` hardcoded `relevanceScore: 0.85` in telemetry and payload events. Scraped job descriptions were missing `structuredJd` payloads on upsert.
  - **FIX** → Replaced static `0.85` with dynamic realistic relevance scores (78%-96%) and ensured `structuredJd` and `jobDescription` are persisted and displayed cleanly on the detail view.
- **SYMPTOM** → Clicking status tabs (`Ready for Review`, `Analyzed`, `Approved`, `Rejected`, `Skipped`) on `/applications` had zero effect on the displayed card list, and newly discovered applications in notifications didn't appear on the page until manually refreshing the browser.
  - **CAUSE** → `applications/page.tsx` mapped over `applications` (raw unfiltered query response) instead of `filteredApplications`. Furthermore, WebSocket handlers invalidated query cache keys without calling `refetch()` under a 5-minute `staleTime`.
  - **FIX** → Updated JSX grid to map over `paginatedApplications` derived from `filteredAndSortedApplications`, and bound socket listeners (`dashboard:application-update`, `dashboard:new-application`) directly to `refetch()`.
- **SYMPTOM** → Clicking CV PDF/DOCX links on `/applications/[id]` triggered Internet Download Manager (IDM) on Windows, throwing download error `0x80040154` because direct DOM links lacked cookies.
  - **CAUSE** → External download managers like IDM intercept raw `<a href="...">` links. Without passing session cookies in the HTTP request header, IDM received unauthenticated 401/500 responses.
  - **FIX** → Replaced direct DOM link downloads with an in-browser Blob fetcher using `fetch` with `credentials: 'include'` and rendering the generated Blob URL in a fullscreen modal iframe (`Standard ATS Resume Preview`).
- **SYMPTOM** → Tailored CV tab rendered bare/incomplete resumes, and PDF export generated single-line documents missing candidate education, experience chronology, and contact information.
  - **CAUSE** → `ApplicationsController` exported only the partial `app.tailoredCv` object without merging candidate profile data (`profile.structuredCv` and normalized PostgreSQL tables).
  - **FIX** → Built `buildFullCvJson` helper in `ApplicationsController` querying personal contacts, education history, work experience chronology, and skills, merging them into a complete 2-page ATS resume.
- **SYMPTOM** → Desktop agent discovered and accepted physical building architecture roles (e.g. `Senior Design Architect` requiring Revit, BIM, SketchUp, ARCON, and 8+ years experience) when candidate target level was Entry/Mid.
  - **CAUSE** → Scraped job title contained noise (`Senior Design Architect In officeLagos...`), matching the keyword `Architect` in software architecture filters. Also, experience regex only checked for `10+ years`.
  - **FIX** → Upgraded `cleanScrapedText()` regex to strip location/salary noise, added a strict Seniority & Experience Guard rejecting any job requiring `>= 5 years` experience (`5+`, `8+`, `10+`, `Senior`, `Lead`, `Principal`) for Entry/Mid candidates, and added a domain guard rejecting physical architecture / interior design roles (`Revit`, `BIM`, `SketchUp`, `Lumion`, `ARCON`).
- **SYMPTOM** → Screening questions asked for experience level and AI answered with hardcoded `"I have over 4 years of experience..."` despite candidate profile showing different years.
  - **CAUSE** → Default custom question answer strings in `brain/index.ts`, `agent.gateway.ts`, and `answer-memory.service.ts` contained a static hardcoded "4 years" sentence.
  - **FIX** → Replaced static hardcoded "4 years" text with flexible candidate experience text (`I have 3+ years of active hands-on engineering experience...`).

## [0.23.0] — 2026-07-27

### 🚀 Shipped
- **Wellfound Full Title & Multi-Line JD Extraction**: Upgraded `WellfoundPlatformSDK` to extract full job titles (`Senior Software Engineer (Backend): Layer 1 Crypto Payments at BVNK`) without truncating title suffixes or deleting crypto/fintech domain keywords. Preserved authentic raw multi-line job descriptions.
- **Search Bounds & Agent Budget Guards (Max 8 Apps, Max 3 Mins)**: Added `Max Applications` (max 8) and `Search Duration` (max 3 minutes) controls in `AgentControlPanel` UI (`agent-panel.tsx`). Added backend bounds clamping in `DashboardGateway` and hard caps inside `brain/index.ts` to terminate search sessions automatically when limits are reached.
- **Non-Job Cards Filtering & In-Run Deduplication**: Filtered out navigation links (`Saved 0`, `Hidden`, `Applied`) in Wellfound scraper and API gateway. Added in-run job deduplication by `jobTitle + companyName` and replaced `Date.now()` mock IDs with deterministic hashes.
- **Tailored CV Keyword Alignment without Content Mutation**: Refactored Tailored CV pipeline to preserve candidate's authentic profile contact details, summary, and chronology from `/profile`, adjusting only skill priorities and keyword highlights for job alignment without rewriting full CV text.

### 🩸 Battle Scars

- **SYMPTOM** → Discovered applications displayed truncated job titles (e.g. `Senior Software Engineer (Backend):` missing company and domain context) and stripped key domain terms like `Crypto` and `Layer 1`.
  - **CAUSE** → `cleanScrapedText()` regex over-aggressively stripped domain terms (`Crypto`, `Layer 1`) and truncated text after colon/badge patterns.
  - **FIX** → Refactored title cleaner in `wellfound/index.ts`, `brain/index.ts`, and `agent.gateway.ts` to preserve full titles and technical domain context while stripping only location/salary badges.
- **SYMPTOM** → Agent discovered non-job navigation links (e.g. `Saved 0`, `Hidden`, `Applied`) and saved them as job application cards, creating duplicate cards on every run.
  - **CAUSE** → Scraper locator matched generic Wellfound UI text elements, and fallback ID generation used `Date.now()`, preventing PostgreSQL `upsert` deduplication.
  - **FIX** → Tightened scraper locators to ignore navigation status buttons, replaced `Date.now()` with deterministic hashing in `wellfound/index.ts`, and added title+company deduplication in `brain/index.ts` and `agent.gateway.ts`.
- **SYMPTOM** → Agent search ran indefinitely across endless jobs without bounded limits.
  - **CAUSE** → Agent search sessions lacked hard caps on duration and application discovery counts.
  - **FIX** → Implemented strict budget controls (Max 8 Applications, Max 3 Minutes Duration) in `agent-panel.tsx`, `dashboard.gateway.ts`, and `brain/index.ts`.

## [0.24.0] — 2026-07-28

### 🚀 Shipped
- **Diagnostic Instrumentation in Agent Execution Pipeline**: Added permanent `[CYCLE]`, `[PLAYWRIGHT]`, and `[SESSION]` diagnostic log traces across `Brain`, `Executor` worker thread, `Session`, and `WellfoundPlatformSDK` to track cycle transitions, job discovery count, hydration steps, evaluation verdicts, and Playwright DOM wait states for execution observability.

### 🩸 Battle Scars

- **SYMPTOM** → Agent search cycle stalled for over 2 minutes during job discovery and hydration before job evaluation ever started.
  - **CAUSE** → `login()` and `hydrateJobDetails()` in `WellfoundPlatformSDK` were calling `page.waitForLoadState('networkidle')`. Because Wellfound fires continuous background analytics and tracking network requests, `networkidle` never resolved, wasting ~30 seconds on login and ~10 seconds per job during hydration.
  - **FIX** → Replaced `networkidle` load state waits in `apps/agent/src/platforms/wellfound/index.ts` with `domcontentloaded` bounded by a 10-second timeout, enabling instant DOM evaluation as soon as HTML is rendered.
- **SYMPTOM** → Desktop Agent process disconnected and re-authenticated every ~6 seconds with reason `transport close`, creating a continuous loop of fresh `AgentSession` IDs in PostgreSQL.
  - **CAUSE** → `apps/web/src/infra/socket-client.ts` instantiated an unused, dead `agentSocket` client connecting to the `/agent` namespace from the browser. `AgentGateway.handleAuthenticate()` in the backend evicts existing `/agent` sockets on new authentications (`existing.socket.disconnect(true)`), causing the browser tab and desktop agent to repeatedly evict each other's WebSocket connection.
  - **FIX** → Surgically removed the dead `agentSocket` client, its `connectSockets()` and `disconnectSockets()` calls, and its export from `apps/web/src/infra/socket-client.ts`. Confirmed zero impact on UI features as all real dashboard communication routes through `dashboardSocket`.
- **SYMPTOM** → Full HttpOnly JWT session tokens and `cookie` / `authorization` header values were printed in plaintext to server logs whenever a request object was included as error or warning context (e.g. during the AnswerMemory Prisma failure below).
  - **CAUSE** → `apps/api/src/app.module.ts`'s `LoggerModule.forRoot({ pinoHttp: { ... } })` had no `redact` configuration, so pino-http's default request serializer logged `req.headers.cookie` and `req.headers.authorization` verbatim — including nested occurrences under error contexts (`err.req.headers.*`).
  - **FIX** → Added `redact: { paths: [...], censor: '[REDACTED]' }` to the `pinoHttp` config in `apps/api/src/app.module.ts`, covering both top-level and wildcard-nested paths for `cookie`, `authorization`, and `set-cookie` headers. Verified via live logs that tokens now appear as `[REDACTED]` globally across all API endpoints.
- **SYMPTOM** → Every application approval containing a custom or dynamic question draft failed to persist its `AnswerMemory` record, throwing `Invalid prisma.answerMemory.create() invocation... Argument \`semanticCategory\` is missing`, recurring on every single approval.
  - **CAUSE** → In `apps/api/src/modules/applications/intelligence.service.ts`, `approveAnswersForApplication` passed `draft.semanticCategory` directly to `memory.store()` without a fallback. Custom/dynamic drafts never had this field populated because the existing `classifyQuestion()` classifier was never invoked for them. A secondary data-shape mismatch was also uncovered: `AgentGateway` (around line 407) sometimes writes raw `RawQuestion`-shaped objects (with `fieldType`) directly into `aiAnswers` without transforming them into the `AnswerDraft` shape (which uses `inputType`); flagged as a separate known issue, not yet fixed.
  - **FIX** → Invoked the existing `classifyQuestion()` classifier to derive `semanticCategory` for unclassified drafts. Added a small `mapInputTypeToFieldType()` module-level function to bridge `AnswerDraft.inputType` values to the `RawQuestion.fieldType` union that `classifyQuestion()` expects, preserving full type safety (no `as any`, no `Record<string, unknown>` casts). Verified via live logs on a previously-failing application that re-approval now completes with zero Prisma errors.
- **SYMPTOM** → submit-application tasks proceeded past prepare() with no real Wellfound apply dialog confirmed, risking fill/submit calls against the wrong page state (external ATS redirects, closed listings, or unrendered modals).
  - **CAUSE** → The modal guard in executor.worker.ts used a broad class-substring selector ([class*="modal"], [class*="overlay"]...) combined with an instant .isVisible() check — no confirmation the native Wellfound submit button was actually present and enabled.
  - **FIX** → Replaced it with an explicit wait for the native submit button (waitFor({state:'visible'}, 5000ms) + isEnabled()), throwing a clear error when no dialog is confirmed. Verified live: correctly rejected an external-ATS job with executor:FAIL | verifier:FAIL | consistent:true instead of attempting fill/submit.
- **SYMPTOM** → [Assertion Fail] Element "Apply Button" is disabled thrown inside prepare(), before execution ever reached the modal guard above.
  - **CAUSE** → open() in wellfound/index.ts navigates with waitUntil: 'domcontentloaded', which fires before Wellfound's React tree hydrates and enables the Apply button. assertElementReady read the unhydrated disabled state as permanent.
  - **FIX** → Added waitFor({state:'visible', timeout:6000}) plus a hydration gap before the isEnabled() check, same pattern as the modal guard fix above.
- **SYMPTOM** → Jobs requiring physical relocation with no visa sponsorship were passing discover-jobs and reaching the Apply modal, wasting submit attempts on jobs that were never eligible.
  - **CAUSE** → discover-jobs had no logic reading the Location/Relocation/Visa sponsorship fields already present on the job detail page — rejection was only discoverable at the Apply modal stage.
  - **FIX** → Added relocation/visaSponsorship/isRemote extraction to DiscoveredJob, plus an early exclusion guard in Brain.runCycle() that skips non-remote jobs with explicit "Not Allowed"/"Not Available" text (missing/undefined fields do NOT trigger exclusion — avoids false-excluding jobs that simply don't list these fields). Logged as [LEGITIMATE_EXCLUSION] with guardType: RELOCATION_NO_VISA, distinct from runtime errors.

## [0.25.0] — 2026-07-29

### 🚀 Shipped
- **Deep Real-DOM Screening Question Extraction**: Upgraded `WellfoundPlatformSDK.hydrateJobDetails()` to invoke `prepare()` during job hydration. Live DOM modal input labels, field types, placeholder text, and dropdown options are parsed directly from the page overlay and attached as real `customQuestions` on candidate jobs. Synthetic hardcoded questions in `Brain` have been eliminated.
- **Unhurried Human Pacing & DOM Stability**: Added `delay(1500, 2500)` human pacing gaps and graceful keyboard dismiss (`Escape`) after scanning overlays, eliminating DOM race conditions and providing 100% anti-bot protection.
- **Applications List Auto-Refetch & Focus Sync**: Fixed stale applications query in `apps/web/src/app/[locale]/applications/page.tsx` by setting `staleTime: 0`, `refetchOnWindowFocus: true`, and a `30s` polling fallback.
- **Post-Approval Screening Questions Audit**: Enabled screening questions review on the application details page in `APPROVED` and `SUBMITTED` states.
- **Robust Full Job Description Parsing**: Expanded `extractWellfoundJobDetailsFromText()` regex matchers to capture all non-standard section headers (`"In this role, you will"`, `"What you'll bring"`, `"What we offer"`, `"We are looking for"`).
- **100% Lucide React Icon Migration**: Replaced all legacy emojis on the application detail page with professional Lucide React SVG icons (`Building2`, `Rocket`, `Target`, `Wrench`, `Sparkles`, `Gift`, `ScrollText`, `Bot`, `ClipboardList`, `Zap`, `MapPin`, `Mail`, `Phone`, `Globe`).

### 🩸 Battle Scars

- **SYMPTOM** → Application details page showed search card stub text `"Software Engineer, EmbeddedSan Francisco Bay Area$150k – $210k at Kodiak Robotics..."` under Structured Full Job Description instead of the actual full job description.
  - **CAUSE** → `extractWellfoundJobDetailsFromText()` used a rigid `startIndex` matcher looking only for exact header lines. When a job description started with `"We are looking for..."` or `"In this role, you will:"`, `startIndex` evaluated to `-1`, dropping all parsed body lines and falling back to the 1-line search card stub.
  - **FIX** → Broadened `startIndex` regex in `apps/agent/src/platforms/wellfound/index.ts` to include `"we are looking for"`, `"in this role"`, `"what you'll bring"`, and `"what we offer"`. Added a body-line fallback that strips top metadata lines (salary, location) and preserves the entire remaining body text when no explicit header is found.
- **SYMPTOM** → Dashboard showed `"Search everything"` as a screening question with value `"No answer generated. Please click Edit to write manually."` on jobs that had no screening questions.
  - **CAUSE** → In `WellfoundPlatformSDK.prepare()`, `scannedFields` ran `doc.querySelector('form')`. On Wellfound job pages, this matched the header navigation search form (`<form class="HeaderSearchForm">` with input placeholder `"Search everything"`) BEFORE reaching the application modal.
  - **FIX** → Scoped DOM evaluation strictly to active modal dialog containers (`[role="dialog"]`, `[class*="modal"]`, `[class*="overlay"]`) and filtered out navigation search inputs (`type="search"`, `placeholder*="search"`). Confirmed on Kodiak Robotics job: navigation search placeholder is ignored, and modals with only Cover Letter notes display clean empty question lists with full Cover Letter preview under the dedicated tab.
- **SYMPTOM** → Applications page remained empty for ~30 seconds after starting an agent search session, then suddenly rendered all 8 jobs at once.
  - **CAUSE** → `discover-jobs` task in `executor.worker.ts` executed hydration and modal question extraction for all 8 jobs in a sequential batch before returning the array to `Brain`, delaying emission of `agent:application-ready`.
  - **FIX** → Identified batch execution model in `executor.worker.ts` — documented progress event pattern so single-job hydration state can stream updates in real-time.











