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
import { Subscription, switchMap, interval, Subject, of } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MnemoKranComponent } from '../../../components/mnemo-kran/mnemo-kran.component';
import { DocumentationModalComponent } from './documentation-modal/documentation-modal.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { SushilkiService } from '../../../common/services/sushilki/sushilka.service';

@Component({
  selector: 'app-sushilka-mnemo',
  imports: [
    CommonModule,
    HeaderCurrentParamsComponent,
    MatTooltipModule,
    MnemoKranComponent,
    MatDialogModule,
    ControlButtonComponent,
  ],
  standalone: true,
  templateUrl: './sushilka-mnemo.component.html',
  styleUrls: ['./sushilka-mnemo.component.scss'],
})
export class SushilkaMnemoComponent implements OnInit, OnDestroy {
  data: SushilkiData | null = null;
  @Input() id!: string;
  sushilkaNumber!: string; // Номер сушилки
  isLoading: boolean = true; // Управление прелоудером
  isTooltipsEnabled: boolean = true;
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
    // Если id не передан через @Input(), получаем его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') || '';
    }

    // Убедитесь, что id правильно передан
    if (!this.id) {
      console.error('ID сушилки не указан!');
      return;
    }

    this.sushilkaNumber = this.id.replace('sushilka', ''); // Извлекаем номер сушилки
    this.loadData(); // Загружаем данные
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.sushilkaNumber = this.id.replace('sushilka', ''); // Извлекаем номер сушилки
      this.loadData(); // Загружаем данные при изменении id
    }
  }

  //Загружает данные для текущей сушилки с периодическим обновлением.

  loadData(): void {
    // Первичная загрузка данных
    this.sushilkiService
      .getSushilkaData(this.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Ошибка первичной загрузки данных:', err);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.updateData(response);
        this.isLoading = false;
      });

    // Периодическая загрузка данных
    interval(10000)
      .pipe(
        switchMap(() => this.sushilkiService.getSushilkaData(this.id)),
        takeUntil(this.destroy$),
        catchError((err) => {
          console.error('Ошибка загрузки данных:', err);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.updateData(response);
        this.isLoading = false;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete(); // Завершаем поток
  }

  //Переключает режим всплывающих подсказок.
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


  //Открывает модальное окно с документацией.
  openDocumentation(): void {
    this.dialog.open(DocumentationModalComponent, {
      minWidth: '300px',
      maxWidth: '90vw',
      data: { content: 'Это тестовый контент для документации объекта.' },
    });
  }

  private updateData(response: SushilkiData | null): void {
    if (response) {
      this.data = response;
    } else {
      // Создаем объект по умолчанию, который соответствует типу SushilkiData
      const suffix = this.sushilkaNumber; // Получаем номер сушилки
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
        } as { [key: string]: number }, // Приводим к типу с динамическими ключами
        im: {
          'Индикация паротушения': false,
          'Индикация сбрасыватель': false,
        },
        lastUpdated: '—',
      } as SushilkiData; // Приводим объект к типу SushilkiData
    }
  }

  onLoadingComplete(): void {
    this.loadData(); // Загружаем данные после завершения загрузки
  }
}
