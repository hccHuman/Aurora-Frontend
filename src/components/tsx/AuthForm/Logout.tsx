// src/components/Logout.tsx
import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { clientService } from "@/services/clientService";
import { useYOLI } from "@/modules/YOLI/injector";

/**
 * LogoutComponent Component
 *
 * Automatically triggers the logout process when mounted.
 * Calls clientService.logout, clears the global userStore, and cleans up storage.
 * Redirects the user back to the previous page once completed.
 *
 * @component
 */
const LogoutComponent: React.FC<{ lang?: string }> = ({ lang = "es" }) => {
  const t = useYOLI(lang);
  const setUser = useSetAtom(userStore);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await clientService.logout();
        setUser({ loggedIn: false, user: null, ready: true });
        sessionStorage.setItem("login", "false");
        sessionStorage.setItem("user", JSON.stringify([]));

        // Dispatch global event to close all menus
        window.dispatchEvent(new CustomEvent("aurora-logout"));

        window.location.href = "/";
      } catch (e) {
        console.error("❌ Error al hacer logout", e);
      }
    };
    doLogout();
  }, [setUser]);

  return <p style={{ color: "white" }} role="status">{t("common.logging_out")}</p>;
};

export default LogoutComponent;
