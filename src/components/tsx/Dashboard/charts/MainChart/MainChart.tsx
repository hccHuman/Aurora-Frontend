import React, { useEffect, useRef, useState } from "react";
import initMainChart from "./MainChart.client";
import { fetchSalesStats } from "@/services/dashboardService";
import type { StatsRange } from "@/models/dashboardProps/DashboardTimeProps";

const MainChart: React.FC = () => {
  const ref = useRef<HTMLDivElement | null>(null);
  const chartRef = useRef<any | null>(null);

  const [range, setRange] = useState<StatsRange>("30d");
  const [loading, setLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(document.documentElement.classList.contains("dark"));

  const [total, setTotal] = useState(0);

  /** Inicializa chart solo una vez */
  useEffect(() => {
    if (!ref.current || chartRef.current) return;

    chartRef.current = initMainChart(ref.current, {
      series: [],
      categories: [],
    });
  }, []);

  /** Fetch + update chart directamente */
  useEffect(() => {
    let mounted = true;

    const loadStats = async () => {
      setLoading(true);
      const data = await fetchSalesStats(range);
      if (!mounted || !data) return;

      // Calculamos total
      const totalVal = data.series.reduce(
        (acc: number, s: any) => acc + s.data.reduce((a: number, b: number) => a + b, 0),
        0
      );
      setTotal(totalVal);

      // Actualizamos chart directamente
      chartRef.current?.update(data.series, data.categories, isDarkMode);

      setLoading(false);
    };

    loadStats();

    return () => {
      mounted = false;
    };
  }, [range, isDarkMode]); // cada vez que cambie range o modo oscuro

  /** Escucha cambios de modo oscuro */
  useEffect(() => {
    const observer = new MutationObserver(() => {
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
    return () => observer.disconnect();
  }, []);

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
      <div className="absolute right-3 top-3 bg-white/90 dark:bg-slate-900/80 rounded-md shadow px-3 py-2 z-10">
        <div className="text-xs text-slate-500 dark:text-white">Revenue</div>
        <div className="font-semibold text-sm dark:text-white">
          {loading ? "…" : `€${total.toLocaleString()}`}
        </div>
      </div>

      <div className="w-full h-80 dark:text-white" ref={ref} />
    </div>
  );
};

export default MainChart;
