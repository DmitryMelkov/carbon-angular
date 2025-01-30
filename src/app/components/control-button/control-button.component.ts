import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-control-button',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './control-button.component.html',
  styleUrls: ['./control-button.component.scss'],
})
export class ControlButtonComponent {
  @Input() isActive: boolean = false;
  @Input() isDisabled: boolean = false;
  @Output() onClick = new EventEmitter<Event>();
  @Input() borderRadius: string = '0px'; // Добавляем свойство для радиуса
}
