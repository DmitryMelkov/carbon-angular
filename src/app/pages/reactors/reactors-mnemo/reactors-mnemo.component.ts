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
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-reactors-mnemo',
  standalone: true,
  imports: [
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
    ControlButtonComponent,
    MatDialogModule,
    MatTooltipModule,
  ],
  templateUrl: './reactors-mnemo.component.html',
  styleUrls: ['./reactors-mnemo.component.scss'],
  animations: [fadeInAnimation],
})
export class ReactorMnemoComponent implements OnInit, OnDestroy {
  @Input() contentType!: string; // Тип контента

  data: ReactorData | null = null;
  isLoading: boolean = true; // Флаг прелоудера
  isTooltipsEnabled: boolean = true;
  isDataLoaded: boolean = false; // Флаг для анимации появления данных
  isImageLoaded: boolean = false;
  private destroy$ = new Subject<void>(); // Поток для завершения подписок

  constructor(
    private reactorService: ReactorService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    // Первичная загрузка данных
    this.loadData();
    // Запуск периодического опроса данных каждые 10 секунд
    this.startPeriodicDataLoading();
  }

  ngOnDestroy(): void {
    // Завершаем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Первичная загрузка данных с небольшой задержкой (если требуется показать прелоадер).
   */
  private loadData(): void {
    this.isLoading = true;
    this.reactorService.getReactorK296Data()
      .pipe(
        // Опционально: задержка для демонстрации прелоадера
        delay(1000),
        catchError((error) => {
          console.error('Ошибка при первичной загрузке данных:', error);
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
        startWith(0),
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
   * Если ответа нет, создаётся объект по умолчанию.
   */
  private updateData(response: ReactorData | null): void {
    if (response) {
      this.data = response;
    } else {
      // Создаем объект по умолчанию, если данные не получены
      this.data = {
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
      } as ReactorData;
    }
    this.isDataLoaded = true;
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  /**
   * Отключает прелоадер после завершения загрузки данных.
   */
  onLoadingComplete(): void {
    this.isLoading = false;
  }

  // Открытие модального окна с документацией
  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  // Переключение режима всплывающих подсказок
  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  // Пример текстовых подсказок для параметров
  tooltipTemper: string =
    'Прибор: ТСМ-50М\nДиапазон: -50...+180°C\nТоковый выход: 4-20 мА';

  tooltipUroven: string =
    'Прибор: Метран-55-ЛМК331\nДиапазон: 0...25 кПа\nТоковый выход: 4-20 мА';
}
