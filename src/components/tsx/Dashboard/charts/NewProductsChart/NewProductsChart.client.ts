import ApexCharts from "apexcharts";

export default function initNewProductsChart(
  el: HTMLElement,
  data?: {
    series?: any[];
    categories?: string[];
  }
) {
  const isDarkMode = document.documentElement.classList.contains("dark");

  const options = {
    chart: {
      type: "bar",
      height: 300, // altura aumentada para ver las barras
      toolbar: { show: false },
    },
    colors: ["#800080", "#FF69B4"],
    series: data?.series ?? [
      {
        name: "Stock",
        data: [],
      },
    ],
    plotOptions: { bar: { columnWidth: "60%", borderRadius: 3 } },
    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      followCursor: false,
      theme: isDarkMode ? "dark" : "light",
      y: { formatter: (val: number) => val.toString() },
    },
    dataLabels: { enabled: false },
    stroke: { show: true, width: 2, colors: ["transparent"] },
    grid: { show: true },
    xaxis: {
      categories: data?.categories ?? [],
      labels: { show: true, style: { colors: isDarkMode ? "#fff" : "#373d3f" } },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },
    yaxis: {
      labels: { style: { colors: isDarkMode ? "#fff" : "#373d3f" } },
    },
    legend: {
      labels: { colors: isDarkMode ? "#fff" : "#373d3f" },
    },
    fill: { opacity: 1 },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return {
    update(series: any[], categories?: string[]) {
      chart.updateOptions({ series, xaxis: { categories } });
    },
    destroy() {
      chart.destroy();
    },
  };
}
