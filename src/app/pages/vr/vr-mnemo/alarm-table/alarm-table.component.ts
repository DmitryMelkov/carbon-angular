// alarm-table.component.ts
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AlarmService } from '../../../../common/services/vr/alarm.service';

@Component({
  selector: 'app-alarm-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alarm-table.component.html',
  styleUrls: ['./alarm-table.component.scss'],
})
export class AlarmTableComponent implements OnInit {
  alarms: { key: string; value: any }[] = [];

  constructor(private alarmService: AlarmService) {}

  ngOnInit(): void {
    this.alarmService.alarms$.subscribe((alarms) => {
      this.alarms = alarms;
    });
  }
}
