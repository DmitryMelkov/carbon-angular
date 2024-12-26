// src/app/common/services/sushilka-vacuum.service.ts

import { Injectable } from '@angular/core';
import { VacuumsData } from '../types/sushilki-data-graph';
import { ChartOptions } from 'chart.js';

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

  getChartOptions(): ChartOptions {
    return {
      scales: {
        x: {
          type: 'time',
          time: {
            unit: 'minute',
            tooltipFormat: 'HH:mm', // Формат для всплывающих подсказок
            displayFormats: {
              minute: 'HH:mm', // Формат для отображения на оси X
            },
          },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        title: {
          display: true,
          text: 'Данные разрежения для сушилок', // Заголовок графиков
        },
        tooltip: {
          mode: 'index', // Отображение тултипа для всех данных в одной точке времени
          intersect: false, // Не требуется пересечение с точками данных
          callbacks: {
            label: (tooltipItem) => {
              const label = tooltipItem.dataset.label || '';
              const value = tooltipItem.raw; // Получаем значение
              return `${label}: ${value}`; // Форматируем вывод
            },
          },
        },
        legend: {
          display: true,
          position: 'right',
        },
        crosshair: {
          line: {
            color: '#F66', // Цвет линии курсора
            width: 1, // Ширина линии курсора
          },
        },
      },
    };
  }

  getChartTitle(sushilkaId: string): string {
    const sushilkaNumber = Number(sushilkaId.replace('sushilka', '')); // Извлекаем номер сушилки из идентификатора
    return `Сушилка №${sushilkaNumber}: разрежение`; // Новый формат заголовка
  }

  getChartDatasetColors(sushilkaNumber: number) {
    // Определяем цвета для графиков в зависимости от номера сушилки
    return sushilkaNumber === 1
      ? ['blue', 'green', 'orange']
      : ['red', 'purple', 'cyan'];
  }
}
