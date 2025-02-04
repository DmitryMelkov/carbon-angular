import { Component, OnInit, OnDestroy } from '@angular/core';
import { MillsService } from '../../../common/services/mills/mills.service';
import { MillData } from '../../../common/types/mills-data';
import { CommonModule } from '@angular/common';
import { interval, Subject, of, forkJoin } from 'rxjs';
import { takeUntil, catchError, switchMap, startWith } from 'rxjs/operators';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-mills-current',
  standalone: true,
  imports: [CommonModule, LoaderComponent, HeaderCurrentParamsComponent],
  templateUrl: './mills-current.component.html',
  styleUrls: ['./mills-current.component.scss'],
  animations: [fadeInAnimation],
})
export class MillsCurrentComponent implements OnInit, OnDestroy {
  mill1Data: MillData | null = null;
  mill2Data: MillData | null = null;
  mill10bData: MillData | null = null;
  isLoading: boolean = true;
  isDataLoaded: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private millsService: MillsService) {}

  ngOnInit() {
    this.initialLoad();
    this.startPeriodicDataLoading();
  }

  ngOnDestroy() {
    // Отменяем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Первичная загрузка всех данных одновременно.
   */
  private initialLoad(): void {
    forkJoin({
      mill1: this.millsService.getMill1Data().pipe(
        catchError((error) => {
          console.error('Ошибка при загрузке данных Mill 1:', error);
          return of(null);
        })
      ),
      mill2: this.millsService.getMill2Data().pipe(
        catchError((error) => {
          console.error('Ошибка при загрузке данных Mill 2:', error);
          return of(null);
        })
      ),
      mill10b: this.millsService.getMill10bData().pipe(
        catchError((error) => {
          console.error('Ошибка при загрузке данных Mill 10b:', error);
          return of(null);
        })
      )
    })
    .pipe(takeUntil(this.destroy$))
    .subscribe((data) => {
      this.mill1Data = data.mill1;
      this.mill2Data = data.mill2;
      this.mill10bData = data.mill10b;
      this.isLoading = false;
      this.isDataLoaded = true;
    });
  }

  /**
   * Периодическая загрузка данных для каждого объекта.
   */
  private startPeriodicDataLoading(): void {
    // Обновление данных для Mill 1 каждые 10 секунд
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.millsService.getMill1Data().pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных Mill 1:', error);
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          this.mill1Data = data;
        }
      });

    // Обновление данных для Mill 2 каждые 10 секунд
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.millsService.getMill2Data().pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных Mill 2:', error);
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          this.mill2Data = data;
        }
      });

    // Обновление данных для Mill 10b каждые 10 секунд
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.millsService.getMill10bData().pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных Mill 10b:', error);
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        if (data) {
          this.mill10bData = data;
        }
      });
  }

  getMill10bValue(key: string): string | number {
    return this.mill10bData?.data?.[key] || '—';
  }

  getMill1Value(key: string): string | number {
    return this.mill1Data?.data?.[key] || '—';
  }

  getMill2Value(key: string): string | number {
    return this.mill2Data?.data?.[key] || '—';
  }
}
