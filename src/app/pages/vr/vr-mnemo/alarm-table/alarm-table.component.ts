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

interface AlarmData {
  key: string;
  value: any;
  unit: string;
  // Свойство animationDelay можно удалить, т.к. оно больше не используется
}

@Component({
  selector: 'app-alarm-table',
  standalone: true,
  imports: [CommonModule, MatIconModule],
  templateUrl: './alarm-table.component.html',
  styleUrls: ['./alarm-table.component.scss'],
})
export class AlarmTableComponent implements OnInit {
  alarms$: Observable<AlarmData[]>;

  constructor(
    private alarmService: AlarmService,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {
    // Просто пробрасываем данные, без добавления динамической задержки
    this.alarms$ = this.alarmService.alarms$;
  }

  ngOnInit(): void {
    // Можно убрать явный вызов detectChanges(), если async pipe справляется с обновлениями
    this.alarms$.subscribe(() => {
      this.cdr.detectChanges();
    });
  }

  trackByAlarmKey(index: number, alarm: AlarmData): string {
    return alarm.key;
  }

  openAlarmModal(alarm: AlarmData): void {
    const configEntry: AlarmModalConfigs | undefined = ALARM_MODAL_DATA[alarm.key];

    if (!configEntry) {
      return;
    }

    let modalData: AlarmModalData | null = null;

    if (Array.isArray(configEntry)) {
      modalData = configEntry.find(config =>
        config.condition ? config.condition(alarm.value) : true
      )?.data || null;
    } else {
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

  hasAlarmConfig(alarm: AlarmData): boolean {
    const configEntry: AlarmModalConfigs | undefined = ALARM_MODAL_DATA[alarm.key];
    if (!configEntry) {
      return false;
    }
    if (Array.isArray(configEntry)) {
      return configEntry.some(config => (config.condition ? config.condition(alarm.value) : true));
    }
    return true;
  }
}
