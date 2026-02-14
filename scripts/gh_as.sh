#!/usr/bin/env bash
set -euo pipefail

ROLE=${1:-}

if [[ -z "$ROLE" ]]; then
  echo "Usage: $0 <manager|code|qa>" >&2
  exit 2
fi

case "$ROLE" in
  manager) USER="orion-manager" ;;
  code)    USER="orion-code1" ;;
  qa)      USER="orion-qa" ;;
  *)
    echo "Unknown role: $ROLE. Expected: manager|code|qa" >&2
    exit 2
    ;;
esac

# Switch active gh profile (no token stored in repo; uses machine's pre-configured gh auth)
gh auth switch --hostname github.com --user "$USER" >/dev/null

# Ensure git https auth uses gh's credential helper for the active user
# (This writes to user-level git config / credential helper, not to the repo.)
gh auth setup-git >/dev/null

echo "gh user: $(gh api user --jq .login)"