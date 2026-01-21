import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Category } from "@/models/dashboardProps/DashboardCategoriesProps";
import {
  fetchCategories,
  saveCategory,
  saveCategoryUpdate,
  deleteCategory,
} from "@/services/dashboardCategoriesService";
import Pagination from "@/components/tsx/Dashboard/ui/Pagination";
import { getResponsivePageSize } from "@/services/deviceService";

/**
 * CategoryTable Component
 *
 * Provides a management interface for product categories in the dashboard.
 * Supports CRUD operations: fetching, creating, updating, and deleting categories.
 * Integrates with `dashboardCategoriesService` for data persistence.
 * Features responsive pagination and framer-motion animations for row transitions.
 *
 * @component
 */
export default function CategoryTable() {
  const [items, setItems] = useState<Category[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsivePageSize());
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftImg, setDraftImg] = useState("");

  /* 📐 Responsive page size */
  useEffect(() => {
    const handleResize = () => {
      setPageSize(getResponsivePageSize());
      setPage(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 🔄 Load categories */
  useEffect(() => {
    loadCategories(page, pageSize);
  }, [page, pageSize]);

  /**
   * Loads a paginated list of categories from the server.
   * Maps `img_url` to `img` for internal component consistency.
   *
   * @param {number} currentPage - The page number to fetch.
   * @param {number} size - The number of categories per page.
   */
  async function loadCategories(currentPage: number, size: number) {
    setLoading(true);
    const res = await fetchCategories(currentPage, size);
    if (res) {
      // Maps img_url to img
      const mapped = res.data.map((c: any) => ({
        ...c,
        img: c.img_url ?? null,
      }));
      setItems(mapped);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  }

  /* ✏️ Start editing */
  /**
   * Initializes the editing state for a specific category.
   *
   * @param {Category} c - The category object to edit.
   */
  function onStartEdit(c: Category) {
    setEditingId(c.id);
    setDraftName(c.nombre);
    setDraftImg(c.img ?? "");
  }

  /* ✚ Create new category */
  /**
   * Prepares the interface for creating a new category.
   */
  function onStartCreate() {
    setEditingId("new");
    setDraftName("");
    setDraftImg("");
  }

  /* 💾 Save category */
  /**
   * Persists changes to a category or creates a new one.
   * Handles both creation (`c` is null) and updates (`c` is provided).
   *
   * @param {Category | null} c - The category to update, or null if creating a new one.
   */
  async function onSave(c: Category | null) {
    if (c) {
      // Update
      const saved = await saveCategoryUpdate({
        id: c.id,
        nombre: draftName,
        img_url: draftImg,
      });
      if (saved) {
        setItems((prev) =>
          prev.map((item) =>
            item.id === c.id ? { ...item, nombre: draftName, img: draftImg } : item
          )
        );
      }
    } else {
      // Create new category
      const saved = await saveCategory({ nombre: draftName, img_url: draftImg });
      if (saved) {
        setItems((prev) => [saved, ...prev]);
      }
    }

    setEditingId(null);
    setDraftName("");
    setDraftImg("");
  }

  /* 🗑 Delete */
  /**
   * Deletes a category by its ID.
   *
   * @param {string} id - The unique identifier of the category to delete.
   */
  async function onDelete(id: string) {
    await deleteCategory(id);
    setItems((prev) => prev.filter((c) => c.id !== id));
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-lg font-semibold">Categories</h2>
        <button
          onClick={onStartCreate}
          className="px-3 py-1 rounded-md bg-green-600 text-white text-sm"
        >
          Add Category
        </button>
      </div>
      <div className="mb-5">
        <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={loading} />
      </div>
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="p-2 text-left text-xs uppercase">ID</th>
              <th className="p-2 text-left text-xs uppercase">Name</th>
              <th className="p-2 text-left text-xs uppercase">Image</th>
              <th className="p-2 text-left text-xs uppercase">Updated</th>
              <th className="p-2 text-left text-xs uppercase">Actions</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-4 text-center text-sm text-gray-500">
                  Loading categories…
                </td>
              </tr>
            ) : (
              <AnimatePresence mode="popLayout">
                {items.map((c, idx) => (
                  <motion.tr
                    key={c.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    <td className="p-2 text-sm">{c.id}</td>

                    <td className="p-2 text-sm">
                      {editingId === c.id ? (
                        <input
                          id={`edit-cat-name-${c.id}`}
                          name="category-name"
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        c.nombre
                      )}
                    </td>

                    <td className="p-2 text-sm">
                      {editingId === c.id ? (
                        <input
                          id={`edit-cat-img-${c.id}`}
                          name="category-image"
                          value={draftImg}
                          onChange={(e) => setDraftImg(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                          placeholder="Image URL"
                        />
                      ) : c.img ? (
                        <img
                          src={c.img}
                          alt={c.nombre}
                          className="w-16 h-16 object-cover rounded-md"
                        />
                      ) : null}
                    </td>

                    <td className="p-2 text-sm">
                      {c.actualizado_en ? new Date(c.actualizado_en).toLocaleString() : "-"}
                    </td>

                    <td className="p-2 text-sm">
                      {editingId === c.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSave(c)}
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
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onStartEdit(c)}
                            className="px-2 py-1 rounded-md bg-indigo-600 text-white text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(c.id)}
                            className="px-2 py-1 rounded-md bg-red-600 text-white text-sm"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </motion.tr>
                ))}

                {/* Creation row */}
                {editingId === "new" && (
                  <motion.tr
                    key="new-category"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gray-50 dark:bg-slate-800"
                  >
                    <td className="p-2 text-sm">-</td>
                    <td className="p-2">
                      <input
                        id="new-cat-name"
                        name="new-category-name"
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        placeholder="Category name"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        id="new-cat-img"
                        name="new-category-image"
                        value={draftImg}
                        onChange={(e) => setDraftImg(e.target.value)}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        placeholder="Image URL"
                      />
                      {draftImg && (
                        <img
                          src={draftImg}
                          alt="Preview"
                          className="w-16 h-16 object-cover rounded-md mt-1"
                        />
                      )}
                    </td>
                    <td className="p-2">-</td>
                    <td className="p-2 flex gap-2">
                      <button
                        onClick={() => onSave(null)}
                        className="px-2 py-1 rounded-md bg-green-600 text-white text-sm"
                      >
                        Add
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1 rounded-md bg-gray-200 dark:bg-slate-700 text-sm"
                      >
                        Cancel
                      </button>
                    </td>
                  </motion.tr>
                )}
              </AnimatePresence>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}
