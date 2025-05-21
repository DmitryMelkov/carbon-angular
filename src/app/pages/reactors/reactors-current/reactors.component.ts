import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, forkJoin, interval, of } from 'rxjs';
import {
  switchMap,
  catchError,
  takeUntil,
  delay,
  startWith,
} from 'rxjs/operators';
import { ReactorData } from '../../../common/types/reactors-data';
import { PressData } from '../../../common/types/press-data';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ReactorService } from '../../../common/services/reactors/reactors.service';
import { PressService } from '../../../common/services/press/press.service';
import { GeneralTableComponent } from '../../../components/general-table/general-table.component';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-reactors',
  standalone: true,
  imports: [
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
    GeneralTableComponent,
  ],
  templateUrl: './reactors.component.html',
  styleUrls: ['./reactors.component.scss'],
  animations: [fadeInAnimation],
})
export class ReactorComponent implements OnInit, OnDestroy {
  @Input() contentType!: string;

  reactorData: ReactorData | null = null;
  isLoading: boolean = true;
  isDataLoaded: boolean = false;

  // Хранилище данных по всем прессам
  pressesData: { [key: string]: PressData } = {};

  private destroy$ = new Subject<void>();

  constructor(
    private reactorService: ReactorService,
    private pressService: PressService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.loadAllPresses(); // Загрузка данных всех прессов
    this.startPeriodicDataLoading();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;

    // Загружаем данные реактора
    this.reactorService
      .getReactorK296Data()
      .pipe(
        delay(1000),
        catchError((error) => {
          console.error('Ошибка при загрузке данных реактора:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((reactorResponse: ReactorData | null) => {
        this.updateReactorData(reactorResponse);
      });
  }

  private loadAllPresses(): void {
    const pressIds = ['1', '2', '3', '4'];
    this.pressesData = {
      '1': this.getDefaultPressData(),
      '2': this.getDefaultPressData(),
      '3': this.getDefaultPressData(),
      '4': this.getDefaultPressData(),
    };

    pressIds.forEach((pressId) => {
      this.pressService
        .getPressData(pressId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this.pressesData[pressId] = data || this.getDefaultPressData();
        });
    });
  }

  private getDefaultPressData(): PressData {
    return {
      controllerData: {
        'Статус работы': false,
        'Кол-во наработанных часов': 0,
      },
      termodatData: {
        'Температура масла': 0,
        'Давление масла': 0,
      },
      lastUpdated: '—',
    };
  }

  private startPeriodicDataLoading(): void {
    // Периодическая загрузка данных реактора
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.reactorService.getReactorK296Data().pipe(
            catchError((error) => {
              console.error(
                'Ошибка при периодической загрузке данных реактора:',
                error
              );
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((reactorResponse: ReactorData | null) => {
        this.updateReactorData(reactorResponse);
      });

    // Периодическая загрузка данных прессов
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          forkJoin(
            ['1', '2', '3', '4'].map((id) =>
              this.pressService.getPressData(id).pipe(
                catchError((error) => {
                  console.error(
                    `Ошибка при загрузке данных пресса ${id}:`,
                    error
                  );
                  return of(null);
                })
              )
            )
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe({
        next: (responses: (PressData | null)[]) => {
          const pressIds = ['1', '2', '3', '4'];
          responses.forEach((data, index) => {
            const id = pressIds[index];
            this.pressesData[id] = data || this.getDefaultPressData();
          });
          this.onLoadingComplete();
        },
        error: (err) => {
          console.error(
            'Ошибка при периодической загрузке данных прессов:',
            err
          );
        },
      });
  }

  private updateReactorData(response: ReactorData | null): void {
    if (response) {
      this.reactorData = response;
    } else {
      this.reactorData = {
        temperatures: {
          'Температура реактора 45/1': NaN,
          'Температура реактора 45/2': NaN,
          'Температура реактора 45/3': NaN,
          'Температура реактора 45/4': NaN,
        },
        levels: {
          'Уровень реактора 45/1': NaN,
          'Уровень реактора 45/2': NaN,
          'Уровень реактора 45/3': NaN,
          'Уровень реактора 45/4': NaN,
        },
        lastUpdated: '—',
      };
    }
    this.isDataLoaded = true;
  }

  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
