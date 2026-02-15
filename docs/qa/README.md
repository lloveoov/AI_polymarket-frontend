# QA Documentation

This directory contains test checklists for the AI Polymarket Admin Console.

## Checklists

| Checklist | Purpose |
|-----------|---------|
| [smoke-checklist.md](./smoke-checklist.md) | Quick validation of core functionality after each deployment |
| [regression-checklist.md](./regression-checklist.md) | Comprehensive validation before release |

## Coverage

- **Admin Console MVP**: All admin pages and navigation
- **Authentication**: Login, logout, session management, protected routes
- **Event Management**: CRUD operations, status, filtering, search
- **Odds Configuration**: View, update, validation, bulk operations
- **Settlement Flow**: Approval, rejection, history, batch operations
- **Adapter Mode**: GatewayAdapter, MockAdapter, error handling
- **Token/Fiat**: Conversion rates, balance display

## Usage

### Smoke Tests
Run after any deployment or small code change to verify critical paths work.

### Regression Tests
Run before releasing to production or after significant feature changes.

## Language

- English (EN)
- Chinese (中文, ZH)
