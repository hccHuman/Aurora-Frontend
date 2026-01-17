import { fetchUserProfile, updateUserProfile } from '@/services/profileService';
import { PUBLIC_API_URL } from '@/utils/envWrapper';

describe('profileService', () => {
    beforeEach(() => {
        (globalThis.fetch as jest.Mock).mockClear();
    });

    describe('fetchUserProfile', () => {
        it('fetches profile successfully', async () => {
            const mockUser = { id: '1', nombre: 'Test', email: 'test@test.com' };
            (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockUser,
            });

            const result = await fetchUserProfile();
            expect(result).toEqual(mockUser);
            expect(globalThis.fetch).toHaveBeenCalledWith(
                `${PUBLIC_API_URL}/users/profile`,
                expect.objectContaining({ method: 'GET' })
            );
        });

        it('returns null on error', async () => {
            (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
                ok: false,
                status: 500,
            });
            // We need to mock handleInternalError or ensure it doesn't crash testing
            // It is imported from '@/modules/ALBA/ErrorHandler'. 
            // If it's just logging, it might be fine.
            const result = await fetchUserProfile();
            expect(result).toBeNull();
        });
    });

    describe('updateUserProfile', () => {
        it('updates profile successfully', async () => {
            const updateData = { nombre: 'Updated' };
            const mockUser = { id: '1', nombre: 'Updated', email: 'test@test.com' };
            (globalThis.fetch as jest.Mock).mockResolvedValueOnce({
                ok: true,
                json: async () => mockUser,
            });

            const result = await updateUserProfile(updateData);
            expect(result).toEqual(mockUser);
            expect(globalThis.fetch).toHaveBeenCalledWith(
                `${PUBLIC_API_URL}/users/update`,
                expect.objectContaining({
                    method: 'POST',
                    body: JSON.stringify(updateData)
                })
            );
        });
    });
});
