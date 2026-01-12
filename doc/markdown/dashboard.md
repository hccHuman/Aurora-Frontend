# Dashboard de Administración

El Dashboard de Aurora es el centro de control para la gestión de productos, pedidos, usuarios y categorías. Está diseñado para ofrecer una experiencia fluida, rápida y visualmente impactante.

## 📊 Visualización de Datos

### Gráfico Principal (`MainChart`)
- **Tecnología**: Utiliza un motor de renderizado de gráficos ligero y reactivo.
- **Funcionalidad**: Permite filtrar estadísticas de ventas y rendimiento en rangos de 7 días, 30 días, 90 días y 1 año.
- **Interactividad**: Incluye tooltips detallados y actualizaciones en tiempo real al cambiar el rango.

### Widgets de Resumen
- Información rápida sobre ingresos totales, pedidos recientes y nuevos usuarios, con indicadores de tendencia.

---

## 📋 Gestión de Entidades (Tablas CRUD)

El panel utiliza un sistema de tablas inteligentes con capacidades completas de creación, edición y eliminación (CRUD):

### 🛒 Tabla de Pedidos (`OrdersTable`)
- Visualización de transacciones recientes, importes, métodos de pago y estados.
- Paginación integrada para manejar grandes volúmenes de datos.

### 📦 Tabla de Productos (`ProductsTable`)
- Gestión detallada del catálogo: Nombre, descripción, precio, stock y estado (activo/inactivo).
- **Categorización**: Vinculación directa con el sistema de categorías.
- **Edición en línea**: Permite editar campos directamente en la fila de la tabla sin cambiar de vista.

### 👥 Tabla de Usuarios (`UsersList`)
- Administración de cuentas de usuario, correos electrónicos y roles.
- Gestión de contraseñas y estado de activación.

### 🗂️ Tabla de Categorías (`CategoryTable`)
- Organización lógica del catálogo mediante categorías con imágenes asociadas.

---

## ✨ Animaciones y UX

El dashboard ha sido optimizado con **Framer Motion** para mejorar la percepción de velocidad y calidad:

1. **Entrada Estagereada**: Al cargar el dashboard, las secciones (sección de gráficos, tabla de pedidos, etc.) aparecen secuencialmente deslizándose desde la parte inferior.
2. **Transiciones de Fila**: Al cambiar de página o filtrar datos, las filas de las tablas realizan un efecto de deslizamiento lateral (`slide & fade`), proporcionando un feedback visual claro de que los datos se han actualizado.
3. **Drafting Visual**: Al crear un nuevo elemento, aparece una fila especial resaltada que permite previsualizar los datos antes de guardarlos.

---

## 🛠️ Detalles Técnicos

- **Paginación**: Sistema de paginación reactivo que se ajusta al tamaño del dispositivo para mostrar un número óptimo de elementos.
- **Responsive**: Diseño *Mobile-First* que colapsa las tablas en vistas horizontales o simplifica las columnas para evitar el scroll lateral excesivo.
- **Dark Mode**: Soporte total para tema oscuro, ajustando automáticamente los colores de los gráficos y el contraste de las tablas.
