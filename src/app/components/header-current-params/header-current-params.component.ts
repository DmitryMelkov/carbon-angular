import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-current-params',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-current-params.component.html',
  styleUrls: ['./header-current-params.component.scss'],
})
export class HeaderCurrentParamsComponent implements OnInit {
  @Input() title: string = ''; // Заголовок сушилки
  @Input() currentDate: string = ''; // Текущая дата
  @Input() currentTime: string = ''; // Текущее время

  ngOnInit(): void {
    if (!this.currentDate) {
      const now = new Date();
      this.currentDate = now.toLocaleDateString('ru-RU');
    }
    if (!this.currentTime) {
      const now = new Date();
      this.currentTime = now.toLocaleTimeString('ru-RU');
    }
  }
}
