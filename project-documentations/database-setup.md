# PostgreSQL Development Setup Guide

This guide explains how to set up PostgreSQL for local development using Docker.

---

## Prerequisites

- **Docker Desktop** installed and running
  - Download from [docker.com](https://www.docker.com/products/docker-desktop)
- **Node.js 20+** installed
- **npm** or **yarn** package manager

---

## Quick Start

### 1. Create Environment File

Copy the example environment file:

```bash
cd backend
cp env.example .env
```

The `.env` file should contain:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/taskmanager?schema=public"
```

### 2. Start PostgreSQL

From the project root directory:

```bash
docker-compose -f docker-compose.dev.yml up db -d
```

### 3. Run Migrations

```bash
cd backend
npm install
npx prisma migrate dev
```

### 4. Verify Setup

```bash
npx prisma studio
```

Open `http://localhost:5555` to view your database.

---

## Configuration Details

### Connection String

| Component | Value |
|-----------|-------|
| Host | `localhost` |
| Port | `5433` |
| User | `postgres` |
| Password | `postgres` |
| Database | `taskmanager` |
| Schema | `public` |

**Full Connection String:**
```
postgresql://postgres:postgres@localhost:5433/taskmanager?schema=public
```

### Docker Container

| Setting | Value |
|---------|-------|
| Container Name | `taskmanager-db-dev` |
| Image | `postgres:16-alpine` |
| External Port | `5433` |
| Internal Port | `5432` |
| Volume | `postgres_data_dev` |

> **Note:** Port 5433 is used instead of the default 5432 to avoid conflicts with local PostgreSQL installations.

---

## Database Schema

The database includes two main tables:

### User Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| email | String | Unique email address |
| password | String | Hashed password |
| name | String | User's display name |
| createdAt | DateTime | Account creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Task Table

| Column | Type | Description |
|--------|------|-------------|
| id | UUID | Primary key |
| title | String(255) | Task title |
| description | Text | Optional description |
| status | Enum | TODO, IN_PROGRESS, COMPLETED |
| priority | Enum | LOW, MEDIUM, HIGH |
| dueDate | DateTime | Optional due date |
| createdAt | DateTime | Creation timestamp |
| updatedAt | DateTime | Last update timestamp |
| userId | UUID | Foreign key to User |

---

## Common Commands

### Docker Commands

| Action | Command |
|--------|---------|
| Start PostgreSQL | `docker-compose -f docker-compose.dev.yml up db -d` |
| Stop PostgreSQL | `docker-compose -f docker-compose.dev.yml stop db` |
| Stop and remove container | `docker-compose -f docker-compose.dev.yml down` |
| Stop and remove with data | `docker-compose -f docker-compose.dev.yml down -v` |
| View logs | `docker-compose -f docker-compose.dev.yml logs db` |
| Follow logs | `docker-compose -f docker-compose.dev.yml logs -f db` |
| Check status | `docker ps --filter "name=taskmanager-db-dev"` |

### Prisma Commands

| Action | Command |
|--------|---------|
| Run migrations | `npx prisma migrate dev` |
| Create migration | `npx prisma migrate dev --name <name>` |
| Reset database | `npx prisma migrate reset` |
| Generate client | `npx prisma generate` |
| Open Prisma Studio | `npx prisma studio` |
| Seed database | `npm run seed` |
| View schema | `npx prisma db pull` |

### Direct Database Access

Connect to PostgreSQL via psql:

```bash
docker exec -it taskmanager-db-dev psql -U postgres -d taskmanager
```

Common psql commands:
- `\dt` - List tables
- `\d+ <table>` - Describe table
- `\q` - Quit

---

## Troubleshooting

### Port Already in Use

**Error:** `bind: address already in use`

**Solution:** Check what's using port 5433:
```bash
# Windows
netstat -ano | findstr ":5433"

# Linux/Mac
lsof -i :5433
```

If you have a local PostgreSQL using port 5432, the Docker container is configured to use 5433 to avoid conflicts.

### Connection Refused

**Error:** `Connection refused` or `ECONNREFUSED`

**Solutions:**
1. Ensure Docker Desktop is running
2. Check container status: `docker ps`
3. Wait for container to be healthy (may take 10-15 seconds)
4. Verify the port in your `.env` matches the docker-compose port

### Authentication Failed

**Error:** `password authentication failed for user "postgres"`

**Solutions:**
1. Verify credentials match docker-compose.dev.yml:
   - User: `postgres`
   - Password: `postgres`
2. Reset the container:
   ```bash
   docker-compose -f docker-compose.dev.yml down -v
   docker-compose -f docker-compose.dev.yml up db -d
   ```

### Migration Issues

**Error:** `P1001: Can't reach database server`

**Solutions:**
1. Ensure PostgreSQL container is running and healthy
2. Check DATABASE_URL in `.env` file
3. Wait a few seconds after starting the container

---

## Running Full Stack with Docker

To run the entire application (database, backend, frontend) in Docker:

```bash
docker-compose -f docker-compose.dev.yml up
```

This starts:
- PostgreSQL on port `5433`
- Backend API on port `3000`
- Frontend on port `5173`

> **Note:** When running the backend inside Docker, it uses `db:5432` as the host (internal Docker network), not `localhost:5433`.

---

## Data Persistence

Database data is persisted in a Docker volume named `postgres_data_dev`. This means:

- Data survives container restarts
- Data survives `docker-compose down`
- Data is **deleted** with `docker-compose down -v`

To backup your data:
```bash
docker exec taskmanager-db-dev pg_dump -U postgres taskmanager > backup.sql
```

To restore:
```bash
cat backup.sql | docker exec -i taskmanager-db-dev psql -U postgres -d taskmanager
```

---

## Environment-Specific URLs

| Environment | DATABASE_URL |
|-------------|--------------|
| Local development (backend outside Docker) | `postgresql://postgres:postgres@localhost:5433/taskmanager?schema=public` |
| Docker development (backend inside Docker) | `postgresql://postgres:postgres@db:5432/taskmanager?schema=public` |

The docker-compose file automatically sets the correct URL for containerized services.

