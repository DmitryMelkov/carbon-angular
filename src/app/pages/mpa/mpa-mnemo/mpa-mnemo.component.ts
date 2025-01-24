import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { MpaData } from '../../../common/types/mpa-data';
import { Subscription, switchMap, interval, Subject, of } from 'rxjs';
import { takeUntil, catchError, delay } from 'rxjs/operators'; // Добавляем delay
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { MpaService } from '../../../common/services/mpa/mpa.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { MpaTable } from './table/table.component';
import { fadeInAnimation } from '../../../common/animations/animations';
import { DataLoadingService } from '../../../common/services/data-loading.service';

@Component({
  selector: 'app-mpa-mnemo',
  imports: [
    CommonModule,
    HeaderCurrentParamsComponent,
    MatTooltipModule,
    MatDialogModule,
    ControlButtonComponent,
    LoaderComponent,
    MpaTable,
  ],
  standalone: true,
  templateUrl: './mpa-mnemo.component.html',
  styleUrls: ['./mpa-mnemo.component.scss'],
  animations: [fadeInAnimation],
})
export class MpaMnemoComponent implements OnInit, OnDestroy {
  data: MpaData | null = null;
  @Input() id!: string;
  mpaNumber!: string; // Номер мпа
  isLoading: boolean = true; // Управление прелоудером
  isTooltipsEnabled: boolean = true;
  private destroy$ = new Subject<void>(); // Поток для завершения подписок
  isImageLoaded: boolean = false;

  constructor(
    private mpaService: MpaService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private dataLoadingService: DataLoadingService
  ) {}

  getDynamicKey(baseKey: string): string {
    return `${baseKey} МПА${this.mpaNumber}`;
  }

  ngOnInit(): void {
    // Если id не передан через @Input(), получаем его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') || '';
    }

    // Убедитесь, что id правильно передан
    if (!this.id) {
      console.error('ID МПА не указан!');
      return;
    }

    this.mpaNumber = this.id.replace('mpa', ''); // Извлекаем номер мпа
    this.loadData(); // Загружаем данные
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.mpaNumber = this.id.replace('mpa', ''); // Извлекаем номер мпа
      this.loadData(); // Загружаем данные при изменении id
    }
  }

  private loadData(): void {
    this.isLoading = true;

    // Первичная загрузка данных
    this.mpaService
      .getMpaData(this.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Ошибка первичной загрузки данных:', err);
          this.isLoading = false;
          return of(null);
        }),
        delay(1000) // Добавляем задержку в 1 секунду
      )
      .subscribe((response) => {
        this.updateData(response);
        this.isLoading = false;
      });

    // Периодическая загрузка данных через DataLoadingService
    this.dataLoadingService.startPeriodicLoading(
      () => this.mpaService.getMpaData(this.id), // Функция для загрузки данных
      10000, // Интервал 10 секунд
      (response) => {
        this.updateData(response);
      }
    );
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading(); // Останавливаем периодическую загрузку
    this.destroy$.next();
    this.destroy$.complete(); // Завершаем поток
  }

  //Переключает режим всплывающих подсказок.
  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  // Подсказки для параметров
  tooltipTemper: string =
    'Прибор: Термопара (1000мм)\nДиапазон: 0...+1300°C\nГрадуировка: ХА (К)';

  tooltipDavlenie: string = 'Прибор: ПРОМА-ИДМ\nТоковый выход: 4-20 мА\n';

  tooltipDB: string =
    'Прибор: ПД-1.Т1\nДиапазон: 0...-250 Па\nТоковый выход: 4-20 мА';

  //Открывает модальное окно с документацией.
  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  private updateData(response: MpaData | null): void {
    if (response) {
      // Используем данные как есть, без преобразования ключей
      this.data = {
        temperatures: response.temperatures,
        pressures: response.pressures,
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

      // Используем данные по умолчанию как есть
      this.data = {
        temperatures: defaultTemperatures,
        pressures: defaultPressures,
        lastUpdated: '—',
      } as MpaData;
    }
  }

  toNumber(value: any): number {
    return Number(value) || 0;
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
