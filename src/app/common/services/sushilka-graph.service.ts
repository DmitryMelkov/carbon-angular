// src/services/sushilka-graph.service.ts
import { Injectable } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { TemperatureData } from '../types/sushilki-data-graph';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SushilkaGraphService {
  constructor(private http: HttpClient) {}

  getTemperatureData(
    startTime: Date,
    endTime: Date
  ): Observable<TemperatureData[]> {
    const url = `http://localhost:3002/api/sushilka1/data?start=${startTime.toISOString()}&end=${endTime.toISOString()}`;
    return this.http.get<TemperatureData[]>(url);
  }

  renderChart(
    ctx: CanvasRenderingContext2D,
    temperatures: TemperatureData[]
  ): Chart {
    const chartData = {
      labels: temperatures.map((t) => new Date(t.lastUpdated)),
      datasets: [
        {
          label: 'Температура в топке',
          data: temperatures.map((t) => t.temperatures['Температура в топке']),
          borderColor: 'rgba(255, 99, 132, 1)',
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          fill: false,
          pointRadius: 0, // Убираем точки
        },
        {
          label: 'Температура в камере смешения',
          data: temperatures.map(
            (t) => t.temperatures['Температура в камере смешения']
          ),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          pointRadius: 0, // Убираем точки
        },
        {
          label: 'Температура уходящих газов',
          data: temperatures.map(
            (t) => t.temperatures['Температура уходящих газов']
          ),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          pointRadius: 0, // Убираем точки
        },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      animation: false,
      interaction: {
        mode: 'nearest' as const,
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: 'График температур Сушилки №1', // Текст заголовка
          color: 'green', // Цвет заголовка
          font: {
            size: 20, // Размер шрифта заголовка
          },
        },
        legend: {
          display: true,
          position: 'top',
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.dataset.label || '';
              const value =
                tooltipItem.parsed.y !== null ? tooltipItem.parsed.y : '';
              return `${label}: ${value}°C`;
            },
          },
        },
        crosshair: {
          line: {
            color: 'black',
            width: 1,
          },
          sync: {
            enabled: false,
          },
          zoom: {
            enabled: false,
          },
          snap: {
            enabled: true,
          },
        },
      },
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            displayFormats: {
              minute: 'HH:mm',
            },
          },
          ticks: {
            autoSkip: true,
            maxTicksLimit: 30,
            callback: function (value, index, values) {
              const date = new Date(value);
              // Отображаем метки только для каждой пятой метки
              return date.getMinutes() % 5 === 0
                ? date.toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })
                : '';
            },
          },
        },
        y: {
          beginAtZero: false,
          min: 0,
          max: 600,
        },
      },
    };

    return new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: options,
    });
  }
}