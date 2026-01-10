import React, { useEffect, useRef, useState } from "react";
import initSalesByCategoryChart from "./SalesByCategoryChart.client";
import { fetchSalesByCategoryStats } from "@/services/dashboardService";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";

/**
 * SalesByCategoryChart Component
 *
 * Displays a bar chart visualizing sales distribution across different product categories.
 * Fetches data from `dashboardService` and dynamically calculates the top-performing category.
 * Integrates with `SalesByCategoryChart.client` for theme-aware ApexCharts management.
 * Supports real-time theme switching (dark/light mode).
 *
 * @component
 */
const SalesByCategoryChart: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<any | null>(null);

  const [range, setRange] = useState<StatsRange>("30d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(
    document.documentElement.classList.contains("dark")
  );

  /** INIT / RECREATE CHART (data o darkMode) */
  useEffect(() => {
    if (!ref.current) return;

    controllerRef.current?.destroy?.();

    controllerRef.current = initSalesByCategoryChart(ref.current, {
      series: data?.series ?? [],
      darkMode: isDarkMode,
    });
  }, [data, isDarkMode]);

  /** FETCH CUANDO CAMBIA EL RANGO */
  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      setLoading(true);
      const res = await fetchSalesByCategoryStats(range);

      if (!mounted || !res) return;

      setData(res);
      setLoading(false);
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [range]);

  /** ESCUCHAR CAMBIO DE MODO OSCURO (TAILWIND) */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDarkMode(dark);
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  /** Top category */
  const top = data?.series?.reduce((acc: any, s: any) => {
    const sum = s.data.reduce((a: number, b: any) => a + (b.y ?? b), 0);
    if (!acc || sum > acc.sum) return { name: s.name, sum };
    return acc;
  }, null);

  return (
    <div className="relative">
      {/* Selector */}
      <div className="absolute left-3 top-3 z-10">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as StatsRange)}
          className="rounded-md border px-2 py-1 text-sm dark:bg-slate-900 dark:text-white"
        >
          <option value="30d">30 días</option>
          <option value="90d">90 días</option>
          <option value="1y">1 año</option>
        </select>
      </div>

      {/* Overlay */}
      <div className="absolute right-3 top-3 bg-white/90 dark:bg-slate-900/80 rounded-md shadow px-3 py-2 flex items-center gap-2 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-blue-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M3 3v14h14V3H3zm2 10v-6h2v6H5zm4 0V7h2v6H9zm4 0v-4h2v4h-2z" />
        </svg>
        <div className="text-sm">
          <div className="text-xs text-slate-500 dark:text-white">
            Top category
          </div>
          <div className="font-semibold dark:text-white">
            {loading ? "…" : top ? `${top.name} — ${top.sum}` : "-"}
          </div>
        </div>
      </div>

      <div className="w-full h-72" ref={ref} />
    </div>
  );
};

export default SalesByCategoryChart;
