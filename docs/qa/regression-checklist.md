# Regression Test Checklist

Comprehensive validation of all features before release. Execute after significant changes or before deploying to production.

## Authentication & Authorization

- [ ] Login with all demo accounts works (Orion, Mark)
- [ ] Session persists across browser refresh
- [ ] Session expires after appropriate timeout (if configured)
- [ ] Unauthorized access to `/admin/*` redirects to login
- [ ] Logout completely clears session data
- [ ] Role-based access works correctly (if implemented)
- [ ] Login form validates email format client-side
- [ ] Login API errors display appropriate messages

## Admin Console - Core

- [ ] All admin routes are accessible: `/admin/events`, `/admin/odds`, `/admin/settlement`, `/admin/token-fiat`
- [ ] Navigation between all admin pages works
- [ ] Language toggle switches all UI text (EN ↔ ZH)
- [ ] Page titles are correct for each route
- [ ] Admin layout remains consistent across all pages

## Event Management

- [ ] Create event with all fields (title, description, start/end dates, category)
- [ ] Edit existing event preserves all data
- [ ] Delete event removes from list permanently
- [ ] Event list sorts by date correctly
- [ ] Event list filters by status work
- [ ] Search events by title works
- [ ] Event status (active, closed, resolved) displays correctly
- [ ] Bulk event operations work (select multiple, bulk delete)

## Odds Configuration

- [ ] View odds for all events
- [ ] Update odds value (0.01 - 99.99 range)
- [ ] Odds auto-calculate implied probability correctly
- [ ] Bulk odds update works
- [ ] Odds history is tracked
- [ ] Invalid odds (negative, >100) are rejected with error message
- [ ] Odds changes reflect immediately in event preview

## Settlement Flow

- [ ] View all pending settlements
- [ ] View settlement details (event, amount, timestamp)
- [ ] Approve settlement updates event status
- [ ] Reject settlement requires reason and updates status
- [ ] Settlement list shows correct status (pending, approved, rejected)
- [ ] Settlement history is queryable
- [ ] Settlement amounts calculate correctly
- [ ] Batch settlement approval works

## Adapter Mode

- [ ] GatewayAdapter successfully fetches data from backend
- [ ] MockAdapter provides consistent mock data
- [ ] Adapter errors are handled gracefully
- [ ] Switching adapters doesn't cause data corruption
- [ ] Adapter configuration persists across sessions

## Token/Fiat Integration

- [ ] Token-fiat conversion page loads at `/admin/token-fiat`
- [ ] Conversion rates display correctly
- [ ] Token balance displays accurately
- [ ] Fiat equivalent calculates correctly
- [ ] Refresh rates updates data

## UI/UX Regression

- [ ] All buttons have hover states
- [ ] All form inputs have focus states
- [ ] Loading spinners appear during data fetch
- [ ] Empty states display helpful messages
- [ ] Error states are styled consistently
- [ ] No layout shifts during page load
- [ ] All modals can be closed (X button, escape key, click outside)
- [ ] Form validation messages are clear and actionable
- [ ] Date pickers work correctly across timezones

## Data Integrity

- [ ] Created events persist after page refresh
- [ ] Updated odds persist correctly
- [ ] Settlement status changes persist
- [ ] No data loss during network errors
- [ ] Optimistic updates roll back on failure
- [ ] Concurrent edits don't cause conflicts

## Performance

- [ ] Initial page load < 3 seconds
- [ ] API responses < 2 seconds
- [ ] No memory leaks during navigation
- [ ] Large event lists paginate correctly
- [ ] Search/filter responses are fast

## Browser Compatibility

- [ ] Chrome (latest) - all features work
- [ ] Firefox (latest) - all features work
- [ ] Safari (latest) - all features work
- [ ] Edge (latest) - all features work

## Localization

- [ ] All text displays in English when EN selected
- [ ] All text displays in Chinese when ZH selected
- [ ] Date formats are localized
- [ ] Number formats are localized
- [ ] No untranslated strings in either language
