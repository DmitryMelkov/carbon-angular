// param-indicator.component.ts
import { CommonModule } from '@angular/common';
import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ValueCheckService } from '../../../../common/services/vr/value-check.service';
import { ModeVrService } from '../../../../common/services/vr/mode-vr.service';
import { AlarmService } from '../../../../common/services/vr/alarm.service';
import { Subscription } from 'rxjs';
import { recommendedLevels,recommendedPressures,recommendedTemperatures,recommendedVacuums } from '../../../../common/constans/vr-recomended-values';

@Component({
  selector: 'app-param-indicator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <span
      class="mnemo__param-text"
      [ngClass]="{ 'blink-warning': isAlarm(key, value) }"
    >
      {{ value || '—' }} {{ unit }}
    </span>
  `,
  styleUrls: ['../vr-mnemo.component.scss'],
})
export class ParamIndicatorComponent implements OnChanges {
  @Input() key!: string; // Ключ параметра
  @Input() value!: any; // Значение параметра
  @Input() unit!: string;

  constructor(
    private valueCheckService: ValueCheckService,
    private alarmService: AlarmService,
    private modeVrService: ModeVrService
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['value'] && changes['value'].currentValue !== undefined) {
      this.checkAndUpdateAlarm();
    }
  }

  // Проверка выхода за пределы допустимого диапазона
isAlarm(key: string, value: any): boolean {
  const mode = this.modeVrService.getCurrentMode();

  // Если режим "Печь не работает", то сразу возвращаем false и удаляем тревогу
  if (mode === 'Печь не работает') {
    this.alarmService.removeAlarm(key);
    return false;
  }

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
    const isOutOfRange = this.valueCheckService.isOutOfRange(key, value, recommendedValues);

    if (isOutOfRange) {
      this.alarmService.updateAlarm(key, value, this.unit); // Передаем unit
    } else {
      this.alarmService.removeAlarm(key);
    }

    return isOutOfRange;
  }

  return false;
}

  // Метод для проверки и обновления состояния тревоги
  private checkAndUpdateAlarm(): void {
    this.isAlarm(this.key, this.value);
  }
}
