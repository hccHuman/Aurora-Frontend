import React, { useEffect, useRef, useState } from "react";
import initSignupsChart from "./SignupsChart.client";
import { fetchSignupsStats } from "@/services/dashboardService";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";

/**
 * SignupsChart Component
 *
 * Visualizes the history of user registrations through a bar chart.
 * Fetches signup data from `dashboardService` based on a selectable time range.
 * Calculates and displays the total number of signups in a stylized overlay.
 * Integrates with `SignupsChart.client` for theme-compatible ApexCharts rendering.
 *
 * @component
 */
const SignupsChart: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<any | null>(null);

  const [range, setRange] = useState<StatsRange>("90d");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  /** INIT CHART (o reinicializa al cambiar datos o modo oscuro) */
  useEffect(() => {
    if (!data?.series?.length || !data?.categories?.length) return;
    if (!ref.current) return;

    const chart = initSignupsChart(ref.current, {
      series: data.series,
      categories: data.categories,
      darkMode: isDarkMode,
    });

    controllerRef.current = chart;

    return () => chart?.destroy();
  }, [data, isDarkMode]);

  /** FETCH + UPDATE */
  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      setLoading(true);
      const res = await fetchSignupsStats(range);

      if (!mounted || !res) return;

      setData(res);
      controllerRef.current?.update?.(res.series, res.labels);
      setLoading(false);
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [range]);

  /** ESCUCHAR CAMBIO DE MODO OSCURO/CLARO */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDarkMode(dark);
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  /** Total signups */
  const total = data?.series?.[0]?.data?.reduce((a: number, b: number) => a + b, 0) ?? 0;

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
        </select>
      </div>

      {/* Overlay */}
      <div className="absolute right-3 top-3 bg-white/90 dark:bg-slate-900/80 dark:text-white rounded-md shadow px-3 py-2 flex items-center gap-2 z-10">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-600"
          viewBox="0 0 20 20"
          fill="currentColor"
          aria-hidden
        >
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v6h8v-6a1 1 0 011-1h2a1 1 0 011 1v7a1 1 0 01-1 1H3a1 1 0 01-1-1v-7z" />
        </svg>
        <div className="text-sm">
          <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-white">Signups</div>
          <div className="font-semibold dark:text-white">{loading ? "…" : `${total} signups`}</div>
        </div>
      </div>

      <div className="w-full h-36 dark:text-white" ref={ref} />
    </div>
  );
};

export default SignupsChart;
