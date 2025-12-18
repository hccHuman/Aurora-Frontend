import ApexCharts from 'apexcharts';

export default function initTrafficByDeviceChart(el: HTMLElement) {
  const options = {
    series: [70, 5, 25],
    labels: ['Desktop', 'Tablet', 'Phone'],
    colors: ['#16BDCA', '#FDBA8C', '#1A56DB'],
    chart: { type: 'donut', height: 300, toolbar: { show: false } },
    responsive: [{ breakpoint: 430, options: { chart: { height: 250 } } }],
    dataLabels: { enabled: false },
    legend: { show: false },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return { destroy() { chart.destroy(); } };
}
