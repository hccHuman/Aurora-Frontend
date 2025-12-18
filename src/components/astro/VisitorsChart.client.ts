import ApexCharts from 'apexcharts';

export default function initVisitorsChart(el: HTMLElement) {
  const options = {
    series: [{ name: 'Visitors', data: [500, 590, 600, 520, 610, 550, 600] }],
    labels: ['01 Feb','02 Feb','03 Feb','04 Feb','05 Feb','06 Feb','07 Feb'],
    chart: { type: 'area', height: 300, sparkline: { enabled: true }, toolbar: { show: false } },
    fill: { type: 'gradient', gradient: { shade: 'light', shadeIntensity: 1 } },
    theme: { monochrome: { enabled: true, color: '#1A56DB' } },
    tooltip: { style: { fontSize: '14px' } },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return { destroy() { chart.destroy(); } };
}
