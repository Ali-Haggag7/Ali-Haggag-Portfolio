# 🎓 StudentHub

An all-in-one platform for university students — connecting them with academic projects, student activities, volunteering, and more.

## Project Structure

```
StudentHub/
├── backend/                → .NET 10 Web API (Clean Architecture)
│   ├── StudentHub.Domain/          → Entities & Enums
│   ├── StudentHub.Application/     → Interfaces, DTOs, Common
│   ├── StudentHub.Infrastructure/  → EF Core, Repositories, Identity, JWT
│   └── StudentHub.API/             → Controllers, Program.cs
├── frontend/               → React + Vite (MUI, Tailwind)
├── mobile/                 → Flutter mobile app
└── docs/                   → SRS, DDS, Project Plan
```

## Tech Stack

| Layer | Technology |
|---|---|
| Backend | .NET 10 Web API, Clean Architecture, Repository Pattern |
| Auth | ASP.NET Identity, JWT |
| Database | SQL Server, EF Core (Code-First) |
| Frontend | React 18, Vite, MUI, Tailwind CSS |
| Mobile | Flutter |

## Getting Started

### Prerequisites
- [.NET 10 SDK](https://dotnet.microsoft.com/download)
- [SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) (LocalDB or full)
- [Node.js 18+](https://nodejs.org/) (for frontend)

### Backend (.NET)
```bash
cd backend
dotnet restore
dotnet run --project StudentHub.API
```

> The app will auto-migrate the database and seed sample data on first run (development mode only).

### Frontend (React)
```bash
cd frontend
npm install
npm run dev
```

### Mobile (Flutter)
```bash
cd mobile/studenthub_app
flutter pub get
flutter run
```

## Backend Architecture

The backend follows **Clean Architecture** with 4 projects:

| Project | Purpose |
|---|---|
| `StudentHub.Domain` | Entity classes + Enums (no dependencies) |
| `StudentHub.Application` | Interfaces, DTOs, common types |
| `StudentHub.Infrastructure` | EF Core, Repositories, Identity, JWT, Seed data |
| `StudentHub.API` | Controllers + startup configuration |

**Dependency Rule:** Domain ← Application ← Infrastructure ← API

See [DDS.md](docs/DDS.md) for full architecture details.

## Live Deployments
- **Backend API**: TBD — Pending Production Deployment
- **Frontend App**: TBD — Pending Production Deployment