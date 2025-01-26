import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class DataLoadingService {
  private destroy$ = new Subject<void>();

  constructor() {}

  startPeriodicLoading(
    loadDataFn: () => any, // Функция для загрузки данных
    intervalTime: number,
    callback: (data: any) => void
  ): void {
    interval(intervalTime)
      .pipe(
        switchMap(() => loadDataFn()), // Используем переданную функцию
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        callback(response);
      });
  }

  stopPeriodicLoading(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
