import { useEffect, useState } from "react";
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
  id: number;
  nombre: string;
}

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
  const [draftCategory, setDraftCategory] = useState<number>(1);

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

  async function loadProducts(p: number, size: number) {
    setLoading(true);
    const res = await fetchProducts(p, size);
    if (res) {
      setItems(res.data);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  }

  async function loadCategories() {
    try {
      const res = await fetchCategories();
      setCategories(res.data ?? []);
    } catch (e) {
      console.error("Failed to load categories", e);
      setCategories([{ id: 1, nombre: "Default" }]);
    }
  }

  /* ➕ CREATE */
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
              <>
                {isCreating && (
                  <tr className="border-t dark:border-slate-700 bg-green-50 dark:bg-slate-800/40">
                    <td className="p-2">-</td>
                    <td className="p-2">
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={draftDescription}
                        onChange={(e) => setDraftDescription(e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={draftPrice}
                        onChange={(e) => setDraftPrice(e.target.value)}
                        className="w-24 rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={draftStock}
                        onChange={(e) => setDraftStock(e.target.value)}
                        className="w-24 rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <select
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
                  </tr>
                )}

                {items.map((p) => (
                  <tr key={p.id} className="border-t dark:border-slate-700">
                    <td className="p-2 text-sm">{p.id}</td>
                    <td className="p-2 text-sm">
                      {editingId === p.id ? (
                        <input
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
                  </tr>
                ))}
              </>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={loading} />
    </section>
  );
}
