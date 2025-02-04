import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { forkJoin, Subject, interval } from 'rxjs';
import { takeUntil, startWith } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { VrData } from '../../../common/types/vr-data';
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
  notisData: NotisData | null = null;
  isLoading: boolean = true;
  mode: string | null = null;
  highlightedKeys: Set<string> = new Set();
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
    private notisVrService: NotisVrService
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

    // Однократная начальная загрузка
    this.loadData();

    // Периодическая загрузка данных: выполняется сразу и затем каждые 10 секунд.
    interval(10000)
      .pipe(
        startWith(0),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        forkJoin({
          vrData: this.vrService.getVrData(this.id),
          notisData: this.notisVrService.getNotisData(this.id),
        }).subscribe({
          next: (response) => {
            this.data = response.vrData;
            this.notisData = response.notisData;
            this.updateMode();
            this.checkValues();
          },
          error: (error) => {
            console.error('Ошибка при загрузке данных:', error);
          }
        });
      });
  }

  ngOnDestroy(): void {
    // Завершаем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData(): void {
    this.isLoading = true;
    forkJoin({
      vrData: this.vrService.getVrData(this.id),
      notisData: this.notisVrService.getNotisData(this.id),
    })
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          this.data = response.vrData;
          this.notisData = response.notisData;
          this.updateMode();
          this.checkValues();
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

    // Очищаем предыдущие значения
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
}
