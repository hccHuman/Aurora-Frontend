// src/components/tsx/AdminOnly.tsx
import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";

interface AdminOnlyProps {
  children: React.ReactNode;
}

const AdminOnly: React.FC<AdminOnlyProps> = ({ children }) => {
  const userState = useAtomValue(userStore);

  useEffect(() => {
    // Solo redirigimos cuando la sesión esté lista
    if (userState.ready && (!userState.loggedIn || !userState.user?.admin)) {
      window.location.href = "/";
    }
  }, [userState]);

  // Mientras no sabemos si la sesión está lista, no renderizamos nada
  if (!userState.ready) return null;

  // Solo renderizamos si es admin
  if (!userState.loggedIn || !userState.user?.admin) return null;

  return <>{children}</>;
};

export default AdminOnly;
