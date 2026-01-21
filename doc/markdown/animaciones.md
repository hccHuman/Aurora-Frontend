# Catálogo de Animaciones

Este documento detalla todas las animaciones disponibles en Aurora, tanto para el avatar Live2D como para la interfaz de usuario (UI), incluyendo el sistema de accesibilidad.

## 1. Animaciones del Avatar (Live2D)

### Motions (movimientos corporales)
Archivos en `public/models/haru/runtime/motion/`:

| Archivo | Descripción | Uso típico |
| :--- | :--- | :--- |
| `haru_g_idle.motion3.json` | Reposo | Estado por defecto, parpadeo suave. |
| `haru_g_m01.motion3.json` | Saludo | Inicio de conversación. |
| ... | ... | ... | (Ver tabla completa en el archivo original si es necesario) |

### Expresiones (faciales)
Archivos en `public/models/haru/runtime/expressions/`:
`neutral`, `smile`, `happy`, `sad`, `surprised`, `angry`, `worried`, `doubt`.

---

## 2. Animaciones de Interfaz (UI)

Aurora utiliza una combinación de **Framer Motion** para componentes React y **CSS Transitions/Keyframes** para componentes Astro y globales.

### Componentes de Navegación
- **Header**: El menú móvil tiene transiciones suaves de deslizamiento y opacidad. Los menús desplegables (cuenta, carrito) usan una animación de escala y desvanecimiento (`dropdown-animate`).
- **Transiciones de Página**: Se aplica un efecto de deslizamiento vertical suave (`animate-pageChange`) al cambiar de ruta, proporcionando continuidad visual.
- **ClientRouter (Astro 5)**: Se utiliza `<ClientRouter />` en `Layout.astro` para habilitar navegación SPA sin recargas completas, permitiendo que componentes como `VtuberLive2D` persistan su estado durante la navegación.
- **Event Listeners Post-Transición**: Se escucha el evento `astro:after-swap` para reinicializar listeners (ej: menús desplegables) tras transiciones SPA.

### Experiencia E-commerce
- **Tarjetas de Producto**: Las imágenes aparecen con un ligero escalado y desvanecimiento al entrar en el viewport (`motion.img`).
- **Botón de Carrito**: Feedback visual inmediato al añadir un producto (cambio a color verde con texto "¡Añadido!" y animación de pulsación).
- **Contador de Carrito**: El globo de notificación se anima (pop inline) cada vez que el total de productos cambia.
- **Listados de Categorías**: Uso de *staggered animations* (animaciones escalonadas) para que las tarjetas aparezcan una tras otra de forma fluida.

### Chatbot
- **Ventana de Chat**: Animaciones de entrada/salida (scale & fade) mediante `AnimatePresence`.
- **Icono Flotante**: Efecto de pulsación rítmica para atraer la atención del usuario de forma sutil.

---

## 3. Animaciones del Dashboard (Admin)

El panel de administración incluye animaciones premium para la visualización de datos:

- **Entrada de Secciones**: Cada gráfico y tabla utiliza el componente `FadeIn`, que desliza el contenido hacia arriba con un retraso escalonado.
- **Interactividad en Tablas**: Las filas de las tablas (Pedidos, Productos, Usuarios, Categorías) se animan horizontalmente al cargar los datos o cambiar de página, facilitando el seguimiento visual de la información.
- **Feedback de CRUD**: La aparición de filas de creación o edición utiliza transiciones de escala para destacar la acción actual.

---

## 4. Accesibilidad y Seguridad

Aurora prioriza la seguridad del usuario. Todas las animaciones (Avatar, UI, Dashboard) están vinculadas al **Menú de Accesibilidad**.

- **Modo Anti-Epilepsia**: Al activar este modo, se añade la clase `.Mode-Anti-Epilepsia` al elemento `<html>`.
- **Efecto**: Mediante CSS global, todas las animaciones y transiciones se desactivan instantáneamente (`animation: none !important`, `transition: none !important`), garantizando una experiencia segura para usuarios con fotosensibilidad o epilepsia.

---

## Uso Técnico (Framer Motion)

Para crear nuevas animaciones de entrada, se recomienda usar el componente `FadeIn`:

```tsx
<FadeIn delay={0.2} direction="up">
  <div>Tu Contenido</div>
</FadeIn>
```
