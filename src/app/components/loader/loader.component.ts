import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-loader',
  imports: [CommonModule, MatProgressSpinnerModule],
  standalone: true,
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
})
export class LoaderComponent implements OnInit {
  @Input() delay: number = 2000; // Задержка отображения прелоудера в миллисекундах
  @Input() loadingText: string = 'Загрузка данных, пожалуйста подождите...';
  @Input() width: string = '100px'; // Ширина прелоадера
  @Input() height: string = '100px'; // Высота прелоадера
  @Input() textColor: string = 'green';
  @Output() loadingComplete = new EventEmitter<void>(); // Сообщение о завершении загрузки

  isVisible: boolean = true;

  ngOnInit(): void {
    setTimeout(() => {
      this.isVisible = false; // Скрываем прелоадер через заданную задержку
      this.loadingComplete.emit(); // Уведомляем родительский компонент, что загрузка завершена
    }, this.delay);
  }
}
