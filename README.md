[![build project](https://github.com/kemalk89/TaskSync-Frontend/actions/workflows/node.js.yml/badge.svg)](https://github.com/kemalk89/TaskSync-Frontend/actions/workflows/node.js.yml)
[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=kemalk89_TaskSync-Frontend&metric=alert_status)](https://sonarcloud.io/summary/new_code?id=kemalk89_TaskSync-Frontend)

---

<h1 align="center">
    <img src="./apps/web/public/images/logo.svg" width="84" height="84" /> 
    <br> 
    TaskSync
</h1>

A lightweight task management solution for software development teams. This repository contains the frontend part of the application. For the backend services, refer to the companion repository: https://github.com/kemalk89/TaskSync.

---

# ✅ Features

- Manage projects and work items
- Manage your documents ⏳
- Organize work in sprints
- Fast and responsive UI

# 💻 Development

1. Start the application `npm run dev`
2. Start the backend `sh e2e/start_backend_docker.sh` or `sh e2e/start_backend_podman.sh`
3. Open the application: http://localhost:3000/

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

Prepare the environment variables in your `apps/web/.env.local` by uncommenting the vars in the section e2e.
Also, change `RESOURCE_SERVER_RUNTIME_ENGINE` in `apps/fake-auth/.env.local` to podman if using podman. If using
docker, comment it out.

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
