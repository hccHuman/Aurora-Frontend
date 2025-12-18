// src/components/LoginReader.tsx
import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { userStore } from "@/store/userStore";
import type { Profile } from "@/models/EcommerceProps/UserProps";
import { clientService } from "@/services/clientService";

/**
 * LoginReader Component
 *
 * - Lee sessionStorage para ver si hay sesión activa
 * - Si no hay sesión en sessionStorage, consulta backend (/auth/me)
 * - Actualiza Jotai global userStore
 * - No renderiza nada visual
 *
 * Uso: Colocar en cualquier lugar de tu árbol React, incluso en index.astro
 */
const LoginReader: React.FC = () => {
  const setUser = useSetAtom(userStore);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreSession = async () => {
      try {
        // Primero intentamos restaurar desde sessionStorage
        const loggedIn = sessionStorage.getItem("login") === "true";
        const userData: Profile | null = JSON.parse(sessionStorage.getItem("user") || "null");

        if (loggedIn && userData) {
          setUser({ loggedIn: true, user: userData });
          console.log("💖 Sesión restaurada desde sessionStorage");
          return;
        }

        // Si no hay sesión en sessionStorage, consultamos backend
        const data = await clientService.me(); // valida cookie HttpOnly
        if (data.user) {
          setUser({ loggedIn: true, user: data.user });
          sessionStorage.setItem("login", "true");
          sessionStorage.setItem("user", JSON.stringify(data.user));
          console.log("💖 Sesión restaurada desde backend");
        } else {
          setUser({ loggedIn: false, user: null });
          sessionStorage.setItem("login", "false");
          sessionStorage.setItem("user", JSON.stringify(null));
          console.log("❌ No hay sesión válida");
        }
      } catch (err) {
        // No queremos saturar la consola con errores esperables (token expirado).
        // Usamos console.debug para mantener la información disponible en depuración
        // sin alarmar al desarrollador con un error de nivel "error".
        setUser({ loggedIn: false, user: null });
        sessionStorage.setItem("login", "false");
        sessionStorage.setItem("user", JSON.stringify(null));
        console.debug("❌ Error restaurando sesión:", err);
      }
    };

    restoreSession();
  }, [setUser]);

  return null; // no renderiza nada
};

export default LoginReader;