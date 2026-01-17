# Índice de Documentación de Pruebas

Documentación técnica detallada de la suite de pruebas de Aurora Frontend, organizada por tipo de prueba.

## 📂 Pruebas Unitarias (`/unit`)
Pruebas aisladas de componentes y módulos individuales.

*   [AuroraChatFrame Component](./unit/aurora_chat_frame_test.md)
    *   **Scope:** UI de Chat, Inputs, Historial.
    *   **Casos:** 29 tests (Render, Interacción, Mock API, Edge Cases).

## 📂 Pruebas de Integración (`/integration`)
Pruebas de flujo de datos entre múltiples módulos o stores.

*   [Cart & Checkout Flow](./integration/cart_checkout_test.md)
    *   **Scope:** Store de Carrito -> Pasarela de Pago.
    *   **Casos:** Cálculos de totales, estados vacíos, disparadores de servicios.

## 📂 Pruebas de Sistema (`/system`)
Pruebas de componentes funcionales completos.

*   [Authentication (Login/Register)](./system/auth_system_test.md)
    *   **Scope:** Validación de formularios, manejo de errores, integración auth service.
*   [Paginator](./system/paginator_system_test.md)
    *   **Scope:** Navegación lógica, estados de botones.

## 📂 Pruebas E2E (`/e2e`)
Flujos de usuario completos (User Journeys).

*   [Purchase Flow (Full Journey)](./e2e/purchase_flow_test.md)
    *   **Steps:** Register -> Add to Cart -> Checkout -> Pay.
*   [Accessibility Persistence](./e2e/accessibility_flow_test.md)
    *   **Scope:** Persistencia de modos AAA/Epilepsia vía localStorage.

## 📂 Pruebas de Integración (`/integration`)
Validan la interacción entre múltiples módulos o el flujo de datos.

*   [Cart & Checkout Integration](./integration/cart_checkout_test.md)
*   [Theme System Scenarios](./integration/theme_system_test.md)
    *   **Scope:** User Journeys de cambio de tema, persistencia, accesibilidad y edge cases.

## 📂 Pruebas de Componentes (`/components`)
Pruebas aisladas de renderizado y lógica de UI.

*   [Components Part 1](./components/components_part1_test.md)
    *   **Covering:** ProductList, CartCount, HeaderSearch.
*   [Components Part 2](./components/components_part2_test.md)
    *   **Covering:** PayPal, ProductCardButton, Pagination, HeaderNav.

## 📂 Pruebas de Módulos (`/modules`)
Lógica de negocio pura y módulos del sistema (AURORA, ALBA, ANA, LUCIA).

*   [Aurora Chat Frame (Unit)](./unit/aurora_chat_frame_test.md)
*   [ALBA & ANA Modules](./modules/alba_ana_test.md)
    *   **ALBA:** Error Handler, Toast System.
    *   **ANA:** Emotion Analysis Engine.
*   [LUCIA & AURORA Core](./modules/aurora_modules_test.md)
    *   **LUCIA:** Accessibility, CVD, Themes.
    *   **AURORA:** Message Manager, Sanitizers.

## 📂 Servicios y Utilidades (`/services` & `/utils`)
*   [Services & Utils](./services/services_utils_test.md)
    *   **Services:** Payment, Product, Profile.
    *   **Utils:** Validators (Email, Password, IBAN).

---
**Comandos Útiles:**
*   Ejecutar todo: `npm test`
*   Ejecutar unitarias: `npm test -- tests/modules`
*   Ejecutar integración: `npm test -- tests/integration`
*   Reporte de cobertura: `npm run test:coverage`
