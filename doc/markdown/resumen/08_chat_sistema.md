# 💬 Sistema de Chat

## Visión General

El sistema de chat de Aurora integra **entrada de usuario → procesamiento IA → respuesta con avatar emocional**. Es el centro de la interacción usuario-IA.

## Arquitectura del Chat

```
┌─────────────────┐
│  Chat UI        │
│  (Input form)   │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────┐
│ AURORA Message Pipeline     │
│ (Sanitización + validación) │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Backend API Call            │
│ POST /aurora/chats          │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ ANA Emotion Detection       │
│ (Keywords → Emotion mapping)│
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Avatar + Voice Synthesis    │
│ (Expression + Animation)    │
└────────┬────────────────────┘
         │
         ▼
┌─────────────────────────────┐
│ Display Response            │
│ (Chat bubble + Avatar)      │
└─────────────────────────────┘
```

## Componentes Principales

### ChatContainer.tsx

```typescript
// Ubicación: src/components/tsx/ChatContainer/ChatContainer.tsx

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
  expression?: string;
  motion?: string;
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error?: string;
  currentInstruction?: AuroraInstruction;
}

export function ChatContainer() {
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isLoading: false,
  });
  
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Auto-scroll al último mensaje
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);
  
  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-purple-50 to-blue-50">
      {/* Chat messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.map((msg) => (
          <ChatMessage key={msg.id} message={msg} />
        ))}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Input area */}
      <ChatInput 
        onSendMessage={handleSendMessage}
        isLoading={chatState.isLoading}
      />
    </div>
  );
}
```

### ChatInput.tsx

```typescript
// Ubicación: src/components/tsx/ChatInput/ChatInput.tsx

export function ChatInput({ onSendMessage, isLoading }: ChatInputProps) {
  const [input, setInput] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isLoading) return;
    
    const message = input.trim();
    setInput('');
    
    // Restablecer altura del textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
    
    // Llamar callback
    await onSendMessage(message);
  };
  
  // Auto-resize del textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t bg-white">
      <div className="flex gap-2">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={handleInputChange}
          placeholder="Escribe tu mensaje..."
          disabled={isLoading}
          rows={1}
          className="flex-1 p-2 border rounded-lg resize-none"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e as any);
            }
          }}
        />
        <button
          type="submit"
          disabled={isLoading || !input.trim()}
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
        >
          {isLoading ? '...' : '→'}
        </button>
      </div>
    </form>
  );
}
```

### ChatMessage.tsx

```typescript
// Ubicación: src/components/tsx/ChatMessage/ChatMessage.tsx

export function ChatMessage({ message }: { message: ChatMessage }) {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div
        className={`max-w-xs p-3 rounded-lg ${
          isUser
            ? 'bg-purple-600 text-white rounded-br-none'
            : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-75 mt-1 block">
          {message.timestamp.toLocaleTimeString()}
        </span>
      </div>
    </div>
  );
}
```

## Flujo Completo de Mensajes

### 1. Entrada del Usuario

```typescript
// Usuario escribe "Me siento muy feliz hoy" y presiona Enter
const message = "Me siento muy feliz hoy";
handleSendMessage(message);
```

### 2. Validación y Sanitización (AURORA)

```typescript
// src/modules/AURORA/core/AuroraMessageManager.ts
const processUserInput = (raw: string): Promise<string> => {
  // 1. Validar largo (max 500 caracteres)
  if (raw.length > 500) {
    throw new Error('Message too long');
  }
  
  // 2. Sanitizar (remover HTML/scripts)
  const sanitized = DOMPurify.sanitize(raw, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: []
  });
  
  // 3. Normalizar (minúsculas, espacios)
  const normalized = sanitized.toLowerCase().trim();
  
  // 4. Detección de spam
  if (isSpam(normalized)) {
    throw new Error('Spam detected');
  }
  
  return normalized;
};
```

### 3. Llamada al Backend

```typescript
// src/services/chatService.ts
export async function fetchChatResponse(message: string) {
  try {
    const response = await fetch(`${apiUrl}/aurora/chats`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${getToken()}`  // Si existe auth
      },
      body: JSON.stringify({ message })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.text || data;
    
  } catch (error) {
    console.error('Chat service error:', error);
    
    // Fallback message
    return {
      text: "Disculpa, tengo problemas para conectar. Intenta más tarde 😔",
      emotion: 'sad'
    };
  }
}
```

### 4. Detección de Emoción (ANA)

```typescript
// src/modules/ANA/AnaEmotionMap.ts
const EMOTION_KEYWORDS = {
  happy: ['feliz', 'alegre', 'contento', 'genial', 'perfecto', 'excelente'],
  sad: ['triste', 'deprimido', 'mal', 'llorar', 'sufrir', 'melancolía'],
  neutral: ['hola', 'qué tal', 'ok', 'entiendo', 'claro'],
  surprised: ['wow', 'increíble', 'sorprendido', 'nunca pensé', 'no esperaba'],
  angry: ['furioso', 'enojado', 'rabia', '¡!', 'odio']
};

const detectEmotion = (text: string): AuroraInstruction => {
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    if (keywords.some(kw => text.includes(kw))) {
      return {
        emotion,
        expression: EMOTION_EXPRESSIONS[emotion],
        motion: EMOTION_MOTIONS[emotion],
        text: backendResponse.text
      };
    }
  }
  
  // Default
  return {
    emotion: 'neutral',
    expression: 'Neutral.exp3.json',
    motion: 'haru_g_idle.motion3.json',
    text: backendResponse.text
  };
};
```

### 5. Aplicar Respuesta al Avatar

```typescript
// VtuberLive2D.tsx
const applyAuroraInstruction = (instruction: AuroraInstruction) => {
  // 1. Cambiar expresión
  avatarRef.current.playExpression(instruction.expression);
  
  // 2. Reproducir movimiento
  setTimeout(() => {
    avatarRef.current.playMotion(instruction.motion);
  }, 100);
  
  // 3. Reproducir voz (TTS)
  if (instruction.text && voiceInstance) {
    voiceInstance.speak(instruction.text);
  }
  
  // 4. Mostrar mensaje en chat
  addMessageToChat({
    role: 'assistant',
    content: instruction.text,
    emotion: instruction.emotion
  });
};
```

## Almacenamiento de Historial

### ChatStore (Jotai)

```typescript
// src/store/chatStore.ts
import { atom } from 'jotai';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  emotion?: string;
}

// Atom para historial
export const chatMessagesAtom = atom<ChatMessage[]>([]);

// Atom para sesión actual
export const currentSessionAtom = atom<string | null>(null);

// Persistencia en localStorage
export const persistChatHistory = (messages: ChatMessage[]) => {
  const sessionId = generateSessionId();
  localStorage.setItem(`chat_${sessionId}`, JSON.stringify(messages));
  return sessionId;
};

// Cargar historial
export const loadChatHistory = (sessionId: string): ChatMessage[] => {
  const stored = localStorage.getItem(`chat_${sessionId}`);
  return stored ? JSON.parse(stored) : [];
};
```

## Atajos de Teclado

| Atajo | Acción |
|-------|--------|
| `Enter` | Enviar mensaje |
| `Shift+Enter` | Nueva línea en textarea |
| `Escape` | Cerrar chat/focus fuera |
| `Ctrl+L` | Limpiar historial |
| `Ctrl+/` | Mostrar ayuda |

## Integración con Voice (TTS)

```typescript
// src/modules/AURORA/core/AuroraVoice.ts

export class AuroraVoiceLocal {
  private synth: SpeechSynthesis;
  private utterance: SpeechSynthesisUtterance;
  public currentLang: string;
  
  constructor(language: 'es' | 'en' = 'es') {
    this.synth = window.speechSynthesis;
    this.currentLang = language;
    
    this.utterance = new SpeechSynthesisUtterance();
    this.utterance.lang = language === 'es' ? 'es-ES' : 'en-US';
    this.utterance.rate = 0.9;  // Poco más lento
    this.utterance.pitch = 1.1; // Un poco más agudo
    this.utterance.volume = 1;
  }
  
  speak(text: string): Promise<void> {
    return new Promise((resolve) => {
      // Limpiar síntesis anterior
      this.synth.cancel();
      
      // Configurar nuevo mensaje
      this.utterance.text = text;
      
      // Eventos
      this.utterance.onend = () => resolve();
      this.utterance.onerror = () => resolve();
      
      // Emit lip-sync events
      this.emitLipSyncEvents(text);
      
      // Hablar
      this.synth.speak(this.utterance);
    });
  }
  
  setLanguage(lang: 'es' | 'en') {
    this.currentLang = lang;
    this.utterance.lang = lang === 'es' ? 'es-ES' : 'en-US';
  }
  
  stop(): void {
    this.synth.cancel();
  }
}
```

## Manejo de Errores

```typescript
const handleChatError = (error: ChatError) => {
  switch (error.code) {
    case '800':  // Service unavailable
      showToast('Servidor no disponible. Intenta más tarde', 'error');
      break;
    
    case '400':  // Bad request
      showToast('Mensaje inválido', 'error');
      break;
    
    case '429':  // Rate limit
      showToast('Demasiados mensajes. Espera un momento', 'warning');
      break;
    
    default:
      showToast('Error desconocido', 'error');
  }
};
```

## Indicadores de Estado

```
USER INPUT
│
├── Enviando...         (Loading spinner)
│
├── Procesando...       (Avatar thinking animation)
│
├── Generando respuesta (Avatar moving)
│
└── Respuesta lista     (Message appears with animation)
```

## Características Planeadas

- [ ] Historial persistente por usuario
- [ ] Búsqueda en historial
- [ ] Reacción a mensajes (👍 👎 ❤️)
- [ ] Exportar conversación
- [ ] Modo voz (voice input)
- [ ] Traducción automática
- [ ] Sugerencias de respuesta (quick replies)
- [ ] Typing indicator del avatar

---

**Última actualización**: Enero 2026  
**Idiomas soportados**: Español, English  
**Modelo IA backend**: TBD (configurable)
