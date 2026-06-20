# Contributing Guide — StudentHub

## Getting Started

### 1. Get Added as a Collaborator

### 2. Clone the Repo
```bash
git clone https://github.com/3bdo-yahya/Student-Hub.git
cd Student-Hub
```

### 3. Set Up Your Workspace
**Backend (.NET) devs:**
```bash
cd backend
# .NET project will be set up here
```

**Frontend (React) devs:**
```bash
cd frontend
npm install
npm run dev
```

**Mobile (Flutter) devs:**
```bash
cd mobile
# Flutter project will be set up here
```

> ⚠️ Only work inside YOUR folder (`backend/`, `frontend/`, or `mobile/`). Do NOT edit files in other team's folders without discussing first.

---

## Git Workflow

### Branches
```
main              ← deployed / demo-ready (protected, no direct pushes)
  └── develop     ← integration branch (merge features here)
       ├── feature/backend-auth        ← .NET dev 1 + 2
       ├── feature/backend-activities  ← .NET dev 3
       ├── feature/backend-admin       ← .NET dev 4
       ├── feature/frontend-auth       ← React dev 1
       ├── feature/frontend-pages      ← React dev 2
       ├── feature/mobile-app          ← Flutter dev 1 + 2
       └── fix/login-bug               ← anyone, for bug fixes
```

### Daily Workflow

**Starting your day:**
```bash
git checkout develop
git pull origin develop
git checkout your-feature-branch
git merge develop
```

**Working on your feature:**
```bash
# Make your changes, then:
git add .
git commit -m "feat: add login endpoint"
git push origin your-feature-branch
```

**When your feature is ready:**
1. Push your branch to GitHub
2. Open a **Pull Request** (PR) from your branch → `develop`
3. Ask at least 1 teammate to **review** it
4. After approval, **merge** the PR on GitHub
5. Delete your old branch and create a new one for the next task

### Commit Message Rules

| Prefix | Use for |
|---|---|
| `feat:` | New feature — `feat: add activities list endpoint` |
| `fix:` | Bug fix — `fix: registration email validation` |
| `style:` | UI/CSS only — `style: update login page layout` |
| `docs:` | Documentation — `docs: add API contract for auth` |
| `refactor:` | Code cleanup — `refactor: extract auth middleware` |

---

## Rules for the Monorepo

### 1. Stay In Your Lane
- Backend devs work in `backend/` only
- Frontend devs work in `frontend/` only
- Mobile devs work in `mobile/` only
- Shared files (`README.md`, `docs/`) — discuss with team leader first

### 2. Don't Break Others
- Before merging to `develop`, make sure YOUR code builds/runs
- Backend: `dotnet build` must pass
- Frontend: `npm run build` must pass
- If your merge breaks `develop`, fix it immediately

### 3. Pull Before You Push
Always pull the latest `develop` into your branch before opening a PR:
```bash
git checkout your-branch
git pull origin develop
# resolve any conflicts
git push origin your-branch
```

### 4. Never Force Push to Shared Branches
```bash
# ❌ NEVER do this on develop or main:
git push --force

# ✅ Force push is ONLY okay on YOUR OWN feature branch if needed
```

### 5. Keep PRs Small
- One PR = one feature or one fix
- Don't bundle 5 different changes into one giant PR
- Smaller PRs = easier reviews = fewer conflicts

---

## Resolving Merge Conflicts

If Git says you have a conflict:
1. Open the conflicted file — look for `<<<<<<<`, `=======`, `>>>>>>>`
2. Choose which version to keep (or combine both)
3. Remove the conflict markers
4. `git add .` then `git commit`
5. If unsure, ask the person whose code conflicts with yours

---

## Questions?

Ask in the team group chat. If stuck for more than 2 hours, escalate to the team leader.
