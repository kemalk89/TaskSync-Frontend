![build project](https://github.com/kemalk89/TaskSync-Frontend/actions/workflows/node.js.yml/badge.svg)

[![Quality gate](https://sonarcloud.io/api/project_badges/quality_gate?project=kemalk89_TaskSync-Frontend)](https://sonarcloud.io/summary/new_code?id=kemalk89_TaskSync-Frontend)

# Development
1. Start the application ```npm run dev```
2. Open the application: http://localhost:3000/

# Build
Always run a build before pushing code.
```sh
npm run build
```

# E2E Testing
## Prerequisites
Start the application.
## Run tests
```sh
npm run test:e2e
# with UI
npm run test:e2e -- --ui
```
Ensure, the API is running with environment variables configured in node.js.yml (step "Start .NET Backend with Docker").
## After tests
Terminate the application.
