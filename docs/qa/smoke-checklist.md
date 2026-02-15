# Smoke Test Checklist

Quick validation of core functionality after each deployment or code change.

## Authentication

- [ ] Admin login page loads at `/admin/login`
- [ ] Demo account buttons work (Orion, Mark)
- [ ] Custom email input accepts valid email format
- [ ] Invalid email shows appropriate error
- [ ] Successful login redirects to admin dashboard
- [ ] Session persists after page refresh (localStorage)
- [ ] Logout button clears session and redirects to login
- [ ] Protected routes redirect unauthenticated users to login

## Admin Console MVP

- [ ] Admin layout renders with navigation sidebar
- [ ] All admin menu items are visible and clickable
- [ ] Active route is highlighted in navigation
- [ ] Language switcher changes UI language (EN/ZH)
- [ ] Page content renders without console errors

## Adapter Mode

- [ ] GatewayAdapter loads and initializes correctly
- [ ] MockAdapter fallback works when Gateway unavailable
- [ ] Adapter switch can be toggled in settings (if applicable)
- [ ] Data fetches correctly via current adapter
- [ ] Error states display properly when adapter fails

## Event Management

- [ ] Events list page loads at `/admin/events`
- [ ] Events display with correct data (title, status, dates)
- [ ] Create new event form renders
- [ ] Edit event form pre-fills existing data
- [ ] Delete event shows confirmation dialog
- [ ] Event status updates reflect immediately in UI
- [ ] Pagination works for large event lists

## Odds Configuration

- [ ] Odds config page loads at `/admin/odds`
- [ ] Odds values display correctly (decimal format)
- [ ] Odds can be updated and saved
- [ ] Invalid odds values show validation error
- [ ] Odds changes reflect in event display

## Settlement Flow

- [ ] Settlement page loads at `/admin/settlement`
- [ ] Pending settlements list displays correctly
- [ ] Settlement details modal shows correct information
- [ ] Approve settlement action works
- [ ] Reject settlement shows reason input
- [ ] Settlement status updates after action
- [ ] Settlement history displays correctly

## General UI/UX

- [ ] All pages load within 3 seconds
- [ ] No console errors (Error level)
- [ ] Responsive layout works on desktop (1024px+)
- [ ] All buttons are clickable and provide feedback
- [ ] Loading states display during async operations
- [ ] Error messages are user-friendly
