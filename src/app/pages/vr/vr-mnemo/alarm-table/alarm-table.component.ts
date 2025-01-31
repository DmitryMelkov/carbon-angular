import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AlarmService } from '../../../../common/services/vr/alarm.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alarm-table',
  imports: [CommonModule],
  templateUrl: './alarm-table.component.html',
  styleUrls: ['./alarm-table.component.scss'],
})
export class AlarmTableComponent implements OnInit {
  alarms$: Observable<{ key: string; value: any; unit: string }[]>;

  constructor(private alarmService: AlarmService, private cdr: ChangeDetectorRef) {
    this.alarms$ = this.alarmService.alarms$;
  }

  ngOnInit(): void {
    this.alarms$.subscribe(() => {
      this.cdr.detectChanges(); // Принудительное обновление рендера
    });
  }
}
