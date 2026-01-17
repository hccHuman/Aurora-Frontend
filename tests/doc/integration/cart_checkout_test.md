# Cart & Checkout Integration Tests

**Ubicación:** `tests/integration/cart-checkout.test.tsx`
**Tipo:** Pruebas de Integración
**Estado:** ✅ PASS
**Store:** Jotai (`cartStore`, `userStore`)

## 1. Descripción General
Esta suite comprueba la coordinación entre el sistema de carrito (`CartStore`) y la pasarela de pago (`CheckoutComponent`). El objetivo es validar que los datos fluyan correctamente desde la selección de productos hasta la orden de pago sin necesidad de un backend real.

## 2. Dependencias Mockeadas

| Módulo | Función | Comportamiento Simulado |
| :--- | :--- | :--- |
| **@/lib/navigation** | `goTo` | `jest.fn()` - Espía la navegación. |
| **@/services/paymentService** | `Order` | Retorna `{ clientSecret: 'secret_123' }` (Éxito simulado). |

## 3. Configuración Inicial (Seed Data)
Las pruebas inyectan un estado inicial (hydration) en los átomos de Jotai para simular situaciones preexistentes.

### Datos de Carrito (Initial Cart)
```json
{
  "items": [
    { "productId": "1", "title": "Product 1", "price": 10, "quantity": 2 },
    { "productId": "2", "title": "Product 2", "price": 20, "quantity": 1 }
  ]
}
```

### Datos de Usuario (Logged In User)
```json
{
  "ready": true,
  "loggedIn": true,
  "user": { "id": "user-123", "email": "test@example.com" }
}
```

## 4. Escenarios de Prueba

### A. Visualización de Datos
Valida que el componente de Checkout sabe leer correctamente el estado del carrito.

| Verificación | Valor Esperado | Cálculo |
| :--- | :--- | :--- |
| **Producto 1** | `"Product 1"` visible | Título directo. |
| **Producto 2** | `"Product 2"` visible | Título directo. |
| **Total a Pagar** | `"40.00 €"` | `(10 * 2) + (20 * 1) = 40` |

### B. Estado de Carrito Vacío (Edge Case)
Simula la entrada al checkout sin items.
*   **Input:** `cartStore = { items: [] }`
*   **Resultado Esperado:** Mensaje visual "Your cart is empty".
*   **Validación:** `screen.getByText(/cart is empty/i)`

### C. Proceso de Pago (Acción de Usuario)
Simula el click en "Pagar" y la llamada al servicio.
1.  **Estado:** Carrito con items + Usuario logueado.
2.  **Acción:** Click en botón `Role: button, Name: /Pay/i`.
3.  **Mock Response:** El servicio responde de inmediato con éxito (`secret_123`).
4.  **Validación:** Se verifica que `paymentService.Order` haya sido llamado una vez.

## 5. Notas Técnicas
*   **Hydration Helper:** Se utiliza un componente auxiliar `<HydrateAtoms>` dentro de un `<TestProvider>` para inicializar los stores de Jotai con valores específicos para cada test, permitiendo probar escenarios (vacío vs lleno) de forma aislada.
