/**
 * Login Form Component
 *
 * Controlled form component for user authentication with email and password.
 *
 * Workflow:
 * 1. Initialize from localStorage (check if user is already logged in)
 * 2. Collect email and password from user input
 * 3. Call clientService.login() to authenticate with backend
 * 4. Store user data in Jotai atom (userStore) and localStorage
 * 5. Display success message and redirect to home page
 * 6. Handle and display errors if authentication fails
 *
 * State Management:
 * - Uses Jotai (userStore) for global user state
 * - Uses localStorage for session persistence
 * - Local React state (useState) for form fields and messages
 *
 * Features:
 * - Email and password validation (required fields)
 * - Loading state management during authentication
 * - Error and success message display
 * - Auto-redirect after successful login (1000ms delay)
 * - Responsive design (mobile, tablet, desktop)
 * - Dark mode support with Tailwind
 */

import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { clientService } from "@/services/clientService";
import type { Auth } from "@/models/EcommerceProps/UserProps";

/**
 * LoginComponent - Authentication form UI
 *
 * @component
 * @returns JSX.Element - Form with email/password inputs and auth button
 */
export const LoginComponent: React.FC<Auth> = ({ lang }) => {
  // Global user state from Jotai atom store
  const [user, setUser] = useAtom(userStore);

  // Form field states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // User feedback states
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  /**
   * Initialize component state from localStorage on mount
   *
   * Restores user session if previously logged in
   * Checks for "login" flag and "user" data in localStorage
   */
  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if user was previously logged in
      const loggedIn = localStorage.getItem("login") === "true";
      const userData = JSON.parse(localStorage.getItem("user") || "null");

      // Restore user state if session exists
      if (loggedIn && userData) {
        setUser({ loggedIn: true, user: userData });
      }
    }
  }, []);

  /**
   * Handle form submission - authenticate user
   *
   * Process:
   * 1. Prevent default form submission
   * 2. Clear previous error/success messages
   * 3. Call clientService.login() with email and password
   * 4. On success: Store tokens and update user state
   * 5. Show success message and auto-redirect after 1 second
   * 6. On error: Catch exception and display error message
   *
   * @param e - React form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const data = await clientService.login({ email, password });

      // Actualiza atom global directamente
      setUser({
        loggedIn: true,
        user: data.user, // usar la info que devuelve el backend
      });

      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("¡Login exitoso! Redirigiendo… 💖");

      // Redirección opcional
      setTimeout(() => {
        window.location.href = "/";
      }, 1000);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    }
  };
  return (
    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mt-12 p-6 sm:px-8 md:px-12 border rounded-lg shadow-md bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Inicia sesión</h2>

      {/* Error message display */}
      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}

      {/* Success message display */}
      {success && <p className="text-green-500 mb-2 text-center">{success}</p>}

      {/* Login form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email input field */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black px-4 py-3 sm:px-6 sm:py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Password input field */}
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-black px-4 py-3 sm:px-6 sm:py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Submit button */}
        <button
          type="submit"
          className="bg-sky-700 dark:bg-sky-500 text-white py-3 sm:py-4 rounded hover:bg-sky-600 dark:hover:bg-sky-400 transition text-lg sm:text-xl"
        >
          Iniciar sesión
        </button>
      </form>

      {/* Display logged-in user status */}
      {user.loggedIn && (
        <p className="mt-4 text-center text-green-600 text-lg sm:text-xl">
          ¡Conectado exitosamente! 💖
        </p>
      )}
      {/* Enlace a registro */}
      <p className="mt-6 text-center text-slate-700 dark:text-slate-300">
        ¿No tienes cuenta?{" "}
        <a
          href={`/${lang}/account/register`}
          className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
        >
          Regístrate aquí
        </a>
      </p>
    </div>
  );
};

export default LoginComponent;
