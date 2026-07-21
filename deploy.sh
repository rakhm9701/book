#!/bin/sh
set -eu

cd "$(dirname "$0")"

BRANCH="${DEPLOY_BRANCH:-master}"

git fetch origin "$BRANCH"
git checkout -B "$BRANCH" "origin/$BRANCH"
git reset --hard "origin/$BRANCH"

cleanup_docker() {
	docker image prune -f || true
	docker builder prune -f || true
}

if docker compose version >/dev/null 2>&1; then
	docker compose up -d --build
	docker compose ps
elif command -v docker-compose >/dev/null 2>&1; then
	docker-compose up -d --build
	docker-compose ps
else
	echo "Docker Compose is not installed"
	exit 1
fi

cleanup_docker
