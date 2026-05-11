# Three-Tier Production-Style Demo Application

A standalone app with:
- **Frontend**: JavaScript React app (`frontend/`)
- **Backend**: Java Spring Boot API (`backend/`)
- **Database**: MySQL (local install or AWS RDS)

This repository is designed so you can run locally for testing and then run on AWS EC2 for demonstration.

## Architecture

- Frontend calls backend via `/api/*` and uses a localhost proxy in development.
- Backend exposes REST APIs and connects to MySQL using **environment variables**.
- Flyway migration creates the database table on startup.
- One endpoint intentionally fails for resilience/error-path demos:
  - `GET /api/v1/tasks/fail`

## Backend services (3 services)

- `TaskReadService`: query/read operations
- `TaskWriteService`: create/update/delete operations
- `FailureSimulationService`: intentional failure function

## Standardized logging

Both frontend and backend logs share a consistent structure with these fields:
- `timestamp`
- `level`
- `service`
- `requestId`
- `logger`
- `message`

The frontend sends `X-Request-ID`, and backend echoes it in responses and logs.

## Prerequisites

- Java 17
- Maven
- Node.js 20+
- npm
- MySQL 8+

Helper scripts:
- Fedora 41 setup: `scripts/setup-fedora41.sh`
- Amazon Linux 2 setup: `scripts/setup-amazon-linux2.sh`

## Local setup (Fedora + local MySQL)

1. Install dependencies:
   ```bash
   ./scripts/setup-fedora41.sh
   ```
2. Initialize MySQL DB/user:
   ```bash
   mysql -u root -p < scripts/init-local-mysql.sql
   ```
3. Backend env:
   ```bash
   cp backend/.env.example backend/.env
   ```
4. Frontend env:
   ```bash
   cp frontend/.env.example frontend/.env
   ```
5. Install frontend deps:
   ```bash
   cd frontend && npm install
   ```
6. Start backend (terminal 1):
   ```bash
   ./scripts/run-backend.sh
   ```
7. Start frontend (terminal 2):
   ```bash
   ./scripts/run-frontend.sh
   ```
8. Open app:
   - `http://localhost:5173`

## AWS demo setup (EC2 Amazon Linux 2 + RDS)

1. Install dependencies on EC2:
   ```bash
   ./scripts/setup-amazon-linux2.sh
   ```
2. Configure backend env for RDS:
   ```bash
   cp backend/.env.example backend/.env
   ```
   Edit `backend/.env` with RDS endpoint and credentials:
   - `DB_HOST=<your-rds-endpoint>`
   - `DB_PORT=3306`
   - `DB_NAME=<db-name>`
   - `DB_USER=<db-user>`
   - `DB_PASSWORD=<db-password>`
   - `DB_USE_SSL=true`
   - `DB_REQUIRE_SSL=true`
   - `DB_VERIFY_SERVER_CERTIFICATE=false` (toggle as needed)
3. Configure frontend proxy target (same EC2 host):
   ```bash
   cp frontend/.env.example frontend/.env
   ```
   Keep:
   - `VITE_BACKEND_PROXY_TARGET=http://localhost:8080`
4. Install frontend deps:
   ```bash
   cd frontend && npm install
   ```
5. Run backend and frontend with scripts above.

## API summary

- `GET /api/v1/tasks`
- `POST /api/v1/tasks`
- `PATCH /api/v1/tasks/{id}/toggle`
- `DELETE /api/v1/tasks/{id}`
- `GET /api/v1/tasks/fail` (intentional failure)

## Notes

- DB config is fully env-driven to switch between local MySQL and AWS RDS.
- Frontend and backend can run on the same machine in both local and EC2 demos.
- For production serving of frontend static assets, you can build via `npm run build` and serve with Nginx or S3/CloudFront.
