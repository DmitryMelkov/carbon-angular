import { Injectable } from '@angular/core';
import { Observable, of, Subject, interval } from 'rxjs';
import { catchError, switchMap, takeUntil, delay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataLoadingService {
  private destroy$ = new Subject<void>();

  constructor() {}

  // Универсальный метод для загрузки данных
  loadData<T>(
    loadFunction: () => Observable<T>, // Функция для загрузки данных
    onSuccess: (data: T) => void, // Обработка успешной загрузки
    onError: (error: any) => void = console.error // Обработка ошибок
  ): void {
    loadFunction()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          onError(error);
          return of(null);
        }),
        delay(1000) // Имитация задержки (можно убрать)
      )
      .subscribe((response) => {
        if (response) {
          onSuccess(response);
        }
      });
  }

  // Универсальный метод для периодической загрузки данных
  startPeriodicLoading<T>(
    loadFunction: () => Observable<T>, // Функция для загрузки данных
    intervalTime: number, // Интервал загрузки
    onSuccess: (data: T) => void // Обработка успешной загрузки
  ): void {
    interval(intervalTime)
      .pipe(
        switchMap(() => loadFunction()),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при периодической загрузке данных:', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        if (response) {
          onSuccess(response);
        }
      });
  }

  stopPeriodicLoading(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
