# Test Cases - Product Modal (Product detail modal)

## Descripción
Casos de prueba detallados para el componente modal de producto (`ProductModal` + `ProductModalWrapper`). Se valida la apertura global, carga de producto por id y contenido mostrado.

## Objetivos
- Verificar que el `ProductModalWrapper` expone `window.openProductModal(id)` correctamente
- Validar que al abrirse muestra título, descripción, precio e imagen del producto
- Comprobar botón `Cerrar` y que `onClose` oculta el modal
- Confirmar integración con `ProductCardComponent` (fallback global) y `ProductCard.astro` (onclick inline)

## Casos de prueba

### MODAL-001 - Wrapper expone función global
**Entrada**: montar `ProductModalWrapper`
**Esperado**: `window.openProductModal` definido y es función

### MODAL-002 - Mostrar producto por ID
**Entrada**: Llamar `openProductModal(4)` (mock `getProductById`)
**Esperado**: Modal aparece y muestra `nombre`, `descripcion`, `precio`, `img_url`

### MODAL-003 - Cerrar modal
**Entrada**: Abrir modal y hacer click en botón cerrar
**Esperado**: Modal desaparece; `open` pasa a `false`

### MODAL-004 - ProductCard fallback
**Entrada**: Renderizar `ProductCardComponent` sin `onOpenModal` y pulsar `Ver detalles`
**Esperado**: `ProductCard` usa `window.openProductModal` como fallback y modal se abre correctamente

### MODAL-005 - Degradado si backend falla
**Entrada**: `getProductById` devuelve `null` o lanza error
**Esperado**: Mostrar mensaje amigable "Producto no disponible" y no lanzar excepción

---

## Notas de implementación / pruebas
- Mockear `getProductById` y `fetch` durante unit tests.
- Usar `@testing-library/react` para interacciones y `waitFor` en operaciones async.
- Validar atributos `alt` en imagen para accesibilidad (a11y).

## Ejemplos de ejecución
```bash
npm test -- tests/components/product-modal.test.tsx
```

## Prioridad: ALTA

---

## Referencias
- `src/components/tsx/Modal/ProductModalWrapper.tsx`
- `src/components/tsx/Modal/ProductModal.tsx`
- `src/components/tsx/ProductCard/ProductCardComponent.tsx`
- `src/services/productService.ts` (getProductById)
