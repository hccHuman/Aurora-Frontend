import ApexCharts from "apexcharts";

export default function initMainChart(
  el: HTMLElement,
  initialData = { series: [] as any[], categories: [] as string[] }
) {
  const isDarkMode = () => document.documentElement.classList.contains("dark");

  const getColor = (dark?: boolean) => ((dark ?? isDarkMode()) ? "#fff" : "#000000ff");

  const getOptions = (categories: string[] = initialData.categories) => ({
    chart: { type: "area", height: 320, toolbar: { show: false }, zoom: { enabled: false } },
    series: initialData.series,
    dataLabels: { enabled: false },
    colors: ["#800080", "#FF69B4"],
    stroke: { curve: "smooth", width: 3 },
    markers: { size: 8, hover: { size: 10 }, strokeWidth: 2 },
    tooltip: {
      enabled: true,
      shared: false, // un solo valor
      intersect: true, // obliga a tocar el punto
      followCursor: false,
      theme: isDarkMode() ? "dark" : "light",
      y: { formatter: (val: number) => `$${val}` },
    },
    xaxis: {
      categories,
      tickPlacement: "on",
      labels: {
        style: {
          colors: categories.map(() => getColor()),
        },
      },
      axisBorder: { show: true, color: getColor() },
      axisTicks: { show: true, color: getColor() },
    },
    yaxis: {
      labels: { style: { colors: getColor() } },
    },
    legend: {
      labels: { colors: getColor() },
    },
  });

  const chart = new ApexCharts(el, getOptions(initialData.categories));
  chart.render();

  return {
    update(series: any[], categories: string[], darkModeOverride?: boolean) {
      const dark = darkModeOverride ?? isDarkMode();
      chart.updateOptions(
        {
          series,
          xaxis: {
            categories,
            labels: { style: { colors: categories.map(() => getColor(dark)) } },
            axisBorder: { color: getColor(dark) },
            axisTicks: { color: getColor(dark) },
          },
          yaxis: { labels: { style: { colors: getColor(dark) } } },
          legend: { labels: { colors: getColor(dark) } },
          tooltip: { theme: dark ? "dark" : "light" },
          animations: {
            enabled: true,
            easing: "easeout",
            speed: 800, // duración animación en ms
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
