import { Component, OnInit, OnDestroy } from '@angular/core';
import { EnergyResourcesService } from '../../../common/services/energy-resources/energy-resources.service';
import { EnergyResourceData } from '../../../common/types/energy-resources-data';
import { CommonModule } from '@angular/common';
import { HeaderCurrentParamsComponent } from '../../../components/header-current-params/header-current-params.component';
import { Subject, interval, of } from 'rxjs';
import { takeUntil, catchError, startWith, switchMap, delay } from 'rxjs/operators';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { fadeInAnimation } from '../../../common/animations/animations';

@Component({
  selector: 'app-energy-resources-current',
  standalone: true,
  imports: [CommonModule, HeaderCurrentParamsComponent, LoaderComponent],
  templateUrl: './energy-resources-current.component.html',
  styleUrls: ['./energy-resources-current.component.scss'],
  animations: [fadeInAnimation],
})
export class EnergyResourcesCurrentComponent implements OnInit, OnDestroy {
  energyResources: Record<string, EnergyResourceData> = {};
  isLoading: boolean = true; // Флаг загрузки
  isDataLoaded: boolean = false; // Управление анимацией
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

  ngOnInit(): void {
    // Первичная загрузка данных
    this.loadData();

    // Периодический опрос данных каждые 10 секунд (с немедленным запуском)
    interval(10000)
      .pipe(
        startWith(0),
        switchMap(() =>
          this.energyResourcesService.getEnergyResourceData().pipe(
            // При ошибке выводим сообщение и возвращаем пустой объект, чтобы поток не прерывался
            catchError((error) => {
              console.error('Ошибка при периодической загрузке данных:', error);
              return of({});
            })
          )
        ),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.energyResources = data;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Первичная загрузка данных с небольшой задержкой (если требуется имитация загрузки).
   */
  private loadData(): void {
    this.isLoading = true;
    this.energyResourcesService.getEnergyResourceData()
      .pipe(
        // Если нужно добавить задержку для отображения прелоадера, можно использовать delay
        delay(1000),
        catchError((error) => {
          console.error('Ошибка при загрузке данных:', error);
          return of({});
        }),
        takeUntil(this.destroy$)
      )
      .subscribe((data) => {
        this.energyResources = data;
        this.isLoading = false;
        this.isDataLoaded = true;

        // Фильтруем данные на МПА и остальные по порядку ключей
        this.mpaKeys = this.orderedKeys.filter(
          (item) => item.key.startsWith('de') || item.key.startsWith('dd97')
        );
        this.otherKeys = this.orderedKeys.filter(
          (item) => !this.mpaKeys.includes(item)
        );
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
        return key;
    }
  }

  onLoadingComplete(): void {
    this.isLoading = false;
  }
}
