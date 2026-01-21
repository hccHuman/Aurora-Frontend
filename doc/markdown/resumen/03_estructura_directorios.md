# 📁 Estructura de Directorios

## Árbol Completo del Proyecto

```
Aurora-Frontend/
│
├── 📄 package.json              # Dependencias y scripts
├── 📄 tsconfig.json             # Configuración TypeScript (strict)
├── 📄 astro.config.mjs          # Configuración Astro 5
├── 📄 tailwind.config.js        # Configuración Tailwind
├── 📄 jest.config.js            # Configuración Jest
├── 📄 eslint.config.js          # Reglas de linting
├── 📄 .prettierrc                # Formateo de código
├── 📄 postcss.config.js         # PostCSS
│
├── 📁 src/                      # Código fuente principal
│   ├── 📄 main.ts               # Punto de entrada
│   ├── 📄 config.ts             # Configuración global
│   │
│   ├── 📁 components/           # Componentes reutilizables
│   │   ├── 📁 tsx/              # Componentes React interactivos
│   │   │   ├── 📁 Cart/
│   │   │   │   ├── Cart.tsx
│   │   │   │   └── index.tsx
│   │   │   ├── 📁 ProductCard/
│   │   │   ├── 📁 Dashboard/
│   │   │   ├── 📁 Header/
│   │   │   └── ... (40+ componentes)
│   │   │
│   │   ├── 📁 ui/               # Componentes base (botones, inputs)
│   │   │   ├── 📁 Button/
│   │   │   ├── 📁 Input/
│   │   │   ├── 📁 Modal/
│   │   │   └── ...
│   │   │
│   │   └── 📁 layout/           # Componentes de estructura
│   │       ├── Header.astro
│   │       ├── Footer.astro
│   │       └── Sidebar.astro
│   │
│   ├── 📁 modules/              # 🧠 NÚCLEO INTELIGENTE (Plug & Play)
│   │   │
│   │   ├── 📁 AURORA/           # 🤖 Chat + Avatar
│   │   │   ├── 📁 components/
│   │   │   │   ├── VtuberLive2D.tsx      # Avatar PIXI.js
│   │   │   │   ├── ChatFrame.tsx         # UI Chat
│   │   │   │   └── ChatMessage.tsx
│   │   │   │
│   │   │   ├── 📁 core/
│   │   │   │   ├── AuroraMessageManager.ts   # Procesamiento
│   │   │   │   ├── AuroraMessageController.ts
│   │   │   │   ├── AuroraVoice.ts           # Síntesis voz
│   │   │   │   └── AuroraController.ts      # Orquestación
│   │   │   │
│   │   │   ├── 📁 models/
│   │   │   │   ├── AuroraInstruction.ts     # Tipos
│   │   │   │   └── AuroraProps.ts
│   │   │   │
│   │   │   └── 📁 utils/
│   │   │       └── AuroraSanitizer.ts       # XSS prevention
│   │   │
│   │   ├── 📁 LUCIA/            # 🧠 Lógica & Accesibilidad
│   │   │   ├── core.ts
│   │   │   ├── interface.ts
│   │   │   └── 📁 theme-manager/
│   │   │
│   │   ├── 📁 MARIA/            # ⚙️ Orquestación
│   │   │   ├── context.ts
│   │   │   └── routes.ts
│   │   │
│   │   ├── 📁 ANA/              # 💖 Emociones
│   │   │   ├── AnaCore.ts           # Procesamiento
│   │   │   ├── AnaEmotionMap.ts     # Mapeos
│   │   │   └── 📁 data/
│   │   │       └── emotionConfig.ts # Config emociones
│   │   │
│   │   ├── 📁 ALBA/             # 🛡️ Error Handling
│   │   │   ├── ErrorHandler.ts      # Gestión errores
│   │   │   └── Logger.ts
│   │   │
│   │   └── 📁 YOLI/             # 🌍 Internacionalización
│   │       ├── i18n.ts
│   │       └── translations/
│   │
│   ├── 📁 pages/                # 📄 Vistas (Routing Astro)
│   │   ├── index.astro          # Página inicio
│   │   ├── 📁 en/               # Rutas inglés
│   │   │   ├── index.astro
│   │   │   ├── products.astro
│   │   │   ├── checkout.astro
│   │   │   ├── dashboard.astro
│   │   │   └── ...
│   │   │
│   │   └── 📁 es/               # Rutas español
│   │       ├── index.astro
│   │       ├── productos.astro
│   │       ├── comprar.astro
│   │       ├── panel.astro
│   │       └── ...
│   │
│   ├── 📁 layouts/              # Plantillas Astro
│   │   ├── Layout.astro         # Layout principal (con ClientRouter)
│   │   ├── LayoutForm.astro     # Layout para formularios
│   │   └── ...
│   │
│   ├── 📁 services/             # 🔌 Integraciones Externas
│   │   ├── apiClient.ts         # HTTP wrapper
│   │   ├── chatService.ts       # Backend chat
│   │   ├── categoryService.ts   # Productos
│   │   ├── productService.ts    # CRUD productos
│   │   ├── paymentService.ts    # PayPal
│   │   ├── authService.ts       # Autenticación
│   │   ├── dashboardService.ts  # Admin
│   │   ├── deviceService.ts     # Detectar dispositivo
│   │   └── profileService.ts    # Perfil usuario
│   │
│   ├── 📁 store/                # 🎯 Estado Global (Jotai)
│   │   ├── uiStore.ts           # Tema, menús
│   │   ├── cartStore.ts         # Carrito compras
│   │   ├── userStore.ts         # Usuario autenticado
│   │   ├── searchStore.ts       # Búsqueda
│   │   └── chatStore.ts         # Historial chat
│   │
│   ├── 📁 styles/               # 🎨 Estilos Globales
│   │   ├── global.css           # Reset + vars globales
│   │   ├── theme.css            # Temas oscuro/claro
│   │   ├── animations.css       # Keyframes
│   │   └── 📁 Components/       # Estilos por componente
│   │       ├── button.css
│   │       ├── modal.css
│   │       └── ...
│   │
│   ├── 📁 utils/                # 🔧 Funciones Auxiliares
│   │   ├── validators.ts        # Validación datos
│   │   ├── envWrapper.ts        # Variables entorno
│   │   ├── lib/
│   │   │   ├── utils.ts         # Utilidades generales
│   │   │   ├── navigation.ts    # Rutas
│   │   │   └── headerNavigation.ts
│   │   └── categoryService.ts   # Categorías
│   │
│   ├── 📁 models/               # 📋 Tipos TypeScript
│   │   ├── 📁 dashboardProps/
│   │   ├── 📁 EcommerceProps/
│   │   ├── 📁 FunctionProps/
│   │   └── 📁 SystemProps/
│   │
│   ├── 📁 content/              # 📝 Contenido Estático
│   │   └── 📁 legal/            # Términos, privacidad
│   │
│   └── 📁 assets/               # 🖼️ Activos (Iconos, SVG)
│       └── 📁 Icons/
│
├── 📁 public/                   # 🌐 Archivos Estáticos
│   ├── 📁 models/               # Avatar Live2D
│   │   └── 📁 haru/
│   │       ├── haru_greeter_t05.model3.json
│   │       ├── 📁 runtime/
│   │       │   ├── 📁 expressions/    # .exp3.json
│   │       │   ├── 📁 motion/         # .motion3.json
│   │       │   ├── 📁 textures/
│   │       │   └── ...
│   │       └── 📁 physics/
│   │
│   ├── 📁 assets/               # Imágenes, iconos
│   │   ├── 📁 Icons/
│   │   ├── logo.png
│   │   └── ...
│   │
│   ├── 📁 img/                  # Imágenes de productos
│   │   └── ...
│   │
│   └── 📁 webpack/              # Live2D SDK
│       ├── live2d.min.js
│       ├── live2dcubismcore.js
│       └── .d.ts
│
├── 📁 doc/                      # 📚 Documentación
│   ├── 📁 markdown/
│   │   ├── arquitectura.md      # Detalle módulos
│   │   ├── avatar.md            # Avatar Live2D
│   │   ├── animaciones.md       # Catálogo animaciones
│   │   ├── dashboard.md         # Admin panel
│   │   ├── estructura.md        # Este archivo
│   │   └── instalacion.md       # Setup inicial
│   │
│   ├── 📁 resumen/              # 📖 Documentación Completa
│   │   ├── 00_indice.md         # Índice
│   │   ├── 01_vision_general.md
│   │   ├── 02_arquitectura_sistema.md
│   │   ├── 03_estructura_directorios.md
│   │   ├── ... (16 archivos total)
│   │
│   ├── 📁 tests/
│   │   ├── doc/
│   │   │   ├── 📁 unit/
│   │   │   ├── 📁 integration/
│   │   │   ├── 📁 system/
│   │   │   └── 📁 e2e/
│   │   └── test_index.md
│   │
│   └── 📁 pdf/                  # Docs oficiales
│       ├── Anteproyecto.pdf
│       └── Guía_Diseño.pdf
│
├── 📁 tests/                    # 🧪 Suite de Pruebas
│   ├── 📁 modules/              # Tests módulos IA
│   │   ├── aurora-*.test.ts
│   │   ├── alba.test.ts
│   │   └── ...
│   │
│   ├── 📁 components/           # Tests componentes
│   │   ├── Header.test.tsx
│   │   ├── Cart.test.tsx
│   │   ├── ProductCard.test.tsx
│   │   └── ...
│   │
│   ├── 📁 services/             # Tests servicios
│   │   ├── chatService.test.ts
│   │   ├── paymentService.test.ts
│   │   └── ...
│   │
│   ├── 📁 integration/          # Tests integración
│   │   ├── cart-checkout.test.tsx
│   │   └── ...
│   │
│   ├── 📁 e2e/                  # Tests E2E
│   │   ├── checkout_flow.test.tsx
│   │   └── ...
│   │
│   ├── 📁 mocks/                # Mocks y fixtures
│   │   ├── envWrapper.cjs
│   │   ├── react-markdown.js
│   │   └── remark-gfm.js
│   │
│   └── simple.test.ts           # Test básico
│
├── 📁 scripts/                  # 🔧 Scripts Automatizados
│   ├── generate-test-report.js
│   └── generate-test-report-full.js
│
├── 📁 ssl/                      # 🔐 Certificados SSL
│
├── 📄 products_clean.json       # 📊 Catálogo productos (142 items)
│
└── 📄 .gitignore                # Git config
```

## Archivos de Configuración Importantes

| Archivo | Propósito |
|---------|-----------|
| **tsconfig.json** | TypeScript Strict Mode, path aliases (@/) |
| **astro.config.mjs** | Astro + React integration, SSR settings |
| **tailwind.config.js** | Temas, colores, breakpoints |
| **jest.config.js** | Testing environment, aliases |
| **eslint.config.js** | Linting rules, a11y checks |
| **.prettierrc** | Formateo automático |
| **package.json** | Scripts y dependencias |

## Scripts NPM Disponibles

```bash
# Desarrollo
npm run dev              # Astro dev server (localhost:3000)
npm run build            # Producción build
npm run preview          # Ver build localmente

# Testing
npm test                 # Ejecutar todos los tests
npm run test:watch      # Watch mode
npm run test:coverage   # Reporte de cobertura
npm run test:chatbot    # Solo tests del chatbot
npm run test:sanitizer  # Solo sanitizer tests

# Calidad
npm run lint            # ESLint check
npm run lint:fix        # Auto-fix issues
npm run format:check    # Prettier validation
npm run format          # Auto-format código
npm run tsc:check       # TypeScript strict check

# Reporte
npm run generate-test-report     # Reporte simple
npm run generate-test-report-full # Reporte completo
```

## Patrones de Importación

```typescript
// ✅ Usar alias @/
import { AnaCore } from '@/modules/ANA/AnaCore';
import { useAtom } from 'jotai';
import Button from '@/components/ui/Button';

// ❌ Evitar rutas relativas largas
// import { AnaCore } from '../../../modules/ANA/AnaCore';
```

## Convenciones de Nombres

| Tipo | Ejemplo | Ubicación |
|------|---------|-----------|
| **Componentes React** | `ProductCard.tsx` | `components/tsx/` |
| **Componentes Astro** | `Header.astro` | `components/layout/` |
| **Servicios** | `chatService.ts` | `services/` |
| **Módulos IA** | `AnaCore.ts` | `modules/ANA/` |
| **Tipos** | `AuroraInstruction.ts` | `modules/AURORA/models/` |
| **Stores** | `cartStore.ts` | `store/` |
| **Utils** | `validators.ts` | `utils/` |
| **Tests** | `Header.test.tsx` | `tests/` |

---

**Última actualización**: Enero 2026
