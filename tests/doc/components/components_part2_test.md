# Component Tests Scenarios (Part 2)

**Directory:** `tests/components/`

## 1. `PayPalCheckout`
**File:** `PayPalCheckout.test.tsx`  
**Focus:** Payment intent creation and session handling

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Successful Intent** | Cart has items, User logged in | Calls `createPaymentIntent` with correct cents conversion (12.5 -> 1250). |
| **Success Redirect** | `createPaymentIntent` succeeds | Clears `sessionStorage` cart and redirects to `/`. |
| **Auth Guard** | User not logged in | Redirects to login, `createPaymentIntent` **not** called. |
| **Auth Guard (401)** | Backend returns 401 | Redirects to login. |
| **Session Guard** | `sessionStorage.login = false` | Redirects to login immediately. |

## 2. `ProductCardButton`
**File:** `ProductCardButton.test.tsx`  
**Focus:** Add to cart interaction

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Add Item** | Click "Add to Cart" | Updates `sessionStorage('aurora_cart')` with correct item data. |

## 3. `CategoryProductsListComponent`
**File:** `category-pagination.test.tsx`  
**Focus:** Pagination and Category Search

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Pagination Flow** | Load category -> Click Next | Loads Page 1 -> Displays "1 de 2" -> Loads Page 2 -> Displays "2 de 2". |
| **Search Within Category** | Search Atom has "Carbono" | Displays search results instead of paginated API data. |

## 4. `Header Navigation (Finalize Links)`
**File:** `header-navigation.test.ts`  
**Focus:** Conditional interaction based on auth state

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Auth User** | Click `.finalize-purchase` (Auth=true) | Navigates to `/es/products/checkout`. |
| **Guest User** | Click `.finalize-purchase` (Auth=false) | Navigates to `/en/account/login`. |
