# extracted-dashboard

Small portable extract of the Flowbite Astro Admin Dashboard (charts + CRUD data) as a minimal Astro project.

Quickstart

1. cd into `extracted-dashboard`
2. Install: `pnpm install` (or `npm install`)
3. Run: `pnpm run dev` (default Astro dev server)

What is included

- `src/components/MainChart.astro` + `MainChart.client.ts` — main area chart that fetches `/api/sales` and renders with ApexCharts.
- `src/components/{NewProductsChart,SalesByCategoryChart,SignupsChart,TrafficByDeviceChart,VisitorsChart}.{astro,client.ts}` — charts extracted from the original dashboard as separate, reusable components.
- `src/pages/crud/products.astro` and `src/pages/crud/users.astro` — simple CRUD demos (read-only list from `data/*.json`).
- `src/pages/api/[...entity].ts` — small API mapping to `src/services/*`.
- `src/services/*` — in-repo services (`getProducts`, `getUsers`, `getSales`).
- `src/data/*.json` — copied sample data from the original project.

Notes

- The sales series is a small demo transformation of product data. For real data, replace `getSales()` with a real aggregation.
- Components are written as Astro components; where runtime behavior is needed, client scripts (`*.client.ts`) initialize ApexCharts.

If you want, I can:
- Add a minimal Tailwind setup
- Add React-compatible components alongside Astro components
- Add simple create/update/delete mock endpoints so the CRUD pages can persist in memory

Tell me which of the above you want next.
