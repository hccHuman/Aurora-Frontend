import ApexCharts from 'apexcharts';

export default function initNewProductsChart(el: HTMLElement) {
  const options = {
    colors: ['#1A56DB', '#FDBA8C'],
    series: [
      {
        name: 'Quantity',
        color: '#1A56DB',
        data: [170, 180, 164, 145, 194, 170, 155].map((y, i) => ({ x: `0${i + 1} Feb`, y })),
      },
    ],
    chart: { type: 'bar', height: 140, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: '90%', borderRadius: 3 } },
    tooltip: { shared: false, intersect: false },
    stroke: { show: true, width: 5, colors: ['transparent'] },
    grid: { show: false },
    dataLabels: { enabled: false },
    xaxis: { labels: { show: false }, axisBorder: { show: false }, axisTicks: { show: false } },
    yaxis: { show: false },
    fill: { opacity: 1 },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return { destroy() { chart.destroy(); } };
}
