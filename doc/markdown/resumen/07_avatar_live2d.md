# 🤖 Avatar Virtual Live2D

## Visión General

El **avatar Haru** es el corazón visual de Aurora. Es un modelo **Live2D Cubism v4.2.4** renderizado con **PIXI.js**, capaz de expresar emociones, hablar y moverse naturalmente.

## Características del Avatar

| Aspecto | Descripción |
|--------|-------------|
| **Nombre** | Haru (春 - Primavera) |
| **Género** | Femenino |
| **Estilo** | Anime chibi-realista |
| **Formato** | Live2D Cubism 4.2.4 |
| **Motor Render** | PIXI.js 6.5.8 |
| **Resolución** | Escalable (adaptativa) |

## Estructura de Archivos

```
public/models/haru/
├── haru_greeter_t05.model3.json     # Archivo modelo principal
├── haru_greeter_t05.physics3.json   # Física (movimiento natural)
├── haru_greeter_t05.userdata3.json  # Datos del usuario
│
├── runtime/
│   ├── haru_greeter_t05.cmo3        # Estructura 3D compilada
│   │
│   ├── expressions/                  # 8 expresiones faciales
│   │   ├── Angry.exp3.json          # Enfadado
│   │   ├── Doubt.exp3.json          # Dudoso
│   │   ├── Happy.exp3.json          # Feliz
│   │   ├── Neutral.exp3.json        # Neutral
│   │   ├── Sad.exp3.json            # Triste
│   │   ├── Smile.exp3.json          # Sonrisa
│   │   ├── Surprised.exp3.json      # Sorprendido
│   │   └── Worried.exp3.json        # Preocupado
│   │
│   ├── motion/                       # ~20 animaciones corporales
│   │   ├── haru_g_idle.motion3.json         # Reposo (default)
│   │   ├── haru_g_m01.motion3.json         # Saludo
│   │   ├── haru_g_m02.motion3.json         # Sonrisa/celebración
│   │   ├── haru_g_m03.motion3.json         # Pensamiento
│   │   ├── haru_g_m04.motion3.json         # Sorpresa
│   │   ├── haru_g_m05.motion3.json         # Gesto explicativo
│   │   ├── haru_g_m06.motion3.json         # Asentimiento
│   │   ├── haru_g_m07.motion3.json         # Negación
│   │   ├── haru_g_m08.motion3.json         # Tristeza
│   │   └── ...más motions
│   │
│   ├── textures/                    # Texturas del modelo
│   │   ├── haru_greeter_t05.2048/
│   │   │   ├── haru_body_01.png
│   │   │   ├── haru_face_01.png
│   │   │   ├── haru_hair_01.png
│   │   │   ├── haru_eyes_01.png
│   │   │   └── ...más texturas
│   │   └── haru_greeter_t05.1024/  # Versión optimizada
│   │
│   └── sounds/                      # Sonidos (opcional)
│       └── ... audio files
│
└── physics/
    └── haru_greeter_t05.physics3.json
```

## Componente VtuberLive2D.tsx

```typescript
// Ubicación: src/modules/AURORA/components/VtuberLive2D.tsx

import { useEffect, useRef, useState } from 'react';
import * as PIXI from 'pixi.js';
import { Live2DModel } from 'pixi-live2d-display';
import { AuroraVoiceLocal } from '@/modules/AURORA/core/AuroraVoice';

export interface VtuberLive2DProps {
  className?: string;
  modelPath?: string;
}

export function VtuberLive2D({
  className = '',
  modelPath = '/models/haru/haru_greeter_t05.model3.json'
}: VtuberLive2DProps) {
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);
  const modelRef = useRef<Live2DModel | null>(null);
  const [voiceInstance, setVoiceInstance] = useState<AuroraVoiceLocal | null>(null);
  
  useEffect(() => {
    // 1. Detectar idioma de URL
    const pathLang = window.location.pathname.includes("/en/") ? "en" : "es";
    
    // 2. Crear instancia de voz si no existe
    if (!voiceInstance) {
      const newVoice = new AuroraVoiceLocal(pathLang);
      setVoiceInstance(newVoice);
    } else {
      // 3. Cambiar idioma si cambió la URL
      if (voiceInstance.currentLang !== pathLang) {
        voiceInstance.setLanguage(pathLang);
      }
    }
  }, [voiceInstance]);
  
  useEffect(() => {
    if (!canvasRef.current) return;
    
    // Inicializar PIXI
    const initPixi = async () => {
      try {
        // Crear aplicación PIXI
        const app = new PIXI.Application({
          view: undefined,
          resolution: window.devicePixelRatio,
          autoDensity: true,
          backgroundColor: 0xffffff,
          width: canvasRef.current!.clientWidth,
          height: canvasRef.current!.clientHeight
        });
        
        canvasRef.current.appendChild(app.view as HTMLCanvasElement);
        appRef.current = app;
        
        // Cargar modelo Live2D
        const model = await Live2DModel.from(modelPath);
        modelRef.current = model;
        
        // Configurar modelo
        model.scale.set(0.28);
        model.x = app.view.width * 0.5;
        model.y = app.view.height * 0.5;
        
        app.stage.addChild(model);
        
        // Registrar ticker
        Live2DModel.registerTicker(PIXI.Ticker.shared);
        
      } catch (error) {
        console.error('Error initializing avatar:', error);
      }
    };
    
    initPixi();
    
    // Cleanup
    return () => {
      if (appRef.current) {
        appRef.current.destroy();
      }
    };
  }, [modelPath]);
  
  // Métodos públicos para control
  const playExpression = (expression: string) => {
    if (modelRef.current) {
      const url = `/models/haru/runtime/expressions/${expression}.exp3.json`;
      modelRef.current.expression?.setExpression(url);
    }
  };
  
  const playMotion = (motion: string, group = 'motion') => {
    if (modelRef.current) {
      const url = `/models/haru/runtime/motion/${motion}.motion3.json`;
      modelRef.current.motion?.startMotion(url, group, 4);
    }
  };
  
  return (
    <div 
      ref={canvasRef} 
      className={`w-full h-full bg-white rounded-lg shadow-lg ${className}`}
    />
  );
}

export default VtuberLive2D;
```

## Sistema de Lip-Sync (Sincronización Labial)

```typescript
// Ubicación: src/modules/AURORA/core/AuroraVoice.ts

public emitLipSyncEvents(text: string): void {
  // Estimar duración basada en caracteres
  const estimatedDuration = Math.max(2000, text.length * 50);
  
  // Emitir eventos de lip-sync cada 50ms
  let elapsed = 0;
  const interval = setInterval(() => {
    if (elapsed >= estimatedDuration) {
      clearInterval(interval);
      return;
    }
    
    // Generar valor de apertura de boca (0-1)
    const mouthOpenValue = Math.sin(elapsed / 100) * 0.5 + 0.5;
    
    // Emitir evento global
    window.dispatchEvent(new CustomEvent('aurora-lipsync', {
      detail: { value: mouthOpenValue }
    }));
    
    elapsed += 50;
  }, 50);
}
```

## Mapeo de Emociones a Animaciones

```typescript
// Mapeo completo de emociones
const EMOTION_ANIMATIONS = {
  happy: {
    expression: 'Happy.exp3.json',
    motion: 'haru_g_m02.motion3.json',
    description: 'Sonrisa amplia con movimiento de celebración'
  },
  
  sad: {
    expression: 'Sad.exp3.json',
    motion: 'haru_g_m08.motion3.json',
    description: 'Expresión triste con movimiento de consuelo'
  },
  
  surprised: {
    expression: 'Surprised.exp3.json',
    motion: 'haru_g_m04.motion3.json',
    description: 'Ojos abiertos, boca sorprendida'
  },
  
  neutral: {
    expression: 'Neutral.exp3.json',
    motion: 'haru_g_idle.motion3.json',
    description: 'Posición por defecto'
  },
  
  angry: {
    expression: 'Angry.exp3.json',
    motion: 'haru_g_m05.motion3.json',
    description: 'Cejas fruncidas, movimiento enérgico'
  },
  
  worried: {
    expression: 'Worried.exp3.json',
    motion: 'haru_g_m03.motion3.json',
    description: 'Expresión preocupada'
  }
};
```

## Parámetros Animables del Modelo

El modelo Live2D expone parámetros que pueden ser controlados:

```
ParamMouthOpenY      # Apertura vertical de la boca
ParamMouthOpen       # Apertura general de la boca
ParamMouthOpenX      # Apertura horizontal
ParamEyeLOpen        # Apertura ojo izquierdo
ParamEyeROpen        # Apertura ojo derecho
ParamBrowLY          # Altura ceja izquierda
ParamBrowRY          # Altura ceja derecha
ParamEyeBallX        # Dirección horizontal mirada
ParamEyeBallY        # Dirección vertical mirada
ParamBodyAngleX      # Rotación cabeza X
ParamBodyAngleY      # Rotación cabeza Y
ParamBodyAngleZ      # Rotación cabeza Z
```

## Adaptación por Dispositivo

```typescript
const getAvatarConfig = (device: 'desktop' | 'tablet' | 'mobile') => {
  switch(device) {
    case 'desktop':
      return {
        scale: 0.28,
        positionX: 0.5,
        positionY: 0.45,
        clipHeight: 'none'  // Sin clipping
      };
    
    case 'tablet':
      return {
        scale: 0.22,
        positionX: 0.5,
        positionY: 0.40,
        clipHeight: 'none'
      };
    
    case 'mobile':
      return {
        scale: 0.18,
        positionX: 0.5,
        positionY: 0.35,
        clipHeight: '600px'  // Clipping para no tapar chat
      };
  }
};
```

## Evento de Persistencia (astro:after-swap)

```typescript
// Cuando el usuario navega sin recargar (SPA)
document.addEventListener('astro:after-swap', () => {
  // El avatar persiste automáticamente
  // Solo reinicializar listeners si es necesario
  
  const pathLang = window.location.pathname.includes("/en/") ? "en" : "es";
  if (voiceRef.current && voiceRef.current.currentLang !== pathLang) {
    voiceRef.current.setLanguage(pathLang);
  }
});
```

## Ejemplo de Uso Completo

```typescript
// En VtuberLive2D.tsx
const avatarRef = useRef();

// Aplicar instrucción del avatar
const applyAuroraInstruction = (instruction: AuroraInstruction) => {
  if (!avatarRef.current) return;
  
  // Aplicar expresión
  avatarRef.current.playExpression(instruction.expression);
  
  // Aplicar movimiento
  setTimeout(() => {
    avatarRef.current.playMotion(instruction.motion);
  }, 100);
  
  // Reproducir voz
  if (instruction.text) {
    voiceInstance.speak(instruction.text);
  }
};

// Llamar cuando haya nueva instrucción
useEffect(() => {
  if (currentInstruction) {
    applyAuroraInstruction(currentInstruction);
  }
}, [currentInstruction]);
```

## Performance Optimization

```typescript
// Mipmap para texturas (mejor rendimiento en zoom)
const mipmapSettings = {
  minFilter: PIXI.SCALE_MODES.LINEAR,
  magFilter: PIXI.SCALE_MODES.LINEAR,
  mipmap: true
};

// Usar WebGL con fallback Canvas
const app = new PIXI.Application({
  preference: 'webgl',
  antialias: true,
  ...mipmapSettings
});

// Reducir ticker si está fuera de pantalla
if (document.hidden) {
  PIXI.Ticker.shared.speed = 0;
} else {
  PIXI.Ticker.shared.speed = 1;
}
```

## Debugging del Avatar

```typescript
// Log de parámetros detectados
const logDetectedParameters = (model: Live2DModel) => {
  const params = model.internalModel.parameters;
  console.log('Detected parameters:', params.map(p => p.id));
};

// Probar expresión
window.testExpression = (name: string) => {
  avatarRef.current?.playExpression(name);
};

// Probar movimiento
window.testMotion = (name: string) => {
  avatarRef.current?.playMotion(name);
};

// En consola: testExpression('Happy'), testMotion('haru_g_m02')
```

## Propiedades en Vivo del Avatar

El avatar es **responsive** a:
- ✅ Cambios de emoción
- ✅ Entrada de usuario
- ✅ Respuesta del backend
- ✅ Cambio de idioma
- ✅ Navegación entre páginas (SPA)
- ✅ Tamaño de pantalla

---

**Última actualización**: Enero 2026  
**Modelo**: Haru Greeter T05  
**SDK**: Live2D Cubism 4.2.4
