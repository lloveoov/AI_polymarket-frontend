# Admin Console MVP Regression Checklist

Manual test checklist for Admin routes, CRUD flows, and i18n strings.

## Where to Test

- **Vercel**: `https://ai-polymarket-frontend.vercel.app`
- **Railway**: `https://ai-polymarket-frontend-production.up.railway.app`
- **Local**: `http://localhost:5173`

## Admin Routes

| Route | Description | Where to Look |
|-------|-------------|---------------|
| `/admin/login` | Admin login page | Login form, demo buttons |
| `/admin/events` | Events management | Events list, CRUD operations |
| `/admin/odds` | Odds configuration | Odds values, update form |
| `/admin/settlement` | Settlement flow | Pending settlements, approval/rejection |
| `/admin/tokens` | Token/Fiat management | Token list, conversion rates |

## CRUD Flows

### Events CRUD

1. **Create Event**
   - Step: Navigate to `/admin/events`, click "New Event"
   - Expected: Form renders with all fields (title, description, dates, status)
   - Fill form and submit → Event appears in list

2. **Read Event**
   - Step: Click event row in list
   - Expected: Detail modal shows all event data

3. **Update Event**
   - Step: Click edit icon on event
   - Expected: Pre-filled form loads, save updates list immediately

4. **Delete Event**
   - Step: Click delete icon, confirm dialog
   - Expected: Event removed from list, success toast

### Odds CRUD

1. **View Odds**
   - Step: Navigate to `/admin/odds`
   - Expected: Current odds values display in decimal format

2. **Update Odds**
   - Step: Edit odds value, click save
   - Expected: Value updates, toast confirms save
   - Where to look: Odds display in `/admin/events`

### Settlement CRUD

1. **View Pending**
   - Step: Navigate to `/admin/settlement`
   - Expected: List of pending settlements with details

2. **Approve/Reject**
   - Step: Click approve or reject button
   - Expected: Action processes, status updates, history logs entry

## i18n Strings

| Page | EN String | ZH String | Where to Look |
|------|-----------|-----------|---------------|
| Login | Login | 登录 | Language switcher toggle |
| Events | Events | 活动 | Sidebar, page header |
| Odds | Odds | 赔率 | Page header |
| Settlement | Settlement | 结算 | Page header |
| Tokens | Tokens | 代币 | Page header |

### i18n Test Steps

1. Navigate to any admin page
2. Click language switcher (EN ↔ ZH)
3. Expected: All UI strings switch language
4. Refresh page → Language persists

## Expected Results

- [ ] All admin routes load without crash
- [ ] Login authenticates and redirects correctly
- [ ] Events CRUD operations work end-to-end
- [ ] Odds can be viewed and updated
- [ ] Settlement approve/reject flows complete
- [ ] Language switch works on all pages
- [ ] No console errors (Error level)
- [ ] All forms validate input correctly
- [ ] Loading states show during async operations
- [ ] Error states display user-friendly messages
