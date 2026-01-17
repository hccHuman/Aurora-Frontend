# Modules Tests Scenarios (Part 2)

**Directory:** `tests/modules/`

## 1. LUCIA Module (Accessibility & UI)
**File:** `lucia.test.ts`
**Focus:** Theme Manager, CVD Manager (Color Blindness), Accessibility Manager.

| Manager | Test Case | Expected Result |
| :--- | :--- | :--- |
| **ThemeManager** | Toggle Theme | Switches `light` <-> `dark` in localStorage and `<html>` class. Dispatches `theme-changed`. |
| **CvdManager** | Set Mode (`cvd-protanopia`) | Updates localStorage and body class. Removes old CVD classes. |
| **Accessibility** | Enable Epilepsy/AAA/Focus | Specific class added (`mode-epilepsy`, etc.) and setting persisted. |

## 2. AURORA Sanitizer
**File:** `aurora-sanitizer.test.ts`
**Focus:** Input security and cleaning.

| Input Sceneario | Behavior | Result |
| :--- | :--- | :--- |
| **XSS Attack** | `<script>alert(1)</script>` | Removed/Sanitized. |
| **Bad Words** | "Esto es tonto" | Replaced with "💫" -> "Esto es 💫". |
| **Format** | Extra spaces, long text | Trimmed, normalized, truncated if >300 chars. |
| **Allowed** | Spanish accents, punctuation | Preserved (`áéíóú`, `¿?`). |

## 3. AURORA Message Manager
**File:** `aurora-message-manager.test.ts`
**Focus:** Core Chat Pipeline (Sanitize -> Process -> AI Mock Response).

| Test Case | Scenario | Expected Result |
| :--- | :--- | :--- |
| **Standard Flow** | Valid Input ("Hola") | Returns object with `text`. |
| **Emotion Resp.** | Input "Me siento feliz" | Response matches happy keywords/emojis (`feliz`, `happy`, `✨`). |
| **Emotion Resp.** | Input "Me siento triste" | Response matches sad/supportive keywords (`triste`, `sad`, `💗`). |
| **Validation** | Empty/Whitespace input | Returns valid response object (does not crash). |
| **Integration** | XSS Input | Pipeline sanitizes input before processing. |
