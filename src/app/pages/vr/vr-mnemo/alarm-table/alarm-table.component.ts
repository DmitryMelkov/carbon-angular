import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlarmService } from '../../../../common/services/vr/alarm.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  AlarmModalComponent,
  AlarmModalData,
} from '../alarm-modal/alarm-modal.component';
import { ALARM_MODAL_DATA, AlarmModalConfigs } from '../alarm-modal/alarm-modal.config';
import { MatIconModule } from '@angular/material/icon';

// Интерфейс с дополнительным свойством для задержки анимации
interface AlarmData {
  key: string;
  value: any;
  unit: string;
  animationDelay: string;
}

@Component({
  selector: 'app-alarm-table',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './alarm-table.component.html',
  styleUrls: ['./alarm-table.component.scss'],
})
export class AlarmTableComponent implements OnInit {
  // Переопределяем тип элементов, добавляя поле animationDelay
  alarms$: Observable<AlarmData[]>;

  // Фиксируем время старта анимации
  private animationStartTime = Date.now();
  // Задаём длительность анимации, например 1000 мс
  private blinkAnimationDuration = 1000;

  constructor(
    private alarmService: AlarmService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    // Каждый раз, когда поступают данные, вычисляем для каждого элемента задержку анимации
    this.alarms$ = this.alarmService.alarms$.pipe(
      map(alarms =>
        alarms.map(alarm => ({
          ...alarm,
          animationDelay: `${-((Date.now() - this.animationStartTime) % this.blinkAnimationDuration)}ms`
        }))
      )
    );
  }

  ngOnInit(): void {
    // Если требуется триггерить обновление отображения при изменении alarms
    this.alarms$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  openAlarmModal(alarm: AlarmData): void {
    const configEntry: AlarmModalConfigs | undefined = ALARM_MODAL_DATA[alarm.key];

    if (!configEntry) {
      // Если для данного alarm'а нет конфигурации, выходим
      return;
    }

    let modalData: AlarmModalData | null = null;

    if (Array.isArray(configEntry)) {
      // Если вариантов несколько, выбираем тот, условие которого возвращает true
      modalData = configEntry.find(config =>
        config.condition ? config.condition(alarm.value) : true
      )?.data || null;
    } else {
      // Если задан один вариант, используем его
      modalData = configEntry.data;
    }

    if (modalData) {
      this.dialog.open(AlarmModalComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        data: modalData,
      });
    }
  }

  /**
   * Проверяет, есть ли в конфигурации модальное окно для данного alarm-а.
   */
  hasAlarmConfig(alarm: AlarmData): boolean {
    const configEntry: AlarmModalConfigs | undefined = ALARM_MODAL_DATA[alarm.key];
    if (!configEntry) {
      return false;
    }
    if (Array.isArray(configEntry)) {
      // Если вариантов несколько, проверяем, что хотя бы один удовлетворяет условию
      return configEntry.some(config => (config.condition ? config.condition(alarm.value) : true));
    }
    return true;
  }
}
