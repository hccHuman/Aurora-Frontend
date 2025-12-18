# Extracted Dashboard — Chart Data Reference 📊

This document describes the data each chart component in `extracted-dashboard/src/components/` expects. Use these examples when supplying data from your API or when adapting the sample charts.

---

## Resumen rápido
- Main chart (`MainChart`): expects `{ series: Array, categories: Array<string> }`. It fetches from the `sales` endpoint via `fetchData('sales')`.
- New products (`NewProductsChart`): small bar chart; series expects objects of `{ x: string, y: number }`.
- Sales by category (`SalesByCategoryChart`): stacked/grouped bar chart; series is an array per category with `{ name, data: Array<{ x, y }> }`.
- Signups (`SignupsChart`): simple bar chart; `series: [{ name: string, data: number[] }]` and `labels: string[]`.
- Traffic by device (`TrafficByDeviceChart`): donut chart; `series: number[]` and `labels: string[]`.
- Visitors (`VisitorsChart`): area chart; `series: [{ name: string, data: number[] }]` and `labels: string[]`.

---

## Files & Data Shapes

### 1) `MainChart.astro` / `MainChart.client.ts` ✅
- Where data comes from: `fetchData('sales')` (see `src/lib/data.ts`).
- Expected response shape:

```ts
{
  series: Array<{ name: string; data: number[] }>, // ApexCharts series
  categories: string[] // labels for x-axis
}
```

- Example:

```json
{
  "series": [
    { "name": "Revenue", "data": [1200, 900, 1400, 1700, 1000, 1200, 1300] }
  ],
  "categories": ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"]
}
```

- Notes: The component calls `chartController.update(series, categories)`; keep `series` and `categories` aligned in length (categories length should match each series data length).

---

### 2) `NewProductsChart.astro` / `NewProductsChart.client.ts` 🔢
- Static sample data lives in the client implementation. If you want to supply dynamic data, the chart expects `series` of objects with `{ x: string, y: number }` points.

- Example series for the chart:

```json
{
  "series": [
    {
      "name": "Quantity",
      "data": [
        { "x": "01 Feb", "y": 170 },
        { "x": "02 Feb", "y": 180 }
      ]
    }
  ]
}
```

- Notes: This is a compact bar chart (no categories array needed — each data item carries its `x` label).

---

### 3) `SalesByCategoryChart.astro` / `SalesByCategoryChart.client.ts` 🧾
- Format (Apex stacked/grouped bar): `series` array where each series has `name` and `data: { x, y }[]`.

- Example:

```json
{
  "series": [
    { "name": "Desktop PC", "data": [{"x":"01 Feb","y":170}, {"x":"02 Feb","y":180}] },
    { "name": "Phones", "data": [{"x":"01 Feb","y":120}, {"x":"02 Feb","y":294}] }
  ]
}
```

- Notes: Chart client currently uses static arrays but you can replace with an API response shaped like above.

---

### 4) `SignupsChart.astro` / `SignupsChart.client.ts` 👥
- Expected shape:

```ts
{
  series: [{ name: string, data: number[] }],
  labels: string[]
}
```

- Example:

```json
{
  "series": [{ "name": "Users", "data": [1334,2435,1753,1328,1155,1632,1336] }],
  "labels": ["01 Feb","02 Feb","03 Feb","04 Feb","05 Feb","06 Feb","07 Feb"]
}
```

- Notes: `labels` correspond to each data point in the series.

---

### 5) `TrafficByDeviceChart.astro` / `TrafficByDeviceChart.client.ts` 📱💻
- Expected shape:

```ts
{
  series: number[], // e.g. [70,5,25]
  labels: string[]  // e.g. ['Desktop','Tablet','Phone']
}
```

- Example:

```json
{
  "series": [70,5,25],
  "labels": ["Desktop","Tablet","Phone"]
}
```

- Notes: This is a donut chart. Series length should match labels length.

---

### 6) `VisitorsChart.astro` / `VisitorsChart.client.ts` 👀
- Expected shape:

```ts
{
  series: [{ name: string, data: number[] }],
  labels?: string[] // optional; the client samples use labels
}
```

- Example:

```json
{
  "series": [{ "name": "Visitors", "data": [500,590,600,520,610,550,600] }],
  "labels": ["01 Feb","02 Feb","03 Feb","04 Feb","05 Feb","06 Feb","07 Feb"]
}
```

- Notes: Area chart; `labels` are optional depending on how you feed data to ApexCharts.

---

## API / Types reference
- `src/lib/data.ts` provides `fetchData(endpoint)` which calls `API_URL + endpoint`.
- Types in `src/types/entities.ts` show `sales` is typed as: `{ series: any[]; categories: string[] }`.

---

## Quick integration tips
- Use `series` arrays following ApexCharts format (name + numeric data OR arrays of `{ x, y }` for labelled points).
- Ensure `categories` / `labels` align with the per-series `data` length.
- For donut/pie charts, ensure `series.length === labels.length`.
- `MainChart` already fetches `/sales` and calls `chartController.update(series, categories)`; add the endpoint to return the same shape.

---

If you want, I can:
- Generate sample API responses for each endpoint under `extracted-dashboard/src/services/` (mock JSON), or
- Add TypeScript interfaces to each client chart file for stricter typing.

¿Quieres que cree la versión en `README` o la añada como `CHARTS.md` dentro del folder?