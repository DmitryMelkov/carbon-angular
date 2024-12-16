import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sushilka-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sushilka-table.component.html',
  styleUrls: ['./sushilka-table.component.scss'],
})
export class SushilkaTableComponent implements OnChanges {
  @Input() title: string = ''; // Заголовок таблицы
  @Input() data: Record<string, any> | null = null; // Данные для отображения
  @Input() unit: string = ''; // Единицы измерения (опционально)

  preparedData: Record<string, any> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data']) {
      this.preparedData = this.processData(this.data);
    }
  }

  private processData(data: Record<string, any> | null): Record<string, any> {
    if (!data) return {};

    const result: Record<string, any> = {};
    for (const key in data) {
      if (data[key] === null || data[key] === undefined || isNaN(data[key])) {
        result[key] = '—';
      } else {
        result[key] = data[key];
      }
    }
    return result;
  }
}
