import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlarmService {
  private alarmsSubject = new BehaviorSubject<{ key: string; value: any; unit: string }[]>([]);
  alarms$ = this.alarmsSubject.asObservable();

  constructor() {}

  // Добавление или обновление тревоги с единицей измерения
  updateAlarm(key: string, value: any, unit: string): void {
    const currentAlarms = this.alarmsSubject.value;
    const existingAlarmIndex = currentAlarms.findIndex((alarm) => alarm.key === key);

    if (existingAlarmIndex !== -1) {
      currentAlarms[existingAlarmIndex].value = value;
    } else {
      currentAlarms.push({ key, value, unit });
    }

    this.alarmsSubject.next([...currentAlarms]);
  }

  // Удаление тревоги
  removeAlarm(key: string): void {
    const updatedAlarms = this.alarmsSubject.value.filter((alarm) => alarm.key !== key);
    this.alarmsSubject.next(updatedAlarms);
  }

  // Очистка всех тревог
  clearAlarms(): void {
    this.alarmsSubject.next([]);
  }
}
