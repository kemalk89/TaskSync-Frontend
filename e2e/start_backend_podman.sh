#!/bin/bash

rm -rf e2e/tmp-api
mkdir e2e/tmp-api

cd e2e/tmp-api

git clone https://github.com/kemalk89/TaskSync.git
cd TaskSync

podman stop tasksync-backend
podman rm tasksync-backend
podman compose up -d
podman build -t tasksync-backend -f Dockerfile .
podman run -d --name tasksync-backend \
    -e Auth__MetadataAddress=http://host.docker.internal:3002/.well-known/openid-configuration \
    -e Auth__Authority=http://host.docker.internal:3002 \
    -e Auth__Audience=https://tasksync.api.de/api \
    -e Auth__MachineToMachineApplication__Domain=http://host.docker.internal:3002 \
    -e Auth__MachineToMachineApplication__ClientId=tasksync_e2e \
    -e Auth__MachineToMachineApplication__ClientSecret=any \
    -e LocalAuth__JwtSecret=any \
    -e ASPNETCORE_ENVIRONMENT=Development \
    -e ConnectionStrings__db="Host=host.docker.internal;Port=5432;Database=postgres;Username=postgres;Password=postgres" \
    -p 8080:8080 \
    tasksync-backend