import { Injectable } from '@angular/core';
import { ChartOptions, Chart, ChartTypeRegistry } from 'chart.js';
import { VacuumsData } from '../../types/sushilki-data-graph';

@Injectable({
  providedIn: 'root',
})
export class SushilkaVacuumService {
  constructor() {}

  async getVacuumData(
    startTime: Date,
    endTime: Date,
    sushilkaId: string
  ): Promise<VacuumsData[]> {
    const url = `http://localhost:3002/api/${sushilkaId}/data?start=${startTime.toISOString()}&end=${endTime.toISOString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  processVacuumData(sushilkaData: VacuumsData[]) {
    if (!sushilkaData || sushilkaData.length === 0) {
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

    // Сортируем данные по времени
    sushilkaData.sort(
      (a, b) =>
        new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime()
    );

    let previousTime: Date | null = null;

    for (const dataPoint of sushilkaData) {
      const currentTime = new Date(dataPoint.lastUpdated);

      // Если это не первый элемент, проверяем разницу во времени
      if (previousTime) {
        const timeDiff = currentTime.getTime() - previousTime.getTime();
        // Если разница больше 1 минуты, добавляем null значения
        if (timeDiff > 60 * 1000) {
          const missingIntervals = Math.floor(timeDiff / (60 * 1000));
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

      // Добавляем текущие значения
      labels.push(currentTime);
      values1.push(parseFloat(dataPoint.vacuums['Разрежение в топке']));
      values2.push(
        parseFloat(dataPoint.vacuums['Разрежение в камере выгрузки'])
      );
      values3.push(
        parseFloat(dataPoint.vacuums['Разрежение воздуха на разбавление'])
      );

      previousTime = currentTime;
    }

    return { labels, values1, values2, values3 };
  }

  getChartOptions(): ChartOptions {
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
          min: -20,
          max: 30,
          title: {
            display: true,
            text: 'Разреженеия, кгс/см2',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Данные разрежения для сушилок',
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

  createChart(
    ctx: CanvasRenderingContext2D,
    labels: Date[],
    values1: (number | null)[],
    values2: (number | null)[],
    values3: (number | null)[],
    options: ChartOptions,
    sushilkaId: string
  ): Chart<keyof ChartTypeRegistry> {
    const colors = this.getChartDatasetColors(
      Number(sushilkaId.replace('sushilka', ''))
    );

    const chart = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Разрежение в топке',
            data: values1,
            borderColor: colors[0],
            fill: false,
            pointRadius: 1,
            borderWidth: 2,
            backgroundColor: 'transparent',
            spanGaps: false, // разрывы
          },
          {
            label: 'Разрежение в камере выгрузки',
            data: values2,
            borderColor: colors[1],
            fill: false,
            pointRadius: 1,
            borderWidth: 2,
            backgroundColor: 'transparent',
            spanGaps: false, // разрывы
          },
          {
            label: 'Разрежение воздуха на разбавление',
            data: values3,
            borderColor: colors[2],
            fill: false,
            pointRadius: 1,
            borderWidth: 2,
            backgroundColor: 'transparent',
            spanGaps: false, // разрывы
          },
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
            onClick: (event: any, legendItem) => {
              this.handleLegendClick(event, legendItem, chart);
            },
          },
          title: {
            display: true,
            text: this.getChartTitle(sushilkaId),
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

  getChartTitle(sushilkaId: string): string {
    const sushilkaNumber = Number(sushilkaId.replace('sushilka', ''));
    return `Сушилка №${sushilkaNumber}: разрежение`;
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
