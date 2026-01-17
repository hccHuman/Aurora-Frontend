# Paginator System Tests

**Ubicación:** `tests/system/paginator.test.tsx`
**Tipo:** Pruebas de Sistema / Componente Aislado
**Estado:** ✅ PASS

## 1. Descripción General
Valida la lógica de navegación y visualización del componente de paginación reutilizable.

## 2. Escenarios de Prueba

### Estados de Botones
*   **Primera Página:** Botón "Previous" debe estar **Deshabilitado**.
*   **Última Página:** Botón "Next" debe estar **Deshabilitado**.
*   **Página Intermedia:** Ambos botones habilitados.

### Interacción y Eventos
*   **Click Next:** Debe llamar a la función prop `onPageChange` con el valor `currentPage + 1`.
*   *(Implícito)* **Click Previous:** Debe llamar a `onPageChange` con `currentPage - 1`.

### Visualización de Info
*   **Texto Informativo:** Valida que el texto "Page X of Y" se renderice correctamente respetando la localización (i18n).
    *   Ejemplo: Input `{ initialPage: 3, totalPages: 10 }` -> Visualiza "3 of 10".

## 3. Notas
Componente "tonto" (presentacional) que depende de props para su estado, lo que facilita su testeo unitario/sistema sin grandes dependencias.
