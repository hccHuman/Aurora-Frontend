import { PUBLIC_API_URL } from '@/utils/envWrapper';
import { AlbaClient } from '@/modules/ALBA/AlbaClient';
import { handleInternalError } from '@/modules/ALBA/ErrorHandler';
import type { User } from '@/models/dashboardProps/DashboardUsersProps';

/** Fetch the currently authenticated user's profile */
export async function fetchUserProfile(): Promise<User | null> {
    try {
        const endpoint = `${PUBLIC_API_URL}/users/profile`;
        const res = await AlbaClient.get(endpoint);
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
        const endpoint = `${PUBLIC_API_URL}/users/update`;
        const res = await AlbaClient.post(endpoint, data);
        const json = await res.json();
        // Support wrapping in 'data' or 'user' property, or direct object
        return json.data || json.user || json;
    } catch (error: any) {
        handleInternalError(error);
        return null;
    }
}
