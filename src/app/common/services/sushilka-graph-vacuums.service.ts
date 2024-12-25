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
          },
        },
        y: {
          beginAtZero: true,
        },
      },
      plugins: {
        crosshair: {
          line: {
            color: '#F66', // Цвет линии курсора
            width: 1, // Ширина линии курсора
          },
        },
      },
    };
  }
}
