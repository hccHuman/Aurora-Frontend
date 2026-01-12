import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, User as UserIcon } from "lucide-react";
import type { User } from "@/models/dashboardProps/DashboardUsersProps";
import { fetchUsers, saveUser, saveUserUpdate, deleteUser } from "@/services/dashboardUsersService";
import Pagination from "@/components/tsx/Dashboard/ui/Pagination";
import { getResponsivePageSize } from "@/services/deviceService";

/**
 * UsersList Component
 *
 * Provides a management interface for users in the dashboard.
 * Supports CRUD operations: fetching, creating, updating, and deleting users.
 * Handles role management, account activation, and password updates.
 * Features a dynamic creation row, row-level editing, toggleable password visibility, and responsive pagination.
 *
 * @component
 */
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

  /**
   * Loads a paginated list of users from the server.
   *
   * @param {number} currentPage - The page number to fetch.
   * @param {number} size - The number of users per page.
   */
  async function loadUsers(currentPage: number, size: number) {
    setLoading(true);
    const res = await fetchUsers(currentPage, size);
    if (res) {
      setItems(res.data);
      setTotalPages(res.totalPages);
    }
    setLoading(false);
  }

  /* Role Helper */
  const getRoleLabel = (isAdmin: boolean) => {
    if (isAdmin) return (
      <span className="flex items-center gap-1.5 text-red-400 font-medium">
        <Shield className="w-3.5 h-3.5" />
        Admin
      </span>
    );
    return (
      <span className="flex items-center gap-1.5 text-slate-500 dark:text-slate-400">
        <UserIcon className="w-3.5 h-3.5" />
        User
      </span>
    );
  };

  const ROLE_OPTIONS = [
    { value: 1, label: "Admin" },
    { value: 2, label: "User" },
  ];

  /* ➕ CREATE */
  /**
   * Initializes the interface for creating a new user.
   */
  function onStartCreate() {
    setEditingId("new");
    setDraftName("");
    setDraftEmail("");
    setDraftPassword("");
    setDraftRolId(2);
    setDraftActivo(true);
  }

  /* ✏️ EDIT */
  /**
   * Initializes the editing state for a specific user.
   *
   * @param {User} u - The user object to edit.
   */
  function onStartEdit(u: User) {
    setEditingId(u.id);
    setDraftName(u.nombre);
    setDraftEmail(u.email);
    setDraftRolId(u.admin ? 1 : 2); // Map boolean to ID for the select
    setDraftActivo(u.activo);
    setDraftPassword(u.password_hash || ""); // Start with hash/existing
  }

  /* 💾 SAVE */
  /**
   * Persists changes to an existing user or creates a new one.
   * Refreshes the user list upon success.
   *
   * @param {User} [u] - The user to update, or undefined if creating a new one.
   */
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
      if (draftPassword && draftPassword !== u.password_hash) {
        payload.password = draftPassword;
      }
      await saveUserUpdate(payload);
    }

    setEditingId(null);
    loadUsers(page, pageSize);
  }

  /* 🗑 DELETE */
  /**
   * Deletes a user by their ID and refreshes the list.
   *
   * @param {string} id - The unique identifier of the user to delete.
   */
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
              <AnimatePresence mode="popLayout">
                {/* Nueva fila */}
                {editingId === "new" && (
                  <motion.tr
                    key="new-user"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border-t dark:border-slate-700 bg-gray-50 dark:bg-slate-800/40"
                  >
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
                      <div className="relative">
                        <select
                          value={draftRolId}
                          onChange={(e) => setDraftRolId(Number(e.target.value))}
                          className="w-full appearance-none rounded-md border pl-8 pr-2 py-1 text-sm dark:bg-slate-800 dark:text-white focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none transition-colors cursor-pointer"
                        >
                          <option value={1}>Admin</option>
                          <option value={2}>User</option>
                        </select>
                        <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                          {Number(draftRolId) === 1 ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                        </div>
                      </div>
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
                  </motion.tr>
                )}

                {/* Filas existentes */}
                {items.map((u, idx) => (
                  <motion.tr
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 10 }}
                    transition={{ duration: 0.2, delay: idx * 0.05 }}
                    className="border-t dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors"
                  >
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
                    <td className="p-2 flex gap-1 items-center">
                      {editingId === u.id ? (
                        <>
                          <input
                            type={draftShowPassword ? "text" : "password"}
                            value={draftPassword}
                            onFocus={() => {
                              if (draftPassword === u.password_hash) setDraftPassword("");
                            }}
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
                        <div className="relative">
                          <select
                            value={draftRolId}
                            onChange={(e) => setDraftRolId(Number(e.target.value))}
                            className="w-full appearance-none rounded-md border pl-8 pr-2 py-1 text-sm dark:bg-slate-800 dark:text-white focus:ring-1 focus:ring-red-400 focus:border-red-400 outline-none transition-colors cursor-pointer"
                          >
                            <option value={1}>Admin</option>
                            <option value={2}>User</option>
                          </select>
                          <div className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                            {Number(draftRolId) === 1 ? <Shield className="w-3.5 h-3.5" /> : <UserIcon className="w-3.5 h-3.5" />}
                          </div>
                        </div>
                      ) : (
                        getRoleLabel(u.admin)
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