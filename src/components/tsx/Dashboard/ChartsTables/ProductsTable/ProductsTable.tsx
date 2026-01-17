import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Product } from "@/models/dashboardProps/DashboardProductProps";
import {
  fetchProducts,
  saveProduct,
  saveProductUpdate,
  deleteProduct,
} from "@/services/dashboardProductsService";
import { fetchCategories } from "@/services/dashboardCategoriesService";
import Pagination from "@/components/tsx/Dashboard/ui/Pagination";
import { getResponsivePageSize } from "@/services/deviceService";

interface Category {
  id: string | number;
  nombre: string;
}

/**
 * ProductsTable Component
 *
 * Provides a management interface for products in the dashboard.
 * Supports CRUD operations: fetching, creating, updating, and deleting products.
 * Includes category integration for product classification.
 * Features a dynamic creation row, row-level editing, responsive pagination, and animations.
 *
 * @component
 */
export default function ProductsTable() {
  const [items, setItems] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsivePageSize());
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  const [draftName, setDraftName] = useState("");
  const [draftDescription, setDraftDescription] = useState("");
  const [draftPrice, setDraftPrice] = useState<string | number>("");
  const [draftStock, setDraftStock] = useState<string | number>("");
  const [draftImg, setDraftImg] = useState("");
  const [draftCategory, setDraftCategory] = useState<string | number>(1);

  /* 📐 Responsive */
  useEffect(() => {
    const handleResize = () => {
      setPageSize(getResponsivePageSize());
      setPage(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 🔄 Load products & categories */
  useEffect(() => {
    loadProducts(page, pageSize);
    loadCategories();
  }, [page, pageSize]);

  /**
   * Loads a paginated list of products from the server.
   *
   * @param {number} p - The page number to fetch.
   * @param {number} size - The number of products per page.
   */
  async function loadProducts(p: number, size: number) {
    setLoading(true);
    const res = await fetchProducts(p, size);
    if (res) {
      setItems(res.data);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  }

  /**
   * Fetches the list of all categories for product classification.
   * Defaults to a "Default" category if fetching fails.
   */
  async function loadCategories() {
    try {
      const res = await fetchCategories();
      if (res && res.data) {
        setCategories(res.data);
      } else {
        setCategories([{ id: 1, nombre: "Default" }]);
      }
    } catch (e) {
      console.error("Failed to load categories", e);
      setCategories([{ id: 1, nombre: "Default" }]);
    }
  }

  /* ➕ CREATE */
  /**
   * Initializes the interface for creating a new product.
   */
  function onStartCreate() {
    setIsCreating(true);
    setEditingId(null);
    setDraftName("");
    setDraftDescription("");
    setDraftPrice("");
    setDraftStock("");
    setDraftImg("");
    setDraftCategory(1);
  }

  /**
   * Persists a new product to the server and refreshes the list.
   */
  async function onCreate() {
    await saveProduct({
      nombre: draftName,
      descripcion: draftDescription,
      precio: Number(draftPrice),
      stock: Number(draftStock),
      img_url: draftImg,
      product_category: draftCategory,
      activo: true,
    });

    setIsCreating(false);
    loadProducts(page, pageSize);
  }

  /* ✏️ EDIT */
  /**
   * Initializes the editing state for a specific product.
   *
   * @param {Product} p - The product object to edit.
   */
  function onStartEdit(p: Product) {
    setEditingId(p.id);
    setIsCreating(false);
    setDraftName(p.nombre);
    setDraftDescription(p.descripcion ?? "");
    setDraftPrice(p.precio);
    setDraftStock(p.stock);
    setDraftImg(p.img_url ?? "");
    setDraftCategory(p.product_category);
  }

  /**
   * Persists changes to an existing product and refreshes the list.
   *
   * @param {Product} p - The product object containing updated data.
   */
  async function onSave(p: Product) {
    await saveProductUpdate({
      id: p.id,
      nombre: draftName,
      descripcion: draftDescription,
      precio: Number(draftPrice),
      stock: Number(draftStock),
      img_url: draftImg,
      product_category: draftCategory,
      activo: p.activo,
    });

    setEditingId(null);
    loadProducts(page, pageSize);
  }

  /* 🗑 DELETE */
  /**
   * Deletes a product by its ID and refreshes the list.
   *
   * @param {string} id - The unique identifier of the product to delete.
   */
  async function onDelete(id: string) {
    await deleteProduct(id);
    loadProducts(page, pageSize);
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Products</h2>
        <button
          onClick={onStartCreate}
          className="px-3 py-1 rounded-md bg-green-600 text-white text-sm"
        >
          Add product
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="p-2 text-xs text-left uppercase">ID</th>
              <th className="p-2 text-xs text-left uppercase">Name</th>
              <th className="p-2 text-xs text-left uppercase">Description</th>
              <th className="p-2 text-xs text-left uppercase">Price</th>
              <th className="p-2 text-xs text-left uppercase">Stock</th>
              <th className="p-2 text-xs text-left uppercase">Category</th>
              <th className="p-2 text-xs text-left uppercase">Image</th>
              <th className="p-2 text-xs text-left uppercase">Created</th>
              <th className="p-2 text-xs text-left uppercase">Updated</th>
              <th className="p-2 text-xs text-left uppercase">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-4 text-center text-sm text-gray-500">
                  Loading products…
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {isCreating && (
                  <motion.tr
                    key="create-row"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-t dark:border-slate-700 bg-green-50 dark:bg-slate-800/40"
                  >
                    <td className="p-2">-</td>
                    <td className="p-2">
                      <input
                        id="new-product-name"
                        name="new-product-name"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        id="new-product-desc"
                        name="new-product-desc"
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        id="new-product-price"
                        name="new-product-price"
                        value={draftPrice}
                        onChange={(e) => setDraftPrice(e.target.value)}
                        className="w-24 rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        id="new-product-stock"
                        name="new-product-stock"
                        value={draftStock}
                        onChange={(e) => setDraftStock(e.target.value)}
                        className="w-24 rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <select
                        id="new-product-category"
                        name="new-product-category"
                        value={draftCategory}
                        onChange={(e) => setDraftCategory(Number(e.target.value))}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      >
                        {categories.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.nombre}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        id="new-product-img"
                        name="new-product-img"
                        value={draftImg}
                        onChange={(e) => setDraftImg(e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">-</td>
                    <td className="p-2">-</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={onCreate}
                        className="px-2 py-1 rounded-md bg-blue-600 text-white text-sm"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setIsCreating(false)}
                        className="px-2 py-1 rounded-md bg-gray-200 dark:bg-slate-700 text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </motion.tr>
                )}

                {items.map((p, idx) => (
                  <motion.tr
                    key={p.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: idx * 0.03 }}
                    className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-2 text-sm">{p.id}</td>
                    <td className="p-2 text-sm">
                      {editingId === p.id ? (
                        <input
                          id={`edit-product-name-${p.id}`}
                          name="product-name"
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        p.nombre
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {editingId === p.id ? (
                        <input
                          id={`edit-product-desc-${p.id}`}
                          name="product-description"
                          value={draftDescription}
                          onChange={(e) => setDraftDescription(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        p.descripcion
                      )}
                    </td>
                    <td className="p-2 text-sm">{editingId === p.id ? (
                      <input
                        id={`edit-product-price-${p.id}`}
                        name="product-price"
                        value={draftPrice}
                        onChange={(e) => setDraftPrice(e.target.value)}
                        className="w-24 rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    ) : (
                      `${p.precio} €`
                    )}
                    </td>
                    <td className="p-2 text-sm">{editingId === p.id ? (
                      <input
                        id={`edit-product-stock-${p.id}`}
                        name="product-stock"
                        value={draftStock}
                        onChange={(e) => setDraftStock(e.target.value)}
                        className="w-24 rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    ) : (
                      p.stock
                    )}
                    </td>
                    <td className="p-2 text-sm">
                      {editingId === p.id ? (
                        <select
                          id={`edit-product-cat-${p.id}`}
                          name="product-category"
                          value={draftCategory}
                          onChange={(e) => setDraftCategory(Number(e.target.value))}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.nombre}
                            </option>
                          ))}
                        </select>
                      ) : (
                        categories.find((c) => c.id === p.product_category)?.nombre || p.product_category
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {editingId === p.id ? (
                        <input
                          id={`edit-product-img-${p.id}`}
                          name="product-image"
                          value={draftImg}
                          onChange={(e) => setDraftImg(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        <img
                          src={p.img_url ?? ""}
                          alt={p.nombre}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      )}
                    </td>
                    <td className="p-2 text-sm">{p.creado_en}</td>
                    <td className="p-2 text-sm">{p.actualizado_en}</td>
                    <td className="p-2 text-sm flex gap-2">
                      {editingId === p.id ? (
                        <>
                          <button
                            onClick={() => onSave(p)}
                            className="px-2 py-1 rounded-md bg-blue-600 text-white text-sm"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingId(null)}
                            className="px-2 py-1 rounded-md bg-gray-200 dark:bg-slate-700 text-sm"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => onStartEdit(p)}
                            className="px-2 py-1 rounded-md bg-indigo-600 text-white text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(p.id)}
                            className="px-2 py-1 rounded-md bg-red-600 text-white text-sm"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={loading} />
    </section>
  );
}
