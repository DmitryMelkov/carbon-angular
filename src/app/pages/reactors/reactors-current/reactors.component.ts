import {
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, interval, of } from 'rxjs';
import { switchMap, catchError, takeUntil, delay, startWith } from 'rxjs/operators';
import { ReactorData } from '../../../common/types/reactors-data';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ReactorService } from '../../../common/services/reactors/reactors.service';
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
  @Input() contentType!: string; // Тип контента (при необходимости)

  data: ReactorData | null = null;
  isLoading: boolean = true; // Флаг для управления прелоудером
  isDataLoaded: boolean = false; // Флаг для управления анимацией появления данных

  // Subject для завершения подписок при уничтожении компонента
  private destroy$ = new Subject<void>();

  constructor(
    private reactorService: ReactorService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Первичная загрузка данных
    this.loadData();
    // Запускаем периодическую загрузку данных каждые 10 секунд
    this.startPeriodicDataLoading();
  }

  ngOnDestroy(): void {
    // Завершаем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Выполняет первичную загрузку данных с небольшой задержкой (опционально для демонстрации прелоадера).
   */
  private loadData(): void {
    this.isLoading = true;
    this.reactorService.getReactorK296Data()
      .pipe(
        delay(1000), // Опциональная задержка (1 секунда)
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: ReactorData | null) => {
        this.updateData(response);
        this.onLoadingComplete();
      });
  }

  /**
   * Периодическая загрузка данных каждые 10 секунд.
   */
  private startPeriodicDataLoading(): void {
    interval(10000)
      .pipe(
        startWith(0), // Выполнить запрос сразу при подписке
        switchMap(() =>
          this.reactorService.getReactorK296Data().pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных:', error);
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((response: ReactorData | null) => {
        this.updateData(response);
      });
  }

  /**
   * Обновляет данные компонента.
   * Если ответ отсутствует, создаёт объект с дефолтными значениями, совместимыми с типом ReactorData.
   */
  private updateData(response: ReactorData | null): void {
    if (response) {
      this.data = response;
    } else {
      const defaultTemperatures = {
        'Температура реактора 45/1': NaN,
        'Температура реактора 45/2': NaN,
        'Температура реактора 45/3': NaN,
        'Температура реактора 45/4': NaN,
      };
      const defaultLevels = {
        'Уровень реактора 45/1': NaN,
        'Уровень реактора 45/2': NaN,
        'Уровень реактора 45/3': NaN,
        'Уровень реактора 45/4': NaN,
      };
      this.data = {
        temperatures: defaultTemperatures,
        levels: defaultLevels,
        lastUpdated: '—',
      };
    }
    this.isDataLoaded = true;
  }

  /**
   * Выключает прелоадер после завершения загрузки данных.
   */
  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
