/**
 * Register Form Component
 *
 * Controlled form component for user creation with name, email and password.
 *
 * Workflow:
 * 1. Collect user info (nombre, email, password)
 * 2. Call clientService.register() → backend creates account
 * 3. Store returned user data in Jotai atom (userStore)
 * 4. Persist session in sessionStorage
 * 5. Display success message + redirect to home
 * 6. Handle backend validation errors
 */

import React, { useState } from "react";
import { useAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { clientService } from "@/services/clientService";
import type { Auth } from "@/models/EcommerceProps/UserProps";

export const RegisterComponent: React.FC<Auth> = ({ lang }) => {
  // Global user state
  const [, setUser] = useAtom(userStore);

  // Form fields
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");

  // UI states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  /**
   * Handle form submit
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Basic frontend validation
    if (password !== password2) {
      setError("Las contraseñas no coinciden 💔");
      return;
    }

    setLoading(true);
    try {
      const data = await clientService.register({
        nombre,
        email,
        password,
      });

      // Save global user
      setUser({
        loggedIn: true,
        user: data.user,
      });

      // Persist session
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("¡Cuenta creada con éxito! 🌸 Redirigiendo…");

      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setError(err.message || "Error desconocido durante el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mt-12 p-6 sm:px-8 md:px-12 border rounded-lg shadow-md bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Crear cuenta</h2>

      {/* Error message */}
      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}

      {/* Success message */}
      {success && <p className="text-green-500 mb-3 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        {/* Name */}
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="text-black px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Password */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-black px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Repeat Password */}
        <input
          type="password"
          placeholder="Repetir contraseña"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          required
          className="text-black px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Submit button */}
        <button
          type="submit"
          disabled={loading}
          className="bg-sky-700 dark:bg-sky-500 text-white py-3 rounded hover:bg-sky-600 dark:hover:bg-sky-400 transition text-lg disabled:opacity-50"
        >
          {loading ? "Creando cuenta..." : "Registrarse"}
        </button>
        <p className="mt-6 text-center text-slate-700 dark:text-slate-300">
        ¿tienes cuenta?{" "}
        <a
          href={`/${lang}/account/login`}
          className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
        >
          Haz Login aquí
        </a>
      </p>
      </form>
    </div>
  );
};

export default RegisterComponent;
