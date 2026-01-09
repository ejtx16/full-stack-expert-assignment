# Full-Stack Developer Assessment

## Project: Task Management Application

---

## Overview

This technical assessment evaluates proficiency in **full-stack development**, encompassing frontend and backend development, database design, containerization, and CI/CD implementation. The project requires building a production-ready task management web application with modern architecture and best practices.

**Estimated Duration:** 2-3 days (Maximum: 1 week from assignment date)

---

## Technical Requirements

### 1. User Authentication & Authorization

| Requirement | Description |
|-------------|-------------|
| **Authentication Method** | JWT-based authentication with secure token management |
| **User Registration** | Email/password signup with validation |
| **Session Management** | Secure login/logout with token refresh mechanism |
| **Authorization** | Role-based access control ensuring users can only access their own resources |

**Security Considerations:**
- Password hashing using industry-standard algorithms (bcrypt recommended)
- Secure token storage and transmission
- Protection against common vulnerabilities (XSS, CSRF, SQL Injection)

---

### 2. Task Management (CRUD Operations)

| Operation | Description | Access Control |
|-----------|-------------|----------------|
| **Create** | Users can create new tasks with title, description, status, priority, and due date | Authenticated users only |
| **Read** | View individual tasks or paginated task lists with filtering/sorting | Own tasks only |
| **Update** | Modify task details including status transitions | Own tasks only |
| **Delete** | Remove tasks permanently | Own tasks only |

**Task Properties:**
- Title (required, max 200 characters)
- Description (optional, max 1000 characters)
- Status: `TODO` | `IN_PROGRESS` | `DONE`
- Priority: `LOW` | `MEDIUM` | `HIGH`
- Due Date (optional)
- Timestamps (created/updated)

---

### 3. Frontend Development

| Aspect | Requirements |
|--------|--------------|
| **Framework** | React, Vue.js, or Angular |
| **State Management** | Redux, Vuex, Context API, or React Query |
| **Styling** | Responsive design (mobile-first approach recommended) |
| **Forms** | Client-side validation with user-friendly error messages |
| **UX** | Loading states, error handling, and intuitive navigation |

**Recommended Implementations:**
- Component-based architecture
- TypeScript for type safety
- Modern CSS (Tailwind CSS, styled-components, or CSS Modules)
- Accessibility compliance (WCAG guidelines)

---

### 4. Backend Development

| Aspect | Requirements |
|--------|--------------|
| **Runtime/Framework** | Node.js (Express.js) or Python (Django/FastAPI) |
| **API Design** | RESTful endpoints following HTTP conventions |
| **Validation** | Request body validation with descriptive error messages |
| **Error Handling** | Consistent error response format with appropriate HTTP status codes |

**API Response Format:**
```json
// Success Response
{
  "success": true,
  "data": { ... },
  "message": "Operation successful"
}

// Error Response
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": [ ... ]
  }
}
```

---

### 5. Database Management

| Aspect | Requirements |
|--------|--------------|
| **Database** | PostgreSQL, MySQL, or MongoDB |
| **ORM/ODM** | Sequelize, Prisma, Mongoose, or equivalent |
| **Migrations** | Version-controlled schema migrations |
| **Seed Data** | Database seed scripts for initial setup and testing |

**Schema Considerations:**
- Proper indexing on frequently queried fields
- Referential integrity constraints
- Audit timestamps on all entities

---

### 6. Containerization & DevOps

| Component | Requirements |
|-----------|--------------|
| **Docker** | Dockerfiles for both frontend and backend |
| **Docker Compose** | Multi-service orchestration for local development |
| **CI/CD Pipeline** | Automated builds, tests, and deployments |

**CI/CD Requirements:**
- Automated linting and type checking
- Unit and integration test execution
- Docker image building and verification
- Deployment automation (GitHub Actions, GitLab CI/CD, or Jenkins)

---

## Bonus Features (Optional but Preferred)

| Feature | Description | Complexity |
|---------|-------------|------------|
| **Task Notifications** | WebSocket, email, or push notification alerts | Medium |
| **Unit/Integration Tests** | Jest, Mocha, PyTest, or equivalent | Medium |
| **Cloud Deployment** | Deploy to AWS, GCP, Azure, or Render | High |
| **Kubernetes** | Container orchestration with K8s | Advanced |

---

## Submission Requirements

### Repository Setup
- [ ] Public GitHub repository (or provide collaborator access)
- [ ] Clean commit history with meaningful messages
- [ ] `.gitignore` configured appropriately
- [ ] No sensitive data (secrets, credentials) in repository

### Documentation (README.md)
- [ ] **Project Overview** - Brief description of the application
- [ ] **Tech Stack** - Technologies used with versions
- [ ] **Setup Instructions** - Step-by-step local development setup
- [ ] **API Documentation** - Endpoint details with request/response examples
- [ ] **Architecture Decisions** - Key technical choices and rationale
- [ ] **Environment Variables** - Required configuration (with `.env.example`)

### Code Quality
- [ ] Consistent code formatting (Prettier, ESLint)
- [ ] TypeScript strict mode (if applicable)
- [ ] No console errors or warnings
- [ ] Responsive design tested on multiple viewports

---

## Evaluation Criteria

| Category | Weight | Key Aspects |
|----------|--------|-------------|
| **Code Quality** | 25% | Clean, modular, maintainable code; SOLID principles; DRY |
| **Frontend Implementation** | 20% | UI/UX design; state management; responsiveness; accessibility |
| **Backend API Design** | 20% | Security; efficiency; error handling; RESTful conventions |
| **Database Design** | 15% | Schema optimization; indexing; query efficiency; ORM usage |
| **DevOps & CI/CD** | 15% | Docker configuration; pipeline automation; deployment readiness |
| **Documentation** | 5% | Setup clarity; API docs; technical decisions |

### Scoring Guidelines

| Score | Description |
|-------|-------------|
| **Excellent** | Exceeds requirements with production-ready quality |
| **Good** | Meets all requirements with clean implementation |
| **Satisfactory** | Meets core requirements with minor issues |
| **Needs Improvement** | Missing requirements or significant issues |

---

## Technical Stack Reference

For reference, a recommended modern stack includes:

| Layer | Technology Options |
|-------|-------------------|
| **Frontend** | React 18+ / Vue 3+ / Angular 17+ |
| **Build Tool** | Vite / Webpack / Turbopack |
| **Styling** | Tailwind CSS / styled-components / CSS Modules |
| **State** | React Query / Redux Toolkit / Pinia / Zustand |
| **Backend** | Express.js / NestJS / FastAPI / Django REST |
| **Database** | PostgreSQL / MySQL / MongoDB |
| **ORM** | Prisma / Sequelize / TypeORM / Mongoose |
| **Auth** | JWT / Passport.js / OAuth 2.0 |
| **Container** | Docker + Docker Compose |
| **CI/CD** | GitHub Actions / GitLab CI / Jenkins |

---

## Questions & Support

For clarification on requirements or technical questions, please reach out to the assessment coordinator.

**Good luck!** We look forward to reviewing your implementation.

---

<sub>*Assessment Version 1.0 | Last Updated: January 2026*</sub>
