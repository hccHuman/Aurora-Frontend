
import { processUserInput } from '../../src/modules/AURORA/core/AuroraMessageManager';
import { sendMessage } from '../../src/services/chatService';
import { AnaCore } from '../../src/modules/ANA/AnaCore';

// Mock dependencies
jest.mock('../../src/services/chatService');
jest.mock('../../src/modules/AURORA/core/AuroraVoice');

describe('Aurora Chat Integration Flow', () => {

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('should process user input, call backend, and return text with chatId', async () => {
        // Arrange
        const mockChatId = 123;
        const userInput = "Hola Aurora";
        const mockApiResponse = {
            chatId: mockChatId,
            aiMessage: {
                id: 1,
                remitente: "ia",
                contenido: "Hola, soy Aurora. ¿En qué puedo ayudarte?",
                creadoEn: "2024-01-01T12:00:00Z"
            }
        };

        (sendMessage as jest.Mock).mockResolvedValue(mockApiResponse);

        // Act
        const result = await processUserInput(userInput);

        // Assert
        expect(sendMessage).toHaveBeenCalledWith(userInput, undefined);
        expect(result).toEqual({
            text: mockApiResponse.aiMessage.contenido,
            chatId: mockChatId
        });
    });

    test('should maintain chatId in subsequent calls', async () => {
        // Arrange
        const initialChatId = 999;
        const userInput = "Segunda pregunta";
        const mockApiResponse = {
            chatId: initialChatId,
            aiMessage: {
                id: 2,
                remitente: "ia",
                contenido: "Entendido.",
                creadoEn: "2024-01-01T12:01:00Z"
            }
        };

        (sendMessage as jest.Mock).mockResolvedValue(mockApiResponse);

        // Act
        const result = await processUserInput(userInput, initialChatId);

        // Assert
        expect(sendMessage).toHaveBeenCalledWith(userInput, initialChatId);
        expect(result).toEqual({
            text: mockApiResponse.aiMessage.contenido,
            chatId: initialChatId
        });
    });

    test('should handle backend errors gracefully', async () => {
        // Arrange
        const userInput = "Error test";
        (sendMessage as jest.Mock).mockRejectedValue(new Error("Network fail"));

        // Act
        // NOTE: AuroraMessageManager -> AnaCore -> catch -> returns default instruction
        const result = await processUserInput(userInput);

        // Assert
        expect(result.text).toBe(""); // Default text from AnaCore error handling might be empty or specific? 
        // Let's check AnaCore implementation.
        // It returns: { instruction: { emotion: "neutral", ..., text: undefined }, ... }
        // AuroraMessageManager returns: instruction.text || ""

        // So we expect empty string or fallback if we added one. 
        // In this test setup, we just verify it doesn't crash.
    });
});
