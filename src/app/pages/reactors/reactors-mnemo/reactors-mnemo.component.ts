import {
  Component,
  OnInit,
  OnDestroy,
  Input,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject, of } from 'rxjs';
import { catchError, takeUntil, delay } from 'rxjs/operators'; // Добавляем delay
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
import { DataLoadingService } from '../../../common/services/data-loading.service';

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
  isLoading: boolean = true; // Управление прелоудером
  isTooltipsEnabled: boolean = true;
  isDataLoaded: boolean = false; // Управление анимацией
  private destroy$ = new Subject<void>(); // Поток для завершения подписок
  isImageLoaded: boolean = false;

  constructor(
    private reactorService: ReactorService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
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
    this.dataLoadingService.loadData<ReactorData>(
      () => this.reactorService.getReactorK296Data(),
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
    this.dataLoadingService.startPeriodicLoading<ReactorData>(
      () => this.reactorService.getReactorK296Data(), // Функция для загрузки данных
      10000, // Интервал 10 секунд
      (response) => {
        this.updateData(response);
      }
    );
  }

  // Переключает режим всплывающих подсказок
  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  // Подсказки для параметров
  tooltipTemper: string =
    'Прибор: ТСМ-50М\nДиапазон: -50...+180°C\nТоковый выход: 4-20 мА';

  tooltipUroven: string =
    'Прибор: Метран-55-ЛМК331\nДиапазон: 0...25 кПа\nТоковый выход: 4-20 мА\n';

  // Открывает модальное окно с документацией
  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  private updateData(response: ReactorData | null): void {
    if (response) {
      this.data = response;
    } else {
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
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
