# Modules Tests Scenarios (Part 1)

**Directory:** `tests/modules/`

## 1. ALBA Module (Systems)
**File:** `alba.test.ts`
**Focus:** Error Handling, Toast Notification System, HTTP Client Interceptors.

| Component | Test Case | Expected Result |
| :--- | :--- | :--- |
| **ErrorHandler** | `getErrorName("600")` | Returns `"PRODUCTS.PRODUCT_NOT_FOUND"`. |
| **ToastStore** | `dispatchToast("Msg", "success")` | Store updates, contains message with type success. |
| **AlbaClient** | `get("/test")` Success | Returns JSON data. |
| **AlbaClient** | `get("/test")` Error (Back-end error in body) | Throws error AND dispatches Toast with error message. |

## 2. ANA Module (Emotion Analysis)
**File:** `ana.test.ts`
**Focus:** Keyword/Sentiment detection in user messages.

| Input Text | Detected Emotion | Mapped Motion |
| :--- | :--- | :--- |
| "estoy muy feliz hoy" | `feliz` | `haru_g_m02` |
| "te quiero mucho" | `te quiero` | `haru_g_m22` |
| "estoy muy enfado" | `enfado` | `haru_g_m19` |
| "hola buenos días" | `hola` | `haru_g_m01` |
| "texto neutral" | `agreeing` (default) | `haru_g_m11` |

**Integration:** `AnaCore.processUserMessage` validates that the final instruction object contains the correct emotion and motion derived from the text.
