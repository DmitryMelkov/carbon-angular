import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject} from 'rxjs';
import { MpaData } from '../../../common/types/mpa-data';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { MpaService } from '../../../common/services/mpa/mpa.service';
import { GeneralTableComponent } from '../../../components/general-table/general-table.component';
import { fadeInAnimation } from '../../../common/animations/animations';
import { DataLoadingService } from '../../../common/services/data-loading.service';

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
  @Input() id!: string; // ID Мпа
  @Input() contentType!: string; // Тип контента

  data: MpaData | null = null;
  isLoading: boolean = true; // Управление прелоудером
  isDataLoaded: boolean = false; // Управление анимацией
  private destroy$ = new Subject<void>(); // Поток для завершения подписок

  constructor(
    private mpaService: MpaService,
    private route: ActivatedRoute,
    private dataLoadingService: DataLoadingService // Добавляем DataLoadingService
  ) {}

  ngOnInit(): void {
    // Если ID не передан через route, используем входное свойство
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }

    if (!this.id) {
      console.error('ID МПА не указан!');
      return;
    }

    this.loadData();
    this.startPeriodicDataLoading();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Проверяем, изменился ли id или contentType
    if (changes['id'] || changes['contentType']) {
      this.loadData(); // Загружаем данные при изменении id или contentType
    }
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading(); // Останавливаем периодическую загрузку
    this.destroy$.next();
    this.destroy$.complete(); // Завершаем поток
  }

  private loadData(): void {
    this.isLoading = true;
    this.dataLoadingService.loadData<MpaData>(
      () => this.mpaService.getMpaData(this.id), // Функция для загрузки данных
      (response) => {
        this.updateData(response);
        this.onLoadingComplete(); // Вызываем, когда данные загружены
      },
      (error) => {
        console.error('Ошибка при первичной загрузке данных:', error);
        this.isLoading = false;
      }
    );
  }

  private startPeriodicDataLoading(): void {
    this.dataLoadingService.startPeriodicLoading<MpaData>(
      () => this.mpaService.getMpaData(this.id), // Функция для загрузки данных
      10000, // Интервал 10 секунд
      (response) => {
        this.updateData(response);
      }
    );
  }

  private updateData(response: MpaData | null): void {
    if (response) {
      // Преобразуем ключи для temperatures и pressures
      const transformedTemperatures = this.transformKeys(
        response.temperatures,
        'Температура '
      );
      const transformedPressures = this.transformKeys(
        response.pressures,
        'Давление '
      );

      // Обновляем данные с новыми ключами
      this.data = {
        temperatures: transformedTemperatures,
        pressures: transformedPressures,
        lastUpdated: response.lastUpdated,
      };
    } else {
      // Создаем объект по умолчанию
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
        [`Давление низ ближний левый МПА${suffix}`]: '—',
        [`Давление низ ближний правый МПА${suffix}`]: '—',
        [`Давление середина ближняя левый МПА${suffix}`]: '—',
        [`Давление середина ближняя правый МПА${suffix}`]: '—',
        [`Давление середина дальняя левый МПА${suffix}`]: '—',
        [`Давление середина дальняя правый МПА${suffix}`]: '—',
        [`Давление верх дальний левый МПА${suffix}`]: '—',
        [`Давление верх дальний правый МПА${suffix}`]: '—',
      };

      // Преобразуем ключи для температур и давлений
      const transformedTemperatures = this.transformKeys(
        defaultTemperatures,
        'Температура '
      );
      const transformedPressures = this.transformKeys(
        defaultPressures,
        'Давление '
      );

      this.data = {
        temperatures: transformedTemperatures,
        pressures: transformedPressures,
        lastUpdated: '—',
      } as MpaData;
    }
    this.isDataLoaded = true; // Данные загружены, включаем анимацию
  }

  private transformKeys(
    obj: Record<string, any>,
    prefix: string
  ): Record<string, any> {
    const transformed: Record<string, any> = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        // Удаляем префикс
        let newKey = key.replace(prefix, '');

        // Удаляем "МПА" и суффикс (например, "МПА1")
        newKey = newKey.replace(/МПА\d*$/, '').trim();

        // Преобразуем первую букву оставшейся строки в верхний регистр
        const capitalizedKey = newKey.charAt(0).toUpperCase() + newKey.slice(1);

        // Сохраняем значение
        transformed[capitalizedKey] = obj[key];
      }
    }
    return transformed;
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
