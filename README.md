# AI_polymarket-frontend

## Dev ops: role-based GitHub pushes (manager / code / qa)

Goal: on one machine, prevent accidental pushes under the wrong GitHub identity.

### One-time setup (per clone)

```bash
# create role remotes (origin-manager / origin-code / origin-qa)
./scripts/setup_role_remotes.sh
```

### Switch active GitHub identity (uses existing `gh auth` profiles)

```bash
./scripts/gh_as.sh code
./scripts/gh_as.sh manager
./scripts/gh_as.sh qa
```

### Push with a specific role

```bash
# example: push your current branch as code
BRANCH=$(git branch --show-current)
./scripts/push_as.sh code "$BRANCH"
```

Notes:
- No tokens are stored in the repo; scripts rely on your machine's `gh auth` profiles.
- `gh_as.sh` runs `gh auth setup-git` to keep git HTTPS auth aligned with the active role.

Polymarket-inspired frontend (design language + color style), implemented with React + TypeScript + Vite, and structured for future backend integration.

参考 Polymarket 的前端风格与配色，使用 React + TypeScript + Vite 实现，并预留后端接入接口。

## Tech Stack
- React 19
- TypeScript
- Vite

## Backend-ready design / 后端预留
- `src/services/api.ts`: Market API contract interface
- `src/types/market.ts`: shared market domain types
- Current implementation uses mock API; replace with HTTP API later.

## Run
```bash
npm install
npm run dev
```

## Build
```bash
npm run build
```

## Next Milestones
1. Route system + detail page
2. Wallet connect flow
3. Real-time odds updates via WebSocket
4. Auth + portfolio state management
