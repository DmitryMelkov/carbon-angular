import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { ModalHeaderComponent } from '../../../../components/modal-header/modal-header.component';

export interface TroubleshootingItem {
  cause: string;
  action: string;
}

export interface AlarmModalData {
  title: string;
  troubleshootingItems: TroubleshootingItem[];
}

@Component({
  selector: 'app-alarm-modal',
  standalone: true,
  imports: [CommonModule, ModalHeaderComponent],
  templateUrl: './alarm-modal.component.html',
  styleUrls: ['./alarm-modal.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class AlarmModalComponent {

  // Индекс выбранного пункта, по умолчанию ни один не выбран
  activeItemIndex: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AlarmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlarmModalData
  ) {}

  // Метод для закрытия модального окна
  close(): void {
    this.dialogRef.close();
  }

  // Метод, который обрабатывает клик по пункту причины.
  // Если кликнули по уже выбранному, сбрасываем выбор, иначе выбираем новый пункт.
  toggleItem(index: number): void {
    this.activeItemIndex = this.activeItemIndex === index ? null : index;
  }
}
