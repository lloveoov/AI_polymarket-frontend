#!/usr/bin/env bash
set -euo pipefail

# Creates role-named remotes that all point to the same repo URL.
# Useful as a safety rail: you *choose* a role remote explicitly when pushing.

BASE_REMOTE=${1:-origin}

if ! git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  echo "Run this inside a git repo" >&2
  exit 2
fi

URL=$(git remote get-url "$BASE_REMOTE" 2>/dev/null || true)
if [[ -z "$URL" ]]; then
  echo "Remote '$BASE_REMOTE' not found" >&2
  exit 2
fi

for role in manager code qa; do
  r="${BASE_REMOTE}-${role}"
  if git remote get-url "$r" >/dev/null 2>&1; then
    echo "remote exists: $r" >&2
  else
    git remote add "$r" "$URL"
    echo "added remote: $r -> $URL" >&2
  fi

done

git remote -v | sed -n '1,200p'