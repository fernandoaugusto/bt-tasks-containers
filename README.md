# BT Tasks 

This application is running over Docker Compose.
The file .env is present in the application in order to make easier the project presentation.

## Instructions

### Build

**Build using Docker Compose:**

Execute from terminal:

```bash
docker compose build
```
```bash
docker compose up
```

### Tests E2E

**Running Tests End-to-End (E2E):**

First of all, check if bt-tasks service is not running in Docker.
You must to keep running the Postgres service.

If you are in project root folder, execute from terminal these commands:

```bash
cd bt-tasks
npm run test:e2e
```
