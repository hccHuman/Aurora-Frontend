// src/components/tsx/statement/UserOnly.tsx
import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";

interface UserOnlyProps {
    children: React.ReactNode;
}

/**
 * UserOnly Component
 *
 * A specialized wrapper component that restricts access to its children to logged-in users only.
 * Checks the global `userStore` for the user's login status and session readiness.
 * Redirects unauthenticated users to the home page (where they can find the login link).
 *
 * @component
 */
const UserOnly: React.FC<UserOnlyProps> = ({ children }) => {
    const userState = useAtomValue(userStore);

    useEffect(() => {
        // Redirect only when session is ready and user is not logged in
        if (userState.ready && !userState.loggedIn) {
            // We redirect to home or login. Since we don't have the current lang here easily, 
            // redirecting to / is a safe default as it detects lang.
            window.location.href = "/";
        }
    }, [userState]);

    // While session is not ready, render nothing
    if (!userState.ready) return null;

    // Only render if logged in
    if (!userState.loggedIn) return null;

    return <>{children}</>;
};

export default UserOnly;
