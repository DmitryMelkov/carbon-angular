import { Component, Input } from '@angular/core';
import { ValueCheckService } from '../../../../common/services/vr/value-check.service';
import {
  recommendedLevels,
  recommendedPressures,
  recommendedTemperatures,
  recommendedVacuums,
} from '../../../../common/constans/vr-recomended-values';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-param-indicator',
  standalone: true,
  imports: [CommonModule], // Добавляем CommonModule
  template: `
    <span
      class="mnemo__param-text"
      [ngClass]="{ 'blink-warning': isAlarm(key, value) }"
    >
      {{ value || '—' }} {{unit}}
    </span>
  `,
  styleUrls: ['../vr-mnemo.component.scss'],
})
export class ParamIndicatorComponent {
  @Input() key!: string; // Ключ параметра
  @Input() value!: any; // Значение параметра
  @Input() unit!: string;

  constructor(private valueCheckService: ValueCheckService) {}

  // Универсальная функция для проверки выхода за пределы допустимого диапазона
  isAlarm(key: string, value: any): boolean {
    let recommendedValues: Record<string, string> | undefined;

    if (key in recommendedTemperatures) {
      recommendedValues = recommendedTemperatures;
    } else if (key in recommendedLevels) {
      recommendedValues = recommendedLevels;
    } else if (key in recommendedPressures) {
      recommendedValues = recommendedPressures;
    } else if (key in recommendedVacuums) {
      recommendedValues = recommendedVacuums;
    }

    if (recommendedValues) {
      return this.valueCheckService.isOutOfRange(key, value, recommendedValues);
    }

    return false;
  }
}
