import React, { useEffect, useRef, useState } from "react";
import initTrafficByDeviceChart from "./TrafficByDeviceChart.client";
import { fetchTrafficByDeviceStats } from "@/services/dashboardService";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";

/**
 * TrafficByDeviceChart Component
 *
 * Visualizes the distribution of user traffic across different device types using a donut chart.
 * Fetches data from `dashboardService` and handles automatic theme synchronization.
 * Integrates with `TrafficByDeviceChart.client` for complex donut chart configuration and legend formatting.
 * Displays total traffic in a stylized overlay.
 *
 * @component
 */
const TrafficByDeviceChart: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const controllerRef = useRef<any | null>(null);

  const [range, setRange] = useState<StatsRange>("1y");
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  /** INIT CHART (reinicializa al cambiar datos o modo oscuro) */
  useEffect(() => {
    if (!ref.current) return;

    controllerRef.current?.destroy?.();

    controllerRef.current = initTrafficByDeviceChart(ref.current, {
      series: data?.series ?? [70, 5, 25],
      labels: data?.labels ?? ["Desktop", "Tablet", "Phone"],
      darkMode: isDarkMode, // <-- pasamos el modo oscuro
    });
  }, [data, isDarkMode]);

  /** FETCH + UPDATE */
  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      setLoading(true);
      const res = await fetchTrafficByDeviceStats(range);

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

  /** Escucha cambios de modo oscuro/Claro */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const dark = document.documentElement.classList.contains("dark");
      setIsDarkMode(dark);
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

  /** Total tráfico */
  const total = data?.series?.reduce((a: number, b: number) => a + b, 0) ?? 0;

  return (
    <div className="relative">
      <div className="relative flex items-center gap-4">
        {/* Selector */}
        <div className="z-10">
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

        {/* Total tráfico */}
        <div className="z-10 bg-white/90 dark:bg-slate-900/80 dark:text-white rounded-md shadow px-3 py-2 flex items-center gap-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden
          >
            <path d="M4 3h12v2H4V3zm0 4h8v2H4V7zm0 4h12v2H4v-2z" />
          </svg>
          <div className="text-sm">
            <div className="text-xs text-slate-500 dark:text-slate-400 dark:text-white">
              Tráfico por dispositivo
            </div>
            <div className="font-semibold dark:text-white">
              {loading ? "…" : `${total} registrados`}
            </div>
          </div>
        </div>
      </div>

      {/* Chart debajo */}
      <div className="w-full h-64 dark:text-white mt-4" ref={ref} />
    </div>
  );
};

export default TrafficByDeviceChart;
