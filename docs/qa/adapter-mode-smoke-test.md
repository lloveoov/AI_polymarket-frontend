# Adapter Mode Smoke Test

Verify app runs in mock mode and gateway mode without crashes.

## Where to Test

- **Vercel**: `https://ai-polymarket-frontend.vercel.app`
- **Railway**: `https://ai-polymarket-frontend-production.up.railway.app`
- **Local**: `http://localhost:5173`

## Adapter Configuration

The app uses `VITE_API_MODE` environment variable:
- `mock` (default) → MockAdapter with hardcoded data
- `gateway` → GatewayAdapter calls real API at `VITE_API_BASE_URL`

## Test Modes

### Mode 1: Mock Mode (Default)

**Environment**: `VITE_API_MODE=mock`

1. **Verify MockAdapter loads**
   - Step: Open browser console, navigate to any page
   - Expected: No adapter errors in console

2. **Test data loads**
   - Step: Navigate to `/admin/events`
   - Expected: Events list displays (mock data)

3. **Test navigation**
   - Step: Visit `/admin`, `/admin/odds`, `/admin/settlement`
   - Expected: All pages load without crash

### Mode 2: Gateway Mode (Dummy URL)

**Environment**: `VITE_API_MODE=gateway`, `VITE_API_BASE_URL=https://dummy-api.example.com`

1. **Configure dummy base URL**
   - Step: Set env var or local `.env` file
   ```
   VITE_API_MODE=gateway
   VITE_API_BASE_URL=https://dummy-api.example.com/api
   ```

2. **Start app with gateway mode**
   - Step: Run `npm run dev` or rebuild deployment
   - Expected: App starts without crash

3. **Test graceful error handling**
   - Step: Navigate to any data-fetching page
   - Expected: Error state displays, app doesn't crash
   - Where to look: Toast notifications, error banners

4. **Verify adapter initialization**
   - Step: Check console for "GatewayAdapter" log
   - Expected: Adapter attempts connection, handles failure gracefully

## Key Routes

| Route | Purpose |
|-------|---------|
| `/admin/login` | Login page (no adapter needed) |
| `/admin/events` | Events list (fetches data) |
| `/admin/odds` | Odds config (fetches data) |
| `/admin/settlement` | Settlement (fetches data) |

## Expected Results

- [ ] Mock mode: App loads with mock data
- [ ] Mock mode: No console errors
- [ ] Gateway mode: App starts without crash
- [ ] Gateway mode: Network errors show user-friendly message
- [ ] Gateway mode: App remains functional (doesn't freeze)
- [ ] Both modes: Navigation works between all pages
- [ ] Both modes: Login/logout functions correctly
- [ ] Both modes: No uncaught exceptions

## Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS errors | Expected with dummy URL; verify error handling |
| 404 on API calls | Expected; app should show error state |
| App crash | Bug; report in issue |
| No error display | Bug; should show graceful error state |
