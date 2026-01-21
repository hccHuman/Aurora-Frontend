import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { clientService } from "@/services/clientService";
import type { Auth } from "@/models/EcommerceProps/UserProps";
import { validateEmail, validatePassword } from "@/utils/validators";
import { t } from "@/modules/YOLI/injector";

// 👁️ Importar iconos (Heroicons)
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

/**
 * LoginComponent Component
 *
 * Provides a user interface for existing users to log in to their account.
 * Handles form validation (email/password format) and integration with clientService.login.
 * Updates the global userStore and persists login state in sessionStorage and localStorage.
 *
 * @component
 */
export const LoginComponent: React.FC<Auth> = ({ lang }) => {
  const [user, setUser] = useAtom(userStore);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // visibility state

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const loggedIn = localStorage.getItem("login") === "true";
      const userData = JSON.parse(localStorage.getItem("user") || "null");
      if (loggedIn && userData) {
        setUser({ loggedIn: true, user: userData, ready: true });
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!validateEmail(email)) {
      setError(t("auth.errors.invalid_email", lang));
      return;
    }

    if (!validatePassword(password)) {
      setError(t("auth.errors.invalid_password", lang));
      return;
    }

    try {
      const data = (await clientService.login({ email, password })) as any;
      setUser({ loggedIn: true, user: data.user, ready: true });
      sessionStorage.setItem("login", "true");
      sessionStorage.setItem("user", JSON.stringify(data.user));
      setSuccess(t("auth.login.success", lang));
      setTimeout(() => (window.location.href = `/${lang}/`), 1500);
    } catch (err: any) {
      setError(err.message || t("auth.errors.unknown", lang));
    }
  };

  return (
    <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto mt-12 mb-20 md:mb-8 lg:mb-0 p-6 sm:px-8 md:px-12 border rounded-lg shadow-md bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-center">{t("auth.login.title", lang)}</h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <div className="text-center min-h-[1.25rem]">
          {error && (
            <p
              className="text-red-500 mb-2"
              role="alert"
              aria-live="assertive"
            >
              {error}
            </p>
          )}
          {success && (
            <p
              className="text-green-500 mb-2"
              role="status"
              aria-live="polite"
            >
              {success}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="flex flex-col">
          <input
            aria-describedby={error ? "email-error" : undefined}
            id="email"
            name="email"
            type="email"
            placeholder={t("auth.labels.email", lang)}
            aria-label={t("auth.labels.email", lang)}
            aria-invalid={error && !validateEmail(email) ? "true" : "false"}
            autoComplete="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (!validateEmail(e.target.value)) {
                setError(t("auth.errors.invalid_email", lang));
              } else {
                setError(null);
              }
            }}
            required
            className="text-black px-4 py-3 sm:px-6 sm:py-3 rounded border focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Password */}
        <div className="relative flex flex-col">
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder={t("auth.labels.password", lang)}
            aria-label={t("auth.labels.password", lang)}
            aria-invalid={error && !validatePassword(password) ? "true" : "false"}
            aria-describedby={error ? "password-error" : undefined}
            autoComplete="current-password"
            value={password}
            onChange={(e) => {
              setPassword(e.target.value);
              if (!validatePassword(e.target.value)) {
                setError(t("auth.errors.invalid_password", lang));
              } else {
                setError(null);
              }
            }}
            required
            className="text-black px-4 py-3 sm:px-6 sm:py-3 rounded border w-full focus:outline-none focus:ring-2 focus:ring-sky-500"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
            aria-label={showPassword ? t("aria.hide_password", lang) : t("aria.show_password", lang)}
            aria-pressed={showPassword}
          >
            {showPassword ? <EyeSlashIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="bg-sky-700 dark:bg-sky-500 text-white py-3 sm:py-4 rounded hover:bg-sky-600 dark:hover:bg-sky-400 transition text-lg sm:text-xl disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!validateEmail(email) || !validatePassword(password)}
          aria-disabled={!validateEmail(email) || !validatePassword(password)}
        >
          {t("auth.login.button", lang)}
        </button>
      </form>

      {user.loggedIn && (
        <p className="mt-4 text-center text-green-600 text-lg sm:text-xl">
          {t("auth.login.connected", lang)}
        </p>
      )}

      <p className="mt-6 text-center text-slate-700 dark:text-slate-300">
        {t("auth.login.no_account", lang)}{" "}
        <a
          href={`/${lang}/account/register`}
          className="text-sky-600 dark:text-sky-400 hover:underline font-semibold"
        >
          {t("auth.login.register_here", lang)}
        </a>
      </p>
    </div>
  );
};

export default LoginComponent;
