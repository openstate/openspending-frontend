#!/usr/bin/env bash
ssh Neon mkdir /home/projects/openspending/openspending-frontend/.svelte-kit 2>/dev/null
scp .svelte-kit/tsconfig.json Neon:/home/projects/openspending/openspending-frontend/.svelte-kit
ssh Neon /bin/bash << EOF
cd /home/projects/openspending/openspending-frontend
git pull
sudo docker compose down
sudo docker compose up -d --build
EOF
