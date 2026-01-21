# 🔗 Integraciones Externas

## Backend API

### Configuración Base

```typescript
// src/services/apiClient.ts

const API_BASE_URL = import.meta.env.PUBLIC_API_URL || 'http://localhost:5000';
const API_TIMEOUT = parseInt(import.meta.env.PUBLIC_API_TIMEOUT || '10000');

export class ApiClient {
  private baseUrl: string;
  private timeout: number;
  
  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }
  
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...this.getAuthHeaders(),
          ...(options.headers || {})
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new ApiError(response.status, await response.text());
      }
      
      return await response.json() as T;
      
    } catch (error) {
      clearTimeout(timeoutId);
      throw this.handleError(error);
    }
  }
  
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('auth_token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
  }
  
  private handleError(error: unknown): Error {
    if (error instanceof TypeError) {
      return new ApiError(0, 'Network error');
    }
    if (error instanceof DOMException && error.name === 'AbortError') {
      return new ApiError(0, 'Request timeout');
    }
    return error instanceof Error ? error : new Error('Unknown error');
  }
}

class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

export const apiClient = new ApiClient();
```

### Endpoints de Chat

```typescript
// src/services/chatService.ts

interface ChatRequest {
  message: string;
  sessionId?: string;
  context?: Record<string, unknown>;
}

interface ChatResponse {
  text: string;
  emotion?: string;
  suggestions?: string[];
  sessionId: string;
}

export async function fetchChatResponse(
  message: string,
  sessionId?: string
): Promise<ChatResponse> {
  try {
    return await apiClient.request<ChatResponse>(
      '/aurora/chats',
      {
        method: 'POST',
        body: JSON.stringify({
          message,
          sessionId
        } as ChatRequest)
      }
    );
  } catch (error) {
    console.error('Chat API error:', error);
    return {
      text: 'Disculpa, tengo problemas para conectar al servidor. Intenta más tarde 😔',
      sessionId: sessionId || 'offline',
      emotion: 'sad'
    };
  }
}
```

### Endpoints de Productos

```typescript
// src/services/productService.ts

interface ProductFilters {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: 'name' | 'price-asc' | 'price-desc' | 'rating' | 'newest';
  page?: number;
  limit?: number;
}

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  try {
    const params = new URLSearchParams();
    
    if (filters?.category) params.append('category', filters.category);
    if (filters?.search) params.append('q', filters.search);
    if (filters?.minPrice) params.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice) params.append('max_price', filters.maxPrice.toString());
    if (filters?.sort) params.append('sort', filters.sort);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());
    
    return await apiClient.request<Product[]>(
      `/products?${params.toString()}`
    );
  } catch (error) {
    console.error('Products API error:', error);
    return [];
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    return await apiClient.request<Product>(`/products/${id}`);
  } catch (error) {
    console.error(`Product ${id} API error:`, error);
    return null;
  }
}
```

### Endpoints de Órdenes

```typescript
// src/services/orderService.ts

export async function createOrder(orderData: CreateOrderRequest): Promise<Order> {
  return apiClient.request<Order>(
    '/orders',
    {
      method: 'POST',
      body: JSON.stringify(orderData)
    }
  );
}

export async function getOrders(): Promise<Order[]> {
  return apiClient.request<Order[]>('/orders');
}

export async function getOrderById(id: string): Promise<Order> {
  return apiClient.request<Order>(`/orders/${id}`);
}

export async function updateOrderStatus(
  id: string,
  status: OrderStatus
): Promise<Order> {
  return apiClient.request<Order>(
    `/orders/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({ status })
    }
  );
}
```

## PayPal Integration

### Configuración

```typescript
// src/components/tsx/PayPalCheckout/PayPalCheckout.tsx

import { PayPalScriptProvider, PayPalButtons } from '@paypal/checkout-js';

const PAYPAL_CLIENT_ID = import.meta.env.PUBLIC_PAYPAL_CLIENT_ID;
const PAYPAL_ENVIRONMENT = import.meta.env.PUBLIC_PAYPAL_ENVIRONMENT || 'sandbox';

export function PayPalCheckout({
  amount,
  items,
  onSuccess,
  onError
}: PayPalCheckoutProps) {
  return (
    <PayPalScriptProvider
      options={{
        clientId: PAYPAL_CLIENT_ID,
        currency: 'USD',
        intent: 'capture',
        components: 'buttons'
      }}
    >
      <PayPalButtons
        createOrder={async (data, actions) => {
          const orderData = {
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: amount.toString(),
                  breakdown: {
                    item_total: {
                      currency_code: 'USD',
                      value: amount.toString()
                    }
                  }
                },
                items: items.map(item => ({
                  name: item.name,
                  quantity: item.quantity.toString(),
                  unit_amount: {
                    currency_code: 'USD',
                    value: item.price.toString()
                  }
                }))
              }
            ]
          };
          
          return actions.order.create(orderData);
        }}
        
        onApprove={async (data, actions) => {
          const details = await actions.order.capture();
          
          // Guardar orden en backend
          try {
            await apiClient.request('/orders', {
              method: 'POST',
              body: JSON.stringify({
                paypalOrderId: details.id,
                amount,
                items,
                status: 'completed'
              })
            });
            
            onSuccess?.(details.id);
          } catch (error) {
            onError?.(error);
          }
        }}
        
        onError={(err) => {
          console.error('PayPal error:', err);
          onError?.(err);
        }}
        
        onCancel={() => {
          console.log('Payment cancelled');
        }}
      />
    </PayPalScriptProvider>
  );
}
```

### Payment Service

```typescript
// src/services/paymentService.ts

export async function validatePayment(paypalOrderId: string): Promise<boolean> {
  try {
    const response = await apiClient.request<{ valid: boolean }>(
      `/payments/validate`,
      {
        method: 'POST',
        body: JSON.stringify({ paypalOrderId })
      }
    );
    
    return response.valid;
  } catch (error) {
    console.error('Payment validation error:', error);
    return false;
  }
}

export async function refundPayment(paypalOrderId: string): Promise<boolean> {
  try {
    const response = await apiClient.request<{ success: boolean }>(
      `/payments/refund`,
      {
        method: 'POST',
        body: JSON.stringify({ paypalOrderId })
      }
    );
    
    return response.success;
  } catch (error) {
    console.error('Refund error:', error);
    return false;
  }
}
```

## Autenticación

### Auth Service

```typescript
// src/services/authService.ts

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  user: User;
}

export async function login(credentials: LoginRequest): Promise<LoginResponse> {
  const response = await apiClient.request<LoginResponse>(
    '/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(credentials)
    }
  );
  
  localStorage.setItem('auth_token', response.token);
  return response;
}

export async function logout(): Promise<void> {
  localStorage.removeItem('auth_token');
  await apiClient.request('/auth/logout', { method: 'POST' });
}

export async function verifyToken(): Promise<User | null> {
  try {
    return await apiClient.request<User>('/auth/verify');
  } catch (error) {
    localStorage.removeItem('auth_token');
    return null;
  }
}

export async function register(userData: RegisterRequest): Promise<LoginResponse> {
  const response = await apiClient.request<LoginResponse>(
    '/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(userData)
    }
  );
  
  localStorage.setItem('auth_token', response.token);
  return response;
}

export async function resetPassword(email: string): Promise<void> {
  await apiClient.request('/auth/reset-password', {
    method: 'POST',
    body: JSON.stringify({ email })
  });
}
```

## Webhooks

### Manejo de Webhooks

```typescript
// pages/api/webhooks/paypal.ts (si fuera Node.js en backend)

export async function handlePayPalWebhook(
  event: PayPalWebhookEvent
): Promise<void> {
  switch (event.event_type) {
    case 'PAYMENT.CAPTURE.COMPLETED':
      await handlePaymentCompleted(event.resource);
      break;
    
    case 'PAYMENT.CAPTURE.REFUNDED':
      await handlePaymentRefunded(event.resource);
      break;
    
    case 'PAYMENT.CAPTURE.DENIED':
      await handlePaymentDenied(event.resource);
      break;
  }
}

async function handlePaymentCompleted(resource: PayPalResource) {
  // Actualizar estado de orden
  const orderId = resource.custom_id;
  await updateOrderStatus(orderId, 'payment_confirmed');
  
  // Enviar email de confirmación
  await sendConfirmationEmail(orderId);
  
  // Actualizar inventario
  // ...
}
```

## Rate Limiting

```typescript
// src/utils/rateLimiter.ts

class RateLimiter {
  private requests: Map<string, number[]> = new Map();
  private readonly maxRequests: number;
  private readonly windowMs: number;
  
  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }
  
  isAllowed(key: string): boolean {
    const now = Date.now();
    const requests = this.requests.get(key) || [];
    
    // Filtrar requests fuera de la ventana
    const recentRequests = requests.filter(
      time => now - time < this.windowMs
    );
    
    if (recentRequests.length >= this.maxRequests) {
      return false;
    }
    
    recentRequests.push(now);
    this.requests.set(key, recentRequests);
    return true;
  }
}

export const chatRateLimiter = new RateLimiter(5, 60000);  // 5 req/min

// Usar en servicio
if (!chatRateLimiter.isAllowed(userId)) {
  throw new Error('Too many requests');
}
```

## Error Handling

```typescript
// src/modules/ALBA/ErrorHandler.ts

export class ErrorHandler {
  static handle(code: string | number, message: string): void {
    const errorCode = String(code);
    
    // Log
    console.error(`[ERROR ${errorCode}] ${message}`);
    
    // Analytics
    trackError(errorCode, message);
    
    // User notification
    const userMessage = this.getUserMessage(errorCode);
    showToast(userMessage, 'error');
  }
  
  private static getUserMessage(code: string): string {
    const messages: Record<string, string> = {
      '400': 'Solicitud inválida. Verifica tu entrada.',
      '401': 'No estás autenticado. Por favor, inicia sesión.',
      '403': 'No tienes permiso para realizar esta acción.',
      '404': 'El recurso no fue encontrado.',
      '429': 'Demasiadas solicitudes. Intenta más tarde.',
      '500': 'Error del servidor. Intenta más tarde.',
      '800': 'El servidor no está disponible.',
      '801': 'Timeout de conexión.'
    };
    
    return messages[code] || 'Ocurrió un error inesperado.';
  }
}
```

## Retry Logic

```typescript
// src/utils/retry.ts

export async function retry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    backoff?: boolean;
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    delayMs = 1000,
    backoff = true
  } = options;
  
  let lastError: Error;
  
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      
      if (attempt < maxRetries - 1) {
        const delay = backoff 
          ? delayMs * Math.pow(2, attempt)
          : delayMs;
        
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError!;
}

// Usar
const response = await retry(
  () => fetchChatResponse(message),
  { maxRetries: 3, backoff: true }
);
```

---

**Última actualización**: Enero 2026  
**Backend**: Node.js/Express (configurable)  
**Payment**: PayPal Checkout  
**Auth**: JWT Bearer tokens
