import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlarmService } from '../../../../common/services/vr/alarm.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {
  AlarmModalComponent,
  AlarmModalData,
} from '../alarm-modal/alarm-modal.component';
import { ALARM_MODAL_DATA } from '../alarm-modal/alarm-modal.config';

@Component({
  selector: 'app-alarm-table',
  standalone: true,
  imports: [CommonModule],
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
    if (alarm.key === 'Внизу камеры загрузки') {
      let modalData: AlarmModalData | null = null;

      // Если значение меньше 1000, показываем первую модалку
      if (alarm.value < 1000) {
        modalData = {
          title: 'Температура внизу камеры загрузки (ниже 1000 °C)',
          troubleshootingItems: [
            {
              cause:
                'Недостаточный расход воздуха на догорание газов карбонизации.',
              action:
                'Увеличить частоту вращения вентиляторов (1 и/или 2) подачи воздуха в камеру загрузки.',
            },
            {
              cause: 'Просыпи угля.',
              action:
                'Открыть отверстие с торца печи или включить вентилятор подачи воздуха в камеру загрузки с торца печи.',
            },
          ],
        };
      }
      // Если значение больше 1100, показываем вторую модалку
      else if (alarm.value > 1100) {
        modalData = {
          title: 'Температура внизу камеры загрузки (выше 1100 °C)',
          troubleshootingItems: [
            {
              cause:
                'Подсосы воздуха через сальниковые уплотнения на стыке барабан-камера загрузки.',
              action:
                'Вызвать дежурного слесаря для регулировки сальниковых уплотнений.',
            },
            {
              cause:
                'Повышенный расход воздуха на догорание газов карбонизации.',
              action:
                'Отключить или снизить частоту вращения вентиляторов (1 и/или 2) подачи воздуха в камеру загрузки.',
            },
            {
              cause: 'Просыпи угля и горение сажи.',
              action:
                'Подать пар в камеру загрузки (верх и/или низ). Уменьшить разрежение.',
            },
          ],
        };
      }
      if (modalData) {
        this.dialog.open(AlarmModalComponent, {
          minWidth: '400px',
          maxWidth: '90vw',
          data: modalData,
        });
      }
      return;
    }

    // Для остальных alarm'ов используем существующие данные из alarmData
    const alarmInfo = ALARM_MODAL_DATA[alarm.key];
    if (alarmInfo) {
      this.dialog.open(AlarmModalComponent, {
        minWidth: '400px',
        maxWidth: '90vw',
        data: alarmInfo,
      });
    }
  }
}
