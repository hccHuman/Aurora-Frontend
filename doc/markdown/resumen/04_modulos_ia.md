# 🧠 Módulos de IA Emocional

Aurora implementa un **sistema modular de 6 módulos independientes** que trabajan juntos para crear una IA inteligente y emocional. Aquí está la documentación completa de cada uno.

## 1️⃣ AURORA - Chat + Avatar Principal

**Ubicación**: `src/modules/AURORA/`

### Responsabilidades Core

```
Usuario Input → Sanitización → Backend → Procesamiento → Avatar Response
```

### Componentes Principales

#### VtuberLive2D.tsx
- Renderiza el avatar Live2D usando PIXI.js
- Maneja TODA la lógica de sincronización (lip-sync)
- Aplica expresiones faciales y motions
- Persiste durante navegación SPA

```typescript
// Detecta idioma de URL y ajusta síntesis de voz
const pathLang = window.location.pathname.includes("/en/") ? "en" : "es";

// Persiste voz entre navegaciones
if (!voiceInstance) {
  setVoiceInstance(new AuroraVoiceLocal(pathLang));
}
```

#### AuroraMessageManager.ts
- `processUserInput(message)` → sanitiza + procesa
- Convierte a minúsculas, elimina espacios extra
- Previene XSS con `AuroraSanitizer`

```typescript
export async function processUserInput(message: string): Promise<string> {
  // Sanitizar
  const clean = AuroraSanitizer.sanitize(message);
  
  // Procesar
  return clean.toLowerCase().trim();
}
```

#### AuroraVoice.ts
- **Síntesis de voz** con Web Speech API
- Maneja pronunciación de español e inglés
- Emite eventos `aurora-lipsync` para sincronización labial
- Calcula "energía" de audio para animación de boca

```typescript
public async speak(text: string): Promise<void> {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = this.currentLang === 'es' ? 'es-ES' : 'en-US';
  utterance.rate = 0.9; // Velocidad natural
  
  window.speechSynthesis.speak(utterance);
  
  // Emitir lip-sync cada 50ms
  this.emitLipSyncEvents(text);
}
```

#### AuroraController.ts
- Orquesta toda la lógica de AURORA
- Coordina entre componentes
- Maneja el ciclo: input → procesamiento → respuesta

### Tipos de Datos Principales

```typescript
interface AuroraInstruction {
  emotion: string;        // 'happy', 'sad', 'neutral'
  expression: string;     // Avatar expression ID
  motion: string;         // Animation motion ID
  text: string;          // Response text
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}
```

---

## 2️⃣ LUCIA - Lógica & Accesibilidad

**Ubicación**: `src/modules/LUCIA/`

### Responsabilidades

- Interpreta **intención del usuario**
- Detecta necesidades de **accesibilidad**
- Adapta comunicación según **preferencias**
- Gestiona **tema de accesibilidad**

### Características

| Capacidad | Descripción |
|-----------|-------------|
| **Intent Detection** | Identifica si pregunta, compra, reclamo |
| **TDAH Mode** | Texto corto, señales visuales |
| **Dyslexia Mode** | Fuente legible, espaciado aumentado |
| **Colorblind Mode** | Paleta deuteranopia/protanopia |
| **Screen Reader** | ARIA roles, labels semánticos |

### Ejemplo de Detección

```typescript
// Detectar si el usuario pregunta sobre un producto
const isProductQuestion = (text: string): boolean => {
  const keywords = ['precio', 'disponible', 'especificaciones'];
  return keywords.some(k => text.includes(k));
};

// Adaptar respuesta según accesibilidad
const adapResponse = (text: string, mode: string): string => {
  if (mode === 'tdah') {
    // Máximo 2 oraciones
    return text.split('.').slice(0, 2).join('.');
  }
  return text;
};
```

---

## 3️⃣ MARIA - Motor & Orquestación

**Ubicación**: `src/modules/MARIA/`

### Responsabilidades

- Gestiona **flujo de aplicación**
- Coordina **entre módulos**
- Maneja **navegación**
- Distribuye **tareas internas**

### Patrón Observador

```typescript
// MARIA actúa como observador central
class MARIACore {
  private observers = [];
  
  subscribe(module: Module, callback: Function) {
    this.observers.push({ module, callback });
  }
  
  notify(event: Event) {
    this.observers.forEach(obs => {
      if (obs.module.canHandle(event)) {
        obs.callback(event);
      }
    });
  }
}

// Ejemplo: Cuando usuario compra
maria.notify({ type: 'PURCHASE_COMPLETE', productId: 5 });
// → ANA: cambia emoción a "happy"
// → AURORA: avatar celebra
// → YOLI: traduce mensaje de éxito
```

---

## 4️⃣ ANA - Emociones & Avatar Control

**Ubicación**: `src/modules/ANA/`

### Responsabilidades

- **Detecta emociones** en texto (análisis de palabras clave)
- **Mapea emociones** a expresiones faciales
- **Selecciona animaciones** apropiadas
- **Mantiene coherencia** emocional

### Sistema de Mapeo Emocional

```json
// src/modules/ANA/data/emotionConfig.ts
{
  "happy": {
    "emotion": "happy",
    "expression": "smile",
    "motion": "haru_g_m02",
    "keywords": ["feliz", "alegre", "genial", "excelente", "perfecto"],
    "priority": 10
  },
  "sad": {
    "emotion": "sad",
    "expression": "sad",
    "motion": "haru_g_m08",
    "keywords": ["triste", "mal", "problema", "error", "no funciona"],
    "priority": 8
  },
  "neutral": {
    "emotion": "neutral",
    "expression": "neutral",
    "motion": "haru_g_idle",
    "keywords": [],
    "priority": 0
  },
  "surprised": {
    "emotion": "surprised",
    "expression": "surprised",
    "motion": "haru_g_m04",
    "keywords": ["wow", "increíble", "sorprendente"],
    "priority": 7
  }
}
```

### AnaCore.processUserMessage()

```typescript
public static async processUserMessage(
  message: string
): Promise<AuroraInstruction> {
  // 1. Detectar emoción
  const emotion = this.detectEmotion(message);
  
  // 2. Obtener mapeo
  const config = emotionConfig[emotion];
  
  // 3. Crear instrucción
  return {
    emotion: config.emotion,
    expression: config.expression,
    motion: config.motion,
    text: message  // Será procesado por backend
  };
}
```

### Flujo de Detección

```
"Me duele que no tengan ese producto" (entrada)
          │
          ▼
┌──────────────────────────────────┐
│ Buscar palabras clave            │
│ - "duele" ← Match: sad emotion   │
│ - "no tengan" ← Negación         │
└──────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│ Emoción detectada: SAD           │
│ Prioridad: 8/10                  │
└──────────────────────────────────┘
          │
          ▼
┌──────────────────────────────────┐
│ Mapeo aplicado:                  │
│ - Expression: sad                │
│ - Motion: haru_g_m08             │
│ - Animation: consuelo            │
└──────────────────────────────────┘
```

---

## 5️⃣ ALBA - Error Handling & Logging

**Ubicación**: `src/modules/ALBA/`

### Responsabilidades

- Capturar **errores de red/lógica**
- Registrar en **logs**
- Mostrar **toasts al usuario**
- Mantener **resiliencia del sistema**

### Sistema de Códigos de Error

```typescript
// Códigos HTTP + custom
export const ERROR_CODES = {
  // Errores HTTP
  '400': 'Bad Request - Datos inválidos',
  '401': 'Unauthorized - No autenticado',
  '403': 'Forbidden - Sin permiso',
  '404': 'Not Found - Recurso no existe',
  '500': 'Server Error - Error del servidor',
  
  // Custom Aurora
  '800': 'Service Unavailable - Backend caído',
  '801': 'XSS Detected - Intento de ataque',
  '802': 'Invalid Input - Entrada no válida',
  '803': 'Voice API Error - Síntesis de voz falló',
};
```

### Uso en Servicios

```typescript
export async function fetchBackendResponse(
  message: string
): Promise<{ text: string }> {
  try {
    const response = await fetch(`${API_URL}/aurora/chats`, {
      method: 'POST',
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      const code = response.status.toString();
      ALBA.handleInternalError(code, `HTTP ${code}`);
      return { text: 'Disculpa, no pude conectar con el servidor' };
    }
    
    return await response.json();
  } catch (error) {
    ALBA.handleInternalError('800', error.message);
    return { text: 'Lo siento, hay un error en el servicio' };
  }
}
```

### Toast Notifications

```typescript
// Mostrar error amigable al usuario
ALBA.showToast({
  type: 'error',
  message: 'Hubo un problema al procesar tu compra',
  duration: 5000
});

// Mostrar éxito
ALBA.showToast({
  type: 'success',
  message: '¡Compra realizada con éxito!',
  duration: 3000
});
```

---

## 6️⃣ YOLI - Internacionalización

**Ubicación**: `src/modules/YOLI/`

### Responsabilidades

- Cambiar idioma en **toda la app**
- Traducir **mensajes dinámicos**
- Adaptar **síntesis de voz**
- Formatear **números/fechas por región**

### Idiomas Soportados

| Código | Idioma | Estado |
|--------|--------|--------|
| **es** | Español | ✅ Completo |
| **en** | English | ✅ Completo |

### Sistema i18n (i18next)

```typescript
import i18next from 'i18next';

// Configuración
await i18next.init({
  lng: 'es',
  resources: {
    es: { translation: spanishTranslations },
    en: { translation: englishTranslations }
  }
});

// Uso en componentes
const greeting = i18next.t('common.hello');  // "Hola" o "Hello"

// Cambiar idioma
i18next.changeLanguage('en');
```

### Archivos de Traducción

```
locales/
├── es/
│   ├── common.json       # Textos comunes
│   ├── ecommerce.json    # Tienda
│   ├── chat.json         # Chat
│   └── dashboard.json    # Admin
└── en/
    ├── common.json
    ├── ecommerce.json
    ├── chat.json
    └── dashboard.json
```

### Ejemplo de Traducción Dinámica

```json
// es/common.json
{
  "greeting": "Hola, {{name}}",
  "priceFormat": "€ {{amount}}"
}

// Uso
i18next.t('greeting', { name: 'Juan' });  // "Hola, Juan"
i18next.t('priceFormat', { amount: 99.99 }); // "€ 99.99"
```

---

## Interacción Entre Módulos (Caso de Uso)

### Escenario: Usuario pregunta sobre un producto disponible

```
1. Usuario escribe: "¿Está disponible el Turbo GT28R?"
   │
   ├─ AURORA.processUserInput()
   │  └─ Sanitiza: "¿está disponible el turbo gt28r?"
   │
   ├─ Enviar a backend
   │  └─ Respuesta: "Sí, tenemos stock disponible"
   │
   ├─ ANA.processUserMessage()
   │  └─ Detecta palabras positivas: "disponible" ✓
   │     Emoción: HAPPY
   │     Expression: smile
   │     Motion: haru_g_m02
   │
   ├─ LUCIA.adaptResponse()
   │  └─ Detecta: Pregunta sobre producto
   │     No necesita adaptación de accesibilidad
   │
   ├─ MARIA.orchestrate()
   │  └─ Coordina actualización del avatar
   │
   ├─ YOLI.translate()
   │  └─ Asegura respuesta en idioma actual
   │
   ├─ AURORA.speak()
   │  └─ Síntesis: "Sí, tenemos stock disponible"
   │     Idioma: español
   │     Lip-sync activado
   │
   └─ VtuberLive2D.render()
      └─ Avatar sonríe mientras habla ✨
```

---

## Diagrama de Comunicación

```
┌──────────────┐
│   Usuario    │
│   (Input)    │
└──────┬───────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│         AURORA (Sanitización)                │
│  ├─ Remove XSS                              │
│  ├─ Normalize                               │
│  └─ Validate                                │
└──────┬───────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│    Backend API Call                          │
│  POST /aurora/chats → { text: "..." }       │
└──────┬───────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│  ANA (Emotion Detection)                     │
│  ├─ Keyword matching                        │
│  ├─ Map to emotion                          │
│  └─ Select motion/expression                │
└──────┬───────────────────────────────────────┘
       │
       ├─ LUCIA (Intent)                      │
       │  └─ Adapt communication               │
       │                                       │
       ├─ MARIA (Orchestration)               │
       │  └─ Coordinate modules                │
       │                                       │
       ├─ YOLI (Translate)                    │
       │  └─ Apply language                    │
       │                                       │
       └─ ALBA (Error Check)                  │
          └─ Log & validate                    │
       │
       ▼
┌──────────────────────────────────────────────┐
│  AURORA (Voice + Avatar Update)              │
│  ├─ Synthesize speech                       │
│  ├─ Calculate lip-sync                      │
│  └─ Apply animations                        │
└──────┬───────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│   VtuberLive2D (Render)                      │
│   ├─ Apply expression                       │
│   ├─ Play motion                            │
│   ├─ Sync mouth                             │
│   └─ Update UI                              │
└──────┬───────────────────────────────────────┘
       │
       ▼
┌──────────────────────────────────────────────┐
│    Usuario ve/escucha respuesta              │
└──────────────────────────────────────────────┘
```

---

**Última actualización**: Enero 2026  
**Versión de Módulos**: 1.0 Emocional
