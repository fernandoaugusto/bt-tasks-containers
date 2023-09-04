# BT Tasks 

This application is running over Docker Compose.
The file .env is present in the application in order to make easier the project presentation.

## Instruções para Execução

### Build

1. **Build using Docker Compose:**

Execute from terminal:

```bash
docker-compose build
```
```bash
docker-compose up
```

### Tests E2E

2. **Running Tests End-to-End (E2E):**

First of all, check if bt-tasks service is not running in Docker.
You must to keep running the Postgres service.

Execute from terminal:

```bash
cd bt-tasks
npm run test:e2e
```
