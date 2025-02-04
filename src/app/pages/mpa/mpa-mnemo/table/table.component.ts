import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnergyResourcesService } from '../../../../common/services/energy-resources/energy-resources.service';
import { EnergyResourceData } from '../../../../common/types/energy-resources-data';
import { CommonModule } from '@angular/common';
import { interval, Subject, of } from 'rxjs';
import { takeUntil, catchError, switchMap, delay, startWith } from 'rxjs/operators';
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { LoaderComponent } from '../../../../components/loader/loader.component';

@Component({
  selector: 'app-table-mpa',
  standalone: true,
  imports: [CommonModule, LoaderComponent],
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      state('*', style({ opacity: 1 })),
      transition('void => *', animate('0.3s ease-in-out')),
    ]),
  ],
})
export class MpaTable implements OnInit, OnDestroy {
  isLoading: boolean = true; // Управление прелоудером
  energyResources: Record<string, EnergyResourceData> = {};
  private destroy$ = new Subject<void>();

  orderedKeys: { key: string; typeSize: string }[] = [
    { key: 'de093', typeSize: 'Dy 80' },
    { key: 'dd972', typeSize: 'Dy 80' },
    { key: 'dd973', typeSize: 'Dy 80' },
  ];

  mpaKeys: { key: string; typeSize: string }[] = [];

  constructor(private energyResourcesService: EnergyResourcesService) {}

  ngOnInit() {
    // Однократная начальная загрузка данных
    this.loadData();

    // Периодический опрос данных каждые 10 секунд, начиная сразу
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.energyResourcesService.getEnergyResourceData().pipe(
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных:', error);
              return of({}); // При ошибке возвращаем пустой объект
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.energyResources = data;
      });
  }

  ngOnDestroy() {
    // Завершаем все подписки
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadData() {
    this.energyResourcesService
      .getEnergyResourceData()
      .pipe(
        // Добавляем задержку для имитации загрузки (при необходимости)
        delay(1000),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          return of({}); // При ошибке возвращаем пустой объект
        })
      )
      .subscribe((data) => {
        this.energyResources = data;
        this.mpaKeys = this.orderedKeys.filter(
          (item) => item.key.startsWith('de') || item.key.startsWith('dd97')
        );
        this.isLoading = false;
      });
  }

  getKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }

  getDeviceName(key: string): string {
    switch (key) {
      case 'de093':
        return 'МПА-2';
      case 'dd972':
        return 'МПА-3';
      case 'dd973':
        return 'МПА-4';
      default:
        return key;
    }
  }

  getDataValue(key: string, dataKey: string): number | string {
    const resource = this.energyResources[key];
    if (resource && resource.data) {
      const fullKey = `${dataKey} ${resource.device}`;
      if (resource.data[fullKey] !== undefined) {
        return resource.data[fullKey];
      }
    }
    return 'Н/Д'; // Возвращаем "Н/Д", если данные отсутствуют
  }
}
