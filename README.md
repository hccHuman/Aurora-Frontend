# 🌙 Aurora Frontend

> **Sistema E-commerce Inteligente con IA Emocional Integrada**

Aurora es una plataforma de e-commerce revolucionaria que combina la potencia del comercio electrónico tradicional con un sistema de inteligencia artificial emocionalmente consciente. Diseñada para ofrecer experiencias de usuario personalizadas y empáticas.

## 🎯 Características Principales

### 🤖 **Sistema Multi-Modal de IA**

- **🧠 LUCIA** - Lógica Unificada de Comprensión e Interfaz Accesible
- **💾 MARIA** - Módulo Administrador y Redireccionador Interno de Aplicación
- **💖 ANA** - Analizador de Niveles Afectivos
- **📡 YOLI** - Yector Omnilingüe de Lenguajes Inyectables
- **🛡️ ALBA** - Aviso Logístico de Bloqueo y Anomalías
- **🤖 AURORA** - Interfaz de Usuario y Avatar Inteligente

### 🛒 **Funcionalidades E-commerce**

- Catálogo de productos inteligente
- Carrito de compras dinámico
- Proceso de checkout
- Interfaz adaptable a las necesidades del usuario

## 📚 Documentación

### 📖 **Documentación Técnica** ([Ver en Markdown](./doc/markdown/))

- [🏗️ Arquitectura del Sistema](./doc/markdown/arquitectura.md) - Descripción detallada de la arquitectura
- [📁 Estructura del Proyecto](./doc/markdown/estructura.md)
- [⚙️ Guía de Instalación](./doc/markdown/instalacion.md) - Instrucciones de configuración
- [✨ Catálogo de Animaciones](./doc/markdown/animaciones.md)
- [👤 Avatar Virtual (Live2D)](./doc/markdown/avatar.md)
- [📊 Dashboard de Administración](./doc/markdown/dashboard.md)
- [📋 README Principal](./doc/markdown/README.md) - Documentación general
- [🧪 Índice de Pruebas](./tests/doc/test_index.md) - Documentación detallada de Testing

### 📄 **Documentos en PDF** ([Ver en PDF](./doc/pdf/))

- [📋 Anteproyecto](./doc/pdf/Anteproyecto-Alejandro-Moron-Turiel.pdf) - Documento de anteproyecto completo
- [📖 Glosario](./doc/pdf/Glosario-Alejandro-Moron-Turiel.pdf) - Términos y definiciones del proyecto
- [🎨 Guía de Diseño UX/UI](./doc/pdf/Guia-Diseño-UX-UI-Alejandro-Moron-Turiel.pdf) - Especificaciones de diseño

## 🏗️ Arquitectura del Sistema

```
Aurora-Frontend/
├── 🧩 Components/ # Componentes reutilizables
├── 🌐 Pages/ # Vistas principales
├── 🧠 Modules/ # Núcleo del sistema + IA (API)
├── 🔧 Services/ # Conexión con APIs externas
├── 🗃️ Store/ # Gestión de estado global
├── 🎨 Styles/ # Sistema de diseño
└── ⚙️ Utils/ # Utilidades y hooks
```

## 🧩 Módulos de IA Integrados

### 🌸 LUCIA - La Mente Lógica

L.U.C.I.A. representa la **mente lógica y comunicativa** de la IA.  
Su misión es comprender, interpretar y expresar información de manera accesible, adaptándose a las capacidades y necesidades del usuario.

```typescript
// Ejemplo de uso
import { parseCommand, detectIntent } from "./modules/LUCIA/core";
```

## 💎 MARIA - El Corazón Operativo

M.A.R.I.A. actúa como el **núcleo de control y distribución interna** del sistema.  
Es responsable de la gestión de procesos, coordinación entre módulos y mantenimiento del flujo de datos dentro del entorno de la IA.

```typescript
// Ejemplo de uso
import { appState, navigateTo } from "./modules/MARIA/context";
```

## 💖 ANA - La Conciencia Emocional

A.N.A. constituye la **capa emocional** de la IA.  
Su función es detectar, interpretar y regular las expresiones emocionales en el avatar, manteniendo un equilibrio emocional natural y coherente.

## 📡 YOLI - El Traductor Universal

Y.O.L.I. actúa como el **motor de internacionalización (i18n) dinámico**.  
Su función es inyectar en componentes y páginas el texto correspondiente de un archivo JSON específico para el idioma activo.

```typescript
// Ejemplo de uso
import { t } from "./modules/YOLI/injector";
```

## 🛡️ ALBA - El Sistema de Resiliencia

A.L.B.A. es el **subsistema de gestión de errores y resiliencia** del frontend.  
Su función es capturar errores de red, fallos en la IA o excepciones en los servicios y traducirlos en notificaciones visuales (Toasts) para el usuario.

```typescript
// Ejemplo de uso
import { AlbaClient } from "./modules/ALBA/AlbaClient";
import { handleInternalError } from "./modules/ALBA/ErrorHandler";
```

## 🌌 Integración General

| Módulo         | Rol Principal                        | Tipo de Procesamiento   | Interacción                           |
| :------------- | :----------------------------------- | :---------------------- | :------------------------------------ |
| **M.A.R.I.A.** | Administración y redirección interna | Operativo / Lógico      | Coordina y gestiona todos los módulos |
| **L.U.C.I.A.** | Comprensión e interfaz accesible     | Cognitivo / Lingüístico | Comunica la IA con el usuario         |
| **A.N.A.**     | Análisis y regulación emocional      | Afectivo / Adaptativo   | Equilibra las emociones del sistema   |
| **Y.O.L.I.**   | Inyección de lenguaje y traducción   | Contextual / Dinámico   | Adapta el idioma del sistema al usuario|
| **A.L.B.A.**   | Gestión de errores y resiliencia     | Defensivo / Reactivo    | Captura y notifica errores al usuario |

---

## 🚀 Instalación y Configuración

### Prerrequisitos

- Node.js 18+

- npm o yarn

- TypeScript 4.9+

## Instalación

```Bash
cd aurora-frontend

# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Construir para producción
npm run build
```

---

### 💫 Filosofía del Sistema

> “La razón guía, la gestión equilibra y la emoción conecta.”
>
> Este tríptico de módulos conforma una IA con **mente, cuerpo y alma**, capaz de pensar con precisión, actuar con coherencia y sentir con empatía.

### Estructura del proyecto

```
📦 Aurora/
│
├── 📁 doc/                     # 📚 Documentación Técnica del Proyecto
│   ├── 🗂️ markdown/            # Guías y manuales
│   └── 🗂️ pdf/                 # Documentos oficiales
│
├── 📁 src/
│   ├── 📁 components/          # Componentes Reutilizables (UI, Layout)
│   │
│   ├── 📁 modules/             # 🌐 Núcleo Inteligente (Diseño Modular)
│   │   ├── AURORA/             # 🤖 Módulo Principal: Chat & Avatar
│   │   │   ├── components/     # UI del Chat
│   │   │   ├── core/           # Lógica del mensaje, voz y modelos
│   │   │   └── models/         # Props y definiciones internas (Encapsuladas)
│   │   │
│   │   ├── LUCIA/              # Accesibilidad
│   │   ├── MARIA/              # Core Engine (Nav & Actions)
│   │   ├── ANA/                # Emociones
│   │   ├── YOLI/               # i18n
│   │   └── ALBA/               # Error Handling
│   │
│   ├── 📁 services/            # API Clients & Business Logic
│   ├── 📁 store/               # Gestión de estado (Jotai)
│   ├── 📁 styles/              # Global Styles & Animations
│   └── 📁 utils/
│
├── 📁 tests/                   # 🧪 Suite de Pruebas Exhaustiva
│   ├── 📁 doc/                 # 📄 Documentación detallada por Test
│   │   ├── unit/               # Docs de Tests Unitarios
│   │   ├── integration/        # Docs de Tests de Integración
│   │   ├── system/             # Docs de Tests de Sistema
│   │   ├── e2e/                # Docs de Tests E2E
│   │   └── test_index.md       # Índice Maestro de Pruebas
│   │
│   ├── 📁 modules/             # Tests Unitarios de Módulos
│   ├── 📁 components/          # Tests de Componentes React
│   ├── 📁 services/            # Tests de Servicios
│   ├── 📁 integration/         # Tests de Integración
│   └── 📁 e2e/                 # Tests End-to-End
│
└── ...config files
```