# Theme System Integration Tests

**Directory:** `tests/modules/theme-system-integration.test.tsx`
**Status:** ✅ PASS (E2E Scenarios)

## 1. Overview
Estos tests de integración verifican la coherencia visual y funcional del sistema de temas (Light/Dark) a través de toda la aplicación, simulando interacciones reales de usuario.

## 2. User Scenarios

| Scenario | Flow | Verification |
| :--- | :--- | :--- |
| **New User** | First visit (No storage) | Defaults to **Light Mode**. |
| **Persistencia** | Toggle Dark -> Reload Page | App loads in **Dark Mode** (reads localStorage). |
| **Rapid Toggle** | Click Toggle 5 times quickly | App handles animation, final state matches last click (Dark). |

## 3. Component Consistency
Verifica que los componentes UI reaccionan correctamente al cambio de clase global `.dark`.

*   **Header:** Cambia backgrounds (`bg-slate-50` <-> `bg-slate-900`) y texto.
*   **Cart Menu:** Bordes y fondos se actualizan para mantener contraste.
*   **Forms:** Inputs y botones mantienen legibilidad (WCAG contrast check simulado).

## 4. Edge Cases
*   **LocalStorage Full:** Si `setItem` falla (QuotaExceeded), el cambio de tema visual **sigue funcionando** en la sesión actual (graceful degradation).
*   **Private Browsing:** Maneja restricciones de acceso a storage sin romper la UI.
*   **Invalid Value:** Si localStorage tiene basura ("invalid-theme"), fallback a default.
