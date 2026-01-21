# 🏗️ Arquitectura del Sistema

## Visión General de Capas

Aurora se estructura en **4 capas principales** que trabajan en armonía:

```
┌──────────────────────────────────────────────────────┐
│        PRESENTACIÓN (UI/UX)                          │
│  Componentes Astro + React, Estilos CSS/Tailwind     │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│        LÓGICA DE NEGOCIO (Módulos IA)                │
│  AURORA, LUCIA, MARIA, ANA, YOLI, ALBA              │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│        ESTADO & SERVICIOS                            │
│  Jotai (Global State), API Clients, Servicios       │
└────────────────────────┬─────────────────────────────┘
                         │
┌────────────────────────▼─────────────────────────────┐
│        INFRAESTRUCTURA EXTERNA                       │
│  Backend API, PayPal, Bases de Datos, CDN           │
└──────────────────────────────────────────────────────┘
```

## Módulos de IA (Detalle)

### 1. AURORA - Núcleo de Chat + Avatar
**Ubicación**: `src/modules/AURORA/`

**Responsabilidades**:
- Procesar entrada de usuario (sanitizar, validar)
- Comunicar con backend para respuestas
- Coordinar síntesis de voz
- Controlar animaciones del avatar
- Mapear emociones a expresiones visuales

**Archivos clave**:
```
AURORA/
├── components/
│   ├── VtuberLive2D.tsx         # Avatar PIXI.js
│   ├── ChatFrame.tsx            # Interfaz chat
│   └── ChatMessage.tsx          # Mensaje individual
├── core/
│   ├── AuroraMessageManager.ts  # Sanitización
│   ├── AuroraVoice.ts           # Síntesis de voz
│   └── AuroraController.ts      # Orquestación
├── models/
│   └── AuroraInstruction.ts     # Tipos de datos
└── utils/
    └── AuroraSanitizer.ts       # XSS prevention
```

### 2. LUCIA - Lógica & Accesibilidad
**Ubicación**: `src/modules/LUCIA/`

**Responsabilidades**:
- Interpretar intención del usuario
- Detectar accesibilidad necesaria (TDAH, dislexia, etc.)
- Adaptar comunicación a preferencias
- Gestionar temas de accesibilidad

**Concepto**: La "mente racional" que comprende y comunica.

### 3. MARIA - Motor & Orquestación
**Ubicación**: `src/modules/MARIA/`

**Responsabilidades**:
- Gestionar flujo de aplicación
- Coordinar entre módulos
- Manejar navegación
- Distribuir tareas internas

**Concepto**: El "corazón operativo" que mantiene todo funcionando.

### 4. ANA - Emociones & Avatar Control
**Ubicación**: `src/modules/ANA/`

**Responsabilidades**:
- Detectar emociones en texto (análisis de palabras clave)
- Mapear emociones a expresiones faciales
- Seleccionar animaciones apropiadas
- Mantener coherencia emocional

**Mapeos de emociones**:
```json
{
  "happy": {
    "expression": "smile",
    "motion": "haru_g_m02",
    "keywords": ["feliz", "alegre", "genial", "excelente"]
  },
  "sad": {
    "expression": "sad",
    "motion": "haru_g_m08",
    "keywords": ["triste", "mal", "problema", "error"]
  },
  "neutral": {
    "expression": "neutral",
    "motion": "haru_g_idle",
    "keywords": []
  }
}
```

**Concepto**: El "alma emocional" que siente y expresa.

### 5. ALBA - Error Handling & Logging
**Ubicación**: `src/modules/ALBA/`

**Responsabilidades**:
- Capturar errores de red/lógica
- Registrar eventos en logs
- Mostrar toasts al usuario
- Mantener resiliencia del sistema

**Códigos de error**:
```
800 → Service Unavailable
400 → Bad Request
404 → Not Found
500 → Server Error
```

**Concepto**: El "guardián de la seguridad" que previene fallos.

### 6. YOLI - Internacionalización (i18n)
**Ubicación**: `src/modules/YOLI/`

**Responsabilidades**:
- Cambiar idioma en toda la app
- Traducir mensajes dinámicos
- Adaptar síntesis de voz
- Formatear números/fechas por región

**Idiomas soportados**:
- 🇪🇸 Español (es)
- 🇬🇧 Inglés (en)

**Concepto**: El "traductor universal" que adapta a cada cultura.

## Flujo de Datos Completo

### Escenario: Usuario envía mensaje

```
1. USUARIO escribe "Me duele que no tengan ese producto" y presiona Enter
   │
   ├─ AURORA.sanitize()
   │  └─ Elimina scripts, HTML malicioso
   │     → "Me duele que no tengan ese producto" ✓
   │
   ├─ Enviar al backend (/api/chat)
   │  └─ Backend responde: { text: "Lamento escuchar eso..." }
   │
   ├─ ANA.processUserMessage()
   │  └─ Detecta palabra clave "duele"
   │     → Emoción: "sad"
   │     → Expresión: "sad"
   │     → Motion: "haru_g_m08"
   │
   ├─ MARIA.applyInstruction()
   │  └─ Coordina actualizaciones
   │     → Avatar: expresión triste
   │     → Avatar: movimiento de consuelo
   │
   ├─ AuroraVoice.speak()
   │  └─ Síntesis de voz en español
   │     → Audio enviado a avatar
   │     → Lip-sync calculado
   │
   ├─ VtuberLive2D.updateAvatar()
   │  └─ Renderiza cambios en PIXI
   │     → Boca se mueve sincronizada
   │     → Expresión cambia suavemente
   │
   └─ UI actualiza
      └─ Mensaje aparece en chat
         Avatar responde visualmente
```

## Gestión de Estado Global (Jotai)

Aurora usa **Jotai atoms** para estado reactivo sin Context API:

```typescript
// uiStore.ts
export const darkModeAtom = atom(false);
export const chatOpenAtom = atom(false);
export const currentLangAtom = atom('es');

// cartStore.ts
export const cartProductsAtom = atom([]);
export const cartTotalAtom = atom(0);

// Uso en componentes:
const [darkMode, setDarkMode] = useAtom(darkModeAtom);
```

**Ventajas**:
- ✅ Reactividad granular
- ✅ Sin prop drilling
- ✅ Fácil testing
- ✅ Performance optimizado

## Navegación SPA (Single Page Application)

Aurora implementa **ClientRouter** de Astro 5:

```
┌─────────────────────────────────┐
│  Usuario navega a /es/productos │
└──────────────┬──────────────────┘
               │
               ▼
        ┌──────────────┐
        │ ClientRouter │
        │ de Astro     │
        └──────┬───────┘
               │
               ├─ NO recarga página
               ├─ VtuberLive2D persiste
               ├─ Avatar mantiene estado
               ├─ Voz sigue hablando
               │
               └─ astro:after-swap
                  └─ Reinicializa listeners
```

**Beneficio**: Experiencia fluida sin interrupciones.

## Flujo de Compilación

```
Código Fuente (TypeScript, JSX, CSS)
             │
             ▼
    Astro Build Pipeline
             │
      ┌──────┴──────┐
      │             │
      ▼             ▼
  React      Astro Pages
  .tsx       .astro
      │             │
      └──────┬──────┘
             │
             ▼
    Bundling (Vite)
      ├─ Tree-shaking
      ├─ Code splitting
      └─ Minification
             │
             ▼
    Salida en /dist/
      ├─ HTML estático/SSR
      ├─ JS optimizado
      ├─ CSS compilado
      └─ Assets optimizados
```

## Patrones Arquitectónicos Utilizados

| Patrón | Uso | Ubicación |
|--------|-----|-----------|
| **Module Pattern** | Encapsulación de lógica | Módulos IA |
| **Singleton** | Instancia única de VoiceAPI | AuroraVoice |
| **Observer** | Reactividad con Jotai | Global State |
| **Adapter** | Diferentes APIs (fetch, PayPal) | Services |
| **Factory** | Crear instrucciones de avatar | AnaCore |
| **Strategy** | Diferentes respuestas por contexto | LUCIA |

---

**Última actualización**: Enero 2026
