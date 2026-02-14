# AI_polymarket-frontend

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
