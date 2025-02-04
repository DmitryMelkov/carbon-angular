import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { AlarmService } from '../../../../common/services/vr/alarm.service';

@Component({
  selector: 'app-siren',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="siren-text" [class.alarm]="alarmActive">
      СИРЕНА
    </div>
  `,
  styleUrls: ['./siren.component.scss']
})
export class SirenComponent implements OnInit, OnDestroy {
  alarmActive: boolean = false;
  private alarmSubscription!: Subscription;

  constructor(private alarmService: AlarmService) {}

  ngOnInit(): void {
    this.alarmSubscription = this.alarmService.alarms$.subscribe(alarms => {
      // Если хотя бы один ключ присутствует – включаем сирену
      this.alarmActive = Object.keys(alarms).length > 0;
    });
  }

  ngOnDestroy(): void {
    this.alarmSubscription?.unsubscribe();
  }
}
