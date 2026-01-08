# Task Management Application

A full-stack task management application built with React, Express.js, PostgreSQL, and Docker.

## Features

- JWT-based authentication with refresh tokens
- Full CRUD operations for tasks with status tracking
- Filter tasks by status, priority, and search terms
- Responsive design with modern dark theme UI
- Fully containerized with Docker

## Tech Stack

**Frontend**: React 18 + TypeScript + Vite + Tailwind CSS + React Query  
**Backend**: Node.js + Express + TypeScript + Prisma + PostgreSQL  
**DevOps**: Docker + Docker Compose + GitHub Actions

## Quick Start

### Using Docker (Recommended)

```bash
# Clone and setup
git clone https://github.com/ejtx16/full-stack-expert-assignment.git
cd full-stack-expert-assignment

cp .env.example .env

# Start services
docker-compose up -d

# Run migrations and seed
docker-compose exec backend npx prisma migrate deploy
docker-compose exec backend npm run db:seed


# Access at http://localhost
Frontend: http://localhost (port 80)
Backend API: http://localhost:3000/api

```

### Local Development

```bash
# Backend
cd backend
cp env.example .env
npm install
npx prisma generate
npx prisma migrate dev
npm run db:seed
npm run dev

# Frontend (new terminal)
cd frontend
npm install
npm run dev

# Access at http://localhost:5173
```

### Demo Credentials

- **Email**: demo@example.com
- **Password**: Password123

## Documentation

- **[API Documentation](/project-documentations/api-docs.md)** - Detailed API endpoints, request/response examples, and authentication flow
- **[Technical Decisions](/project-documentations/technical-decisions.md)** - Assumptions and decisions made during development
- **[Design Notes](/project-documentations/design-notes.md)** - Design considerations and decisions

## Environment Variables

See `backend/env.example` for required variables:

- `DATABASE_URL` - PostgreSQL connection string
- `JWT_SECRET` - JWT signing secret
- `REFRESH_TOKEN_SECRET` - Refresh token secret
- `CORS_ORIGIN` - Allowed CORS origin

## Development Commands

```bash
# Backend
npm run dev          # Start dev server
npm run build        # Build for production
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio

# Frontend
npm run dev          # Start dev server
npm run build        # Build for production

# Docker
docker-compose up -d              # Start services
docker-compose down               # Stop services
docker-compose logs -f backend    # View logs
```

### GitHub Secrets Setup

To enable auto-deployment after CI passes, add these secrets to your GitHub repository:

**Settings → Secrets and variables → Actions → New repository secret**

| Secret                        | How to Get It                              |
| ----------------------------- | ------------------------------------------ |
| `RENDER_BACKEND_DEPLOY_HOOK`  | Render → Backend → Settings → Deploy Hook  |
| `RENDER_FRONTEND_DEPLOY_HOOK` | Render → Frontend → Settings → Deploy Hook |

## Project Structure

```
├── backend/
│   ├── src/
│   │   ├── controllers/    # Route handlers
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, validation, etc.
│   │   └── routes/         # API routes
│   └── prisma/            # Database schema
├── frontend/
│   ├── src/
│   │   ├── components/    # UI components
│   │   ├── pages/         # Page components
│   │   ├── hooks/         # Custom hooks
│   │   └── services/      # API services
└── docker-compose.yml
```

## License

MIT License
