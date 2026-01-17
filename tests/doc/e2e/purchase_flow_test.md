# Purchase Flow E2E Tests

**Ubicación:** `tests/e2e/purchase_flow.test.tsx`
**Tipo:** End-to-End Critico (User Journey)
**Status:** ✅ PASS

## 1. Descripción General
Este test simula el recorrido completo de un usuario nuevo en la plataforma, desde el registro inicial hasta la finalización de una compra. Es la prueba más compleja y crítica del sistema actual.

## 2. User Journey (Pasos del Test)

### Paso 1: Registro (`RegisterComponent`)
*   **Acción:** Usuario rellena el formulario de registro con datos válidos.
*   **Resultado:** Cuenta creada, usuario logueado en el sistema (Simulado vía mocks).
*   **Verificación:** Mensaje "Account created successfully".

### Paso 2: Añadir al Carrito (`ProductCardButton`)
*   **Acción:** Usuario (ya logueado) navega al catálogo y añade "E2E Product" al carrito.
*   **Resultado:** Item añadido al store global.
*   **Verificación:** Feedback visual "Added!".

### Paso 3: Checkout y Pago (`CheckoutComponent`)
*   **Acción:** Usuario va al checkout.
*   **Verificación de Estado:**
    *   El producto correcto aparece en el resumen.
    *   Los precios coinciden (`99.99 €`).
*   **Acción:** Click en "Pay".
*   **Resultado:**
    *   Llamada a `paymentService.Order`.
    *   Mensaje de éxito "Payment initiated correctly".

## 3. Datos de Prueba

| Dato | Valor |
| :--- | :--- |
| **Usuario** | `e2e@test.com` / `Aurora123!` |
| **Producto** | "E2E Product" (ID: 1, Precio: 99.99) |
| **Pasarela** | Mocked (Retorna `clientSecret: pi_321`) |

## 4. Notas Técnicas
*   **Complejidad:** Utiliza múltiples renderizados (`rerender`) y actualizaciones de Atoms (`Jotai`) para simular el paso del tiempo y la persistencia de estado entre pantallas diferenes (Registro -> Catálogo -> Checkout).
*   **Navigation:** La navegación entre páginas está mockeada; validamos la lógica de negocio y visualización de cada "pantalla" en la secuencia correcta.
