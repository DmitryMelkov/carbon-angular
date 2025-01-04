import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnergyResourcesService } from '../../../common/services/energy-resources/energy-resources.service';
import { EnergyResourceData } from '../../../common/types/energy-resources-data';
import { CommonModule } from '@angular/common';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { interval, Subject, of } from 'rxjs';
import { takeUntil, catchError, switchMap } from 'rxjs/operators';
import { LoaderComponent } from '../../../components/loader/loader.component';

@Component({
  selector: 'app-energy-resources-current',
  standalone: true,
  imports: [CommonModule, HeaderCurrentParamsComponent, LoaderComponent],
  templateUrl: './energy-resources-current.component.html',
  styleUrls: ['./energy-resources-current.component.scss'],
})
export class EnergyResourcesCurrentComponent implements OnInit, OnDestroy {
  energyResources: Record<string, EnergyResourceData> = {};
  isLoading: boolean = true; // Флаг загрузки
  private destroy$ = new Subject<void>(); // Поток для завершения подписок

  // Определяем порядок ключей
  orderedKeys: { key: string; typeSize: string }[] = [
    { key: 'dd569', typeSize: 'Dy 150' },
    { key: 'dd576', typeSize: 'Dy 150' },
    { key: 'dd923', typeSize: 'Dy 100' },
    { key: 'dd924', typeSize: 'Dy 100' },
    { key: 'de093', typeSize: 'Dy 80' },
    { key: 'dd972', typeSize: 'Dy 80' },
    { key: 'dd973', typeSize: 'Dy 80' },
  ];

  mpaKeys: { key: string; typeSize: string }[] = []; // Массив для МПА
  otherKeys: { key: string; typeSize: string }[] = []; // Массив для остальных

  constructor(private energyResourcesService: EnergyResourcesService) {}

  ngOnInit() {
    this.loadData(); // Загружаем данные при инициализации
    this.startPeriodicDataLoading(); // Запускаем периодическую загрузку данных
  }

  ngOnDestroy() {
    this.destroy$.next(); // Завершаем поток
    this.destroy$.complete(); // Завершаем подписки
  }

  private loadData() {
    this.isLoading = true; // Устанавливаем флаг загрузки
    this.energyResourcesService
      .getEnergyResourceData()
      .pipe(
        takeUntil(this.destroy$), // Завершаем подписку при уничтожении
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          this.isLoading = false; // Убираем флаг загрузки
          return of({}); // Возвращаем пустой объект в случае ошибки
        })
      )
      .subscribe((data) => {
        this.energyResources = data; // Сохраняем полученные данные
        this.isLoading = false; // Убираем флаг загрузки

        // Фильтруем данные на МПА и остальные
        this.mpaKeys = this.orderedKeys.filter(
          (item) => item.key.startsWith('de') || item.key.startsWith('dd97')
        );
        this.otherKeys = this.orderedKeys.filter(
          (item) => !this.mpaKeys.includes(item)
        );
      });
  }


  private startPeriodicDataLoading() {
    interval(10000) // Каждые 10 секунд
      .pipe(
        switchMap(() => this.energyResourcesService.getEnergyResourceData()),
        takeUntil(this.destroy$),
        catchError((error) => {
          console.error('Ошибка при периодической загрузке данных:', error);
          return of({}); // Возвращаем пустой объект в случае ошибки
        })
      )
      .subscribe((data) => {
        this.energyResources = data; // Обновляем данные
      });
  }

  getKeys(obj: Record<string, any>): string[] {
    return Object.keys(obj);
  }

  getDeviceName(key: string): string {
    switch (key) {
      case 'dd569':
        return 'УТВХ от к.265 магистраль';
      case 'dd576':
        return 'Carbon к. 10в1 общий коллектор';
      case 'dd923':
        return 'Котел утилизатор №1';
      case 'dd924':
        return 'Котел утилизатор №2';
      case 'de093':
        return 'МПА №2';
      case 'dd972':
        return 'МПА №3';
      case 'dd973':
        return 'МПА №4';
      default:
        return key; // Возвращаем оригинальный ключ, если нет замены
    }
  }

  onLoadingComplete(): void {
    this.isLoading = false; // Убираем прелоудер, когда загрузка завершена
  }
}
