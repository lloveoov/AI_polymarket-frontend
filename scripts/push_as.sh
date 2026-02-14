#!/usr/bin/env bash
set -euo pipefail

ROLE=${1:-}
BRANCH=${2:-}
REMOTE_BASE=${3:-origin}

if [[ -z "$ROLE" || -z "$BRANCH" ]]; then
  echo "Usage: $0 <manager|code|qa> <branch> [remoteBase=origin]" >&2
  exit 2
fi

SCRIPT_DIR=$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")" && pwd)

"$SCRIPT_DIR/gh_as.sh" "$ROLE" >&2

REMOTE="${REMOTE_BASE}-${ROLE}"

if ! git remote get-url "$REMOTE" >/dev/null 2>&1; then
  echo "Remote '$REMOTE' missing. Creating role remotes from '$REMOTE_BASE'..." >&2
  "$SCRIPT_DIR/setup_role_remotes.sh" "$REMOTE_BASE" >/dev/null
fi

echo "Pushing $BRANCH -> $REMOTE" >&2

git push "$REMOTE" "$BRANCH"