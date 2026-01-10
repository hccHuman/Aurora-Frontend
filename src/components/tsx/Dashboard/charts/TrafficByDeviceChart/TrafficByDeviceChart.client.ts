import ApexCharts from "apexcharts";

/**
 * Initializes the ApexCharts instance for the Traffic By Device Chart (Donut chart).
 * Features custom label formatting, percentage calculations in the legend, and theme-aware styling.
 *
 * @param {HTMLElement} el - The DOM element to render the chart in.
 * @param {Object} [data] - Initial data and theme configuration.
 * @param {number[]} [data.series] - Traffic counts for each device.
 * @param {string[]} [data.labels] - Device type labels.
 * @param {boolean} [data.darkMode] - Initial theme state.
 * @returns {Object} An object providing `update` and `destroy` methods.
 */
export default function initTrafficByDeviceChart(
  el: HTMLElement,
  data?: { series?: number[]; labels?: string[]; darkMode?: boolean }
) {
  const darkMode = data?.darkMode ?? false;

  const options: ApexCharts.ApexOptions = {
    series: data?.series ?? [70, 5, 25],
    labels: data?.labels ?? ["Desktop", "Tablet", "Phone"],
    colors: ["#800080", "#FF69B4", "#b3428dff"],

    chart: {
      type: "donut",
      height: 300,
      toolbar: { show: false },
    },

    /* ✅ Número ABSOLUTO dentro de cada trozo */
    dataLabels: {
      enabled: true,
      formatter: (_: number, opts: any) => {
        return opts.w.globals.series[opts.seriesIndex];
      },
      style: {
        fontSize: "13px",
        fontWeight: 700,
        colors: [darkMode ? "#fff" : "#111"],
      },
      dropShadow: { enabled: false },
    },

    plotOptions: {
      pie: {
        donut: {
          size: "65%",
        },
      },
    },

    /* ✅ Tooltip completo */
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      followCursor: false,
      theme: darkMode ? "dark" : "light",
      y: {
        formatter: (val: number, opts: any) => {
          const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
          const pct = ((val / total) * 100).toFixed(1);
          return `${val} (${pct}%)`;
        },
      },
    },

    /* ✅ % al lado de la categoría */
    legend: {
      show: true,
      position: "bottom",
      labels: {
        colors: darkMode ? "#fff" : "#373d3f",
      },
      formatter: (label: string, opts: any) => {
        const val = opts.w.globals.series[opts.seriesIndex];
        const total = opts.w.globals.seriesTotals.reduce((a: number, b: number) => a + b, 0);
        const pct = ((val / total) * 100).toFixed(1);
        return `${label} — ${pct}%`;
      },
    },

    responsive: [
      {
        breakpoint: 430,
        options: { chart: { height: 250 } },
      },
    ],
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return {
    update(series: number[], labels?: string[], darkModeUpdate?: boolean) {
      chart.updateOptions(
        {
          series,
          labels,
          dataLabels: {
            style: {
              colors: [(darkModeUpdate ?? darkMode) ? "#fff" : "#111"],
            },
          },
          legend: {
            labels: {
              colors: (darkModeUpdate ?? darkMode) ? "#fff" : "#373d3f",
            },
          },
          tooltip: {
            theme: (darkModeUpdate ?? darkMode) ? "dark" : "light",
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
