import { Component, OnInit, OnDestroy } from '@angular/core';
import { MillsService } from '../../../common/services/mills/mills.service';
import { MillData } from '../../../common/types/mills-data';
import { CommonModule } from '@angular/common';
import { interval, Subject, of } from 'rxjs';
import { takeUntil, catchError, switchMap, delay } from 'rxjs/operators';
import { LoaderComponent } from '../../../components/loader/loader.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';

@Component({
  selector: 'app-mills-current',
  standalone: true,
  imports: [CommonModule, LoaderComponent, HeaderCurrentParamsComponent],
  templateUrl: './mills-current.component.html',
  styleUrls: ['./mills-current.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('0.3s ease-in-out')),
    ]),
  ],
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
    this.loadData();
    this.startPeriodicDataLoading();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
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

  private loadData() {
    this.isLoading = true;
    this.millsService.getMill1Data().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error('Ошибка при загрузке данных Mill 1:', error);
        this.isLoading = false;
        return of(null);
      }),
      delay(1000)
    ).subscribe((data) => {
      this.mill1Data = data;
      this.checkDataLoaded();
    });

    this.millsService.getMill2Data().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error('Ошибка при загрузке данных Mill 2:', error);
        this.isLoading = false;
        return of(null);
      }),
      delay(1000)
    ).subscribe((data) => {
      this.mill2Data = data;
      this.checkDataLoaded();
    });

    this.millsService.getMill10bData().pipe(
      takeUntil(this.destroy$),
      catchError((error) => {
        console.error('Ошибка при загрузке данных Mill 10b:', error);
        this.isLoading = false;
        return of(null);
      }),
      delay(1000)
    ).subscribe((data) => {
      this.mill10bData = data;
      this.checkDataLoaded();
    });
  }

  private checkDataLoaded() {
    if (this.mill1Data && this.mill2Data && this.mill10bData) {
      this.isLoading = false;
      this.isDataLoaded = true;
    }
  }

  private startPeriodicDataLoading() {
    interval(10000)
      .pipe(
        switchMap(() => this.millsService.getMill1Data()),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при периодической загрузке данных Mill 1:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) this.mill1Data = data;
      });

    interval(10000)
      .pipe(
        switchMap(() => this.millsService.getMill2Data()),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при периодической загрузке данных Mill 2:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) this.mill2Data = data;
      });

    interval(10000)
      .pipe(
        switchMap(() => this.millsService.getMill10bData()),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при периодической загрузке данных Mill 10b:', error);
          return of(null);
        })
      )
      .subscribe((data) => {
        if (data) this.mill10bData = data;
      });
  }

  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
