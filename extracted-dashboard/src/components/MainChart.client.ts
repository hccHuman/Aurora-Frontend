import ApexCharts from 'apexcharts';

export default function initMainChart(el: HTMLElement, initialData = { series: [] as any[], categories: [] as string[] }) {
  const getOptions = (categories: string[] = initialData.categories) => ({
    chart: { type: 'area', height: 320 },
    series: initialData.series,
    xaxis: { categories },
  });

  const chart = new ApexCharts(el, getOptions(initialData.categories));
  chart.render();

  return {
    update(series: any[], categories: string[]) {
      chart.updateOptions({ series, xaxis: { categories } });
    },
    destroy() {
      chart.destroy();
    },
  };
}
