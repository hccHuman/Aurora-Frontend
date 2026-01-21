# 🛍️ E-commerce - Catálogo y Carrito

## Visión General

Aurora incluye un **catálogo completo de 142 productos** con carrito de compras, búsqueda, filtrado y pago integrado con PayPal.

## Catálogo de Productos

### Estructura de Datos

```typescript
interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  category: string;
  image: string;
  img_url: string;
  stock: number;
  rating: number;
  reviews: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

// Ejemplo de producto
{
  id: 5,
  name: "Laptop Dell XPS 13",
  description: "Ultrabook de 13 pulgadas con procesador Intel i7",
  price: 1299.99,
  currency: "USD",
  category: "Electronics",
  image: "/img/products/laptop_xps13.jpg",
  img_url: "https://api.example.com/images/laptop_xps13.jpg",
  stock: 15,
  rating: 4.8,
  reviews: 247,
  tags: ["laptop", "dell", "portátil", "windows"],
  createdAt: "2024-01-15T10:30:00Z",
  updatedAt: "2025-01-10T14:45:00Z"
}
```

### Categorías Disponibles

```
Electronics
├── Laptops
├── Smartphones
├── Tablets
├── Accesorios
└── Audio

Fashion
├── Ropa Hombre
├── Ropa Mujer
├── Calzado
└── Accesorios

Home & Garden
├── Muebles
├── Decoración
├── Cocina
└── Jardinería

Books & Media
├── Libros
├── eBooks
└── Medios Físicos

Total: 142 productos distribuidos en ~15 categorías
```

### Archivo de Productos Limpios

```
Ubicación: products_clean.json

Estructura:
[
  {
    "id": 5,
    "img_url": "https://api.example.com/images/laptop_xps13.jpg"
  },
  {
    "id": 6,
    "img_url": "https://api.example.com/images/smartphone_iphone15.jpg"
  },
  ...
  {
    "id": 142,
    "img_url": "https://api.example.com/images/last_product.jpg"
  }
]

Total: 142 productos
```

## Servicio de Productos

```typescript
// src/services/productService.ts

export async function getProducts(filters?: ProductFilters) {
  try {
    const query = new URLSearchParams();
    
    if (filters?.category) query.append('category', filters.category);
    if (filters?.search) query.append('q', filters.search);
    if (filters?.minPrice) query.append('min_price', filters.minPrice.toString());
    if (filters?.maxPrice) query.append('max_price', filters.maxPrice.toString());
    if (filters?.sort) query.append('sort', filters.sort);
    
    const response = await fetch(
      `${apiUrl}/products?${query.toString()}`,
      {
        headers: { 'Accept': 'application/json' }
      }
    );
    
    if (!response.ok) {
      return [];  // Fallback seguro
    }
    
    return await response.json();
    
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];  // Fallback
  }
}

export async function getProductById(id: number): Promise<Product | null> {
  try {
    const response = await fetch(`${apiUrl}/products/${id}`);
    if (!response.ok) return null;
    return await response.json();
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

export async function searchProducts(query: string): Promise<Product[]> {
  return getProducts({ search: query });
}
```

## Componentes de Catálogo

### AllProductsList.tsx

```typescript
// src/components/tsx/AllProductsList/AllProductsList.tsx

export function AllProductsList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<ProductFilters>({
    category: undefined,
    search: '',
    sort: 'name'
  });
  
  // Cargar productos
  useEffect(() => {
    const loadProducts = async () => {
      setIsLoading(true);
      const data = await getProducts();
      setProducts(data);
      setIsLoading(false);
    };
    loadProducts();
  }, []);
  
  // Aplicar filtros
  useEffect(() => {
    let result = products;
    
    if (filters.search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.description.toLowerCase().includes(filters.search.toLowerCase())
      );
    }
    
    if (filters.category) {
      result = result.filter(p => p.category === filters.category);
    }
    
    // Ordenar
    result.sort((a, b) => {
      switch (filters.sort) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'name':
        default:
          return a.name.localeCompare(b.name);
      }
    });
    
    setFilteredProducts(result);
  }, [products, filters]);
  
  if (isLoading) return <div>Cargando...</div>;
  
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {filteredProducts.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
```

### ProductCard.tsx

```typescript
// src/components/tsx/ProductCard/ProductCard.tsx

export function ProductCard({ product }: { product: Product }) {
  const [cartItems, setCartItems] = useAtom(cartAtom);
  const isInCart = cartItems.some(item => item.id === product.id);
  
  const handleAddToCart = () => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
      {/* Imagen */}
      <div className="relative h-48 bg-gray-100 overflow-hidden group">
        <img 
          src={product.img_url} 
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition"
          loading="lazy"
        />
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-bold">Agotado</span>
          </div>
        )}
      </div>
      
      {/* Contenido */}
      <div className="p-4">
        <h3 className="font-semibold text-sm truncate">{product.name}</h3>
        
        {/* Rating */}
        <div className="flex items-center gap-1 my-2">
          <div className="flex text-yellow-400">
            {'⭐'.repeat(Math.round(product.rating))}
          </div>
          <span className="text-xs text-gray-500">({product.reviews})</span>
        </div>
        
        {/* Precio */}
        <div className="flex items-baseline gap-1 my-2">
          <span className="text-lg font-bold text-purple-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500">{product.currency}</span>
        </div>
        
        {/* Stock */}
        <p className="text-xs text-gray-600 mb-3">
          {product.stock > 0 ? `${product.stock} en stock` : 'No disponible'}
        </p>
        
        {/* Botón */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg font-medium text-sm transition ${
            isInCart
              ? 'bg-green-500 text-white hover:bg-green-600'
              : 'bg-purple-600 text-white hover:bg-purple-700'
          } disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          {isInCart ? '✓ En carrito' : 'Añadir al carrito'}
        </button>
      </div>
    </div>
  );
}
```

## Carrito de Compras

### CartStore (Jotai)

```typescript
// src/store/cartStore.ts

export interface CartItem extends Product {
  quantity: number;
}

export const cartAtom = atom<CartItem[]>([]);

export const cartTotalAtom = atom(get => {
  const items = get(cartAtom);
  return items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

export const cartCountAtom = atom(get => {
  const items = get(cartAtom);
  return items.reduce((count, item) => count + item.quantity, 0);
});

// Persistencia
export const persistCart = (items: CartItem[]) => {
  localStorage.setItem('cart', JSON.stringify(items));
};

export const loadCart = (): CartItem[] => {
  const stored = localStorage.getItem('cart');
  return stored ? JSON.parse(stored) : [];
};
```

### CartWidget.tsx

```typescript
// src/components/tsx/CartWidget/CartWidget.tsx

export function CartWidget() {
  const [cartItems] = useAtom(cartAtom);
  const [cartCount] = useAtom(cartCountAtom);
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 hover:bg-gray-100 rounded-lg transition"
      >
        <ShoppingCartIcon className="w-6 h-6" />
        {cartCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
      
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl z-50">
          <CartPreview items={cartItems} />
        </div>
      )}
    </div>
  );
}

function CartPreview({ items }: { items: CartItem[] }) {
  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  return (
    <div className="p-4 max-h-96 overflow-y-auto">
      {items.length === 0 ? (
        <p className="text-center text-gray-500">Carrito vacío</p>
      ) : (
        <>
          {items.map(item => (
            <div key={item.id} className="flex gap-2 py-2 border-b last:border-b-0">
              <img src={item.img_url} alt={item.name} className="w-12 h-12 rounded object-cover" />
              <div className="flex-1">
                <p className="font-medium text-sm">{item.name}</p>
                <p className="text-sm text-gray-600">{item.quantity}x ${item.price.toFixed(2)}</p>
              </div>
            </div>
          ))}
          
          <div className="mt-4 pt-4 border-t font-bold flex justify-between">
            <span>Total:</span>
            <span>${total.toFixed(2)}</span>
          </div>
          
          <button className="w-full mt-4 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700">
            Ver Carrito Completo
          </button>
        </>
      )}
    </div>
  );
}
```

## Página de Checkout

### CheckoutForm.tsx

```typescript
// src/components/tsx/CheckoutForm/CheckoutForm.tsx

export function CheckoutForm() {
  const [cartItems] = useAtom(cartAtom);
  const [cartTotal] = useAtom(cartTotalAtom);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    zipCode: '',
    country: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validar formulario
    if (!validateCheckoutForm(formData)) {
      showToast('Por favor completa todos los campos', 'error');
      return;
    }
    
    // Procesar pago
    const result = await processPayment({
      amount: cartTotal,
      items: cartItems,
      customer: formData
    });
    
    if (result.success) {
      showToast('¡Compra completada!', 'success');
      // Limpiar carrito
      // Redirigir a confirmar pedido
    } else {
      showToast('Error al procesar el pago', 'error');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
      {/* Datos personales */}
      <fieldset className="border rounded-lg p-4">
        <legend className="font-bold mb-4">Datos Personales</legend>
        
        <div className="grid grid-cols-2 gap-4">
          <input
            type="text"
            name="firstName"
            placeholder="Nombre"
            value={formData.firstName}
            onChange={handleInputChange}
            required
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Apellido"
            value={formData.lastName}
            onChange={handleInputChange}
            required
            className="p-2 border rounded-lg"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleInputChange}
            required
            className="p-2 border rounded-lg"
          />
          <input
            type="tel"
            name="phone"
            placeholder="Teléfono"
            value={formData.phone}
            onChange={handleInputChange}
            required
            className="p-2 border rounded-lg"
          />
        </div>
      </fieldset>
      
      {/* Dirección */}
      <fieldset className="border rounded-lg p-4">
        <legend className="font-bold mb-4">Dirección de Envío</legend>
        
        <input
          type="text"
          name="address"
          placeholder="Calle y número"
          value={formData.address}
          onChange={handleInputChange}
          required
          className="w-full p-2 border rounded-lg mb-4"
        />
        
        <div className="grid grid-cols-3 gap-4">
          <input
            type="text"
            name="city"
            placeholder="Ciudad"
            value={formData.city}
            onChange={handleInputChange}
            required
            className="p-2 border rounded-lg"
          />
          <input
            type="text"
            name="zipCode"
            placeholder="Código Postal"
            value={formData.zipCode}
            onChange={handleInputChange}
            required
            className="p-2 border rounded-lg"
          />
          <select
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            required
            className="p-2 border rounded-lg"
          >
            <option value="">País</option>
            <option value="ES">España</option>
            <option value="MX">México</option>
            <option value="AR">Argentina</option>
          </select>
        </div>
      </fieldset>
      
      {/* Resumen */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h3 className="font-bold mb-3">Resumen de Pedido</h3>
        
        <div className="space-y-2 mb-4">
          {cartItems.map(item => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.name} x{item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="border-t pt-2 font-bold flex justify-between text-lg">
          <span>Total:</span>
          <span>${cartTotal.toFixed(2)}</span>
        </div>
      </div>
      
      <button
        type="submit"
        className="w-full bg-purple-600 text-white py-3 rounded-lg hover:bg-purple-700 font-bold"
      >
        Proceder al Pago
      </button>
    </form>
  );
}
```

## Integración PayPal

```typescript
// src/components/tsx/PayPalCheckout/PayPalCheckout.tsx

export function PayPalCheckout({ amount, items }: PayPalCheckoutProps) {
  const [error, setError] = useState<string | null>(null);
  
  return (
    <PayPalScriptProvider options={{ clientId: PAYPAL_CLIENT_ID }}>
      <div className="paypal-container">
        {error && (
          <Modal 
            title="Error de Pago"
            message={error}
            onClose={() => setError(null)}
          />
        )}
        
        <PayPalButtons
          createOrder={async (data, actions) => {
            const orderData = {
              intent: "CAPTURE",
              purchase_units: [
                {
                  amount: {
                    currency_code: "USD",
                    value: amount.toString(),
                    breakdown: {
                      item_total: {
                        currency_code: "USD",
                        value: amount.toString()
                      }
                    }
                  },
                  items: items.map(item => ({
                    name: item.name,
                    quantity: item.quantity.toString(),
                    unit_amount: {
                      currency_code: "USD",
                      value: item.price.toString()
                    }
                  }))
                }
              ]
            };
            
            const response = await actions.order.create(orderData);
            return response;
          }}
          
          onApprove={async (data, actions) => {
            const details = await actions.order.capture();
            
            // Guardar orden en backend
            await saveOrder({
              paypalOrderId: details.id,
              amount,
              items,
              status: 'completed'
            });
            
            // Redirigir a confirmación
            window.location.href = '/confirmation/' + details.id;
          }}
          
          onError={(err) => {
            console.error('PayPal error:', err);
            setError('Error al procesar el pago. Intenta de nuevo.');
          }}
        />
      </div>
    </PayPalScriptProvider>
  );
}
```

## Análisis de Catálogo

```
Total de Productos: 142
Distribución por Categoría:
├── Electronics: 45 productos
├── Fashion: 38 productos
├── Home & Garden: 32 productos
└── Books & Media: 27 productos

Rango de Precios:
├── Budget ($0-100): 52 productos
├── Mid-range ($100-500): 65 productos
└── Premium ($500+): 25 productos

Métrica de Popularidad:
├── Rating promedio: 4.2/5.0
├── Promedio de reviews: 85 por producto
└── Tasa de disponibilidad: 94%
```

---

**Última actualización**: Enero 2026  
**Catálogo actualizado**: 142 productos  
**Moneda**: USD (configurable)
