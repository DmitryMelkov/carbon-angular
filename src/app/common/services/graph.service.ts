// graph.service.ts
import { Injectable } from '@angular/core';
import { Chart } from 'chart.js';
import { SushilkiData } from '../types/sushilki-data';

@Injectable({
  providedIn: 'root',
})
export class GraphService {
  createChart(
    canvas: HTMLCanvasElement,
    timeStamps: string[],
    datasets: any[],
    title: string
  ) {
    return new Chart(canvas, {
      type: 'line',
      data: {
        labels: timeStamps,
        datasets: datasets,
      },
      options: {
        responsive: true,
        plugins: {
          title: {
            display: true,
            text: title,
            color: 'green',
            font: {
              size: 20,
            },
          },
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'Время',
            },
            ticks: {
              autoSkip: true,
              maxTicksLimit: 10,
            },
          },
          y: {
            title: {
              display: true,
              text: 'Температура (°C)',
            },
            beginAtZero: true,
            min: 0,
            max: 600,
          },
        },
      },
    });
  }

  generateTimeStamps(duration: '30min' | '24h'): string[] {
    const now = new Date();
    const length = duration === '30min' ? 30 : 24;
    const interval = duration === '30min' ? 60 * 1000 : 60 * 60 * 1000;

    return Array.from({ length }, (_, i) => {
      const date = new Date(now.getTime() - i * interval); // Измените порядок здесь
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      });
    });
  }

  createDatasets(sushilkaData: SushilkiData, timeRange: '30min' | '24h') {
    const temperatures = sushilkaData.temperatures;
    const length = timeRange === '30min' ? 30 : 24;
    const datasets = [];

    for (const key in temperatures) {
      if (temperatures.hasOwnProperty(key)) {
        const tempDataArray = Array(length).fill(temperatures[key] || 0);
        datasets.push({
          label: key,
          data: tempDataArray,
          fill: false,
          borderColor: this.getColorForLabel(key),
          backgroundColor: this.getColorForLabel(key),
          tension: 0.1,
          pointRadius: 0,
        });
      }
    }

    return datasets;
  }

  getColorForLabel(label: string): string {
    const colors: { [key: string]: string } = {
      'Температура в топке': 'rgb(75, 192, 192)',
      'Температура в камере смешения': 'rgb(255, 99, 132)',
      'Температура уходящих газов': 'rgb(54, 162, 235)',
    };
    return colors[label] || 'rgb(0, 0, 0)';
  }
}
