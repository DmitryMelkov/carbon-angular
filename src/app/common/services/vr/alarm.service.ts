// alarm.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlarmService {
  private alarmsSubject = new BehaviorSubject<{ key: string; value: any }[]>([]);
  alarms$ = this.alarmsSubject.asObservable();

  constructor() {}

  // Добавление или обновление тревоги
  updateAlarm(key: string, value: any): void {
    const currentAlarms = this.alarmsSubject.value;
    const existingAlarmIndex = currentAlarms.findIndex((alarm) => alarm.key === key);

    if (existingAlarmIndex !== -1) {
      // Если тревога уже существует, обновляем её значение
      currentAlarms[existingAlarmIndex].value = value;
    } else {
      // Если тревоги нет, добавляем новую
      currentAlarms.push({ key, value });
    }

    this.alarmsSubject.next([...currentAlarms]);
  }

  // Удаление тревоги
  removeAlarm(key: string): void {
    const currentAlarms = this.alarmsSubject.value;
    const updatedAlarms = currentAlarms.filter((alarm) => alarm.key !== key);
    this.alarmsSubject.next(updatedAlarms);
  }

  // Очистка всех тревог
  clearAlarms(): void {
    this.alarmsSubject.next([]);
  }
}
