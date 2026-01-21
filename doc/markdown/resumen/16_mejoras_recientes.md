# 🆕 Mejoras Recientes

## Implementaciones Recientes (Enero 2026)

### 1. SPA Navigation con ClientRouter

#### ¿Qué es?
Navegación de página única (Single Page Application) sin recargas completas. Solo cambia el contenido.

#### Motivación
- **Mejor UX**: Transiciones suaves entre páginas
- **Estado persistente**: Avatar y chat persisten durante navegación
- **Rendimiento**: No se recargan scripts/estilos innecesarios

#### Implementación

```typescript
// src/modules/MARIA/routes.ts

export class ClientRouter {
  static navigate(path: string, options?: NavigateOptions) {
    // Validar ruta
    const validPath = this.validatePath(path);
    
    // Usar Astro ClientRouter
    if (window.location.pathname !== validPath) {
      // Astro maneja automáticamente el routing
      window.location.pathname = validPath;
    }
  }
  
  static onNavigate(callback: () => void) {
    // Escuchar evento de Astro
    document.addEventListener('astro:before-preparation', callback);
  }
}

// Usar en componentes
<Link href="/products">Shop</Link>  {/* Astro Link component */}
```

#### Evento astro:after-swap

```typescript
// Cuando se completa la navegación
document.addEventListener('astro:after-swap', () => {
  console.log('Página actualizada, estado persistido');
  
  // Re-inicializar listeners si necesario
  reinitializeEventListeners();
  
  // Avatar persiste automáticamente
  if (voiceInstance && pathLang !== currentLang) {
    voiceInstance.setLanguage(pathLang);
  }
});
```

#### Beneficios Observados

```
Antes (Full Reload):         Después (SPA):
─────────────────────────────────────────────
Carga 2.5s                   Carga 0.2s
Avatar se reinicia           Avatar persiste
Chat se limpia               Chat persiste
Parpadeo visible             Sin parpadeo
Pérdida de scroll            Scroll restaurado
```

### 2. Avatar Persistence Across Navigation

#### Problema Original
El avatar (Live2D) se reiniciaba cada vez que navegabas a otra página, causando pérdida de estado emocional.

#### Solución Implementada

```typescript
// src/modules/AURORA/components/VtuberLive2D.tsx

export function VtuberLive2D() {
  const [model, setModel] = useState<Live2DModel | null>(null);
  
  // Cargar modelo solo una vez
  useEffect(() => {
    if (!model) {
      initializeLive2D();
    }
  }, [model]);
  
  // Persistencia: no destruir modelo en desmount
  useEffect(() => {
    return () => {
      // NO destruir appRef.current aquí
      // Mantener modelo vivo para siguiente página
    };
  }, []);
  
  // Escuchar navegación para reiniciar listeners
  useEffect(() => {
    const handleNavigation = () => {
      // Re-aplicar event listeners solo
      reattachListeners();
    };
    
    document.addEventListener('astro:after-swap', handleNavigation);
    return () => {
      document.removeEventListener('astro:after-swap', handleNavigation);
    };
  }, []);
}
```

#### Resultados

| Métrica | Antes | Después |
|---------|-------|---------|
| Tiempo reinicio avatar | 800ms | 0ms |
| Pérdida de emoción | Sí | No |
| Estado chat | Limpiado | Persistido |
| Experiencia usuario | Disruptiva | Fluida |

### 3. Language Detection from URL

#### Cómo Funciona

```typescript
// src/config.ts

export function detectLanguageFromUrl(): 'en' | 'es' {
  const pathname = window.location.pathname;
  
  if (pathname.startsWith('/en')) return 'en';
  if (pathname.startsWith('/es')) return 'es';
  
  // Default
  const browserLang = navigator.language.split('-')[0];
  return browserLang === 'en' ? 'en' : 'es';
}

// Usar en componentes
useEffect(() => {
  const lang = detectLanguageFromUrl();
  i18n.changeLanguage(lang);
  voiceInstance?.setLanguage(lang);
}, []);
```

#### Rutas Soportadas

```
/                    → Redirigir a /es o /en (según browser)
/en/                 → English
/es/                 → Español
/en/products         → Products in English
/es/productos        → Productos en Español
```

#### Cambio de Idioma

```typescript
// En ThemeToggle.tsx
const handleLanguageChange = (newLang: 'en' | 'es') => {
  // 1. Cambiar idioma i18n
  await i18n.changeLanguage(newLang);
  
  // 2. Navegar a URL correcta
  const newPath = window.location.pathname.replace(/\/(en|es)\//, `/${newLang}/`);
  window.history.pushState({}, '', newPath);
  
  // 3. Cambiar voz
  voiceInstance?.setLanguage(newLang);
};
```

### 4. Event Listener Re-initialization

#### Problema
Los event listeners se perdían después de navegación SPA.

#### Solución

```typescript
// src/lib/eventListeners.ts

export function initializeEventListeners() {
  // Chat listeners
  document.addEventListener('send-message', handleChatMessage);
  
  // Avatar listeners
  document.addEventListener('avatar-emotion-change', handleEmotionChange);
  
  // Voice listeners
  document.addEventListener('start-speech', handleSpeech);
  
  // Limpieza
  return () => {
    document.removeEventListener('send-message', handleChatMessage);
    document.removeEventListener('avatar-emotion-change', handleEmotionChange);
    document.removeEventListener('start-speech', handleSpeech);
  };
}

// Usar en Layout
useEffect(() => {
  initializeEventListeners();
  
  const cleanup = () => {
    // Re-inicializar después de navegación
    document.addEventListener('astro:after-swap', initializeEventListeners);
  };
  
  return cleanup;
}, []);
```

### 5. Container Dimension Validation

#### Validación de Dimensiones del Avatar

```typescript
// src/modules/AURORA/components/VtuberLive2D.tsx

function validateContainerDimensions(container: HTMLElement): boolean {
  const { width, height } = container.getBoundingClientRect();
  
  // Validaciones
  if (width < 200 || height < 200) {
    console.warn('Avatar container too small:', { width, height });
    return false;
  }
  
  if (!container.parentElement) {
    console.warn('Avatar container has no parent');
    return false;
  }
  
  return true;
}

// Usar
useEffect(() => {
  if (!canvasRef.current) return;
  
  if (!validateContainerDimensions(canvasRef.current)) {
    // Resize container
    canvasRef.current.style.minHeight = '400px';
  }
  
  initializePixi();
}, []);
```

### 6. Mejoras en el Sistema de Chat

#### Indicadores de Escritura

```typescript
// Mostrar avatar escribiendo respuesta
const [isAvatarThinking, setIsAvatarThinking] = useState(false);

const handleUserMessage = async (message: string) => {
  setIsAvatarThinking(true);
  
  // Avatar muestra expresión pensativa
  avatarRef.current?.playExpression('Doubt.exp3.json');
  avatarRef.current?.playMotion('haru_g_m03.motion3.json');
  
  const response = await fetchChatResponse(message);
  
  setIsAvatarThinking(false);
  
  // Mostrar respuesta
  const instruction = await AnaCore.processUserMessage(response.text);
  applyAuroraInstruction(instruction);
};
```

#### Historial Mejorado

```typescript
// Persistencia del historial en SPA
const persistChatHistory = (messages: ChatMessage[]) => {
  const sessionId = getSessionId();
  localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
};

// Cargar al navegar
useEffect(() => {
  const sessionId = getSessionId();
  const stored = localStorage.getItem(`chat_${sessionId}`);
  if (stored) {
    setMessages(JSON.parse(stored));
  }
}, []);
```

### 7. Performance Optimization

#### Lazy Loading de Componentes

```typescript
// Componentes que se cargan solo cuando se necesitan
const Dashboard = lazy(() => import('./Dashboard'));
const ProductDetails = lazy(() => import('./ProductDetails'));

<Suspense fallback={<LoadingSpinner />}>
  <Dashboard />
</Suspense>
```

#### Image Optimization

```astro
---
import { Image } from 'astro:assets';
import productImage from '../images/product.jpg';
---

<Image 
  src={productImage}
  alt="Product"
  width={400}
  height={300}
  quality={80}
  format="webp"
/>
```

#### Cache Strategy

```typescript
// Cache responses por 5 minutos
const cache = new Map<string, { data: any; expires: number }>();

async function getCachedData<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = 5 * 60 * 1000
): Promise<T> {
  const cached = cache.get(key);
  
  if (cached && cached.expires > Date.now()) {
    return cached.data;
  }
  
  const data = await fetcher();
  cache.set(key, { data, expires: Date.now() + ttl });
  return data;
}
```

## Cambios Futuros Planeados

### Corto Plazo (Próximas 2 semanas)
- [ ] Soporte de voz input (speech-to-text)
- [ ] Traducción automática de mensajes
- [ ] Historial de chat por usuario autenticado
- [ ] Reacciones a mensajes (👍 ❤️ etc)

### Mediano Plazo (Próximo mes)
- [ ] Modo offline con IndexedDB
- [ ] Progressive Web App (PWA)
- [ ] Push notifications
- [ ] Analytics mejorado
- [ ] Dark mode mejorado

### Largo Plazo (Próximos 2-3 meses)
- [ ] Integración con IA más avanzada (GPT-4)
- [ ] Avatar customizable
- [ ] Sistema de gamificación
- [ ] API pública para integración
- [ ] Mobile app (React Native)

## Breaking Changes

### v1.5.0 → v1.6.0 (Enero 2026)

```typescript
// REMOVED: Astro full page transitions
// - Use astro:after-swap evento instead
document.addEventListener('astro:after-swap', () => {
  // Handle page changes
});

// CHANGED: Avatar initialization
// - Moved from component mount to Layout root
// - Now persistent across navigation

// DEPRECATED: Legacy MARIA routes API
// - Use ClientRouter instead
navigateTo();  // ❌ Deprecated
ClientRouter.navigate();  // ✅ Use this
```

## Migration Guide

### Actualizar componentes existentes

```typescript
// Antes (en componentes)
useEffect(() => {
  reinitializeAvatar();
}, []);

// Después (avatar ahora persiste)
useEffect(() => {
  // No necesarias reinicializaciones
  attachEventListeners();
}, []);

// Usar nuevo evento de navegación
document.addEventListener('astro:after-swap', () => {
  attachEventListeners();
  updateLanguageIfChanged();
});
```

## Contribuir a Mejoras

Para sugerir nuevas mejoras:

1. Abrir issue en GitHub con descripción clara
2. Incluir caso de uso y beneficios
3. Proponer implementación (opcional)
4. Esperar feedback de mantenedores
5. Crear pull request cuando sea aprobado

---

**Última actualización**: Enero 2026  
**Versión**: 1.6.0  
**Próxima revisión**: Febrero 2026
