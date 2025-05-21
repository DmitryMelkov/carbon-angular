import { Component } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';

@Component({
  selector: 'app-reactors-press-chart-pressure-general',
  imports: [ControlButtonComponent, UniversalGraphComponent],
  templateUrl: './reactors-press-chart-pressure-general.component.html',
  styleUrl: './reactors-press-chart-pressure-general.component.scss'
})
export class ReactorsPressChartPressureGeneralComponent {
  timeRange: number = 10; // 10 минут по умолчанию
  activeButton: number = 10; // Активная кнопка по умолчанию

  // Идентификатор пресса
  pressId: string = 'press3';

  // URL API для получения данных
  pressApiUrls: string[] = [`${environment.apiUrl}/api/${this.pressId}/data`];

  // Названия параметров для графика давления
  pressParameterNamesList: string[][] = [
    ['Давление масла']
  ];

  // Ключи для доступа к данным в API ответе
  pressDataKeys: string[] = ['termodatData', 'Давление масла'];

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes;
  }
}
