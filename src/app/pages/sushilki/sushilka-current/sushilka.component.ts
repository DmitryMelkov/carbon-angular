import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  SimpleChanges,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, Subject, of } from 'rxjs';
import { switchMap, catchError, takeUntil } from 'rxjs/operators';
import { SushilkiData } from '../../../common/types/sushilki-data';
import { SushilkaTableComponent } from '../../../components/sushilka-table/sushilka-table.component';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { CommonModule } from '@angular/common';
import { SushilkiService } from '../../../common/services/sushilki/sushilka.service';

@Component({
  selector: 'app-sushilka',
  standalone: true,
  imports: [
    SushilkaTableComponent,
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
  ],
  templateUrl: './sushilka.component.html',
  styleUrls: ['./sushilka.component.scss'],
})
export class SushilkaComponent implements OnInit, OnDestroy {
  @Input() id!: string; // ID сушилки
  @Input() contentType!: string; // Тип контента

  data: SushilkiData | null = null;
  isLoading: boolean = true; // Управление прелоудером
  private destroy$ = new Subject<void>(); // Поток для завершения подписок

  constructor(
    private sushilkiService: SushilkiService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Если ID не передан через route, используем входное свойство
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }

    if (!this.id) {
      console.error('ID сушилки не указан!');
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
    this.destroy$.next();
    this.destroy$.complete(); // Завершаем поток
  }

  private loadData(): void {
    this.isLoading = true;
    this.sushilkiService
      .getSushilkaData(this.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при первичной загрузке данных:', error);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.updateData(response);
        this.onLoadingComplete(); // Вызываем, когда данные загружены
      });
  }

  private startPeriodicDataLoading(): void {
    interval(10000)
      .pipe(
        switchMap(() => this.sushilkiService.getSushilkaData(this.id)),
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

  private updateData(response: SushilkiData | null): void {
    if (response) {
      this.data = response;
    } else {
      // Создаем объект по умолчанию, который соответствует типу SushilkiData
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
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
