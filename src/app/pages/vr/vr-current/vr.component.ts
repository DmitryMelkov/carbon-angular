import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { of, Subject } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
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
import { DataLoadingService } from '../../../common/services/data-loading.service';

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
})
export class VrComponent implements OnInit, OnDestroy {
  @Input() id!: string;
  data: VrData | null = null;
  isLoading: boolean = true;
  mode: string | null = null; // Режим работы
  highlightedKeys: Set<string> = new Set(); // Ключи для выделения
  private destroy$ = new Subject<void>();

  // Рекомендуемые значения
  recommendedTemperatures = recommendedTemperatures;
  recommendedLevels = recommendedLevels;
  recommendedPressures = recommendedPressures;
  recommendedVacuums = recommendedVacuums;

  constructor(
    private vrService: VrService,
    private route: ActivatedRoute,
    private valueCheckService: ValueCheckService,
    private dataLoadingService: DataLoadingService
  ) {}

  ngOnInit(): void {
    if (!this.id) {
      this.id = this.route.snapshot.paramMap.get('id') ?? '';
    }

    if (!this.id) {
      console.error('ID VR не указан!');
      return;
    }

    this.loadData();
    this.startPeriodicDataLoading();
  }

  ngOnDestroy(): void {
    this.dataLoadingService.stopPeriodicLoading();
    this.destroy$.next();
    this.destroy$.complete(); // Завершаем поток
  }

  private loadData(): void {
    this.isLoading = true;
    this.vrService
      .getVrData(this.id)
      .pipe(
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.isLoading = false;
          return of(null);
        })
      )
      .subscribe((response) => {
        this.data = response;
        this.updateMode(); // Обновляем режим работы
        this.checkValues(); // Проверяем значения
        this.isLoading = false;
      });
  }

  private startPeriodicDataLoading(): void {
    this.dataLoadingService.startPeriodicLoading(
      () => this.vrService.getVrData(this.id), // Функция для загрузки данных VR
      10000,
      (response) => {
        this.data = response;
        this.updateMode();
        this.checkValues();
      }
    );
  }

  private updateMode(): void {
    if (!this.data) {
      this.mode = null;
      return;
    }

    const temper1Value = this.data.temperatures['1-СК'];

    if (temper1Value < 550 && temper1Value > 50) {
      this.mode = 'Выход на режим';
    } else if (temper1Value > 550) {
      this.mode = 'Установившийся режим';
    } else {
      this.mode = 'Печь не работает';
    }

    // Обновляем рекомендуемые значения для 3-СК в зависимости от режима
    if (this.mode === 'Установившийся режим') {
      this.recommendedTemperatures['3-СК'] = 'не более 400 °C';
    } else if (this.mode === 'Выход на режим') {
      this.recommendedTemperatures['3-СК'] = 'не более 750 °C';
    }
  }

  private checkValues(): void {
    if (!this.data) return;

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

    // Проверяем разрежения
    for (const key in this.data.vacuums) {
      const value = this.data.vacuums[key];
      const isOut = this.valueCheckService.isOutOfRange(
        key,
        value,
        this.recommendedVacuums
      );
      if (isOut) {
        this.highlightedKeys.add(key);
      }
    }
  }
}
