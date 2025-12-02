# Deploy Script for Vite Project

A safe, reusable deployment script that builds a Vite project and deploys via rsync over SSH.

## Prerequisites

- **SSH key**: Ensure your SSH key is added to the remote server's `authorized_keys`
- **rsync**: Must be installed on both local and remote machines
- **Node.js/npm**: Required to build the Vite project

## Usage

### Dry Run (Preview Changes)

```bash
./deploy.sh --host user@server --remote-path /var/www/mysite --dry-run
```

### Real Deploy

```bash
./deploy.sh --host user@server --remote-path /var/www/mysite
```

### Full Options

```bash
./deploy.sh \
  --host user@server \
  --remote-path /var/www/mysite \
  --build "npm ci && npm run build" \
  --build-dir dist \
  --migrate "some-command"
```

## Options

| Option | Description | Default |
|--------|-------------|---------|
| `--host` | SSH host (e.g., `user@server`) | *Required* |
| `--remote-path` | Remote directory to deploy to | *Required* |
| `--build` | Build command | `npm ci && npm run build` |
| `--build-dir` | Local build output directory | `dist` |
| `--migrate` | Optional command to run on remote after deploy | *None* |
| `--dry-run` | Preview rsync without making changes | `false` |
| `-h, --help` | Show help message | |

## Backups

Before each deployment, a backup of the current site is created at:

```
REMOTE_PATH/backups/backup_YYYYMMDD_HHMMSS.tar.gz
```

### Rollback Command

To rollback to a previous version:

```bash
ssh user@server "cd /var/www/mysite && tar -xzf backups/backup_YYYYMMDD_HHMMSS.tar.gz"
```

## Excluded Files

The following are excluded from sync:
- `.git`
- `node_modules`
- `vendor`
- `.env`
- `backups`
- `dist/.DS_Store`

## Node Server vs Static Files

This script is configured for **static file deployments** (typical Vite output).

If you're deploying a Node.js server instead of static files:

1. Change `--build-dir` to your server directory
2. Add a `--migrate` command to restart the Node process (e.g., `pm2 restart myapp`)
3. Consider adding `node_modules` to the sync if needed (remove from excludes in the script)

## Example: CI/CD Integration

```yaml
# GitHub Actions example
- name: Deploy
  run: |
    ./deploy.sh \
      --host ${{ secrets.DEPLOY_HOST }} \
      --remote-path /var/www/mysite
```
