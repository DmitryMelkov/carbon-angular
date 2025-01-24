import { Injectable } from '@angular/core';
import { interval, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { VrService } from './vr/vr.service';

@Injectable({
  providedIn: 'root',
})
export class DataLoadingService {
  private destroy$ = new Subject<void>();

  constructor(private vrService: VrService) {}

  startPeriodicLoading(id: string, intervalTime: number, callback: (data: any) => void): void {
    interval(intervalTime)
      .pipe(
        switchMap(() => this.vrService.getVrData(id)),
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
