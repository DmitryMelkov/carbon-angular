import { Injectable } from '@angular/core';
import { ChartOptions, Chart, ChartTypeRegistry } from 'chart.js';
import { TemperatureData, VacuumsData } from '../../types/sushilki-data-graph';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class SushilkaDataService {
  constructor() {}

  async getData(
    startTime: Date,
    endTime: Date,
    sushilkaId: string,
    dataType: 'temperature' | 'vacuum'
  ): Promise<TemperatureData[] | VacuumsData[]> {
    const url = `${environment.apiUrl}/api/${sushilkaId}/data?start=${startTime.toISOString()}&end=${endTime.toISOString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  async getServerTime(): Promise<Date> {
    const response = await fetch(`${environment.apiUrl}/api/server-time`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return new Date(data.time); // Предполагаем, что API возвращает объект с полем 'time'
  }

  processTemperatureData(sushilkaData: TemperatureData[]) {
    return this.processData(sushilkaData, 'temperature');
  }

  processVacuumData(sushilkaData: VacuumsData[]) {
    return this.processData(sushilkaData, 'vacuum');
  }

  private processData(data: any[], type: 'temperature' | 'vacuum') {
    if (!data || data.length === 0) {
      console.warn('Нет данных для отображения');
      return {
        labels: [],
        values1: [] as (number | null)[],
        values2: [] as (number | null)[],
        values3: [] as (number | null)[],
      };
    }

    const labels: Date[] = [];
    const values1: (number | null)[] = [];
    const values2: (number | null)[] = [];
    const values3: (number | null)[] = [];

    data.sort(
      (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
    );

    let previousTime: Date | null = null;

    data.forEach((dataPoint) => {
      const currentTime = new Date(dataPoint.lastUpdated);
      if (previousTime) {
        const timeDiff = currentTime.getTime() - previousTime.getTime();
        const missingIntervals = Math.floor(timeDiff / (60 * 1000));
        if (timeDiff > 60 * 1000) {
          for (let i = 1; i < missingIntervals; i++) {
            const missingTime = new Date(
              previousTime.getTime() + i * 60 * 1000
            );
            labels.push(missingTime);
            values1.push(null);
            values2.push(null);
            values3.push(null);
          }
        }
      }

      labels.push(currentTime);
      if (type === 'temperature') {
        values1.push(
          typeof dataPoint.temperatures['Температура в топке'] === 'number'
            ? dataPoint.temperatures['Температура в топке']
            : parseFloat(dataPoint.temperatures['Температура в топке'])
        );
        values2.push(
          typeof dataPoint.temperatures['Температура в камере смешения'] === 'number'
            ? dataPoint.temperatures['Температура в камере смешения']
            : parseFloat(dataPoint.temperatures['Температура в камере смешения'])
        );
        values3.push(
          typeof dataPoint.temperatures['Температура уходящих газов'] === 'number'
            ? dataPoint.temperatures['Температура уходящих газов']
            : parseFloat(dataPoint.temperatures['Температура уходящих газов'])
        );
      } else if (type === 'vacuum') {
        values1.push(parseFloat(dataPoint.vacuums['Разрежение в топке']));
        values2.push(
          parseFloat(dataPoint.vacuums['Разрежение в камере выгрузки'])
        );
        values3.push(
          parseFloat(dataPoint.vacuums['Разрежение воздуха на разбавление'])
        );
      }

      previousTime = currentTime;
    });

    return { labels, values1, values2, values3 };
  }

  getChartOptions(type: 'temperature' | 'vacuum'): ChartOptions {
    const yAxisTitle = type === 'temperature' ? 'Температуры, градусы' : 'Разрежения, кгс/см2';
    const titleText = type === 'temperature' ? 'Данные температуры для сушилок' : 'Данные разрежения для сушилок';

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
          text: titleText,
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
      },
    };
  }

  private createDataset(label: string, data: (number | null)[], color: string) {
    return {
      label: label,
      data: data,
      borderColor: color,
      fill: false,
      pointRadius: 1,
      borderWidth: 2,
      backgroundColor: 'transparent',
      spanGaps: false, // разрывы
    };
  }

  createChart(
    ctx: CanvasRenderingContext2D,
    labels: Date[],
    values1: (number | null)[],
    values2: (number | null)[],
    values3: (number | null)[],
    options: ChartOptions,
    sushilkaId: string,
    type: 'temperature' | 'vacuum'
  ): Chart<keyof ChartTypeRegistry> {
    const colors = this.getChartDatasetColors(
      Number(sushilkaId.replace('sushilka', ''))
    );

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          this.createDataset(type === 'temperature' ? 'Температура в топке' : 'Разрежение в топке', values1, colors[0]),
          this.createDataset(type === 'temperature' ? 'Температура в камере смешения' : 'Разрежение в камере выгрузки', values2, colors[1]),
          this.createDataset(type === 'temperature' ? 'Температура уходящих газов' : 'Разрежение воздуха на разбавление', values3, colors[2]),
        ],
      },
      options: {
        ...options,
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          ...options.plugins,
          legend: {
            position: 'right',
            labels: {
              generateLabels: (chart) => {
                const originalLabels =
                  Chart.defaults.plugins.legend.labels.generateLabels(chart);
                return originalLabels.map((label) => {
                  const datasetIndex = label.datasetIndex;

                  if (
                    datasetIndex !== undefined &&
                    chart.data.datasets[datasetIndex]
                  ) {
                    const datasetData = chart.data.datasets[datasetIndex].data;
                    const lastValue = datasetData[datasetData.length - 1];

                    // Формируем текст в нужном порядке: цвет линии / значение / наименование
                    const color = chart.data.datasets[datasetIndex].borderColor;
                    const name = label.text; // Наименование параметра

                    if (lastValue !== null) {
                      label.text = `${lastValue} ${type === 'temperature' ? '°C' : 'кгс/см2'} | ${name}`;
                    } else {
                      label.text = `(нет данных) | ${name}`;
                    }
                  }
                  return label;
                });
              },
            },
            onClick: (event: any, legendItem) => {
              this.handleLegendClick(event, legendItem, chart);
            },
          },

          title: {
            display: true,
            text: this.getChartTitle(sushilkaId, type),
            font: {
              size: 16,
              weight: 'bold',
            },
          },
        },
      },
    });

    return chart;
  }

  getChartTitle(sushilkaId: string, type: 'temperature' | 'vacuum'): string {
    const sushilkaNumber = Number(sushilkaId.replace('sushilka', ''));
    return `Сушилка №${sushilkaNumber}: ${type === 'temperature' ? 'температура' : 'разрежение'}`;
  }

  getChartDatasetColors(sushilkaNumber: number) {
    return sushilkaNumber === 1
      ? ['blue', 'green', 'orange']
      : ['red', 'purple', 'cyan'];
  }

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
}
