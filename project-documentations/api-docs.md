# API Documentation

Base URL: `http://localhost:3000/api`

## Authentication Endpoints

### Register User

Register a new user account.

**Endpoint**: `POST /api/auth/register`

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "Password123",
  "name": "John Doe"
}
```

**Response** (201):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "name": "John Doe",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "User registered successfully"
}
```

### Login

Authenticate and receive access/refresh tokens.

**Endpoint**: `POST /api/auth/login`

**Request Body**:
```json
{
  "email": "demo@example.com",
  "password": "Password123"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "demo@example.com",
      "name": "Demo User"
    },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Login successful"
}
```

### Refresh Token

Get a new access token using refresh token.

**Endpoint**: `POST /api/auth/refresh`

**Request Body**:
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs..."
  },
  "message": "Token refreshed successfully"
}
```

### Get Current User

Get authenticated user profile.

**Endpoint**: `GET /api/auth/me`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "demo@example.com",
    "name": "Demo User",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Logout

Invalidate refresh token.

**Endpoint**: `POST /api/auth/logout`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

## Task Endpoints

All task endpoints require authentication (Bearer token in Authorization header).

### Get All Tasks

Get paginated list of tasks with optional filters.

**Endpoint**: `GET /api/tasks`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Query Parameters**:
- `page` (optional) - Page number (default: 1)
- `limit` (optional) - Items per page (default: 10)
- `status` (optional) - Filter by status: `TODO`, `IN_PROGRESS`, `DONE`
- `priority` (optional) - Filter by priority: `LOW`, `MEDIUM`, `HIGH`
- `search` (optional) - Search in title and description
- `sortBy` (optional) - Sort field: `createdAt`, `dueDate`, `priority` (default: `createdAt`)
- `sortOrder` (optional) - Sort order: `asc`, `desc` (default: `desc`)

**Example Request**:
```bash
GET /api/tasks?page=1&limit=10&status=TODO&priority=HIGH&sortBy=dueDate&sortOrder=asc
```

**Response** (200):
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "title": "Complete project",
      "description": "Finish the task management app",
      "status": "TODO",
      "priority": "HIGH",
      "dueDate": "2024-12-31T23:59:59.000Z",
      "userId": "uuid",
      "createdAt": "2024-01-01T00:00:00.000Z",
      "updatedAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 1,
    "totalPages": 1
  }
}
```

### Get Single Task

Get details of a specific task.

**Endpoint**: `GET /api/tasks/:id`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish the task management app",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

### Create Task

Create a new task.

**Endpoint**: `POST /api/tasks`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body**:
```json
{
  "title": "Complete project",
  "description": "Finish the task management app",
  "status": "IN_PROGRESS",
  "priority": "HIGH",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

**Validation Rules**:
- `title`: Required, 1-200 characters
- `description`: Optional, max 1000 characters
- `status`: Required, one of: `TODO`, `IN_PROGRESS`, `DONE`
- `priority`: Required, one of: `LOW`, `MEDIUM`, `HIGH`
- `dueDate`: Optional, must be a valid ISO date string

**Response** (201):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Complete project",
    "description": "Finish the task management app",
    "status": "IN_PROGRESS",
    "priority": "HIGH",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Task created successfully"
}
```

### Update Task

Update an existing task.

**Endpoint**: `PUT /api/tasks/:id`

**Headers**:
```
Authorization: Bearer <access_token>
Content-Type: application/json
```

**Request Body** (all fields optional):
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "DONE",
  "priority": "MEDIUM",
  "dueDate": "2024-12-31T23:59:59.000Z"
}
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Updated title",
    "description": "Updated description",
    "status": "DONE",
    "priority": "MEDIUM",
    "dueDate": "2024-12-31T23:59:59.000Z",
    "userId": "uuid",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-02T00:00:00.000Z"
  },
  "message": "Task updated successfully"
}
```

### Delete Task

Delete a task.

**Endpoint**: `DELETE /api/tasks/:id`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "success": true,
  "message": "Task deleted successfully"
}
```

### Get Task Statistics

Get statistics about user's tasks.

**Endpoint**: `GET /api/tasks/stats`

**Headers**:
```
Authorization: Bearer <access_token>
```

**Response** (200):
```json
{
  "success": true,
  "data": {
    "total": 10,
    "todo": 3,
    "inProgress": 4,
    "done": 3,
    "highPriority": 2,
    "overdue": 1
  }
}
```

---

## Error Responses

All endpoints may return error responses in the following format:

### Validation Error (400)
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### Unauthorized (401)
```json
{
  "success": false,
  "error": {
    "code": "UNAUTHORIZED",
    "message": "Invalid or expired token"
  }
}
```

### Not Found (404)
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Task not found"
  }
}
```

### Server Error (500)
```json
{
  "success": false,
  "error": {
    "code": "INTERNAL_ERROR",
    "message": "An unexpected error occurred"
  }
}
```

---

## Rate Limiting

Authentication endpoints are rate-limited to prevent abuse:
- `/api/auth/login`: 5 requests per 15 minutes per IP
- `/api/auth/register`: 3 requests per hour per IP

Other endpoints are not rate-limited but may be subject to general API rate limits in production.

---

## Authentication Flow

1. **Register** or **Login** to receive `accessToken` and `refreshToken`
2. Include `accessToken` in Authorization header: `Bearer <token>`
3. Access tokens expire in 15 minutes
4. Use `/api/auth/refresh` with `refreshToken` to get new access token
5. Refresh tokens expire in 7 days
6. On logout, refresh token is invalidated

---

## Testing with cURL

### Register
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Password123","name":"Test User"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@example.com","password":"Password123"}'
```

### Create Task
```bash
curl -X POST http://localhost:3000/api/tasks \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"My Task","status":"TODO","priority":"HIGH"}'
```

### Get Tasks
```bash
curl -X GET "http://localhost:3000/api/tasks?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

