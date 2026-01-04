import ApexCharts from "apexcharts";

export default function initSalesByCategoryChart(
  el: HTMLElement,
  data?: { series: any[]; darkMode: boolean }
) {
  const isDarkMode = data?.darkMode ?? false;

  const options: ApexCharts.ApexOptions = {
    colors: ["#800080", "#FF69B4"],

    series: data?.series ?? [],

    chart: {
      type: "bar",
      height: 420,
      toolbar: { show: false },
    },

    plotOptions: {
      bar: {
        columnWidth: "90%",
        borderRadius: 3,
      },
    },

    tooltip: {
      enabled: true,
      shared: false,
      intersect: true,
      followCursor: false,
      theme: isDarkMode ? "dark" : "light",
    },

    stroke: {
      show: true,
      width: 5,
      colors: ["transparent"],
    },

    grid: { show: false },
    dataLabels: { enabled: false },

    xaxis: {
      labels: {
        style: {
          colors: isDarkMode ? "#fff" : "#373d3f",
        },
      },
      axisBorder: { show: false },
      axisTicks: { show: false },
    },

    yaxis: {
      labels: {
        style: {
          colors: isDarkMode ? "#fff" : "#373d3f",
        },
      },
    },

    legend: {
      labels: {
        colors: isDarkMode ? "#fff" : "#373d3f",
      },
    },

    fill: { opacity: 1 },
  };

  const chart = new ApexCharts(el, options);
  chart.render();

  return {
    update(series: any[]) {
      chart.updateSeries(series, true);
    },

    updateTheme(darkMode: boolean) {
      chart.updateOptions(
        {
          tooltip: { theme: darkMode ? "dark" : "light" },
          xaxis: {
            labels: {
              style: { colors: darkMode ? "#fff" : "#373d3f" },
            },
          },
          yaxis: {
            labels: {
              style: { colors: darkMode ? "#fff" : "#373d3f" },
            },
          },
          legend: {
            labels: {
              colors: darkMode ? "#fff" : "#373d3f",
            },
          },
        },
        false,
        true
      );
    },

    destroy() {
      chart.destroy();
    },
  };
}
