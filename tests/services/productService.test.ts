import { searchProducts } from '@/services/productService';

describe('productService.searchProducts', () => {
	it('returns parsed json when backend responds ok', async () => {
		const payload = {
			data: [{ id: 1, title: 'Freno', price: 12, img_url: '/img/freno.png' }],
			total: 1,
			totalPages: 1,
			success: true
		};
		(globalThis.fetch as jest.Mock).mockResolvedValueOnce({
			ok: true,
			json: async () => payload,
			clone: function () { return this; }
		});

		const res = await searchProducts('Freno', 1, 5);

		expect(res).toBeDefined();
		expect(res?.data[0].title).toBe('Freno');
	});
});

