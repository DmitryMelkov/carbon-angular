import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject, of } from 'rxjs';
import { switchMap, catchError, takeUntil, delay } from 'rxjs/operators'; // Добавляем delay
import { ReactorData } from '../../../common/types/reactors-data';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { ReactorService } from '../../../common/services/reactors/reactors.service';
import { GeneralTableComponent } from '../../../components/general-table/general-table.component';
import { fadeInAnimation } from '../../../common/animations/animations';
import { DataLoadingService } from '../../../common/services/data-loading.service';

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
  @Input() contentType!: string; // Тип контента

  data: ReactorData | null = null;
  isLoading: boolean = true; // Управление прелоудером
  isDataLoaded: boolean = false; // Управление анимацией
  private destroy$ = new Subject<void>(); // Поток для завершения подписок

  constructor(
    private reactorService: ReactorService,
    private route: ActivatedRoute,
    private dataLoadingService: DataLoadingService // Добавляем DataLoadingService
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.startPeriodicDataLoading();
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading(); // Останавливаем периодическую загрузку
    this.destroy$.next();
    this.destroy$.complete(); // Завершаем поток
  }

  private loadData(): void {
    this.isLoading = true;
    this.reactorService
      .getReactorK296Data()
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при первичной загрузке данных:', error);
          this.isLoading = false;
          return of(null);
        }),
        delay(1000)
      )
      .subscribe((response) => {
        this.updateData(response);
        this.onLoadingComplete(); // Вызываем, когда данные загружены
      });
  }

  private startPeriodicDataLoading(): void {
    this.dataLoadingService.startPeriodicLoading(
      () => this.reactorService.getReactorK296Data(), // Функция для загрузки данных
      10000, // Интервал 10 секунд
      (response) => {
        this.updateData(response);
      }
    );
  }

  private updateData(response: ReactorData | null): void {
    if (response) {
      this.data = response;
    } else {
      // Дефолтные значения, совместимые с ReactorData
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

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
