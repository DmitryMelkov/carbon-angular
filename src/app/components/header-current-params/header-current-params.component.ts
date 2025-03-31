import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header-current-params',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header-current-params.component.html',
  styleUrls: ['./header-current-params.component.scss'],
})
export class HeaderCurrentParamsComponent implements OnInit, OnDestroy {
  @Input() title: string = ''; // Заголовок сушилки
  @Input() mode: string | null = null; // Режим работы (опционально)
  @Input() notisStatus: string | null = null; // Статус нотиса
  @Input() vrTime: string | null = null; // Время работы VR (новый необязательный пропс)
  currentDate: string = ''; // Текущая дата
  currentTime: string = ''; // Текущее время
  private timer: any; // Переменная для хранения интервала

  ngOnInit(): void {
    this.updateDateTime(); // Обновление времени сразу при инициализации
    this.timer = setInterval(() => this.updateDateTime(), 1000); // Обновляем каждую секунду
  }

  updateDateTime(): void {
    const now = new Date();
    this.currentDate = now.toLocaleDateString('ru-RU');
    this.currentTime = now.toLocaleTimeString('ru-RU');
  }

  ngOnDestroy(): void {
    if (this.timer) {
      clearInterval(this.timer); // Очистка интервала при уничтожении компонента
    }
  }

  getNotisStatusText(status: string): string {
    switch (status) {
      case 'idle':
        return 'Загрузки нет';
      case 'working':
        return 'Идет загрузка';
      default:
        return 'Нет данных';
    }
  }
}
