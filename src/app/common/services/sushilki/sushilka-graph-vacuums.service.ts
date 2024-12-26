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
      return { labels: [], values1: [], values2: [], values3: [] };
    }

    const labels = sushilkaData.map((data) => new Date(data.lastUpdated));
    const values1 = sushilkaData.map((data) =>
      parseFloat(data.vacuums['Разрежение в топке'])
    );
    const values2 = sushilkaData.map((data) =>
      parseFloat(data.vacuums['Разрежение в камере выгрузки'])
    );
    const values3 = sushilkaData.map((data) =>
      parseFloat(data.vacuums['Разрежение воздуха на разбавление'])
    );

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
