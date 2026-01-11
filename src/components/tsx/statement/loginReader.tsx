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
/**
 * LoginReader Component
 *
 * A silent utility component responsible for session restoration and synchronization.
 * Operates in the following sequence:
 * 1. Attempts to restore user session from `sessionStorage`.
 * 2. If unsuccessful, queries the backend `/auth/me` endpoint to validate HttpOnly cookies.
 * 3. Synchronizes the global `userStore` (Jotai) with the current authentication state.
 * This component handles its logic silently and does not render any visual elements.
 *
 * @component
 */
const LoginReader: React.FC = () => {
  const setUser = useSetAtom(userStore);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const restoreSession = async () => {
      try {
        // First, try to restore the session from sessionStorage
        const loggedIn = sessionStorage.getItem("login") === "true";
        const userData: Profile | null = JSON.parse(sessionStorage.getItem("user") || "null");

        if (loggedIn && userData) {
          setUser({ loggedIn: true, user: userData, ready: true });
          console.log("💖 Session restored from sessionStorage");
          return;
        }

        // If there is no session in sessionStorage, query the backend
        const data = await clientService.me(); // validates HttpOnly cookie
        if (data.user) {
          setUser({ loggedIn: true, user: data.user, ready: true });
          sessionStorage.setItem("login", "true");
          sessionStorage.setItem("user", JSON.stringify(data.user));
          console.log("💖 Session restored from backend");
          console.log("data: ", data.user);
        } else {
          setUser({ loggedIn: false, user: null, ready: true });
          sessionStorage.setItem("login", "false");
          sessionStorage.setItem("user", JSON.stringify(null));
          console.log("❌ No valid session found");
        }
      } catch (err) {
        // Console.debug to keep the information available for debugging
        setUser({ loggedIn: false, user: null, ready: true });
        sessionStorage.setItem("login", "false");
        sessionStorage.setItem("user", JSON.stringify(null));
        console.debug("❌ Error while restoring session:", err);
      }
    };

    restoreSession();
  }, [setUser]);

  return null; // renders nothing
};

export default LoginReader;