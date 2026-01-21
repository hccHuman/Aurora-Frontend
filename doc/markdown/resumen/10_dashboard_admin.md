# 🎛️ Dashboard Administrativo

## Visión General

El dashboard administrativo permite **gestionar productos, usuarios, órdenes y categorías** de forma centralizada. Acceso restringido solo a administradores.

## Estructura del Dashboard

```
Dashboard (/dashboard)
├── /products              # Gestión de productos
│   ├── Listar (tabla)
│   ├── Crear nuevo
│   ├── Editar
│   └── Eliminar
│
├── /users                 # Gestión de usuarios
│   ├── Listar (tabla)
│   ├── Ver perfil
│   ├── Cambiar rol
│   └── Desactivar
│
├── /orders                # Gestión de órdenes
│   ├── Listar (tabla)
│   ├── Ver detalles
│   ├── Cambiar estado
│   └── Generar factura
│
├── /categories            # Gestión de categorías
│   ├── Listar (tabla)
│   ├── Crear nueva
│   ├── Editar
│   └── Eliminar
│
├── /analytics             # Análitica
│   ├── Ventas (gráfico)
│   ├── Usuarios activos
│   ├── Top productos
│   └── Reportes
│
└── /settings              # Configuración
    ├── Perfil admin
    ├── Email notificaciones
    ├── Backups
    └── Logs del sistema
```

## Autenticación y Autorización

```typescript
// src/services/authService.ts

interface User {
  id: string;
  email: string;
  role: 'admin' | 'user' | 'moderator';
  permissions: string[];
}

export async function checkAdminAccess(): Promise<boolean> {
  try {
    const token = localStorage.getItem('auth_token');
    if (!token) return false;
    
    const response = await fetch(`${apiUrl}/auth/verify`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) return false;
    
    const user: User = await response.json();
    return user.role === 'admin';
    
  } catch (error) {
    return false;
  }
}

// Usar en layout
export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const verify = async () => {
      const admin = await checkAdminAccess();
      setIsAdmin(admin);
      setIsLoading(false);
      
      if (!admin) {
        window.location.href = '/';
      }
    };
    
    verify();
  }, []);
  
  if (isLoading) return <div>Verificando...</div>;
  if (!isAdmin) return <div>Acceso denegado</div>;
  
  return (
    <div className="flex h-screen bg-gray-100">
      <DashboardSidebar />
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}
```

## Gestión de Productos

### ProductsTable.tsx

```typescript
// src/components/tsx/Dashboard/ProductsTable.tsx

export function ProductsTable() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  useEffect(() => {
    loadProducts();
  }, []);
  
  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const data = await fetch(`${apiUrl}/dashboard/products`).then(r => r.json());
      setProducts(data);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDelete = async (id: number) => {
    if (!confirm('¿Eliminar este producto?')) return;
    
    try {
      await fetch(`${apiUrl}/dashboard/products/${id}`, { method: 'DELETE' });
      await loadProducts();
      showToast('Producto eliminado', 'success');
    } catch (error) {
      showToast('Error al eliminar', 'error');
    }
  };
  
  const handleEdit = (product: Product) => {
    setEditingId(product.id);
  };
  
  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Productos</h2>
        <Link href="/dashboard/products/new" className="btn btn-primary">
          + Nuevo Producto
        </Link>
      </div>
      
      {isLoading ? (
        <div>Cargando...</div>
      ) : (
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">ID</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Categoría</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Precio</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Stock</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Rating</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Acciones</th>
              </tr>
            </thead>
            
            <tbody className="divide-y">
              {products.map(product => (
                <tr key={product.id} className="hover:bg-gray-50">
                  <td className="px-6 py-3 text-sm">{product.id}</td>
                  <td className="px-6 py-3 text-sm font-medium">{product.name}</td>
                  <td className="px-6 py-3 text-sm">{product.category}</td>
                  <td className="px-6 py-3 text-sm font-semibold text-green-600">
                    ${product.price.toFixed(2)}
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <span className={`px-2 py-1 rounded text-white text-xs ${
                      product.stock > 10 ? 'bg-green-500' : 'bg-orange-500'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <div className="flex">
                      {'⭐'.repeat(Math.round(product.rating))}
                    </div>
                  </td>
                  <td className="px-6 py-3 text-sm">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:underline mr-3"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
```

### ProductForm.tsx

```typescript
// src/components/tsx/Dashboard/ProductForm.tsx

export function ProductForm({ productId }: { productId?: number }) {
  const [formData, setFormData] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    img_url: '',
    tags: []
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Cargar producto si hay ID
  useEffect(() => {
    if (productId) {
      const loadProduct = async () => {
        const data = await fetch(`${apiUrl}/dashboard/products/${productId}`)
          .then(r => r.json());
        setFormData(data);
      };
      loadProduct();
    }
  }, [productId]);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value
    }));
  };
  
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const formDataUpload = new FormData();
    formDataUpload.append('image', file);
    
    try {
      const response = await fetch(`${apiUrl}/dashboard/upload`, {
        method: 'POST',
        body: formDataUpload
      });
      
      const { url } = await response.json();
      setFormData(prev => ({ ...prev, img_url: url }));
      showToast('Imagen subida', 'success');
      
    } catch (error) {
      showToast('Error al subir imagen', 'error');
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const method = productId ? 'PUT' : 'POST';
      const url = productId 
        ? `${apiUrl}/dashboard/products/${productId}`
        : `${apiUrl}/dashboard/products`;
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (response.ok) {
        showToast(productId ? 'Producto actualizado' : 'Producto creado', 'success');
        // Redirigir a tabla
        window.location.href = '/dashboard/products';
      } else {
        throw new Error('Error en respuesta');
      }
      
    } catch (error) {
      showToast('Error al guardar', 'error');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">
        {productId ? 'Editar Producto' : 'Nuevo Producto'}
      </h2>
      
      <div className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium mb-2">Nombre</label>
          <input
            type="text"
            name="name"
            value={formData.name || ''}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
            placeholder="Ej: Laptop Dell XPS 13"
          />
        </div>
        
        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium mb-2">Descripción</label>
          <textarea
            name="description"
            value={formData.description || ''}
            onChange={handleInputChange}
            rows={4}
            className="w-full p-2 border rounded-lg"
            placeholder="Descripción detallada del producto"
          />
        </div>
        
        {/* Precio y Stock */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Precio ($)</label>
            <input
              type="number"
              name="price"
              value={formData.price || 0}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2">Stock</label>
            <input
              type="number"
              name="stock"
              value={formData.stock || 0}
              onChange={handleInputChange}
              min="0"
              required
              className="w-full p-2 border rounded-lg"
            />
          </div>
        </div>
        
        {/* Categoría */}
        <div>
          <label className="block text-sm font-medium mb-2">Categoría</label>
          <select
            name="category"
            value={formData.category || ''}
            onChange={handleInputChange}
            required
            className="w-full p-2 border rounded-lg"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Electronics">Electrónica</option>
            <option value="Fashion">Moda</option>
            <option value="Home & Garden">Casa y Jardín</option>
            <option value="Books & Media">Libros y Media</option>
          </select>
        </div>
        
        {/* Imagen */}
        <div>
          <label className="block text-sm font-medium mb-2">Imagen</label>
          <div className="flex gap-4 items-start">
            <div className="flex-1">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full p-2 border rounded-lg"
              />
              {formData.img_url && (
                <p className="text-sm text-gray-600 mt-2">
                  ✓ Imagen: {formData.img_url}
                </p>
              )}
            </div>
            {formData.img_url && (
              <img
                src={formData.img_url}
                alt="preview"
                className="w-20 h-20 rounded object-cover"
              />
            )}
          </div>
        </div>
        
        {/* Botones */}
        <div className="flex gap-4 pt-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Producto'}
          </button>
          <Link
            href="/dashboard/products"
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg text-center hover:bg-gray-400"
          >
            Cancelar
          </Link>
        </div>
      </div>
    </form>
  );
}
```

## Gestión de Órdenes

```typescript
// src/components/tsx/Dashboard/OrdersTable.tsx

export function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  
  useEffect(() => {
    loadOrders();
  }, []);
  
  const loadOrders = async () => {
    try {
      const data = await fetch(`${apiUrl}/dashboard/orders`).then(r => r.json());
      setOrders(data);
    } catch (error) {
      showToast('Error al cargar órdenes', 'error');
    }
  };
  
  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await fetch(`${apiUrl}/dashboard/orders/${orderId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      
      await loadOrders();
      showToast('Orden actualizada', 'success');
      
    } catch (error) {
      showToast('Error al actualizar orden', 'error');
    }
  };
  
  const handleGenerateInvoice = async (orderId: string) => {
    try {
      const response = await fetch(`${apiUrl}/dashboard/orders/${orderId}/invoice`);
      const blob = await response.blob();
      
      // Descargar PDF
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      link.click();
      
    } catch (error) {
      showToast('Error al generar factura', 'error');
    }
  };
  
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      'pending': 'bg-yellow-100 text-yellow-800',
      'processing': 'bg-blue-100 text-blue-800',
      'shipped': 'bg-purple-100 text-purple-800',
      'delivered': 'bg-green-100 text-green-800',
      'cancelled': 'bg-red-100 text-red-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Órdenes</h2>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="w-full">
          <thead className="bg-gray-100 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">ID</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Total</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Fecha</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-700">Acciones</th>
            </tr>
          </thead>
          
          <tbody className="divide-y">
            {orders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50">
                <td className="px-6 py-3 text-sm font-mono">{order.id}</td>
                <td className="px-6 py-3 text-sm">{order.customer.name}</td>
                <td className="px-6 py-3 text-sm font-semibold">${order.total.toFixed(2)}</td>
                <td className="px-6 py-3 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                <td className="px-6 py-3 text-sm">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className={`px-2 py-1 rounded text-xs font-semibold ${getStatusColor(order.status)}`}
                  >
                    <option value="pending">Pendiente</option>
                    <option value="processing">Procesando</option>
                    <option value="shipped">Enviado</option>
                    <option value="delivered">Entregado</option>
                    <option value="cancelled">Cancelado</option>
                  </select>
                </td>
                <td className="px-6 py-3 text-sm">
                  <button
                    onClick={() => {
                      setSelectedOrder(order);
                      setShowDetails(true);
                    }}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => handleGenerateInvoice(order.id)}
                    className="text-green-600 hover:underline"
                  >
                    Factura
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {/* Modal de detalles */}
      {showDetails && selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
}
```

## Analytics

```typescript
// src/components/tsx/Dashboard/Analytics.tsx

export function Analytics() {
  const [stats, setStats] = useState({
    totalSales: 0,
    totalOrders: 0,
    totalUsers: 0,
    avgOrderValue: 0,
    topProducts: [],
    salesTrend: []
  });
  
  useEffect(() => {
    loadStats();
  }, []);
  
  const loadStats = async () => {
    try {
      const data = await fetch(`${apiUrl}/dashboard/analytics`).then(r => r.json());
      setStats(data);
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Análitica</h2>
      
      {/* KPIs */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <KPICard
          title="Ventas Totales"
          value={`$${stats.totalSales.toFixed(2)}`}
          icon="💰"
        />
        <KPICard
          title="Órdenes"
          value={stats.totalOrders.toString()}
          icon="📦"
        />
        <KPICard
          title="Usuarios"
          value={stats.totalUsers.toString()}
          icon="👥"
        />
        <KPICard
          title="Valor Promedio"
          value={`$${stats.avgOrderValue.toFixed(2)}`}
          icon="📊"
        />
      </div>
      
      {/* Gráficos */}
      <div className="grid grid-cols-2 gap-6">
        <SalesTrendChart data={stats.salesTrend} />
        <TopProductsChart data={stats.topProducts} />
      </div>
    </div>
  );
}

function KPICard({ title, value, icon }: { title: string; value: string; icon: string }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-600 text-sm">{title}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
        <span className="text-4xl">{icon}</span>
      </div>
    </div>
  );
}
```

## Sidebar de Navegación

```typescript
// src/components/tsx/Dashboard/DashboardSidebar.tsx

export function DashboardSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  return (
    <div className={`bg-gray-900 text-white transition-all ${isCollapsed ? 'w-16' : 'w-64'}`}>
      <div className="p-4 flex items-center justify-between">
        {!isCollapsed && <h1 className="font-bold">Aurora Admin</h1>}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 hover:bg-gray-700 rounded"
        >
          {isCollapsed ? '→' : '←'}
        </button>
      </div>
      
      <nav className="space-y-2 p-4">
        <NavItem icon="📊" label="Overview" href="/dashboard" collapsed={isCollapsed} />
        <NavItem icon="📦" label="Productos" href="/dashboard/products" collapsed={isCollapsed} />
        <NavItem icon="👥" label="Usuarios" href="/dashboard/users" collapsed={isCollapsed} />
        <NavItem icon="🛒" label="Órdenes" href="/dashboard/orders" collapsed={isCollapsed} />
        <NavItem icon="📂" label="Categorías" href="/dashboard/categories" collapsed={isCollapsed} />
        <NavItem icon="📈" label="Análitica" href="/dashboard/analytics" collapsed={isCollapsed} />
        <NavItem icon="⚙️" label="Configuración" href="/dashboard/settings" collapsed={isCollapsed} />
      </nav>
      
      <div className="p-4 border-t border-gray-700 mt-auto">
        <button className="w-full text-left p-2 hover:bg-gray-700 rounded">
          {!isCollapsed && '👤 Admin'}
          Logout
        </button>
      </div>
    </div>
  );
}

function NavItem({ 
  icon, 
  label, 
  href, 
  collapsed 
}: { 
  icon: string; 
  label: string; 
  href: string; 
  collapsed: boolean; 
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 p-2 rounded hover:bg-gray-700 transition"
    >
      <span className="text-xl">{icon}</span>
      {!collapsed && <span>{label}</span>}
    </Link>
  );
}
```

---

**Última actualización**: Enero 2026  
**Nivel de Acceso**: Admin solo  
**Módulos**: Productos, Usuarios, Órdenes, Categorías, Análitica
