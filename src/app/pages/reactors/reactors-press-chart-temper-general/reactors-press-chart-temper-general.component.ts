import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-reactors-press-chart-temper-general',
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
  templateUrl: './reactors-press-chart-temper-general.component.html',
  styleUrl: './reactors-press-chart-temper-general.component.scss'
})
export class ReactorsPressChartTemperGeneralComponent {
  timeRange: number = 10; // 10 минут по умолчанию
  activeButton: number = 10; // Активная кнопка по умолчанию

  // Идентификатор пресса
  pressId: string = 'press3';

  // URL API для получения данных
  pressApiUrls: string[] = [`${environment.apiUrl}/api/${this.pressId}/data`];

  // Названия параметров для графика
  pressParameterNamesList: string[][] = [
    ['Температура масла']
  ];

  // Ключи для доступа к данным в API ответе
  pressDataKeys: string[] = ['termodatData', 'Температура масла'];

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes;
  }

}
