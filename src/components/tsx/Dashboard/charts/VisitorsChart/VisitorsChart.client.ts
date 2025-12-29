import ApexCharts from "apexcharts";

export default function initVisitorsChart(
  el: HTMLElement,
  data?: { series?: any[]; categories?: string[]; darkMode?: boolean }
) {
  if (!data?.series?.length || !data?.categories?.length) return null;

  const darkMode = data.darkMode ?? false;

  const options = {
    chart: {
      type: "area",
      height: 300,
      toolbar: { show: false },
      sparkline: { enabled: false }, // Para mostrar eje X
    },

    series: data.series,

    colors: ["#800080", "#FF69B4"],

    fill: {
      type: "gradient",
      gradient: {
        shade: "light",
        shadeIntensity: 1,
      },
    },

    xaxis: {
      type: "category",
      categories: data.categories,
      labels: {
        show: true,
        rotate: -45,
        style: {
          colors: data.categories.map(() => (darkMode ? "#fff" : "#373d3f")),
          fontSize: "12px",
        },
      },
      axisBorder: { show: true, color: darkMode ? "#fff" : "#ccc" },
      axisTicks: { show: true, color: darkMode ? "#fff" : "#ccc" },
    },

    yaxis: {
      min: 0,
      forceNiceScale: true,
      labels: {
        show: true,
        style: {
          colors: darkMode ? "#fff" : "#373d3f",
          fontSize: "12px",
        },
      },
    },
    markers: {
      size: 6,
      hover: { size: 8 },
      strokeWidth: 2,
    },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      followCursor: false,
      theme: darkMode ? "dark" : "light",
      y: {
        formatter: (val: number) => val.toString(), // O `$${val}` si quieres moneda
      },
      x: { show: true },
    },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return {
    update(series: any[], categories: string[], darkModeUpdate?: boolean) {
      if (!series?.length || !categories?.length) return;

      chart.updateOptions(
        {
          series,
          xaxis: {
            type: "category",
            categories,
            labels: {
              style: {
                colors: categories.map(() => ((darkModeUpdate ?? darkMode) ? "#fff" : "#373d3f")),
              },
            },
            axisBorder: { color: (darkModeUpdate ?? darkMode) ? "#fff" : "#ccc" },
            axisTicks: { color: (darkModeUpdate ?? darkMode) ? "#fff" : "#ccc" },
          },
          yaxis: {
            labels: {
              style: { colors: (darkModeUpdate ?? darkMode) ? "#fff" : "#373d3f" },
            },
          },
        },
        true,
        true
      );
    },
    destroy() {
      chart.destroy();
    },
  };
}
