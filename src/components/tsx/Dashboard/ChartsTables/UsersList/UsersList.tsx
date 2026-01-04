import { useEffect, useState } from "react";
import type { User } from "@/models/dashboardProps/DashboardUsersProps";
import { fetchUsers, saveUser, saveUserUpdate, deleteUser } from "@/services/dashboardUsersService";
import Pagination from "@/components/tsx/Dashboard/ui/Pagination";
import { getResponsivePageSize } from "@/services/deviceService";

export default function UsersList() {
  const [items, setItems] = useState<User[]>([]);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(() => getResponsivePageSize());
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");
  const [draftEmail, setDraftEmail] = useState("");
  const [draftPassword, setDraftPassword] = useState("");
  const [draftRolId, setDraftRolId] = useState<number>(2);
  const [draftActivo, setDraftActivo] = useState(true);
  const [draftShowPassword, setDraftShowPassword] = useState(false);

  /* 📐 Responsive page size */
  useEffect(() => {
    const handleResize = () => {
      setPageSize(getResponsivePageSize());
      setPage(1);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* 🔄 Load users */
  useEffect(() => {
    loadUsers(page, pageSize);
  }, [page, pageSize]);

  async function loadUsers(currentPage: number, size: number) {
    setLoading(true);
    const res = await fetchUsers(currentPage, size);
    if (res) {
      setItems(res.data);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  }

  /* ➕ CREATE */
  function onStartCreate() {
    setEditingId("new");
    setDraftName("");
    setDraftEmail("");
    setDraftPassword("");
    setDraftRolId(2);
    setDraftActivo(true);
  }

  /* ✏️ EDIT */
  function onStartEdit(u: User) {
    setEditingId(u.id);
    setDraftName(u.nombre);
    setDraftEmail(u.email);
    setDraftRolId(u.rol_id);
    setDraftActivo(u.activo);
    setDraftPassword(""); // vacío, para permitir cambiarlo
  }

  /* 💾 SAVE */
  async function onSave(u?: User) {
    if (editingId === "new") {
      // ➕ CREATE (password obligatorio)
      await saveUser({
        nombre: draftName,
        email: draftEmail,
        rol_id: draftRolId,
        activo: draftActivo,
        password: draftPassword,
      });
    } else if (u) {
      // ✏️ UPDATE (password opcional)
      const payload: any = {
        id: u.id,
        nombre: draftName,
        email: draftEmail,
        rol_id: draftRolId,
        activo: draftActivo,
      };
      if (draftPassword) payload.password = draftPassword; // solo si se escribió
      await saveUserUpdate(payload);
    }

    setEditingId(null);
    loadUsers(page, pageSize);
  }

  /* 🗑 DELETE */
  async function onDelete(id: string) {
    await deleteUser(id);
    loadUsers(page, pageSize);
  }

  return (
    <section className="bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 p-4 rounded-lg">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold">Users</h2>
        <button
          onClick={onStartCreate}
          className="px-3 py-1.5 rounded-md bg-emerald-600 text-white text-sm"
        >
          + New user
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-slate-700">
          <thead className="bg-gray-50 dark:bg-slate-800">
            <tr>
              <th className="p-2 text-xs text-left uppercase">ID</th>
              <th className="p-2 text-xs text-left uppercase">Name</th>
              <th className="p-2 text-xs text-left uppercase">Email</th>
              <th className="p-2 text-xs text-left uppercase">Password Hash</th>
              <th className="p-2 text-xs text-left uppercase">Role</th>
              <th className="p-2 text-xs text-left uppercase">Active</th>
              <th className="p-2 text-xs text-left uppercase">Last Login</th>
              <th className="p-2 text-xs text-left uppercase">Created At</th>
              <th className="p-2 text-xs text-left uppercase">Updated At</th>
              <th className="p-2 text-xs text-left uppercase">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={10} className="p-4 text-center text-sm text-gray-500">
                  Loading users…
                </td>
              </tr>
            ) : (
              <>
                {/* Nueva fila */}
                {editingId === "new" && (
                  <tr className="border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40">
                    <td className="p-2">-</td> {/* ID */}
                    <td className="p-2">
                      <input
                        value={draftName}
                        onChange={(e) => setDraftName(e.target.value)}
                        placeholder="Name"
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        value={draftEmail}
                        onChange={(e) => setDraftEmail(e.target.value)}
                        placeholder="Email"
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    {/* Password Hash como input al crear */}
                    <td className="p-2 flex gap-1 items-center">
                      <input
                        type={draftShowPassword ? "text" : "password"}
                        value={draftPassword}
                        onChange={(e) => setDraftPassword(e.target.value)}
                        placeholder="Password"
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                      <button
                        type="button"
                        onClick={() => setDraftShowPassword(!draftShowPassword)}
                        className="px-2 py-1 rounded-md bg-gray-300 dark:bg-slate-700 text-xs"
                      >
                        {draftShowPassword ? "Hide" : "Show"}
                      </button>
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        value={draftRolId}
                        onChange={(e) => setDraftRolId(Number(e.target.value))}
                        className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="checkbox"
                        checked={draftActivo}
                        onChange={(e) => setDraftActivo(e.target.checked)}
                      />
                    </td>
                    <td className="p-2">-</td> {/* Last login */}
                    <td className="p-2">-</td> {/* Created */}
                    <td className="p-2">-</td> {/* Updated */}
                    <td className="p-2 space-y-1">
                      <div className="flex gap-2 mt-1">
                        <button
                          onClick={() => onSave()}
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
                    </td>
                  </tr>
                )}

                {/* Filas existentes */}
                {items.map((u) => (
                  <tr key={u.id} className="border-t dark:border-slate-700">
                    <td className="p-2 text-sm">{u.id}</td>
                    <td className="p-2 text-sm">
                      {editingId === u.id ? (
                        <input
                          value={draftName}
                          onChange={(e) => setDraftName(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        u.nombre
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {editingId === u.id ? (
                        <input
                          value={draftEmail}
                          onChange={(e) => setDraftEmail(e.target.value)}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        u.email
                      )}
                    </td>
                    {/* Password Hash: mostrar hash si no se edita, input si se edita */}
                    <td className="p-2 flex gap-1 items-center">
                      {editingId === u.id ? (
                        <>
                          <input
                            type={draftShowPassword ? "text" : "password"}
                            value={draftPassword}
                            onChange={(e) => setDraftPassword(e.target.value)}
                            placeholder="New Password"
                            className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setDraftShowPassword(!draftShowPassword)}
                            className="px-2 py-1 rounded-md bg-gray-300 dark:bg-slate-700 text-xs"
                          >
                            {draftShowPassword ? "Hide" : "Show"}
                          </button>
                        </>
                      ) : (
                        <span className="font-mono break-all text-sm">{u.password_hash}</span>
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {editingId === u.id ? (
                        <input
                          type="number"
                          value={draftRolId}
                          onChange={(e) => setDraftRolId(Number(e.target.value))}
                          className="w-full rounded-md border px-2 py-1 text-sm dark:bg-slate-800 dark:text-white"
                        />
                      ) : (
                        u.rol_id
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {editingId === u.id ? (
                        <input
                          type="checkbox"
                          checked={draftActivo}
                          onChange={(e) => setDraftActivo(e.target.checked)}
                        />
                      ) : u.activo ? (
                        "Yes"
                      ) : (
                        "No"
                      )}
                    </td>
                    <td className="p-2 text-sm">
                      {u.ultimo_login ? new Date(u.ultimo_login).toLocaleString() : "-"}
                    </td>
                    <td className="p-2 text-sm">{new Date(u.creado_en).toLocaleString()}</td>
                    <td className="p-2 text-sm">{new Date(u.actualizado_en).toLocaleString()}</td>
                    <td className="p-2 text-sm">
                      {editingId === u.id ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => onSave(u)}
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
                            onClick={() => onStartEdit(u)}
                            className="px-2 py-1 rounded-md bg-indigo-600 text-white text-sm"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => onDelete(u.id)}
                            className="px-2 py-1 rounded-md bg-red-600 text-white text-sm"
                          >
                            Delete
                          </button>
                        </div>
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