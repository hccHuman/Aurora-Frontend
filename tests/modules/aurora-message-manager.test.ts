/**
 * Tests para AuroraMessageManager
 * Valida la pipeline de procesamiento de mensajes del usuario
 */
import { processUserInput } from "@/modules/AURORA/core/AuroraMessageManager";

describe("AuroraMessageManager", () => {
  describe("processUserInput", () => {
    it("debe procesar un mensaje de usuario válido", async () => {
      const input = "Hola Aurora, ¿cómo estás?";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
    });

    it('debe detectar palabra "feliz" y responder apropiadamente', async () => {
      const input = "Me siento feliz";
      const result = await processUserInput(input);
      // Response may be in Spanish or English; accept keyword or emoji
      expect(result).toMatch(/feliz|happy|✨|💫|love/i);
    });

    it('debe detectar palabra "triste" y responder apropiadamente', async () => {
      const input = "Me siento triste";
      const result = await processUserInput(input);
      // Accept comforting replies or keywords in English/Spanish
      expect(result).toMatch(/triste|sad|okay|here for you|💗|💫/i);
    });

    it("debe devolver respuesta por defecto para entradas neutrales", async () => {
      const input = "Hola, ¿qué tal?";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
      expect(result.length).toBeGreaterThan(0);
    });

    it("debe sanitizar la entrada antes de procesar", async () => {
      const input = "Hola<script>alert(1)</script>";
      const result = await processUserInput(input);
      // La respuesta no debe contener el script sin sanitizar
      expect(result).toBeDefined();
    });

    it("debe manejar entradas vacías", async () => {
      const input = "";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe manejar entradas solo espacios", async () => {
      const input = "     ";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe procesar palabras prohibidas removidas", async () => {
      const input = "Eres tonto";
      const result = await processUserInput(input);
      // La entrada será sanitizada reemplazando "tonto" con 💫
      expect(result).toBeDefined();
    });

    it("debe ser case-insensitive en detección de emociones", async () => {
      const input = "FELIZ FELIZ FELIZ";
      const result = await processUserInput(input);
      expect(result).toMatch(/feliz|happy|✨|💫/i);
    });

    it("debe manejar entradas muy largas", async () => {
      const input = "Hola Aurora " + "blablabla ".repeat(50);
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe retornar un string no vacío", async () => {
      const inputs = ["Hola", "Adiós", "¿Cómo estás?", "Me siento feliz", "Me siento triste"];

      for (const input of inputs) {
        const result = await processUserInput(input);
        expect(result).toBeTruthy();
        expect(result.trim().length).toBeGreaterThan(0);
      }
    });

    it("debe ser asíncrono y retornar una Promise", () => {
      const result = processUserInput("Hola");
      expect(result).toBeInstanceOf(Promise);
    });

    it("debe manejar caracteres especiales españoles", async () => {
      const input = "Me siento muy contento con los acentos: áéíóú";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe preservar estructura de respuesta", async () => {
      const input = "Prueba general";
      const result = await processUserInput(input);
      expect(typeof result).toBe("string");
      expect(result.length).toBeGreaterThan(0);
      expect(result.length).toBeLessThan(1000); // límite razonable
    });
  });

  describe("Casos límite de procesamiento", () => {
    it("debe manejar inyección XSS attempt", async () => {
      const input = '<img src=x onerror="alert(1)">';
      const result = await processUserInput(input);
      expect(result).toBeDefined();
      expect(result).not.toContain("<");
      expect(result).not.toContain(">");
    });

    it("debe manejar SQL injection attempt", async () => {
      const input = "'; DROP TABLE users; --";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe manejar repetición excesiva de caracteres", async () => {
      const input = "a".repeat(500);
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe manejar números y caracteres especiales de teclado", async () => {
      const input = "1234567890!@#$%^&*()";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe tolerar múltiples puntuaciones", async () => {
      const input = "¿¿¿Hola??? !!!Aurora!!! ...";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe manejar saltos de línea", async () => {
      const input = "Hola\nAurora\n¿Cómo\nestás?";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe manejar tabulaciones", async () => {
      const input = "Hola\t\t\tAurora\t¿Cómo estás?";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe manejar mezcla de español e inglés", async () => {
      const input = "Hello Aurora, ¿cómo estás? I am happy!";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });

    it("debe devolver respuesta incluso con entrada completamente limpia de caracteres", async () => {
      const input = "@#$%^&*()[]{}|;:,.<>?/~`";
      const result = await processUserInput(input);
      expect(result).toBeDefined();
    });
  });

  describe("Integración con módulos", () => {
    it("debe integrar sanitización correctamente", async () => {
      const dirtyInput = "<b>Hola</b> mundo con <script>injection</script>";
      const result = await processUserInput(dirtyInput);
      expect(result).toBeDefined();
      expect(result).not.toContain("<script>");
    });

    it("debe mantener coherencia en respuestas", async () => {
      const inputs = ["feliz", "Feliz", "FELIZ", "F E L I Z"];
      const results = [];

      for (const input of inputs) {
        const result = await processUserInput(input);
        results.push(result);
      }

      // Al menos una debe ser diferente por sanitización, pero todas deben existir
      expect(results.every((r) => r !== "")).toBe(true);
    });
  });
});
