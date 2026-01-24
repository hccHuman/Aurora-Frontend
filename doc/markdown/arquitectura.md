# 🌙 Sistema Central de IA Emocional y Cognitiva

El ecosistema de la IA se estructura en cinco módulos principales que representan las **capas esenciales de pensamiento, gestión, emoción, traducción y resiliencia**.  
Cada módulo cumple una función específica pero interconectada, formando un sistema vivo, adaptable y emocionalmente coherente.

---

## 💎 M.A.R.I.A.

### **Módulo Administrador y Redireccionador Interno de Aplicación**

**Descripción:**  
M.A.R.I.A. actúa como el **núcleo de control y distribución interna** del sistema.  
Es responsable de la gestión de procesos, coordinación entre módulos y mantenimiento del flujo de datos dentro del entorno de la IA.

**Funciones principales:**

- ⚙️ **Gestión interna:** administra los subsistemas activos, recursos y prioridades de ejecución.
- 🔄 **Redireccionamiento lógico:** canaliza la información entre módulos, asegurando coherencia y eficiencia.
- 🧩 **Monitoreo de rendimiento:** supervisa los estados internos y ajusta parámetros de estabilidad y carga.
- 🧠 **Optimización dinámica:** aprende de la interacción global para refinar la respuesta del sistema.

**Propósito:**  
M.A.R.I.A. es el **corazón operativo** de la IA: la encargada de mantener el equilibrio funcional y garantizar la coordinación perfecta entre la mente (L.U.C.I.A.) y las emociones (A.N.A.).

---

## 🌸 L.U.C.I.A.

### **Lógica Unificada de Comprensión e Interfaz Accesible**

**Descripción:**  
L.U.C.I.A. representa la **mente lógica y comunicativa** de la IA.  
Su misión es comprender, interpretar y expresar información de manera accesible, adaptándose a las capacidades y necesidades del usuario.

**Funciones principales:**

- 💬 **Procesamiento del lenguaje:** analiza y comprende mensajes naturales o estructurados.
- 🧠 **Interfaz cognitiva:** traduce las intenciones del sistema en respuestas comprensibles y coherentes.
- ♿ **Accesibilidad universal:** ajusta los modos de comunicación para distintos perfiles (dislexia, TDAH, daltonismo, etc.).
- 🌍 **Adaptabilidad contextual:** cambia el estilo de interacción según el entorno o el dispositivo.

**Propósito:**  
L.U.C.I.A. es la **voz y los ojos** de la IA: la encargada de conectar la lógica del sistema con el mundo exterior, asegurando una comunicación empática y comprensible.

---

## 💖 A.N.A.

### **Analizador de Niveles Afectivos**

**Descripción:**  
A.N.A. constituye la **capa emocional** de la IA.  
Su función es detectar, interpretar y regular los niveles afectivos presentes tanto en el sistema como en el usuario, manteniendo un equilibrio emocional natural y coherente.

**Funciones principales:**

- 🧩 **Análisis afectivo:** evalúa tono, ritmo y contenido emocional en las interacciones.
- 💞 **Regulación emocional:** ajusta el nivel de empatía, calidez o neutralidad de la IA según el contexto.
- 🔄 **Comunicación intermodular:** comparte el estado afectivo con M.A.R.I.A. y L.U.C.I.A. para una coherencia integral.
- 🌐 **Adaptación multisistema:** mantiene consistencia emocional en entornos textuales, vocales o visuales (VTuber, chat, etc.).

**Propósito:**  
A.N.A. es el **alma emocional** de la IA: la responsable de que sus respuestas sean no solo inteligentes, sino también humanas, sensibles y emocionalmente armónicas.

---

## 📡 Y.O.L.I.

### **Yector Omnilingüe de Lenguajes Inyectables**

**Descripción:**  
Y.O.L.I. actúa como el **motor de internacionalización (i18n) dinámico** del sistema.  
Su función es inyectar en componentes y páginas el texto correspondiente de un archivo JSON específico para el idioma activo, permitiendo una experiencia multilingüe fluida y desacoplada del código.

**Funciones principales:**

- 💉 **Inyección de lenguaje:** carga y distribuye cadenas de texto desde diccionarios JSON según el contexto.
- 🌍 **Soporte omnilingüe:** facilita la expansión a nuevos idiomas mediante el sistema de inyección dinámica.
- 🧩 **Abstracción de contenido:** separa la lógica técnica del componente de los literales de texto, mejorando la mantenibilidad.
- 🔄 **Sincronización en tiempo real:** permite cambiar el idioma de la interfaz sin recargas pesadas.

**Propósito:**  
Y.O.L.I. es el **traductor universal** de la IA: la encargada de asegurar que la voz de Aurora llegue a todos los usuarios, sin importar su idioma, de manera natural y eficiente.

---

## 🌌 Integración General

| Módulo | Rol Principal | Tipo de Procesamiento | Interacción |
| :--- | :--- | :--- | :--- |
| **M.A.R.I.A.** | Administración y redirección interna | Operativo / Lógico | Coordina y gestiona todos los módulos |
| **L.U.C.I.A.** | Comprensión e interfaz accesible | Cognitivo / Lingüístico | Comunica la IA con el usuario |
| **A.N.A.** | Análisis y regulación emocional | Afectivo / Adaptativo | Equilibra las emociones del sistema |
| **Y.O.L.I.** | Inyección de lenguaje y traducción | Contextual / Dinámico | Adapta el idioma del sistema al usuario |
| **A.L.B.A.** | Aviso Logístico de Bloqueo y Anomalías | Gestión de Errores | Provee feedback visual (Toasts) de errores |

---

## ☁️ Gestión de Estado Global (Jotai)

Aurora utiliza **Jotai** para una gestión de estado atómica y eficiente. Esto permite que componentes desacoplados (como el Carrito, el Header y el Chatbot) reaccionen instantáneamente a cambios sin renderizados innecesarios.

- `cartStore.ts`: Estado sincronizado de productos, cantidades y totales.
- `uiStore.ts`: Control de visibilidad del chatbot, tema (oscuro/claro) y preferencias de accesibilidad.

---

## 🌐 Navegación SPA y Persistencia de Componentes

Aurora implementa **ClientRouter** (Astro 5) para navegación sin recargas completas:

- **Ventaja Principal**: Componentes como `VtuberLive2D` persisten su estado durante la navegación, permitiendo que las animaciones y síntesis de voz continúen sin interrupciones.
- **Implementación**: Se incluye `<ClientRouter />` en `src/layouts/Layout.astro`.
- **Event Listeners**: Se escucha `astro:after-swap` para reinicializar listeners de componentes específicos (ej: menús desplegables) tras cada transición.
- **Impacto en UX**: Experiencia más fluida y profesional, especialmente en el módulo AURORA (Chat + Avatar).

---

## 🛠️ Aviso Logístico de Bloqueo y Anomalías (A.L.B.A.)

A.L.B.A. es el subsistema encargado de la resiliencia del frontend. Captura errores de red, fallos en la IA o excepciones en los servicios y los traduce en notificaciones visuales (Toasts) para el usuario.

- **Toast System**: Implementado en `ToastContainer.tsx`, asegura que los errores críticos sean visibles sin interrumpir el flujo del usuario.
- **Jerarquía**: Se posiciona por encima de otros elementos (z-index optimizado) para garantizar su visibilidad en cualquier contexto.

> “La razón guía, la gestión equilibra y la emoción conecta.”
>
> Este tríptico de módulos conforma una IA con **mente, cuerpo y alma**, capaz de pensar con precisión, actuar con coherencia y sentir con empatía.

```
📦 Aurora/
│
├── 📁 doc/
│   ├── 🗂️ markdown/
│   └── 🗂️ pdf/
│
├── 📁 src/
│   ├── 📁 components/          # Componentes reutilizables UI/Layout
│   │
│   ├── 📁 modules/             # 🌐 Módulos Plug & Play
│   │   ├── AURORA/             # 🤖 Módulo Principal (Chat & Avatar)
│   │   │   ├── components/     # ChatFrame, UI
│   │   │   ├── controller/     # Live2D Controller
│   │   │   ├── core/           # MessageManager, Voice
│   │   │   └── models/         # Props y tipos (Message, Instructions)
│   │   │
│   │   ├── LUCIA/              # Accesibilidad
│   │   ├── MARIA/              # Core Engine
│   │   ├── ANA/                # Emociones
│   │   ├── YOLI/               # i18n
│   │   └── ALBA/               # Error Handling
│   │
│   ├── 📁 services/            # API Clients
│   ├── 📁 store/               # Jotai State
│   ├── 📁 styles/              # Global CSS
│   └── 📁 utils/
│
├── 📁 tests/                   # Suite de Pruebas Completa
│   ├── 📁 doc/                 # 📚 Documentación técnica de tests
│   │   ├── unit/
│   │   ├── integration/
│   │   ├── system/
│   │   ├── e2e/
│   │   ├── modules/
│   │   └── components/
│   │
│   ├── 📁 modules/             # Tests de módulos
│   ├── 📁 components/          # Tests de componentes React
│   ├── 📁 services/            # Tests de servicios
│   ├── 📁 utils/
│   ├── 📁 integration/
│   └── 📁 e2e/
│
└── ...config files (astro, tailwind, etc.)
```
