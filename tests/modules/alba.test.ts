/**
 * ALBA Module Tests
 * 
 * Verifies the functionality of:
 * 1. ErrorHandler: mapping codes to names
 * 2. AlbaClient: Intercepting responses and dispatching errors
 * 3. ToastStore: State management
 */

import { getErrorName, handleInternalError } from "@/modules/ALBA/ErrorHandler";
import { AlbaClient } from "@/modules/ALBA/AlbaClient";
import { albaStore, addToastAtom, toastsAtom, dispatchToast } from "@/modules/ALBA/store/toastStore";

// Mock fetch global
global.fetch = jest.fn();

describe("ALBA Error Module", () => {

    beforeEach(() => {
        jest.clearAllMocks();
        // Clear store
        albaStore.set(toastsAtom, []);
    });

    describe("Error Handler", () => {
        it("should resolve known error codes", () => {
            expect(getErrorName("600")).toBe("PRODUCTS.PRODUCT_NOT_FOUND");
            expect(getErrorName(800)).toBe("EXTERNAL.EXTERNAL_SERVICE_TIMEOUT");
        });

        it("should resolve unknown error codes gracefully", () => {
            expect(getErrorName(9999)).toBe("UNKNOWN_ERROR_CODE_9999");
        });
    });

    describe("Toast Store", () => {
        it("should add a toast", () => {
            dispatchToast("Test Message", "success");
            const toasts = albaStore.get(toastsAtom);
            expect(toasts).toHaveLength(1);
            expect(toasts[0].message).toBe("Test Message");
            expect(toasts[0].type).toBe("success");
        });
    });

    describe("AlbaClient", () => {
        it("should return JSON on success", async () => {
            (fetch as jest.Mock).mockResolvedValue({
                ok: true,
                clone: () => ({
                    json: async () => ({ data: "success" })
                }),
                json: async () => ({ data: "success" })
            });

            const res = await AlbaClient.get("/test");
            const data = await res.json();
            expect(data).toEqual({ data: "success" });
        });

        it("should detect Backend Pact Error and dispatch toast", async () => {
            // Mock Error Response: Status 200 but body contains error code
            // OR Status 400 with body
            (fetch as jest.Mock).mockResolvedValue({
                ok: false,
                status: 400,
                clone: () => ({
                    json: async () => ({ status: 400, error: "Custom Error", code: 620 })
                }),
                json: async () => ({ status: 400, error: "Custom Error", code: 620 })
            });

            // We expect AlbaClient to throw because logic says: if error detected, handle it AND throw
            await expect(AlbaClient.get("/test")).rejects.toThrow();

            // Check if toast was dispatched
            const toasts = albaStore.get(toastsAtom);
            expect(toasts.length).toBeGreaterThan(0);
            expect(toasts[0].message).toContain("Custom Error");
            expect(toasts[0].type).toBe("error");
        });
    });

});
