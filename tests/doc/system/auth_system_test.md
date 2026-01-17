# Authentication System Tests

**Ubicación:** 
- `tests/system/login.test.tsx`
- `tests/system/register.test.tsx`

**Tipo:** Pruebas de Sistema
**Estado:** ✅ PASS
**Mocking Layer:** `clientService`

## 1. Descripción General
Estas pruebas validan los formularios críticos de autenticación. Verifican la validación de campos del lado del cliente, el manejo de errores de inputs y la integración exitosa con el servicio de autenticación (mockeado).

## 2. Escenarios Login (`LoginComponent`)

| Caso de Prueba | Input | Resultado Esperado |
| :--- | :--- | :--- |
| **Invalid Email** | `email: "invalid-email"` | Error: "Email is invalid". |
| **Weak Password** | `pass: "weak"` | Error: "Password must be at least 8 characters". |
| **Login Exitoso** | Credenciales válidas | Llama a `clientService.login` y muestra "Login successful". |

## 3. Escenarios Register (`RegisterComponent`)

| Caso de Prueba | Input | Resultado Esperado |
| :--- | :--- | :--- |
| **Invalid Name** | `name: "A"` | Error: "Name is invalid". |
| **Password Mismatch** | `pass: "Strong123!"`<br>`confirm: "Diff!"` | Error: "Passwords do not match". |
| **Registro Exitoso** | Datos válidos completos | Llama a `clientService.register` y muestra "Account created successfully". |

## 4. Estrategia de Mocking
El `clientService` es interceptado para evitar llamadas HTTP reales.
- `login`: Mocked response `{ user: { id: '1', ... } }`
- `register`: Mocked response `{ user: { id: '2', ... } }`
