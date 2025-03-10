import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule, KeyValue, KeyValuePipe } from '@angular/common';
import { blinkAnimation } from '../../common/animations/animations';

@Component({
  selector: 'app-general-table',
  standalone: true,
  imports: [CommonModule, KeyValuePipe],
  templateUrl: './general-table.component.html',
  styleUrls: ['./general-table.component.scss'],
  animations: [blinkAnimation],
})
export class GeneralTableComponent implements OnChanges {
  @Input() title: string = ''; // Заголовок таблицы
  @Input() data: Record<string, any> | null = null; // Данные для отображения
  @Input() unit: string = ''; // Единицы измерения (опционально)
  @Input() recommendedValues: Record<string, any> | null = null; // Рекомендуемые значения (опционально)
  @Input() highlightedKeys: Set<string> = new Set(); // Ключи для выделения

  // Новый входной параметр для отключения сортировки.
  // Если true – сортировка отключается, иначе применяется дефолтная сортировка по ключу.
  @Input() disableSorting: boolean = false;

  preparedData: Record<string, any> = {};

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] || changes['recommendedValues']) {
      this.preparedData = this.processData(this.data);
    }
  }

  private processData(data: Record<string, any> | null): Record<string, any> {
    if (!data) return {};

    const result: Record<string, any> = {};
    for (const key in data) {
      const value = data[key];

      // Если значение — объект, преобразуем его в строку
      if (typeof value === 'object' && value !== null) {
        result[key] = this.formatNestedObject(value);
      } else if (value === null || value === undefined || isNaN(value)) {
        result[key] = '—';
      } else {
        result[key] = value;
      }
    }
    return result;
  }

  private formatNestedObject(obj: Record<string, any>): string {
    return obj['value'] ?? '—';
  }

  // Метод для получения рекомендуемого значения
  getRecommendedValue(key: string): string {
    if (!this.recommendedValues || !this.recommendedValues[key]) return '—';
    return this.recommendedValues[key];
  }

  // Метод для проверки, нужно ли выделять значение
  shouldHighlight(key: string): boolean {
    return this.highlightedKeys.has(key);
  }

  // Функция-сравнения для отключения сортировки.
  // Если возвращать 0 для любых двух элементов, порядок исходного объекта сохраняется.
  noSort(a: KeyValue<string, any>, b: KeyValue<string, any>): number {
    return 0;
  }
}
