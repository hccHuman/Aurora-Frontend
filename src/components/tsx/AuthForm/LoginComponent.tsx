import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { clientService } from "@/services/clientService";
import type { Auth } from "@/models/EcommerceProps/UserProps";
import { validateEmail, validatePassword } from "@/utils/validators";

// 👁️ Importar iconos (Heroicons)
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

export const LoginComponent: React.FC<Auth> = ({ lang }) => {
  const [user, setUser] = useAtom(userStore);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // estado ojo

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("login") === "true";
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      if (loggedIn && userData) {
        setUser({ loggedIn: true, user: userData });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError("El email no es válido 💔");
      return;
    }

    if (!validatePassword(password)) {
      setError(
        "La contraseña debe tener mínimo 8 caracteres, 1 mayúscula, 1 minúscula, 1 número y 1 carácter especial 💔"
      );
      return;
    }

    try {
      const data = await clientService.login({ email, password });
      setUser({ loggedIn: true, user: data.user });
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("¡Login exitoso! Redirigiendo… 💖");
      setTimeout(() => (window.location.href = "/"), 1000);
    } catch (err: any) {
      setError(err.message || "Error desconocido");
    }
  };

  return (
    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mt-12 p-6 sm:px-8 md:px-12 border rounded-lg shadow-md bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">Inicia sesión</h2>

      {error && <p className="text-red-500 mb-2 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-2 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Email */}
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black px-4 py-3 sm:px-6 sm:py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black px-4 py-3 sm:px-6 sm:py-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            {showPassword ? (
              <EyeSlashIcon className="h-5 w-5" />
            ) : (
              <EyeIcon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-sky-700 dark:bg-sky-500 text-white py-3 sm:py-4 rounded hover:bg-sky-600 dark:hover:bg-sky-400 transition text-lg sm:text-xl"
        >
          Iniciar sesión
        </button>
      </form>

      {user.loggedIn && (
        <p className="mt-4 text-center text-green-600 text-lg sm:text-xl">
          ¡Conectado exitosamente! 💖
        </p>
      )}

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
