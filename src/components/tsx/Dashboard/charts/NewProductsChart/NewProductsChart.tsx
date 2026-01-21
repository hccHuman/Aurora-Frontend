import React, { useEffect, useRef, useState } from "react";
import initNewProductsChart from "./NewProductsChart.client";
import { fetchNewProductsStats } from "@/services/dashboardService";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";

/**
 * NewProductsChart Component
 *
 * Visualizes the stock levels of the most recently added products using a bar chart.
 * Fetches data from `dashboardService` based on a selectable time range (30d, 1y).
 * Limits display to the last 7 items for optimal visualization.
 * Integrates with `NewProductsChart.client` for ApexCharts management.
 *
 * @component
 */
const NewProductsChart: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<any | null>(null);

  const [range, setRange] = useState<StatsRange>("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  const MAX_ITEMS = 7; // show only the last 7 products

  /** INIT CHART */
  useEffect(() => {
    if (!ref.current) return;

    controllerRef.current?.destroy?.();

    const items = data?.data?.slice(-MAX_ITEMS) ?? [];
    const categories = items.map((p: any) => p.nombre);
    const series = [
      { name: "Stock", data: items.map((p: any) => p.stock) },
    ];

    controllerRef.current = initNewProductsChart(ref.current, { series, categories });
  }, [data, isDarkMode]);

  /** FETCH + UPDATE */
  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      setLoading(true);
      const res = await fetchNewProductsStats(range);

      if (!mounted || !res) return;

      setData(res);

      const items = res?.data?.slice(-MAX_ITEMS) ?? [];
      const categories = items.map((p: any) => p.nombre);
      const series = [
        { name: "Stock", data: items.map((p: any) => p.stock) },
      ];

      controllerRef.current?.update?.(series, categories);
      setLoading(false);
    };

    loadStats();

    return () => { mounted = false; };
  }, [range, isDarkMode]);

  /** OBSERVE DARK MODE */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  const latest =
    data?.data?.slice(-1)[0]?.stock ?? 0;

  return (
    <div className="relative">
      {/* Selector */}
      <div className="absolute left-3 top-3 z-10">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as StatsRange)}
          className="rounded-md border px-2 py-1 text-sm dark:bg-slate-900 dark:text-white"
        >
          <option value="30d">30 days</option>
          <option value="1y">1 year</option>
        </select>
      </div>

      {/* Overlay */}
      <div className="absolute right-3 top-3 bg-white/90 dark:bg-slate-900/80 rounded-md shadow px-3 py-2 flex items-center gap-2 z-10">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-600" viewBox="0 0 20 20" fill="currentColor" aria-hidden>
          <path d="M4 3h12v2H4V3zm0 4h8v2H4V7zm0 4h12v2H4v-2z" />
        </svg>
        <div className="text-sm">
          <div className="text-xs text-slate-500 dark:text-white">New products</div>
          <div className="font-semibold">{loading ? "…" : latest}</div>
        </div>
      </div>

      <div className="w-full h-80 dark:text-white" ref={ref} />
    </div>
  );
};

export default NewProductsChart;
