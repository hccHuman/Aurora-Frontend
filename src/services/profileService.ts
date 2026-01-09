import { PUBLIC_API_URL } from '@/utils/envWrapper';
import { handleInternalError } from '@/modules/ALBA/ErrorHandler';
import type { User } from '@/models/dashboardProps/DashboardUsersProps';

/** Fetch the currently authenticated user's profile */
export async function fetchUserProfile(): Promise<User | null> {
    try {
        const endpoint = `${PUBLIC_API_URL}/api/users/profile`;
        const res = await fetch(endpoint, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });
        if (!res.ok) throw new Error(`Profile fetch error: ${res.status}`);
        const json = await res.json();
        // Support wrapping in 'data' or 'user' property, or direct object
        return json.data || json.user || json;
    } catch (error: any) {
        handleInternalError(error);
        return null;
    }
}

/** Update the currently authenticated user's profile */
export async function updateUserProfile(data: Partial<User>): Promise<User | null> {
    try {
        const endpoint = `${PUBLIC_API_URL}/api/users/update`;
        const res = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify(data),
        });
        if (!res.ok) throw new Error(`Profile update error: ${res.status}`);
        const json = await res.json();
        // Support wrapping in 'data' or 'user' property, or direct object
        return json.data || json.user || json;
    } catch (error: any) {
        handleInternalError(error);
        return null;
    }
}
