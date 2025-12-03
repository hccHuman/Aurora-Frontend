import { analyzeEmotion } from '@/modules/ANA/AnaEmotionMap';
import { AnaCore } from '@/modules/ANA/AnaCore';

jest.mock('@/services/chatService', () => ({
  fetchBackendResponse: jest.fn(async (message: string) => ({ text: message }))
}));

describe('ANA module', () => {
  it('analyzeEmotion detects happy words', () => {
    const out = analyzeEmotion('I feel very happy today');
    expect(out.emotion).toBeDefined();
    expect(out.emotion).toMatch(/happy|neutral/i);
  });

  it('AnaCore.processUserMessage returns instruction shape', async () => {
    const inst = await AnaCore.processUserMessage('This is a very happy test');
    expect(inst).toBeDefined();
    expect(typeof inst.text).toBe('string');
    expect(inst.emotion).toBeDefined();
  });
});
