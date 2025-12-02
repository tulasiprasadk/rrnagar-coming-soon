#!/usr/bin/env bash
# Safe deploy script for a Vite frontend (rsync over SSH)
# Usage:
#   ./deploy.sh --host user@server --remote-path /var/www/site --build "npm ci && npm run build" --build-dir dist --migrate ""
# Supports --dry-run to preview rsync.
#
# SECURITY NOTE: This script executes user-provided build and migrate commands.
# Only run with trusted input in a controlled environment.
set -euo pipefail

DRY_RUN=false
SSH_HOST=""
REMOTE_PATH=""
BUILD_CMD="npm ci && npm run build"
BUILD_DIR="dist"
MIGRATE_CMD=""

RSYNC_EXCLUDES=(".git" "node_modules" "vendor" ".env" "backups" "dist/.DS_Store")

function usage() {
  cat <<EOF
Usage: $0 [options]

Options:
  --host <user@server>     SSH host to deploy to (required)
  --remote-path <path>     Remote path to deploy to (required)
  --build <cmd>            Build command (default: "npm ci && npm run build")
  --build-dir <dir>        Build output directory (default: dist)
  --migrate <cmd>          Migration command to run after deploy (optional)
  --dry-run                Preview rsync without making changes
  -h, --help               Show this help message
EOF
}

while [[ $# -gt 0 ]]; do
  case $1 in
    --host)
      SSH_HOST="$2"
      shift 2
      ;;
    --remote-path)
      REMOTE_PATH="$2"
      shift 2
      ;;
    --build)
      BUILD_CMD="$2"
      shift 2
      ;;
    --build-dir)
      BUILD_DIR="$2"
      shift 2
      ;;
    --migrate)
      MIGRATE_CMD="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      usage
      exit 1
      ;;
  esac
done

if [[ -z "$SSH_HOST" || -z "$REMOTE_PATH" ]]; then
  echo "Error: --host and --remote-path are required"
  usage
  exit 1
fi

echo "==> Building project..."
eval "$BUILD_CMD"

if [[ ! -d "$BUILD_DIR" ]]; then
  echo "Error: Build directory '$BUILD_DIR' not found"
  exit 1
fi

RSYNC_OPTS=(-avz --delete)
for exclude in "${RSYNC_EXCLUDES[@]}"; do
  RSYNC_OPTS+=(--exclude "$exclude")
done

if $DRY_RUN; then
  RSYNC_OPTS+=(--dry-run)
  echo "==> Dry run mode enabled"
fi

echo "==> Deploying to $SSH_HOST:$REMOTE_PATH..."
rsync "${RSYNC_OPTS[@]}" "$BUILD_DIR/" "$SSH_HOST:$REMOTE_PATH/"

if [[ -n "$MIGRATE_CMD" ]]; then
  echo "==> Running migration command..."
  ssh "$SSH_HOST" "cd $REMOTE_PATH && $MIGRATE_CMD"
fi

echo "==> Deploy complete!"
