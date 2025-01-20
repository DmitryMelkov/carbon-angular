import { Injectable } from '@angular/core';
import { Chart, ChartOptions, ChartTypeRegistry } from 'chart.js';
import 'chartjs-adapter-date-fns';

@Injectable({
  providedIn: 'root',
})
export class UniversalGraphService {
  constructor() {}

  async getData(
    apiUrl: string,
    startTime: Date,
    endTime: Date
  ): Promise<any[]> {
    const url = `${apiUrl}?start=${startTime.toISOString()}&end=${endTime.toISOString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  processData(
    data: any[],
    parameterNames: string[],
    dataKey: string
  ): { labels: Date[]; values: (number | null)[][] } {
    if (!data || data.length === 0) {
      console.warn('Нет данных для отображения');
      return { labels: [], values: [] };
    }

    const labels: Date[] = [];
    const values: (number | null)[][] = parameterNames.map(() => []);

    // Сортируем данные по времени
    data.sort(
      (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
    );

    let previousTime: Date | null = null;

    data.forEach((dataPoint) => {
      const currentTime = new Date(dataPoint.lastUpdated);

      // Добавляем null для пропущенных интервалов
      if (previousTime) {
        const timeDiff = currentTime.getTime() - previousTime.getTime();
        const missingIntervals = Math.floor(timeDiff / (60 * 1000)); // Пропущенные минуты
        if (timeDiff > 60 * 1000) { // Если пропуск больше 1 минуты
          for (let i = 1; i < missingIntervals; i++) {
            const missingTime = new Date(previousTime.getTime() + i * 60 * 1000);
            labels.push(missingTime);
            parameterNames.forEach((_, index) => {
              values[index].push(null); // Добавляем null для каждого параметра
            });
          }
        }
      }

      labels.push(currentTime);
      parameterNames.forEach((param, index) => {
        const value = dataPoint[dataKey][param];
        values[index].push(value !== null ? parseFloat(value) : null);
      });

      previousTime = currentTime;
    });

    return { labels, values };
  }

  // Возвращает настройки графика
  getChartOptions(yAxisTitle: string, title: string): ChartOptions {
    return {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            tooltipFormat: 'HH:mm',
            displayFormats: {
              minute: 'HH:mm',
            },
          },
        },
        y: {
          beginAtZero: true,
          title: {
            display: true,
            text: yAxisTitle,
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.dataset.label || '';
              const value = tooltipItem.raw;
              return `${label}: ${value}`;
            },
          },
        },
        legend: {
          position: 'right',
          labels: {
            generateLabels: (chart) => {
              const originalLabels =
                Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return originalLabels.map((label: { datasetIndex?: number; text: string }) => {
                const datasetIndex = label.datasetIndex;

                if (
                  datasetIndex !== undefined &&
                  chart.data.datasets[datasetIndex]
                ) {
                  const datasetData = chart.data.datasets[datasetIndex].data;
                  const lastValue = datasetData[datasetData.length - 1];

                  // Формируем текст в нужном порядке: значение / наименование
                  const name = label.text; // Наименование параметра

                  if (lastValue !== null) {
                    label.text = `${lastValue} ${
                      yAxisTitle.includes('градусы') ? '°C' : 'кгс/см2'
                    } | ${name}`;
                  } else {
                    label.text = `(нет данных) | ${name}`;
                  }
                }
                return label;
              });
            },
          },
          onClick: (event: any, legendItem, chart) => {
            // Используем chart.chart для доступа к основному объекту графика
            this.handleLegendClick(event, legendItem, chart.chart);
          },
        },
      },
      elements: {
        point: {
          radius: 0, // Убираем точки
        },
        line: {
          borderWidth: 2, // Толщина линии
        },
      },
      responsive: true,
      maintainAspectRatio: false,
    };
  }

  // Обработка кликов по легенде
  handleLegendClick(
    event: any,
    legendItem: any,
    chart: Chart<keyof ChartTypeRegistry>
  ) {
    if (event.native) {
      event.native.stopPropagation();
    }

    const datasetIndex = legendItem.datasetIndex;
    if (datasetIndex !== undefined) {
      const dataset = chart.data.datasets[datasetIndex];
      dataset.hidden = !dataset.hidden;
      chart.update();
    }
  }

  // Создание датасетов для графика
  createDatasets(
    parameterNames: string[],
    values: (number | null)[][],
    colors: string[]
  ) {
    return parameterNames.map((name, index) => ({
      label: name,
      data: values[index],
      borderColor: colors[index],
      fill: false,
      pointRadius: 1, // Убираем точки
      borderWidth: 2, // Толщина линии
      backgroundColor: 'transparent',
      spanGaps: false, // Разрывы
    }));
  }
}
