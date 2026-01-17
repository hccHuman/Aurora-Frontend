# Accessibility Flow E2E Tests

**Ubicación:** `tests/e2e/accessibility_flow.test.tsx`
**Tipo:** End-to-End (Simulado en JSDOM)
**Feature:** Persistencia de Preferencias de Accesibilidad (LUCIA Module)

## 1. Descripción General
Verifica que las opciones de accesibilidad seleccionadas por el usuario (Modo AAA, Modo Anti-Epilepsia) se apliquen al DOM y persistan a través de la navegación o recargas de página mediante `localStorage`.

## 2. Flujos Probados

### Flujo A: Activación y Persistencia WCAG AAA
1.  **Estado Inicial:** `localStorage` limpio, clases resetadas.
2.  **Acción:**
    *   Abrir menú de accesibilidad.
    *   Activar toggle "Master WCAG 2.1 AAA".
3.  **Verificación Inmediata:**
    *   Clase `.mode-aaa` añadida a `<html>`.
    *   `localStorage` key `mode-aaa` = 'true'.
4.  **Persistencia (Rerender):**
    *   Se desmonta y remonta la app.
    *   **Resultado:** La clase `.mode-aaa` se reaplica automáticamente sin iteracción del usuario.

### Flujo B: Modo Anti-Epilepsia
1.  **Acción:** Activar "Anti-Epilepsy Mode".
2.  **Verificación:**
    *   Clase `.mode-epilepsy` añadida.
    *   `localStorage` actualizado.

## 3. Detalles de Implementación
*   **Singleton Manager:** Se testea indirectamente el `accessibilityManager` de LUCIA.
*   **JSDOM Limits:** Al no ser un navegador real, la "navegación" se simula mediante `rerender()`, lo cual es efectivo para validar la lógica de inicialización (`useEffect`) que lee del storage.
