# AuroraChatFrame Component Tests

**Ubicación:** `tests/modules/aurora-chat-frame.test.tsx`
**Tipo:** Pruebas Unitarias / Componente
**Estado:** ✅ PASS (29/29 tests)
**Frameworks:** Jest, React Testing Library, Jotai

## 1. Descripción General
El componente `AuroraChatFrame` es la interfaz principal del chat con la IA. Estas pruebas validan su comportamiento visual, lógico y de integración con el gestor de mensajes.

## 2. Dependencias Mockeadas

| Módulo | Función | Comportamiento Simulado |
| :--- | :--- | :--- |
| **react-markdown** | Componente | Renderiza `div` con hijos para permitir inspección de texto. |
| **remark-gfm** | Plugin | Mock vacío (función identidad). |
| **@/services/chatService** | `initChat` | Retorna `{ chatId: "mock-chat-id", data: [] }` para evitar carga de datos reales. |
| **AuroraMessageManager** | `processUserInput` | Devuelve respuestas simuladas según keywords (ver abajo). |

## 3. Escenarios de Prueba y Valores

### A. Renderizado Inicial
Verifica el estado del componente al montarse.

| Caso de Prueba | Valor Esperado | Notas |
| :--- | :--- | :--- |
| **Placeholder Input** | `"Escribe un mensaje..."` | Debe coincidir exactamente. |
| **Botón de Envío** | `role="button"` | Contiene un SVG, no texto. |
| **Mensajes Iniciales** | `0` elementos | El historial debe estar vacío (mock). |
| **Valor Input** | `""` (vacío) | Estado limpio inicial. |

### B. Interacción y Limpieza
| Acción | Input | Resultado Esperado |
| :--- | :--- | :--- |
| **Escribir** | `"Hola Aurora"` | `input.value` updatea a `"Hola Aurora"`. |
| **Enviar** | `"Mensaje de prueba"` | `input.value` se limpia a `""` tras click. |
| **Caracteres Especiales** | `"¿Hola? ¡Aurora! ¿Cómo estás?"` | Se aceptan y mantienen intactos. |
| **Acentos** | `"áéíóú ÁÉÍÓÚ ñ Ñ"` | Se aceptan correctamente. |

### C. Pipeline de Mensajes (IA Response Logic)
Simula el flujo completo de conversación y las respuestas automáticas de Aurora basadas en el mock de `processUserInput`.

| Input de Usuario | Keyword Detectada | Respuesta de Aurora (Mock) |
| :--- | :--- | :--- |
| `"Me siento feliz"` | `"feliz"` | `"✨ Estoy súper feliz, mi amor ~"` |
| `"Me siento triste"` | `"triste"` | `"💗 No pasa nada, estoy contigo preciosa"` |
| `"Hola"` (Generico) | *(ninguna)* | `"Lorem ipsum dolor sit amet..."` (Default) |

### D. Casos Límite (Edge Cases)
Manejo de entradas inusuales o inválidas.

| Escenario | Valor de Input | Comportamiento Esperado | Verificación Técnica |
| :--- | :--- | :--- | :--- |
| **Mensaje Vacío** | `""` (Cilck directo) | **No envía nada.** | `processUserInput.not.toHaveBeenCalled()` |
| **Solo Espacios** | `"   "` | **No envía nada.** | `processUserInput.not.toHaveBeenCalled()` |
| **Mensaje Muy Largo** | `"a".repeat(200)` | Se envía y muestra completo. | Texto presente en el DOM. |
| **Emojis** | `"Hola Aurora 💖 ¿Cómo estás? 😊"` | Se renderizan correctamente. | Texto presente en el DOM. |
| **Números** | `"123 456 789"` | Se tratan como texto válido. | Texto presente en el DOM. |

## 4. Estrategias de Testing Específicas
*   **Aislamiento de Estado:** Se utiliza un wrapper `<Provider>` de Jotai en cada función `render()` para asegurar que el `chatHistoryAtom` se reinicie entre pruebas, evitando "fugas" de mensajes de un test a otro.
*   **Asincronía:** Se utiliza `await waitFor(() => expect(...))` para las validaciones de respuestas de la IA, ya que `processUserInput` es asíncrono.
*   **Robustez:** Para validar que *no* se envían mensajes vacíos, se verifica la *ausencia de llamada* al servicio (`mock.calls.length === 0`) en lugar de contar elementos en el DOM, lo cual es más preciso.
