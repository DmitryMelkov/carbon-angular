import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UniversalGraphService {
  constructor() {}

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
    dataKey: string
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
        if (timeDiff > 60 * 1000) { // Если пропуск больше 1 минуты
          for (let i = 1; i < missingIntervals; i++) {
            const missingTime = new Date(previousTime.getTime() + i * 60 * 1000);
            labels.push(missingTime);
            parameterNames.forEach((_, index) => {
              values[index].push(null); // Добавляем null для каждого параметра
            });
          }
        }
      }

      labels.push(currentTime);
      parameterNames.forEach((param, index) => {
        const value = dataPoint[dataKey][param];
        values[index].push(value !== null ? parseFloat(value) : null);
      });

      previousTime = currentTime;
    });

    return { labels, values };
  }
}
