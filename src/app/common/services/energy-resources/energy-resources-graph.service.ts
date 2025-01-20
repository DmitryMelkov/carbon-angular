import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Chart, ChartOptions } from 'chart.js';
import 'chartjs-adapter-date-fns';

export interface PressureData {
  lastUpdated: string;
  data: {
    [key: string]: number;
  };
}

@Injectable({
  providedIn: 'root',
})
export class EnergyResourcesGraphService {
  private apiUrl = 'http://localhost:3002/api/de093/data'; // API для получения данных

  constructor(private http: HttpClient) {}

  // Получение данных с API
  getPressureData(startTime: Date, endTime: Date): Observable<PressureData[]> {
    const url = `${this.apiUrl}?start=${startTime.toISOString()}&end=${endTime.toISOString()}`;
    console.log('Запрос к API:', url); // Логирование URL запроса
    return this.http.get<PressureData[]>(url);
  }

  // Обработка данных для графика
  processPressureData(data: PressureData[]) {
    const labels: Date[] = [];
    const values: (number | null)[] = [];

    data.sort((a, b) => new Date(a.lastUpdated).getTime() - new Date(b.lastUpdated).getTime());

    let previousTime: Date | null = null;

    data.forEach((dataPoint) => {
      const currentTime = new Date(dataPoint.lastUpdated);

      // Заполнение пропусков во времени
      if (previousTime) {
        const timeDiff = currentTime.getTime() - previousTime.getTime();
        const missingIntervals = Math.floor(timeDiff / (60 * 1000));
        if (timeDiff > 60 * 1000) {
          for (let i = 1; i < missingIntervals; i++) {
            const missingTime = new Date(previousTime.getTime() + i * 60 * 1000);
            labels.push(missingTime);
            values.push(null);
          }
        }
      }

      labels.push(currentTime);
      values.push(dataPoint.data['Давление DE093'] || null);
      previousTime = currentTime;
    });

    return { labels, values };
  }

  // Настройки графика
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
          title: {
            display: true,
            text: 'Давление, МПа2',
          },
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'График давления по энергоресурсам',
        },
        tooltip: {
          mode: 'index',
          intersect: false,
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.dataset.label || '';
              const value = tooltipItem.raw;
              return `${label}: ${value} МПа2`;
            },
          },
        },
      },
    };
  }

  // Создание графика
  createChart(ctx: CanvasRenderingContext2D, labels: Date[], values: (number | null)[], options: ChartOptions): Chart {
    return new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Давление (МПа2)',
            data: values,
            borderColor: 'blue',
            fill: false,
            pointRadius: 2,
            borderWidth: 2,
            backgroundColor: 'transparent',
            spanGaps: false,
          },
        ],
      },
      options: options,
    });
  }
}
