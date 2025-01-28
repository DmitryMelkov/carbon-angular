import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root', // Сервис доступен на уровне всего приложения
})
export class ValueCheckService {
  // Метод для проверки, выходит ли значение за пределы диапазона
  isOutOfRange(key: string, value: any, recommendedValues: Record<string, string>): boolean {
    const recommended = recommendedValues[key];
    if (!recommended) return false;

    const numericValue = parseFloat(value);
    if (isNaN(numericValue)) return false;

    // Извлекаем все числа из строки (включая отрицательные и десятичные)
    const numbers = recommended.match(/-?\d+\.?\d*/g)?.map(Number) || [];

    // 1. Проверка для формата "от X до Y"
    if (recommended.startsWith('от') && numbers.length >= 2) {
      const [min, max] = numbers;
      return numericValue < min || numericValue > max;
    }

    // 2. Проверка для формата "X-Y"
    if (recommended.includes('-') && numbers.length >= 2) {
      const [min, max] = numbers;
      return numericValue < min || numericValue > max;
    }

    // 3. Проверка для "не более X"
    if (recommended.includes('не более') && numbers.length >= 1) {
      return numericValue > numbers[0];
    }

    // 4. Проверка для "не менее X"
    if (recommended.includes('не менее') && numbers.length >= 1) {
      return numericValue < numbers[0];
    }

    return false;
  }
}
