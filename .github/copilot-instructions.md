# Aurora Frontend - AI Coding Agent Instructions

## Project Overview

Aurora is an intelligent e-commerce platform with emotionally-aware AI chatbot integration. The frontend is built with **Astro 5** (SSR/static framework) + **React 19** (for interactive components) + **TypeScript**. The project features a tri-modal AI system (LUCIA/MARIA/ANA) that processes user input, manages application state, and generates emotional avatar responses.

**Active Branch:** `feature-cart-catalog-ui` | **Build System:** Astro + React with Jest testing

---

## Big Picture Architecture

### Core Module System (src/modules/)

#### **AURORA** - Message Processing Pipeline

- **Role:** User input validation, sanitization, and message preprocessing
- **Key Files:** `AURORA/core/AuroraMessageManager.ts`, `AuroraMessageController.ts`, `AuroraSanitizer.ts`
- **Pattern:** Static utility methods + error-safe fallbacks
- **Integration:** Receives raw user input → outputs sanitized, emotion-analyzed instruction objects
- **Example:** `processUserInput("hello")` → returns canonical/lowercase processed message

#### **LUCIA** - Logic & Communication Interface

- **Role:** Intent detection, command parsing, user-facing communication logic
- **Key Files:** `LUCIA/core.ts`, `LUCIA/interface.ts`, `LUCIA/models/`
- **Note:** Currently minimal implementation; theme-manager subdirectory handles dark/light mode logic
- **Data Flow:** Interprets user intent for routing to appropriate handlers

#### **MARIA** - Application State & Orchestration

- **Role:** Global state management, navigation coordination, module routing
- **Key Files:** `MARIA/context.ts`, `MARIA/routes.ts`
- **Pattern:** Acts as central dispatcher between AURORA input pipeline and UI updates
- **Integration:** Coordinates message flow from input → emotion analysis → UI rendering

#### **ANA** - Emotion Analysis & Avatar Control

- **Role:** Maps response text to emotional state, avatar expressions, and motion animations
- **Key Files:** `ANA/AnaCore.ts` (orchestration), `ANA/AnaEmotionMap.ts` (keyword→emotion mapping), `ANA/data/`
- **Critical Method:** `AnaCore.processUserMessage(message)` → Returns `AuroraInstruction` object with `{emotion, expression, motion, text}`
- **Pattern:** Synchronous emotion detection (keyword matching in `AnaEmotionMap`) + async backend communication
- **Emotion Mapping:** Uses `emotionConfig` to match keywords (e.g., "happy"/"glad" → emotion:'happy', expression:'smile', motion:'haru_g_m02')

#### **ALBA** - Error Handling & Logging

- **Role:** Centralized error reporting with numeric codes
- **Key Files:** `ALBA/ErrorHandler.ts`
- **Pattern:** `handleInternalError(code, message)` where codes ≈ HTTP status equivalents (e.g., "800"=unavailable)
- **Usage:** All async service calls wrap errors here

### State Management (src/store/)

**Pattern: Jotai atoms** (atomic reactive state, not Context API)

- `uiStore` - Theme (darkMode), mobile menu visibility
- `cartStore` - E-commerce cart operations
- `userStore` - Authentication/user profile
- **Note:** No Redux; Jotai atoms imported directly in components via `useAtom()`

### Service Layer (src/services/)

| Service              | Purpose                                          | Error Handling                       |
| -------------------- | ------------------------------------------------ | ------------------------------------ |
| `chatService.ts`     | POST to `/aurora/chats` backend endpoint         | Returns fallback message on failure  |
| `apiClient.ts`       | Generic HTTP wrapper with base URL configuration | Throws or returns error response     |
| `categoryService.ts` | Fetch product categories                         | Handles 404/5xx gracefully           |
| `productService.ts`  | Product CRUD operations                          | Returns empty array on fetch failure |
| `paymentService.ts`  | PayPal checkout integration                      | Modal error messaging                |

### Component Architecture (src/components/)

**TSX Components (Interactive React):**

- Located in `components/tsx/` with subdirectories per component
- Use Jotai hooks (`useAtom`) for state, NOT useState where possible
- Pattern: Form components (LoginForm, CheckoutForm) use controlled inputs
- Example: `ThemeToggle.tsx` reads/writes `uiStore.darkMode` on mount

**Astro Components (Static/Layout):**

- Located in `components/layout/` (Header.astro, Footer.astro)
- Astro server-side rendering (no React lifecycle)
- CSS scoping: Astro's `<style>` block (auto-scoped)

---

## Critical Developer Workflows

### Running the Application

```bash
npm run dev          # Start Astro dev server (http://localhost:3000)
npm run build        # Production static build → dist/
npm run preview      # Preview built output
npm run tsc:check    # Type checking without emitting
```

### Testing & Quality

```bash
npm test                              # Run all Jest tests
npm run test:watch                    # Watch mode
npm run test:coverage                 # Coverage report
npm run test:chatbot                  # Run aurora-*.test.ts only
npm run test:sanitizer                # Sanitizer-specific tests
npm run test:messagemanager           # Message pipeline tests
npm run lint                          # ESLint check
npm run lint:fix                      # Auto-fix lint issues
npm run format:check                  # Prettier validation
npm run format                        # Auto-format code
```

### Jest Configuration

- **Test Environment:** jsdom (browser simulation)
- **Test Files:** Match `**/?(*.)+(spec|test).ts?(x)` in `src/` or `tests/`
- **Path Alias:** `@/` maps to `src/` (e.g., `import { AnaCore } from '@/modules/ANA/AnaCore'`)
- **Setup:** `jest.setup.js` loaded after test environment initialization
- **Coverage:** Excludes `.d.ts`, `pages/`, `.astro` files

### Type Checking & Imports

- **Strict Mode:** `tsconfig.json` extends `astro/tsconfigs/strict`
- **Path Mapping:** Use `@/` prefix for all imports under `src/`
  - ❌ `import { X } from '../../../modules/ANA/core'`
  - ✅ `import { X } from '@/modules/ANA/core'`
- **React JSX:** Configured with `jsxImportSource: "react"` (auto-import React not needed)

### Styling System

- **Base Styles:** `src/styles/global.css` (reset + utility vars)
- **Theme System:** `src/styles/theme.css` (dark/light mode CSS variables)
- **Component Styles:** Scoped via Astro `<style>` or inline in TSX
- **Utilities:** Tailwind CSS (daisyUI + custom config in `tailwind.config.js`)
- **Animations:** Defined in `src/styles/animations.css`, used in components

---

## Project-Specific Patterns & Conventions

### Message Processing Pipeline

Flow: User Input → AURORA (sanitize) → LUCIA (parse intent) → MARIA (route) → ANA (emotion) → Avatar

**Key Convention:** Always return `AuroraInstruction` type from emotion pipeline:

```typescript
interface AuroraInstruction {
  emotion: string; // 'happy', 'sad', 'neutral', etc.
  expression: string; // Avatar facial expression ID
  motion: string; // Haru animation motion ID (e.g., 'haru_g_m02')
  text: string; // Response text for display
}
```

### Emotion Detection

- **Synchronous First:** Check `AnaEmotionMap` for keyword matches before async operations
- **Fallback:** If no emotion detected, return `{emotion: 'neutral', expression: 'neutral', motion: 'haru_g_idle', text: ''}`
- **Data Location:** Emotion mappings in `ANA/data/emotionConfig.ts` (keywords → emotion objects)

### Error Codes (ALBA System)

- **800:** Service unavailable/timeout (e.g., backend down)
- **400:** Bad request/validation error
- **404:** Resource not found
- **500:** Server error
- **Usage:** `handleInternalError("800", errorMessage)` logs and returns safe default

### Testing Conventions

- **Test Organization:** Mirror `src/` structure in `tests/` (e.g., `tests/modules/aurora-*.test.ts`)
- **Async Patterns:** Use `async/await`, not `.then()` chains
- **Sanitization Tests:** Verify no `<script>` tags in output even with malicious input
- **Mocking:** Mock `fetch()` for backend calls; use `jest.mock()` for service isolation
- **Emotion Tests:** Verify emotion keywords are detected and appropriate animations assigned

### Component Naming & Organization

- **React Components:** PascalCase filenames with component exports (e.g., `CategoryCard/CategoryCard.tsx`)
- **Props Files:** `SomethingProps.ts` in `src/models/` (e.g., `AuroraProps/AuroraInstructionProps.ts`)
- **Index Files:** Each component folder has `index.tsx` re-exporting main component
- **Astro Pages:** Use `/` prefix in routing (e.g., `/en/`, `/es/` for i18n)

### Internationalization (i18n)

- **Library:** i18next
- **Config:** `src/config.ts` (language detection, namespaces)
- **Supported Languages:** English (`en/`), Spanish (`es/`) based on page routes
- **Usage:** Use i18next hooks in TSX, language switching via theme toggle integration

### Live2D Avatar Integration

- **Library:** pixi-live2d-display (Haru character model)
- **Assets:** Model files in `public/models/haru/` (.can3, .cmo3 files)
- **Motion IDs:** Defined in emotion mappings (e.g., `haru_g_m02` = greeting with smile)
- **Webpack Bundle:** `public/webpack/` contains Live2D core libraries
- **Pattern:** Load model on mount, queue motions via instruction objects

---

## Integration Points & External Dependencies

### Backend Communication

- **Endpoint:** `{PUBLIC_API_URL}/aurora/chats` (POST)
- **Payload:** `{ message: string }`
- **Response:** `{ text: string }` (response text, emotion analysis happens client-side)
- **Error Fallback:** Returns `{ text: "Sorry, I cannot connect to the server 😔" }`
- **Env Var:** `PUBLIC_API_URL` (public, visible in browser)

### PayPal Integration

- **Service:** `paymentService.ts` handles checkout flow
- **Component:** `PayPalCheckout.tsx` wraps PayPal button
- **Modal Pattern:** Errors displayed in Modal component (not thrown)

### Product & Category APIs

- **categoryService.ts:** Fetch and filter product categories
- **productService.ts:** CRUD operations on products
- **Error Strategy:** Return empty arrays/objects on fetch failure (no throw)

### Authentication (if implemented)

- **Store:** `userStore` (Jotai atom)
- **Token Storage:** Likely in localStorage (verify in userStore implementation)
- **JWT:** Expected in Authorization header for protected endpoints

---

## Code Style & Linting

### ESLint Rules

- **Base:** @eslint/js recommended
- **Formatting:** Prettier integration (no semicolon conflicts)
- **Astro Files:** Custom parser + astro plugin (no unused CSS selectors, safe HTML)
- **JSX Accessibility:** jsx-a11y plugin enforced (alt text, ARIA roles, etc.)

### Prettier Configuration

- Auto-format on save (configured in `.prettierrc` or eslint.config.js)
- Run before commits: `npm run format`

### TypeScript Strict Mode

- No implicit `any`
- Strict null checks
- All files must pass `npm run tsc:check`

---

## Common Tasks & Patterns

### Adding a New Component

1. Create folder in `src/components/tsx/{ComponentName}/`
2. Create `{ComponentName}.tsx` with JSDoc comments
3. Create `index.tsx` re-exporting the component
4. Create `{ComponentName}Props.ts` in `src/models/` if complex props
5. Use Jotai atoms for shared state, not prop drilling
6. Add unit tests in `tests/modules/{ComponentName}.test.tsx`

### Adding a New Service

1. Create in `src/services/{serviceName}.ts`
2. Export async functions with JSDoc describing params/return
3. Wrap errors with `ALBA.handleInternalError(code, message)`
4. Return safe defaults (empty arrays, null, or fallback objects)
5. Test with mocked `fetch()` in `tests/services/`

### Modifying Emotion Mappings

1. Edit `src/modules/ANA/data/emotionConfig.ts` (or equivalent)
2. Add keyword → emotion/expression/motion mappings
3. Verify motion ID exists in Haru model (check `public/models/haru/`)
4. Update emotion tests to include new keyword
5. Test avatar animation with dev server

### Debugging Message Processing

1. Add console.log in `AURORA/AuroraMessageManager.processUserInput`
2. Check `ALBA` error logs if emotion analysis fails
3. Verify backend `/aurora/chats` endpoint responds with `{ text: "..." }`
4. Use Jest `test:messagemanager` for isolated testing
5. Check browser DevTools for network errors and XSS blocks

---

## Testing Guidelines

### Unit Test Template

```typescript
import { processUserInput } from "@/modules/AURORA/core/AuroraMessageManager";

describe("AuroraMessageManager", () => {
  it("should handle valid input", async () => {
    const result = await processUserInput("Hello");
    expect(result).toBeDefined();
    expect(typeof result).toBe("string");
  });

  it("should detect emotion keywords", async () => {
    const result = await processUserInput("I feel happy");
    expect(result).toContain("emotion"); // If returning instruction object
  });

  it("should sanitize malicious input", async () => {
    const result = await processUserInput("Hello<script>alert(1)</script>");
    expect(result).not.toContain("<script>");
  });
});
```

### Testing Async Behavior

- Mock `fetch` or service calls before tests
- Use `jest.mock('@/services/chatService')` for service isolation
- Always test error paths (backend down, malformed response)
- Use `continueOnError: true` in Jest config for test suites

### Snapshot Testing

- Use sparingly; snapshots live in `__snapshots__/` directories
- Update with `jest -u` when intentional UI changes occur
- Review snapshot diffs carefully in code review

---

## Known Issues & Gotchas

1. **Empty Module Files:** Some modules (LUCIA/core.ts, MARIA/context.ts) may be empty or minimal—check implementation before assuming functionality.
2. **Theme Toggle Integration:** Theme switching is tightly coupled with i18n language switching; changes to one affect the other.
3. **Live2D Loading:** Avatar model loads on mount; slow networks may cause visible delays.
4. **Backend Timeout:** Chat service returns fallback message without explicit error to user; check ALBA logs for "800" errors.
5. **XSS Prevention:** All user input must pass through `AuroraSanitizer` before rendering (use `DOMPurify`).
6. **Astro SSR:** Some client-only features (localStorage, window) require `client:only` directive on React components.

---

## File Reference Summary

| File Path                                         | Purpose                         | Key Export                     |
| ------------------------------------------------- | ------------------------------- | ------------------------------ |
| `src/modules/AURORA/core/AuroraMessageManager.ts` | Message input pipeline          | `processUserInput(msg)`        |
| `src/modules/ANA/AnaCore.ts`                      | Emotion analysis orchestration  | `AnaCore.processUserMessage()` |
| `src/services/chatService.ts`                     | Backend communication           | `fetchBackendResponse()`       |
| `src/store/uiStore.ts`                            | UI global state (theme, menu)   | `uiStore` atom                 |
| `src/models/AuroraInstruction.ts`                 | Avatar instruction type         | `AuroraInstruction` interface  |
| `jest.config.js`                                  | Test runner configuration       | —                              |
| `tsconfig.json`                                   | TypeScript strict mode config   | —                              |
| `astro.config.mjs`                                | Astro + React integration setup | —                              |

---

## Questions for Clarification

When working on this codebase, consider:

- Is the change affecting the message pipeline (AURORA → ANA → UI)?
- Does it require new emotion mappings in AnaEmotionMap?
- Should the change be tested before avatar animation queues?
- Is sanitization happening on user input before storage/display?
- Does the backend API endpoint match the configured `PUBLIC_API_URL`?
