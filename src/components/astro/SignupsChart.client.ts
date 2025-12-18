import ApexCharts from 'apexcharts';

export default function initSignupsChart(el: HTMLElement) {
  const options = {
    series: [{ name: 'Users', data: [1334, 2435, 1753, 1328, 1155, 1632, 1336] }],
    labels: ['01 Feb','02 Feb','03 Feb','04 Feb','05 Feb','06 Feb','07 Feb'],
    chart: { type: 'bar', height: 140, toolbar: { show: false } },
    plotOptions: { bar: { columnWidth: '25%', borderRadius: 3 } },
    tooltip: { shared: true, intersect: false },
    fill: { opacity: 1 },
    yaxis: { show: false },
    grid: { show: false },
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return { destroy() { chart.destroy(); } };
}
