import ApexCharts from 'apexcharts';

export default function initSalesByCategoryChart(el: HTMLElement) {
  const options = {
    colors: ['#1A56DB', '#FDBA8C', '#17B0BD'],
    series: [
      { name: 'Desktop PC', data: [170, 180, 164, 145, 194, 170, 155].map((y, i) => ({ x: `0${i + 1} Feb`, y })) },
      { name: 'Phones', data: [120, 294, 167, 179, 245, 182, 143].map((y, i) => ({ x: `0${i + 1} Feb`, y })) },
      { name: 'Gaming/Console', data: [220, 194, 217, 279, 215, 263, 183].map((y, i) => ({ x: `0${i + 1} Feb`, y })) },
    ],
    chart: { type: 'bar', height: 420, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: '90%', borderRadius: 3 } },
    tooltip: { shared: true, intersect: false },
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
