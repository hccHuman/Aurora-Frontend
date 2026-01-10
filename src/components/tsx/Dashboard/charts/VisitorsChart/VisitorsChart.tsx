import React, { useEffect, useRef, useState } from "react";
import initVisitorsChart from "./VisitorsChart.client";
import { fetchVisitorsStats } from "@/services/dashboardService";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";

/**
 * VisitorsChart Component
 *
 * Visualizes the history of site visitors using an area chart.
 * Fetches data from `dashboardService` and dynamically tracks the latest visitor count.
 * Integrates with `VisitorsChart.client` for theme-compatible ApexCharts rendering and gradient fill effects.
 * Includes a stylized overlay showing the most recent visitor statistics.
 *
 * @component
 */
const VisitorsChart: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<any | null>(null);

  const [range, setRange] = useState<StatsRange>("7d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  /** INIT CHART (reinicializa al cambiar datos o modo oscuro) */
  useEffect(() => {
    if (!ref.current) return;
    if (!data?.series?.length || !data?.categories?.length) return;

    controllerRef.current?.destroy?.();

    controllerRef.current = initVisitorsChart(ref.current, {
      series: data.series,
      categories: data.categories,
      darkMode: isDarkMode,
    });
  }, [data, isDarkMode]);

  /** FETCH + UPDATE */
  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      setLoading(true);
      const res = await fetchVisitorsStats(range);

      if (!mounted || !res) return;

      setData(res);
      controllerRef.current?.update?.(res.series, res.categories);
      setLoading(false);
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [range]);

  /** Escucha cambios de modo oscuro/Claro */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDarkMode(dark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  /** Último valor */
  const latest = data?.series?.[0]?.data?.slice(-1)[0] ?? 0;

  return (
    <div className="relative">
      {/* Selector */}
      <div className="absolute left-3 top-3 z-10">
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as StatsRange)}
          className="rounded-md border px-2 py-1 text-sm dark:bg-slate-900 dark:text-white"
        >
          <option value="7d">7 días</option>
          <option value="30d">30 días</option>
          <option value="90d">90 días</option>
          <option value="1y">1 año</option>
        </select>
      </div>

      {/* Overlay */}
      <div className="absolute right-3 top-3 bg-white/90 dark:bg-slate-900/80 dark:text-white rounded-md shadow px-3 py-2 flex items-center gap-2 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-indigo-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M10 2a4 4 0 100 8 4 4 0 000-8zm-7 14a7 7 0 0114 0H3z" />
        </svg>
        <div className="text-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-white">
            Latest visitors
          </div>
          <div className="font-semibold dark:text-white">
            {loading ? "…" : latest.toLocaleString()}
          </div>
        </div>
      </div>

      <div className="w-full h-64 dark:text-white" ref={ref} />
    </div>
  );
};

export default VisitorsChart;
