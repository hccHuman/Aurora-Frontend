import { useEffect, useState } from "react";
import type { Category } from "@/models/dashboardProps/DashboardCategoriesProps";
import {
  fetchCategories,
  saveCategory,
  saveCategoryUpdate,
  deleteCategory,
} from "@/services/dashboardCategoriesService";
import Pagination from "@/components/tsx/Dashboard/ui/Pagination";
import { getResponsivePageSize } from "@/services/deviceService";

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

  async function loadCategories(currentPage: number, size: number) {
    setLoading(true);
    const res = await fetchCategories(currentPage, size);
    if (res) {
      // Mapea img_url a img
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
  function onStartEdit(c: Category) {
    setEditingId(c.id);
    setDraftName(c.nombre);
    setDraftImg(c.img ?? "");
  }

  /* ✚ Crear nueva categoría */
  function onStartCreate() {
    setEditingId("new");
    setDraftName("");
    setDraftImg("");
  }

  /* 💾 Save category */
  async function onSave(c: Category | null) {
    if (c) {
      // Actualización
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
      // Crear nueva categoría
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
              items.map((c) => (
                <tr key={c.id} className="border-t dark:border-slate-700">
                  <td className="p-2 text-sm">{c.id}</td>

                  <td className="p-2 text-sm">
                    {editingId === c.id ? (
                      <input
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
                </tr>
              ))
            )}

            {/* Fila de creación */}
            {editingId === "new" && (
              <tr className="bg-gray-50 dark:bg-slate-800">
                <td className="p-2 text-sm">-</td>
                <td className="p-2">
                  <input
                    value={draftName}
                    onChange={(e) => setDraftName(e.target.value)}
                    className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                    placeholder="Category name"
                  />
                </td>
                <td className="p-2">
                  <input
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
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onPageChange={setPage} disabled={loading} />
    </section>
  );
}
