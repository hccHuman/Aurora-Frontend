# Test Cases - Category Pagination & Paginated Services

## Descripción
Casos de prueba para la paginación de productos por categoría (front-end component y endpoints). Se cubre la consulta al endpoint `/products/category/:id?page=1&pageSize=5` y la experiencia del cliente con `CategoryProductsListComponent` y `Paginator`.

## Objetivos
- Verificar que la API de paginación responde correctamente y el front-end interpreta `data`, `totalPages`, `hasNext` y `hasPrev`.
- Asegurar que el componente cliente calcula `pageSize` correctamente y carga páginas al cambiar el paginador.
- Asegurar que el contenido de la página se actualiza y que el `Paginator` muestra la página actual y el total.

## Casos de prueba

### PAG-001 - Llamada API paginada por categoría (page=1)
**Entrada**: `/products/category/1?page=1&pageSize=5` (mock response) 
**Esperado**: Respuesta con `data` array, `total`, `totalPages`, `hasNext`, `hasPrev`.

### PAG-002 - Carga del primer página en `CategoryProductsListComponent`
**Entrada**: Montar componente con `categoryId=1` y `getResponsivePageSize` = 2 (mock)
**Esperado**: Mostrar productos de la primera página y `Paginator` con `1 de N`.

### PAG-003 - Navegar a página 2
**Entrada**: Pulsar botón 'Siguiente' en el `Paginator`
**Esperado**: El componente solicita `page=2`, muestra nuevos productos y `Paginator` refleja la página 2

### PAG-004 - Manejo de errores de API
**Entrada**: API responde 500 o error de red
**Esperado**: Mostrar mensaje de error amigable, mantener UX estable (vaciar lista o fallback) y no romper la UI

### PAG-005 - `pageSize` responsive
**Entrada**: Dispositivos con diferentes `getResponsivePageSize` values
**Esperado**: `pageSize` probado para `1/2/4` elementos y el grid se adapta (1/2/4 columns)

---

## Notas de Implementación
- Mockear `fetchPaginatedProductsByCategory` para varios escenarios.
- Usar `@testing-library/react` y `waitFor` para verificar la aparición de elementos de la nueva página.
- Asegurar que el `Paginator` emita `onPageChange` y el componente recargue los datos.

## Comandos de prueba
```bash
npm test -- tests/components/category-pagination.test.tsx
```

## Prioridad: ALTA

---

## Referencias
- `src/services/productService.ts` → `fetchPaginatedProductsByCategory`
- `src/components/tsx/Paginator/CategoryProductsListComponent.tsx`
- `src/components/tsx/Paginator/Paginator.tsx`
