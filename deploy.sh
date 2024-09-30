#!/usr/bin/env bash
ssh Neon mkdir /home/projects/openspending/openspending-frontend/.svelte-kit 2>/dev/null
scp .svelte-kit/tsconfig.json Neon:/home/projects/openspending/openspending-frontend/.svelte-kit
ssh Neon rm -rf /home/projects/openspending/openspending-frontend/src  && \
rsync -Cavz --exclude-from=.gitignore --exclude .git .  Neon:/home/projects/openspending/openspending-frontend/ && \
ssh Neon sudo docker compose --project-directory /home/projects/openspending/openspending-frontend down && \
ssh Neon sudo docker compose --project-directory /home/projects/openspending/openspending-frontend up -d --build
