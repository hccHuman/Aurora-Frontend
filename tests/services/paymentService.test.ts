process.env.PUBLIC_API_URL = 'https://api.test';
import { paymentService } from '@/services/paymentService';

describe('paymentService.createPaymentIntent', () => {
  beforeEach(() => {
    (global as any).fetch = jest.fn();
    // ensure getEnv finds a fake API_URL
    process.env.PUBLIC_API_URL = 'https://api.test';
  });

  afterEach(() => {
    jest.resetAllMocks();
    (global as any).window = undefined;
  });

  it('posts items to create-payment-intent and returns json', async () => {
    const mockRes = { success: true, clientSecret: 'abcd' };
    (global as any).fetch = jest.fn(async () => ({ ok: true, json: async () => mockRes }));

    const items = [{ price: 1000, quantity: 2 }, { price: 500, quantity: 1 }];
    const res = await paymentService.createPaymentIntent(items as any);

    expect((global as any).fetch).toHaveBeenCalledWith('https://api.test/api/payments/create-payment-intent', expect.objectContaining({
      method: 'POST',
      body: JSON.stringify({ items }),
    }));

    expect(res).toEqual(mockRes);
  });
});
