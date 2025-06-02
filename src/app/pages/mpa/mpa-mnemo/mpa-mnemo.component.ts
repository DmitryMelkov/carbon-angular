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
import { Subject, interval, forkJoin } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { MpaService } from '../../../common/services/mpa/mpa.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { MpaTable } from './table/table.component';
import { fadeInAnimation } from '../../../common/animations/animations';
import {LabCurrentComponent} from '../../../components/laboratory/lab-current/lab-current.component';
import {LabModalComponent} from '../../../components/laboratory/lab-modal/lab-modal.component';

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
    LabCurrentComponent,
  ],
  standalone: true,
  templateUrl: './mpa-mnemo.component.html',
  styleUrls: ['./mpa-mnemo.component.scss'],
  animations: [fadeInAnimation],
})
export class MpaMnemoComponent implements OnInit, OnDestroy {
  data: MpaData | null = null;
  @Input() id!: string;
  mpaNumber!: string; // Номер МПА
  isLoading: boolean = true; // Управление прелоудером
  isTooltipsEnabled: boolean = true;
  isImageLoaded: boolean = false;

  // Subject для отмены всех подписок при уничтожении компонента
  private destroy$ = new Subject<void>();

  constructor(
    private mpaService: MpaService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  getDynamicKey(baseKey: string): string {
    return `${baseKey} МПА${this.mpaNumber}`;
  }

  ngOnInit(): void {
    // Если id не передан через @Input(), получаем его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') || '';
    }

    // Проверяем, что id указан
    if (!this.id) {
      console.error('ID МПА не указан!');
      return;
    }

    this.mpaNumber = this.id.replace('mpa', ''); // Извлекаем номер МПА
    this.loadData(); // Загружаем данные один раз

    // Запускаем периодический опрос каждые 10 секунд, начиная сразу
    interval(10000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.mpaService.getMpaData(this.id).subscribe({
          next: (response) => {
            this.updateData(response);
          },
          error: (error) => {
            console.error('Ошибка при периодической загрузке данных:', error);
          }
        });
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.mpaNumber = this.id.replace('mpa', ''); // Извлекаем номер МПА
      this.loadData(); // Загружаем данные при изменении id
    }
  }

  private loadData(): void {
    this.isLoading = true;
    forkJoin({
      mpaData: this.mpaService.getMpaData(this.id),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.updateData(response.mpaData);
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка первичной загрузки данных:', error);
          this.isLoading = false;
        },
      });
  }

  ngOnDestroy(): void {
    // Завершаем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Переключает режим всплывающих подсказок
  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  // Подсказки для параметров
  tooltipTemper: string =
    'Прибор: Термопара (1000мм)\nДиапазон: 0...+1300°C\nГрадуировка: ХА (К)';
  tooltipDavlenie: string = 'Прибор: ПРОМА-ИДМ\nТоковый выход: 4-20 мА\n';
  tooltipDB: string =
    'Прибор: ПД-1.Т1\nДиапазон: 0...-250 Па\nТоковый выход: 4-20 мА';

  // Открывает модальное окно с документацией
  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  private updateData(response: MpaData | null): void {
    if (response) {
      // Используем полученные данные как есть
      this.data = {
        temperatures: response.temperatures,
        pressures: response.pressures,
        lastUpdated: response.lastUpdated,
      };
    } else {
      // Если данных нет, создаём объект по умолчанию
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

  openLab(): void {
    this.dialog.open(LabModalComponent, {
      minWidth: '600px',
      maxWidth: '90vw',
      maxHeight: '80vh',
      data: {
        content: 'Это тестовый контент для документации объекта.',
        vrId: this.id,
      },
    });
  }
}
