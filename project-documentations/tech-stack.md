# Task Management Application - Tech Stack

## Overview

This document outlines the technology choices for the task management application, including rationale for each selection.

---

## Frontend Stack

### Core Framework

| Technology     | Version | Purpose                                            |
| -------------- | ------- | -------------------------------------------------- |
| **React**      | 18.x    | UI library for building component-based interfaces |
| **TypeScript** | 5.x     | Type safety and better developer experience        |
| **Vite**       | 5.x     | Fast build tool and development server             |

### State Management

| Technology                       | Purpose                                               |
| -------------------------------- | ----------------------------------------------------- |
| **React Context API**            | Global state management for auth and app state        |
| **TanStack Query (React Query)** | Server state management, caching, and synchronization |

### Routing

| Technology       | Version | Purpose                            |
| ---------------- | ------- | ---------------------------------- |
| **React Router** | 6.x     | Client-side routing and navigation |

### UI & Styling

| Technology        | Purpose                                       |
| ----------------- | --------------------------------------------- |
| **Tailwind CSS**  | Utility-first CSS framework for rapid styling |
| **shadcn/ui**     | High-quality, accessible component library    |
| **Lucide React**  | Modern icon library                           |
| **Framer Motion** | Animation library for smooth transitions      |

### Forms & Validation

| Technology          | Purpose                                       |
| ------------------- | --------------------------------------------- |
| **React Hook Form** | Performant form handling                      |
| **Zod**             | Schema validation for forms and API responses |

### HTTP Client

| Technology | Purpose                                         |
| ---------- | ----------------------------------------------- |
| **Axios**  | HTTP client with interceptors for auth handling |

---

## Backend Stack

### Core Framework

| Technology     | Version  | Purpose                                     |
| -------------- | -------- | ------------------------------------------- |
| **Node.js**    | 20.x LTS | JavaScript runtime                          |
| **Express.js** | 4.x      | Web framework for REST API                  |
| **TypeScript** | 5.x      | Type safety and better developer experience |

### Authentication

| Technology             | Purpose                    |
| ---------------------- | -------------------------- |
| **jsonwebtoken (JWT)** | Token-based authentication |
| **bcryptjs**           | Password hashing           |

### Validation & Security

| Technology             | Purpose                          |
| ---------------------- | -------------------------------- |
| **Zod**                | Request/response validation      |
| **Helmet**             | Security headers                 |
| **cors**               | Cross-Origin Resource Sharing    |
| **express-rate-limit** | Rate limiting for API protection |

### Logging & Monitoring

| Technology  | Purpose              |
| ----------- | -------------------- |
| **Winston** | Structured logging   |
| **Morgan**  | HTTP request logging |

---

## Database Stack

### Primary Database

| Technology     | Version | Purpose                                 |
| -------------- | ------- | --------------------------------------- |
| **PostgreSQL** | 16.x    | Relational database for structured data |

### ORM & Migrations

| Technology | Version | Purpose                       |
| ---------- | ------- | ----------------------------- |
| **Prisma** | 5.x     | Type-safe ORM with migrations |

### Why PostgreSQL + Prisma?

- **PostgreSQL**: ACID compliance, robust indexing, excellent performance
- **Prisma**: Type-safe queries, auto-generated types, easy migrations, great DX

---

## DevOps & Infrastructure

### Containerization

| Technology         | Purpose                       |
| ------------------ | ----------------------------- |
| **Docker**         | Application containerization  |
| **Docker Compose** | Multi-container orchestration |

### CI/CD

| Technology         | Purpose                                  |
| ------------------ | ---------------------------------------- |
| **GitHub Actions** | Automated builds, tests, and deployments |

### Environment Management

| Technology         | Purpose                         |
| ------------------ | ------------------------------- |
| **dotenv**         | Environment variable management |
| **Docker secrets** | Sensitive data in production    |

---

## Testing Stack

### Unit & Integration Testing

| Technology                | Purpose                                |
| ------------------------- | -------------------------------------- |
| **Vitest**                | Fast unit testing for frontend         |
| **Jest**                  | Backend unit and integration testing   |
| **Supertest**             | HTTP assertion library for API testing |
| **React Testing Library** | Component testing                      |

### E2E Testing (Optional)

| Technology     | Purpose                    |
| -------------- | -------------------------- |
| **Playwright** | End-to-end browser testing |

---

## Development Tools

### Code Quality

| Technology      | Purpose                         |
| --------------- | ------------------------------- |
| **ESLint**      | JavaScript/TypeScript linting   |
| **Prettier**    | Code formatting                 |
| **Husky**       | Git hooks for pre-commit checks |
| **lint-staged** | Run linters on staged files     |

### API Documentation

| Technology          | Purpose           |
| ------------------- | ----------------- |
| **Swagger/OpenAPI** | API documentation |

---

## Project Structure

```
fullstack-assignment/
├── .github/
│   └── workflows/
│       └── ci.yml              # GitHub Actions CI/CD
├── .cursor/
│   └── rules/                  # Cursor AI rules
├── docs/
│   ├── REQUIREMENTS.md
│   ├── TECH-STACK.md
│   └── DESIGN-NOTES.md
├── backend/
│   ├── src/
│   │   ├── config/             # Configuration files
│   │   ├── controllers/        # Route handlers
│   │   ├── middleware/         # Express middleware
│   │   ├── routes/             # API routes
│   │   ├── services/           # Business logic
│   │   ├── utils/              # Utility functions
│   │   ├── validators/         # Request validation schemas
│   │   └── index.ts            # Entry point
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   ├── migrations/         # Database migrations
│   │   └── seed.ts             # Seed script
│   ├── tests/                  # Backend tests
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── components/         # Reusable UI components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── context/            # React Context providers
│   │   ├── services/           # API service functions
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── public/                 # Static assets
│   ├── tests/                  # Frontend tests
│   ├── Dockerfile
│   ├── package.json
│   ├── tailwind.config.js
│   ├── vite.config.ts
│   └── tsconfig.json
├── docker-compose.yml
├── docker-compose.dev.yml
├── .env.example
├── README.md
└── assignment-requirements.md
```

---

## Version Requirements

### Minimum Versions

- Node.js: 20.x LTS
- npm: 10.x
- Docker: 24.x
- Docker Compose: 2.x
- PostgreSQL: 16.x

### Browser Support

- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

---

## Package Dependencies Summary

### Frontend (`package.json`)

```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.x",
    "@tanstack/react-query": "^5.x",
    "axios": "^1.x",
    "react-hook-form": "^7.x",
    "zod": "^3.x",
    "@hookform/resolvers": "^3.x",
    "tailwindcss": "^3.x",
    "framer-motion": "^11.x",
    "lucide-react": "^0.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "vite": "^5.x",
    "@vitejs/plugin-react": "^4.x",
    "vitest": "^1.x",
    "@testing-library/react": "^14.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```

### Backend (`package.json`)

```json
{
  "dependencies": {
    "express": "^4.x",
    "@prisma/client": "^5.x",
    "jsonwebtoken": "^9.x",
    "bcryptjs": "^2.x",
    "zod": "^3.x",
    "cors": "^2.x",
    "helmet": "^7.x",
    "express-rate-limit": "^7.x",
    "winston": "^3.x",
    "morgan": "^1.x",
    "dotenv": "^16.x"
  },
  "devDependencies": {
    "typescript": "^5.x",
    "prisma": "^5.x",
    "ts-node": "^10.x",
    "tsx": "^4.x",
    "nodemon": "^3.x",
    "jest": "^29.x",
    "@types/express": "^4.x",
    "@types/node": "^20.x",
    "supertest": "^6.x",
    "eslint": "^8.x",
    "prettier": "^3.x"
  }
}
```
