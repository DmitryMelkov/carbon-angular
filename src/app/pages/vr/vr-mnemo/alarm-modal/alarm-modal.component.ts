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
  activeItemIndex: number | null = null;

  constructor(
    public dialogRef: MatDialogRef<AlarmModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: AlarmModalData
  ) {}

  close(): void {
    this.dialogRef.close();
  }

  toggleItem(index: number): void {
    this.activeItemIndex = this.activeItemIndex === index ? null : index;
  }

  formatActionText(text: string): string {
    // Если маркер "\\l" присутствует
    if (text.includes('\\l')) {
      // Находим индекс первого вхождения маркера
      const firstMarkerIndex = text.indexOf('\\l');

      // Префикс — текст до маркера (оставляем как обычный текст)
      const prefix = text.substring(0, firstMarkerIndex).trim();

      // Остальная часть — текст, начиная с первого маркера
      const listPart = text.substring(firstMarkerIndex);

      // Разбиваем listPart по маркеру и убираем пустые строки
      const listItems = listPart.split('\\l').filter(item => item.trim() !== '');

      // Формируем HTML:
      // 1. Если есть префикс, заменяем символы новой строки на <br>
      // 2. Формируем список <ul> с элементами <li>
      let formatted = '';
      if (prefix) {
        formatted += prefix.replace(/\n/g, '<br>') + '<br>';
      }
      formatted += `<ul>${listItems.map(item => `<li>${item.trim()}</li>`).join('')}</ul>`;
      return formatted;
    }
    // Если маркер не найден, заменяем переводы строк на <br>
    return text.replace(/\n/g, '<br>');
  }
  
}
