# 🌟 Visión General - Aurora Frontend

## ¿Qué es Aurora?

Aurora es una **plataforma de e-commerce inteligente con un chatbot de IA emocional**. Combina un avatar virtual 3D (Live2D) con un sistema modular de IA que entiende emociones, genera respuestas contextuales y mantiene conversaciones naturales con los usuarios.

## Características Principales

### 🤖 Avatar Virtual Inteligente
- **Modelo Live2D**: Avatar femenino "Haru" renderizado con PIXI.js
- **Animaciones fluidas**: Expresiones faciales, movimientos corporales y sincronización labial
- **Síntesis de voz**: Text-to-speech con Web Speech API en español e inglés
- **Persistencia SPA**: El avatar mantiene estado durante navegación sin recargas

### 💬 Sistema de Chat Emocional
- **Procesamiento de lenguaje natural**: Analiza intención y contexto
- **Detección de emociones**: Mapea palabras clave a estados emocionales
- **Respuestas dinámicas**: Genera respuestas basadas en emoción, contexto e idioma
- **Multiidioma**: Soporte para español e inglés con detección automática

### 🛍️ Plataforma E-commerce
- **Catálogo de productos**: 142 productos automotrices organizados por categoría
- **Carrito persistente**: Con Jotai atoms para estado global
- **Checkout integrado**: Con PayPal para pagos seguros
- **Búsqueda y filtrado**: Por nombre, categoría y precio

### 📊 Dashboard Administrativo
- **Gestión de productos**: CRUD completo con validaciones
- **Gestión de usuarios**: Visualización de clientes registrados
- **Gestión de órdenes**: Seguimiento de compras
- **Gestión de categorías**: Organización del catálogo
- **Analíticas visuales**: Gráficos de ventas y datos

## Objetivos del Proyecto

1. **Mejorar UX con IA**: Proporcionar atención al cliente 24/7 mediante chatbot inteligente
2. **Monetizar e-commerce**: Vender productos automotrices con experiencia diferenciada
3. **Investigar IA emocional**: Implementar un sistema cognitivo-emocional único
4. **Demostrar arquitectura escalable**: Modular, mantenible y extensible

## Stack Tecnológico (Resumen)

| Capa | Tecnología |
|------|-----------|
| **Framework Frontend** | Astro 5 (SSR) + React 19 |
| **Lenguaje** | TypeScript (Strict Mode) |
| **Estilos** | Tailwind CSS + daisyUI |
| **Estado Global** | Jotai (atoms reactivos) |
| **Avatar** | PIXI.js 6.5.8 + Live2D SDK v4.2.4 |
| **Animaciones** | Framer Motion + CSS Keyframes |
| **Pruebas** | Jest + React Testing Library |
| **Backend** | Node.js/Express (consumido vía API) |

## Arquitectura de Módulos (Plug & Play)

Aurora se divide en **6 módulos independientes** que trabajan juntos:

```
┌─────────────────────────────────────────┐
│        AURORA (Chat + Avatar)           │
│  - Procesamiento de mensajes             │
│  - Control del avatar                    │
│  - Síntesis de voz                       │
└────────────┬────────────────────────────┘
             │
┌────────────┴────────────┬─────────────────┐
│                         │                 │
▼                         ▼                 ▼
┌──────────┐      ┌──────────┐      ┌──────────┐
│ LUCIA    │      │ MARIA    │      │ ANA      │
│ Lógica & │      │ Motor &  │      │ Emociones│
│ Accesib. │      │ Orquesta.│      │ & Avatar │
└──────────┘      └──────────┘      └──────────┘
        │                                 │
        └──────────────┬──────────────────┘
                       │
        ┌──────────────┼──────────────────┐
        │              │                  │
        ▼              ▼                  ▼
    ┌──────────┐  ┌──────────┐   ┌──────────┐
    │ YOLI     │  │ ALBA     │   │ Servicios│
    │ i18n     │  │ Errores  │   │ & APIs   │
    └──────────┘  └──────────┘   └──────────┘
```

## Flujo de Usuario Típico

1. **Usuario abre la app** → Se carga avatar + interfaz e-commerce
2. **Usuario interactúa** → Escribe mensaje en chat
3. **AURORA procesa** → Sanitiza, envía al backend
4. **ANA analiza emociones** → Detecta intención y estado emocional
5. **Genera respuesta** → Texto + expresión + movimiento + voz
6. **Avatar responde** → Con lip-sync sincronizado
7. **Usuario navega** → Avatar persiste durante transiciones SPA

## Diferenciales Competitivos

| Aspecto | Ventaja |
|---------|---------|
| **Avatar** | Live2D realista vs chatbots planos |
| **Emociones** | Sistema cognitivo-emocional vs respuestas genéricas |
| **Persistencia** | SPA sin recargas vs interrupciones |
| **Multiidioma** | Soporte I18n completo |
| **Accesibilidad** | Temas/ARIA/síntesis de voz |
| **Admin** | Dashboard completo para gestión |

## Estadísticas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Líneas de código** | ~15,000+ |
| **Componentes React** | 40+ |
| **Módulos de IA** | 6 |
| **Productos en catálogo** | 142 |
| **Puntuaciones de cobertura test** | 70%+ |
| **Páginas** | 8+ (en/es) |
| **Dependencias** | 50+ |

## Próximas Fases (Roadmap)

- [ ] Integración con base de datos real (PostgreSQL)
- [ ] Autenticación y JWT completo
- [ ] Historial de conversaciones persistente
- [ ] Recomendaciones AI personalizadas
- [ ] Sistema de notificaciones en tiempo real
- [ ] Análisis de sentimientos avanzado
- [ ] Integración con múltiples proveedores de pago

---

**Estado Actual**: En desarrollo activo  
**Última actualización**: Enero 2026  
**Maintainer**: Team Aurora
