import { Injectable } from '@angular/core';
import { VrData } from '../../types/vr-data';

@Injectable({
  providedIn: 'root', // Сервис доступен на уровне всего приложения
})
export class ModeVrService {
  private currentMode: string | null = null;
  constructor() {}

  // Метод для определения режима работы печи
  determineMode(data: VrData | null): string | null {
    if (!data) {
      return null;
    }
    const temper1Value = data.temperatures['1-СК'];
    if (temper1Value < 550 && temper1Value > 10) {
      return 'Выход на режим';
    } else if (temper1Value > 550) {
      return 'Установившийся режим';
    } else {
      return 'Печь не работает';
    }
  }

  // Устанавливаем текущий режим
  setCurrentMode(mode: string | null): void {
    this.currentMode = mode;
  }

  // Получаем текущий режим
  getCurrentMode(): string | null {
    return this.currentMode;
  }

  // Метод для обновления рекомендуемых значений в зависимости от режима
  updateRecommendedTemperatures(mode: string | null, recommendedTemperatures: { [key: string]: string }): void {
    if (mode === 'Установившийся режим') {
      recommendedTemperatures['3-СК'] = 'не более 400 °C';
    } else if (mode === 'Выход на режим') {
      recommendedTemperatures['3-СК'] = 'не более 750 °C';
    }
  }
}
