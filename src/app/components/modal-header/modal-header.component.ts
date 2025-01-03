import { Component, Input, Output, EventEmitter } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-modal-header',
  imports: [MatIconModule, MatButtonModule],
  standalone: true,
  templateUrl: './modal-header.component.html',
  styleUrl: './modal-header.component.scss'
})
export class ModalHeaderComponent {
  @Input() title: string = 'Заголовок';
  @Output() close = new EventEmitter<void>();
}
