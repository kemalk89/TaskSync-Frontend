![build project](https://github.com/kemalk89/TaskSync-Frontend/actions/workflows/node.js.yml/badge.svg)

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=kemalk89_TaskSync-Frontend)](https://sonarcloud.io/summary/new_code?id=kemalk89_TaskSync-Frontend)

# TaskSync

A lightweight task management solution for software development teams. This repository contains the frontend part of the application. For the backend services, refer to the companion repository: https://github.com/kemalk89/TaskSync.

---

# Development

1. Start the application `npm run dev`
2. Open the application: http://localhost:3000/

## Build

Always run a build before pushing code.

```sh
npm run build
```

## E2E Testing

In the context of E2E testing, we use apps/fake-auth, which is a fake OAuth server. 
The idea is that Playwright starts both the web application and the fake-auth service, 
with both running on the host machine. 
To quickly spin up the backend, use Docker or Podman.

### Prerequisites

Prepare the environment variables in your apps/web/.env.test.

Ensure, the backend API is running:

```sh
sh e2e/start_backend_docker.sh # or sh e2e/start_backend_podman.sh
```

### Run tests

```sh
npm run test:e2e
# with UI
npm run test:e2e -- --ui
```
