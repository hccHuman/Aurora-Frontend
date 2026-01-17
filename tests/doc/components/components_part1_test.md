# Component Tests Scenarios

**Directory:** `tests/components/`

## 1. `AllProductsListComponent`
**File:** `AllProductsListComponent.test.tsx`  
**Focus:** Search Integration in Product List

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Search Driven Display** | `searchStateAtom` has query "Freno" | Displays filtered product "Freno Turbo" and does **not** call `fetchPaginatedProducts` (API). |

## 2. `CartCount`
**File:** `CartCount.test.tsx`  
**Focus:** Visual representation of cart quantity (Badge vs Button)

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Badge Variant** | Cart has 3 items (2+1) | Displays "3" in the badge. |
| **Button Variant** | Cart has 5 items | Displays "Carrito (5)". |
| **Atom Update** | Cart updates from 1 -> 4 items | UI updates to show "4" after brief delay. |

## 3. `HeaderSearch`
**File:** `HeaderSearch.test.tsx`  
**Focus:** Input behavior, Debouncing, Sanitization

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Sanitization & Debounce** | Input "Freno<script>" | Calls `searchProducts` with "Frenoscript" after 350ms. Dropdown hidden for basic match. |
| **Focus/Tap Behavior** | Focus on input with existing value | Immediately triggers search (skips debounce) to show results/history. |
