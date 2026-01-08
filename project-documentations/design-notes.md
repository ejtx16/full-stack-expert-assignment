# Task Management Application - Design Notes

## Overview

This document captures architectural decisions, design patterns, and implementation notes for the task management application.

---

## Architecture Overview

### System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Browser                          │
└─────────────────────────────────────────────────────────────────┘
                                │
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (React + Vite)                      │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │   Pages     │  │ Components  │  │   State Management      │ │
│  │  - Login    │  │  - TaskCard │  │  - Auth Context         │ │
│  │  - Register │  │  - TaskForm │  │  - React Query Cache    │ │
│  │  - Dashboard│  │  - Navbar   │  │                         │ │
│  │  - TaskEdit │  │  - Modal    │  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ HTTP/REST (JSON)
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                   Backend (Express.js + TypeScript)             │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐ │
│  │  Routes     │  │ Middleware  │  │   Services              │ │
│  │  - /auth    │  │  - Auth JWT │  │  - AuthService          │ │
│  │  - /tasks   │  │  - Validate │  │  - TaskService          │ │
│  │             │  │  - Error    │  │  - UserService          │ │
│  │             │  │  - RateLimit│  │                         │ │
│  └─────────────┘  └─────────────┘  └─────────────────────────┘ │
└─────────────────────────────────────────────────────────────────┘
                                │
                                │ Prisma ORM
                                ▼
┌─────────────────────────────────────────────────────────────────┐
│                      PostgreSQL Database                        │
│  ┌─────────────────────┐  ┌─────────────────────────────────┐  │
│  │       Users         │  │           Tasks                 │  │
│  │  - id (UUID)        │  │  - id (UUID)                    │  │
│  │  - email            │  │  - title                        │  │
│  │  - password (hash)  │  │  - description                  │  │
│  │  - name             │  │  - status                       │  │
│  │  - createdAt        │  │  - priority                     │  │
│  │  - updatedAt        │  │  - dueDate                      │  │
│  │                     │  │  - userId (FK)                  │  │
│  │                     │  │  - createdAt                    │  │
│  │                     │  │  - updatedAt                    │  │
│  └─────────────────────┘  └─────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Design

### Entity Relationship Diagram

```
┌──────────────────────┐       ┌──────────────────────────────┐
│        User          │       │           Task               │
├──────────────────────┤       ├──────────────────────────────┤
│ id: UUID (PK)        │───┐   │ id: UUID (PK)                │
│ email: String (UQ)   │   │   │ title: String                │
│ password: String     │   │   │ description: String?         │
│ name: String         │   └──▶│ userId: UUID (FK)            │
│ createdAt: DateTime  │       │ status: TaskStatus           │
│ updatedAt: DateTime  │       │ priority: TaskPriority       │
└──────────────────────┘       │ dueDate: DateTime?           │
                               │ createdAt: DateTime          │
                               │ updatedAt: DateTime          │
                               └──────────────────────────────┘
```

### Prisma Schema

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(uuid())
  email     String   @unique
  password  String
  name      String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  tasks     Task[]

  @@index([email])
}

model Task {
  id          String       @id @default(uuid())
  title       String       @db.VarChar(255)
  description String?      @db.Text
  status      TaskStatus   @default(TODO)
  priority    TaskPriority @default(MEDIUM)
  dueDate     DateTime?
  createdAt   DateTime     @default(now())
  updatedAt   DateTime     @updatedAt
  userId      String
  user        User         @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId])
  @@index([status])
  @@index([userId, status])
}

enum TaskStatus {
  TODO
  IN_PROGRESS
  COMPLETED
}

enum TaskPriority {
  LOW
  MEDIUM
  HIGH
}
```

---

## API Design

### Authentication Flow

```
┌────────┐                    ┌────────┐                    ┌────────┐
│ Client │                    │ Server │                    │   DB   │
└───┬────┘                    └───┬────┘                    └───┬────┘
    │                             │                             │
    │  POST /api/auth/register    │                             │
    │────────────────────────────▶│                             │
    │  { email, password, name }  │                             │
    │                             │  Check email exists         │
    │                             │────────────────────────────▶│
    │                             │◀────────────────────────────│
    │                             │                             │
    │                             │  Hash password + Create     │
    │                             │────────────────────────────▶│
    │                             │◀────────────────────────────│
    │                             │                             │
    │  201 { user, accessToken }  │                             │
    │◀────────────────────────────│                             │
    │                             │                             │
    │  POST /api/auth/login       │                             │
    │────────────────────────────▶│                             │
    │  { email, password }        │                             │
    │                             │  Find user by email         │
    │                             │────────────────────────────▶│
    │                             │◀────────────────────────────│
    │                             │                             │
    │                             │  Verify password            │
    │                             │  Generate JWT               │
    │                             │                             │
    │  200 { user, accessToken }  │                             │
    │◀────────────────────────────│                             │
    │                             │                             │
```

### API Response Format

**Success Response:**
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  }
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Access denied to resource |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT` | 409 | Resource already exists |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## Frontend Architecture

### Component Hierarchy

```
App
├── AuthProvider (Context)
│   └── QueryClientProvider (React Query)
│       └── Router
│           ├── PublicRoutes
│           │   ├── LoginPage
│           │   └── RegisterPage
│           └── ProtectedRoutes
│               ├── Layout
│               │   ├── Navbar
│               │   └── Outlet
│               ├── DashboardPage
│               │   ├── TaskFilters
│               │   ├── TaskList
│               │   │   └── TaskCard[]
│               │   └── CreateTaskButton
│               ├── TaskDetailPage
│               │   └── TaskForm
│               └── CreateTaskPage
│                   └── TaskForm
```

### State Management Strategy

| State Type | Solution | Use Case |
|------------|----------|----------|
| **Server State** | React Query | Tasks data, user data from API |
| **Auth State** | Context API | User session, tokens |
| **UI State** | Local useState | Modals, form inputs, filters |
| **Form State** | React Hook Form | Form inputs, validation |

### Protected Routes Pattern

```tsx
// ProtectedRoute.tsx
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};
```

---

## Security Considerations

### Authentication

1. **Password Hashing**: bcrypt with cost factor 12
2. **JWT Tokens**: 
   - Access token: 15 minutes expiry
   - Refresh token: 7 days expiry (stored in httpOnly cookie)
3. **Token Storage**: 
   - Access token in memory (React state)
   - Refresh token in httpOnly cookie

### API Security

1. **CORS**: Whitelist allowed origins
2. **Rate Limiting**: 
   - Auth endpoints: 5 requests/minute
   - API endpoints: 100 requests/minute
3. **Input Validation**: Zod schemas on all endpoints
4. **SQL Injection**: Prevented by Prisma ORM
5. **XSS**: React's built-in escaping + CSP headers

### Security Headers (Helmet)

```typescript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));
```

---

## Performance Optimizations

### Frontend

1. **Code Splitting**: React.lazy for route-based splitting
2. **Memoization**: useMemo, useCallback for expensive operations
3. **Virtual Lists**: For large task lists (if needed)
4. **Image Optimization**: Lazy loading, WebP format
5. **Bundle Size**: Tree shaking, dynamic imports

### Backend

1. **Database Indexing**: On frequently queried columns
2. **Connection Pooling**: Prisma's built-in pooling
3. **Response Compression**: gzip/brotli
4. **Caching Strategy**: 
   - HTTP caching headers
   - React Query stale-while-revalidate

### Database

1. **Indexes**: 
   - `users.email` (unique)
   - `tasks.userId`
   - `tasks.status`
   - `tasks.userId + status` (composite)
2. **Query Optimization**: Select only needed fields

---

## Docker Architecture

### Container Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    Docker Compose Network                    │
│                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Frontend   │  │  Backend    │  │    PostgreSQL       │  │
│  │  (nginx)    │  │  (node)     │  │    (postgres:16)    │  │
│  │             │  │             │  │                     │  │
│  │  Port: 80   │  │  Port: 3000 │  │    Port: 5432       │  │
│  │             │  │             │  │                     │  │
│  │  Serves     │  │  API        │  │    Data Volume      │  │
│  │  React SPA  │  │  Server     │  │    Persistence      │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
│         │                │                    │              │
│         └────────────────┼────────────────────┘              │
│                          │                                   │
│                   Internal Network                           │
└─────────────────────────────────────────────────────────────┘
```

### Multi-Stage Builds

```dockerfile
# Frontend Dockerfile (multi-stage)
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

---

## CI/CD Pipeline

### GitHub Actions Workflow

```yaml
# Stages:
# 1. Lint & Type Check
# 2. Run Tests
# 3. Build Docker Images
# 4. Push to Registry (on main)
# 5. Deploy (optional)

Triggers:
  - Push to main/develop
  - Pull requests to main

Jobs:
  lint → test → build → deploy
```

### Pipeline Stages

| Stage | Actions | Triggers |
|-------|---------|----------|
| **Lint** | ESLint, Prettier check | All PRs |
| **Test** | Unit tests, Integration tests | All PRs |
| **Build** | Docker build, Type check | All PRs |
| **Push** | Push to container registry | Merge to main |
| **Deploy** | Deploy to staging/production | Manual/Auto |

---

## UI/UX Design Guidelines

### Color Palette

The application uses a sophisticated navy color palette that creates a professional, modern dark theme:

```css
:root {
  /* Primary Navy Palette (from hex.PNG) */
  --primary-950: #0D1B2A;  /* Darkest - main background */
  --primary-800: #1B263B;  /* Dark navy - card backgrounds */
  --primary-600: #415A77;  /* Slate blue - borders, interactive elements */
  --primary-400: #778DA9;  /* Muted blue-gray - secondary text */
  --primary-50: #E0E1DD;   /* Off-white - primary text */
  
  /* Extended Palette */
  --primary-900: #141E30;
  --primary-700: #344966;
  --primary-500: #5C7391;
  --primary-300: #8A95A5;
  --primary-200: #A8ADB5;
  --primary-100: #C6C9C4;
  
  /* Status Colors */
  --success: #10b981;
  --warning: #f59e0b;
  --error: #ef4444;
  
  /* Task Status Colors */
  --todo: #778DA9;         /* Uses primary-400 */
  --in-progress: #415A77;  /* Uses primary-600 */
  --completed: #10b981;    /* Emerald green */
  
  /* Priority Colors */
  --low: #778DA9;
  --medium: #f59e0b;
  --high: #ef4444;
}
```

#### Color Usage Guidelines

| Color | Hex | Usage |
|-------|-----|-------|
| **primary-950** | #0D1B2A | Main background, deepest surfaces |
| **primary-800** | #1B263B | Card backgrounds, elevated surfaces |
| **primary-600** | #415A77 | Borders, interactive elements, buttons |
| **primary-400** | #778DA9 | Secondary text, icons, muted content |
| **primary-50** | #E0E1DD | Primary text, headings, high contrast |

### Typography

- **Headings**: Inter or system-ui
- **Body**: Inter or system-ui
- **Monospace**: JetBrains Mono (for code/IDs)

### Responsive Breakpoints

```css
/* Mobile first */
sm: 640px   /* Small tablets */
md: 768px   /* Tablets */
lg: 1024px  /* Laptops */
xl: 1280px  /* Desktops */
2xl: 1536px /* Large screens */
```

---

## Testing Strategy

### Test Pyramid

```
          ┌─────────┐
          │   E2E   │  (Few - Critical paths)
         ─┴─────────┴─
        ┌─────────────┐
        │ Integration │  (Some - API endpoints)
       ─┴─────────────┴─
      ┌─────────────────┐
      │   Unit Tests    │  (Many - Functions, Components)
     ─┴─────────────────┴─
```

### Coverage Targets

| Type | Target | Focus |
|------|--------|-------|
| Unit | 80% | Utilities, Services, Components |
| Integration | 70% | API endpoints, DB operations |
| E2E | Critical paths | Auth flow, CRUD operations |

---


