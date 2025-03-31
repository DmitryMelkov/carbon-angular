import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subject, interval } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { VrData, VrTime } from '../../../common/types/vr-data';
import { VrService } from '../../../common/services/vr/vr.service';
import { GeneralTableComponent } from '../../../components/general-table/general-table.component';
import { ValueCheckService } from '../../../common/services/vr/value-check.service';
import {
  recommendedLevels,
  recommendedPressures,
  recommendedTemperatures,
  recommendedVacuums,
} from '../../../common/constans/vr-recomended-values';
import { fadeInAnimation } from '../../../common/animations/animations';
import { ModeVrService } from '../../../common/services/vr/mode-vr.service';
import { NotisVrService } from '../../../common/services/vr/notis-vr.service';
import { NotisData } from '../../../common/types/notis-data';
import { VrTimeService } from '../../../common/services/vr/vr-time.service';

@Component({
  selector: 'app-vr',
  standalone: true,
  imports: [
    HeaderCurrentParamsComponent,
    LoaderComponent,
    CommonModule,
    GeneralTableComponent,
  ],
  templateUrl: './vr.component.html',
  styleUrls: ['./vr.component.scss'],
  animations: [fadeInAnimation],
})
export class VrComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  data: VrData | null = null;
  timeData: VrTime | null = null;
  notisData: NotisData | null = null;
  isLoading: boolean = true;
  mode: string | null = null;
  highlightedKeys: Set<string> = new Set();
  sortedTemperatures: { [key: string]: number } = {};
  sortedVacuums: { [key: string]: string } = {};
  private destroy$ = new Subject<void>();

  recommendedTemperatures = recommendedTemperatures;
  recommendedLevels = recommendedLevels;
  recommendedPressures = recommendedPressures;
  recommendedVacuums = recommendedVacuums;

  constructor(
    private vrService: VrService,
    private route: ActivatedRoute,
    private valueCheckService: ValueCheckService,
    private modeVrService: ModeVrService,
    private notisVrService: NotisVrService,
    private vrTimeService: VrTimeService
  ) {}

  ngOnInit(): void {
    // Если id не передан через Input, пытаемся получить его из маршрута
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }
    if (!this.id) {
      console.error('ID VR не указан!');
      return;
    }

    // Однократная первичная загрузка данных
    this.loadData();

    // Периодическая загрузка данных: сразу и затем каждые 10 секунд
    interval(10000)
      .pipe(startWith(0), takeUntil(this.destroy$))
      .subscribe(() => {
        forkJoin({
          vrData: this.vrService.getVrData(this.id),
          timeData: this.vrTimeService.getVrTime(this.id),
          notisData: this.notisVrService.getNotisData(this.id),
        }).subscribe({
          next: (response) => {
            this.data = response.vrData;
            this.timeData = response.timeData;
            this.notisData = response.notisData;
            this.updateMode();
            this.checkValues();
            this.sortTemperatures();
            this.sortVacuums();
          },
          error: (error) => {
            console.error('Ошибка при загрузке данных:', error);
          },
        });
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;
    forkJoin({
      vrData: this.vrService.getVrData(this.id),
      notisData: this.notisVrService.getNotisData(this.id),
      timeData: this.vrTimeService.getVrTime(this.id)
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.data = response.vrData;
          this.notisData = response.notisData;
          this.timeData = response.timeData;
          this.updateMode();
          this.checkValues();
          this.sortTemperatures();
          this.sortVacuums();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.isLoading = false;
        },
      });
  }

  private updateMode(): void {
    this.mode = this.modeVrService.determineMode(this.data);
    this.modeVrService.updateRecommendedTemperatures(
      this.mode,
      this.recommendedTemperatures
    );
  }

  getHighlightedKeys(): Set<string> {
    return this.mode === 'Печь не работает' ? new Set() : this.highlightedKeys;
  }

  private checkValues(): void {
    if (!this.data || this.mode === 'Печь не работает') return;

    // Очищаем предыдущие выделения
    this.highlightedKeys.clear();

    // Проверяем температуры
    for (const key in this.data.temperatures) {
      if (
        this.valueCheckService.isOutOfRange(
          key,
          this.data.temperatures[key],
          this.recommendedTemperatures
        )
      ) {
        this.highlightedKeys.add(key);
      }
    }

    // Проверяем уровни
    for (const key in this.data.levels) {
      if (
        this.valueCheckService.isOutOfRange(
          key,
          this.data.levels[key].value,
          this.recommendedLevels
        )
      ) {
        this.highlightedKeys.add(key);
      }
    }

    // Проверяем давления
    for (const key in this.data.pressures) {
      if (
        this.valueCheckService.isOutOfRange(
          key,
          this.data.pressures[key],
          this.recommendedPressures
        )
      ) {
        this.highlightedKeys.add(key);
      }
    }

    // Проверяем разрежения (вакуумы)
    for (const key in this.data.vacuums) {
      if (
        this.valueCheckService.isOutOfRange(
          key,
          this.data.vacuums[key],
          this.recommendedVacuums
        )
      ) {
        this.highlightedKeys.add(key);
      }
    }
  }

  private sortTemperatures(): void {
    if (!this.data || !this.data.temperatures) {
      return;
    }
    // Задаем нужный порядок ключей
    const order = [
      'В топке',
      'Камеры выгрузки',
      '1-СК',
      '2-СК',
      '3-СК',
      'Вверху камеры загрузки',
      'Внизу камеры загрузки',
      'На входе печи дожига',
      'На выходе печи дожига',
      'Дымовых газов котла',
      'Газов до скруббера',
      'Газов после скруббера',
      'Воды в ванне скруббера',
      'Гранул после холод-ка',
    ];

    const sorted: { [key: string]: number } = {};

    // Сначала добавляем ключи согласно заданному порядку
    order.forEach((key) => {
      if (this.data!.temperatures[key] !== undefined) {
        sorted[key] = this.data!.temperatures[key];
      }
    });

    // Затем добавляем оставшиеся ключи, если таковые имеются
    Object.keys(this.data.temperatures).forEach((key) => {
      if (!(key in sorted)) {
        sorted[key] = this.data!.temperatures[key];
      }
    });

    this.sortedTemperatures = sorted;
  }

  private sortVacuums(): void {
    if (!this.data || !this.data.vacuums) {
      return;
    }
    // Определите нужный порядок ключей для вакуумов
    const order = [
      'В топке печи',
      'Низ загрузочной камеры',
      'В котле утилизаторе',
    ];

    const sorted: { [key: string]: string } = {};

    // Сначала добавляем ключи согласно заданному порядку
    order.forEach((key) => {
      if (this.data!.vacuums[key] !== undefined) {
        sorted[key] = this.data!.vacuums[key];
      }
    });

    // Затем добавляем оставшиеся ключи, если они есть
    Object.keys(this.data.vacuums).forEach((key) => {
      if (!(key in sorted)) {
        sorted[key] = this.data!.vacuums[key];
      }
    });

    this.sortedVacuums = sorted;
  }
}
