import React, { useEffect, useRef, useState } from "react";
import { fetchVisitorsStats } from "@/services/dashboardService";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";

/**
 * VisitorsChart Component
 *
 * Visualizes the history of site visitors using an area chart.
 * Fetches data from `dashboardService` and dynamically tracks the latest visitor count.
 * 
 * ⚡ OPTIMIZATION: ApexCharts is imported dynamically via import() to avoid bundling
 * it in the main chunk. Only loads when the Dashboard page is accessed.
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

    // Dynamic import of ApexCharts initialization (lazy loaded)
    import("./VisitorsChart.client").then((module) => {
      controllerRef.current?.destroy?.();
      controllerRef.current = module.default(ref.current, {
        series: data.series,
        categories: data.categories,
        darkMode: isDarkMode,
      });
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

  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Visitors</h2>
        <select
          value={range}
          onChange={(e) => setRange(e.target.value as StatsRange)}
          className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-900 dark:text-white"
        >
          <option value="7d">Last 7 days</option>
          <option value="30d">Last 30 days</option>
          <option value="90d">Last 90 days</option>
        </select>
      </div>

      {loading && <div className="text-center text-slate-500 py-8">Loading chart...</div>}
      <div ref={ref} className="h-80" />

      {data && (
        <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700">
          <div className="text-sm text-slate-600 dark:text-slate-400">
            Latest: <span className="font-bold text-slate-900 dark:text-white">{data.latest?.toLocaleString() || "—"}</span> visitors
          </div>
        </div>
      )}
    </div>
  );
};

export default VisitorsChart;
