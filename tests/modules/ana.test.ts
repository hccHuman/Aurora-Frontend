
import { analyzeEmotion } from '@/modules/ANA/AnaEmotionMap';
import { AnaCore } from '@/modules/ANA/AnaCore';

// Mock chatService to return the input message as the AI response
jest.mock('@/services/chatService', () => ({
  sendMessage: jest.fn(async (message: string) => ({
    chatId: 1,
    aiMessage: { contenido: message }
  }))
}));

describe('ANA module', () => {
  describe('analyzeEmotion', () => {
    it('detects happy emotion and returns correct motion', () => {
      const out = analyzeEmotion('estoy muy feliz hoy');
      expect(out.emotion).toBe('happy');
      expect(out.motion).toBe('haru_g_m01');
    });

    it('detects love emotion', () => {
      const out = analyzeEmotion('te quiero mucho');
      expect(out.emotion).toBe('love');
      expect(out.motion).toBe('haru_g_m20');
    });

    // Removed the "excited" test? No, let's keep it simple.
    // The previous set was fine, I'll put back a few key ones.

    it('detects angry emotion', () => {
      const out = analyzeEmotion('estoy furioso contigo');
      expect(out.emotion).toBe('angry');
      expect(out.motion).toBe('haru_g_m10');
    });

    it('detects greeting', () => {
      const out = analyzeEmotion('hola buenos días');
      expect(out.emotion).toBe('greeting');
      expect(out.motion).toBe('haru_g_m04');
    });

    it('defaults to neutral when no keywords match', () => {
      const out = analyzeEmotion('esto es una prueba sin emocion');
      expect(out.emotion).toBe('neutral');
      expect(out.motion).toBe('haru_g_idle');
    });
  });

  describe('AnaCore.processUserMessage', () => {
    it('returns valid instruction with detected emotion', async () => {
      // Input "estoy triste" -> Mock returns "estoy triste" -> analyzeEmotion finds "sad"
      const result = await AnaCore.processUserMessage('estoy triste');
      if (result.instruction.emotion !== 'sad') {
        console.log('Test Failed. Result:', JSON.stringify(result, null, 2));
      }
      expect(result.instruction.emotion).toBe('sad');
      expect(result.instruction.motion).toBe('haru_g_m05');
      expect(result.instruction.text).toBe('estoy triste');
    });
  });
});
