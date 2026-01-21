# 🎨 Patrones y Convenciones de Código

## Convenciones de Nombres

### Componentes React

```typescript
// ✅ Correcto: PascalCase con nombre descriptivo
function ProductCard() {}
function ChatInput() {}
function VtuberLive2D() {}

// ❌ Incorrecto
function productCard() {}
function ChatI() {}
function Avatar() {}  // Muy genérico
```

### Directorios de Componentes

```
src/components/tsx/
├── ProductCard/
│   ├── ProductCard.tsx          # Componente principal
│   ├── ProductCardProps.ts      # Props interface
│   ├── index.tsx                # Re-export
│   └── ProductCard.module.css   # Estilos (opcional)
│
├── ChatContainer/
│   ├── ChatContainer.tsx
│   ├── ChatContainerProps.ts
│   └── index.tsx
│
└── VtuberLive2D/
    ├── VtuberLive2D.tsx
    ├── VtuberLive2DProps.ts
    └── index.tsx
```

### Variables y Constantes

```typescript
// ✅ Correcto
const MAX_MESSAGE_LENGTH = 500;
const productList: Product[] = [];
let currentSelectedId = null;
const handleAddToCart = () => {};

// ❌ Incorrecto
const max_message_length = 500;           // snake_case
const PRODUCTLIST = [];                   // ALL_CAPS para no-constantes
const currentselectedid = null;           // sin camelCase
const add_to_cart = () => {};            // arrow functions en camelCase
```

### Booleans

```typescript
// ✅ Correcto: prefijo is/has/can
const isLoading = true;
const hasError = false;
const canEditProduct = true;

// ❌ Incorrecto
const loading = true;
const error = false;
const editProduct = true;  // Ambiguo
```

### Funciones Async

```typescript
// ✅ Correcto
const fetchProducts = async () => {};
const loadUserProfile = async () => {};

// ❌ Incorrecto
const getAsync = async () => {};  // Muy genérico
const products = async () => {};  // Suena como variable
```

## Estructura de Archivos

### Organización de Imports

```typescript
// src/components/tsx/ChatContainer/ChatContainer.tsx

// 1. React y librerías externas
import { useEffect, useState, useRef } from 'react';
import { useAtom } from 'jotai';

// 2. Módulos internos (@ alias)
import { AuroraMessageManager } from '@/modules/AURORA/core/AuroraMessageManager';
import { AnaCore } from '@/modules/ANA/AnaCore';

// 3. Servicios
import { fetchChatResponse } from '@/services/chatService';

// 4. Componentes locales
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';

// 5. Tipos e interfaces
import type { ChatMessage as ChatMessageType } from '@/models/ChatProps';

// 6. Estilos (último)
import './ChatContainer.css';
```

### Ordre de Métodos en Clase/Componente

```typescript
export function ChatContainer() {
  // 1. Estado local
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 2. Estado global (Jotai)
  const [cartItems] = useAtom(cartAtom);
  
  // 3. Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // 4. Effects
  useEffect(() => {
    loadMessages();
  }, []);
  
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // 5. Manejadores (handlers)
  const handleSendMessage = async (message: string) => {};
  const handleClearHistory = () => {};
  
  // 6. Lógica auxiliar
  const processMessage = (msg: string) => msg.trim().toLowerCase();
  
  // 7. Render
  return (
    <div>
      {/* JSX */}
    </div>
  );
}
```

## Patrones de Componentes

### Componente Simple (Presentacional)

```typescript
// ✅ Patrón: Componente simple sin lógica
interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

export function Button({
  children,
  onClick,
  disabled = false,
  variant = 'primary'
}: ButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`btn btn-${variant} ${disabled ? 'opacity-50' : ''}`}
    >
      {children}
    </button>
  );
}

export default Button;
```

### Componente Contenedor (Inteligente)

```typescript
// ✅ Patrón: Componente que maneja lógica
export function ProductListContainer() {
  // Lógica de estado y efectos
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Efecto para cargar datos
  useEffect(() => {
    const load = async () => {
      try {
        setIsLoading(true);
        const data = await getProducts();
        setProducts(data);
      } catch (err) {
        setError('Failed to load products');
      } finally {
        setIsLoading(false);
      }
    };
    
    load();
  }, []);
  
  // Renderizar componente presentacional
  return (
    <ProductList
      products={products}
      isLoading={isLoading}
      error={error}
      onRetry={() => window.location.reload()}
    />
  );
}
```

### Composición de Componentes

```typescript
// ✅ Patrón: Componentes pequeños y reutilizables

// Avatar.tsx
export function Avatar({ src, alt }: { src: string; alt: string }) {
  return <img src={src} alt={alt} className="w-10 h-10 rounded-full" />;
}

// UserCard.tsx
export function UserCard({ user }: { user: User }) {
  return (
    <div className="p-4 border rounded">
      <Avatar src={user.avatar} alt={user.name} />
      <h3>{user.name}</h3>
      <p>{user.email}</p>
    </div>
  );
}

// UserList.tsx
export function UserList({ users }: { users: User[] }) {
  return (
    <div className="grid gap-4">
      {users.map(user => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
}
```

## Patrones de Servicio

### Servicio Async-Safe

```typescript
// ✅ Patrón: Servicio con manejo de errores
export async function getProducts(
  category?: string
): Promise<Product[]> {
  try {
    const query = new URLSearchParams();
    if (category) query.append('category', category);
    
    const response = await fetch(
      `${API_URL}/products?${query.toString()}`,
      {
        signal: AbortSignal.timeout(10000)  // Timeout
      }
    );
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Product service error:', error);
    return [];  // Fallback seguro
  }
}
```

### Servicio Singleton (Módulos IA)

```typescript
// ✅ Patrón: Singleton para módulos IA
class AnaEmotionAnalyzer {
  private static instance: AnaEmotionAnalyzer;
  private emotionMap: EmotionMap;
  
  private constructor() {
    this.emotionMap = loadEmotionConfig();
  }
  
  static getInstance(): AnaEmotionAnalyzer {
    if (!AnaEmotionAnalyzer.instance) {
      AnaEmotionAnalyzer.instance = new AnaEmotionAnalyzer();
    }
    return AnaEmotionAnalyzer.instance;
  }
  
  analyze(text: string): AuroraInstruction {
    const emotion = this.detectEmotion(text);
    return this.emotionMap[emotion];
  }
}

export const AnaCore = AnaEmotionAnalyzer.getInstance();
```

## Manejo de Errores

### Try-Catch Seguro

```typescript
// ✅ Correcto: Captura y registro adecuado
async function loadData() {
  try {
    const data = await fetchData();
    return data;
  } catch (error) {
    // Registrar error específico
    if (error instanceof NetworkError) {
      console.error('Network connectivity issue:', error);
      return getLocalCache();  // Fallback
    }
    
    if (error instanceof TypeError) {
      console.error('Invalid response format:', error);
      return [];  // Default seguro
    }
    
    // Error desconocido
    console.error('Unexpected error:', error);
    return [];  // Default seguro
  }
}

// ❌ Incorrecto: Ignorar errores
function loadData() {
  const data = fetchData();  // Error potencial no manejado
  return data;
}
```

### Custom Error Classes

```typescript
// ✅ Usar clases de error específicas
class ChatServiceError extends Error {
  constructor(
    public code: string,
    message: string
  ) {
    super(message);
    this.name = 'ChatServiceError';
  }
}

// Usar
throw new ChatServiceError('800', 'Service unavailable');

// Capturar
try {
  await fetchChatResponse(message);
} catch (error) {
  if (error instanceof ChatServiceError) {
    showErrorNotification(error.code);
  }
}
```

## Type Safety

### Props con Interfaces

```typescript
// ✅ Correcto: Interfaz clara
interface ProductProps {
  id: number;
  name: string;
  price: number;
  inStock: boolean;
  onAddToCart: (productId: number) => void;
  onViewDetails?: () => void;  // Opcional
}

export function Product({
  id,
  name,
  price,
  inStock,
  onAddToCart,
  onViewDetails
}: ProductProps) {
  return (
    <div>
      {/* JSX */}
    </div>
  );
}

// ❌ Incorrecto: Props de tipo any
export function Product(props: any) {
  return <div>{props.name}</div>;
}
```

### Tipos para Estado

```typescript
// ✅ Correcto: Tipos explícitos
const [user, setUser] = useState<User | null>(null);
const [error, setError] = useState<Error | null>(null);
const [count, setCount] = useState<number>(0);

// ❌ Incorrecto: Inferencia pobre
const [user, setUser] = useState();  // any
const [error, setError] = useState('');  // string, ¿por qué?
```

## Estilos y CSS

### Convención BEM

```css
/* Bloque */
.product-card { }

/* Elemento */
.product-card__image { }
.product-card__title { }
.product-card__price { }

/* Modificador */
.product-card--featured { }
.product-card__button--disabled { }
```

### Clases Tailwind

```tsx
// ✅ Correcto: Clases ordenadas
<button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 transition-colors" />

// ❌ Incorrecto: Desordenadas
<button className="hover:bg-purple-700 bg-purple-600 rounded-lg py-2 px-4 text-white" />
```

## Comments y Documentación

### Cuándo Comentar

```typescript
// ✅ Comentar lo NO OBVIO
// Usar setTiemout para permitir que Astro termine SSR antes de iniciar PIXI
setTimeout(() => {
  initializePixiApp();
}, 100);

// ❌ Comentar lo OBVIO
// Incrementar contador
count++;

// Obtener usuario por ID
const user = users.find(u => u.id === userId);
```

### Formato de Comentarios

```typescript
// Comentario simple para una línea
const name = user.name;

/*
  Comentario multi-línea para explicar
  lógica compleja o decisiones de diseño
*/
function complexLogic() {
  // ...
}

/**
 * JSDoc para funciones y clases
 * @param x Primer parámetro
 * @returns Descripción del retorno
 */
function myFunction(x: number): string {
  return x.toString();
}
```

## Testing Best Practices

### Nombres de Tests

```typescript
// ✅ Correcto: Describe lo que hace
it('should add product to cart when button is clicked', () => {});
it('should display error message when API fails', () => {});
it('should filter products by category', () => {});

// ❌ Incorrecto: Vago o técnico
it('works', () => {});
it('test add', () => {});
it('productCardClick', () => {});
```

### Estructura de Tests

```typescript
describe('ChatService', () => {
  // Setup
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  // Tests agrupados por funcionalidad
  describe('fetchChatResponse', () => {
    it('should return response on success', async () => {
      // Arrange
      const message = 'Hello';
      jest.spyOn(global, 'fetch').mockResolvedValueOnce({
        ok: true,
        json: () => ({ text: 'Hi!' })
      });
      
      // Act
      const result = await fetchChatResponse(message);
      
      // Assert
      expect(result.text).toBe('Hi!');
    });
    
    it('should return fallback on error', async () => {
      // Arrange
      jest.spyOn(global, 'fetch').mockRejectedValueOnce(new Error('Network'));
      
      // Act
      const result = await fetchChatResponse('Hello');
      
      // Assert
      expect(result.text).toContain('sorry');
    });
  });
});
```

---

**Última actualización**: Enero 2026  
**Estándar**: ESLint + Prettier  
**TypeScript**: strict mode
