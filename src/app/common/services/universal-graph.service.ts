import { Injectable } from '@angular/core';
import { Chart, ChartOptions, ChartTypeRegistry } from 'chart.js';
import crosshairPlugin from 'chartjs-plugin-crosshair';
import annotationPlugin, { AnnotationOptions } from 'chartjs-plugin-annotation';
import 'chartjs-adapter-date-fns';

@Injectable({
  providedIn: 'root',
})
export class UniversalGraphService {
  private readonly defaultColors: string[] = [
    '#36A2EB', // Синий
    '#FF6384', // Красный
    '#FFCE56', // Желтый
    '#4BC0C0', // Бирюзовый
    '#9966FF', // Фиолетовый
    '#FF9F40', // Оранжевый
    '#C9CBCF', // Серый
    '#77DD77', // Светло-зеленый
    '#FF6961', // Светло-красный
    '#AEC6CF', // Светло-голубой
    '#FDFD96', // Светло-желтый
    '#B39EB5', // Светло-фиолетовый
    '#FFB347', // Светло-оранжевый
    '#CB99C9', // Розовый
    '#836953', // Коричневый
  ];

  constructor() {
    // Регистрируем плагины
    Chart.register(crosshairPlugin);
    Chart.register(annotationPlugin);
  }

  // Получить цвет по индексу
  getColor(index: number): string {
    return this.defaultColors[index % this.defaultColors.length];
  }

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
    dataKey: string,
    subKey?: string // Новый параметр для выбора подключа (value, percent и т.д.)
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
        if (timeDiff > 60 * 1000) {
          // Если пропуск больше 1 минуты
          for (let i = 1; i < missingIntervals; i++) {
            const missingTime = new Date(
              previousTime.getTime() + i * 60 * 1000
            );
            labels.push(missingTime);
            parameterNames.forEach((_, index) => {
              values[index].push(null); // Добавляем null для каждого параметра
            });
          }
        }
      }

      labels.push(currentTime);
      parameterNames.forEach((param, index) => {
        let rawValue = dataPoint[dataKey][param];

        // Если значение является объектом - выбираем нужное поле
        if (rawValue && typeof rawValue === 'object') {
          // Если указан subKey - берем его, иначе пробуем value или percent
          if (subKey) {
            rawValue = rawValue[subKey];
          } else {
            // Автоматически выбираем value или percent, если они есть
            rawValue =
              rawValue.value !== undefined
                ? rawValue.value
                : rawValue.percent !== undefined
                ? rawValue.percent
                : null;
          }
        }

        const numValue = rawValue !== null ? parseFloat(rawValue) : null;
        values[index].push(numValue);
      });

      previousTime = currentTime;
    });

    return { labels, values };
  }

  // Возвращает настройки графика
  getChartOptions(
    yAxisTitle: string,
    title: string,
    animate: boolean = true,
    units: string | string[] = '',
    zones: { min: number; max: number; color: string }[] = [],
    yAxisRange?: { min: number; max: number } // Новый параметр для диапазона оси Y
  ): ChartOptions {
    const annotations: Record<string, AnnotationOptions> = zones.reduce(
      (acc, zone, index) => {
        acc[`zone${index}`] = {
          type: 'box',
          yMin: zone.min,
          yMax: zone.max,
          backgroundColor: zone.color,
          borderColor: zone.color.replace('0.1', '0.5'), // Добавляем рамку
          borderWidth: 3,
        };

        return acc;
      },
      {} as Record<string, AnnotationOptions>
    );

    return {
      animation: animate
        ? {
            duration: 1000,
            easing: 'easeInOutQuad',
          }
        : false,
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
          // Если задан диапазон, применяем его
          ...(yAxisRange ? { min: yAxisRange.min, max: yAxisRange.max } : {}),
          title: {
            display: true,
            text: yAxisTitle,
          },
        },
      },
      plugins: {
        annotation: {
          annotations,
        },
        crosshair: {
          line: {
            color: 'green',
            width: 1,
          },
          sync: {
            enabled: false,
          },
          zoom: {
            enabled: false,
          },
        },
        title: {
          display: true,
          text: title,
          font: {
            size: 16,
            weight: 'bold',
          },
        },
        tooltip: {
          enabled: true,
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.dataset.label || '';
              const value = tooltipItem.raw;
              const unit = Array.isArray(units)
                ? units[tooltipItem.datasetIndex] || ''
                : units;
              return `${label}: ${value} ${unit}`;
            },
          },
        },
        legend: {
          position: 'right',
          labels: {
            generateLabels: (chart) => {
              const originalLabels =
                Chart.defaults.plugins.legend.labels.generateLabels(chart);
              return originalLabels.map(
                (label: { datasetIndex?: number; text: string }) => {
                  const datasetIndex = label.datasetIndex;

                  if (
                    datasetIndex !== undefined &&
                    chart.data.datasets[datasetIndex]
                  ) {
                    const datasetData = chart.data.datasets[datasetIndex].data;
                    const lastValue = datasetData[datasetData.length - 1];

                    const name = label.text;
                    const unit = Array.isArray(units)
                      ? units[datasetIndex] || ''
                      : units;

                    if (lastValue !== null) {
                      label.text = `${lastValue} ${unit} | ${name}`;
                    } else {
                      label.text = `(нет данных) | ${name}`;
                    }
                  }
                  return label;
                }
              );
            },
          },
          onClick: (event: any, legendItem, chart) => {
            this.handleLegendClick(event, legendItem, chart.chart);
          },
        },
      },
      elements: {
        point: {
          radius: 0,
        },
        line: {
          borderWidth: 2,
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
    customNames?: string[], // Новый параметр для пользовательских названий
    colors?: string[] // Опциональный параметр для цветов
  ) {
    return parameterNames.map((name, index) => ({
      label: customNames && customNames[index] ? customNames[index] : name, // Используем customNames, если они есть
      data: values[index],
      borderColor: colors ? colors[index] : this.getColor(index), // Используем переданные цвета или цвета по умолчанию
      fill: false,
      pointRadius: 1,
      borderWidth: 2,
      backgroundColor: 'transparent',
      spanGaps: false,
    }));
  }
}
