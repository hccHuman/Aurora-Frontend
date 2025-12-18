import productsStaticJSON from '../../data/products.json' assert { type: 'json' };

// Very small example: convert product prices into simple last-7-days totals
export function getSales() {
  const products = productsStaticJSON;

  const categories = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  // Create deterministic-ish numbers by using product ids
  const seriesData = categories.map((_, idx) => {
    const base = products.reduce((acc, p) => acc + (p.id % (idx + 2)), 0);
    return Math.abs((base % 1000) + 300 + idx * 10);
  });

  return { series: [{ name: 'Revenue', data: seriesData }], categories };
}
