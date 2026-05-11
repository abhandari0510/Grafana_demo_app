# Backend (Java + Spring Boot)

This backend is split into **3 services**:
- `TaskReadService` for read/query operations.
- `TaskWriteService` for create/update/delete operations.
- `FailureSimulationService` for the intentional failure endpoint.

## API Endpoints
- `GET /api/v1/tasks` - list tasks.
- `POST /api/v1/tasks` - create task.
- `PATCH /api/v1/tasks/{id}/toggle` - toggle completion status.
- `DELETE /api/v1/tasks/{id}` - delete task.
- `GET /api/v1/tasks/fail` - intentionally throws a server error (for demo/testing).

## Run
1. Copy env template:
   ```bash
   cp .env.example .env
   ```
2. Export envs from `.env`:
   ```bash
   set -a
   source .env
   set +a
   ```
3. Start app:
   ```bash
   mvn spring-boot:run
   ```

## Build artifact
```bash
mvn clean package -DskipTests
java -jar target/three-tier-backend-1.0.0.jar
```

## Logging
Backend logs are emitted in a structured JSON-like line format with these standard fields:
- `timestamp`
- `level`
- `service`
- `requestId`
- `logger`
- `message`

The backend accepts `X-Request-ID` and echoes it back in the response for traceability.

For AWS RDS TLS tuning, use:
- `DB_USE_SSL`
- `DB_REQUIRE_SSL`
- `DB_VERIFY_SERVER_CERTIFICATE`
