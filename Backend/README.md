# LeaveManager — Backend API

The robust, secure, and modular RESTful backend engine powering the **LeaveManager** system. This service provides relational database persistence, dual-token JWT authentication, role-based authorization (RBAC), automatic payload structure validations, and standardized logical processing layers.

Built with **Node.js (ESM)**, **Express.js 5**, and **Prisma ORM** mapping to a **MariaDB/MySQL** database.

---

## 🚀 Key Features Implemented

* **Secure Authentication Engine:**
  - Standard cryptographic hashing of passwords using `bcrypt` (10 salt rounds).
  - Dual-token JWT security: signs short-lived **Access Tokens** for request authorizations, and long-lived **Refresh Tokens** stored in the database to govern state persistence.
  - Automatic `httpOnly`, secure cookie mapping alongside Authorization Header parsing fallback.
* **Role-Based Access Control (RBAC):**
  - Strict middleware guards (`verifyRole`) ensuring only validated `admin` roles can query organization-wide ledgers or process requests, while restricting employees to their personal records.
* **Dynamic Request Valdiation:**
  - Custom global validator middleware integrating **Joi** schemas to validate request bodies, query strings, and URL route parameters prior to executing controllers.
  - Auto-scrubbing of unvalidated parameters from payload inputs.
* **Granular Business Services:**
  - Ownership restriction checks preventing users from querying or editing records of other employees.
  - Immutability guards preventing updates or deletions of already-processed leave applications (status not `pending`).
* **Standardized REST Responses & Global Error Handler:**
  - Predictable API return structures using `ApiResponse` and custom extending `ApiError` class.
  - Global Express middleware catching application exceptions, formatting structural error payloads, and keeping server-level exception logs clean.

---

## 🛠️ Technology Stack

- **Server Runtime:** Node.js (with Native ESM `"type": "module"`)
- **API Engine:** Express.js 5.2.1
- **Database Client:** Prisma ORM 7.8.0 & `@prisma/client`
- **Database Adapter:** Prisma MariaDB Adapter (`@prisma/adapter-mariadb`)
- **Crypto & Security:** Bcrypt 6.0.0 & JsonWebToken 9.0.3
- **Validation Engine:** Joi 18.2.1
- **Developer Tools:** Nodemon 3.1.14 & Dotenv 17.4.2

---

## 📋 Comprehensive API Endpoint Ledger

### Public / Authentication Routes (`/api/v1/auth`)
* `POST /register` — Register a new employee (Defaults to `user` role). Checks email uniqueness.
* `POST /login` — Authenticate credentials. Writes secure cookies and signs JWTs.

### Employee Time-Off Routes (`/api/v1/leave`)
* *All endpoints below require standard user authentication.*
* `POST /` — Create a new leave request (Requires `user` role). Validates date chronologies.
* `GET /` — Retrieve all requests submitted by the logged-in employee (Requires `user` role, newest first).
* `PUT /:id` — Modify details of an existing pending request (Requires `user` role & resource ownership).
* `DELETE /:id` — Delete a pending request from database (Requires `user` role & resource ownership).

### Administrative Management Routes (`/api/v1/leave/admin`)
* *All endpoints below are strictly restricted to `admin` accounts.*
* `GET /all` — Retrieve organizational list of submitted leaves. Supports queries for status, start date, and end date.
* `GET /:id` — Retrieve detailed request info combined with employee contact profile.
* `PUT /:id` — Process request (Update status to `approved`/`canceled` and insert administrative remark text).

### Diagnostic Routes
* `GET /healthCheck` — Simple diagnostic health ping returning uptime and database adaptor status.

---

## 🗄️ Database Schema Design (`schema.prisma`)

The backend maps model structures to a MySQL/MariaDB database via Prisma ORM.

### Models
1. **`User` (Table: `users`)**
   - `id` (String, UUID, Primary Key)
   - `name` (String, max 55 characters)
   - `email` (String, max 150 characters, Unique Key)
   - `password` (String, Bcrypt hashed)
   - `role` (Enum: `user`, `admin`. Defaults to `user`)
   - `refresh_token` (String?, Nullable)
   - `access_token` (String?, Nullable)
   - `created_at` (DateTime, Defaults to `now()`)
   - `updated_at` (DateTime, Auto-updating timestamp)

2. **`LeaveRequest` (Table: `leave_requests`)**
   - `id` (String, UUID, Primary Key)
   - `user_id` (String, Foreign Key referencing `users.id` with `onDelete: Cascade`)
   - `date_from` (DateTime)
   - `date_to` (DateTime)
   - `reason` (String)
   - `status` (Enum: `pending`, `approved`, `canceled`. Defaults to `pending`)
   - `remark` (String?, Defaults to `""`)
   - `details` (String?, Nullable)
   - `created_at` (DateTime, Defaults to `now()`)
   - `updated_at` (DateTime, Auto-updating timestamp)

---

## 📥 Endpoint Payload & Response Spec

All API responses follow a structured, uniform format:
- **Success:** `{ "statusCode": Int, "success": true, "data": Object/Array, "message": String }`
- **Error:** `{ "success": false, "message": String, "errors": Array, "data": null }`

### 1. User Registration (`POST /api/v1/auth/register`)
- **Request Payload (Joi Validated):**
  ```json
  {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "securepassword123" // Minimum 8 characters
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "success": true,
    "data": {
      "id": "e679a781-a9f9-4c28-97fb-c5df5ea68574",
      "name": "Jane Doe",
      "email": "jane@example.com",
      "role": "user",
      "created_at": "2026-05-26T12:00:00.000Z",
      "updated_at": "2026-05-26T12:00:00.000Z"
    },
    "message": "User registered successfully"
  }
  ```

### 2. User Login (`POST /api/v1/auth/login`)
*Sets secure `httpOnly` cookies (`accessToken`, `refreshToken`) on client headers.*
- **Request Payload (Joi Validated):**
  ```json
  {
    "email": "jane@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response (200 OK):**
  ```json
  {
    "statusCode": 200,
    "success": true,
    "data": {
      "user": {
        "id": "e679a781-a9f9-4c28-97fb-c5df5ea68574",
        "name": "Jane Doe",
        "email": "jane@example.com",
        "role": "user",
        "created_at": "2026-05-26T12:00:00.000Z",
        "updated_at": "2026-05-26T12:00:00.000Z"
      },
      "accessToken": "eyJhbGciOiJIUzI1...",
      "refreshToken": "eyJhbGciOiJIUzI1..."
    },
    "message": "User logged in successfully"
  }
  ```

### 3. Create Leave Request (`POST /api/v1/leave/`)
*Requires authentication. Role: `user`.*
- **Request Payload (Joi Validated):**
  ```json
  {
    "date_from": "2026-06-01", // ISO date string, cannot be in past
    "date_to": "2026-06-05",   // ISO date string, must be >= date_from
    "reason": "Annual Vacation",
    "details": "Traveling out of country" // Optional
  }
  ```
- **Success Response (201 Created):**
  ```json
  {
    "statusCode": 201,
    "success": true,
    "data": {
      "id": "e81d77a0-0089-4993-85b4-d5a25e2e84c9",
      "user_id": "e679a781-a9f9-4c28-97fb-c5df5ea68574",
      "date_from": "2026-06-01T00:00:00.000Z",
      "date_to": "2026-06-05T00:00:00.000Z",
      "reason": "Annual Vacation",
      "details": "Traveling out of country",
      "status": "pending",
      "remark": "",
      "created_at": "2026-05-26T12:10:00.000Z",
      "updated_at": "2026-05-26T12:10:00.000Z"
    },
    "message": "Leave request created successfully"
  }
  ```

### 4. Update Leave Request (`PUT /api/v1/leave/:id`)
*Requires authentication. Role: `user`. Ownership check and pending-only check.*
- **Request Payload (Joi Validated):**
  *(Must contain at least 1 field. If date fields are sent, BOTH `date_from` and `date_to` must be present)*
  ```json
  {
    "reason": "Family Medical Request"
  }
  ```
- **Success Response (200 OK):** Returns the fully updated leave request record payload.

### 5. Admin Decision (`PUT /api/v1/leave/admin/:id`)
*Requires authentication. Role: `admin`.*
- **Request Payload (Joi Validated):**
  ```json
  {
    "status": "approved", // Must be "approved" or "canceled"
    "remark": "Approved, enjoy your vacation!" // Optional text remark
  }
  ```
- **Success Response (200 OK):** Returns the processed leave request record payload showing the updated status and custom remarks.

---

## 📁 Directory Structure

```
Backend/
├── prisma/
│   ├── migrations/         # Database migrations history log files
│   └── schema.prisma       # Prisma client generator, database config, and model maps
├── src/
│   ├── controller/         # Request handling, data transformation, and response returning
│   │   ├── admin.controller.js
│   │   ├── auth.controller.js
│   │   ├── employee.controller.js
│   │   └── health.controller.js
│   ├── middleware/         # Security guards and payload structural validation hooks
│   │   ├── auth.middleware.js
│   │   └── validate.middleware.js
│   ├── routers/            # API router and path configurations
│   │   ├── auth.router.js
│   │   ├── healthCheck.router.js
│   │   └── leaveApplication.router.js
│   ├── services/           # Reusable core database transactional services
│   │   ├── admin.service.js
│   │   ├── auth.service.js
│   │   └── employee.service.js
│   ├── utilities/          # Global classes and utility instances
│   │   ├── api-error.js
│   │   ├── api-response.js
│   │   ├── async-handler.js
│   │   ├── env.js
│   │   └── prisma-client.js
│   ├── validations/        # Joi schema models checking client inputs
│   │   ├── admin.validation.js
│   │   ├── auth.validation.js
│   │   └── leave.validation.js
│   ├── app.js              # Express routing definitions and error interceptor
│   └── server.js           # Main listener startup file
├── .env                    # Environment variables configuration file
├── .gitignore              # Patterns for files/directories to ignore in Git
├── Docker-compose.yml      # Multi-container Docker app orchestrator configuration
├── package-lock.json       # Dependency tree lock file
├── package.json            # Node.js project manifest & scripts definition
├── prisma.config.ts        # Prisma ORM adapter and system config
└── README.md               # Backend system developer guide
```

---

## 💻 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) installed on your machine.
- A running [MariaDB](https://mariadb.org/) or [MySQL](https://www.mysql.com/) database service.

### Installation Steps

1. **Navigate into the directory:**
   ```bash
   cd Backend
   ```

2. **Install all required dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables (`.env`):**
   Create a `.env` file in the root of the `/Backend` directory and define your parameters:
   ```env
   PORT=8000
   DATABASE_URL="mysql://username:password@localhost:port/database_name?allowPublicKeyRetrieval=true"
   ACCESS_TOKEN_SECRET=your_super_secret_access_key
   ACCESS_TOKEN_EXPIRY=1d
   REFRESH_TOKEN_SECRET=your_super_secret_refresh_key
   REFRESH_TOKEN_EXPIRY=10d
   ```

4. **Initialize database schema & Prisma Client:**
   ```bash
   # Generate Prisma client locally
   npm run db:generate

   # Synchronize models onto your relational database
   npm run db:push
   ```

5. **Launch development server:**
   ```bash
   npm run dev
   ```
   The backend dev server will spin up and listen on port `8000` (e.g. `http://localhost:8000`).

---

## ⚙️ Prisma Scripts Reference

* `npm run db:generate` — Compiles and builds custom type-safe client models.
* `npm run db:push` — Proactively syncs schema adjustments directly into local DB.
* `npm run db:migrate` — Configures standard incremental migration histories.
