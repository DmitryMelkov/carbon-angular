import { Injectable } from '@angular/core';
import { Chart, ChartOptions } from 'chart.js';
import { TemperatureData } from '../types/sushilki-data-graph';

@Injectable({
  providedIn: 'root',
})
export class SushilkaGraphService {
  constructor() {}

  async getTemperatureData(
    startTime: Date,
    endTime: Date,
    sushilkaId: string
  ): Promise<TemperatureData[]> {
    const url = `http://localhost:3002/api/${sushilkaId}/data?start=${startTime.toISOString()}&end=${endTime.toISOString()}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }

  renderChart(
    ctx: CanvasRenderingContext2D,
    temperatures: TemperatureData[],
    sushilkaId: string
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
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Температура в камере смешения',
          data: temperatures.map(
            (t) => t.temperatures['Температура в камере смешения']
          ),
          borderColor: 'rgba(54, 162, 235, 1)',
          backgroundColor: 'rgba(54, 162, 235, 0.2)',
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
        },
        {
          label: 'Температура уходящих газов',
          data: temperatures.map(
            (t) => t.temperatures['Температура уходящих газов']
          ),
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          fill: false,
          pointRadius: 0,
          borderWidth: 2,
        },
      ],
    };

    const options: ChartOptions<'line'> = {
      responsive: true,
      animation: false,
      interaction: {
        mode: 'index', // Изменяем на 'index', чтобы получать все значения для одной метки
        intersect: false,
      },
      plugins: {
        title: {
          display: true,
          text: `График температур Сушилки ${
            sushilkaId === 'sushilka1' ? '№1' : '№2'
          }`,
          color: 'green',
          font: {
            size: 20,
          },
        },
        legend: {
          display: true,
          position: 'right',
        },
        tooltip: {
          enabled: true,
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.dataset.label || '';
              const value = tooltipItem.parsed.y !== null ? tooltipItem.parsed.y : '';
              return `${label}: ${value}°C`;
            },
            title: (tooltipItems) => {
              // Заголовок тултипа - время
              const timestamp = tooltipItems[0].parsed.x; // Получаем метку времени из parsed.x
              const date = new Date(timestamp); // Создаем новый объект Date
              return date.toLocaleString(); // Форматируем дату и время по локали
            },
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


  updateCanvasSize(canvas: HTMLCanvasElement) {
    // Установка ширины и высоты для адаптивности
    canvas.width = canvas.clientWidth;
    canvas.height = 60; // Вы можете изменить высоту по вашему усмотрению
  }

  resetToCurrentValues(): { startTime: Date; endTime: Date } {
    const startTime = new Date(Date.now() - 30 * 60 * 1000);
    const endTime = new Date();
    return { startTime, endTime };
  }

  changeTime(
    chartNumber: number,
    direction: 'backward' | 'forward',
    startTime1: Date,
    endTime1: Date,
    startTime2: Date,
    endTime2: Date
  ): { startTime1: Date; endTime1: Date; startTime2: Date; endTime2: Date } {
    const hourChange = 60 * 60 * 1000; // 1 hour in milliseconds
    const timeChange = direction === 'backward' ? -hourChange : hourChange;

    if (chartNumber === 1) {
      startTime1 = new Date(startTime1.getTime() + timeChange);
      endTime1 = new Date(endTime1.getTime() + timeChange);
    } else if (chartNumber === 2) {
      startTime2 = new Date(startTime2.getTime() + timeChange);
      endTime2 = new Date(endTime2.getTime() + timeChange);
    }

    return { startTime1, endTime1, startTime2, endTime2 };
  }
}
