import React, { useState } from "react";
import { useAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { clientService } from "@/services/clientService";
import type { Auth } from "@/models/EcommerceProps/UserProps";
import { validateEmail, validatePassword, validateName } from "@/utils/validators";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { t } from "@/modules/YOLI/injector";

/**
 * RegisterComponent Component
 *
 * Provides a user interface for new users to create an account.
 * Handles extensive form validation including name check, email format,
 * password complexity, and password confirmation.
 * Integrates with clientService.register and updates global auth state.
 *
 * @component
 */
export const RegisterComponent: React.FC<Auth> = ({ lang }) => {
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

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateName(nombre)) {
      setError(t("auth.errors.invalid_name", lang));
      return;
    }

    if (!validateEmail(email)) {
      setError(t("auth.errors.invalid_email", lang));
      return;
    }

    if (!validatePassword(password)) {
      setError(t("auth.errors.invalid_password", lang));
      return;
    }

    if (password !== password2) {
      setError(t("auth.errors.passwords_dont_match", lang));
      return;
    }

    setLoading(true);
    try {
      const data = await clientService.register({ nombre, email, password });
      setUser({ loggedIn: true, user: data.user, ready: true });
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(t("auth.register.success", lang));
      setTimeout(() => {
        window.location.href = "/";
      }, 1500);
    } catch (err: any) {
      setError(err.message || t("auth.errors.unknown_register", lang));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mt-12 p-6 sm:px-8 md:px-12 border rounded-lg shadow-md bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{t("auth.register.title", lang)}</h2>

      {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
      {success && <p className="text-green-500 mb-3 text-center">{success}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 relative">
        {/* Name */}
        <input
          type="text"
          placeholder={t("auth.labels.name", lang)}
          aria-label={t("auth.labels.name", lang)}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          className="text-black px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Email */}
        <input
          type="email"
          placeholder={t("auth.labels.email", lang)}
          aria-label={t("auth.labels.email", lang)}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-black px-4 py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
        />

        {/* Password */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.labels.password", lang)}
            aria-label={t("auth.labels.password", lang)}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="text-black px-4 py-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={showPassword ? t("aria.hide_password", lang) : t("aria.show_password", lang)}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Repeat Password */}
        <div className="relative">
          <input
            type={showPassword2 ? "text" : "password"}
            placeholder={t("auth.labels.confirm_password", lang)}
            aria-label={t("auth.labels.confirm_password", lang)}
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            className="text-black px-4 py-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword2(!showPassword2)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={showPassword2 ? t("aria.hide_password", lang) : t("aria.show_password", lang)}
          >
            {showPassword2 ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-sky-700 dark:bg-sky-500 text-white py-3 rounded hover:bg-sky-600 dark:hover:bg-sky-400 transition text-lg disabled:opacity-50"
        >
          {loading ? t("auth.register.button_loading", lang) : t("auth.register.button", lang)}
        </button>

        <p className="mt-6 text-center text-slate-700 dark:text-slate-300">
          {t("auth.register.have_account", lang)}{" "}
          <a
            href={`/${lang}/account/login`}
            className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
          >
            {t("auth.register.login_here", lang)}
          </a>
        </p>
      </form>
    </div>
  );
};

export default RegisterComponent;
