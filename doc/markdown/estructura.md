# Estructura del Proyecto

Aurora Frontend está construido con **Astro**, **React**, **TypeScript** y **Tailwind CSS**. La arquitectura se centra en la modularidad y la separación clara de responsabilidades.

## 📁 Directorios Principales

### `/src`
Es el corazón del código fuente.
- **`/components`**: Componentes reutilizables.
  - `ui/`: Botones, inputs, modales (componentes base).
  - `layout/`: Componentes estructurales (Header, Footer, Sidebar).
  - `tsx/`: Componentes interactivos complejos desarrollados en React (Dashboard, Formas, Tablas).
- **`/pages`**: Vistas de la aplicación basadas en Astro. Utiliza rutas basadas en archivos.
- **`/modules`**: Núcleo inteligente de Aurora. Diseño **Plug & Play** (Módulos de quita y pon) que contiene **LUCIA, MARIA, ANA, YOLI, ALBA y AURORA**.
  - `AURORA/`: Contiene el ChatFrame, controladores de Live2D, y ahora los **modelos/props** encapsulados.
- **`/services`**: Abstracciones para llamadas a APIs externas (AI Backend, Dashboard API, Pasarelas de Pago, Chat Service).
- **`/store`**: Gestión de estado global con **Jotai**.
- **`/styles`**: Definiciones de diseño, temas (oscuro/claro/deuteranopia) y animaciones globales.
- **`/utils`**: Funciones auxiliares, validadores, constantes y hooks personalizados.

### `/public`
Contiene activos estáticos que no pasan por el pipeline de compilación.
- **`assets/`**: Imágenes, logotipos e iconos.
- **`models/`**: Recursos para el avatar Live2D (archivos .model3.json, texturas, animaciones).
- **`webpack/`**: Librerías de terceros necesarias en el runtime (como el SDK de Live2D).

### `/doc`
Documentación técnica y de diseño.
- **`markdown/`**: Guías detalladas en formato MD (Arquitectura, Avatar, Animaciones, etc.).
- **`tests/doc/`**: Documentación específica autogenerada de las pruebas (Unit, Integration, System, E2E).
- **`pdf/`**: Documentos oficiales del proyecto (Anteproyecto, Glosario, Guía de Diseño).

### `/raíz del proyecto`
- **`products_clean.json`**: Archivo con catálogo de 142 productos extraído en formato JSON simplificado (id + img_url) para fines de catálogo visual.

---

## 🏗️ Flujo de Trabajo del Módulo de IA

La inteligencia de Aurora se procesa en `src/modules/`:
1. El usuario interactúa → `LUCIA` interpreta la intención.
2. `ANA` analiza el estado emocional y ajusta la respuesta.
3. `MARIA` gestiona la navegación o los procesos internos necesarios.
4. `YOLI` inyecta los textos adecuados según el idioma seleccionado.
5. `ALBA` vigila el proceso para capturar y notificar cualquier anomalía o error.

## 🎨 Sistema de Estilos y Animaciones

- **Tailwind CSS**: Estilos utilitarios para un desarrollo rápido y consistente.
- **Framer Motion**: Utilizado en `/src/components/tsx/` para micro-interacciones y animaciones de dashboard.
- **CSS Avanzado**: Localizado en `src/styles/animations.css` y `theme.css` para efectos globales y soporte de accesibilidad.
