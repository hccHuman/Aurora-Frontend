# 📖 Aurora Frontend - Documentación Completa

Bienvenido a la documentación comprensiva de **Aurora**, una plataforma de e-commerce inteligente con chatbot emotivo basado en IA.

## ✨ ¿Qué encontrarás aquí?

Esta documentación contiene **16 guías completas** que cubren:

- 🎯 **Visión y objetivos** del proyecto
- 🏗️ **Arquitectura del sistema** con 6 módulos de IA
- 📦 **Stack tecnológico** completo (Astro, React, TypeScript, Live2D)
- 🤖 **Módulos de IA**: Procesamiento de lenguaje, emociones, orquestación
- 💬 **Sistema de chat** con avatar emocional y síntesis de voz
- 🛍️ **Plataforma e-commerce** con 142 productos y PayPal
- 🎛️ **Dashboard administrativo** para gestión de datos
- 👨‍💻 **Guía de desarrollo** con ejemplos y mejores prácticas
- 🧪 **Estrategia de testing** con cobertura > 80%
- 🚀 **Despliegue** en Vercel, Netlify o Docker
- 🔗 **Integraciones externas** con APIs y servicios

## 📚 Archivos de Documentación

### Fundamentos (Lee primero)

| # | Archivo | Contenido |
|---|---------|----------|
| 01 | [01_vision_general.md](01_vision_general.md) | ¿Qué es Aurora? Características y roadmap |
| 02 | [02_arquitectura_sistema.md](02_arquitectura_sistema.md) | Arquitectura de capas y 6 módulos de IA |
| 03 | [03_estructura_directorios.md](03_estructura_directorios.md) | Organización del proyecto y convenciones |
| 06 | [06_stack_tecnologico.md](06_stack_tecnologico.md) | Todas las dependencias y configuraciones |

### Módulos y Características

| # | Archivo | Contenido |
|---|---------|----------|
| 04 | [04_modulos_ia.md](04_modulos_ia.md) | Descripción detallada de 6 módulos IA |
| 05 | [05_flujo_procesamiento.md](05_flujo_procesamiento.md) | Pipeline de mensajes usuario → respuesta avatar |
| 07 | [07_avatar_live2d.md](07_avatar_live2d.md) | Avatar virtual, animaciones, emociones |
| 08 | [08_chat_sistema.md](08_chat_sistema.md) | Sistema de chat con voz y emociones |
| 09 | [09_ecommerce.md](09_ecommerce.md) | E-commerce, catálogo, carrito, PayPal |
| 10 | [10_dashboard_admin.md](10_dashboard_admin.md) | Panel administrativo para gestión |

### Desarrollo y Despliegue

| # | Archivo | Contenido |
|---|---------|----------|
| 11 | [11_guia_desarrollo.md](11_guia_desarrollo.md) | Setup, comandos NPM, debugging |
| 12 | [12_patrones_convenciones.md](12_patrones_convenciones.md) | Patrones de código y mejores prácticas |
| 13 | [13_testing.md](13_testing.md) | Unit tests, integration, E2E, coverage |
| 14 | [14_integraciones_externas.md](14_integraciones_externas.md) | APIs, PayPal, autenticación, webhooks |
| 15 | [15_despliegue.md](15_despliegue.md) | Build, CI/CD, Docker, Vercel/Netlify |
| 16 | [16_mejoras_recientes.md](16_mejoras_recientes.md) | SPA navigation, persistencia, optimizaciones |

## 🚀 Rutas de Lectura Recomendadas

### Para Nuevos Desarrolladores

```
1. Empieza aquí
↓
01_vision_general.md (Entender el proyecto)
↓
02_arquitectura_sistema.md (Cómo funciona)
↓
03_estructura_directorios.md (Dónde está todo)
↓
11_guia_desarrollo.md (Setup y primeros pasos)
↓
12_patrones_convenciones.md (Cómo escribir código)
↓
13_testing.md (Cómo testear)
```

### Para Product Managers

```
01_vision_general.md (Features y roadmap)
↓
04_modulos_ia.md (Capacidades de IA)
↓
09_ecommerce.md (Función e-commerce)
↓
16_mejoras_recientes.md (Cambios recientes)
```

### Para Diseñadores

```
04_modulos_ia.md (Emociones del avatar)
↓
07_avatar_live2d.md (Avatar, animaciones, expresiones)
↓
08_chat_sistema.md (Interfaz de chat)
↓
09_ecommerce.md (Interfaz e-commerce)
```

### Para DevOps/Infrastructure

```
06_stack_tecnologico.md (Dependencias y config)
↓
15_despliegue.md (Build, CI/CD, hosting)
↓
14_integraciones_externas.md (APIs y webhooks)
```

## 📊 Datos Clave del Proyecto

```
┌────────────────────────────────┐
│  Aurora Frontend              │
├────────────────────────────────┤
│ Framework:  Astro 5 + React 19│
│ Lenguaje:   TypeScript strict │
│ Avatar:     Live2D + PIXI.js   │
│ Estado:     Jotai atoms        │
│ Estilos:    Tailwind CSS       │
│ Testing:    Jest + RTL         │
│                                │
│ Productos: 142 en catálogo     │
│ Módulos IA: 6 independientes   │
│ Endpoints:  ~30+ API routes    │
│ Coverage:   > 80% objetivo     │
└────────────────────────────────┘
```

## 💡 Conceptos Clave

### 6 Módulos de IA
- **AURORA**: Chat, sanitización, mensajes
- **LUCIA**: Lógica, intenciones, accesibilidad
- **MARIA**: Orquestación, enrutamiento, navegación
- **ANA**: Detección de emociones, animaciones
- **ALBA**: Manejo de errores, logging, códigos
- **YOLI**: Internacionalización (en/es)

### Flujo de Chat
```
Usuario escribe → AURORA sanitiza → Backend API → 
ANA detecta emoción → Avatar muestra expresión → 
Voz sintetizada → Respuesta en chat
```

### Stack Visual
```
┌─ Presentación (Astro + React)
├─ Lógica (6 módulos IA)
├─ Estado (Jotai atoms)
└─ Servicios (API client)
```

## 🔧 Comando Rápido de Inicio

```bash
# Clonar repo
git clone <repo>
cd Aurora-Frontend

# Instalar dependencias
npm install

# Crear archivo .env
cp .env.example .env.local

# Iniciar dev
npm run dev

# Ver en http://localhost:3000
```

## 📱 Funcionalidades Principales

### Chat Inteligente
- Procesamiento de lenguaje natural
- Detección de emociones en tiempo real
- Avatar emotivo con 8+ expresiones
- Síntesis de voz en ES/EN
- Historial persistente

### E-Commerce
- Catálogo de 142 productos
- Búsqueda y filtrado avanzado
- Carrito con Jotai
- Pago seguro con PayPal
- Dashboard para admin

### Navegación SPA
- Cambios de página sin reload
- Avatar y chat persisten
- Detección de idioma por URL
- Event listeners re-inicializados

## 📞 Soporte

Para preguntas o mejoras:
1. Revisa la documentación relevante primero
2. Abre una issue en GitHub con descripción clara
3. Proporciona contexto y pasos para reproducir

## 📝 Convenciones

- **Archivos**: Numerados 00-16 por tema
- **Formato**: Markdown con secciones organizadas
- **Código**: Ejemplos TypeScript/React/Astro
- **Links**: Relativos para navegación intra-docs

## ✅ Checklist para Desarrolladores Nuevos

- [ ] Leído 01_vision_general.md
- [ ] Leído 02_arquitectura_sistema.md
- [ ] Entendido 06_stack_tecnologico.md
- [ ] Setup local completado (11_guia_desarrollo.md)
- [ ] Revisado 12_patrones_convenciones.md
- [ ] Run `npm run dev` exitosamente
- [ ] Run `npm test` sin errores
- [ ] Revisado 04_modulos_ia.md
- [ ] Entendido flujo de mensajes (05_flujo_procesamiento.md)
- [ ] Listo para primeras contribuciones!

## 🎯 Objetivos del Proyecto

✅ Crear plataforma e-commerce inteligente  
✅ Implementar chatbot emotivo basado en IA  
✅ Avatar virtual con emociones dinámicas  
✅ Stack moderno (Astro, React, TypeScript)  
✅ Documentación completa y ejemplos  
✅ Testing > 80% cobertura  
✅ Desplegable en múltiples plataformas  

---

**Última actualización**: Enero 2026  
**Versión**: Aurora Frontend v1.6.0  
**Compatibilidad**: Node 18+, npm 9+  
**Licencia**: MIT (especificar según proyecto)

### 🔍 Búsqueda Rápida

| Necesito saber... | Archivo |
|---|---|
| Qué es Aurora | 01_vision_general.md |
| Cómo funciona todo | 02_arquitectura_sistema.md |
| Dónde está cada cosa | 03_estructura_directorios.md |
| Qué tecnologías usa | 06_stack_tecnologico.md |
| Cómo funciona el chat | 05_flujo_procesamiento.md + 08_chat_sistema.md |
| Cómo es el avatar | 07_avatar_live2d.md |
| Cómo desarrollar | 11_guia_desarrollo.md |
| Cómo escribir código | 12_patrones_convenciones.md |
| Cómo testear | 13_testing.md |
| Cómo desplegar | 15_despliegue.md |
| Qué cambios recientes | 16_mejoras_recientes.md |

**Happy coding! 🚀**
