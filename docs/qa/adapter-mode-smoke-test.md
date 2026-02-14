# Adapter Mode Smoke Test Checklist

## Overview
Smoke tests for MockAdapter and GatewayAdapter to verify API adapter pattern functionality.

## Test Environment
- MockAdapter: Used by default in `src/services/api.ts`
- GatewayAdapter: Requires `VITE_API_BASE_URL` env var
- Base URL: `http://localhost:5173`

---

## 1. MockAdapter - Core Functionality

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 1.1 | MockAdapter imports correctly | No import errors in build | [ ] |
| 1.2 | `listMarkets()` returns mock data | Returns array of Market objects | [ ] |
| 1.3 | `listMarkets()` with no filters | Returns all mock markets (2 items) | [ ] |
| 1.4 | `listMarkets()` with category filter | Filters by category correctly | [ ] |
| 1.5 | `listMarkets()` with query filter | Searches title by keyword | [ ] |
| 1.6 | `listMarkets()` returns Promise | Returns resolved Promise | [ ] |

---

## 2. MockAdapter - Data Structure

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 2.1 | Market object has required fields | `id`, `title`, `category`, `endDate`, `volumeUsd`, `liquidityUsd`, `outcomes` | [ ] |
| 2.2 | Outcomes array has Yes/No | Each market has `yes` and `no` outcomes | [ ] |
| 2.3 | Probabilities sum to 100 | Each outcome pair totals 100% | [ ] |
| 2.4 | Crypto market present | Market with category "Crypto" exists | [ ] |
| 2.5 | AI market present | Market with category "AI" exists | [ ] |

---

## 3. GatewayAdapter - Initialization

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 3.1 | GatewayAdapter imports correctly | No import errors in build | [ ] |
| 3.2 | Default constructor works | Uses `/api` as default base URL | [ ] |
| 3.3 | Custom base URL accepted | Can pass custom URL to constructor | [ ] |
| 3.4 | `request()` method exists | Method is callable | [ ] |

---

## 4. GatewayAdapter - Request Building

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 4.1 | Builds URL with endpoint | `${baseUrl}${endpoint}` constructed | [ ] |
| 4.2 | Adds query params | URLSearchParams appended correctly | [ ] |
| 4.3 | Sets Content-Type header | `application/json` header present | [ ] |
| 4.4 | Serializes body to JSON | JSON.stringify called for body | [ ] |

---

## 5. GatewayAdapter - Error Handling

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 5.1 | HTTP error returns error object | `{ data: null, error: "HTTP 404: ..." }` | [ ] |
| 5.2 | Network error returns error object | `{ data: null, error: "Failed to fetch" }` | [ ] |
| 5.3 | Successful response returns data | `{ data: parsedJSON }` | [ ] |

---

## 6. ApiAdapter Interface

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 6.1 | MockAdapter implements ApiAdapter | TypeScript compiles without error | [ ] |
| 6.2 | GatewayAdapter implements ApiAdapter | TypeScript compiles without error | [ ] |
| 6.3 | ApiRequest type correct | Has `endpoint`, `method`, `body`, `params` | [ ] |
| 6.4 | ApiResponse type correct | Has `data` and optional `error` | [ ] |

---

## 7. Integration - marketApi

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 7.1 | marketApi uses MockAdapter | Default export uses mock data | [ ] |
| 7.2 | marketApi.listMarkets() callable | Function accessible and returns data | [ ] |

---

## 8. Smoke Test - Runtime

| ID | Test Case | Expected Result | Status |
|----|-----------|-----------------|--------|
| 8.1 | App loads without adapter errors | No runtime errors in console | [ ] |
| 8.2 | Market list renders on homepage | Markets displayed from mock data | [ ] |

---

## Notes
- GatewayAdapter requires backend to be running for full tests
- MockAdapter is the default for development
- Adapter switching will be controlled via env vars
