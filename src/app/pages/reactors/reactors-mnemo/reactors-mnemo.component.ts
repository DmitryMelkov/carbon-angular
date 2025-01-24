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
import { MatTooltipModule } from '@angular/material/tooltip';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';

@Component({
  selector: 'app-reactors-mnemo',
  standalone: true,
  imports: [HeaderCurrentParamsComponent, LoaderComponent, CommonModule, ControlButtonComponent, MatDialogModule, MatTooltipModule],
  templateUrl: './reactors-mnemo.component.html',
  styleUrls: ['./reactors-mnemo.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })), // Начальное состояние
      state('*', style({ opacity: 1 })), // Конечное состояние
      transition('void => *', animate('0.3s ease-in-out')), // Анимация появления
    ]),
  ],
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
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadData();
    this.startPeriodicDataLoading();
  }

  ngOnDestroy(): void {
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
    interval(10000)
      .pipe(
        switchMap(() => this.reactorService.getReactorK296Data()),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при получении данных:', error);
          return of(null);
        })
      )
      .subscribe((response) => {
        this.updateData(response);
      });
  }

  //Переключает режим всплывающих подсказок.
  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  // Подсказки для параметров
  tooltipTemper: string =
    'Прибор: ТСМ-50М\nДиапазон: -50...+180°C\nТоковый выход: 4-20 мА';

  tooltipUroven: string = 'Прибор: Метран-55-ЛМК331\nДиапазон: 0...25 кПа\nТоковый выход: 4-20 мА\n';

  //Открывает модальное окно с документацией.
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
