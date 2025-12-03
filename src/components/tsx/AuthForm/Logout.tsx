// src/components/Logout.tsx
import React, { useEffect } from "react";
import { useSetAtom } from "jotai";
import { userStore } from "@/store/userStore";
import { clientService } from "@/services/clientService";

const LogoutComponent: React.FC = () => {
  const setUser = useSetAtom(userStore);

  useEffect(() => {
    const doLogout = async () => {
      try {
        await clientService.logout();
        setUser({ loggedIn: false, user: null });
        sessionStorage.setItem("login", "false");
        sessionStorage.setItem("user", JSON.stringify([]));
        history.back();
      } catch (e) {
        console.error("❌ Error al hacer logout", e);
      }
    };
    doLogout();
  }, [setUser]);

  return <p style={{ color: "white" }}>Cerrando sesion...</p>;
};

export default LogoutComponent;
