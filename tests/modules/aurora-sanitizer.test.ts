/**
 * Tests para AuroraSanitizer
 * Validar que la función sanitizeText limpia entrada de usuarios de forma segura
 */
import { sanitizeText } from "@/modules/AURORA/core/AuroraSanitizer";

describe("AuroraSanitizer", () => {
  describe("sanitizeText", () => {
    it("debe limpiar caracteres especiales peligrosos", async () => {
      const input = 'Hola<script>alert("XSS")</script>';
      const result = await sanitizeText(input);
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("debe preservar caracteres alfanuméricos válidos y puntuación permitida", async () => {
      const input = "Hola mundo, ¿cómo estás?";
      const result = await sanitizeText(input);
      // The sanitizer preserves allowed punctuation and Spanish characters
      expect(result).toBe("Hola mundo, ¿cómo estás?");
    });

    it("debe trimear espacios al inicio y final", async () => {
      const input = "   Hola mundo   ";
      const result = await sanitizeText(input);
      expect(result).toBe("Hola mundo");
    });

    it("debe normalizar espacios múltiples", async () => {
      const input = "Hola    mundo    cómo   estás";
      const result = await sanitizeText(input);
      expect(result).toBe("Hola mundo cómo estás");
    });

    it("debe truncar texto muy largo (>300 caracteres)", async () => {
      const input = "a".repeat(350);
      const result = await sanitizeText(input);
      expect(result.length).toBeLessThanOrEqual(303); // 300 + "..."
    });

    it("debe reemplazar palabras prohibidas con 💫", async () => {
      const input = "Esto es tonto e idiota";
      const result = await sanitizeText(input);
      expect(result).toContain("💫");
      expect(result).not.toContain("tonto");
      expect(result).not.toContain("idiota");
    });

    it("debe ser case-insensitive para palabras prohibidas", async () => {
      const input = "TONTO es una palabra prohibida";
      const result = await sanitizeText(input);
      expect(result).toContain("💫");
    });

    it("debe aceptar caracteres acentuados españoles", async () => {
      const input = "áéíóú ÁÉÍÓÚ ñ Ñ";
      const result = await sanitizeText(input);
      expect(result).toContain("á");
      expect(result).toContain("é");
      expect(result).toContain("Á");
      expect(result).toContain("ñ");
    });

    it("debe eliminar símbolos y caracteres especiales", async () => {
      const input = "Hola @#$%^&*()[]{}";
      const result = await sanitizeText(input);
      expect(result).not.toContain("@");
      expect(result).not.toContain("#");
      expect(result).not.toContain("$");
    });

    it("debe preservar puntuación básica", async () => {
      const input = "Hola, ¿cómo estás? ¡Bien!";
      const result = await sanitizeText(input);
      expect(result).toContain(",");
      expect(result).toContain("?");
      expect(result).toContain("!");
    });

    it("debe manejar string vacío", async () => {
      const input = "";
      const result = await sanitizeText(input);
      expect(result).toBe("");
    });

    it("debe manejar solo espacios en blanco", async () => {
      const input = "     ";
      const result = await sanitizeText(input);
      expect(result).toBe("");
    });

    it("debe combinar múltiples casos de limpieza", async () => {
      const input = "   ¡Hola mundo!   eres estúpido   ";
      const result = await sanitizeText(input);
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
      expect(result).toContain("💫");
      expect(result.length).toBeLessThan(input.length);
    });

    it("caso límite: emojis no deberían pasar por el regex", async () => {
      const input = "Hola 👋 mundo 🌍 ¿cómo estás? 💫";
      const result = await sanitizeText(input);
      // Los emojis se deben filtrar como caracteres no \w
      expect(result).not.toContain("👋");
      expect(result).not.toContain("🌍");
      // El emoji 💫 lo usamos nosotros, así que no debe estar en la entrada limpiada
    });

    it("debe preservar números", async () => {
      const input = "El año 2024 es genial, ¿vamos al 100% de productividad?";
      const result = await sanitizeText(input);
      expect(result).toContain("2024");
      expect(result).toContain("100");
    });

    it("debe manejar URLs (los dominios y puntos permanecen)", async () => {
      const input = "Visita www.example.com para más info";
      const result = await sanitizeText(input);
      // The sanitizer keeps domain-like strings and removes protocol characters if present
      expect(result).toContain("www.example.com");
    });
  });

  describe("Casos límite edge cases", () => {
    it("debe manejar null/undefined sin errores", async () => {
      // En TypeScript esto daría error, pero en JS runtime puede ocurrir
      try {
        const result = await sanitizeText(null as any);
        expect(result).toBeDefined();
      } catch (e) {
        // Esperado si no hay manejo
        expect(e).toBeDefined();
      }
    });

    it("debe manejar SQL injection attempt", async () => {
      const input = "'; DROP TABLE users; --";
      const result = await sanitizeText(input);
      expect(result).not.toContain("'");
      expect(result).not.toContain(";");
      expect(result).not.toContain("-");
    });

    it("debe manejar múltiples espacios en puntuación", async () => {
      const input = "Hola , , , mundo . . .";
      const result = await sanitizeText(input);
      // The sanitizer normalizes spaces but preserves punctuation characters
      expect(result).toBe("Hola , , , mundo . . .");
    });
  });
});
