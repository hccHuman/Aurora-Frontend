// src/components/tsx/AdminOnly.tsx
import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";

interface AdminOnlyProps {
  children: React.ReactNode;
}

/**
 * AdminOnly Component
 *
 * A specialized wrapper component that restricts access to its children to admin users only.
 * Checks the global `userStore` for the user's admin status and session readiness.
 * Redirects non-admin or unauthenticated users to the home page.
 * Provides a secure layer for administrative interface elements.
 *
 * @component
 */
const AdminOnly: React.FC<AdminOnlyProps> = ({ children }) => {
  const userState = useAtomValue(userStore);

  useEffect(() => {
    // Only redirect when the session is ready
    if (userState.ready && (!userState.loggedIn || !userState.user?.admin)) {
      window.location.href = "/";
    }
  }, [userState]);

  // While we don't know if the session is ready, we render nothing
  if (!userState.ready) return null;

  // Only render if user is admin
  if (!userState.loggedIn || !userState.user?.admin) return null;

  return <>{children}</>;
};

export default AdminOnly;
