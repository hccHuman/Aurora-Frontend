# 🧪 Testing - Estrategia y Guía

## Estrategia de Testing

### Pirámide de Tests

```
        △ E2E Tests (5-10%)
       /  \
      /    \
     /      \
    /        \
   /  Integration\
  /    Tests      \
 /      (15-25%)   \
/                  \
─────────────────────
Unit Tests (60-80%)
```

- **Unit Tests**: Funciones, servicios, módulos individuales
- **Integration Tests**: Múltiples componentes juntos
- **E2E Tests**: Flujos completos de usuario

## Configuración Jest

```javascript
// jest.config.js

export default {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  testMatch: ['**/?(*.)+(spec|test).ts?(x)'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1'
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/*.astro'
  ]
};
```

## Unit Tests

### Test de Servicio (chatService)

```typescript
// tests/services/chatService.test.ts

import { fetchChatResponse } from '@/services/chatService';

describe('chatService', () => {
  beforeEach(() => {
    global.fetch = jest.fn();
    localStorage.clear();
  });
  
  afterEach(() => {
    jest.restoreAllMocks();
  });
  
  describe('fetchChatResponse', () => {
    it('should return response text on success', async () => {
      // Arrange
      const mockResponse = { text: 'Hello user!' };
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse
      });
      
      // Act
      const result = await fetchChatResponse('Hello');
      
      // Assert
      expect(result).toEqual(mockResponse);
      expect(global.fetch).toHaveBeenCalledWith(
        expect.stringContaining('/aurora/chats'),
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ message: 'Hello' })
        })
      );
    });
    
    it('should return fallback message on network error', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockRejectedValueOnce(
        new Error('Network error')
      );
      
      // Act
      const result = await fetchChatResponse('Hello');
      
      // Assert
      expect(result.text).toContain('disculpa');
      expect(result.text).toContain('conectar');
    });
    
    it('should handle HTTP errors gracefully', async () => {
      // Arrange
      (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok: false,
        status: 500
      });
      
      // Act
      const result = await fetchChatResponse('Hello');
      
      // Assert
      expect(result.text).toContain('error');
    });
  });
});
```

### Test de Utilidad (Sanitizer)

```typescript
// tests/modules/aurora-sanitizer.test.ts

import { AuroraSanitizer } from '@/modules/AURORA/core/AuroraSanitizer';

describe('AuroraSanitizer', () => {
  describe('sanitize', () => {
    it('should remove HTML tags', () => {
      const input = 'Hello <b>world</b>';
      const result = AuroraSanitizer.sanitize(input);
      expect(result).toBe('Hello world');
      expect(result).not.toContain('<b>');
    });
    
    it('should remove script tags', () => {
      const input = 'Hello<script>alert(1)</script>';
      const result = AuroraSanitizer.sanitize(input);
      expect(result).not.toContain('<script>');
      expect(result).not.toContain('alert');
    });
    
    it('should handle multiple attempts to inject', () => {
      const malicious = 'Test<img src=x onerror="alert()"><svg onload="alert()">';
      const result = AuroraSanitizer.sanitize(malicious);
      expect(result).not.toContain('<');
      expect(result).not.toContain('>');
    });
    
    it('should preserve safe text', () => {
      const safe = 'Hello, how are you?';
      const result = AuroraSanitizer.sanitize(safe);
      expect(result).toBe(safe);
    });
    
    it('should handle Unicode characters', () => {
      const unicode = '¡Hola! 😊 こんにちは';
      const result = AuroraSanitizer.sanitize(unicode);
      expect(result).toBe(unicode);
    });
  });
});
```

### Test de Módulo (AnoEmotionMap)

```typescript
// tests/modules/ana-emotion.test.ts

import { AnaEmotionMap } from '@/modules/ANA/AnaEmotionMap';
import { AnaCore } from '@/modules/ANA/AnaCore';

describe('ANA - Emotion Detection', () => {
  describe('detectEmotion', () => {
    it('should detect happy emotion', () => {
      const result = AnaEmotionMap.detectEmotion('Me siento muy feliz');
      expect(result).toBe('happy');
    });
    
    it('should detect sad emotion', () => {
      const result = AnaEmotionMap.detectEmotion('Estoy muy triste');
      expect(result).toBe('sad');
    });
    
    it('should detect surprise', () => {
      const result = AnaEmotionMap.detectEmotion('¡Wow! ¡Increíble!');
      expect(result).toBe('surprised');
    });
    
    it('should return neutral as default', () => {
      const result = AnaEmotionMap.detectEmotion('Hello there');
      expect(result).toBe('neutral');
    });
    
    it('should be case-insensitive', () => {
      const result1 = AnaEmotionMap.detectEmotion('FELIZ');
      const result2 = AnaEmotionMap.detectEmotion('Feliz');
      const result3 = AnaEmotionMap.detectEmotion('feliz');
      
      expect(result1).toBe(result2);
      expect(result2).toBe(result3);
    });
  });
  
  describe('processUserMessage', () => {
    it('should return AuroraInstruction with emotion', async () => {
      const message = 'Estoy muy alegre!';
      const instruction = await AnaCore.processUserMessage(message);
      
      expect(instruction).toEqual(
        expect.objectContaining({
          emotion: expect.any(String),
          expression: expect.any(String),
          motion: expect.any(String),
          text: expect.any(String)
        })
      );
    });
    
    it('should map emotion to correct animation', async () => {
      const instruction = await AnaCore.processUserMessage('¡Qué sorpresa!');
      
      expect(instruction.emotion).toBe('surprised');
      expect(instruction.expression).toContain('Surprised');
      expect(instruction.motion).toContain('m04');
    });
  });
});
```

## Integration Tests

### Test de Chat Completo

```typescript
// tests/integration/chat-complete.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ChatContainer from '@/components/tsx/ChatContainer/ChatContainer';
import * as chatService from '@/services/chatService';

jest.mock('@/services/chatService');

describe('Chat Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it('should complete message flow: input -> API -> response', async () => {
    // Arrange
    const mockResponse = { text: 'Hello! I am happy to help!' };
    (chatService.fetchChatResponse as jest.Mock).mockResolvedValueOnce(mockResponse);
    
    // Act
    render(<ChatContainer />);
    
    const input = screen.getByPlaceholderText(/escribe/i);
    const sendButton = screen.getByRole('button', { name: /→/ });
    
    await userEvent.type(input, 'Hello');
    fireEvent.click(sendButton);
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText('Hello')).toBeInTheDocument();
    });
    
    await waitFor(() => {
      expect(screen.getByText('Hello! I am happy to help!')).toBeInTheDocument();
    });
    
    expect(chatService.fetchChatResponse).toHaveBeenCalledWith('Hello');
  });
  
  it('should handle API error gracefully', async () => {
    // Arrange
    (chatService.fetchChatResponse as jest.Mock).mockRejectedValueOnce(
      new Error('API Error')
    );
    
    // Act
    render(<ChatContainer />);
    
    const input = screen.getByPlaceholderText(/escribe/i);
    await userEvent.type(input, 'Test');
    fireEvent.click(screen.getByRole('button'));
    
    // Assert
    await waitFor(() => {
      expect(screen.getByText(/disculpa/i)).toBeInTheDocument();
    });
  });
});
```

### Test de Carrito (Cart)

```typescript
// tests/integration/cart.test.tsx

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useAtom } from 'jotai';
import CartWidget from '@/components/tsx/CartWidget/CartWidget';
import { cartAtom } from '@/store/cartStore';

describe('Cart Integration', () => {
  it('should update cart count when product is added', async () => {
    render(<CartWidget />);
    
    // Agregar producto al carrito
    const products = [
      { id: 1, name: 'Product 1', price: 10 },
      { id: 2, name: 'Product 2', price: 20 }
    ];
    
    // Simular agregar al carrito
    const cartButton = screen.getByText(/añadir al carrito/i);
    await userEvent.click(cartButton);
    
    // Verificar contador
    await screen.findByText('1');
  });
});
```

## E2E Tests

### Test de Flujo Completo de Compra

```typescript
// tests/e2e/purchase_flow.test.tsx

import { test, expect } from '@playwright/test';

test.describe('Purchase Flow', () => {
  test('should complete full purchase flow', async ({ page }) => {
    // 1. Ir a página de inicio
    await page.goto('http://localhost:3000');
    expect(page).toHaveTitle(/Aurora/);
    
    // 2. Buscar producto
    await page.click('[aria-label="Search"]');
    await page.fill('[placeholder="Search"]', 'laptop');
    await page.press('[placeholder="Search"]', 'Enter');
    
    // 3. Ver producto
    await page.click('text=Laptop Dell XPS 13');
    await expect(page).toHaveURL(/\/products\/5/);
    
    // 4. Agregar al carrito
    await page.click('button:has-text("Add to Cart")');
    await expect(page.locator('[data-cart-count]')).toContainText('1');
    
    // 5. Ir al carrito
    await page.click('[data-cart-widget]');
    await page.click('text=View Full Cart');
    
    // 6. Checkout
    await page.click('button:has-text("Checkout")');
    
    // 7. Llenar formulario
    await page.fill('[name="firstName"]', 'Juan');
    await page.fill('[name="lastName"]', 'Pérez');
    await page.fill('[name="email"]', 'juan@example.com');
    await page.fill('[name="address"]', 'Calle Principal 123');
    await page.fill('[name="city"]', 'Madrid');
    await page.fill('[name="zipCode"]', '28001');
    
    // 8. Procesar pago (simulado)
    await page.click('button:has-text("Proceed to Payment")');
    
    // 9. Verificar confirmación
    await expect(page).toHaveURL(/\/confirmation/);
    await expect(page.locator('text=Order confirmed')).toBeVisible();
  });
  
  it('should handle payment error', async ({ page }) => {
    // ... setup ...
    
    // Simular error de pago
    await page.click('button:has-text("Proceed to Payment")');
    
    // Esperar modal de error
    const errorModal = page.locator('[role="alert"]');
    await expect(errorModal).toContainText('Error processing payment');
  });
});
```

### Test de Accesibilidad

```typescript
// tests/e2e/accessibility_flow.test.tsx

import { test, expect } from '@playwright/test';
import { injectAxe, getViolations } from 'axe-playwright';

test('should pass accessibility audit', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Inyectar Axe
  await injectAxe(page);
  
  // Obtener violaciones
  const violations = await getViolations(page);
  
  // Verificar que no hay violaciones críticas
  const critical = violations.filter(v => v.impact === 'critical');
  expect(critical).toHaveLength(0);
});

test('should be navigable with keyboard', async ({ page }) => {
  await page.goto('http://localhost:3000');
  
  // Tab a través de elementos
  await page.press('body', 'Tab');
  let focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(['BUTTON', 'A', 'INPUT']).toContain(focused);
  
  // Tab nuevamente
  await page.press('body', 'Tab');
  focused = await page.evaluate(() => document.activeElement?.tagName);
  expect(['BUTTON', 'A', 'INPUT']).toContain(focused);
});
```

## Coverage Goals

```
┌──────────────────────────────────────────────┐
│         Coverage Goals by Module             │
├──────────────────────┬──────────────┬────────┤
│ Module               │ Statements   │ Target │
├──────────────────────┼──────────────┼────────┤
│ AURORA (Chat)        │ 85%          │ 80%+   │
│ ANA (Emotions)       │ 90%          │ 85%+   │
│ Services             │ 80%          │ 75%+   │
│ Components           │ 75%          │ 70%+   │
│ Utils                │ 95%          │ 90%+   │
├──────────────────────┴──────────────┴────────┤
│ Overall Target: 80%+                         │
└──────────────────────────────────────────────┘
```

## Ejecutar Tests

```bash
# Todos los tests
npm test

# Tests específicos
npm test -- --testPathPattern=chatService

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage

# Tests específicos por patrón
npm run test:chatbot          # aurora-*.test.ts + ana-*.test.ts
npm run test:sanitizer         # Sanitizer tests
npm run test:messagemanager    # Message pipeline
```

## Debugging Tests

```typescript
// Usar screen.debug() para ver DOM
screen.debug();

// Pausar en test
await page.pause();  // Playwright

// Logs detallados
beforeEach(() => {
  jest.spyOn(console, 'log');
});
```

---

**Última actualización**: Enero 2026  
**Framework**: Jest 29.x + Playwright  
**Coverage objetivo**: 80%+
