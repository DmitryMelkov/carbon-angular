import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-press-chart-pressure-general',
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
  templateUrl: './press-chart-pressure-general.component.html',
  styleUrls: ['./press-chart-pressure-general.component.scss']
})
export class PressChartPressureGeneralComponent {
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