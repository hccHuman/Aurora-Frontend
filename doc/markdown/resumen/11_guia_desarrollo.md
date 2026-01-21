# 👨‍💻 Guía de Desarrollo

## Instalación y Setup Inicial

### Requisitos Previos

```bash
✓ Node.js >= 18.x
✓ npm >= 9.x
✓ Git
✓ Editor: VS Code (recomendado)
```

### Instalación del Proyecto

```bash
# 1. Clonar repositorio
git clone https://github.com/aurora-chat/aurora-frontend.git
cd aurora-frontend

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env.local

# 4. Iniciar servidor de desarrollo
npm run dev

# Acceder a http://localhost:3000
```

### Variables de Entorno

```env
# .env.local o .env.production

# API Backend
PUBLIC_API_URL=http://localhost:5000
PUBLIC_API_TIMEOUT=10000

# PayPal
PUBLIC_PAYPAL_CLIENT_ID=YOUR_PAYPAL_CLIENT_ID
PUBLIC_PAYPAL_ENVIRONMENT=sandbox

# Analytics (opcional)
PUBLIC_GA_ID=YOUR_GOOGLE_ANALYTICS_ID

# Características
PUBLIC_ENABLE_VOICE=true
PUBLIC_ENABLE_LIVE2D=true
PUBLIC_ENABLE_CHAT=true
```

## Estructura del Proyecto - Vista de Desarrollador

```
src/
├── components/          # Componentes React + Astro
│   ├── tsx/            # Componentes interactivos (React)
│   │   ├── ChatContainer/
│   │   ├── VtuberLive2D/
│   │   ├── ProductCard/
│   │   ├── CartWidget/
│   │   ├── Header/
│   │   ├── Footer/
│   │   └── ...
│   │
│   └── ui/            # Componentes UI reutilizables
│       ├── Modal.tsx
│       ├── Button.tsx
│       ├── Form.tsx
│       └── ...
│
├── modules/            # Lógica de negocio (6 módulos IA)
│   ├── AURORA/        # Chat + sanitización
│   ├── LUCIA/         # Lógica e interfaz
│   ├── MARIA/         # Orquestación
│   ├── ANA/           # Emociones
│   ├── ALBA/          # Errores
│   └── YOLI/          # i18n
│
├── services/          # Llamadas a API
│   ├── apiClient.ts
│   ├── chatService.ts
│   ├── productService.ts
│   ├── paymentService.ts
│   └── ...
│
├── store/             # Estado global (Jotai)
│   ├── uiStore.ts
│   ├── cartStore.ts
│   ├── userStore.ts
│   ├── chatStore.ts
│   └── searchStore.ts
│
├── pages/             # Rutas Astro
│   ├── index.astro
│   ├── en/
│   └── es/
│
├── layouts/           # Layouts Astro
│   ├── Layout.astro
│   └── LayoutForm.astro
│
├── models/            # Tipos TypeScript
│   ├── EcommerceProps/
│   ├── DashboardProps/
│   └── ...
│
├── styles/            # CSS
│   ├── global.css
│   ├── theme.css
│   ├── animations.css
│   └── Components/
│
├── utils/             # Utilidades
│   ├── validators.ts
│   ├── envWrapper.ts
│   └── categoryService.ts
│
├── lib/               # Librerías
│   ├── navigation.ts
│   └── headerNavigation.ts
│
└── config.ts          # Configuración global
```

## Scripts NPM

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Inicia servidor de desarrollo (http://localhost:3000) |
| `npm run build` | Compila para producción → `dist/` |
| `npm run preview` | Previsualiza build de producción |
| `npm test` | Ejecuta todos los tests con Jest |
| `npm run test:watch` | Tests en modo watch |
| `npm run test:coverage` | Genera reporte de cobertura |
| `npm run test:chatbot` | Solo tests de módulos AURORA/ANA |
| `npm run lint` | Verifica ESLint |
| `npm run lint:fix` | Auto-arregla errores de linting |
| `npm run format` | Auto-formatea con Prettier |
| `npm run format:check` | Verifica formato sin cambiar |
| `npm run tsc:check` | Verifica tipos TypeScript |

## Workflow de Desarrollo

### 1. Crear Nueva Rama

```bash
# Basarse en main
git checkout main
git pull origin main

# Crear rama para feature
git checkout -b feature/nombre-feature

# Crear rama para bugfix
git checkout -b fix/descripcion-bug
```

### 2. Hacer Cambios

```bash
# Editar archivos
nano src/components/MyComponent.tsx

# Verificar cambios
git status

# Stage cambios
git add src/components/MyComponent.tsx

# O stage todo
git add .
```

### 3. Escribir Tests (IMPORTANTE)

```typescript
// tests/components/MyComponent.test.tsx

import { render, screen } from '@testing-library/react';
import MyComponent from '@/components/tsx/MyComponent/MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText(/hello/i)).toBeInTheDocument();
  });
  
  it('handles user interaction', async () => {
    render(<MyComponent />);
    const button = screen.getByRole('button');
    fireEvent.click(button);
    expect(screen.getByText(/clicked/i)).toBeInTheDocument();
  });
});
```

### 4. Ejecutar Tests y Linting

```bash
# Ejecutar tests
npm test -- --testPathPattern=MyComponent

# Verificar linting
npm run lint

# Arreglar automáticamente
npm run lint:fix

# Verificar tipos
npm run tsc:check
```

### 5. Hacer Commit

```bash
# Con formato de commit convencional
git commit -m "feat: add new product filter"
git commit -m "fix: resolve avatar animation lag"
git commit -m "docs: update API documentation"
git commit -m "refactor: simplify chat service"
git commit -m "test: add unit tests for AuraMessageManager"
```

### 6. Push y Pull Request

```bash
# Push a rama remota
git push origin feature/nombre-feature

# En GitHub: crear Pull Request con descripción
# Asegurarse que:
# - Todos los tests pasen
# - No hay conflictos
# - Código está lintado
# - Hay comentarios en código complejo
```

## Debugging

### Console Logging

```typescript
// En cualquier componente
console.log('Variable:', variable);
console.warn('Warning message');
console.error('Error message');

// Objetos complejos
console.table(arrayOfObjects);
```

### DevTools del Navegador

```javascript
// En consola del navegador

// Ver estado Jotai
window.__atoms  // Si está configurado

// Probar avatar
window.testExpression('Happy');
window.testMotion('haru_g_m02');

// Ver localStorage
localStorage.getItem('cart');
localStorage.getItem('theme');
```

### Debugging de Astro

```typescript
// pages/debug.astro
---
// Este código se ejecuta en servidor (SSR)
console.log('Server-side log');

const products = await getProducts();
console.log('Products:', products);
---

<html>
  <body>
    {/* Este código se ejecuta en navegador */}
    <script>
      console.log('Client-side log');
    </script>
  </body>
</html>
```

## Patrón MVC en Componentes

```typescript
// src/components/tsx/ProductCard/ProductCard.tsx

// MODEL: Tipos e interfaces
interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

// VIEW: Componente React
export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  // CONTROLLER: Lógica
  const [isAdded, setIsAdded] = useState(false);
  
  const handleClick = () => {
    onAddToCart?.(product);
    setIsAdded(true);
  };
  
  return (
    <div>
      <h3>{product.name}</h3>
      <p>${product.price}</p>
      <button onClick={handleClick}>
        {isAdded ? '✓ Added' : 'Add to cart'}
      </button>
    </div>
  );
}

export default ProductCard;
```

## Integración de Módulos IA

### Usar AURORA (Chat)

```typescript
import { AuroraMessageManager } from '@/modules/AURORA/core/AuroraMessageManager';
import { AuroraVoiceLocal } from '@/modules/AURORA/core/AuroraVoice';

const handleUserMessage = async (message: string) => {
  // 1. Procesar (sanitizar)
  const processed = await AuroraMessageManager.processUserInput(message);
  
  // 2. Llamar backend
  const response = await fetch(`${API_URL}/aurora/chats`, {
    method: 'POST',
    body: JSON.stringify({ message: processed })
  });
  
  // 3. Obtener respuesta
  const { text } = await response.json();
  
  // 4. Analizar emoción (ANA)
  const instruction = await AnaCore.processUserMessage(text);
  
  // 5. Reproducir voz
  const voice = new AuroraVoiceLocal('es');
  await voice.speak(instruction.text);
};
```

### Usar ANA (Emociones)

```typescript
import { AnaCore } from '@/modules/ANA/AnaCore';

const response = "¡Me siento muy feliz!";
const instruction = await AnaCore.processUserMessage(response);

console.log(instruction);
// {
//   emotion: 'happy',
//   expression: 'Happy.exp3.json',
//   motion: 'haru_g_m02.motion3.json',
//   text: "¡Me siento muy feliz!"
// }
```

### Usar MARIA (Rutas)

```typescript
import { navigateTo } from '@/modules/MARIA/routes';

// Navegar a página (mantiene estado)
navigateTo('/products', { category: 'Electronics' });

// Con i18n
navigateTo('/es/productos');  // Español
navigateTo('/en/products');   // English
```

## Testing Best Practices

### Test de Servicio

```typescript
// tests/services/chatService.test.ts

import { fetchChatResponse } from '@/services/chatService';

describe('chatService', () => {
  beforeEach(() => {
    // Mock fetch
    global.fetch = jest.fn();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  it('should fetch response from API', async () => {
    const mockResponse = { text: 'Hello!' };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse
    });
    
    const result = await fetchChatResponse('Hello');
    expect(result).toEqual(mockResponse);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/aurora/chats'),
      expect.any(Object)
    );
  });
  
  it('should return fallback on error', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network'));
    
    const result = await fetchChatResponse('Hello');
    expect(result.text).toContain('disculpa');
  });
});
```

### Test de Componente

```typescript
// tests/components/ChatInput.test.tsx

import { render, screen, fireEvent } from '@testing-library/react';
import ChatInput from '@/components/tsx/ChatInput/ChatInput';

describe('ChatInput', () => {
  it('sends message on Enter', async () => {
    const handleSend = jest.fn();
    render(<ChatInput onSendMessage={handleSend} isLoading={false} />);
    
    const input = screen.getByPlaceholderText(/escribe tu mensaje/i);
    fireEvent.change(input, { target: { value: 'Hello' } });
    fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });
    
    expect(handleSend).toHaveBeenCalledWith('Hello');
    expect(input.value).toBe('');  // Se limpia
  });
});
```

## Performance

### Lazy Loading

```typescript
import { lazy, Suspense } from 'react';

const Dashboard = lazy(() => import('@/components/tsx/Dashboard/Dashboard'));

export function App() {
  return (
    <Suspense fallback={<div>Loading dashboard...</div>}>
      <Dashboard />
    </Suspense>
  );
}
```

### Code Splitting en Astro

```astro
<!-- src/pages/products.astro -->
---
// Solo se carga si está en navegador
import ProductsList from '@/components/tsx/ProductsList.tsx';
---

<ProductsList client:idle />  <!-- Idle: cuando no hay input -->
<!-- Otras opciones: -->
<!-- client:visible, client:load, client:only -->
```

### Optimización de Imágenes

```typescript
<img
  src={product.img_url}
  alt={product.name}
  loading="lazy"           // Lazy loading
  decoding="async"         // Decodificar async
  srcSet={optimizedSizes}  // Responsive
/>
```

## Documentación de Código

### JSDoc

```typescript
/**
 * Procesa mensaje del usuario aplicando sanitización y validación
 * 
 * @param raw - Mensaje crudo del usuario
 * @returns Promise con el mensaje procesado
 * @throws Error si el mensaje es inválido
 * 
 * @example
 * const processed = await processUserInput("Hello world");
 * console.log(processed); // "hello world"
 */
export async function processUserInput(raw: string): Promise<string> {
  // Implementación
}
```

---

**Última actualización**: Enero 2026  
**Versión Node**: >= 18.x  
**Framework**: Astro 5 + React 19
