# Admin Console MVP Regression Checklist

## Overview
Regression test cases for Admin Console MVP covering navigation, page structure, and mock API integration.

## Test Environment
- Base URL: `http://localhost:5173`
- Admin routes: `/admin/*`
- Test user: N/A (no auth implemented yet)

---

## 1. Navigation & Layout

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 1.1 | Navigate to `/admin/events` | Events page loads with heading "Event Management" | [ ] |
| 1.2 | Navigate to `/admin/odds` | Odds page loads with heading "Odds Configuration" | [ ] |
| 1.3 | Navigate to `/admin/settlement` | Settlement page loads with heading "Settlement & Risk" | [ ] |
| 1.4 | Navigate to `/admin/tokens` | Tokens page loads with heading "Token & Fiat" | [ ] |
| 1.5 | Click sidebar "Events" link | URL changes to `/admin/events`, page updates | [ ] |
| 1.6 | Click sidebar "Back to Markets" | Navigate to homepage `/` | [ ] |
| 1.7 | Sidebar highlights active nav item | Active page link has `.active` class | [ ] |

---

## 2. Events Page

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 2.1 | Page renders heading | "Event Management" displayed | [ ] |
| 2.2 | Page renders description text | "Create, edit, and manage prediction market events." displayed | [ ] |
| 2.3 | Page has `admin-page` CSS class | Layout styling applied | [ ] |

---

## 3. Odds Page

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 3.1 | Page renders heading | "Odds Configuration" displayed | [ ] |
| 3.2 | Page renders description text | "Configure and adjust market odds and probabilities." displayed | [ ] |
| 3.3 | Page has `admin-page` CSS class | Layout styling applied | [ ] |

---

## 4. Settlement Page

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 4.1 | Page renders heading | "Settlement & Risk" displayed | [ ] |
| 4.2 | Page renders description text | "Manage market settlements, risk controls, and LLM voting." displayed | [ ] |
| 4.3 | Page has `admin-page` CSS class | Layout styling applied | [ ] |

---

## 5. Token/Fiat Page

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 5.1 | Page renders heading | "Token & Fiat" displayed | [ ] |
| 5.2 | Page renders description text | "Configure token-fiat conversion rates and payment settings." displayed | [ ] |
| 5.3 | Page has `admin-page` CSS class | Layout styling applied | [ ] |

---

## 6. Admin Layout

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 6.1 | Layout has sidebar | Sidebar with nav links visible | [ ] |
| 6.2 | Layout has topbar | Header with "Admin Console" text visible | [ ] |
| 6.3 | Brand text visible | "AI Predict Admin" displayed in sidebar | [ ] |
| 6.4 | All 4 nav items present | Events, Odds, Settlement, Tokens links visible | [ ] |

---

## 7. Responsive & Visual

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 7.1 | Desktop view renders correctly | Sidebar + main content layout | [ ] |
| 7.2 | No console errors on page load | Console is clean | [ ] |

---

## Notes
- Currently all pages are skeleton/mock implementations
- No form submissions or CRUD operations tested
- No auth flow tested (out of scope for MVP)
