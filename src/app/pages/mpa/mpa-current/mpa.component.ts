import { Component, OnInit, OnDestroy, Input, SimpleChanges } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, interval, of } from 'rxjs';
import { takeUntil, catchError, switchMap, startWith } from 'rxjs/operators';
import { MpaData } from '../../../common/types/mpa-data';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { MpaService } from '../../../common/services/mpa/mpa.service';
import { GeneralTableComponent } from '../../../components/general-table/general-table.component';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-mpa',
  standalone: true,
  imports: [
    GeneralTableComponent,
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './mpa.component.html',
  styleUrls: ['./mpa.component.scss'],
  animations: [fadeInAnimation],
})
export class MpaComponent implements OnInit, OnDestroy {
  @Input() id!: string; // ID МПА
  @Input() contentType!: string; // Тип контента

  data: MpaData | null = null;
  isLoading: boolean = true; // Управление прелоудером
  isDataLoaded: boolean = false; // Управление анимацией (например, для появления данных)

  // Subject для завершения подписок при уничтожении компонента
  private destroy$ = new Subject<void>();

  constructor(
    private mpaService: MpaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Если id не передан через @Input, пытаемся получить его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }
    if (!this.id) {
      console.error('ID МПА не указан!');
      return;
    }

    // Первичная загрузка данных
    this.loadData();

    // Периодическая загрузка данных каждые 10 секунд (с немедленным запуском)
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.mpaService.getMpaData(this.id).pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных:', error);
              return of(null);
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        if (response) {
          this.updateData(response);
        }
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Если изменился id или contentType – выполняем повторную загрузку данных
    if (changes['id'] || changes['contentType']) {
      this.loadData();
    }
  }

  ngOnDestroy(): void {
    // Завершаем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;
    this.mpaService.getMpaData(this.id)
      .pipe(
        catchError((error) => {
          console.error('Ошибка при первичной загрузке данных:', error);
          return of(null);
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((response) => {
        if (response) {
          this.updateData(response);
        }
        this.onLoadingComplete();
      });
  }

  private updateData(response: MpaData | null): void {
    if (response) {
      // Преобразуем ключи для temperatures и pressures
      const transformedTemperatures = this.transformKeys(response.temperatures, 'Температура ');
      const transformedPressures = this.transformKeys(response.pressures, 'Давление ');

      // Обновляем данные
      this.data = {
        temperatures: transformedTemperatures,
        pressures: transformedPressures,
        lastUpdated: response.lastUpdated,
      };
    } else {
      // Создаем объект по умолчанию, если ответа нет
      const suffix = this.id.replace('mpa', '');
      const defaultTemperatures = {
        [`Температура Верх регенератора левый МПА${suffix}`]: NaN,
        [`Температура верх ближний левый МПА${suffix}`]: NaN,
        [`Температура верх дальний левый МПА${suffix}`]: NaN,
        [`Температура середина ближняя левый МПА${suffix}`]: NaN,
        [`Температура середина дальняя левый МПА${suffix}`]: NaN,
        [`Температура низ ближний левый МПА${suffix}`]: NaN,
        [`Температура низ дальний левый МПА${suffix}`]: NaN,
        [`Температура верх регенератора правый МПА${suffix}`]: NaN,
        [`Температура верх ближний правый МПА${suffix}`]: NaN,
        [`Температура верх дальний правый МПА${suffix}`]: NaN,
        [`Температура середина ближняя правый МПА${suffix}`]: NaN,
        [`Температура середина дальняя правый МПА${suffix}`]: NaN,
        [`Температура низ ближний правый МПА${suffix}`]: NaN,
        [`Температура низ дальний правый МПА${suffix}`]: NaN,
        [`Температура камера сгорания МПА${suffix}`]: NaN,
        [`Температура дымовой боров МПА${suffix}`]: NaN,
      };

      const defaultPressures = {
        [`Разрежение дымовой боров МПА${suffix}`]: '—',
        [`Давление воздух левый МПА${suffix}`]: '—',
        [`Давление воздух правый МПА${suffix}`]: '—',
        [`Давление низ ближний МПА${suffix}`]: '—',
        [`Давление низ ближний правый МПА${suffix}`]: '—',
        [`Давление середина ближняя МПА${suffix}`]: '—',
        [`Давление середина ближняя правый МПА${suffix}`]: '—',
        [`Давление середина дальняя МПА${suffix}`]: '—',
        [`Давление верх дальний левый МПА${suffix}`]: '—',
        [`Давление верх дальний правый МПА${suffix}`]: '—',
      };

      const transformedTemperatures = this.transformKeys(defaultTemperatures, 'Температура ');
      const transformedPressures = this.transformKeys(defaultPressures, 'Давление ');

      this.data = {
        temperatures: transformedTemperatures,
        pressures: transformedPressures,
        lastUpdated: '—',
      } as MpaData;
    }
    this.isDataLoaded = true;
  }

  private transformKeys(obj: Record<string, any>, prefix: string): Record<string, any> {
    const transformed: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Удаляем заданный префикс и окончание вида "МПА<number>"
        let newKey = key.replace(prefix, '');
        newKey = newKey.replace(/МПА\d*$/, '').trim();
        // Делаем первую букву заглавной
        const capitalizedKey = newKey.charAt(0).toUpperCase() + newKey.slice(1);
        transformed[capitalizedKey] = obj[key];
      }
    }
    return transformed;
  }

  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
