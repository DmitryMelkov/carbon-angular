import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject, of } from 'rxjs';
import { switchMap, catchError, takeUntil, delay, startWith } from 'rxjs/operators';
import { SushilkiData } from '../../../common/types/sushilki-data';
import { GeneralTableComponent } from '../../../components/general-table/general-table.component';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { SushilkiService } from '../../../common/services/sushilki/sushilka.service';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-sushilka',
  standalone: true,
  imports: [
    GeneralTableComponent,
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './sushilka.component.html',
  styleUrls: ['./sushilka.component.scss'],
  animations: [fadeInAnimation],
})
export class SushilkaComponent implements OnInit, OnDestroy {
  @Input() id!: string; // ID сушилки
  @Input() contentType!: string; // Тип контента

  data: SushilkiData | null = null;
  isLoading: boolean = true; // Флаг для управления прелоудером
  isDataLoaded: boolean = false; // Флаг для управления анимацией появления данных
  private destroy$ = new Subject<void>(); // Поток для завершения подписок

  constructor(
    private sushilkiService: SushilkiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Если id не передан через @Input, получаем его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }

    if (!this.id) {
      console.error('ID сушилки не указан!');
      return;
    }

    // Первичная загрузка данных
    this.loadData();
    // Запускаем периодическую загрузку данных каждые 10 секунд
    this.startPeriodicDataLoading();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Если изменился id или contentType, повторно загружаем данные
    if (changes['id'] || changes['contentType']) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    // Завершаем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Первичная загрузка данных с небольшой задержкой (для демонстрации прелоадера).
   */
  private loadData(): void {
    this.isLoading = true;
    this.sushilkiService
      .getSushilkaData(this.id)
      .pipe(
        // Задержка 1 секунда (опционально)
        delay(1000),
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response: SushilkiData | null) => {
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
        startWith(0),
        switchMap(() =>
          this.sushilkiService.getSushilkaData(this.id).pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных:', error);
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((response: SushilkiData | null) => {
        this.updateData(response);
      });
  }

  /**
   * Обновляет данные компонента. Если ответ отсутствует, создаёт объект с данными по умолчанию.
   */
  private updateData(response: SushilkiData | null): void {
    if (response) {
      this.data = response;
    } else {
      // Если данных нет, создаем объект по умолчанию
      const suffix = this.id.replace('sushilka', '');
      this.data = {
        temperatures: {
          'Температура в топке': NaN,
          'Температура в камере смешения': NaN,
          'Температура уходящих газов': NaN,
        },
        vacuums: {
          'Разрежение в топке': '—',
          'Разрежение в камере выгрузки': '—',
          'Разрежение воздуха на разбавление': '—',
        },
        gorelka: {
          [`Мощность горелки №${suffix}`]: NaN,
          [`Сигнал от регулятора №${suffix}`]: NaN,
          [`Задание температуры №${suffix}`]: NaN,
        },
        im: {
          'Индикация паротушения': false,
          'Индикация сбрасыватель': false,
        },
        lastUpdated: '—',
      } as SushilkiData;
    }
    this.isDataLoaded = true; // Данные загружены, включаем анимацию
  }

  /**
   * Выключает прелоадер после завершения загрузки данных.
   */
  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
