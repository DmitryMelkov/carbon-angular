import { Component } from '@angular/core';
import { ControlButtonComponent } from '../../../components/control-button/control-button.component';
import { UniversalGraphComponent } from '../../../components/universal-graph.components';
import { environment } from '../../../../environments/environment'; // Импортируем environment

@Component({
  selector: 'app-graphic-reactors-general',
  templateUrl: './reactors-graph-general.component.html',
  styleUrls: ['./reactors-graph-general.component.scss'],
  standalone: true,
  imports: [ControlButtonComponent, UniversalGraphComponent],
})
export class GraphicReactorsGeneralComponent {
  timeRange: number = 10; // Устанавливаем 10 минут по умолчанию
  activeButton: number = 10; // Устанавливаем активную кнопку по умолчанию на 10 минут

  // Уникальные идентификаторы для графиков
  reactorIdTemper: string = 'reactor-temper';
  reactorIdLevel: string = 'reactor-level';

  // Массивы для Смоляных реакторов (температуры)
  apiUrl: string[] = [`${environment.apiUrl}/api/reactor296/data`];
  temperatureParameterNamesList: string[][] = [
    [
      'Температура реактора 45/1',
      'Температура реактора 45/2',
      'Температура реактора 45/3',
      'Температура реактора 45/4',
    ],
  ];

  temperatureCustomNames: string[][] = [
    ['Реактор 45/1', 'Реактор 45/2', 'Реактор 45/3', 'Реактор 45/4'],
  ];

  temperatureDataKeys: string[] = ['temperatures']; // Ключи для данных из API

  // Массивы для Смоляных реакторов (уровни)
  urovenParameterNamesList: string[][] = [
    [
      'Уровень реактора 45/1',
      'Уровень реактора 45/2',
      'Уровень реактора 45/3',
      'Уровень реактора 45/4',
    ],
  ];

  urovenCustomNames: string[][] = [
    ['Реактор 45/1', 'Реактор 45/2', 'Реактор 45/3', 'Реактор 45/4'],
  ];

  urovenUnits: string[] = ['мм'];

  urovenDataKeys: string[] = ['levels']; // Ключи для данных из API

  // Установка временного диапазона
  setTimeRange(minutes: number) {
    this.timeRange = minutes;
    this.activeButton = minutes; // Устанавливаем активную кнопку
  }
}
