import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlarmService } from '../../../../common/services/vr/alarm.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  AlarmModalComponent,
  AlarmModalData,
} from '../alarm-modal/alarm-modal.component';
import { ALARM_MODAL_DATA, AlarmModalConfigs } from '../alarm-modal/alarm-modal.config';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-alarm-table',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './alarm-table.component.html',
  styleUrls: ['./alarm-table.component.scss'],
})
export class AlarmTableComponent implements OnInit {
  alarms$: Observable<{ key: string; value: any; unit: string }[]>;

  constructor(
    private alarmService: AlarmService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    this.alarms$ = this.alarmService.alarms$;
  }

  private animationStartTime = Date.now();
  public blinkAnimationDuration = 0;

  getAnimationDelay(): string {
    const now = Date.now();
    const elapsed = now - this.animationStartTime;
    const delay = -(elapsed % this.blinkAnimationDuration);
    return `${delay}ms`;
  }

  ngOnInit(): void {
    this.alarms$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  openAlarmModal(alarm: { key: string; value: any; unit: string }): void {
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
  hasAlarmConfig(alarm: { key: string; value: any; unit: string }): boolean {
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
