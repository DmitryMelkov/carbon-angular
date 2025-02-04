import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { SushilkiData } from '../../../common/types/sushilki-data';
import { Subject, interval, of } from 'rxjs';
import { takeUntil, catchError, switchMap, startWith, delay } from 'rxjs/operators';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MnemoKranComponent } from '../../../components/mnemo-kran/mnemo-kran.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { SushilkiService } from '../../../common/services/sushilki/sushilka.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { fadeInAnimation } from '../../../common/animations/animations';
import { SushilkiDocumentationModalComponent } from './sushilki-documentation-modal/sushilki-documentation-modal.component';

@Component({
  selector: 'app-sushilka-mnemo',
  standalone: true,
  imports: [
    CommonModule,
    HeaderCurrentParamsComponent,
    MatTooltipModule,
    MnemoKranComponent,
    MatDialogModule,
    ControlButtonComponent,
    LoaderComponent,
  ],
  templateUrl: './sushilka-mnemo.component.html',
  styleUrls: ['./sushilka-mnemo.component.scss'],
  animations: [fadeInAnimation],
})
export class SushilkaMnemoComponent implements OnInit, OnDestroy {
  data: SushilkiData | null = null;
  @Input() id!: string;
  sushilkaNumber!: string; // Номер сушилки
  isLoading: boolean = true; // Флаг прелоадера
  isTooltipsEnabled: boolean = true;
  isImageLoaded: boolean = false;
  private destroy$ = new Subject<void>(); // Поток для завершения подписок

  constructor(
    private sushilkiService: SushilkiService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  getDynamicKey(baseKey: string): string {
    return `${baseKey} №${this.sushilkaNumber}`;
  }

  ngOnInit(): void {
    // Если id не передан через @Input, пытаемся получить его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') || '';
    }

    if (!this.id) {
      console.error('ID сушилки не указан!');
      return;
    }

    // Извлекаем номер сушилки (удаляем префикс "sushilka")
    this.sushilkaNumber = this.id.replace('sushilka', '');
    this.loadData(); // Выполняем первичную загрузку данных
    this.startPeriodicDataLoading(); // Запускаем периодический опрос
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.sushilkaNumber = this.id.replace('sushilka', '');
      this.loadData(); // Перезагружаем данные при изменении id
    }
  }

  /**
   * Выполняет первичную загрузку данных с небольшим delay (если требуется имитация загрузки).
   */
  private loadData(): void {
    this.isLoading = true;
    this.sushilkiService
      .getSushilkaData(this.id)
      .pipe(
        delay(1000), // Задержка для демонстрации прелоадера (опционально)
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
   * Запускает периодическую загрузку данных каждые 10 секунд.
   */
  private startPeriodicDataLoading(): void {
    interval(10000)
      .pipe(
        startWith(0), // Выполнить запрос сразу при подписке
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

  ngOnDestroy(): void {
    // Отменяем все подписки при уничтожении компонента
    this.destroy$.next();
    this.destroy$.complete();
  }

  // Переключает режим всплывающих подсказок
  toggleTooltips(): void {
    this.isTooltipsEnabled = !this.isTooltipsEnabled;
  }

  // Подсказки для параметров
  kameraSmeshenia: string =
    'Прибор: Термопара (1000мм)\nДиапазон: -40...+1000°C\nГрадуировка: ХА (К)';
  topkaTemper: string =
    'Прибор: Термопара (1000мм)\nДиапазон: -40...+1000°C\nГрадуировка: ХА (К)';
  topkaDavl: string =
    'Прибор: ПД-1.ТН1\nДиапазон: -0,125...+0,125 кПа\nГрадуировка: 4-20 мА';
  vosduhNaRazbavl: string =
    'Прибор: ПД-1.Н1\nДиапазон: 0...5 кПа\nГрадуировка: 4-20 мА';
  kameraVigruzki: string =
    'Прибор: ПД-1Т\nДиапазон: 0...-200 Па\nГрадуировка: 4-20 мА';
  temperUhodyashihGazov: string =
    'Прибор: Термопара (320мм)\nДиапазон: -40...+1000°C\nГрадуировка: ХА (К)';

  // Открывает модальное окно с документацией
  openDocumentation(): void {
    this.dialog.open(SushilkiDocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  /**
   * Обновляет данные компонента.
   * Если ответ не получен, создаётся объект с данными по умолчанию.
   */
  private updateData(response: SushilkiData | null): void {
    if (response) {
      this.data = response;
    } else {
      // Если данных нет, создаем объект по умолчанию
      const suffix = this.sushilkaNumber;
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
  }

  onImageLoad(): void {
    this.isImageLoaded = true;
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Прячем прелоадер после загрузки данных
  }
}
