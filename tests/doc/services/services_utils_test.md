# Services & Utils Tests Scenarios

**Directory:** `tests/services/` & `tests/utils/`

## 1. Services Layers

### `paymentService`
**File:** `paymentService.test.ts`
*   **Create Intent:** Verifies `POST` request items structure to `/api/payments/create-payment-intent`. Returns JSON response.

### `productService`
**File:** `productService.test.ts`
*   **Search:** Verifies `searchProducts` calls fetch with correct query params and parses JSON response properly.

### `profileService`
**File:** `profileService.test.ts`
*   **Fetch Profile:** Calls `GET /users/profile`, returns user object or null on error.
*   **Update Profile:** Calls `POST /users/update` with body, validates successful update response.

## 2. Utilities

### `validators`
**File:** `tests/utils/validators.test.ts`

| Validator | Input | Result |
| :--- | :--- | :--- |
| **isNotEmpty** | `"hello"` / `""` | `true` / `false` |
| **validateEmail** | `"test@test.com"` / `"test@"` | `true` / `false` |
| **validatePassword** | `"Strong1!"` / `"weak"` | `true` / `false` (Check weak/special chars) |
| **validateIBAN** | `"ES21 ..."` / `"123"` | `true` / `false` |
| **validatePrice** | `10`, `0` / `-5`, `NaN` | `true` / `false` |
