#!/usr/bin/env bash
# Safe deploy script for a Vite frontend (rsync over SSH)
# Usage:
#   ./deploy.sh --host user@server --remote-path /var/www/site --build "npm ci && npm run build" --build-dir dist --migrate ""
# Supports --dry-run to preview rsync.
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
Usage: $0 [OPTIONS]

Deploy a Vite project to a remote server via rsync over SSH.

Options:
  --host HOST          SSH host (e.g., user@server)
  --remote-path PATH   Remote directory to deploy to (e.g., /var/www/site)
  --build CMD          Build command (default: "npm ci && npm run build")
  --build-dir DIR      Local build output directory (default: dist)
  --migrate CMD        Optional migration command to run on remote after deploy
  --dry-run            Preview rsync without making changes
  -h, --help           Show this help message

Example:
  $0 --host deploy@example.com --remote-path /var/www/mysite --dry-run
EOF
  exit 0
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --host)
      if [[ $# -lt 2 || "$2" == --* ]]; then
        echo "Error: --host requires an argument"
        exit 1
      fi
      SSH_HOST="$2"
      shift 2
      ;;
    --remote-path)
      if [[ $# -lt 2 || "$2" == --* ]]; then
        echo "Error: --remote-path requires an argument"
        exit 1
      fi
      REMOTE_PATH="$2"
      shift 2
      ;;
    --build)
      if [[ $# -lt 2 || "$2" == --* ]]; then
        echo "Error: --build requires an argument"
        exit 1
      fi
      BUILD_CMD="$2"
      shift 2
      ;;
    --build-dir)
      if [[ $# -lt 2 || "$2" == --* ]]; then
        echo "Error: --build-dir requires an argument"
        exit 1
      fi
      BUILD_DIR="$2"
      shift 2
      ;;
    --migrate)
      if [[ $# -lt 2 || "$2" == --* ]]; then
        echo "Error: --migrate requires an argument"
        exit 1
      fi
      MIGRATE_CMD="$2"
      shift 2
      ;;
    --dry-run)
      DRY_RUN=true
      shift
      ;;
    -h|--help)
      usage
      ;;
    *)
      echo "Unknown option: $1"
      usage
      ;;
  esac
done

# Validate required options
if [[ -z "$SSH_HOST" ]]; then
  echo "Error: --host is required"
  exit 1
fi

if [[ -z "$REMOTE_PATH" ]]; then
  echo "Error: --remote-path is required"
  exit 1
fi

echo "==> Running build: $BUILD_CMD"
eval "$BUILD_CMD"

# Validate build output directory exists
if [[ ! -d "$BUILD_DIR" ]]; then
  echo "Error: Build output directory '$BUILD_DIR' does not exist"
  exit 1
fi

# Build rsync exclude arguments
RSYNC_EXCLUDE_ARGS=()
for exclude in "${RSYNC_EXCLUDES[@]}"; do
  RSYNC_EXCLUDE_ARGS+=(--exclude "$exclude")
done

# Create remote backup
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="$REMOTE_PATH/backups"
BACKUP_FILE="backup_$TIMESTAMP.tar.gz"

echo "==> Creating remote backup at $BACKUP_DIR/$BACKUP_FILE"
if [[ "$DRY_RUN" == "false" ]]; then
  if ! ssh "$SSH_HOST" "mkdir -p '$BACKUP_DIR' && cd '$REMOTE_PATH' && tar --exclude='./backups' -czf '$BACKUP_DIR/$BACKUP_FILE' . 2>/dev/null"; then
    echo "Warning: Backup creation may have failed or directory is empty (continuing with deploy)"
  fi
else
  echo "[DRY-RUN] Would create backup at $BACKUP_DIR/$BACKUP_FILE"
fi

# Run rsync
RSYNC_OPTS=(-avz --delete "${RSYNC_EXCLUDE_ARGS[@]}")
if [[ "$DRY_RUN" == "true" ]]; then
  RSYNC_OPTS+=(--dry-run)
fi

echo "==> Syncing $BUILD_DIR/ to $SSH_HOST:$REMOTE_PATH/"
rsync "${RSYNC_OPTS[@]}" "$BUILD_DIR/" "$SSH_HOST:$REMOTE_PATH/"

# Attempt to set permissions (continue if sudo fails)
if [[ "$DRY_RUN" == "false" ]]; then
  echo "==> Setting permissions on remote"
  ssh "$SSH_HOST" "sudo chown -R www-data:www-data '$REMOTE_PATH'" 2>/dev/null || echo "Warning: Could not set permissions (sudo may not be available)"
fi

# Run migration command if provided
if [[ -n "$MIGRATE_CMD" && "$DRY_RUN" == "false" ]]; then
  echo "==> Running migration command: $MIGRATE_CMD"
  ssh "$SSH_HOST" "cd '$REMOTE_PATH' && $MIGRATE_CMD"
fi

echo "==> Deployment complete!"
if [[ "$DRY_RUN" == "true" ]]; then
  echo "[DRY-RUN] No changes were made"
fi
