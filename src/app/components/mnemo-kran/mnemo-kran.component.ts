import { CommonModule } from '@angular/common';
import { Component, Input, HostListener, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-mnemo-kran',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './mnemo-kran.component.html',
  styleUrls: ['./mnemo-kran.component.scss'],
})
export class MnemoKranComponent implements OnChanges {
  // Оригинальные размеры, которые передаются извне
  @Input() triangleWidth: number = 20;
  @Input() triangleHeight: number = 17;

  // Опциональные входные параметры для маленького экрана.
  // Если они не переданы, можно задать свои значения по умолчанию
  @Input() triangleWidthSmall: number = 10;
  @Input() triangleHeightSmall: number = 8;

  // Пороговое значение для адаптивности
  @Input() maxWidth: number = 1280;

  @Input() isActive: boolean | undefined = false;

  // Текущие размеры, которые используются в шаблоне.
  // Они вычисляются на основе размера окна.
  currentTriangleWidth: number = this.triangleWidth;
  currentTriangleHeight: number = this.triangleHeight;

  color: string = 'red';

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isActive']) {
      this.color = this.isActive ? 'green' : 'red';
    }

    // Если меняются размеры, пересчитываем текущие значения
    if (
      changes['triangleWidth'] ||
      changes['triangleHeight'] ||
      changes['triangleWidthSmall'] ||
      changes['triangleHeightSmall']
    ) {
      this.updateDimensions();
    }
  }

  // Отслеживаем изменение размера окна
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.updateDimensions();
  }

  private updateDimensions(): void {
    if (window.innerWidth < this.maxWidth) {
      // На маленьких экранах – применяем размеры для маленького экрана
      this.currentTriangleWidth = this.triangleWidthSmall;
      this.currentTriangleHeight = this.triangleHeightSmall;
    } else {
      // На больших экранах – используем переданные размеры
      this.currentTriangleWidth = this.triangleWidth;
      this.currentTriangleHeight = this.triangleHeight;
    }
  }
}
