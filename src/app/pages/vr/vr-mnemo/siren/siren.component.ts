import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-siren',
  standalone: true,
  imports: [
      CommonModule,
    ],
  template: `
    <div class="siren-text" [class.alarm]="alarmActive">
      СИРЕНА
    </div>
  `,
  styleUrls: ['./siren.component.scss']
})
export class SirenComponent {
  @Input() alarmActive: boolean = false;
}
