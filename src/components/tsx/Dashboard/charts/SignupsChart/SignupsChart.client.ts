import ApexCharts from "apexcharts";

/**
 * Initializes the ApexCharts instance for the Signups Chart (Compact bar chart).
 * Optimized for small height and minimal grid lines.
 *
 * @param {HTMLElement} el - The DOM element where the chart will be rendered.
 * @param {Object} data - The initial datasets and configuration.
 * @param {any[]} data.series - Signup data series.
 * @param {string[]} data.categories - Date or time categories for the X-axis.
 * @param {boolean} [data.darkMode] - Initial dark mode state (defaults to false).
 * @returns {Object | null} An object with `update` and `destroy` methods, or null if data is insufficient.
 */
export default function initSignupsChart(
  el: HTMLElement,
  data: { series: any[]; categories: string[]; darkMode?: boolean }
) {
  if (!data?.series?.length || !data?.categories?.length) {
    console.warn("SignupsChart: datos incompletos", data);
    return null;
  }

  const darkMode = data.darkMode ?? false;

  const options = {
    chart: {
      type: "bar",
      height: 140,
      toolbar: { show: false },
    },

    series: data.series,

    colors: ["#800080", "#FF69B4"],

    plotOptions: {
      bar: { columnWidth: "25%", borderRadius: 3 },
    },

    xaxis: {
      type: "category",
      categories: data.categories,
      labels: {
        show: true,
        style: { colors: darkMode ? "#fff" : "#373d3f" },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      followCursor: false,
      theme: darkMode ? "dark" : "light",
    },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return {
    update(series?: any[], categories?: string[]) {
      if (!series?.length || !categories?.length) return;

      chart.updateOptions(
        {
          series,
          xaxis: {
            type: "category",
            categories,
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
