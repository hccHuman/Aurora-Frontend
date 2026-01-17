// src/components/tsx/statement/UserOnly.tsx
import React, { useEffect } from "react";
import { useAtomValue } from "jotai";
import { userStore } from "@/store/userStore";

interface UserOnlyProps {
    children: React.ReactNode;
    lang: string;
}

/**
 * UserOnly Component
 *
 * A specialized wrapper component that restricts access to its children to logged-in users only.
 * Checks the global `userStore` for the user's login status and session readiness.
 * Redirects unauthenticated users to the Login page.
 *
 * @component
 */
const UserOnly: React.FC<UserOnlyProps> = ({ children, lang }) => {
    const userState = useAtomValue(userStore);

    useEffect(() => {
        // Redirect only when session is ready and user is not logged in
        if (userState.ready && !userState.loggedIn) {
            window.location.href = `/${lang}/account/login`;
        }
    }, [userState, lang]);

    // While session is not ready, render nothing
    if (!userState.ready) return null;

    // Only render if logged in
    if (!userState.loggedIn) return null;

    return <>{children}</>;
};

export default UserOnly;
