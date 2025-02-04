import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-control-button',
  imports: [CommonModule, MatIcon],
  standalone: true,
  templateUrl: './control-button.component.html',
  styleUrls: ['./control-button.component.scss'],
})
export class ControlButtonComponent {
  @Input() isActive: boolean = false;
  @Input() isDisabled: boolean = false;
  @Output() onClick = new EventEmitter<Event>();
  @Input() borderRadius: string = '0px'; // Свойство для радиуса
  @Input() iconName: string = 'info '; // Имя материал-иконки
  @Input() iconHeight: string = '24px'; // Высота иконки
  @Input() iconWidth: string = '24px'; // Ширина иконки
  @Input() paddingTop: string = '2px'; // Верхний отступ
  @Input() paddingBottom: string = '2px'; // Нижний отступ
  @Input() paddingLeft: string = '5px'; // Левый отступ
  @Input() paddingRight: string = '5px'; // Правый отступ

  get buttonClass() {
    return {
      'active-button': this.isActive,
      'disabled-button': this.isDisabled,
    };
  }
}
